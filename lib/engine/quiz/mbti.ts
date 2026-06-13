import type { QuizAnswers, ModalityResult } from "@/lib/types";
import { aggregateScores } from "./score-helpers";

const TYPE_DESCRIPTIONS: Record<string, { name: string; tagline: string }> = {
  INTJ: { name: "The Architect",    tagline: "Independent, strategic, decisive visionary" },
  INTP: { name: "The Thinker",      tagline: "Logical, inventive, endlessly curious" },
  ENTJ: { name: "The Commander",    tagline: "Bold, efficient, natural-born leader" },
  ENTP: { name: "The Debater",      tagline: "Quick-witted, original, intellectually restless" },
  INFJ: { name: "The Advocate",     tagline: "Insightful, principled, quietly determined" },
  INFP: { name: "The Mediator",     tagline: "Idealistic, empathic, guided by inner values" },
  ENFJ: { name: "The Protagonist",  tagline: "Charismatic, inspiring, devoted to others" },
  ENFP: { name: "The Campaigner",   tagline: "Enthusiastic, creative, endlessly connection-seeking" },
  ISTJ: { name: "The Logistician",  tagline: "Reliable, practical, honour-bound" },
  ISFJ: { name: "The Defender",     tagline: "Devoted, warm, attentive to others' needs" },
  ESTJ: { name: "The Executive",    tagline: "Organised, responsible, natural administrator" },
  ESFJ: { name: "The Consul",       tagline: "Caring, social, keenly attuned to community" },
  ISTP: { name: "The Virtuoso",     tagline: "Observant, practical, masters of tools and systems" },
  ISFP: { name: "The Adventurer",   tagline: "Gentle, artistic, spontaneously alive" },
  ESTP: { name: "The Entrepreneur", tagline: "Energetic, perceptive, action-oriented" },
  ESFP: { name: "The Entertainer",  tagline: "Spontaneous, exuberant, joy-generating" },
};

// Cognitive function stacks (conscious pair) for the "find out more" section
const FUNCTION_STACK: Record<string, string> = {
  INTJ: "Ni, Te, Fi, Se",
  INTP: "Ti, Ne, Si, Fe",
  ENTJ: "Te, Ni, Se, Fi",
  ENTP: "Ne, Ti, Fe, Si",
  INFJ: "Ni, Fe, Ti, Se",
  INFP: "Fi, Ne, Si, Te",
  ENFJ: "Fe, Ni, Se, Ti",
  ENFP: "Ne, Fi, Te, Si",
  ISTJ: "Si, Te, Fi, Ne",
  ISFJ: "Si, Fe, Ti, Ne",
  ESTJ: "Te, Si, Ne, Fi",
  ESFJ: "Fe, Si, Ne, Ti",
  ISTP: "Ti, Se, Ni, Fe",
  ISFP: "Fi, Se, Ni, Te",
  ESTP: "Se, Ti, Fe, Ni",
  ESFP: "Se, Fi, Te, Ni",
};

export function scoreMBTI(answers: QuizAnswers): ModalityResult {
  const s = aggregateScores(answers);

  const E = (s.ei ?? 0) > 0 ? "E" : "I";
  const N = (s.ns ?? 0) > 0 ? "N" : "S";
  const T = (s.tf ?? 0) > 0 ? "T" : "F";
  const J = (s.jp ?? 0) > 0 ? "J" : "P";

  const mbti = `${E}${N}${T}${J}`;
  const desc = TYPE_DESCRIPTIONS[mbti] ?? { name: "The Explorer", tagline: "Unique, multifaceted" };

  // Clarity scores (how strongly each preference was expressed)
  const eiStrength = Math.min(100, Math.abs(s.ei ?? 0) * 15);
  const nsStrength = Math.min(100, Math.abs(s.ns ?? 0) * 15);
  const tfStrength = Math.min(100, Math.abs(s.tf ?? 0) * 15);
  const jpStrength = Math.min(100, Math.abs(s.jp ?? 0) * 15);

  return {
    modalityId: "mbti",
    headline: `${mbti} — ${desc.name}`,
    subline: desc.tagline,
    summary: "",
    details: {
      type: mbti,
      typeName: desc.name,
      tagline: desc.tagline,
      eiPreference: `${E} (${E === "E" ? "Extraverted" : "Introverted"}, ${eiStrength}% clear)`,
      nsPreference: `${N} (${N === "N" ? "Intuitive" : "Sensing"}, ${nsStrength}% clear)`,
      tfPreference: `${T} (${T === "T" ? "Thinking" : "Feeling"}, ${tfStrength}% clear)`,
      jpPreference: `${J} (${J === "J" ? "Judging" : "Perceiving"}, ${jpStrength}% clear)`,
      cognitiveFunctions: FUNCTION_STACK[mbti] ?? "—",
    },
    scores: {
      eiRaw: s.ei ?? 0,
      nsRaw: s.ns ?? 0,
      tfRaw: s.tf ?? 0,
      jpRaw: s.jp ?? 0,
    },
  };
}
