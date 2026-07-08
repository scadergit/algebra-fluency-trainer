import type { AppSettings } from "../shared/types/settings";

import { generateIntegerArithmetic } from "./generators/integerArithmetic";

export function generateQuestion(
  settings: AppSettings,
) {
  return generateIntegerArithmetic(settings);
}