import { Page } from "../../shared/components/Page";

import QuestionCard from "./components/QuestionCard";

import { usePracticeSession } from "./session/PracticeSessionContext";

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

  const incorrect = attempted - correct;
  const accuracy =
    attempted > 0
      ? `${Math.round((correct / attempted) * 100)}%`
      : "—";

  return (
    <Page title="Practice">

      <div className="flex items-start gap-8">

        {/* Question card — grows to fill available space */}
        <div className="flex-1">
          <QuestionCard
            key={question.question.id}
            problem={question}
            onCorrect={markCorrect}
            onIncorrect={markIncorrect}
            onSkip={skipQuestion}
          />
        </div>

        {/* Stats panel — fixed width, never moves */}
        <div className="w-56 shrink-0 rounded-xl bg-white p-6 shadow-sm">

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
              onClick={resetSession}
            >
              Reset
            </button>
          </div>

        </div>

      </div>

    </Page>
  );
}
