import type { MathSkill } from '../MathSkill';
import type { AppSettings } from '../../../shared/types/settings';
import { randomInteger } from '../../random/randomInteger';
import { createArithmeticProblem } from '../../problem/createArithmeticProblem';

/**
 * SubtractionSkill
 *
 * Generates simple subtraction problems.
 *
 * - Operands can be negative if `allowNegativeNumbers` is true.
 * - The answer can be negative only if `allowNegativeAnswers` is true.
 */
export const SubtractionSkill: MathSkill = {
  id: 'subtraction',
  title: 'Subtraction',
  category: 'Arithmetic',

  generate(settings: AppSettings) {
    const { maxNumber, allowNegativeNumbers, allowNegativeAnswers } = settings;

    const min = allowNegativeNumbers ? -maxNumber : 0;

    let a = randomInteger(min, maxNumber);
    let b = randomInteger(min, maxNumber);

    // Prevent negative answers unless explicitly allowed.
    if (!allowNegativeAnswers && a < b) {
      [a, b] = [b, a]; // Swap to ensure a >= b
    }

    const question = {
      id: crypto.randomUUID(),
      topic: 'Subtraction',
      prompt: `${a} - ${b}`,
      difficulty: 1,
    };

    return createArithmeticProblem(question, String(a - b));
  },
};

// Also export with lowercase name for compatibility with arithmetic.ts
export const subtractionSkill = SubtractionSkill;
