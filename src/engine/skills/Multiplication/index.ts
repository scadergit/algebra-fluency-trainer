import { randomInteger } from "../../random/randomInteger";

import type { AppSettings } from "../../../shared/types/settings";

import type { Question } from "../../models/Question";

import type { MathSkill } from "../MathSkill";

export const multiplicationSkill: MathSkill = {
  id: "multiplication",

  title: "Multiplication",

  category: "Arithmetic",

  generate(
    settings: AppSettings,
  ): Question {
    const left = randomInteger(1, settings.maxNumber);
    const right = randomInteger(1, settings.maxNumber);

    return {
      id: crypto.randomUUID(),
      topic: "Multiplication",
      prompt: `${left} × ${right}`,
      answer: String(left * right),
      difficulty: 1,
      explanation: `${left} × ${right} = ${left * right}`,
    };
  },
};