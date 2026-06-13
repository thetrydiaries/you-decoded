import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** add a subtle coloured glow on the border */
  accent?: "gold" | "cosmos" | "psyche" | "oracle" | "none";
}

const accentClasses: Record<string, string> = {
  gold: "border-gold-500/30 shadow-glow",
  cosmos: "border-cosmos/30 shadow-glow-violet",
  psyche: "border-psyche/30",
  oracle: "border-oracle/30",
  none: "border-night-700",
};

export function GlassCard({
  children,
  className = "",
  accent = "none",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-2xl border bg-night-900 bg-card-sheen p-6 shadow-card
        ${accentClasses[accent]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
