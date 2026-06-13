import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { MODALITY_BY_ID } from "@/lib/constants/modalities";
import type { ModalityResult } from "@/lib/types";

/**
 * Takes all 15 calculated results and:
 * 1. Writes a warm, personalised paragraph summary for EVERY modality card.
 * 2. Generates the 3 AI-synthesised modalities:
 *    - Shadow Profile (what hides in the light)
 *    - Core Gift (the thread through everything)
 *    - Cosmic Headline (you, in one line)
 * 3. Writes the overall "Common Threads" summary.
 *
 * All in one Claude call to keep latency low.
 */

function buildPassportContext(
  firstName: string | null,
  birth: { date: string; place: string },
  computed: Record<string, ModalityResult>,
  quiz: Record<string, ModalityResult>
): string {
  const name = firstName ?? "this person";
  const lines: string[] = [
    `You are writing for ${name}'s personality passport — a single Claude call that will produce personalised content for all 18 modality cards plus an overall synthesis.`,
    "",
    `## Birth data`,
    `Date: ${birth.date} | Place: ${birth.place}`,
    "",
    `## The 8 birth-data modalities (computed from birth info):`,
  ];

  for (const id of Object.keys(computed)) {
    const r = computed[id];
    const def = MODALITY_BY_ID[id];
    lines.push(`**${def?.name ?? id}**: ${r.headline}`);
    if (r.subline) lines.push(`  → ${r.subline}`);
    if (r.details) {
      // Include key details for context (not all — keep prompt lean)
      const keyDetails = Object.entries(r.details)
        .slice(0, 4)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ");
      if (keyDetails) lines.push(`  Details: ${keyDetails}`);
    }
  }

  lines.push("", `## The 7 quiz-derived modalities:`);

  for (const id of Object.keys(quiz)) {
    const r = quiz[id];
    const def = MODALITY_BY_ID[id];
    lines.push(`**${def?.name ?? id}**: ${r.headline}`);
    if (r.subline) lines.push(`  → ${r.subline}`);
    if (r.details) {
      const keyDetails = Object.entries(r.details)
        .slice(0, 3)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ");
      if (keyDetails) lines.push(`  Details: ${keyDetails}`);
    }
  }

  return lines.join("\n");
}

const PERSONA = `You write for You, Decoded — a personality passport that combines 18 lenses into one beautiful experience. Your voice is:
- Warm but specific. Never generic affirmations. Every sentence should feel like it could only be written for this person.
- Direct. No filler phrases like "It's worth noting that" or "In many ways" or "Ultimately".
- A little poetic but never purple. Think good magazine writing, not self-help copy.
- Honest. You can name tensions, shadows, and contradictions — gently, with care.
- Second person throughout ("you", not "they").
- 2–3 sentences per card summary. No more. Make them count.`;

export interface SynthesisResult {
  cardSummaries: Record<string, string>;
  shadowProfile: ModalityResult;
  coreGift: ModalityResult;
  cosmicHeadline: ModalityResult;
  overallSummary: string;
}

export async function synthesizePassport(
  firstName: string | null,
  birth: { date: string; place: string },
  computed: Record<string, ModalityResult>,
  quiz: Record<string, ModalityResult>
): Promise<SynthesisResult> {
  const passportContext = buildPassportContext(firstName, birth, computed, quiz);
  const name = firstName ?? "you";
  const allModalityIds = [...Object.keys(computed), ...Object.keys(quiz)];

  const prompt = `${PERSONA}

---

${passportContext}

---

## Your tasks

Respond with a single JSON object following EXACTLY this structure (no markdown code fence, pure JSON):

{
  "cardSummaries": {
    ${allModalityIds.map((id) => `"${id}": "2-3 sentence warm paragraph for the ${MODALITY_BY_ID[id]?.name ?? id} card"`).join(",\n    ")}
  },
  "shadowProfile": {
    "headline": "A short evocative name for the shadow (3-6 words, e.g. 'The Capable One Who Hides')",
    "subline": "One line: the core shadow pattern",
    "summary": "3-4 sentences. Name the shadow gently but directly. What is the gift's unexamined side? This should feel like relief, not criticism."
  },
  "coreGift": {
    "headline": "The gift in 3-5 words, named plainly (e.g. 'Holding the room steady')",
    "subline": "One line: how this gift moves through the world",
    "summary": "3 sentences. The single thread that shows up across every system. Name it so plainly that ${name} can stop underestimating it."
  },
  "cosmicHeadline": {
    "headline": "One line — the shareable headline for this person's whole passport (max 12 words)",
    "subline": "A subtitle that earns the headline",
    "summary": "2-3 sentences. The synthesis. What do all 15 results, taken together, say about who ${name} actually is?"
  },
  "overallSummary": "4-5 sentences. The 'Common Threads' synthesis — the 2-3 patterns that appear across multiple systems. Name specific modalities where you see convergence. End with something true and a little surprising. This appears at the top of the passport."
}

Write each summary as if ${name} will read it alone, quietly, on their phone. Make it feel like it was made just for them.`;

  const client = anthropic();
  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Parse JSON (strip any accidental markdown fences)
  const jsonStr = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
  const parsed = JSON.parse(jsonStr) as {
    cardSummaries: Record<string, string>;
    shadowProfile: { headline: string; subline: string; summary: string };
    coreGift: { headline: string; subline: string; summary: string };
    cosmicHeadline: { headline: string; subline: string; summary: string };
    overallSummary: string;
  };

  const shadowProfile: ModalityResult = {
    modalityId: "shadow_profile",
    headline: parsed.shadowProfile.headline,
    subline: parsed.shadowProfile.subline,
    summary: parsed.shadowProfile.summary,
  };

  const coreGift: ModalityResult = {
    modalityId: "core_gift",
    headline: parsed.coreGift.headline,
    subline: parsed.coreGift.subline,
    summary: parsed.coreGift.summary,
  };

  const cosmicHeadline: ModalityResult = {
    modalityId: "cosmic_headline",
    headline: parsed.cosmicHeadline.headline,
    subline: parsed.cosmicHeadline.subline,
    summary: parsed.cosmicHeadline.summary,
  };

  return {
    cardSummaries: parsed.cardSummaries,
    shadowProfile,
    coreGift,
    cosmicHeadline,
    overallSummary: parsed.overallSummary,
  };
}

/**
 * Merges Claude-written summaries into the computed/quiz result maps.
 */
export function mergeSummaries(
  results: Record<string, ModalityResult>,
  summaries: Record<string, string>
): Record<string, ModalityResult> {
  const merged: Record<string, ModalityResult> = {};
  for (const [id, result] of Object.entries(results)) {
    merged[id] = { ...result, summary: summaries[id] ?? result.summary };
  }
  return merged;
}
