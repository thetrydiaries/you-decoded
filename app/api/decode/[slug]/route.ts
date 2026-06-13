import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { computeAllBirthModalities } from "@/lib/engine/compute-birth";
import { computeAllQuizModalities } from "@/lib/engine/compute-quiz";
import { synthesizePassport, mergeSummaries } from "@/lib/claude/synthesize";
import type { BirthData, QuizAnswers } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Fires before maxDuration so the catch block always runs and sets status="error"
// rather than leaving the passport stuck in "processing" if Vercel hard-kills the function.
const DECODE_TIMEOUT_MS = 50_000;

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

  // Another Vercel instance already claimed this decode — keep polling
  if (passport.status === "processing") {
    return NextResponse.json({ status: "pending" });
  }

  if (passport.status !== "decoding") {
    return NextResponse.json({ error: "Passport not ready for decoding" }, { status: 400 });
  }

  // Atomic DB-level lock: transition decoding → processing.
  // Because Vercel spins up a new serverless instance per request, the previous
  // in-memory Set did nothing for concurrent tabs/reloads. This UPDATE only
  // succeeds for one instance — the others find 0 rows updated and bail.
  const { data: locked } = await db
    .from("passports")
    .update({ status: "processing" })
    .eq("share_slug", slug)
    .eq("status", "decoding")
    .select("id");

  if (!locked || locked.length === 0) {
    // A concurrent instance beat us — it will handle the decode
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

    await Promise.race([
      runDecode(slug, db, birth, quizAnswers, passport.first_name ?? null),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Decode timed out after ${DECODE_TIMEOUT_MS / 1000}s`)),
          DECODE_TIMEOUT_MS
        )
      ),
    ]);

    return NextResponse.json({ status: "complete" });
  } catch (err) {
    console.error("Decode pipeline error:", err);

    await db
      .from("passports")
      .update({ status: "error" })
      .eq("share_slug", slug)
      .catch((e: unknown) => console.error("Failed to set error status:", e));

    return NextResponse.json(
      { error: "Decode failed", detail: String(err) },
      { status: 500 }
    );
  }
}

async function runDecode(
  slug: string,
  db: ReturnType<typeof supabaseAdmin>,
  birth: BirthData,
  quizAnswers: QuizAnswers,
  firstName: string | null
) {
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

  if (updateError) {
    console.error("Supabase update error:", updateError);
    throw new Error("Failed to save results");
  }
}
