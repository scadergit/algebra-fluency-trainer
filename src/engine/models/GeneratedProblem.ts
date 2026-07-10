import type { Question } from "./Question";
import type { EvaluationResult } from "./EvaluationResult";

export interface GeneratedProblem {
  question: Question;

  metadata: Record<string, unknown>;

  evaluate(answer: string): EvaluationResult;
}
