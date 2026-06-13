import type { QuizAnswers, ModalityResult } from "@/lib/types";
import { aggregateScores, topKey, toPercents } from "./score-helpers";

const STYLES: Record<string, { name: string; description: string; gift: string; challenge: string }> = {
  secure: {
    name: "Secure",
    description: "Comfortable with closeness and autonomy. Trusts that love doesn't disappear when it isn't visible.",
    gift: "The rare ability to be fully present in relationship without losing yourself",
    challenge: "Others may not match your capacity for ease — patience with their process",
  },
  anxious: {
    name: "Anxious",
    description: "Craves closeness and fears losing it. The attachment system runs hot — attuned to every signal.",
    gift: "Deep attunement, fierce loyalty, and a love that takes the other seriously",
    challenge: "Distinguishing between real threats and the mind's pattern-matching",
  },
  avoidant: {
    name: "Avoidant",
    description: "Prizes independence; intimacy can feel threatening to the sense of self.",
    gift: "Self-sufficiency, clarity about needs, ability to hold space without merger",
    challenge: "Letting people in without fearing the loss of self",
  },
  disorganized: {
    name: "Fearful Avoidant",
    description: "Pulled toward connection and simultaneously afraid of it — the push-pull pattern.",
    gift: "Extraordinary depth of feeling and a hard-won understanding of the full range of attachment",
    challenge: "Learning that closeness and safety can coexist — usually through therapeutic work",
  },
};

export function scoreAttachment(answers: QuizAnswers): ModalityResult {
  const s = aggregateScores(answers);
  const dims = ["secure", "anxious", "avoidant", "disorganized"];
  const styleScores: Record<string, number> = {};
  for (const d of dims) styleScores[d] = s[d] ?? 0;

  const primaryKey = topKey(styleScores);
  const pcts = toPercents(styleScores, dims);
  const style = STYLES[primaryKey];

  return {
    modalityId: "attachment",
    headline: `${style.name} Attachment`,
    subline: `Secure ${pcts.secure}% · Anxious ${pcts.anxious}% · Avoidant ${pcts.avoidant}% · Fearful ${pcts.disorganized}%`,
    summary: "",
    details: {
      primaryStyle: style.name,
      description: style.description,
      gift: style.gift,
      challenge: style.challenge,
      secureScore: `${pcts.secure}%`,
      anxiousScore: `${pcts.anxious}%`,
      avoidantScore: `${pcts.avoidant}%`,
      fearfulScore: `${pcts.disorganized}%`,
    },
    scores: pcts,
  };
}
