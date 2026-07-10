import type { MathSkill } from '../MathSkill';
import type { AppSettings } from '../../../shared/types/settings';
import { randomInteger } from '../../random/randomInteger';
import { createArithmeticProblem } from '../../problem/createArithmeticProblem';

/**
 * SubtractionSkill
 *
 * Generates simple subtraction problems.
 *
 * - Operands and answers can be negative if `allowNegativeNumbers` is true.
 */
export const SubtractionSkill: MathSkill = {
  id: 'subtraction',
  title: 'Subtraction',
  category: 'Arithmetic',

  generate(settings: AppSettings) {
    const { maxNumber, allowNegativeNumbers } = settings;

    const min = allowNegativeNumbers ? -maxNumber : 0;

    const a = randomInteger(min, maxNumber);
    const b = randomInteger(min, maxNumber);

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
