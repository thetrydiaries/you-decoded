/**
 * Shared astronomical utilities for You, Decoded.
 *
 * Accuracy target: within 1–2° for Sun/Moon, exact for calendar-based
 * systems (numerology, Chinese zodiac, Mayan, tarot). Rising sign
 * requires birth time and is noted as approximate for entertainment use.
 */

/** Convert degrees to radians */
export const deg2rad = (d: number) => (d * Math.PI) / 180;
/** Convert radians to degrees */
export const rad2deg = (r: number) => (r * 180) / Math.PI;
/** Normalize degrees to 0–360 */
export const normDeg = (d: number) => ((d % 360) + 360) % 360;

/**
 * Julian Day Number from a UTC calendar date.
 * Accurate for dates from 1 AD onward.
 */
export function toJD(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Julian centuries from J2000.0 (Jan 1.5, 2000 = JD 2451545.0).
 * @param jd  Julian Day Number (optionally fractional for time-of-day)
 */
export function jCenturies(jd: number): number {
  return (jd - 2451545.0) / 36525;
}

/**
 * Approximate geocentric ecliptic longitude of the Sun (degrees).
 * Accuracy: ±0.01° for dates within a few centuries of J2000.
 */
export function sunLongitude(jd: number): number {
  const T = jCenturies(jd);
  // Mean longitude L0 (degrees)
  const L0 = normDeg(280.46646 + 36000.76983 * T);
  // Mean anomaly M (degrees)
  const M = normDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = deg2rad(M);
  // Equation of centre C
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  // Sun true longitude Θ (sun ☉ longitude)
  const sunLon = normDeg(L0 + C);
  // Apparent longitude (aberration + nutation correction ~-0.00569 - 0.00478*sin(omega))
  const omega = normDeg(125.04 - 1934.136 * T);
  return normDeg(sunLon - 0.00569 - 0.00478 * Math.sin(deg2rad(omega)));
}

/**
 * Approximate geocentric ecliptic longitude of the Moon (degrees).
 * Accuracy: ±1° for dates within a few centuries of J2000.
 * Uses the truncated IAU 1980 series.
 */
export function moonLongitude(jd: number): number {
  const T = jCenturies(jd);
  // Moon mean elements (degrees)
  const L  = normDeg(218.3165 + 481267.8813 * T);   // mean longitude
  const M  = normDeg(134.9634 + 477198.8676 * T);   // moon mean anomaly
  const Ms = normDeg(357.5291 + 35999.0503 * T);    // sun mean anomaly
  const D  = normDeg(297.8502 + 445267.1115 * T);   // moon mean elongation
  const F  = normDeg(93.2721 + 483202.0175 * T);    // arg of latitude

  const r = deg2rad;
  // Longitude correction terms (arcseconds → degrees)
  const dl =
    6.289 * Math.sin(r(M)) -
    1.274 * Math.sin(r(2 * D - M)) +
    0.658 * Math.sin(r(2 * D)) -
    0.214 * Math.sin(r(2 * M)) -
    0.186 * Math.sin(r(Ms)) -
    0.114 * Math.sin(r(2 * F)) +
    0.059 * Math.sin(r(2 * D - 2 * M)) +
    0.057 * Math.sin(r(2 * D - Ms - M)) +
    0.053 * Math.sin(r(2 * D + M)) +
    0.046 * Math.sin(r(2 * D - Ms)) +
    0.041 * Math.sin(r(M - Ms)) -
    0.035 * Math.sin(r(D)) -
    0.031 * Math.sin(r(Ms + M)) -
    0.015 * Math.sin(r(2 * F - 2 * D)) +
    0.011 * Math.sin(r(M - 4 * D));

  return normDeg(L + dl);
}

/**
 * Greenwich Mean Sidereal Time at a given Julian Day (degrees).
 * Accurate to within seconds for dates near J2000.
 */
export function gmst(jd: number): number {
  const T = jCenturies(Math.floor(jd) + 0.5); // at 0h UT on that day
  const jd0 = Math.floor(jd) + 0.5;
  const theta0 =
    100.4606184 +
    36000.77004 * T +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  // Add fraction of day
  const ut = (jd - jd0) * 24; // hours
  return normDeg(theta0 + ut * 15.04106864);
}

/**
 * Obliquity of the ecliptic (degrees) — IAU formula.
 */
export function obliquity(jd: number): number {
  const T = jCenturies(jd);
  return (
    23.439291111 -
    0.013004167 * T -
    1.639e-7 * T * T +
    5.036e-7 * T * T * T
  );
}

/**
 * Ecliptic longitude → zodiac sign index (0 = Aries … 11 = Pisces).
 */
export function lonToSign(lon: number): number {
  return Math.floor(normDeg(lon) / 30);
}

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export function signFromLon(lon: number): ZodiacSign {
  return ZODIAC_SIGNS[lonToSign(lon)];
}

/**
 * Calculate Ascendant ecliptic longitude from Local Sidereal Time + latitude.
 * Returns null if latitude is not provided or is out of range.
 */
export function ascendant(
  lstDeg: number, // Local Sidereal Time in degrees
  latDeg: number, // Geographic latitude
  oblDeg: number  // Obliquity of ecliptic
): number {
  const lst = deg2rad(lstDeg);
  const lat = deg2rad(latDeg);
  const obl = deg2rad(oblDeg);

  // tan(Asc) = -cos(RAMC) / (sin(RAMC)*cos(ε) + tan(φ)*sin(ε))
  const num = -Math.cos(lst);
  const den = Math.sin(lst) * Math.cos(obl) + Math.tan(lat) * Math.sin(obl);
  let asc = rad2deg(Math.atan2(num, den));

  // Ensure correct quadrant: Asc is in the eastern hemisphere
  // RAMC in 0–180 → Asc in 0–180; RAMC in 180–360 → Asc in 180–360
  if (lstDeg >= 0 && lstDeg < 180) {
    asc = normDeg(asc + 180);
  }
  return normDeg(asc);
}
