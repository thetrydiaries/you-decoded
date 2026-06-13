/**
 * Core domain types for You, Decoded.
 *
 * A Passport is one person's complete reading:
 *  - birth data (intake step 1)
 *  - quiz answers (intake step 2)
 *  - results in three buckets: computed (from birth data),
 *    quiz-derived, and AI-synthesized.
 */

export type ModalitySource = "birth" | "quiz" | "ai";

export interface ModalityDef {
  /** stable key, used in result JSON and card routing */
  id: string;
  name: string;
  /** short tagline shown under the card title */
  tagline: string;
  source: ModalitySource;
  /** one-line description of what this system claims to map */
  about: string;
}

/** One decoded result for one modality. */
export interface ModalityResult {
  modalityId: string;
  /** The bold headline result, e.g. "INFJ — The Advocate" or "Life Path 7" */
  headline: string;
  /** Short sub-result, e.g. "Introverted · Intuitive · Feeling · Judging" */
  subline?: string;
  /** Warm, personalised paragraph (AI-written for all cards) */
  summary: string;
  /** Structured details for the "find out more" expansion */
  details?: Record<string, string | number | string[]>;
  /** Raw scores where applicable (Big Five percentiles, dosha balance, etc.) */
  scores?: Record<string, number>;
}

export interface BirthData {
  date: string; // ISO date "1995-06-13"
  time: string | null; // "14:30" — optional, some modalities degrade gracefully
  place: string; // free-text place name
  lat: number | null;
  lng: number | null;
  /** IANA timezone resolved from place, e.g. "Australia/Melbourne" */
  timezone: string | null;
}

/** Answers keyed by question id; value is the chosen option id or a 1–5 scale value. */
export type QuizAnswers = Record<string, string | number>;

export interface Passport {
  id: string;
  shareSlug: string;
  firstName: string | null;
  birth: BirthData;
  quizAnswers: QuizAnswers | null;
  /** results keyed by modality id */
  computedResults: Record<string, ModalityResult> | null;
  quizResults: Record<string, ModalityResult> | null;
  aiResults: Record<string, ModalityResult> | null;
  /** the overall "Common Threads" synthesis across all modalities */
  overallSummary: string | null;
  status: "intake" | "quiz" | "decoding" | "complete";
  createdAt: string;
}
