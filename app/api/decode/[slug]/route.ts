import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { supabaseAdmin } from "@/lib/supabase/server";
import { computeAllBirthModalities } from "@/lib/engine/compute-birth";
import { computeAllQuizModalities } from "@/lib/engine/compute-quiz";
import { synthesizePassport, mergeSummaries } from "@/lib/claude/synthesize";
import type { BirthData, QuizAnswers } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(
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
    return NextResponse.json({ error: "Passport not found" }, { status: 404 });
  }

  if (passport.status === "complete") {
    return NextResponse.json({ status: "complete" });
  }

  if (passport.status === "error") {
    return NextResponse.json({ status: "error" });
  }

  // Another instance already claimed the decode — fast poll back
  if (passport.status === "processing") {
    return NextResponse.json({ status: "pending" });
  }

  if (passport.status !== "decoding") {
    return NextResponse.json({ error: "Passport not ready for decoding" }, { status: 400 });
  }

  // Atomic DB-level lock: only one Vercel instance wins this UPDATE.
  // Every concurrent tab / reload / instance that loses the race finds
  // 0 rows updated and returns "pending" — no duplicate Claude calls.
  const { data: locked } = await db
    .from("passports")
    .update({ status: "processing" })
    .eq("share_slug", slug)
    .eq("status", "decoding")
    .select("id");

  if (!locked || locked.length === 0) {
    return NextResponse.json({ status: "pending" });
  }

  const birth: BirthData = {
    date: passport.birth_date,
    time: passport.birth_time ?? null,
    place: passport.birth_place,
    lat: passport.birth_lat ?? null,
    lng: passport.birth_lng ?? null,
    timezone: passport.birth_tz ?? null,
  };
  const quizAnswers: QuizAnswers = passport.quiz_answers ?? {};

  // Run the decode in the background — the response returns immediately so the
  // client never waits 40-50s for the first poll. Vercel keeps the function alive
  // (up to maxDuration) while waitUntil finishes, then tears it down cleanly.
  waitUntil(
    runDecodeWithCleanup(slug, db, birth, quizAnswers, passport.first_name ?? null)
  );

  // Return immediately — the poller will pick up "complete" within 4s of it finishing
  return NextResponse.json({ status: "pending" });
}

async function runDecodeWithCleanup(
  slug: string,
  db: ReturnType<typeof supabaseAdmin>,
  birth: BirthData,
  quizAnswers: QuizAnswers,
  firstName: string | null
) {
  try {
    const computedResults = await computeAllBirthModalities(birth);
    const quizResults = await computeAllQuizModalities(quizAnswers);

    const synthesis = await synthesizePassport(
      firstName,
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

    if (updateError) throw new Error(`Supabase update failed: ${updateError.message}`);
  } catch (err) {
    console.error("Decode pipeline error:", err);
    const { error: statusError } = await db
      .from("passports")
      .update({ status: "error" })
      .eq("share_slug", slug);
    if (statusError) console.error("Failed to set error status:", statusError);
  }
}
