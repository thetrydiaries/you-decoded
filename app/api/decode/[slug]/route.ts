import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { computeAllBirthModalities } from "@/lib/engine/compute-birth";
import { computeAllQuizModalities } from "@/lib/engine/compute-quiz";
import { synthesizePassport, mergeSummaries } from "@/lib/claude/synthesize";
import type { BirthData, QuizAnswers } from "@/lib/types";

export const maxDuration = 60; // Vercel function timeout (seconds)
export const dynamic = "force-dynamic"; // Never cache — each call must hit Supabase fresh

/**
 * In-memory lock: tracks slugs currently being decoded.
 * Prevents concurrent Claude calls for the same passport if the poller
 * fires multiple times (e.g., multiple tabs open, rapid reloads).
 * Note: this works within a single server process. For multi-instance
 * Vercel deployments, replace with a DB-level lock (see DB schema note).
 */
const activeDecodes = new Set<string>();

/**
 * GET /api/decode/[slug]
 *
 * Triggered by the results page DecodingPoller when a passport
 * has status = 'decoding'. Orchestrates the full decode pipeline:
 *
 *  1. Fetch passport from Supabase
 *  2. Compute 8 birth-data modalities
 *  3. Compute 7 quiz modalities
 *  4. Send everything to Claude for synthesis (summaries + AI modalities)
 *  5. Write completed results back to Supabase
 *  6. Return { status: 'complete' }
 *
 * Idempotent: returns immediately if already complete or already in progress.
 */
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const db = supabaseAdmin();

  // Fetch passport
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

  if (passport.status !== "decoding") {
    return NextResponse.json({ error: "Passport not ready for decoding" }, { status: 400 });
  }

  // In-memory lock: if already decoding this slug in this process, return pending
  if (activeDecodes.has(slug)) {
    return NextResponse.json({ status: "pending" });
  }

  activeDecodes.add(slug);

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

    // Step 1: Compute birth-data modalities
    const computedResults = await computeAllBirthModalities(birth);

    // Step 2: Compute quiz modalities
    const quizResults = await computeAllQuizModalities(quizAnswers);

    // Step 3: Claude synthesis
    const synthesis = await synthesizePassport(
      passport.first_name ?? null,
      { date: birth.date, place: birth.place },
      computedResults,
      quizResults
    );

    // Step 4: Merge Claude summaries into results
    const finalComputed = mergeSummaries(computedResults, synthesis.cardSummaries);
    const finalQuiz = mergeSummaries(quizResults, synthesis.cardSummaries);
    const aiResults = {
      shadow_profile: synthesis.shadowProfile,
      core_gift: synthesis.coreGift,
      cosmic_headline: synthesis.cosmicHeadline,
    };

    // Step 5: Persist to Supabase
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
      return NextResponse.json({ error: "Failed to save results" }, { status: 500 });
    }

    return NextResponse.json({ status: "complete" });
  } catch (err) {
    console.error("Decode pipeline error:", err);

    // Mark as error in DB so repeated page reloads don't spawn new Claude calls.
    // The user will see an error state with a "start over" prompt.
    await db
      .from("passports")
      .update({ status: "error" })
      .eq("share_slug", slug)
      .catch((e) => console.error("Failed to set error status:", e));

    return NextResponse.json(
      { error: "Decode failed", detail: String(err) },
      { status: 500 }
    );
  } finally {
    activeDecodes.delete(slug);
  }
}
