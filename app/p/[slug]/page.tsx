import { notFound } from "next/navigation";
import { getPassportBySlug } from "@/app/actions/passport";
import { DecodingPoller } from "./DecodingPoller";
import { PassportView } from "./PassportView";
import type { Metadata } from "next";

// Always fetch fresh data — passport status changes from "decoding" → "complete"
export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const passport = await getPassportBySlug(params.slug);
  if (!passport) return { title: "Passport not found — You, Decoded" };

  const name = passport.first_name ? `${passport.first_name}'s` : "Your";
  const headline =
    passport.ai_results?.cosmic_headline?.headline ?? "18 lenses, one you";

  return {
    title: `${name} Passport — You, Decoded`,
    description: `${headline}. Astrology, MBTI, Enneagram, Human Design and 14 more — decoded into one beautiful passport.`,
    openGraph: {
      title: `${name} Personality Passport`,
      description: `"${headline}"`,
      type: "website",
    },
  };
}

export default async function PassportPage({ params }: Props) {
  const passport = await getPassportBySlug(params.slug);
  if (!passport) notFound();

  const isDecoding = passport.status === "decoding" || passport.status === "processing" || passport.status === "intake";
  const isComplete = passport.status === "complete";
  const isError = passport.status === "error";

  if (isDecoding) {
    const name = passport.first_name;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
        {/* Loading animation */}
        <div className="space-y-1">
          {["✦", "✧", "✦"].map((star, i) => (
            <span
              key={i}
              className="block text-gold-400 text-2xl animate-twinkle"
              style={{ animationDelay: `${i * 400}ms` }}
            >
              {star}
            </span>
          ))}
        </div>

        <div className="animate-fade-up space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl text-gold-400">
            {name ? `Reading ${name}…` : "Reading the stars…"}
          </h1>
          <p className="text-stardust/60 text-base max-w-sm leading-relaxed">
            Calculating 8 cosmic systems, scoring 7 personality maps, and
            weaving it all into something that's actually yours.
            Usually about a minute.
          </p>
        </div>

        {/* Inline progress steps */}
        <div className="text-sm text-stardust/30 space-y-1 animate-fade-up">
          <p>Birth data · Chinese zodiac · Numerology · BaZi · Human Design</p>
          <p>MBTI · Big Five · Enneagram · Attachment · Dosha · Archetypes</p>
          <p className="text-oracle/50">Shadow Profile · Core Gift · Cosmic Headline</p>
        </div>

        {/* Triggers decode API + polls for completion */}
        <DecodingPoller slug={params.slug} />
      </div>
    );
  }

  if (isComplete) {
    return <PassportView passport={passport as any} />;
  }

  // Decode failed — status was set to "error" by the decode route
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-display text-3xl text-gold-400">Something went sideways</h1>
          <p className="mt-3 text-stardust/60">
            The decode hit an error. This can happen if the stars were briefly unreachable.
          </p>
          <a href="/" className="mt-6 inline-block text-gold-500 hover:text-gold-400">
            Start over →
          </a>
        </div>
      </div>
    );
  }

  // Unexpected status (shouldn't reach here)
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <h1 className="font-display text-3xl text-gold-400">Something went sideways</h1>
        <p className="mt-3 text-stardust/60">
          This passport couldn't be decoded. Please try again from the beginning.
        </p>
        <a href="/" className="mt-6 inline-block text-gold-500 hover:text-gold-400">
          Start over →
        </a>
      </div>
    </div>
  );
}
