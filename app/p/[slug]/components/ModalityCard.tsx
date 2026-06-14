"use client";

import { useRef, useEffect, useState } from "react";
import type { ModalityDef, ModalityResult } from "@/lib/types";

interface Props {
  def: ModalityDef;
  result: ModalityResult;
  index: number;
}

const SOURCE_PIP: Record<string, string> = {
  birth: "bg-cosmos",
  quiz:  "bg-psyche",
  ai:    "bg-oracle",
};

const SOURCE_LEFT_BORDER: Record<string, string> = {
  birth: "rgba(123,159,212,0.28)",
  quiz:  "rgba(107,181,160,0.28)",
  ai:    "rgba(212,135,122,0.28)",
};

const SOURCE_LABEL: Record<string, string> = {
  birth: "From your birth",
  quiz:  "From the quiz",
  ai:    "Deeper reading",
};

export function ModalityCard({ def, result, index }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasDetails = result.details && Object.keys(result.details).length > 0;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = (index % 8) * 80;
          setTimeout(() => el.classList.add("is-visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="modality-card-reveal rounded-xl border border-night-700 border-l-2 bg-night-900 overflow-hidden
                 transition-[border-color] duration-[250ms] hover:border-night-600"
      style={{
        borderLeftColor: SOURCE_LEFT_BORDER[def.source],
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="p-6">
        {/* Source tag — full stardust for WCAG AA */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${SOURCE_PIP[def.source]}`} />
          <span className="text-[9px] uppercase tracking-[0.4em] text-stardust">
            {SOURCE_LABEL[def.source]}
          </span>
        </div>

        {/* Modality name — full stardust */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-stardust mb-1.5">
          {def.name}
        </p>

        {/* Headline — starts blurred, sharpens into view */}
        <h3 className="card-headline-blur font-display text-2xl sm:text-[28px] text-starlight leading-tight mb-1">
          {result.headline}
        </h3>

        {result.subline && (
          <p className="text-[11px] text-stardust tracking-[0.05em] mb-4">
            {result.subline}
          </p>
        )}

        {result.summary && (
          <p className="text-[13px] text-stardust leading-relaxed">
            {result.summary}
          </p>
        )}

        {hasDetails && (
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="mt-4 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em]
                       text-stardust hover:text-starlight transition-colors duration-200"
          >
            Details
            <span
              className="inline-block transition-transform duration-300"
              style={{ transform: detailsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ↓
            </span>
          </button>
        )}
      </div>

      {/* Expandable details — grid trick */}
      <div className={`details-panel ${detailsOpen ? "is-open" : ""}`}>
        <div className="details-inner">
          <div className="border-t border-night-700 px-6 py-5 space-y-2 bg-black/20">
            {Object.entries(result.details ?? {}).map(([key, value]) => (
              <div key={key} className="flex gap-4 text-[12px]">
                <span className="text-stardust capitalize min-w-[100px]">
                  {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim()}
                </span>
                <span className="text-starlight">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
