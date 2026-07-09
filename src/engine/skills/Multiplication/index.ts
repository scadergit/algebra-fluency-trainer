import { generateMultiplication } from "../../generators/multiplication";

import type { AppSettings } from "../../../shared/types/settings";

import type { Question } from "../../types";

import type { MathSkill } from "../MathSkill";

export const multiplicationSkill: MathSkill = {
  id: "multiplication",

  title: "Multiplication",

  category: "Arithmetic",

  generate(
    settings: AppSettings,
  ): Question {
    return generateMultiplication(settings);
  },
};