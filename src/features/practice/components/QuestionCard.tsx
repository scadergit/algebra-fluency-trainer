import { useEffect, useRef, useState } from "react";

import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";

import type { GeneratedProblem } from "../../../engine/models";

interface QuestionCardProps {
  problem: GeneratedProblem;
  onCorrect(): void;
  onIncorrect(): void;
  /** When set, the card shows this text instead of the question and disables input */
  countdownLabel?: string;
}

export default function QuestionCard({
  problem,
  onCorrect,
  onIncorrect,
  countdownLabel,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("");

  // "correct" flash: shown briefly after a correct answer but doesn't block input
  const [showCorrect, setShowCorrect] = useState(false);
  // "incorrect" state: blocks input until auto-dismissed
  const [showIncorrect, setShowIncorrect] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const correctFlashTimer = useRef<number | null>(null);
  const incorrectTimer = useRef<number | null>(null);

  function clearTimers() {
    if (correctFlashTimer.current !== null) {
      window.clearTimeout(correctFlashTimer.current);
      correctFlashTimer.current = null;
    }
    if (incorrectTimer.current !== null) {
      window.clearTimeout(incorrectTimer.current);
      incorrectTimer.current = null;
    }
  }

  // When the question changes, clear any lingering incorrect state.
  // (Correct flash is intentionally left to fade on its own.)
  useEffect(() => {
    if (incorrectTimer.current !== null) {
      window.clearTimeout(incorrectTimer.current);
      incorrectTimer.current = null;
    }
    setShowIncorrect(false);
    setAnswer("");
    inputRef.current?.focus();
  }, [problem.question.id]);

  // Focus when countdown ends
  useEffect(() => {
    if (!countdownLabel) {
      inputRef.current?.focus();
    }
  }, [countdownLabel]);

  // Cleanup on unmount
  useEffect(() => clearTimers, []);

  function submit() {
    if (countdownLabel) return;
    if (showIncorrect) return;

    if (problem.evaluate(answer).correct) {
      // Immediately advance — no delay
      setAnswer("");
      setShowCorrect(true);
      onCorrect();

      // Hide the green flash after 800ms (non-blocking)
      if (correctFlashTimer.current !== null) {
        window.clearTimeout(correctFlashTimer.current);
      }
      correctFlashTimer.current = window.setTimeout(() => {
        correctFlashTimer.current = null;
        setShowCorrect(false);
      }, 800);
    } else {
      setShowIncorrect(true);

      // Auto-dismiss incorrect after 1.5s then advance
      incorrectTimer.current = window.setTimeout(() => {
        incorrectTimer.current = null;
        setShowIncorrect(false);
        onIncorrect();
      }, 1500);
    }
  }

  const isDisabled = showIncorrect || !!countdownLabel;

  return (
    <Card>
      <div className="space-y-8">

        <div>
          {/* Skill label */}
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
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
        />

        <div className="flex gap-3">
          <Button disabled={isDisabled} onClick={submit}>
            Check
          </Button>
        </div>

        {/* Non-blocking correct flash */}
        {showCorrect && (
          <div className="rounded-lg bg-green-100 p-4 text-green-700">
            ✅ Correct!
          </div>
        )}

        {/* Blocking incorrect panel */}
        {showIncorrect && (
          <div className="rounded-lg bg-red-100 p-4">
            <div className="font-semibold text-red-700">❌ Incorrect</div>
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
