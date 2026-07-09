import type { Question } from "./Question";
import type { EvaluationResult } from "../problem/types";

export interface GeneratedProblem {
  question: Question;

  metadata: Record<string, unknown>;

  evaluate(answer: string): EvaluationResult;
}
