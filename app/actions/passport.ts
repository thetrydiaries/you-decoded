"use server";

import { nanoid } from "nanoid";
import { unstable_noStore as noStore } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { BirthData, QuizAnswers } from "@/lib/types";

interface CreatePassportInput {
  firstName: string | null;
  birth: BirthData;
  quizAnswers: QuizAnswers;
}

/**
 * Geocodes the birth place via Nominatim (OpenStreetMap, free, no key).
 * Returns { lat, lng, displayName } or nulls on failure.
 */
async function geocode(place: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "you-decoded/1.0 (contact@yourdomain.com)" },
      next: { revalidate: 86400 }, // cache geocodes for 24h
    });
    if (!res.ok) return { lat: null, lng: null };
    const data = await res.json();
    if (!data[0]) return { lat: null, lng: null };
    return {
      lat: parseFloat(data[0].lat) as number,
      lng: parseFloat(data[0].lon) as number,
    };
  } catch {
    return { lat: null, lng: null };
  }
}

/**
 * Estimates IANA timezone from longitude.
 * Rough approximation (±1 timezone) — good enough for birth-chart purposes.
 * In production, replace with a proper tz lookup (e.g. GeoNames, TimeZoneDB).
 */
function estimateTimezone(lat: number | null, lng: number | null): string | null {
  if (lng === null) return null;
  const offsetHours = Math.round(lng / 15);
  // Map offset to a canonical IANA name (common ones)
  const offsetToTz: Record<number, string> = {
    [-12]: "Etc/GMT+12",
    [-11]: "Pacific/Pago_Pago",
    [-10]: "Pacific/Honolulu",
    [-9]: "America/Anchorage",
    [-8]: "America/Los_Angeles",
    [-7]: "America/Denver",
    [-6]: "America/Chicago",
    [-5]: "America/New_York",
    [-4]: "America/Halifax",
    [-3]: "America/Sao_Paulo",
    [-2]: "Atlantic/South_Georgia",
    [-1]: "Atlantic/Azores",
    [0]: "Europe/London",
    [1]: "Europe/Paris",
    [2]: "Europe/Helsinki",
    [3]: "Europe/Moscow",
    [4]: "Asia/Dubai",
    [5]: "Asia/Karachi",
    [6]: "Asia/Dhaka",
    [7]: "Asia/Bangkok",
    [8]: "Asia/Shanghai",
    [9]: "Asia/Tokyo",
    [10]: "Australia/Sydney",
    [11]: "Pacific/Noumea",
    [12]: "Pacific/Auckland",
  };
  return offsetToTz[offsetHours] ?? `Etc/GMT${offsetHours >= 0 ? `-${offsetHours}` : `+${Math.abs(offsetHours)}`}`;
}

/**
 * Creates a new passport record in Supabase (status = 'quiz' since all
 * intake data is now collected) and returns the share_slug.
 *
 * The actual decoding (calculating modality results + Claude synthesis)
 * is triggered from the /p/[slug] page via a separate API route so the
 * redirect is immediate and the user sees a beautiful "decoding" loading state.
 */
export async function createPassport({
  firstName,
  birth,
  quizAnswers,
}: CreatePassportInput): Promise<string> {
  // Generate a URL-safe share slug, e.g. "V1StGXR8_Z5jdHi"
  const shareSlug = nanoid(14);

  // Geocode birth place for astrology calculations
  const { lat, lng } = await geocode(birth.place);
  const timezone = estimateTimezone(lat, lng);

  const supabase = supabaseAdmin();

  const { error } = await supabase.from("passports").insert({
    share_slug: shareSlug,
    first_name: firstName,
    birth_date: birth.date,
    birth_time: birth.time ?? null,
    birth_place: birth.place,
    birth_lat: lat,
    birth_lng: lng,
    birth_tz: timezone,
    quiz_answers: quizAnswers,
    status: "decoding",
  });

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error("Failed to create passport");
  }

  return shareSlug;
}

/**
 * Fetches a passport by its share_slug for the results page.
 * noStore() opts this out of Next.js data cache — critical because
 * passport status changes from "decoding" → "complete" after the decode runs.
 */
export async function getPassportBySlug(slug: string) {
  noStore();
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("passports")
    .select("*")
    .eq("share_slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}
