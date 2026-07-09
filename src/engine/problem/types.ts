import type { Question } from "../types";

export interface EvaluationResult {
  correct: boolean;
}

export interface Problem {
  question: Question;

  evaluate(
    answer: string,
  ): EvaluationResult;
}