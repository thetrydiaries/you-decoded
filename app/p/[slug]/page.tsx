import { notFound } from "next/navigation";
import { getPassportBySlug } from "@/app/actions/passport";
import { DecodingPoller } from "./DecodingPoller";
import { PassportView } from "./PassportView";
import type { Metadata } from "next";

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
  const isError    = passport.status === "error";

  if (isDecoding) {
    const name = passport.first_name;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8">
        {/* Pulsing dots — simple, not overdone */}
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-copper-500 animate-twinkle"
              style={{ animationDelay: `${i * 300}ms` }}
            />
          ))}
        </div>

        <div className="space-y-3 max-w-sm">
          <h1 className="font-display text-4xl sm:text-5xl text-starlight font-light">
            {name ? `Reading ${name}…` : "Reading the stars…"}
          </h1>
          <p className="text-stardust text-base leading-relaxed">
            Calculating 8 cosmic systems, scoring 7 personality maps, then
            weaving it all into something that&rsquo;s actually yours.
          </p>
          <p className="text-stardust/50 text-sm">Usually about a minute.</p>
        </div>

        <div className="text-[11px] text-stardust/40 space-y-1.5 leading-relaxed">
          <p>Birth chart · Chinese zodiac · Numerology · BaZi · Human Design</p>
          <p>MBTI · Big Five · Enneagram · Attachment · Dosha · Archetypes</p>
          <p className="text-oracle/60">Shadow Profile · Core Gift · Cosmic Headline</p>
        </div>

        <DecodingPoller slug={params.slug} />
      </div>
    );
  }

  if (isComplete) {
    return <PassportView passport={passport as any} />;
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div className="space-y-4">
        <h1 className="font-display text-3xl text-starlight font-light">
          Something went sideways
        </h1>
        <p className="text-stardust max-w-xs leading-relaxed">
          {isError
            ? "The decode hit an error. This can happen if the stars were briefly unreachable."
            : "This passport couldn't be decoded. Please try again from the beginning."}
        </p>
        <a
          href="/"
          className="inline-block text-copper-500 hover:text-copper-400 transition-colors text-sm"
        >
          Start over →
        </a>
      </div>
    </div>
  );
}
