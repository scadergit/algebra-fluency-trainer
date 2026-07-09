import type { Question } from "../models";

export interface EvaluationResult {
  correct: boolean;
}

export interface Problem {
  question: Question;

  evaluate(
    answer: string,
  ): EvaluationResult;
}