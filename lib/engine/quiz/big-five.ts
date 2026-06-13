import type { QuizAnswers, ModalityResult } from "@/lib/types";
import { aggregateScores } from "./score-helpers";

/** Max raw score per trait (sum of max values across questions that score it). */
const MAX_RAW: Record<string, number> = { O: 18, C: 12, E: 8, A: 10, N: 8 };

function toPercentile(raw: number, max: number): number {
  const clamped = Math.max(-max, Math.min(max, raw));
  return Math.round(((clamped + max) / (2 * max)) * 100);
}

function traitLabel(pct: number, low: string, high: string): string {
  if (pct >= 75) return `Very ${high}`;
  if (pct >= 60) return high;
  if (pct >= 40) return `Moderate`;
  if (pct >= 25) return low;
  return `Very ${low}`;
}

export function scoreBigFive(answers: QuizAnswers): ModalityResult {
  const s = aggregateScores(answers);

  const O = toPercentile(s.O ?? 0, MAX_RAW.O);
  const C = toPercentile(s.C ?? 0, MAX_RAW.C);
  const E = toPercentile(s.E ?? 0, MAX_RAW.E);
  const A = toPercentile(s.A ?? 0, MAX_RAW.A);
  const N = toPercentile(s.N ?? 0, MAX_RAW.N);

  // Natural-language headline: top 2 traits
  const traitValues = [
    { label: "Openness", pct: O, dir: O > 50 ? "high" : "low" },
    { label: "Conscientiousness", pct: C, dir: C > 50 ? "high" : "low" },
    { label: "Extraversion", pct: E, dir: E > 50 ? "high" : "low" },
    { label: "Agreeableness", pct: A, dir: A > 50 ? "high" : "low" },
    { label: "Stability", pct: 100 - N, dir: N < 50 ? "high" : "low" }, // invert N for positivity
  ];
  const topTwo = [...traitValues].sort((a, b) => Math.abs(b.pct - 50) - Math.abs(a.pct - 50)).slice(0, 2);
  const headline = topTwo.map((t) => `${traitLabel(t.pct, "Low", "High")} ${t.label}`).join(" · ");

  return {
    modalityId: "big_five",
    headline,
    subline: `O: ${O}% · C: ${C}% · E: ${E}% · A: ${A}% · N: ${N}%`,
    summary: "",
    details: {
      openness: `${O}% — ${traitLabel(O, "Conventional", "Open")}`,
      conscientiousness: `${C}% — ${traitLabel(C, "Flexible", "Conscientious")}`,
      extraversion: `${E}% — ${traitLabel(E, "Introverted", "Extraverted")}`,
      agreeableness: `${A}% — ${traitLabel(A, "Challenging", "Agreeable")}`,
      neuroticism: `${N}% — ${traitLabel(N, "Stable", "Sensitive")}`,
      summary_note: "Percentile scores from your quiz answers; not a clinical assessment.",
    },
    scores: { O, C, E, A, N },
  };
}
