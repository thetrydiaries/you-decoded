import { MODALITIES, MODALITY_BY_ID } from "@/lib/constants/modalities";
import type { ModalityResult } from "@/lib/types";
import { ModalityCard } from "./components/ModalityCard";
import { ShareButton } from "./components/ShareButton";

interface PassportRow {
  share_slug: string;
  first_name: string | null;
  birth_date: string;
  birth_place: string;
  computed_results: Record<string, ModalityResult> | null;
  quiz_results: Record<string, ModalityResult> | null;
  ai_results: Record<string, ModalityResult> | null;
  overall_summary: string | null;
}

interface Props {
  passport: PassportRow;
}

export function PassportView({ passport }: Props) {
  const name = passport.first_name;
  const allResults: Record<string, ModalityResult> = {
    ...(passport.computed_results ?? {}),
    ...(passport.quiz_results ?? {}),
    ...(passport.ai_results ?? {}),
  };

  // Render modalities in the canonical order from the registry
  const orderedModalities = MODALITIES.filter((m) => allResults[m.id]);

  // Group for visual separation
  const birthModalities   = orderedModalities.filter((m) => m.source === "birth");
  const quizModalities    = orderedModalities.filter((m) => m.source === "quiz");
  const aiModalities      = orderedModalities.filter((m) => m.source === "ai");

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-6 py-20 text-center">
        <div className="absolute inset-0 bg-aurora pointer-events-none" />
        <div className="relative mx-auto max-w-2xl animate-fade-up">
          {name && (
            <p className="text-sm uppercase tracking-[0.3em] text-stardust/60 mb-3">
              {name}'s
            </p>
          )}
          <h1 className="font-display text-6xl sm:text-7xl text-gold-400 mb-4">
            Personality<br />Passport
          </h1>
          <p className="text-stardust/60 text-sm mb-2">
            {passport.birth_date.split("-").reverse().join(".")} · {passport.birth_place}
          </p>
          <p className="text-xs text-stardust/30 mb-8">
            18 lenses · {orderedModalities.length} decoded
          </p>
          <ShareButton slug={passport.share_slug} name={name} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24 space-y-20">

        {/* ── Cosmic Headline (pinned above everything) ─────────────────── */}
        {allResults.cosmic_headline && (
          <section className="animate-fade-up">
            <div className="rounded-3xl border border-oracle/50 bg-night-900 bg-card-sheen p-8 sm:p-10 text-center shadow-[0_0_60px_rgba(247,143,184,0.1)]">
              <p className="text-xs uppercase tracking-widest text-oracle/60 mb-4">Your cosmic headline</p>
              <p className="font-display text-3xl sm:text-4xl text-starlight leading-snug mb-3">
                "{allResults.cosmic_headline.headline}"
              </p>
              {allResults.cosmic_headline.subline && (
                <p className="text-stardust/50 text-sm mb-6">
                  {allResults.cosmic_headline.subline}
                </p>
              )}
              {allResults.cosmic_headline.summary && (
                <p className="text-stardust text-base leading-relaxed max-w-xl mx-auto">
                  {allResults.cosmic_headline.summary}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ── Common Threads (overall summary) ──────────────────────────── */}
        {passport.overall_summary && (
          <section className="animate-fade-up">
            <div className="border-l-2 border-gold-500/40 pl-6 py-1">
              <p className="text-xs uppercase tracking-widest text-gold-500/60 mb-3">
                Common Threads
              </p>
              <p className="text-stardust text-base sm:text-lg leading-relaxed max-w-3xl">
                {passport.overall_summary}
              </p>
            </div>
          </section>
        )}

        {/* ── Birth-data modalities ────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-cosmos" />
            <h2 className="text-xs uppercase tracking-widest text-cosmos/70">
              Written in your birth
            </h2>
            <div className="flex-1 h-px bg-night-700" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {birthModalities.map((def, i) => (
              <ModalityCard
                key={def.id}
                def={def}
                result={allResults[def.id]}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ── Quiz modalities ──────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-psyche" />
            <h2 className="text-xs uppercase tracking-widest text-psyche/70">
              Mapped through your answers
            </h2>
            <div className="flex-1 h-px bg-night-700" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {quizModalities.map((def, i) => (
              <ModalityCard
                key={def.id}
                def={def}
                result={allResults[def.id]}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ── AI synthesis modalities ────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-oracle" />
            <h2 className="text-xs uppercase tracking-widest text-oracle/70">
              Synthesized by Claude
            </h2>
            <div className="flex-1 h-px bg-night-700" />
          </div>
          <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-3">
            {aiModalities
              .filter((m) => m.id !== "cosmic_headline") // already shown above
              .map((def, i) => (
                <ModalityCard
                  key={def.id}
                  def={def}
                  result={allResults[def.id]}
                  index={i}
                />
              ))}
          </div>
        </section>

        {/* ── Footer disclaimer + share ─────────────────────────────── */}
        <footer className="text-center space-y-6 pt-8 border-t border-night-700">
          <ShareButton slug={passport.share_slug} name={name} />
          <p className="text-xs text-stardust/30 max-w-md mx-auto">
            ✨ You, Decoded is for fun, not fate. These results are entertainment — not
            psychological, medical, or astrological advice. The only authority on you is you.
          </p>
          <p className="text-xs text-stardust/20">
            <a href="/" className="hover:text-stardust/40 transition-colors">
              Decode someone else →
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
