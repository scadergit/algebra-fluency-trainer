import type { AppSettings } from "../shared/types/settings";

import { randomGenerator } from "./registry/generatorRegistry";

export function generateQuestion(
  settings: AppSettings,
) {
  const generator =
    randomGenerator();

  return generator(settings);
}