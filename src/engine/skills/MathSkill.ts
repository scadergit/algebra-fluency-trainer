import type { AppSettings } from "../../shared/types/settings";

import type { Question, GeneratedProblem } from "../models";

export interface MathSkill {
  readonly id: string;

  readonly title: string;

  readonly category: string;

  generate(
    settings: AppSettings,
  ): GeneratedProblem;
}