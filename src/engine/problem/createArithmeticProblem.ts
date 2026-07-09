import type { Problem } from "./types";

import type { Question } from "../types";

export function createArithmeticProblem(
  question: Question,
): Problem {
  return {
    question,

    evaluate(answer) {
      return {
        correct:
          answer.trim() ===
          question.answer,
      };
    },
  };
}