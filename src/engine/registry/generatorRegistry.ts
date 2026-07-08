import type { AppSettings } from "../../shared/types/settings";
import type { Question } from "../types";

import { generateIntegerArithmetic } from "../generators/integerArithmetic";

export type Generator = (
  settings: AppSettings,
) => Question;

const generators: Generator[] = [
  generateIntegerArithmetic,
];

export function randomGenerator() {
  const index = Math.floor(
    Math.random() * generators.length,
  );

  return generators[index];
}