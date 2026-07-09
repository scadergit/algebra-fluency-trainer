import type { AppSettings } from "../../shared/types/settings";

import type { Question } from "../types";

export interface MathSkill {
  readonly id: string;

  readonly title: string;

  readonly category: string;

  generate(
    settings: AppSettings,
  ): Question;
}