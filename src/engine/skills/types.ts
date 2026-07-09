import type { AppSettings } from "../../shared/types/settings";
import type { Question } from "../types";

export interface Skill {
  id: string;

  title: string;

  category: string;

  generate(
    settings: AppSettings,
  ): Question;
}