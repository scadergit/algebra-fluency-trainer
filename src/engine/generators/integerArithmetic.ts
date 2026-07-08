import { randomInteger } from "../random/randomInteger";

import type { AppSettings } from "../../shared/types/settings";
import type { Question } from "../types";

export function generateIntegerArithmetic(
  settings: AppSettings,
): Question {
  const left = randomInteger(
    1,
    settings.maxNumber,
  );

  const right = randomInteger(
    1,
    settings.maxNumber,
  );

  return {
    topic: "Integer Arithmetic",
    prompt: `${left} + ${right}`,
    answer: String(left + right),
  };
}