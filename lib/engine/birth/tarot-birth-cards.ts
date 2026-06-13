import type { BirthData, ModalityResult } from "@/lib/types";

/**
 * Tarot Birth Cards — the system popularised by Angeles Arrien and
 * the Tarot School. Your birth date reduces to a major arcana pair
 * (or trio) that represents the archetypal energies of your lifetime.
 */

const MAJOR_ARCANA: Record<number, { name: string; keywords: string; description: string }> = {
  0:  { name: "The Fool",           keywords: "pure potential, new beginnings, trust",      description: "You arrived at the edge of something — and you jumped. The Fool is the card of those who lead with wonder rather than certainty." },
  1:  { name: "The Magician",       keywords: "will, skill, manifestation",                  description: "You have everything you need. The Magician is the reminder that the tools are already in your hands." },
  2:  { name: "The High Priestess", keywords: "intuition, mystery, the unseen",              description: "You know before you know. The High Priestess trusts the inner current over the external noise." },
  3:  { name: "The Empress",        keywords: "abundance, sensuality, creative life",        description: "Life is rich and you are part of its richness. The Empress is embodied, abundant, generative." },
  4:  { name: "The Emperor",        keywords: "structure, mastery, foundation",               description: "You are built to create order from which others can flourish. The Emperor's strength is the strength of good bones." },
  5:  { name: "The Hierophant",     keywords: "tradition, wisdom, transmission",             description: "The bridge between what was and what can be. You carry meaning across time." },
  6:  { name: "The Lovers",         keywords: "union, choice, alignment",                    description: "Everything hinges on this: the choice you make from your deepest self, not your fear." },
  7:  { name: "The Chariot",        keywords: "direction, discipline, victory",              description: "The will to hold contradiction and move forward anyway. You were built for this kind of navigation." },
  8:  { name: "Strength",           keywords: "inner power, compassion, courage",            description: "Not the strength of force, but the strength of presence. You tame through love." },
  9:  { name: "The Hermit",         keywords: "inner wisdom, solitude, guidance",            description: "The one who goes inward so others don't have to go alone. Your lantern lights the road." },
  10: { name: "Wheel of Fortune",   keywords: "cycles, fate, opportunity",                   description: "Life moves in spirals and you are good at reading them. Luck and timing are your allies when you stay awake." },
  11: { name: "Justice",            keywords: "truth, balance, integrity",                   description: "You are here to see clearly and say so. The card of truth-telling and right action." },
  12: { name: "The Hanged Man",     keywords: "surrender, new perspective, pause",           description: "The pause that transforms everything. You learn by releasing, not by grasping." },
  13: { name: "Death",              keywords: "endings, transformation, rebirth",             description: "Nothing in your life has truly been wasted — it has been composted. The Death card is about becoming." },
  14: { name: "Temperance",         keywords: "integration, patience, alchemy",              description: "The alchemist who holds two things at once until something new emerges. Your gift is the third way." },
  15: { name: "The Devil",          keywords: "liberation, shadow, confronting attachment",  description: "The mirror that shows the chains. Your work is liberation — your own, and through that, others'." },
  16: { name: "The Tower",          keywords: "disruption, revelation, breakthrough",         description: "The lightning bolt that clears the way. You are often the catalyst in your own life and in others'." },
  17: { name: "The Star",           keywords: "hope, healing, renewal",                      description: "After every storm, you bring water. The Star is the card of those who restore faith." },
  18: { name: "The Moon",           keywords: "the unconscious, illusion, depth",            description: "You move in the dark fluently. The Moon is the card of the deep diver — the one who trusts the undertow." },
  19: { name: "The Sun",            keywords: "vitality, joy, clarity",                      description: "The card of radiating presence. You light things up — your joy is contagious when you let it loose." },
  20: { name: "Judgement",          keywords: "awakening, calling, rebirth",                 description: "The summons to your real life. The Judgement card is about hearing the call clearly and answering it fully." },
  21: { name: "The World",          keywords: "completion, wholeness, integration",          description: "The completion that opens into a new beginning. You are here to dance the whole dance." },
};

/**
 * Standard Birth Card calculation:
 * 1. Add month + day + all 4 digits of year
 * 2. Reduce to 2 digits (21 max for major arcana, else reduce further)
 * 3. Card 1 = that number; Card 2 = sum of its digits
 * Special: 19 → trio 19/10/1, 20 → pair 20/2, 21 → pair 21/3
 */
export function computeTarotBirthCards(birth: BirthData): ModalityResult {
  const [yearStr, monthStr, dayStr] = birth.date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  let sum = month + day + year;
  // Reduce to ≤ 21 (major arcana range, excluding 22)
  while (sum > 21) {
    sum = sum
      .toString()
      .split("")
      .reduce((s, d) => s + parseInt(d, 10), 0);
  }
  if (sum === 0) sum = 22; // The Fool

  const card1Num = sum;
  const card1 = MAJOR_ARCANA[card1Num] ?? MAJOR_ARCANA[0];

  // Card 2: sum digits of card1
  const card2Num =
    card1Num < 10
      ? card1Num // single digit — stands alone or The Fool
      : card1Num
          .toString()
          .split("")
          .reduce((s, d) => s + parseInt(d, 10), 0);
  const card2 = MAJOR_ARCANA[card2Num];

  // Trio case: 19 → The Sun (19), The Wheel (10), The Magician (1)
  const isTrio = card1Num === 19;

  const headline = isTrio
    ? `${card1.name} · ${MAJOR_ARCANA[10].name} · ${MAJOR_ARCANA[1].name}`
    : card1Num === card2Num
    ? card1.name
    : `${card1.name} & ${card2.name}`;

  const subline = isTrio
    ? `${card1.keywords} · ${MAJOR_ARCANA[10].keywords} · ${MAJOR_ARCANA[1].keywords}`
    : `${card1.keywords}${card2 && card2Num !== card1Num ? " · " + card2.keywords : ""}`;

  return {
    modalityId: "birth_card",
    headline,
    subline,
    summary: "",
    details: {
      primaryCard: `${card1Num} — ${card1.name}`,
      primaryKeywords: card1.keywords,
      secondaryCard:
        card2 && card2Num !== card1Num ? `${card2Num} — ${card2.name}` : "N/A",
      secondaryKeywords: card2 && card2Num !== card1Num ? card2.keywords : "",
      isTrio: isTrio ? "Yes" : "No",
      ...(isTrio && {
        tertiaryCard: `1 — ${MAJOR_ARCANA[1].name}`,
        tertiaryKeywords: MAJOR_ARCANA[1].keywords,
      }),
    },
    scores: { primaryCardNumber: card1Num, secondaryCardNumber: card2Num },
  };
}
