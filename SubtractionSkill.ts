// Assuming these models and helpers exist based on the project architecture.
import type { MathSkill } from '../../models/MathSkill';
import type { Question } from '../../models/Question';
import type { PracticeSettings } from '../../models/PracticeSettings';
import { randomNumber } from '../../random/randomNumber';

/**
 * SubtractionSkill
 *
 * Generates simple subtraction problems.
 *
 * - Operands can be negative if `allowNegatives` is true.
 * - The answer can be negative only if `allowNegativeAnswers` is true.
 */
export const SubtractionSkill: MathSkill = {
  id: 'subtraction',
  title: 'Subtraction',
  category: 'Arithmetic',

  generate(settings: PracticeSettings): Question {
    // Assuming PracticeSettings is updated to include allowNegativeAnswers
    const { maxNumber, allowNegatives, allowNegativeAnswers } = settings.arithmetic;

    const min = allowNegatives ? -maxNumber : 0;

    let a = randomNumber(min, maxNumber);
    let b = randomNumber(min, maxNumber);

    // Prevent negative answers unless explicitly allowed.
    if (!allowNegativeAnswers && a < b) {
      [a, b] = [b, a]; // Swap to ensure a >= b
    }

    return {
      text: `${a} - ${b}`,
      answer: String(a - b),
    };
  },
};