import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

import type { ReactNode } from "react";

import { generateQuestion } from "../../../engine/questionEngine";

import type { GeneratedProblem } from "../../../engine/models";

import { useSettings } from "../../settings/SettingsContext";

interface PracticeSession {
  problem: GeneratedProblem;

  correct: number;

  attempted: number;

  skipped: number;

  currentStreak: number;

  bestStreak: number;

  /** Average response time in milliseconds for attempted questions */
  avgResponseMs: number | null;

  nextQuestion(): void;

  markCorrect(): void;

  markIncorrect(): void;

  skipQuestion(): void;

  resetSession(): void;
}

const PracticeSessionContext =
  createContext<PracticeSession | null>(
    null,
  );

interface Props {
  children: ReactNode;
}

export function PracticeSessionProvider({
  children,
}: Props) {
  const { settings } = useSettings();

  const [problem, setProblem] =
    useState<GeneratedProblem>(() =>
      generateQuestion(settings),
    );

  const [correct, setCorrect] =
    useState(0);

  const [attempted, setAttempted] =
    useState(0);

  const [skipped, setSkipped] =
    useState(0);

  const [currentStreak, setCurrentStreak] =
    useState(0);

  const [bestStreak, setBestStreak] =
    useState(0);

  // Accumulated response times (ms) for attempted questions
  const responseMsRef = useRef<number[]>([]);
  // Timestamp when the current question was shown
  const questionStartRef = useRef<number>(Date.now());

  const [avgResponseMs, setAvgResponseMs] =
    useState<number | null>(null);

  function recordResponseTime() {
    const elapsed = Date.now() - questionStartRef.current;
    responseMsRef.current.push(elapsed);
    const times = responseMsRef.current;
    const avg = Math.round(
      times.reduce((a, b) => a + b, 0) / times.length,
    );
    setAvgResponseMs(avg);
  }

  function nextQuestion() {
    setProblem(generateQuestion(settings));
    questionStartRef.current = Date.now();
  }

  function markCorrect() {
    recordResponseTime();
    setCorrect((value) => value + 1);
    setAttempted((value) => value + 1);

    setCurrentStreak((streak) => {
      const next = streak + 1;

      setBestStreak((best) =>
        Math.max(best, next),
      );

      return next;
    });

    nextQuestion();
  }

  function markIncorrect() {
    recordResponseTime();
    setAttempted((value) => value + 1);
    setCurrentStreak(0);
    nextQuestion();
  }

  function skipQuestion() {
    setSkipped((value) => value + 1);
    setCurrentStreak(0);
    nextQuestion();
  }

  function resetSession() {
    setCorrect(0);
    setAttempted(0);
    setSkipped(0);
    setCurrentStreak(0);
    setBestStreak(0);
    responseMsRef.current = [];
    setAvgResponseMs(null);
    nextQuestion();
  }

  return (
    <PracticeSessionContext.Provider
      value={{
        problem,
        correct,
        attempted,
        skipped,
        currentStreak,
        bestStreak,
        avgResponseMs,
        nextQuestion,
        markCorrect,
        markIncorrect,
        skipQuestion,
        resetSession,
      }}
    >
      {children}
    </PracticeSessionContext.Provider>
  );
}

export function usePracticeSession() {
  const context = useContext(
    PracticeSessionContext,
  );

  if (!context) {
    throw new Error(
      "usePracticeSession must be used inside PracticeSessionProvider",
    );
  }

  return context;
}
