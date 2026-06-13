import type { BirthData, ModalityResult } from "@/lib/types";

/**
 * Destiny Matrix — a modern Russian system mapping birth date numbers
 * onto the 22 Major Arcana of the tarot in a specific geometric pattern.
 * The "core energy" point sits at the centre of the matrix.
 */

const ARCANA: Record<number, { name: string; keywords: string; description: string }> = {
  1:  { name: "The Magician",     keywords: "will, skill, conscious creation", description: "The power to make things happen. Your core energy is one of intent and agency — you are a channel between the seen and unseen." },
  2:  { name: "The High Priestess", keywords: "intuition, mystery, inner knowing", description: "The keeper of what isn't said. Your core energy is deeply intuitive — you know things before you can explain how." },
  3:  { name: "The Empress",      keywords: "abundance, creativity, embodied life", description: "Life in full bloom. Your core energy is generative and sensory — you create, nurture, and bring beauty into form." },
  4:  { name: "The Emperor",      keywords: "structure, authority, foundation", description: "The energy of building and governing. Your core strength is the ability to create order and hold the structure others live inside." },
  5:  { name: "The Hierophant",   keywords: "wisdom, tradition, meaning-making", description: "The bridge between worlds. Your core energy is about passing on what matters — teaching, guiding, and holding the thread of tradition." },
  6:  { name: "The Lovers",       keywords: "choice, union, deep connection", description: "The crossroads of the heart. Your core energy is about relationship and alignment — with others, and with yourself." },
  7:  { name: "The Chariot",      keywords: "will, direction, mastery", description: "Forward through contradiction. Your core energy is purposeful movement — the drive to hold opposing forces and keep going anyway." },
  8:  { name: "Strength",         keywords: "courage, compassion, inner power", description: "Power made gentle. Your core energy is not force but presence — the strength that comes from love rather than fear." },
  9:  { name: "The Hermit",       keywords: "solitude, wisdom, inner light", description: "The one who goes deep. Your core energy is inward — a lantern for others, but only after lighting it for yourself." },
  10: { name: "Wheel of Fortune", keywords: "cycles, fate, flow", description: "Life in motion. Your core energy is attuned to cycles — the ability to read what's turning and move with it, not against it." },
  11: { name: "Justice",          keywords: "truth, fairness, discernment", description: "The clear eye. Your core energy is about alignment between action and consequence — a deep sense of what's right." },
  12: { name: "The Hanged Man",   keywords: "surrender, perspective, release", description: "The pause that changes everything. Your core energy holds the gift of suspension — seeing from angles others miss." },
  13: { name: "Death",            keywords: "transformation, endings, renewal", description: "The great releaser. Your core energy is about clearing the way for what's next — you are not afraid of endings." },
  14: { name: "Temperance",       keywords: "balance, integration, alchemy", description: "The alchemist at the threshold. Your core energy is synthesis — the ability to hold opposites and find the third thing." },
  15: { name: "The Devil",        keywords: "shadow, attachment, liberation", description: "The mirror of chains. Your core energy holds the task of liberation — recognising what binds and choosing release." },
  16: { name: "The Tower",        keywords: "revelation, disruption, truth", description: "The lightning bolt. Your core energy moves toward breakthrough — sometimes yours, often catalysing them for others." },
  17: { name: "The Star",         keywords: "hope, healing, renewal", description: "Light after the storm. Your core energy is one of quiet restoration — you give hope by simply being present in it." },
  18: { name: "The Moon",         keywords: "dreams, illusion, the unconscious", description: "The world between worlds. Your core energy is attuned to the unconscious — the undercurrent beneath the surface." },
  19: { name: "The Sun",          keywords: "joy, radiance, vitality", description: "The light that needs no explanation. Your core energy is generative warmth — the kind others turn toward without knowing why." },
  20: { name: "Judgement",        keywords: "awakening, calling, rebirth", description: "The great summons. Your core energy is about hearing what calls and answering it fully — a life of conscious awakening." },
  21: { name: "The World",        keywords: "completion, integration, wholeness", description: "The dance of completion. Your core energy is integrative — you naturally bring things together into something whole." },
  22: { name: "The Fool",         keywords: "freedom, new beginnings, pure potential", description: "The edge of everything. Your core energy is pure potential — you begin where others stop, without needing to know the way." },
};

function reduce22(n: number): number {
  while (n > 22) {
    n = n
      .toString()
      .split("")
      .reduce((s, d) => s + parseInt(d, 10), 0);
  }
  return n === 0 ? 22 : n;
}

export function computeDestinyMatrix(birth: BirthData): ModalityResult {
  const [yearStr, monthStr, dayStr] = birth.date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Sum month + day + year, reduce to 1–22
  const raw = month + day + year;
  const coreEnergy = reduce22(raw);

  // Personal year energy (for context): month + day + current year
  const currentYear = new Date().getFullYear();
  const personalYear = reduce22(month + day + currentYear);

  const arcana = ARCANA[coreEnergy];

  return {
    modalityId: "destiny_matrix",
    headline: `${coreEnergy} — ${arcana.name}`,
    subline: arcana.keywords,
    summary: "",
    details: {
      coreArcanaNumber: coreEnergy.toString(),
      coreArcanaName: arcana.name,
      coreKeywords: arcana.keywords,
      personalYearArcana: `${personalYear} — ${ARCANA[personalYear]?.name ?? ""}`,
      rawSum: raw.toString(),
    },
    scores: { coreArcanaNumber: coreEnergy },
  };
}
