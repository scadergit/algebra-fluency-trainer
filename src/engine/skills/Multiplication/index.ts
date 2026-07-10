import type { MathSkill } from "../MathSkill";
import type { AppSettings } from "../../../shared/types/settings";
import { randomInteger } from "../../random/randomInteger";
import { createArithmeticProblem } from "../../problem/createArithmeticProblem";

/**
 * MultiplicationSkill
 *
 * Generates simple multiplication problems.
 *
 * - Operands are integers.
 * - Supports negative numbers based on settings.
 */
export const MultiplicationSkill: MathSkill = {
  id: "multiplication",
  title: "Multiplication",
  category: "Arithmetic",

  generate(settings: AppSettings) {
    const { maxNumber, allowNegativeNumbers } = settings;

    const min = allowNegativeNumbers ? -maxNumber : 0;

    const a = randomInteger(min, maxNumber);
    const b = randomInteger(min, maxNumber);

    const question = {
      id: crypto.randomUUID(),
      topic: "Multiplication",
      prompt: `${a} × ${b}`,
      difficulty: 1,
    };

    return createArithmeticProblem(question, String(a * b));
  },
};

// Also export with lowercase name for compatibility with arithmetic.ts
export const multiplicationSkill = MultiplicationSkill;
