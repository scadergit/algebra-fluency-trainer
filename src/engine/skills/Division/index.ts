import { generateDivision } from "../../generators/division";

import type { AppSettings } from "../../../shared/types/settings";

import type { Question } from "../../types";

import type { MathSkill } from "../MathSkill";

export const divisionSkill: MathSkill = {
  id: "division",

  title: "Division",

  category: "Arithmetic",

  generate(
    settings: AppSettings,
  ): Question {
    return generateDivision(settings);
  },
};