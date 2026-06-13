import type { QuizAnswers, ModalityResult } from "@/lib/types";
import { aggregateScores, topN, toPercents } from "./score-helpers";

const LANGUAGES: Record<string, { name: string; description: string; receiving: string; giving: string }> = {
  words: {
    name: "Words of Affirmation",
    description: "Verbal and written expressions — compliments, I love you, recognition of the specific person you see.",
    receiving: "Specific, sincere words that name what you notice",
    giving: "Articulating the things most people leave unsaid",
  },
  acts: {
    name: "Acts of Service",
    description: "Love made practical — doing things that take effort and thought, anticipating needs without being asked.",
    receiving: "Actions that show someone was thinking about what would help you",
    giving: "Practical help, done with care and attention",
  },
  time: {
    name: "Quality Time",
    description: "Undivided, unhurried presence — not just being in the same room, but genuinely being there.",
    receiving: "Full attention, no distractions, being someone's priority in that moment",
    giving: "Being fully present, listening without half-scrolling",
  },
  touch: {
    name: "Physical Touch",
    description: "The warmth of physical contact — a hand on the shoulder, a hug that lingers, casual touch as comfort.",
    receiving: "Warmth through physical presence and contact",
    giving: "Reaching naturally, without self-consciousness",
  },
  gifts: {
    name: "Receiving Gifts",
    description: "Not materialism — the meaning of a considered object. The feeling that someone was thinking of you.",
    receiving: "Objects chosen with thought — the gift says 'I know you'",
    giving: "Finding things that say 'I thought of you when you weren't there'",
  },
};

export function scoreLoveLanguages(answers: QuizAnswers): ModalityResult {
  const s = aggregateScores(answers);
  const dims = ["words", "acts", "time", "touch", "gifts"];
  const langScores: Record<string, number> = {};
  for (const d of dims) langScores[d] = s[d] ?? 0;

  const [primary, secondary] = topN(langScores, 2);
  const pcts = toPercents(langScores, dims);

  const primaryLang = LANGUAGES[primary];
  const secondaryLang = LANGUAGES[secondary];

  return {
    modalityId: "love_languages",
    headline: `${primaryLang.name}${secondaryLang ? ` & ${secondaryLang.name}` : ""}`,
    subline: `Primary: ${pcts[primary]}% · Secondary: ${pcts[secondary]}%`,
    summary: "",
    details: {
      primaryLanguage: primaryLang.name,
      primaryDescription: primaryLang.description,
      primaryReceiving: primaryLang.receiving,
      primaryGiving: primaryLang.giving,
      secondaryLanguage: secondaryLang?.name ?? "—",
      breakdown: dims.map((d) => `${LANGUAGES[d].name}: ${pcts[d]}%`).join(", "),
    },
    scores: pcts,
  };
}
