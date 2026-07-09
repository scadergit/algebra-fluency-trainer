import { randomInteger } from "../../random/randomInteger";

import type { AppSettings } from "../../../shared/types/settings";

import type { Question } from "../../models/Question";

import type { MathSkill } from "../MathSkill";

export const divisionSkill: MathSkill = {
  id: "division",

  title: "Division",

  category: "Arithmetic",

  generate(
    settings: AppSettings,
  ): Question {
    const answer = randomInteger(1, settings.maxNumber);

    const divisor = randomInteger(1, settings.maxNumber);

    const dividend = answer * divisor;

    return {
      id: crypto.randomUUID(),
      topic: "Division",
      prompt: `${dividend} ÷ ${divisor}`,
      answer: String(answer),
      difficulty: 1,
      explanation: `${dividend} ÷ ${divisor} = ${answer}`,
    };
  },
};