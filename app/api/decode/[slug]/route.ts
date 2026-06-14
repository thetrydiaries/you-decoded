import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { computeAllBirthModalities } from "@/lib/engine/compute-birth";
import { computeAllQuizModalities } from "@/lib/engine/compute-quiz";
import { synthesizePassport, mergeSummaries } from "@/lib/claude/synthesize";
import type { BirthData, QuizAnswers } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * GET — fast status check only. Called every 4s by DecodingPoller.
 * Never runs Claude. Returns in < 500ms.
 */
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("passports")
    .select("status, updated_at")
    .eq("share_slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (data.status === "complete") return NextResponse.json({ status: "complete" });
  if (data.status === "error") return NextResponse.json({ status: "error" });

  // If stuck in "processing" for >2 minutes the decode Lambda was killed without
  // cleanup — reset to error so the user can retry rather than spinning forever.
  if (data.status === "processing") {
    const ageMs = Date.now() - new Date(data.updated_at).getTime();
    if (ageMs > 2 * 60 * 1000) {
      await db
        .from("passports")
        .update({ status: "error" })
        .eq("share_slug", slug)
        .eq("status", "processing");
      return NextResponse.json({ status: "error" });
    }
  }

  return NextResponse.json({ status: "pending" });
}

/**
 * POST — runs the full decode pipeline (~40-50s).
 * DecodingPoller fires this once without awaiting the response.
 * Vercel keeps the Lambda alive until it returns, even if the browser
 * disconnects, so the DB always gets updated to complete/error.
 */
export async function POST(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const db = supabaseAdmin();

  const { data: passport, error } = await db
    .from("passports")
    .select("*")
    .eq("share_slug", slug)
    .single();

  if (error || !passport) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (passport.status === "complete" || passport.status === "error") {
    return NextResponse.json({ status: passport.status });
  }

  if (passport.status === "processing") {
    return NextResponse.json({ status: "pending" });
  }

  if (passport.status !== "decoding") {
    return NextResponse.json({ error: "Not ready" }, { status: 400 });
  }

  // Atomic lock — only one Vercel instance wins this UPDATE.
  // Concurrent POSTs (extra tabs, reloads) see 0 rows and return early.
  const { data: locked } = await db
    .from("passports")
    .update({ status: "processing" })
    .eq("share_slug", slug)
    .eq("status", "decoding")
    .select("id");

  if (!locked || locked.length === 0) {
    return NextResponse.json({ status: "pending" });
  }

  try {
    const birth: BirthData = {
      date: passport.birth_date,
      time: passport.birth_time ?? null,
      place: passport.birth_place,
      lat: passport.birth_lat ?? null,
      lng: passport.birth_lng ?? null,
      timezone: passport.birth_tz ?? null,
    };
    const quizAnswers: QuizAnswers = passport.quiz_answers ?? {};

    const [computedResults, quizResults] = await Promise.all([
      computeAllBirthModalities(birth),
      computeAllQuizModalities(quizAnswers),
    ]);

    const synthesis = await synthesizePassport(
      passport.first_name ?? null,
      { date: birth.date, place: birth.place },
      computedResults,
      quizResults
    );

    const finalComputed = mergeSummaries(computedResults, synthesis.cardSummaries);
    const finalQuiz = mergeSummaries(quizResults, synthesis.cardSummaries);
    const aiResults = {
      shadow_profile: synthesis.shadowProfile,
      core_gift: synthesis.coreGift,
      cosmic_headline: synthesis.cosmicHeadline,
    };

    const { error: updateError } = await db
      .from("passports")
      .update({
        computed_results: finalComputed,
        quiz_results: finalQuiz,
        ai_results: aiResults,
        overall_summary: synthesis.overallSummary,
        status: "complete",
      })
      .eq("share_slug", slug);

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ status: "complete" });
  } catch (err) {
    console.error("Decode error:", err);
    const { error: statusError } = await db
      .from("passports")
      .update({ status: "error" })
      .eq("share_slug", slug);
    if (statusError) console.error("Failed to set error status:", statusError);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
