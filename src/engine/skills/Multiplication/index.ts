import { randomInteger } from "../../random/randomInteger";

import type { AppSettings } from "../../../shared/types/settings";

import type { Question } from "../../models/Question";
import type { GeneratedProblem } from "../../models";
import { createArithmeticProblem } from "../../problem/createArithmeticProblem";

import type { MathSkill } from "../MathSkill";

export const multiplicationSkill: MathSkill = {
  id: "multiplication",

  title: "Multiplication",

  category: "Arithmetic",

  generate(
    settings: AppSettings,
  ): GeneratedProblem {
    const left = randomInteger(1, settings.maxNumber);
    const right = randomInteger(1, settings.maxNumber);

    const question: Question = {
      id: crypto.randomUUID(),
      topic: "Multiplication",
      prompt: `${left} × ${right}`,
      difficulty: 1,
    };

    return createArithmeticProblem(question, String(left * right));
  },
};