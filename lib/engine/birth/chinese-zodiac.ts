import type { BirthData, ModalityResult } from "@/lib/types";

const ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
] as const;

const ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"] as const;
const POLARITIES = ["Yang", "Yin"] as const;

// Approximate Chinese New Year dates for 1924–2035 (month-day)
// Format: [year, month, day] for the CNY of that year
const CNY: [number, number, number][] = [
  [1924, 2, 5], [1925, 1, 25], [1926, 2, 13], [1927, 2, 2], [1928, 1, 23],
  [1929, 2, 10], [1930, 1, 30], [1931, 2, 17], [1932, 2, 6], [1933, 1, 26],
  [1934, 2, 14], [1935, 2, 4], [1936, 1, 24], [1937, 2, 11], [1938, 1, 31],
  [1939, 2, 19], [1940, 2, 8], [1941, 1, 27], [1942, 2, 15], [1943, 2, 5],
  [1944, 1, 25], [1945, 2, 13], [1946, 2, 2], [1947, 1, 22], [1948, 2, 10],
  [1949, 1, 29], [1950, 2, 17], [1951, 2, 6], [1952, 1, 27], [1953, 2, 14],
  [1954, 2, 3], [1955, 1, 24], [1956, 2, 12], [1957, 1, 31], [1958, 2, 18],
  [1959, 2, 8], [1960, 1, 28], [1961, 2, 15], [1962, 2, 5], [1963, 1, 25],
  [1964, 2, 13], [1965, 2, 2], [1966, 1, 21], [1967, 2, 9], [1968, 1, 30],
  [1969, 2, 17], [1970, 2, 6], [1971, 1, 27], [1972, 2, 15], [1973, 2, 3],
  [1974, 1, 23], [1975, 2, 11], [1976, 1, 31], [1977, 2, 18], [1978, 2, 7],
  [1979, 1, 28], [1980, 2, 16], [1981, 2, 5], [1982, 1, 25], [1983, 2, 13],
  [1984, 2, 2], [1985, 2, 20], [1986, 2, 9], [1987, 1, 29], [1988, 2, 17],
  [1989, 2, 6], [1990, 1, 27], [1991, 2, 15], [1992, 2, 4], [1993, 1, 23],
  [1994, 2, 10], [1995, 1, 31], [1996, 2, 19], [1997, 2, 7], [1998, 1, 28],
  [1999, 2, 16], [2000, 2, 5], [2001, 1, 24], [2002, 2, 12], [2003, 2, 1],
  [2004, 1, 22], [2005, 2, 9], [2006, 1, 29], [2007, 2, 18], [2008, 2, 7],
  [2009, 1, 26], [2010, 2, 14], [2011, 2, 3], [2012, 1, 23], [2013, 2, 10],
  [2014, 1, 31], [2015, 2, 19], [2016, 2, 8], [2017, 1, 28], [2018, 2, 16],
  [2019, 2, 5], [2020, 1, 25], [2021, 2, 12], [2022, 2, 1], [2023, 1, 22],
  [2024, 2, 10], [2025, 1, 29], [2026, 2, 17], [2027, 2, 6], [2028, 1, 26],
  [2029, 2, 13], [2030, 2, 3], [2031, 1, 23], [2032, 2, 11], [2033, 1, 31],
  [2034, 2, 19], [2035, 2, 8],
];

function cnyYear(year: number, month: number, day: number): number {
  // Find the CNY of `year`. If birth is before it, use previous year.
  const entry = CNY.find(([y]) => y === year);
  if (!entry) {
    // Fallback: approximate Feb 4
    const isBeforeCNY = month < 2 || (month === 2 && day < 4);
    return isBeforeCNY ? year - 1 : year;
  }
  const [, cnyM, cnyD] = entry;
  const isBeforeCNY = month < cnyM || (month === cnyM && day < cnyD);
  return isBeforeCNY ? year - 1 : year;
}

const ANIMAL_TRAITS: Record<string, string> = {
  Rat:     "clever, resourceful, charming, quick-witted",
  Ox:      "reliable, patient, methodical, strong-willed",
  Tiger:   "courageous, unpredictable, magnetic, intense",
  Rabbit:  "diplomatic, gracious, kind, sensitive",
  Dragon:  "ambitious, energetic, confident, magnetic",
  Snake:   "wise, intuitive, elegant, private",
  Horse:   "energetic, free-spirited, independent, loyal",
  Goat:    "gentle, artistic, empathic, resilient",
  Monkey:  "witty, versatile, curious, playful",
  Rooster: "observant, confident, honest, direct",
  Dog:     "loyal, honest, warm, fair-minded",
  Pig:     "generous, diligent, compassionate, sincere",
};

const ELEMENT_FLAVOUR: Record<string, string> = {
  Wood:   "growing, creative, compassionate",
  Fire:   "passionate, dynamic, charismatic",
  Earth:  "grounded, stable, nurturing",
  Metal:  "disciplined, principled, persistent",
  Water:  "fluid, intuitive, perceptive",
};

export function computeChineseZodiac(birth: BirthData): ModalityResult {
  const [yearStr, monthStr, dayStr] = birth.date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const chineseYear = cnyYear(year, month, day);

  // Animal: 1900 = Rat (index 0)
  const animalIndex = ((chineseYear - 1900) % 12 + 12) % 12;
  const animal = ANIMALS[animalIndex];

  // Element: 10-year heavenly stem cycle, 2 years per element
  // 1900 = Metal, stems cycle in pairs
  const stemIndex = ((chineseYear - 1900) % 10 + 10) % 10;
  const elementIndex = Math.floor(stemIndex / 2);
  const element = ELEMENTS[elementIndex];
  const polarity = POLARITIES[stemIndex % 2];

  return {
    modalityId: "chinese_zodiac",
    headline: `${element} ${animal}`,
    subline: `Year ${chineseYear} · ${polarity} ${element}`,
    summary: "",
    details: {
      animal,
      element,
      polarity,
      chineseYear: chineseYear.toString(),
      animalTraits: ANIMAL_TRAITS[animal],
      elementFlavour: ELEMENT_FLAVOUR[element],
    },
  };
}
