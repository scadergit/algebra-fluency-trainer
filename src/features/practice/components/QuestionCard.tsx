import { useEffect, useRef, useState } from "react";

import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";

import type { GeneratedProblem } from "../../../engine/models";
import type { Question } from "../../../engine/models";

interface QuestionCardProps {
  problem: GeneratedProblem;
  onCorrect(): void;
  onIncorrect(): void;
  onSkip(): void;
}

type ResultState = "idle" | "correct" | "incorrect";

export default function QuestionCard({
  problem,
  onCorrect,
  onIncorrect,
  onSkip,
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
    if (result === "idle") {
      inputRef.current?.focus();
    }
  }, [result]);

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
    if (result !== "idle") {
      return;
    }

    if (problem.evaluate(answer).correct) {
      setResult("correct");
    } else {
      setResult("incorrect");
    }
  }

  return (
    <Card>
      <div className="space-y-8">

        <div>

          <div className="text-sm text-slate-500">
            {problem.question.topic}
          </div>

          <div className="mt-2 text-5xl font-bold">
            {problem.question.prompt} =
          </div>

        </div>

        <input
          ref={inputRef}
          autoFocus
          disabled={result !== "idle"}
          className="w-full rounded-lg border border-slate-300 p-3 text-3xl"
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
            disabled={result !== "idle"}
            onClick={submit}
          >
            Check
          </Button>

          <Button
            variant="secondary"
            disabled={result !== "idle"}
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