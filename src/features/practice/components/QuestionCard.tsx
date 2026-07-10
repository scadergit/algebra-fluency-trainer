import { useEffect, useRef, useState } from "react";

import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";

import type { GeneratedProblem } from "../../../engine/models";

// Operators that, when preceding a negative number, create ambiguity
const OPERATORS = new Set(["+", "-", "−", "×", "÷", "*", "/"]);

/**
 * Render a math prompt string so that a negative number is wrapped in
 * parentheses whenever leaving it bare would create mathematical ambiguity
 * or conflict with order of operations — i.e. whenever it follows an operator.
 *
 *   "5 - -3"  → "5 - (-3)"
 *   "4 × -2"  → "4 × (-2)"
 *   "5 + -3"  → "5 + (-3)"
 *   "-2 + 4"  → "-2 + 4"   (leading operand: no parens needed)
 */
function renderPrompt(prompt: string): React.ReactNode {
  const tokens = prompt.split(" ");
  return tokens.map((token, i) => {
    const prevToken = i > 0 ? tokens[i - 1] : null;
    const needsParens =
      /^-\d/.test(token) &&
      prevToken !== null &&
      OPERATORS.has(prevToken);
    return (
      <span key={i}>
        {i > 0 && " "}
        {needsParens ? `(${token})` : token}
      </span>
    );
  });
}

interface QuestionCardProps {
  problem: GeneratedProblem;
  onCorrect(): void;
  /** Called when the user dismisses the incorrect panel and is ready to continue */
  onIncorrect(): void;
  /** Called when the incorrect panel appears (so parent can pause the timer) */
  onPause?(): void;
  /** Called when the incorrect panel is dismissed (so parent can resume the timer) */
  onResume?(): void;
  /** When set, the card shows this text instead of the question and disables input */
  countdownLabel?: string;
}

export default function QuestionCard({
  problem,
  onCorrect,
  onIncorrect,
  onPause,
  onResume,
  countdownLabel,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("");

  // "correct" flash: shown briefly after a correct answer but doesn't block input
  const [showCorrect, setShowCorrect] = useState(false);
  // "incorrect" state: blocks input and waits for user to continue
  const [showIncorrect, setShowIncorrect] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const correctFlashTimer = useRef<number | null>(null);

  function clearFlashTimer() {
    if (correctFlashTimer.current !== null) {
      window.clearTimeout(correctFlashTimer.current);
      correctFlashTimer.current = null;
    }
  }

  // When the question changes, clear incorrect state.
  useEffect(() => {
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
  useEffect(() => clearFlashTimer, []);

  function continueAfterIncorrect() {
    setShowIncorrect(false);
    onResume?.();
    onIncorrect();
  }

  function submit() {
    if (countdownLabel) return;

    // While showing incorrect, Enter/button acts as "Continue"
    if (showIncorrect) {
      continueAfterIncorrect();
      return;
    }

    if (problem.evaluate(answer).correct) {
      // Immediately advance — no delay
      setAnswer("");
      setShowCorrect(true);
      onCorrect();

      // Hide the green flash after 800ms (non-blocking)
      clearFlashTimer();
      correctFlashTimer.current = window.setTimeout(() => {
        correctFlashTimer.current = null;
        setShowCorrect(false);
      }, 800);
    } else {
      setShowIncorrect(true);
      onPause?.();
    }
  }

  const isDisabled = !!countdownLabel;

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
              <>{renderPrompt(problem.question.prompt)} =</>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          autoFocus
          disabled={isDisabled}
          readOnly={showIncorrect}
          className="w-full rounded-lg border border-slate-300 p-3 text-3xl disabled:bg-slate-50 disabled:text-slate-400 read-only:bg-slate-50 read-only:text-slate-400"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
        />

        <div className="flex gap-3">
          <Button disabled={isDisabled} onClick={submit}>
            {showIncorrect ? "Continue" : "Check"}
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
