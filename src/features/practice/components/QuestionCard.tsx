import { useState } from "react";

import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";

import type { Question } from "../../../engine/types";

interface QuestionCardProps {
  question: Question;
  onCorrect(): void;
  onIncorrect(): void;
  onSkip(): void;
}

export default function QuestionCard({
  question,
  onCorrect,
  onIncorrect,
  onSkip,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("");

  function submit() {
    if (answer.trim() === question.answer) {
      onCorrect();
    } else {
      onIncorrect();
    }

    setAnswer("");
  }

  return (
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
          autoFocus
          className="w-full rounded-lg border border-slate-300 p-3 text-3xl"
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submit();
            }
          }}
        />

        <div className="flex gap-3">

          <Button onClick={submit}>
            Check
          </Button>

          <Button
            variant="secondary"
            onClick={onSkip}
          >
            Skip
          </Button>

        </div>

      </div>
    </Card>
  );
}