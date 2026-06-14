import Link from "next/link";
import { MODALITIES } from "@/lib/constants/modalities";

export default function LandingPage() {
  const counts = {
    birth: MODALITIES.filter((m) => m.source === "birth").length,
    quiz:  MODALITIES.filter((m) => m.source === "quiz").length,
    ai:    MODALITIES.filter((m) => m.source === "ai").length,
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      {/* Directional glow — not aurora blob */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(123,159,212,0.09) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 75% 40%, rgba(212,135,122,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative">
        <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-stardust/50 animate-fade-up">
          Your personality passport
        </p>

        <h1 className="font-display font-light text-[clamp(64px,10vw,96px)] leading-[1.0] text-starlight letter-spacing-[-0.02em] animate-fade-up">
          You,<br />
          <em className="text-copper-400">Decoded</em>
        </h1>

        <p className="mt-8 max-w-md text-[15px] font-light text-stardust/75 leading-relaxed animate-fade-up">
          {MODALITIES.length} lenses, one you. Your birth chart, your psyche,
          and the patterns that only emerge when you look at everything at once.
        </p>

        <div className="mt-8 flex justify-center gap-10 text-[12px] text-stardust/50 animate-fade-up">
          <span>
            <strong className="text-cosmos font-normal">{counts.birth}</strong>
            {" "}from your birth
          </span>
          <span>
            <strong className="text-psyche font-normal">{counts.quiz}</strong>
            {" "}from the quiz
          </span>
          <span>
            <strong className="text-oracle font-normal">{counts.ai}</strong>
            {" "}synthesised
          </span>
        </div>

        <Link
          href="/intake"
          className="mt-12 inline-block rounded-full bg-copper-500 px-10 py-[14px]
                     text-[14px] font-medium tracking-[0.04em] text-night-950
                     shadow-copper transition-[background,transform] duration-200
                     hover:bg-copper-400 active:scale-[0.97] animate-fade-up"
        >
          Begin decoding →
        </Link>

        <p className="mt-16 max-w-xs text-[11px] text-stardust/30 leading-relaxed animate-fade-up">
          For fun, not fate. The only authority on you is you.
        </p>
      </div>
    </div>
  );
}
