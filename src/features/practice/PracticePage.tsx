import { useEffect, useState } from "react";

import { Page } from "../../shared/components/Page";

import { generateQuestion } from "../../engine/questionEngine";
import type { Question } from "../../engine/types";

import { useSettings } from "../settings/SettingsContext";

import QuestionCard from "./components/QuestionCard";

export default function PracticePage() {
  const { settings } = useSettings();

  const [question, setQuestion] =
    useState<Question>();

  const [correct, setCorrect] =
    useState(0);

  const [attempted, setAttempted] =
    useState(0);

  const [currentStreak, setCurrentStreak] =
    useState(0);

  const [bestStreak, setBestStreak] =
    useState(0);

  useEffect(() => {
    setQuestion(generateQuestion(settings));
  }, [settings]);

  function nextQuestion() {
    setQuestion(generateQuestion(settings));
  }

  function correctAnswer() {
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

  function incorrectAnswer() {
    setAttempted((value) => value + 1);
    setCurrentStreak(0);

    nextQuestion();
  }

  function skipQuestion() {
    setCurrentStreak(0);
    nextQuestion();
  }

  if (!question) {
    return null;
  }

  return (
    <Page title="Practice">

      <QuestionCard
        question={question}
        onCorrect={correctAnswer}
        onIncorrect={incorrectAnswer}
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

          Accuracy

          <div className="mt-2 text-4xl font-bold">

            {attempted === 0
              ? 0
              : Math.round(
                  (correct /
                    attempted) *
                    100,
                )}

            %

          </div>

        </div>

      </div>

    </Page>
  );
}