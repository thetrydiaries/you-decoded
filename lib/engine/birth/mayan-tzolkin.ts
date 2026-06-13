import type { BirthData, ModalityResult } from "@/lib/types";
import { toJD } from "@/lib/engine/astro-helpers";

/**
 * Mayan Tzolk'in — the 260-day sacred calendar.
 *
 * The Tzolk'in is a combination of:
 *   - 20 Day Signs (solar glyphs) — the quality of the day
 *   - 13 Galactic Tones — the energy/intention
 *
 * We use the GMT correlation constant (584283) which is the most
 * widely accepted correlation between Julian Days and the Mayan count.
 */

const DAY_SIGNS = [
  { name: "Imix",    english: "Crocodile",  keywords: "primal, nurturing, creative source" },
  { name: "Ik'",    english: "Wind",        keywords: "communication, spirit, breath of life" },
  { name: "Ak'b'al", english: "Night",      keywords: "mystery, darkness, dreaming" },
  { name: "K'an",   english: "Seed",        keywords: "ripening, abundance, harmony" },
  { name: "Chikchan", english: "Serpent",   keywords: "life force, instinct, kundalini" },
  { name: "Kimi",   english: "Death",       keywords: "transformation, ancestors, endings" },
  { name: "Manik'", english: "Deer/Hand",   keywords: "healing, cooperation, grace" },
  { name: "Lamat",  english: "Star/Rabbit", keywords: "abundance, play, starseed" },
  { name: "Muluk",  english: "Water/Moon",  keywords: "purification, flow, emotions" },
  { name: "Ok",     english: "Dog",         keywords: "loyalty, love, heart" },
  { name: "Chuwen", english: "Monkey",      keywords: "creativity, weaving, trickster" },
  { name: "Eb'",    english: "Road/Grass",  keywords: "journey, destiny, service" },
  { name: "B'en",   english: "Reed",        keywords: "personal authority, inner temple" },
  { name: "Ix",     english: "Jaguar",      keywords: "intuition, earth magic, shaman" },
  { name: "Men",    english: "Eagle",       keywords: "vision, mind, higher perspective" },
  { name: "Kib'",   english: "Vulture/Owl", keywords: "forgiveness, wisdom, karma" },
  { name: "Kab'an", english: "Earth",       keywords: "synchronicity, intelligence, resonance" },
  { name: "Etz'nab'", english: "Flint/Mirror", keywords: "truth, clarity, reflection" },
  { name: "Kawak",  english: "Storm",       keywords: "catalytic change, purification" },
  { name: "Ajaw",   english: "Sun/Lord",    keywords: "enlightenment, mastery, bliss" },
] as const;

const TONES = [
  { number: 1,  name: "Magnetic",    keywords: "purpose, unity, attraction" },
  { number: 2,  name: "Lunar",       keywords: "challenge, polarity, stabilise" },
  { number: 3,  name: "Electric",    keywords: "service, activation, bond" },
  { number: 4,  name: "Self-Existing", keywords: "form, definition, measure" },
  { number: 5,  name: "Overtone",    keywords: "empowerment, radiance, command" },
  { number: 6,  name: "Rhythmic",    keywords: "balance, organise, equality" },
  { number: 7,  name: "Resonant",    keywords: "channel, inspire, attune" },
  { number: 8,  name: "Galactic",    keywords: "harmony, model, integrity" },
  { number: 9,  name: "Solar",       keywords: "intention, pulse, realise" },
  { number: 10, name: "Planetary",   keywords: "manifestation, produce, perfect" },
  { number: 11, name: "Spectral",    keywords: "liberation, dissolve, release" },
  { number: 12, name: "Crystal",     keywords: "cooperation, dedicate, universalise" },
  { number: 13, name: "Cosmic",      keywords: "transcendence, presence, endure" },
] as const;

// GMT correlation: JD 584283 = 0.0.0.0.0 (Long Count day 0 = 4 Ajaw 8 Kumk'u)
// Tzolk'in day 0 corresponds to 4 Ajaw, which is:
//   Day Sign: Ajaw (index 19), Tone: 4 (Planetary)
// Our day_count = (JD - 584283) % 260

const GMT_CORRELATION = 584283;

export function computeMayanTzolkin(birth: BirthData): ModalityResult {
  const [yearStr, monthStr, dayStr] = birth.date.split("-");
  const jd = toJD(parseInt(yearStr), parseInt(monthStr), parseInt(dayStr));

  let dayCount = ((jd - GMT_CORRELATION) % 260 + 260) % 260;

  // Day sign (0–19): dayCount % 20
  const signIndex = dayCount % 20;
  const toneNumber = (dayCount % 13) + 1;

  const sign = DAY_SIGNS[signIndex];
  const tone = TONES[toneNumber - 1];

  return {
    modalityId: "mayan_tzolkin",
    headline: `${toneNumber} ${sign.name} — ${tone.name} ${sign.english}`,
    subline: `Tone ${toneNumber}: ${tone.keywords} · Sign: ${sign.keywords}`,
    summary: "",
    details: {
      daySign: sign.name,
      daySignEnglish: sign.english,
      daySignKeywords: sign.keywords,
      galacticTone: toneNumber.toString(),
      toneName: tone.name,
      toneKeywords: tone.keywords,
      tzolkinDay: dayCount.toString(),
      kin: `Kin ${dayCount + 1}`,
    },
    scores: { daySignIndex: signIndex, toneNumber },
  };
}
