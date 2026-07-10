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
    <div>
      <div className="text-sm text-slate-500">
        {label}
      </div>
      <div className="text-3xl font-bold">
        {value}
      </div>
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
      <QuestionCard
        key={question.question.id}
        problem={question}
        onCorrect={markCorrect}
        onIncorrect={markIncorrect}
        onSkip={skipQuestion}
      />

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <div className="grid grid-cols-3 gap-4">
          <StatCell label="Correct" value={correct} />
          <StatCell label="Incorrect" value={incorrect} />
          <StatCell label="Skipped" value={skipped} />
          <StatCell label="Accuracy" value={accuracy} />
          <StatCell label="🔥 Streak" value={currentStreak} />
          <StatCell label="🏆 Best" value={bestStreak} />
        </div>

        <div className="mt-6 border-t pt-6">
          <button
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
            onClick={resetSession}
          >
            Reset Session
          </button>
        </div>

      </div>
    </Page>
  );
}
