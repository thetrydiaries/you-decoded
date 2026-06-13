import { QUESTIONS } from "@/lib/constants/questions";
import type { QuizAnswers } from "@/lib/types";

/**
 * Aggregate quiz scores across all dimensions.
 * Returns a flat map of dimension → total raw score.
 */
export function aggregateScores(answers: QuizAnswers): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const question of QUESTIONS) {
    const selectedOptionId = answers[question.id] as string | undefined;
    if (!selectedOptionId) continue;
    const option = question.options.find((o) => o.id === selectedOptionId);
    if (!option?.scores) continue;

    for (const [dim, val] of Object.entries(option.scores)) {
      totals[dim] = (totals[dim] ?? 0) + val;
    }
  }

  return totals;
}

/** Returns the key with the highest value from a map. */
export function topKey(map: Record<string, number>): string {
  return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

/** Returns the top N keys sorted descending by value. */
export function topN(map: Record<string, number>, n: number): string[] {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

/** Normalize a set of keys to 0–100 percentages summing to 100. */
export function toPercents(
  map: Record<string, number>,
  keys: string[]
): Record<string, number> {
  const values = keys.map((k) => Math.max(0, map[k] ?? 0));
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const out: Record<string, number> = {};
  keys.forEach((k, i) => {
    out[k] = Math.round((values[i] / total) * 100);
  });
  return out;
}
