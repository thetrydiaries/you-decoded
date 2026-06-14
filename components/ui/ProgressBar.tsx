"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  /** accent colour class e.g. "bg-psyche" */
  colorClass?: string;
}

export function ProgressBar({
  current,
  total,
  colorClass = "bg-copper-500",
}: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full" aria-label={`Question ${current} of ${total}`}>
      <div className="flex items-center justify-between mb-2 text-xs text-stardust/60">
        <span>{current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-px w-full bg-night-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
