import { randomInteger } from "../../random/randomInteger";

import type { AppSettings } from "../../../shared/types/settings";

import type { Question } from "../../models/Question";
import type { GeneratedProblem } from "../../models";
import { createArithmeticProblem } from "../../problem/createArithmeticProblem";

import type { MathSkill } from "../MathSkill";

export const subtractionSkill: MathSkill = {
  id: "subtraction",

  title: "Subtraction",

  category: "Arithmetic",

  generate(
    settings: AppSettings,
  ): GeneratedProblem {
    let left = randomInteger(1, settings.maxNumber);
    let right = randomInteger(1, settings.maxNumber);

    //
    // Prevent negative answers unless explicitly allowed.
    //
    if (!settings.allowNegativeAnswers && left < right) {
      [left, right] = [right, left];
    }

    const question: Question = {
      id: crypto.randomUUID(),
      topic: "Subtraction",
      prompt: `${left} - ${right}`,
      difficulty: 1,
    };

    return createArithmeticProblem(question, String(left - right));
  },
};