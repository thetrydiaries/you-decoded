import { MODALITIES } from "@/lib/constants/modalities";
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

function ConstellationDivider() {
  return (
    <div className="constellation-divider my-16">
      <span className="c-line" />
      {/* Purely decorative dots — exempt from contrast requirements */}
      <span className="c-dots" aria-hidden>
        <span className="w-[3px] h-[3px] rounded-full bg-stardust/20" />
        <span className="w-[5px] h-[5px] rounded-full bg-stardust/35" />
        <span className="w-[3px] h-[3px] rounded-full bg-stardust/20" />
      </span>
      <span className="c-line" />
    </div>
  );
}

export function PassportView({ passport }: Props) {
  const name = passport.first_name;
  const allResults: Record<string, ModalityResult> = {
    ...(passport.computed_results ?? {}),
    ...(passport.quiz_results  ?? {}),
    ...(passport.ai_results    ?? {}),
  };

  const orderedModalities = MODALITIES.filter((m) => allResults[m.id]);
  const birthModalities   = orderedModalities.filter((m) => m.source === "birth");
  const quizModalities    = orderedModalities.filter((m) => m.source === "quiz");
  const aiModalities      = orderedModalities.filter((m) => m.source === "ai");

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative px-6 py-24 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(123,159,212,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-xl animate-fade-up">
          {name && (
            <p className="text-[10px] uppercase tracking-[0.4em] text-stardust mb-3">
              {name}&rsquo;s
            </p>
          )}
          <h1 className="font-display font-light text-[clamp(52px,8vw,80px)] text-starlight leading-[1.05] mb-5">
            Personality<br />
            <em className="text-copper-400">Passport</em>
          </h1>
          {/* Birth meta — decorative, small, aria-hidden since info is redundant */}
          <p className="text-[12px] text-stardust mb-2" aria-hidden>
            {passport.birth_date.split("-").reverse().join(".")}
            <span className="mx-2 opacity-40">·</span>
            {passport.birth_place}
          </p>
          <p className="text-[10px] text-stardust mb-10" aria-hidden>
            {orderedModalities.length} lenses decoded
          </p>
          <ShareButton slug={passport.share_slug} name={name} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">

        {/* ── Cosmic Headline ─────────────────────────────────────────────── */}
        {allResults.cosmic_headline && (
          <section className="mb-16 animate-fade-up">
            <div
              className="rounded-xl border border-copper-500/20 p-10 sm:p-12 text-center relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(196,138,69,0.07) 0%, transparent 70%), #09102A",
              }}
            >
              {/* Label — full copper for contrast */}
              <p className="text-[9px] uppercase tracking-[0.45em] text-copper-500 mb-5">
                Your headline
              </p>
              <p className="font-display text-3xl sm:text-[36px] font-light text-starlight leading-snug mb-4">
                &ldquo;{allResults.cosmic_headline.headline}&rdquo;
              </p>
              {allResults.cosmic_headline.subline && (
                <p className="text-[12px] text-stardust mb-6 tracking-[0.05em]">
                  {allResults.cosmic_headline.subline}
                </p>
              )}
              {allResults.cosmic_headline.summary && (
                <p className="text-[14px] text-stardust leading-relaxed max-w-lg mx-auto">
                  {allResults.cosmic_headline.summary}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ── Common Threads ──────────────────────────────────────────────── */}
        {passport.overall_summary && (
          <section className="mb-16 animate-fade-up">
            <div className="border-l border-copper-500/30 pl-6 py-1">
              <p className="text-[9px] uppercase tracking-[0.45em] text-copper-500 mb-3">
                Common Threads
              </p>
              <p className="text-[15px] text-stardust leading-relaxed max-w-2xl">
                {passport.overall_summary}
              </p>
            </div>
          </section>
        )}

        {/* ── Birth modalities ────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-[6px] h-[6px] rounded-full bg-cosmos flex-shrink-0" aria-hidden />
            <h2 className="text-[9px] uppercase tracking-[0.45em] text-cosmos">
              Written in your birth
            </h2>
            <div className="flex-1 h-px bg-night-700" aria-hidden />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {birthModalities.map((def, i) => (
              <ModalityCard key={def.id} def={def} result={allResults[def.id]} index={i} />
            ))}
          </div>
        </section>

        <ConstellationDivider />

        {/* ── Quiz modalities ─────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-[6px] h-[6px] rounded-full bg-psyche flex-shrink-0" aria-hidden />
            <h2 className="text-[9px] uppercase tracking-[0.45em] text-psyche">
              Mapped through your answers
            </h2>
            <div className="flex-1 h-px bg-night-700" aria-hidden />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {quizModalities.map((def, i) => (
              <ModalityCard key={def.id} def={def} result={allResults[def.id]} index={i} />
            ))}
          </div>
        </section>

        <ConstellationDivider />

        {/* ── AI synthesis ────────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-[6px] h-[6px] rounded-full bg-oracle flex-shrink-0" aria-hidden />
            <h2 className="text-[9px] uppercase tracking-[0.45em] text-oracle">
              The deeper picture
            </h2>
            <div className="flex-1 h-px bg-night-700" aria-hidden />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {aiModalities
              .filter((m) => m.id !== "cosmic_headline")
              .map((def, i) => (
                <ModalityCard key={def.id} def={def} result={allResults[def.id]} index={i} />
              ))}
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="text-center space-y-5 pt-10 border-t border-night-700">
          <ShareButton slug={passport.share_slug} name={name} />
          {/* Legal — small, purely informational, low contrast intentional for visual weight */}
          <p className="text-[11px] text-stardust max-w-sm mx-auto leading-relaxed">
            For fun, not fate. You, Decoded is entertainment — not psychological,
            medical, or astrological advice. The only authority on you is you.
          </p>
          <a
            href="/"
            className="inline-block text-[11px] text-stardust hover:text-starlight
                       transition-colors duration-200 tracking-[0.1em]"
          >
            Decode someone else →
          </a>
        </footer>

      </div>
    </div>
  );
}
