import type { BirthData, ModalityResult } from "@/lib/types";

/** Reduce a number to single digit, keeping master numbers 11, 22, 33. */
function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n
      .toString()
      .split("")
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return n;
}

const PATH_DATA: Record<number, { name: string; keywords: string; theme: string }> = {
  1: {
    name: "The Pioneer",
    keywords: "independence, leadership, original thought",
    theme: "You are here to forge your own path. The number 1 energy insists on originality — following someone else's map never quite satisfies. Your soul work is learning that self-reliance is a gift, not a burden.",
  },
  2: {
    name: "The Diplomat",
    keywords: "partnership, intuition, peace",
    theme: "You are here to connect. The 2 path is about the art of meeting — finding what's shared between different worlds, and holding space for both. Your gift is in the relationship, not the solo act.",
  },
  3: {
    name: "The Creator",
    keywords: "self-expression, joy, creativity",
    theme: "You are here to make things alive. The 3 path is about bringing what's inside you outward — through words, art, conversation, or presence. Withholding that expression is the only real wound.",
  },
  4: {
    name: "The Builder",
    keywords: "structure, discipline, foundation",
    theme: "You are here to make things last. The 4 path is about building with integrity — creating structures (systems, families, work) that outlive the moment they were made in. Your gift is permanence.",
  },
  5: {
    name: "The Adventurer",
    keywords: "freedom, change, experience",
    theme: "You are here to move through the world fully. The 5 path is about tasting everything — not settling for secondhand experience. Your challenge is learning that freedom can exist within roots.",
  },
  6: {
    name: "The Nurturer",
    keywords: "responsibility, home, healing",
    theme: "You are here to tend. The 6 path is about care as a vocation — the work of holding others with love that doesn't keep score. Your challenge is learning that you are also someone who needs tending.",
  },
  7: {
    name: "The Seeker",
    keywords: "introspection, wisdom, truth",
    theme: "You are here to understand. The 7 path is the most inward of the numbers — a life marked by depth, solitude, and the persistent question underneath every answer. The mystery is the point.",
  },
  8: {
    name: "The Achiever",
    keywords: "power, ambition, abundance",
    theme: "You are here to create impact at scale. The 8 path is about the relationship with power, resources, and influence — learning to build something significant without losing yourself to it.",
  },
  9: {
    name: "The Sage",
    keywords: "compassion, completion, universal love",
    theme: "You are here to give back what you've learned. The 9 path is the path of the elder — wide perspective, hard-won wisdom, and a calling toward something larger than personal gain.",
  },
  11: {
    name: "The Illuminator",
    keywords: "spiritual insight, inspiration, sensitivity",
    theme: "You carry a master number — the 11 is a path of heightened intuition and spiritual sensitivity. You are here to inspire by example, often before you understand why things affect you so deeply.",
  },
  22: {
    name: "The Master Builder",
    keywords: "transformation, vision, global impact",
    theme: "The 22 is the most powerful master number — capable of turning the largest dreams into reality. Your path asks you to operate at a scale that requires both visionary thinking and grounded execution.",
  },
  33: {
    name: "The Master Teacher",
    keywords: "selfless service, compassion, truth",
    theme: "The 33 is the rarest path — a calling toward nurturing at the highest level, blending heart, wisdom, and service in ways that ask everything of you. Your life becomes the teaching.",
  },
};

export function computeNumerology(birth: BirthData): ModalityResult {
  // Sum all digits of yyyy-mm-dd
  const digits = birth.date
    .replace(/-/g, "")
    .split("")
    .map(Number);
  const rawSum = digits.reduce((a, b) => a + b, 0);
  const lifePath = reduce(rawSum);

  const data = PATH_DATA[lifePath] ?? PATH_DATA[1];

  // Expression number from birth date itself (secondary insight)
  const dayDigits = birth.date.split("-")[2].split("").map(Number);
  const birthdayNum = reduce(dayDigits.reduce((a, b) => a + b, 0));

  return {
    modalityId: "numerology",
    headline: `Life Path ${lifePath} — ${data.name}`,
    subline: data.keywords,
    summary: "",
    details: {
      lifePathNumber: lifePath.toString(),
      lifePathName: data.name,
      lifePathKeywords: data.keywords,
      birthdayNumber: birthdayNum.toString(),
      isMasterNumber: [11, 22, 33].includes(lifePath) ? "Yes" : "No",
      rawSum: rawSum.toString(),
    },
    scores: { lifePathNumber: lifePath },
  };
}
