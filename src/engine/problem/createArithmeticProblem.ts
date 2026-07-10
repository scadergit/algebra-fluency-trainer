import type { Question } from "../models";
import type { GeneratedProblem } from "../models";
import type { EvaluationResult } from "../models/EvaluationResult";

export function createArithmeticProblem(
  question: Question,
  correctAnswer: string,
): GeneratedProblem {
  return {
    question,
    metadata: { correctAnswer: correctAnswer, left: question.prompt.split(" ")[0], right: question.prompt.split(" ")[2] },
    evaluate(answer: string): EvaluationResult {
      return {
        correct: answer.trim() === correctAnswer,
      };
    },
  };
}
