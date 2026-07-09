import { generateAddition } from "../../generators/addition";

import type { AppSettings } from "../../../shared/types/settings";

import type { Question } from "../../types";

import type { MathSkill } from "../MathSkill";

export const additionSkill: MathSkill = {
  id: "addition",

  title: "Addition",

  category: "Arithmetic",

  generate(
    settings: AppSettings,
  ): Question {
    return generateAddition(settings);
  },
};