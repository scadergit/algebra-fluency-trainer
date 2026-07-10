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

  currentStreak: number;

  bestStreak: number;

  /** Average response time in milliseconds for attempted questions */
  avgResponseMs: number | null;

  /** Average response time per skill topic (ms) */
  avgResponseMsBySkill: Record<string, number>;

  /** Number of times each skill was prompted (attempted + skipped) */
  promptCountBySkill: Record<string, number>;

  /** Number of correct answers per skill */
  correctCountBySkill: Record<string, number>;

  /** Number of attempted (correct + incorrect) answers per skill */
  attemptedCountBySkill: Record<string, number>;

  nextQuestion(): void;

  markCorrect(): void;

  markIncorrect(): void;

  resetSession(): void;
}

const PracticeSessionContext =
  createContext<PracticeSession | null>(null);

interface Props {
  children: ReactNode;
}

export function PracticeSessionProvider({ children }: Props) {
  const { settings } = useSettings();

  const [problem, setProblem] = useState<GeneratedProblem>(() =>
    generateQuestion(settings),
  );

  const [correct, setCorrect] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // All response times (ms) for attempted questions
  const responseMsRef = useRef<number[]>([]);
  // Per-skill: topic → list of response times
  const skillMsRef = useRef<Record<string, number[]>>({});
  // Per-skill: topic → prompt count (attempted + skipped)
  const promptCountRef = useRef<Record<string, number>>({});
  // Per-skill: topic → correct count
  const correctCountRef = useRef<Record<string, number>>({});
  // Per-skill: topic → attempted count (correct + incorrect)
  const attemptedCountRef = useRef<Record<string, number>>({});
  // Timestamp when the current question was shown
  const questionStartRef = useRef<number>(Date.now());

  const [avgResponseMs, setAvgResponseMs] = useState<number | null>(null);
  const [avgResponseMsBySkill, setAvgResponseMsBySkill] = useState<
    Record<string, number>
  >({});
  const [promptCountBySkill, setPromptCountBySkill] = useState<
    Record<string, number>
  >({});
  const [correctCountBySkill, setCorrectCountBySkill] = useState<
    Record<string, number>
  >({});
  const [attemptedCountBySkill, setAttemptedCountBySkill] = useState<
    Record<string, number>
  >({});

  function incrementPromptCount(topic: string) {
    promptCountRef.current[topic] =
      (promptCountRef.current[topic] ?? 0) + 1;
    setPromptCountBySkill({ ...promptCountRef.current });
  }

  function recordResponseTime(topic: string) {
    const elapsed = Date.now() - questionStartRef.current;

    // Overall average
    responseMsRef.current.push(elapsed);
    const all = responseMsRef.current;
    setAvgResponseMs(
      Math.round(all.reduce((a, b) => a + b, 0) / all.length),
    );

    // Per-skill average
    if (!skillMsRef.current[topic]) {
      skillMsRef.current[topic] = [];
    }
    skillMsRef.current[topic].push(elapsed);

    const updated: Record<string, number> = {};
    for (const [skill, times] of Object.entries(skillMsRef.current)) {
      updated[skill] = Math.round(
        times.reduce((a, b) => a + b, 0) / times.length,
      );
    }
    setAvgResponseMsBySkill(updated);
  }

  function nextQuestion() {
    setProblem(generateQuestion(settings));
    questionStartRef.current = Date.now();
  }

  function markCorrect() {
    // Normalize topic to lowercase so it matches the skill names in enabledSkills
    const topic = problem.question.topic.toLowerCase();
    incrementPromptCount(topic);
    recordResponseTime(topic);
    correctCountRef.current[topic] = (correctCountRef.current[topic] ?? 0) + 1;
    attemptedCountRef.current[topic] = (attemptedCountRef.current[topic] ?? 0) + 1;
    setCorrectCountBySkill({ ...correctCountRef.current });
    setAttemptedCountBySkill({ ...attemptedCountRef.current });
    setCorrect((v) => v + 1);
    setAttempted((v) => v + 1);
    setCurrentStreak((streak) => {
      const next = streak + 1;
      setBestStreak((best) => Math.max(best, next));
      return next;
    });
    nextQuestion();
  }

  function markIncorrect() {
    const topic = problem.question.topic.toLowerCase();
    incrementPromptCount(topic);
    recordResponseTime(topic);
    attemptedCountRef.current[topic] = (attemptedCountRef.current[topic] ?? 0) + 1;
    setAttemptedCountBySkill({ ...attemptedCountRef.current });
    setAttempted((v) => v + 1);
    setCurrentStreak(0);
    nextQuestion();
  }

  function resetSession() {
    setCorrect(0);
    setAttempted(0);
    setCurrentStreak(0);
    setBestStreak(0);
    responseMsRef.current = [];
    skillMsRef.current = {};
    promptCountRef.current = {};
    correctCountRef.current = {};
    attemptedCountRef.current = {};
    setAvgResponseMs(null);
    setAvgResponseMsBySkill({});
    setPromptCountBySkill({});
    setCorrectCountBySkill({});
    setAttemptedCountBySkill({});
    nextQuestion();
  }

  return (
    <PracticeSessionContext.Provider
      value={{
        problem,
        correct,
        attempted,
        currentStreak,
        bestStreak,
        avgResponseMs,
        avgResponseMsBySkill,
        promptCountBySkill,
        correctCountBySkill,
        attemptedCountBySkill,
        nextQuestion,
        markCorrect,
        markIncorrect,
        resetSession,
      }}
    >
      {children}
    </PracticeSessionContext.Provider>
  );
}

export function usePracticeSession() {
  const context = useContext(PracticeSessionContext);

  if (!context) {
    throw new Error(
      "usePracticeSession must be used inside PracticeSessionProvider",
    );
  }

  return context;
}
