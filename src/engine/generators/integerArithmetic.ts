import type { AppSettings } from "../../shared/types/settings";
import type { Question } from "../types";

function randomNumber(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

export function generateIntegerArithmetic(
  settings: AppSettings,
): Question {
  const left = randomNumber(settings.maxNumber);
  const right = randomNumber(settings.maxNumber);

  return {
    prompt: `${left} + ${right}`,
    answer: String(left + right),
    topic: "Integer Arithmetic",
  };
}