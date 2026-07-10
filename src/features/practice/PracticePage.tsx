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
  { label: "30 sec", seconds: 5 }, // TODO: revert to 30
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
];

// Countdown steps shown inside the question card before the timer starts
const COUNTDOWN_STEPS = ["Ready…", "Set…", "Go!"];
const STEP_MS = 800;

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
    currentStreak,
    bestStreak,
    avgResponseMs,
    avgResponseMsBySkill,
    promptCountBySkill,
    correctCountBySkill,
    attemptedCountBySkill,
    markCorrect,
    markIncorrect,
    resetSession,
  } = usePracticeSession();

  const { settings } = useSettings();
  const { addRecord } = useSessionHistory();

  // Selected duration in seconds (null = no timer)
  const [selectedDuration, setSelectedDuration] =
    useState<number | null>(null);

  // "idle"      = no timed mode selected
  // "countdown" = showing Ready/Set/Go inside the card
  // "active"    = timer running, questions live
  // "ended"     = session finished
  type Phase = "idle" | "countdown" | "active" | "ended";
  const [phase, setPhase] = useState<Phase>("idle");

  // Which step of the countdown we're on (0 = Ready, 1 = Set, 2 = Go)
  const [countdownStep, setCountdownStep] = useState(0);

  // Seconds remaining on the active timer
  const [secondsRemaining, setSecondsRemaining] =
    useState<number | null>(null);

  // Snapshot of stats when the timer expires
  const [finalStats, setFinalStats] = useState<{
    correct: number;
    incorrect: number;
    bestStreak: number;
    durationSeconds: number;
    avgResponseMs: number | null;
  } | null>(null);

  const timerRef = useRef<number | null>(null);
  const [timerPaused, setTimerPaused] = useState(false);

  // Keep refs to the latest session state so the timer effect (which only
  // re-runs on secondsRemaining changes) always reads current values.
  const sessionRef = useRef({
    correct,
    attempted,
    bestStreak,
    avgResponseMs,
    avgResponseMsBySkill,
    promptCountBySkill,
    correctCountBySkill,
    attemptedCountBySkill,
    enabledSkills: settings.enabledSkills,
    selectedDuration,
  });
  sessionRef.current = {
    correct,
    attempted,
    bestStreak,
    avgResponseMs,
    avgResponseMsBySkill,
    promptCountBySkill,
    correctCountBySkill,
    attemptedCountBySkill,
    enabledSkills: settings.enabledSkills,
    selectedDuration,
  };

  function stopTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function pauseTimer() {
    stopTimer();
    setTimerPaused(true);
  }

  function resumeTimer() {
    setTimerPaused(false);
  }

  // ── Countdown step ticker ─────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== "countdown") return;

    if (countdownStep >= COUNTDOWN_STEPS.length) {
      // Countdown finished — start the real timer
      setPhase("active");
      return;
    }

    const id = window.setTimeout(
      () => setCountdownStep((s) => s + 1),
      STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [phase, countdownStep]);

  // ── Session timer ticker ──────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== "active" || secondsRemaining === null || timerPaused) {
      return;
    }

    if (secondsRemaining <= 0) {
      stopTimer();
      // Read from ref to get the latest values (avoids stale closure)
      const s = sessionRef.current;
      const stats = {
        correct: s.correct,
        incorrect: s.attempted - s.correct,
        bestStreak: s.bestStreak,
        durationSeconds: s.selectedDuration ?? 0,
        avgResponseMs: s.avgResponseMs,
      };
      setPhase("ended");
      setFinalStats(stats);
        addRecord({
          completedAt: new Date().toISOString(),
          durationSeconds: s.selectedDuration ?? 0,
          skills: s.enabledSkills,
          correct: stats.correct,
          incorrect: stats.incorrect,
          bestStreak: stats.bestStreak,
        avgResponseMs: stats.avgResponseMs ?? undefined,
        avgResponseMsBySkill:
          Object.keys(s.avgResponseMsBySkill).length > 0
            ? s.avgResponseMsBySkill
            : undefined,
        promptCountBySkill:
          Object.keys(s.promptCountBySkill).length > 0
            ? s.promptCountBySkill
            : undefined,
        correctCountBySkill:
          Object.keys(s.correctCountBySkill).length > 0
            ? s.correctCountBySkill
            : undefined,
        attemptedCountBySkill:
          Object.keys(s.attemptedCountBySkill).length > 0
            ? s.attemptedCountBySkill
            : undefined,
      });
      return;
    }

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) =>
        prev !== null ? prev - 1 : null,
      );
    }, 1000);

    return () => stopTimer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsRemaining, timerPaused]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), []);

  // ── selectDuration ────────────────────────────────────────────────────────

  function selectDuration(duration: number | null) {
    stopTimer();
    setFinalStats(null);
    setSelectedDuration(duration);
    resetSession();

    if (duration === null) {
      setPhase("idle");
      setSecondsRemaining(null);
    } else {
      setCountdownStep(0);
      setPhase("countdown");
      setSecondsRemaining(duration);
    }
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const incorrect = attempted - correct;
  const accuracy =
    attempted > 0
      ? `${Math.round((correct / attempted) * 100)}%`
      : "—";

  const isTimedMode = selectedDuration !== null;

  // Label to pass into QuestionCard during countdown (undefined = normal mode)
  const countdownLabel =
    phase === "countdown"
      ? COUNTDOWN_STEPS[countdownStep]
      : undefined;

  // ── Session ended ─────────────────────────────────────────────────────────

  if (phase === "ended" && finalStats) {
    return (
      <Page title="Practice">
        <div className="max-w-md">
          <SessionSummary
            correct={finalStats.correct}
            incorrect={finalStats.incorrect}
            bestStreak={finalStats.bestStreak}
            durationSeconds={finalStats.durationSeconds}
            avgResponseMs={finalStats.avgResponseMs ?? undefined}
            onRestart={() => selectDuration(selectedDuration)}
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
              onClick={() => selectDuration(seconds)}
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

        {/* Question card — receives countdownLabel during countdown phase */}
        <div className="flex-1">
          <QuestionCard
            problem={question}
            onCorrect={markCorrect}
            onIncorrect={markIncorrect}
            onPause={pauseTimer}
            onResume={resumeTimer}
            countdownLabel={countdownLabel}
          />
        </div>

        {/* Stats panel */}
        <div className="w-56 shrink-0 rounded-xl bg-white p-6 shadow-sm">

          {/* Timer (only in active timed mode) */}
          {phase === "active" && secondsRemaining !== null && (
            <div className="mb-4 border-b border-slate-100 pb-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {timerPaused ? "Time Paused" : "Time Remaining"}
              </div>
              <div
                className={[
                  "rounded-lg transition-colors duration-300",
                  timerPaused ? "bg-slate-100" : "bg-transparent",
                ].join(" ")}
              >
                <TimerDisplay
                  secondsRemaining={secondsRemaining}
                  totalSeconds={selectedDuration!}
                  paused={timerPaused}
                />
              </div>
            </div>
          )}

          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Session
          </h2>

          <StatCell label="Correct" value={correct} />
          <StatCell label="Incorrect" value={incorrect} />
          <StatCell label="Accuracy" value={accuracy} />
          <StatCell label="🔥 Streak" value={currentStreak} />
          <StatCell label="🏆 Best" value={bestStreak} />
          {avgResponseMs !== null && (
            <StatCell
              label="⏱ Avg"
              value={
                avgResponseMs < 1000
                  ? `${avgResponseMs}ms`
                  : `${(avgResponseMs / 1000).toFixed(1)}s`
              }
            />
          )}

          <div className="mt-4">
            <button
              className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
              onClick={() => selectDuration(selectedDuration)}
            >
              Reset
            </button>
          </div>

        </div>

      </div>

    </Page>
  );
}
