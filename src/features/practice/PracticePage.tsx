import { Page } from "../../shared/components/Page";

import QuestionCard from "./components/QuestionCard";

import { usePracticeSession } from "./session/PracticeSessionContext";

export default function PracticePage() {
  const {
    question,
    correct,
    attempted,
    currentStreak,
    bestStreak,
    markCorrect,
    markIncorrect,
    skipQuestion,
    resetSession,
  } = usePracticeSession();

  return (
    <Page title="Practice">
      <QuestionCard
        question={question}
        onCorrect={markCorrect}
        onIncorrect={markIncorrect}
        onSkip={skipQuestion}
      />

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <div className="grid grid-cols-2 gap-4">

          <div>
            <div className="text-sm text-slate-500">
              Correct
            </div>

            <div className="text-3xl font-bold">
              {correct}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">
              Attempted
            </div>

            <div className="text-3xl font-bold">
              {attempted}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">
              Current Streak
            </div>

            <div className="text-3xl font-bold">
              🔥 {currentStreak}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">
              Best Streak
            </div>

            <div className="text-3xl font-bold">
              🏆 {bestStreak}
            </div>
          </div>

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