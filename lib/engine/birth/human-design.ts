import type { BirthData, ModalityResult } from "@/lib/types";
import { toJD, sunLongitude, jCenturies } from "@/lib/engine/astro-helpers";

/**
 * Human Design — simplified Type + Strategy + Authority calculation.
 *
 * Full HD requires a complete ephemeris for all planets at birth AND
 * ~88 days before birth. This implementation uses the Sun position
 * (most significant planet in HD) at both dates to derive an approximate
 * type. Results are entertainment-grade, not authoritative.
 *
 * Type distribution: Generator ~37%, Manifesting Generator ~33%,
 * Projector ~20%, Manifestor ~8%, Reflector ~1%.
 */

interface HDType {
  type: string;
  strategy: string;
  notSelf: string;
  signature: string;
  aura: string;
  description: string;
}

const HD_TYPES: Record<string, HDType> = {
  Generator: {
    type: "Generator",
    strategy: "Wait to Respond",
    notSelf: "Frustration",
    signature: "Satisfaction",
    aura: "Open and enveloping",
    description: "The life-force of the world. Generators have a defined Sacral centre — sustainable, magnetic energy. When you respond to life rather than initiating, you find yourself in the right place at the right time.",
  },
  "Manifesting Generator": {
    type: "Manifesting Generator",
    strategy: "Wait to Respond, then Inform",
    notSelf: "Frustration and Anger",
    signature: "Satisfaction and Peace",
    aura: "Open and enveloping",
    description: "Multi-passionate, fast-moving, built for multiple things at once. You respond, then act — and you move quickly once the signal is clear. Others may not keep up with your pace, and that's not your problem.",
  },
  Projector: {
    type: "Projector",
    strategy: "Wait for the Invitation",
    notSelf: "Bitterness",
    signature: "Success",
    aura: "Focused and absorbing",
    description: "The guides and directors of the new world. Projectors are here to work with and direct energy — not to generate it. Success comes through recognition and invitation, not pushing harder.",
  },
  Manifestor: {
    type: "Manifestor",
    strategy: "Inform (before acting)",
    notSelf: "Anger",
    signature: "Peace",
    aura: "Closed and repelling",
    description: "The initiators — rare, independent, built to start things others will carry. Manifestors don't need permission, but informing others before acting reduces the resistance that can follow in your wake.",
  },
  Reflector: {
    type: "Reflector",
    strategy: "Wait a Lunar Cycle",
    notSelf: "Disappointment",
    signature: "Surprise and Delight",
    aura: "Resistant and sampling",
    description: "The rarest and most sensitive type. Reflectors sample and mirror the health of their environment. Your clarity comes slowly, over a lunar month — major decisions are never for the same day.",
  },
};

const HD_PROFILES = [
  "1/3 — Investigator/Martyr",
  "1/4 — Investigator/Opportunist",
  "2/4 — Hermit/Opportunist",
  "2/5 — Hermit/Heretic",
  "3/5 — Martyr/Heretic",
  "3/6 — Martyr/Role Model",
  "4/6 — Opportunist/Role Model",
  "4/1 — Opportunist/Investigator",
  "5/1 — Heretic/Investigator",
  "5/2 — Heretic/Hermit",
  "6/2 — Role Model/Hermit",
  "6/3 — Role Model/Martyr",
];

const PROFILE_LINES: Record<string, string> = {
  "1": "Investigator — foundation through knowledge",
  "2": "Hermit — natural talent emerging from solitude",
  "3": "Martyr — learning through trial and error",
  "4": "Opportunist — influence through network",
  "5": "Heretic — here to challenge and change",
  "6": "Role Model — trial then transcendence",
};

/** Map sun gate (1–64) to HD type (simplified, gate-based heuristic). */
function gateToType(gate: number): string {
  // Sacral gates (Generator): 3,5,9,14,27,29,34,42,59
  const sacralGates = new Set([3, 5, 9, 14, 27, 29, 34, 42, 59]);
  // Throat-connected sacral (MG): 20, 34, 5 when connected to Throat via channel
  const mgGates = new Set([20, 16, 35, 45, 12, 56, 31, 33, 8, 23]);
  // Manifestor gates (motor to throat): 21, 26, 40, 44
  const manifestorGates = new Set([21, 26, 40, 44]);

  if (manifestorGates.has(gate)) return "Manifestor";
  if (mgGates.has(gate)) return "Manifesting Generator";
  if (sacralGates.has(gate)) return "Generator";

  // Distribute remaining: mostly Projector, rare Reflector
  if (gate % 17 === 0) return "Reflector"; // ~5.8% of gates → ~1% actual
  return "Projector";
}

/** Sun longitude → Human Design gate (1–64). Each gate = 360/64 ≈ 5.625°. */
function lonToHDGate(lon: number): number {
  // HD wheel starts at 2° Aries (not 0°), offset by 58°
  const adjusted = ((lon - 58 + 360) % 360 + 360) % 360;
  return (Math.floor(adjusted / (360 / 64)) % 64) + 1;
}

/** Derive HD Line (1–6) from birth minute/second — simplified: use birth day. */
function birthToLine(jd: number): number {
  return (Math.floor(jd) % 6) + 1;
}

export function computeHumanDesign(birth: BirthData): ModalityResult {
  const [yearStr, monthStr, dayStr] = birth.date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const timeFraction = birth.time
    ? (() => { const [h, m] = birth.time.split(":").map(Number); return (h + m / 60) / 24; })()
    : 0.5;
  const lngOffset = birth.lng ? birth.lng / 360 : 0;
  const jd = toJD(year, month, day) - 0.5 + timeFraction - lngOffset;

  // Conscious sun (birth)
  const sunLon = sunLongitude(jd);
  const consciousGate = lonToHDGate(sunLon);

  // Unconscious sun (~88 days before)
  const jdUnconscious = jd - 88;
  const sunLonU = sunLongitude(jdUnconscious);
  const unconsciousGate = lonToHDGate(sunLonU);

  // Type from both gates (conscious takes precedence)
  const typeFromConscious = gateToType(consciousGate);
  const typeFromUnconscious = gateToType(unconsciousGate);

  // Resolve: MG > Generator, Manifestor > MG, Reflector rare
  let type = typeFromConscious;
  if (typeFromUnconscious === "Reflector" && typeFromConscious === "Reflector") type = "Reflector";
  else if (typeFromConscious === "Manifestor" || typeFromUnconscious === "Manifestor") type = "Manifestor";
  else if (typeFromConscious === "Manifesting Generator" || typeFromUnconscious === "Manifesting Generator") type = "Manifesting Generator";

  // Profile line
  const consciousLine = birthToLine(jd);
  const unconsciousLine = ((consciousLine + 2) % 6) + 1; // complementary
  const profileKey = `${consciousLine}/${unconsciousLine}`;
  const profile = HD_PROFILES.find((p) => p.startsWith(profileKey)) ?? `${profileKey}`;

  const hdType = HD_TYPES[type];

  return {
    modalityId: "human_design",
    headline: `${type} · ${profile}`,
    subline: `Strategy: ${hdType.strategy} · Signature: ${hdType.signature}`,
    summary: "",
    details: {
      type,
      profile,
      strategy: hdType.strategy,
      authority: "Emotional / Sacral (simplified)", // full authority needs all planets
      signature: hdType.signature,
      notSelf: hdType.notSelf,
      aura: hdType.aura,
      consciousGate: consciousGate.toString(),
      unconsciousGate: unconsciousGate.toString(),
      consciousLine: PROFILE_LINES[consciousLine.toString()] ?? `Line ${consciousLine}`,
      unconsciousLine: PROFILE_LINES[unconsciousLine.toString()] ?? `Line ${unconsciousLine}`,
    },
  };
}
