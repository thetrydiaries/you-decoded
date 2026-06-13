"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BirthData, QuizAnswers } from "@/lib/types";
import { QUESTIONS } from "@/lib/constants/questions";
import { BirthStep } from "./steps/BirthStep";
import { QuizStep } from "./steps/QuizStep";
import { createPassport } from "@/app/actions/passport";

type FlowStep = "birth" | "quiz";

export function IntakeFlow() {
  const router = useRouter();

  const [step, setStep] = useState<FlowStep>("birth");
  const [firstName, setFirstName] = useState("");
  const [birth, setBirth] = useState<Partial<BirthData>>({});
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const slug = await createPassport({
        firstName: firstName.trim() || null,
        birth: birth as BirthData,
        quizAnswers: answers,
      });
      router.push(`/p/${slug}`);
    } catch (err) {
      setError("Something went wrong — please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {error && (
        <div className="mb-6 rounded-lg border border-oracle/40 bg-night-900 px-4 py-3 text-sm text-oracle">
          {error}
        </div>
      )}

      {step === "birth" && (
        <BirthStep
          firstName={firstName}
          onFirstNameChange={setFirstName}
          birth={birth}
          onBirthChange={setBirth}
          onNext={() => setStep("quiz")}
        />
      )}

      {step === "quiz" && (
        <QuizStep
          questions={QUESTIONS}
          answers={answers}
          onAnswer={handleAnswer}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}
