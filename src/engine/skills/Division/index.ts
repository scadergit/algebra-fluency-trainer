import { randomInteger } from "../../random/randomInteger";

import type { AppSettings } from "../../../shared/types/settings";

import type { Question } from "../../models/Question";
import type { GeneratedProblem } from "../../models";
import { createArithmeticProblem } from "../../problem/createArithmeticProblem";

import type { MathSkill } from "../MathSkill";

export const divisionSkill: MathSkill = {
  id: "division",

  title: "Division",

  category: "Arithmetic",

  generate(
    settings: AppSettings,
  ): GeneratedProblem {
    const { maxNumber, allowNegativeNumbers } = settings;

    // Answer and divisor are always positive integers; we then optionally
    // negate one of them so the dividend (and answer) can be negative.
    const absAnswer = randomInteger(1, maxNumber);
    const absDivisor = randomInteger(1, maxNumber);

    let answer = absAnswer;
    let divisor = absDivisor;

    if (allowNegativeNumbers) {
      // Randomly negate exactly one of the two to produce a negative answer
      if (Math.random() < 0.5) {
        answer = -absAnswer;
        divisor = absDivisor;
      }
    }

    const dividend = answer * divisor;

    const question: Question = {
      id: crypto.randomUUID(),
      topic: "Division",
      prompt: `${dividend} ÷ ${divisor}`,
      difficulty: 1,
    };

    return createArithmeticProblem(question, String(answer));
  },
};
