import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: "copper" | "cosmos" | "psyche" | "oracle" | "none";
}

const accentClasses: Record<string, string> = {
  copper:  "border-copper-500/25",
  cosmos:  "border-cosmos/25",
  psyche:  "border-psyche/25",
  oracle:  "border-oracle/25",
  none:    "border-night-700",
};

export function GlassCard({
  children,
  className = "",
  accent = "none",
}: GlassCardProps) {
  return (
    <div
      className={`rounded-xl border bg-night-900 p-6 shadow-card ${accentClasses[accent]} ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {children}
    </div>
  );
}
