import type { BirthData, ModalityResult } from "@/lib/types";
import {
  toJD, sunLongitude, moonLongitude, gmst, obliquity,
  ascendant, signFromLon, ZODIAC_SIGNS, lonToSign,
} from "@/lib/engine/astro-helpers";

const SIGN_GLYPHS: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

const SIGN_ELEMENTS: Record<string, string> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

const SIGN_MODES: Record<string, string> = {
  Aries: "Cardinal", Cancer: "Cardinal", Libra: "Cardinal", Capricorn: "Cardinal",
  Taurus: "Fixed", Leo: "Fixed", Scorpio: "Fixed", Aquarius: "Fixed",
  Gemini: "Mutable", Virgo: "Mutable", Sagittarius: "Mutable", Pisces: "Mutable",
};

const SIGN_KEYWORDS: Record<string, string> = {
  Aries: "bold, initiating, direct",
  Taurus: "grounded, loyal, sensory",
  Gemini: "curious, adaptable, communicative",
  Cancer: "nurturing, intuitive, protective",
  Leo: "radiant, expressive, generous",
  Virgo: "discerning, methodical, devoted",
  Libra: "harmonious, fair, relational",
  Scorpio: "intense, perceptive, transformative",
  Sagittarius: "expansive, philosophical, free",
  Capricorn: "disciplined, strategic, enduring",
  Aquarius: "innovative, visionary, independent",
  Pisces: "empathic, imaginative, boundless",
};

export function computeWesternAstrology(birth: BirthData): ModalityResult {
  const [yearStr, monthStr, dayStr] = birth.date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Birth time as fractional day (default noon if unknown)
  let timeFraction = 0.5;
  if (birth.time) {
    const [h, m] = birth.time.split(":").map(Number);
    timeFraction = (h + m / 60) / 24;
  }
  // Offset for timezone (rough: use UTC if no tz info)
  const lngOffset = birth.lng ? birth.lng / 360 : 0;
  const jd = toJD(year, month, day) - 0.5 + timeFraction - lngOffset;

  const sunLon = sunLongitude(jd);
  const moonLon = moonLongitude(jd);

  const sunSign = signFromLon(sunLon);
  const moonSign = signFromLon(moonLon);

  // Rising sign (needs birth time + location)
  let risingSign: string | null = null;
  if (birth.time && birth.lat !== null && birth.lng !== null) {
    const obl = obliquity(jd);
    const lst = ((gmst(jd) + birth.lng) % 360 + 360) % 360;
    const ascLon = ascendant(lst, birth.lat, obl);
    risingSign = signFromLon(ascLon);
  }

  const sunDeg = Math.floor(sunLon % 30);
  const moonDeg = Math.floor(moonLon % 30);

  const headline = risingSign
    ? `${sunSign} Sun · ${moonSign} Moon · ${risingSign} Rising`
    : `${sunSign} Sun · ${moonSign} Moon`;

  const subline = `${SIGN_ELEMENTS[sunSign]} ${SIGN_MODES[sunSign]}${risingSign ? ` · ${risingSign} Rising` : " · birth time needed for Rising"}`;

  return {
    modalityId: "western_astrology",
    headline,
    subline,
    summary: "", // filled by Claude
    details: {
      sunSign,
      sunDegree: `${sunDeg}° ${sunSign}`,
      moonSign,
      moonDegree: `${moonDeg}° ${moonSign}`,
      risingSign: risingSign ?? "unknown (birth time needed)",
      sunElement: SIGN_ELEMENTS[sunSign],
      sunMode: SIGN_MODES[sunSign],
      sunKeywords: SIGN_KEYWORDS[sunSign],
      moonKeywords: SIGN_KEYWORDS[moonSign],
    },
    scores: { sunSignIndex: lonToSign(sunLon), moonSignIndex: lonToSign(moonLon) },
  };
}
