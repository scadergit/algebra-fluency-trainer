import { useEffect, useRef, useState } from "react";

import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";

import type { GeneratedProblem } from "../../../engine/models";

interface QuestionCardProps {
  problem: GeneratedProblem;
  onCorrect(): void;
  onIncorrect(): void;
  onSkip(): void;
  /** When set, the card shows this text instead of the question and disables input */
  countdownLabel?: string;
}

type ResultState = "idle" | "correct" | "incorrect";

export default function QuestionCard({
  problem,
  onCorrect,
  onIncorrect,
  onSkip,
  countdownLabel,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] =
    useState<ResultState>("idle");

  const inputRef = useRef<HTMLInputElement>(null);

  // When the question changes, reset state.
  useEffect(() => {
    setAnswer("");
    setResult("idle");
  }, [problem.question.id]);

  // Once result returns to "idle" (input is re-enabled), focus the input.
  useEffect(() => {
    if (result === "idle" && !countdownLabel) {
      inputRef.current?.focus();
    }
  }, [result, countdownLabel]);

  // Focus input when countdown finishes
  useEffect(() => {
    if (!countdownLabel) {
      inputRef.current?.focus();
    }
  }, [countdownLabel]);

  useEffect(() => {
    if (result === "idle") {
      return;
    }

    const timer = window.setTimeout(() => {
      if (result === "correct") {
        onCorrect();
      } else {
        onIncorrect();
      }
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [result, onCorrect, onIncorrect]);

  function submit() {
    if (result !== "idle" || countdownLabel) {
      return;
    }

    if (problem.evaluate(answer).correct) {
      setResult("correct");
    } else {
      setResult("incorrect");
    }
  }

  const isDisabled = result !== "idle" || !!countdownLabel;

  return (
    <Card>
      <div className="space-y-8">

        <div>
          {/* Skill label — always occupies space, invisible during countdown */}
          <div
            className="text-sm text-slate-500"
            style={{ visibility: countdownLabel ? "hidden" : "visible" }}
          >
            {problem.question.topic}
          </div>

          {/* Question prompt OR countdown text */}
          <div className="mt-2 text-5xl font-bold">
            {countdownLabel ? (
              <span
                key={countdownLabel}
                style={{ animation: "countdownPop 0.35s ease-out both" }}
              >
                {countdownLabel}
              </span>
            ) : (
              <>{problem.question.prompt} =</>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          autoFocus
          disabled={isDisabled}
          className="w-full rounded-lg border border-slate-300 p-3 text-3xl disabled:bg-slate-50 disabled:text-slate-400"
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submit();
            }
            if (event.key === "Escape") {
              onSkip();
            }
          }}
        />

        <div className="flex gap-3">

          <Button
            disabled={isDisabled}
            onClick={submit}
          >
            Check
          </Button>

          <Button
            variant="secondary"
            disabled={isDisabled}
            onClick={onSkip}
          >
            Skip
          </Button>

        </div>

        {result === "correct" && (
          <div className="rounded-lg bg-green-100 p-4 text-green-700">
            ✅ Correct!
          </div>
        )}

        {result === "incorrect" && (
          <div className="rounded-lg bg-red-100 p-4">

            <div className="font-semibold text-red-700">
              ❌ Incorrect
            </div>

            <div className="mt-2">
              Correct answer:
              <span className="ml-2 font-bold">
                {String(problem.metadata.correctAnswer)}
              </span>
            </div>

            {typeof problem.metadata.explanation === "string" && (
              <div className="mt-2 text-sm text-slate-600">
                {problem.metadata.explanation}
              </div>
            )}

          </div>
        )}

      </div>
    </Card>
  );
}
