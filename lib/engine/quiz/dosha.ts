import type { QuizAnswers, ModalityResult } from "@/lib/types";
import { aggregateScores, topKey, toPercents } from "./score-helpers";

const DOSHAS: Record<string, { name: string; element: string; qualities: string; balance: string; imbalance: string; nourish: string }> = {
  vata: {
    name: "Vata",
    element: "Air & Space",
    qualities: "light, dry, mobile, cold, irregular",
    balance: "Creative, enthusiastic, quick to learn, full of ideas, adaptable",
    imbalance: "Anxious, scattered, sleepless, cold, ungrounded",
    nourish: "Warmth, routine, grounding foods, stillness, oil massage",
  },
  pitta: {
    name: "Pitta",
    element: "Fire & Water",
    qualities: "hot, sharp, light, oily, intense",
    balance: "Focused, intelligent, decisive, courageous, organised",
    imbalance: "Irritable, inflammatory, critical, overworked, burnt out",
    nourish: "Cooling foods, rest, nature, less competition, sweet relationships",
  },
  kapha: {
    name: "Kapha",
    element: "Earth & Water",
    qualities: "heavy, slow, cool, oily, steady",
    balance: "Calm, loyal, nurturing, grounded, enduring stamina",
    imbalance: "Lethargic, withdrawn, resistant to change, possessive",
    nourish: "Movement, stimulation, lighter foods, new experiences, warmth",
  },
};

export function scoreDosha(answers: QuizAnswers): ModalityResult {
  const s = aggregateScores(answers);
  const dims = ["vata", "pitta", "kapha"];
  const doshaScores: Record<string, number> = {};
  for (const d of dims) doshaScores[d] = s[d] ?? 0;

  const primaryKey = topKey(doshaScores);
  const pcts = toPercents(doshaScores, dims);

  // Secondary
  const sorted = dims.slice().sort((a, b) => (doshaScores[b] ?? 0) - (doshaScores[a] ?? 0));
  const secondary = sorted[1];

  const primary = DOSHAS[primaryKey];
  const isDualDominant = Math.abs((doshaScores[primaryKey] ?? 0) - (doshaScores[secondary] ?? 0)) <= 1;

  const headline = isDualDominant
    ? `${DOSHAS[primaryKey].name}-${DOSHAS[secondary].name}`
    : `${primary.name}`;

  return {
    modalityId: "dosha",
    headline,
    subline: `${primary.element} · ${pcts.vata}% Vata · ${pcts.pitta}% Pitta · ${pcts.kapha}% Kapha`,
    summary: "",
    details: {
      primaryDosha: primary.name,
      element: primary.element,
      qualities: primary.qualities,
      inBalance: primary.balance,
      outOfBalance: primary.imbalance,
      howToNourish: primary.nourish,
      doshaBreakdown: `Vata ${pcts.vata}% · Pitta ${pcts.pitta}% · Kapha ${pcts.kapha}%`,
    },
    scores: pcts,
  };
}
