import { useEffect, useRef, useState } from "react";

import { Page } from "../../shared/components/Page";

import QuestionCard from "./components/QuestionCard";
import { TimerDisplay } from "./components/TimerDisplay";
import { SessionSummary } from "./components/SessionSummary";

import { usePracticeSession } from "./session/PracticeSessionContext";
import { useSessionHistory } from "../../shared/hooks/useSessionHistory";
import { useSettings } from "../settings/SettingsContext";

// ── Duration options ──────────────────────────────────────────────────────────

const DURATION_OPTIONS: Array<{
  label: string;
  seconds: number | null;
}> = [
  { label: "No Timer", seconds: null },
  { label: "30 sec", seconds: 30 },
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
];

// ── StatCell ──────────────────────────────────────────────────────────────────

function StatCell({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>
      <span className="text-2xl font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}

// ── PracticePage ──────────────────────────────────────────────────────────────

export default function PracticePage() {
  const {
    problem: question,
    correct,
    attempted,
    skipped,
    currentStreak,
    bestStreak,
    markCorrect,
    markIncorrect,
    skipQuestion,
    resetSession,
  } = usePracticeSession();

  const { settings } = useSettings();
  const { addRecord } = useSessionHistory();

  // Selected duration in seconds (null = no timer)
  const [selectedDuration, setSelectedDuration] =
    useState<number | null>(null);

  // Seconds remaining on the active countdown
  const [secondsRemaining, setSecondsRemaining] =
    useState<number | null>(null);

  // Whether the timed session has ended
  const [sessionEnded, setSessionEnded] =
    useState(false);

  // Snapshot of stats at the moment the timer expired
  const [finalStats, setFinalStats] = useState<{
    correct: number;
    incorrect: number;
    skipped: number;
    bestStreak: number;
    durationSeconds: number;
  } | null>(null);

  const intervalRef = useRef<number | null>(null);

  // Start / restart the countdown whenever selectedDuration changes
  function startTimer(duration: number | null) {
    stopTimer();
    setSessionEnded(false);
    setFinalStats(null);
    setSelectedDuration(duration);
    setSecondsRemaining(duration);
    resetSession();
  }

  function stopTimer() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  // Tick the countdown every second
  useEffect(() => {
    if (secondsRemaining === null) {
      return;
    }

    if (secondsRemaining <= 0) {
      stopTimer();
      const stats = {
        correct,
        incorrect: attempted - correct,
        skipped,
        bestStreak,
        durationSeconds: selectedDuration ?? 0,
      };
      setSessionEnded(true);
      setFinalStats(stats);
      addRecord({
        completedAt: new Date().toISOString(),
        durationSeconds: selectedDuration ?? 0,
        skills: settings.enabledSkills,
        correct: stats.correct,
        incorrect: stats.incorrect,
        skipped: stats.skipped,
        bestStreak: stats.bestStreak,
      });
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) =>
        prev !== null ? prev - 1 : null,
      );
    }, 1000);

    return () => stopTimer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsRemaining]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), []);

  const incorrect = attempted - correct;
  const accuracy =
    attempted > 0
      ? `${Math.round((correct / attempted) * 100)}%`
      : "—";

  const isTimedMode = selectedDuration !== null;

  // ── Session ended ─────────────────────────────────────────────────────────

  if (sessionEnded && finalStats) {
    return (
      <Page title="Practice">
        <div className="max-w-md">
          <SessionSummary
            correct={finalStats.correct}
            incorrect={finalStats.incorrect}
            skipped={finalStats.skipped}
            bestStreak={finalStats.bestStreak}
            durationSeconds={finalStats.durationSeconds}
            onRestart={() => {
              startTimer(selectedDuration);
            }}
          />
        </div>
      </Page>
    );
  }

  // ── Active practice ───────────────────────────────────────────────────────

  return (
    <Page title="Practice">

      {/* Duration picker */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {DURATION_OPTIONS.map(({ label, seconds }) => {
          const isActive =
            seconds === null
              ? !isTimedMode
              : selectedDuration === seconds;

          return (
            <button
              key={label}
              onClick={() => startTimer(seconds)}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-start gap-8">

        {/* Question card */}
        <div className="flex-1">
          <QuestionCard
            key={question.question.id}
            problem={question}
            onCorrect={markCorrect}
            onIncorrect={markIncorrect}
            onSkip={skipQuestion}
          />
        </div>

        {/* Stats panel */}
        <div className="w-56 shrink-0 rounded-xl bg-white p-6 shadow-sm">

          {/* Timer (only in timed mode) */}
          {isTimedMode && secondsRemaining !== null && (
            <div className="mb-4 border-b border-slate-100 pb-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Time Remaining
              </div>
              <TimerDisplay
                secondsRemaining={secondsRemaining}
                totalSeconds={selectedDuration}
              />
            </div>
          )}

          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Session
          </h2>

          <StatCell label="Correct" value={correct} />
          <StatCell label="Incorrect" value={incorrect} />
          <StatCell label="Skipped" value={skipped} />
          <StatCell label="Accuracy" value={accuracy} />
          <StatCell label="🔥 Streak" value={currentStreak} />
          <StatCell label="🏆 Best" value={bestStreak} />

          <div className="mt-4">
            <button
              className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
              onClick={() => startTimer(selectedDuration)}
            >
              Reset
            </button>
          </div>

        </div>

      </div>

    </Page>
  );
}
