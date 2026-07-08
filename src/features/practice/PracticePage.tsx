import { useEffect, useState } from "react";

import { Card } from "../../shared/components/Card";
import { Page } from "../../shared/components/Page";

import { useSettings } from "../settings/SettingsContext";

import { generateQuestion } from "../../engine/questionEngine";

import type { Question } from "../../engine/types";

export default function PracticePage() {
  const { settings } = useSettings();

  const [question, setQuestion] =
    useState<Question>();

  const [answer, setAnswer] =
    useState("");

  const [correct, setCorrect] =
    useState(0);

  const [attempted, setAttempted] =
    useState(0);

  useEffect(() => {
    setQuestion(generateQuestion(settings));
  }, [settings]);

  function nextQuestion() {
    setQuestion(generateQuestion(settings));
    setAnswer("");
  }

  function checkAnswer() {
    if (!question) {
      return;
    }

    setAttempted((value) => value + 1);

    if (answer.trim() === question.answer) {
      setCorrect((value) => value + 1);
    }

    nextQuestion();
  }

  if (!question) {
    return null;
  }

  return (
    <Page title="Practice">
      <Card>
        <div className="space-y-8">

          <div>

            <div className="text-sm text-slate-500">
              {question.topic}
            </div>

            <div className="mt-2 text-5xl font-bold">
              {question.prompt} =
            </div>

          </div>

          <input
            className="w-full rounded-lg border border-slate-300 p-3 text-2xl"
            value={answer}
            onChange={(event) =>
              setAnswer(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                checkAnswer();
              }
            }}
            autoFocus
          />

          <div className="flex gap-3">

            <button
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              onClick={checkAnswer}
            >
              Check
            </button>

            <button
              className="rounded-lg border border-slate-300 px-6 py-3"
              onClick={nextQuestion}
            >
              Skip
            </button>

          </div>

          <div className="border-t pt-6">

            <div>
              Correct: {correct}
            </div>

            <div>
              Attempted: {attempted}
            </div>

            <div>
              Accuracy:{" "}
              {attempted === 0
                ? 0
                : Math.round(
                    (correct / attempted) *
                      100,
                  )}
              %
            </div>

          </div>

        </div>
      </Card>
    </Page>
  );
}