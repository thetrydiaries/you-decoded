"use client";

import { useState } from "react";
import type { ModalityDef, ModalityResult } from "@/lib/types";

interface Props {
  def: ModalityDef;
  result: ModalityResult;
  index: number;
}

const SOURCE_ACCENT: Record<string, string> = {
  birth: "border-cosmos/40 hover:border-cosmos/70",
  quiz:  "border-psyche/40 hover:border-psyche/70",
  ai:    "border-oracle/40 hover:border-oracle/70",
};

const SOURCE_DOT: Record<string, string> = {
  birth: "bg-cosmos",
  quiz:  "bg-psyche",
  ai:    "bg-oracle",
};

const SOURCE_LABEL: Record<string, string> = {
  birth: "From your birth",
  quiz:  "From the quiz",
  ai:    "Deeper reading",
};

export function ModalityCard({ def, result, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = result.details && Object.keys(result.details).length > 0;

  const delay = `${(index % 8) * 80}ms`;

  return (
    <div
      className={`animate-fade-up rounded-2xl border bg-night-900 bg-card-sheen shadow-card
                 transition-all duration-300 overflow-hidden
                 ${SOURCE_ACCENT[def.source]}`}
      style={{ animationDelay: delay }}
    >
      <div className="h-full">
        <div className="p-6">
          {/* Source tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-1.5 h-1.5 rounded-full ${SOURCE_DOT[def.source]}`} />
            <span className="text-xs uppercase tracking-widest text-stardust/40">
              {SOURCE_LABEL[def.source]}
            </span>
          </div>

          {/* Modality name */}
          <p className="text-xs font-medium text-stardust/60 mb-1">{def.name}</p>

          {/* Headline result */}
          <h3 className="font-display text-2xl sm:text-3xl text-starlight leading-tight mb-1">
            {result.headline}
          </h3>

          {/* Subline */}
          {result.subline && (
            <p className="text-xs text-stardust/50 mb-4">{result.subline}</p>
          )}

          {/* Summary paragraph */}
          {result.summary && (
            <p className="text-sm text-stardust leading-relaxed">{result.summary}</p>
          )}

          {/* Expand / collapse details */}
          {hasDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 text-xs text-stardust/40 hover:text-stardust/70 transition-colors flex items-center gap-1"
            >
              {expanded ? "Close ↑" : "Details ↓"}
            </button>
          )}
        </div>

        {/* Expanded details panel */}
        {expanded && hasDetails && (
          <div className="border-t border-night-700 px-6 py-5 space-y-2 bg-night-950/40">
            {Object.entries(result.details ?? {}).map(([key, value]) => (
              <div key={key} className="flex gap-3 text-sm">
                <span className="text-stardust/40 capitalize min-w-[120px]">
                  {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim()}
                </span>
                <span className="text-stardust">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
