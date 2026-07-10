import { useEffect, useRef, useState } from "react";

import { Page } from "../../shared/components/Page";

import QuestionCard from "./components/QuestionCard";
import { TimerDisplay } from "./components/TimerDisplay";
import { SessionSummary } from "./components/SessionSummary";

import { usePracticeSession } from "./session/PracticeSessionContext";
import { useSessionHistory } from "../../shared/hooks/useSessionHistory";
import { useSettings } from "../settings/SettingsContext";
import { useStudent } from "../student/StudentContext";

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

// Countdown steps shown inside the question card before the timer starts
const COUNTDOWN_STEPS = ["Ready…", "Set…", "Go!"];
const STEP_MS = 800;

// ── StudentEntry ──────────────────────────────────────────────────────────────

function StudentEntry() {
  const { knownStudents, loginStudent, isKnownStudent } = useStudent();
  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);

  const returning = isKnownStudent(name.trim());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ok = loginStudent(name, secret);
    if (!ok) {
      setError("Incorrect secret word. Please try again.");
    }
  }

  function handlePickStudent(s: string) {
    setName(s);
    setSecret("");
    setError(null);
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-center text-xl font-semibold text-slate-800">
          Welcome!
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          Enter your name and secret word to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Your name"
            value={name}
            autoFocus
            onChange={(e) => { setName(e.target.value); setError(null); }}
          />
          <div>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder={returning ? "Secret word" : "Choose a secret word"}
              value={secret}
              onChange={(e) => { setSecret(e.target.value); setError(null); }}
            />
            {!returning && name.trim() && (
              <p className="mt-1 text-xs text-slate-400">
                New student — pick a secret word you'll remember.
              </p>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={!name.trim() || !secret.trim()}
            className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
          >
            Let's go →
          </button>
        </form>

        {knownStudents.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Previous students
            </p>
            <div className="flex flex-wrap gap-2">
              {knownStudents.map((s) => (
                <button
                  key={s}
                  onClick={() => handlePickStudent(s)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const { activeStudent } = useStudent();

  if (!activeStudent) {
    return (
      <Page title="Practice">
        <StudentEntry />
      </Page>
    );
  }

  return <PracticePageInner />;
}

function PracticePageInner() {
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
              {/* Timer box — icicles hang from the bottom when paused */}
              <div
                className={[
                  "relative transition-colors duration-300",
                  timerPaused ? "rounded-t-lg bg-blue-50" : "rounded-lg bg-transparent",
                ].join(" ")}
              >
                <TimerDisplay
                  secondsRemaining={secondsRemaining}
                  totalSeconds={selectedDuration!}
                  paused={timerPaused}
                />

                {/* Icicles — grow down from the bottom edge when paused */}
                {timerPaused && (
                  <svg
                    viewBox="0 0 200 28"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-0 w-full"
                    style={{
                      top: "100%",
                      transformOrigin: "top center",
                      animation:
                        "icicleGrow 0.4s ease-out forwards, icicleShimmer 2s ease-in-out 0.4s infinite",
                    }}
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                    {/* Ice shelf along the top */}
                    <rect x="0" y="0" width="200" height="5" fill="#bfdbfe" opacity="0.7" rx="1" />
                    {/* Icicle spikes — varying heights and widths for a natural look */}
                    <path
                      d={[
                        "M0,5 L0,5",
                        "L8,5 L11,22 L14,5",
                        "L20,5 L22,14 L24,5",
                        "L30,5 L34,28 L38,5",
                        "L44,5 L46,18 L48,5",
                        "L54,5 L58,24 L62,5",
                        "L66,5 L68,12 L70,5",
                        "L76,5 L80,26 L84,5",
                        "L88,5 L90,16 L92,5",
                        "L98,5 L102,22 L106,5",
                        "L110,5 L112,10 L114,5",
                        "L120,5 L124,28 L128,5",
                        "L132,5 L134,15 L136,5",
                        "L142,5 L146,20 L150,5",
                        "L154,5 L156,13 L158,5",
                        "L164,5 L168,25 L172,5",
                        "L176,5 L178,17 L180,5",
                        "L186,5 L190,23 L194,5",
                        "L200,5 Z",
                      ].join(" ")}
                      fill="url(#iceGrad)"
                    />
                    {/* Subtle highlight streaks on a few icicles */}
                    <line x1="11" y1="6" x2="11" y2="18" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="34" y1="6" x2="34" y2="24" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="80" y1="6" x2="80" y2="22" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="124" y1="6" x2="124" y2="24" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="168" y1="6" x2="168" y2="21" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                  </svg>
                )}
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
