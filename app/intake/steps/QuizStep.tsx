"use client";

import { useState, useEffect } from "react";
import type { QuizQuestion } from "@/lib/constants/questions";
import type { QuizAnswers } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

interface QuizStepProps {
  questions: QuizQuestion[];
  answers: QuizAnswers;
  onAnswer: (questionId: string, optionId: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function QuizStep({
  questions,
  answers,
  onAnswer,
  onSubmit,
  submitting,
}: QuizStepProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);

  const question = questions[current];
  const isLast = current === questions.length - 1;
  const answered = answers[question.id];

  // When question changes, pre-fill selection from existing answers
  useEffect(() => {
    setSelected(answers[question.id] as string ?? null);
  }, [current, question.id, answers]);

  function handleSelect(optionId: string) {
    setSelected(optionId);
    onAnswer(question.id, optionId);

    // Auto-advance for short-option questions after a beat
    if (question.options.length <= 5) {
      setTimeout(() => advance(optionId), 420);
    }
  }

  function advance(optionId?: string) {
    const sel = optionId ?? selected;
    if (!sel) return;
    if (isLast) {
      onSubmit();
      return;
    }
    setExiting(true);
    setTimeout(() => {
      setCurrent((c) => c + 1);
      setExiting(false);
    }, 250);
  }

  function goBack() {
    if (current === 0) return;
    setExiting(true);
    setTimeout(() => {
      setCurrent((c) => c - 1);
      setExiting(false);
    }, 200);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-10">
        <ProgressBar
          current={current + 1}
          total={questions.length}
          colorClass="bg-psyche"
        />
      </div>

      {/* Question card */}
      <div
        className={`transition-all duration-250 ${
          exiting ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Context line */}
        {question.context && (
          <p className="text-xs uppercase tracking-[0.25em] text-stardust/40 mb-4">
            {question.context}
          </p>
        )}

        {/* Question */}
        <h2 className="font-display text-3xl sm:text-4xl text-starlight leading-snug mb-8">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`
                  w-full text-left rounded-xl border px-5 py-4 transition-all duration-200
                  group hover:border-psyche/50 hover:bg-night-800
                  ${
                    isSelected
                      ? "border-psyche bg-night-800 shadow-[0_0_24px_rgba(95,212,196,0.12)]"
                      : "border-night-700 bg-night-900"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Radio dot */}
                  <span
                    className={`
                      mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all
                      ${
                        isSelected
                          ? "border-psyche bg-psyche"
                          : "border-night-600 group-hover:border-psyche/60"
                      }
                    `}
                  />
                  <div>
                    <p
                      className={`text-base leading-snug transition-colors ${
                        isSelected ? "text-starlight" : "text-stardust"
                      }`}
                    >
                      {opt.label}
                    </p>
                    {opt.sublabel && (
                      <p className="mt-1 text-xs text-stardust/40">
                        {opt.sublabel}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={goBack}
          className="text-sm text-stardust/40 hover:text-stardust transition-colors disabled:opacity-0"
          disabled={current === 0}
        >
          ← Back
        </button>

        {/* For long-option questions (9 options) show explicit Next */}
        {question.options.length > 5 && (
          <Button
            onClick={() => advance()}
            disabled={!selected || submitting}
            size="md"
          >
            {isLast
              ? submitting
                ? "Decoding…"
                : "Decode me →"
              : "Continue →"}
          </Button>
        )}

        {/* Last question explicit submit even for short options */}
        {isLast && question.options.length <= 5 && (
          <Button
            onClick={() => advance()}
            disabled={!selected || submitting}
            size="md"
          >
            {submitting ? "Decoding…" : "Decode me →"}
          </Button>
        )}
      </div>
    </div>
  );
}
