import type { QuizAnswers, ModalityResult } from "@/lib/types";
import { scoreMBTI } from "./quiz/mbti";
import { scoreBigFive } from "./quiz/big-five";
import { scoreEnneagram } from "./quiz/enneagram";
import { scoreAttachment } from "./quiz/attachment";
import { scoreLoveLanguages } from "./quiz/love-languages";
import { scoreDosha } from "./quiz/dosha";
import { scoreJungian } from "./quiz/jungian";

export async function computeAllQuizModalities(
  answers: QuizAnswers
): Promise<Record<string, ModalityResult>> {
  const results: Record<string, ModalityResult> = {};

  const scorers = [
    scoreMBTI,
    scoreBigFive,
    scoreEnneagram,
    scoreAttachment,
    scoreLoveLanguages,
    scoreDosha,
    scoreJungian,
  ];

  for (const scorer of scorers) {
    try {
      const result = scorer(answers);
      results[result.modalityId] = result;
    } catch (err) {
      console.error(`Quiz scorer failed:`, err);
    }
  }

  return results;
}
