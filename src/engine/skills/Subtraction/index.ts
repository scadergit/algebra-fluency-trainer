import { generateSubtraction } from "../../generators/subtraction";

import type { AppSettings } from "../../../shared/types/settings";

import type { Question } from "../../types";

import type { MathSkill } from "../MathSkill";

export const subtractionSkill: MathSkill = {
  id: "subtraction",

  title: "Subtraction",

  category: "Arithmetic",

  generate(
    settings: AppSettings,
  ): Question {
    return generateSubtraction(settings);
  },
};