import type { AppSettings } from "../../shared/types/settings";
import type { Question } from "../types";

import { generateAddition } from "../generators/addition";
import { generateSubtraction } from "../generators/subtraction";

export type Generator = (
  settings: AppSettings,
) => Question;

const generators: Generator[] = [
  generateAddition,
  generateSubtraction,
];

export function randomGenerator(): Generator {
  const index = Math.floor(
    Math.random() * generators.length,
  );

  return generators[index];
}