import { randomInteger } from "../random/randomInteger";

import type { AppSettings } from "../../shared/types/settings";
import type { Question } from "../types";

export function generateSubtraction(
  settings: AppSettings,
): Question {
  let left = randomInteger(1, settings.maxNumber);
  let right = randomInteger(1, settings.maxNumber);

  //
  // Prevent negative answers unless explicitly allowed.
  //
  if (!settings.allowNegativeAnswers && left < right) {
    [left, right] = [right, left];
  }

  return {
    id: crypto.randomUUID(),

    topic: "Subtraction",

    prompt: `${left} - ${right}`,

    answer: String(left - right),

    difficulty: 1,

    explanation: `${left} - ${right} = ${left - right}`,
  };
}