import type { BirthData, ModalityResult } from "@/lib/types";
import { computeWesternAstrology } from "./birth/western-astrology";
import { computeChineseZodiac } from "./birth/chinese-zodiac";
import { computeNumerology } from "./birth/numerology";
import { computeBazi } from "./birth/bazi";
import { computeHumanDesign } from "./birth/human-design";
import { computeDestinyMatrix } from "./birth/destiny-matrix";
import { computeMayanTzolkin } from "./birth/mayan-tzolkin";
import { computeTarotBirthCards } from "./birth/tarot-birth-cards";

export async function computeAllBirthModalities(
  birth: BirthData
): Promise<Record<string, ModalityResult>> {
  const results: Record<string, ModalityResult> = {};

  const calculators = [
    computeWesternAstrology,
    computeChineseZodiac,
    computeNumerology,
    computeBazi,
    computeHumanDesign,
    computeDestinyMatrix,
    computeMayanTzolkin,
    computeTarotBirthCards,
  ];

  for (const calc of calculators) {
    try {
      const result = calc(birth);
      results[result.modalityId] = result;
    } catch (err) {
      console.error(`Birth calculator failed:`, err);
      // Degrade gracefully — other modalities still show
    }
  }

  return results;
}
