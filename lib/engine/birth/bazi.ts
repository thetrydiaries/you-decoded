import type { BirthData, ModalityResult } from "@/lib/types";
import { toJD } from "@/lib/engine/astro-helpers";

/**
 * BaZi (八字) — Four Pillars of Destiny.
 *
 * The Day Master (日主) is the most important pillar:
 * it represents the core self. We calculate all four pillars
 * (Year, Month, Day, Hour) from the birth date/time.
 *
 * The 10 Heavenly Stems cycle through 5 elements × 2 polarities.
 * The 12 Earthly Branches cycle through 12 phases (same as zodiac animals).
 */

const HEAVENLY_STEMS = [
  { name: "Jiǎ",  element: "Wood",  polarity: "Yang" },
  { name: "Yǐ",   element: "Wood",  polarity: "Yin"  },
  { name: "Bǐng", element: "Fire",  polarity: "Yang" },
  { name: "Dīng", element: "Fire",  polarity: "Yin"  },
  { name: "Wù",   element: "Earth", polarity: "Yang" },
  { name: "Jǐ",   element: "Earth", polarity: "Yin"  },
  { name: "Gēng", element: "Metal", polarity: "Yang" },
  { name: "Xīn",  element: "Metal", polarity: "Yin"  },
  { name: "Rén",  element: "Water", polarity: "Yang" },
  { name: "Guǐ",  element: "Water", polarity: "Yin"  },
] as const;

const EARTHLY_BRANCHES = [
  { name: "Zǐ",   animal: "Rat",     element: "Water" },
  { name: "Chǒu", animal: "Ox",      element: "Earth" },
  { name: "Yín",  animal: "Tiger",   element: "Wood"  },
  { name: "Mǎo",  animal: "Rabbit",  element: "Wood"  },
  { name: "Chén", animal: "Dragon",  element: "Earth" },
  { name: "Sì",   animal: "Snake",   element: "Fire"  },
  { name: "Wǔ",   animal: "Horse",   element: "Fire"  },
  { name: "Wèi",  animal: "Goat",    element: "Earth" },
  { name: "Shēn", animal: "Monkey",  element: "Metal" },
  { name: "Yǒu",  animal: "Rooster", element: "Metal" },
  { name: "Xū",   animal: "Dog",     element: "Earth" },
  { name: "Hài",  animal: "Pig",     element: "Water" },
] as const;

const DAY_MASTER_PERSONALITY: Record<string, string> = {
  "Jiǎ Wood":  "The Oak — upright, growth-driven, ambitious, direct",
  "Yǐ Wood":   "The Vine — flexible, persistent, graceful, adaptable",
  "Bǐng Fire": "The Sun — radiant, generous, open, warm-natured",
  "Dīng Fire": "The Candle — focused, intuitive, quietly powerful, illuminating",
  "Wù Earth":  "The Mountain — steadfast, reliable, protective, enduring",
  "Jǐ Earth":  "The Field — nurturing, fertile, patient, detail-oriented",
  "Gēng Metal":"The Sword — decisive, principled, sharp-minded, action-oriented",
  "Xīn Metal": "The Jewel — refined, discerning, sensitive, aesthetically attuned",
  "Rén Water": "The Ocean — vast, intuitive, philosophical, adaptable",
  "Guǐ Water": "The Rain — gentle, perceptive, emotionally deep, subtle",
};

/** Year pillar stem index. 1864 is a known Jiǎ-Zǐ year. */
function yearStemIndex(chineseYear: number): number {
  return ((chineseYear - 1864) % 10 + 10) % 10;
}
function yearBranchIndex(chineseYear: number): number {
  return ((chineseYear - 1864) % 12 + 12) % 12;
}

/** Month stem depends on year stem + lunar month (approx from solar month). */
function monthStemIndex(yearStemIdx: number, month: number): number {
  // Months 1–12 map to branches 2–1 (Tiger branch = month 1)
  const base = (yearStemIdx % 5) * 2;
  return (base + month - 1) % 10;
}
function monthBranchIndex(month: number): number {
  // Lunar month 1 = Tiger (index 2), cycle of 12
  return (month + 1) % 12;
}

/** Day stem from Julian Day Number. JD 2454795 (Nov 11, 2008) = Jiǎ day = index 0. */
function dayStemIndex(jd: number): number {
  return ((jd - 2454795) % 10 + 10) % 10;
}
function dayBranchIndex(jd: number): number {
  return ((jd - 2454795) % 12 + 12) % 12;
}

/** Hour branch: 1 Zǐ = 23:00–01:00, then every 2 hours. */
function hourBranchIndex(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2);
}
function hourStemIndex(dayStemIdx: number, hourBranchIdx: number): number {
  const base = (dayStemIdx % 5) * 2;
  return (base + hourBranchIdx) % 10;
}

export function computeBazi(birth: BirthData): ModalityResult {
  const [yearStr, monthStr, dayStr] = birth.date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Chinese year (approximate: ignore CNY boundary for simplicity)
  const chineseYear = year; // close enough for BaZi element

  const jd = toJD(year, month, day);

  // Day pillar (the core)
  const dayStemIdx = dayStemIndex(jd);
  const dayBranchIdx = dayBranchIndex(jd);
  const dayStem = HEAVENLY_STEMS[dayStemIdx];
  const dayBranch = EARTHLY_BRANCHES[dayBranchIdx];

  // Year pillar
  const yearStemIdx = yearStemIndex(chineseYear);
  const yearBranchIdx = yearBranchIndex(chineseYear);
  const yearStem = HEAVENLY_STEMS[yearStemIdx];
  const yearBranch = EARTHLY_BRANCHES[yearBranchIdx];

  // Month pillar
  const monthStemIdx = monthStemIndex(yearStemIdx, month);
  const monthBranchIdx = monthBranchIndex(month);
  const monthStem = HEAVENLY_STEMS[monthStemIdx];
  const monthBranch = EARTHLY_BRANCHES[monthBranchIdx];

  // Hour pillar (if birth time known)
  let hourPillar = "unknown (birth time needed)";
  if (birth.time) {
    const hour = parseInt(birth.time.split(":")[0], 10);
    const hourBranchIdx = hourBranchIndex(hour);
    const hourStemIdx = hourStemIndex(dayStemIdx, hourBranchIdx);
    const hStem = HEAVENLY_STEMS[hourStemIdx];
    const hBranch = EARTHLY_BRANCHES[hourBranchIdx];
    hourPillar = `${hStem.name} ${hBranch.name}`;
  }

  const dayMasterKey = `${dayStem.name} ${dayStem.element}`;
  const personality = DAY_MASTER_PERSONALITY[dayMasterKey] ?? `${dayStem.polarity} ${dayStem.element}`;

  return {
    modalityId: "bazi",
    headline: `${dayStem.polarity} ${dayStem.element} — ${dayStem.name} Day Master`,
    subline: personality.split(" — ")[1] ?? personality,
    summary: "",
    details: {
      dayMaster: `${dayStem.name} (${dayStem.polarity} ${dayStem.element})`,
      dayMasterPersonality: personality,
      yearPillar: `${yearStem.name} ${yearBranch.name}`,
      monthPillar: `${monthStem.name} ${monthBranch.name}`,
      dayPillar: `${dayStem.name} ${dayBranch.name}`,
      hourPillar,
      dayMasterElement: dayStem.element,
      dayMasterPolarity: dayStem.polarity,
      dayBranchAnimal: dayBranch.animal,
    },
  };
}
