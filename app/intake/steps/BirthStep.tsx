"use client";

import type { BirthData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

interface BirthStepProps {
  firstName: string;
  onFirstNameChange: (v: string) => void;
  birth: Partial<BirthData>;
  onBirthChange: (b: Partial<BirthData>) => void;
  onNext: () => void;
}

export function BirthStep({
  firstName,
  onFirstNameChange,
  birth,
  onBirthChange,
  onNext,
}: BirthStepProps) {
  const isValid =
    !!birth.date &&
    !!birth.place?.trim();

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-up">
      {/* Header */}
      <p className="text-sm uppercase tracking-[0.3em] text-stardust/60 mb-3">
        Step 1 of 2
      </p>
      <h1 className="font-display text-4xl sm:text-5xl text-gold-400 mb-3">
        Where did you begin?
      </h1>
      <p className="text-stardust/70 mb-10 text-base leading-relaxed">
        Eight of your results come from when and where you were born — your
        chart, your zodiac, your numerology, and more.
      </p>

      <GlassCard className="space-y-6" accent="gold">
        {/* Name */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-stardust/50 mb-2">
            First name <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="How should we address you?"
            className="input-field"
          />
        </div>

        {/* Birth date */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-stardust/50 mb-2">
            Date of birth <span className="text-oracle">*</span>
          </label>
          <input
            type="date"
            value={birth.date ?? ""}
            onChange={(e) => onBirthChange({ ...birth, date: e.target.value })}
            className="input-field"
            required
          />
        </div>

        {/* Birth time */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-stardust/50 mb-2">
            Time of birth{" "}
            <span className="normal-case tracking-normal text-stardust/40">
              — optional, but unlocks Rising sign + Human Design
            </span>
          </label>
          <input
            type="time"
            value={birth.time ?? ""}
            onChange={(e) =>
              onBirthChange({ ...birth, time: e.target.value || null })
            }
            className="input-field"
          />
        </div>

        {/* Birth place */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-stardust/50 mb-2">
            Place of birth <span className="text-oracle">*</span>
          </label>
          <input
            type="text"
            value={birth.place ?? ""}
            onChange={(e) => onBirthChange({ ...birth, place: e.target.value })}
            placeholder="City, country (be specific)"
            className="input-field"
            required
          />
          <p className="mt-1.5 text-xs text-stardust/40">
            Used only to determine your time zone and coordinates.
          </p>
        </div>
      </GlassCard>

      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!isValid} size="lg">
          Continue to the quiz →
        </Button>
      </div>
    </div>
  );
}
