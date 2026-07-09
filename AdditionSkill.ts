// Assuming these models and helpers exist based on the project architecture.
import type { MathSkill } from '../../models/MathSkill';
import type { Question } from '../../models/Question';
import type { PracticeSettings } from '../../models/PracticeSettings';
import { randomNumber } from '../../random/randomNumber';

/**
 * AdditionSkill
 *
 * Generates simple addition problems.
 *
 * - Operands are integers.
 * - Supports negative numbers based on settings.
 */
export const AdditionSkill: MathSkill = {
  id: 'addition',
  title: 'Addition',
  category: 'Arithmetic',

  generate(settings: PracticeSettings): Question {
    const { maxNumber, allowNegatives } = settings.arithmetic;

    const min = allowNegatives ? -maxNumber : 0;

    const a = randomNumber(min, maxNumber);
    const b = randomNumber(min, maxNumber);

    return {
      text: `${a} + ${b}`,
      answer: String(a + b),
    };
  },
};