import type { AppSettings } from "../../shared/types/settings";
import type { Question } from "../types";

import { generateAddition } from "../generators/addition";
import { generateDivision } from "../generators/division";
import { generateMultiplication } from "../generators/multiplication";
import { generateSubtraction } from "../generators/subtraction";

export type Generator = (
  settings: AppSettings,
) => Question;

export function randomGenerator(
  settings: AppSettings,
): Generator {
  const generators: Generator[] = [];

  if (settings.operations.addition) {
    generators.push(generateAddition);
  }

  if (settings.operations.subtraction) {
    generators.push(generateSubtraction);
  }

  if (settings.operations.multiplication) {
    generators.push(generateMultiplication);
  }

  if (settings.operations.division) {
    generators.push(generateDivision);
  }

  if (generators.length === 0) {
    generators.push(generateAddition);
  }

  const index = Math.floor(
    Math.random() * generators.length,
  );

  return generators[index];
}