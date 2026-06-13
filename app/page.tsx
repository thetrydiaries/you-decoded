import Link from "next/link";
import { MODALITIES } from "@/lib/constants/modalities";

export default function LandingPage() {
  const counts = {
    birth: MODALITIES.filter((m) => m.source === "birth").length,
    quiz: MODALITIES.filter((m) => m.source === "quiz").length,
    ai: MODALITIES.filter((m) => m.source === "ai").length,
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.35em] text-stardust animate-fade-up">
        Your personality passport
      </p>
      <h1 className="font-display text-6xl font-semibold text-gold-400 sm:text-7xl animate-fade-up">
        You, Decoded
      </h1>
      <p className="mt-6 max-w-xl text-lg font-light text-stardust animate-fade-up">
        {MODALITIES.length} lenses, one you. Your birth chart, your psyche, and
        a few things only the stars (and Claude) can see — decoded into a
        single beautiful passport.
      </p>

      <div className="mt-10 flex gap-8 text-sm text-stardust animate-fade-up">
        <span>
          <strong className="text-cosmos">{counts.birth}</strong> from your
          birth
        </span>
        <span>
          <strong className="text-psyche">{counts.quiz}</strong> from the quiz
        </span>
        <span>
          <strong className="text-oracle">{counts.ai}</strong> AI-synthesized
        </span>
      </div>

      <Link
        href="/intake"
        className="mt-12 rounded-full bg-gold-500 px-10 py-4 text-lg font-medium text-night-950 shadow-glow transition hover:bg-gold-400 animate-fade-up"
      >
        Begin decoding →
      </Link>

      <p className="mt-16 max-w-md text-xs text-stardust/60">
        For fun, not fate. You, Decoded is entertainment — not psychological,
        medical, or astrological advice. The only authority on you is you. ✨
      </p>
    </div>
  );
}
