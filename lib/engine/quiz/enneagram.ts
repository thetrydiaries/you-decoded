import type { QuizAnswers, ModalityResult } from "@/lib/types";
import { aggregateScores, topKey } from "./score-helpers";

const TYPES: Record<string, { name: string; motivation: string; fear: string; tagline: string }> = {
  e1: { name: "The Perfectionist", motivation: "To be good, ethical, and right",          fear: "Being corrupt or fundamentally flawed", tagline: "principled, purposeful, self-controlled" },
  e2: { name: "The Helper",        motivation: "To be needed and to give love",            fear: "Being unloved or unwanted",            tagline: "caring, generous, people-pleasing" },
  e3: { name: "The Achiever",      motivation: "To be successful and admired",            fear: "Being worthless or a failure",         tagline: "driven, adaptable, image-conscious" },
  e4: { name: "The Individualist", motivation: "To be authentic and uniquely significant", fear: "Having no identity or significance",   tagline: "expressive, dramatic, self-absorbed" },
  e5: { name: "The Investigator",  motivation: "To understand and be capable",            fear: "Being overwhelmed or incompetent",     tagline: "perceptive, private, innovative" },
  e6: { name: "The Loyalist",      motivation: "To be secure and supported",              fear: "Being without support or guidance",    tagline: "committed, security-seeking, anxious" },
  e7: { name: "The Enthusiast",    motivation: "To be free and satisfied",                fear: "Being trapped or deprived",            tagline: "spontaneous, versatile, scattered" },
  e8: { name: "The Challenger",    motivation: "To be strong and in control",             fear: "Being controlled or violated",         tagline: "powerful, decisive, confrontational" },
  e9: { name: "The Peacemaker",    motivation: "To have peace and harmony",               fear: "Conflict and disconnection",           tagline: "receptive, reassuring, complacent" },
};

// Wings: adjacent types
const WINGS: Record<string, [string, string]> = {
  e1: ["e9", "e2"],
  e2: ["e1", "e3"],
  e3: ["e2", "e4"],
  e4: ["e3", "e5"],
  e5: ["e4", "e6"],
  e6: ["e5", "e7"],
  e7: ["e6", "e8"],
  e8: ["e7", "e9"],
  e9: ["e8", "e1"],
};

export function scoreEnneagram(answers: QuizAnswers): ModalityResult {
  const s = aggregateScores(answers);
  const typeScores: Record<string, number> = {};
  for (let i = 1; i <= 9; i++) {
    typeScores[`e${i}`] = s[`e${i}`] ?? 0;
  }

  // Top type
  const primaryKey = topKey(typeScores);
  const typeNum = parseInt(primaryKey.replace("e", ""), 10);
  const primary = TYPES[primaryKey];

  // Wing: higher-scoring of the two adjacent types
  const [wingA, wingB] = WINGS[primaryKey];
  const wing = (typeScores[wingA] ?? 0) >= (typeScores[wingB] ?? 0) ? wingA : wingB;
  const wingNum = parseInt(wing.replace("e", ""), 10);

  // Integration/disintegration lines (standard enneagram)
  const INTEGRATION: Record<number, number> = { 1: 7, 2: 4, 3: 6, 4: 1, 5: 8, 6: 9, 7: 5, 8: 2, 9: 3 };
  const integratesTo = INTEGRATION[typeNum];

  const headline = `Type ${typeNum}w${wingNum} — ${primary.name}`;

  return {
    modalityId: "enneagram",
    headline,
    subline: primary.tagline,
    summary: "",
    details: {
      type: `${typeNum}`,
      typeName: primary.name,
      wing: `w${wingNum}`,
      coreMotivation: primary.motivation,
      coreFear: primary.fear,
      integratesTo: `Type ${integratesTo} — ${TYPES[`e${integratesTo}`]?.name ?? ""}`,
      typeScores: Object.entries(typeScores)
        .map(([k, v]) => `${k.replace("e", "T")}: ${v}`)
        .join(", "),
    },
    scores: typeScores,
  };
}
