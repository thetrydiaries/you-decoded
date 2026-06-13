import type { ModalityDef } from "@/lib/types";

/**
 * The 18 modalities of a passport.
 *
 *  8 computed from birth data · 7 derived from the quiz · 3 synthesized by Claude
 *
 * The order here is the display order on the results page:
 * we open with the cosmic (birth) cards, move inward to the
 * psychological (quiz) cards, and close with the AI synthesis.
 */
export const MODALITIES: ModalityDef[] = [
  // ── From your birth data ────────────────────────────────────────────
  {
    id: "western_astrology",
    name: "Western Astrology",
    tagline: "Sun, Moon & Rising",
    source: "birth",
    about:
      "Your 'big three' — the sky's snapshot at the moment you were born, mapped to identity, emotion, and first impressions.",
  },
  {
    id: "chinese_zodiac",
    name: "Chinese Zodiac",
    tagline: "Animal & Element",
    source: "birth",
    about:
      "A 12-year animal cycle crossed with five elements — your year of birth carries a character all its own.",
  },
  {
    id: "numerology",
    name: "Numerology",
    tagline: "Life Path Number",
    source: "birth",
    about:
      "Your birth date reduced to a single guiding number — the route your life is said to keep returning to.",
  },
  {
    id: "bazi",
    name: "BaZi",
    tagline: "Four Pillars · Day Master",
    source: "birth",
    about:
      "Chinese metaphysics' Four Pillars of Destiny — your Day Master element is the core self the other pillars orbit.",
  },
  {
    id: "human_design",
    name: "Human Design",
    tagline: "Type & Strategy",
    source: "birth",
    about:
      "A modern synthesis of I Ching, astrology and chakras — your Type describes how your energy is built to engage the world.",
  },
  {
    id: "destiny_matrix",
    name: "Destiny Matrix",
    tagline: "Core Arcana",
    source: "birth",
    about:
      "Your birth date mapped onto the 22 major arcana of the tarot — a matrix of energies with one card at its center.",
  },
  {
    id: "mayan_tzolkin",
    name: "Mayan Tzolk'in",
    tagline: "Day Sign & Tone",
    source: "birth",
    about:
      "The 260-day sacred calendar — your day sign and galactic tone describe the quality of the day you arrived.",
  },
  {
    id: "birth_card",
    name: "Tarot Birth Cards",
    tagline: "Your Major Arcana pair",
    source: "birth",
    about:
      "Your birth date condensed into a pair of major arcana — the archetypal energies said to bookend your story.",
  },

  // ── From the quiz ───────────────────────────────────────────────────
  {
    id: "mbti",
    name: "MBTI",
    tagline: "16 Types",
    source: "quiz",
    about:
      "Four preference axes — where you draw energy, how you take in information, how you decide, and how you organise life.",
  },
  {
    id: "big_five",
    name: "Big Five",
    tagline: "OCEAN traits",
    source: "quiz",
    about:
      "The five-factor model — psychology's most validated trait map: openness, conscientiousness, extraversion, agreeableness, neuroticism.",
  },
  {
    id: "enneagram",
    name: "Enneagram",
    tagline: "Type & Wing",
    source: "quiz",
    about:
      "Nine core motivations — less about what you do, more about why you do it, and what you're afraid of underneath.",
  },
  {
    id: "attachment",
    name: "Attachment Style",
    tagline: "How you bond",
    source: "quiz",
    about:
      "The pattern you bring to closeness — secure, anxious, avoidant, or a blend — first formed early, still negotiable.",
  },
  {
    id: "love_languages",
    name: "Love Languages",
    tagline: "How you give & receive",
    source: "quiz",
    about:
      "The five dialects of affection — which ones land for you, and which ones you speak fluently without noticing.",
  },
  {
    id: "dosha",
    name: "Ayurvedic Dosha",
    tagline: "Vata · Pitta · Kapha",
    source: "quiz",
    about:
      "Ayurveda's three constitutions of mind and body — your natural blend of air, fire, and earth energies.",
  },
  {
    id: "jungian_archetype",
    name: "Jungian Archetype",
    tagline: "12 Archetypes",
    source: "quiz",
    about:
      "The mythic character you most embody — Sage, Explorer, Caregiver, Rebel and friends, drawn from the collective unconscious.",
  },

  // ── Synthesized by Claude ───────────────────────────────────────────
  {
    id: "shadow_profile",
    name: "Shadow Profile",
    tagline: "What hides in your light",
    source: "ai",
    about:
      "Claude reads across all 15 results for the patterns you'd rather not see — the shadow cast by your brightest traits.",
  },
  {
    id: "core_gift",
    name: "Core Gift",
    tagline: "The thread through everything",
    source: "ai",
    about:
      "The single gift that shows up in every system that read you — named plainly, so you can stop underestimating it.",
  },
  {
    id: "cosmic_headline",
    name: "Cosmic Headline",
    tagline: "You, in one line",
    source: "ai",
    about:
      "If your whole passport were a headline, this is it — the shareable one-liner that is unmistakably you.",
  },
];

export const MODALITY_BY_ID: Record<string, ModalityDef> = Object.fromEntries(
  MODALITIES.map((m) => [m.id, m])
);
