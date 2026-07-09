import type { Question } from "./Question";

export interface GeneratedProblem {
  question: Question;

  metadata: Record<string, unknown>;
}