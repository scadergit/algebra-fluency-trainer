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

  useEffect(() => {
    setQuestion(generateQuestion(settings));
  }, [settings]);

  function nextQuestion() {
    setQuestion(generateQuestion(settings));
  }

  function correctAnswer() {
    setCorrect((value) => value + 1);
    setAttempted((value) => value + 1);

    nextQuestion();
  }

  function incorrectAnswer() {
    setAttempted((value) => value + 1);

    nextQuestion();
  }

  function skipQuestion() {
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

        <div className="text-lg">
          Correct: {correct}
        </div>

        <div className="text-lg">
          Attempted: {attempted}
        </div>

        <div className="text-lg">

          Accuracy:{" "}

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

    </Page>
  );
}