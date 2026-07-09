import type { AppSettings } from "../../shared/types/settings";
import type { Question } from "../types";

import { generateAddition } from "../generators/addition";
import { generateSubtraction } from "../generators/subtraction";

export type Generator = (
  settings: AppSettings,
) => Question;

const generatorMap = {
  addition: generateAddition,
  subtraction: generateSubtraction,
};

export function randomGenerator(
  settings: AppSettings,
): Generator {
  if (settings.practiceMode === "addition") {
    return generateAddition;
  }

  if (settings.practiceMode === "subtraction") {
    return generateSubtraction;
  }

  const generators = [
    generateAddition,
    generateSubtraction,
  ];

  const index = Math.floor(
    Math.random() * generators.length,
  );

  return generators[index];
}