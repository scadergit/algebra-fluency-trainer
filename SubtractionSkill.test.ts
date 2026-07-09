import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubtractionSkill } from './SubtractionSkill';
import * as random from '../../random/randomNumber';
import type { PracticeSettings } from '../../models/PracticeSettings';

// Mock the random number generator for deterministic tests.
vi.mock('../../random/randomNumber', async (importOriginal) => {
  const originalModule = await importOriginal<typeof random>();
  return {
    ...originalModule,
    randomNumber: vi.fn(),
  };
});

// Cast the mocked module to get types for the spy.
const mockedRandom = vi.mocked(random);

describe('SubtractionSkill', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure isolation.
    vi.clearAllMocks();
  });

  it('should have the correct id, title, and category', () => {
    expect(SubtractionSkill.id).toBe('subtraction');
    expect(SubtractionSkill.title).toBe('Subtraction');
    expect(SubtractionSkill.category).toBe('Arithmetic');
  });

  it('should generate a problem with a positive answer from positive operands', () => {
    // Arrange
    mockedRandom.randomNumber.mockReturnValueOnce(10).mockReturnValueOnce(5);

    const settings: PracticeSettings = {
      arithmetic: {
        maxNumber: 10,
        allowNegatives: false,
        allowNegativeAnswers: false,
      },
    };

    // Act
    const question = SubtractionSkill.generate(settings);

    // Assert
    expect(question.text).toBe('10 - 5');
    expect(question.answer).toBe('5');
    expect(mockedRandom.randomNumber).toHaveBeenCalledWith(0, 10);
    expect(mockedRandom.randomNumber).toHaveBeenCalledTimes(2);
  });

  it('should swap operands to ensure a positive answer when required', () => {
    // Arrange
    mockedRandom.randomNumber.mockReturnValueOnce(5).mockReturnValueOnce(10);

    const settings: PracticeSettings = {
      arithmetic: {
        maxNumber: 10,
        allowNegatives: false,
        allowNegativeAnswers: false,
      },
    };

    // Act
    const question = SubtractionSkill.generate(settings);

    // Assert: The operands should be swapped.
    expect(question.text).toBe('10 - 5');
    expect(question.answer).toBe('5');
  });

  it('should generate a problem with a negative answer when allowed', () => {
    // Arrange
    mockedRandom.randomNumber.mockReturnValueOnce(5).mockReturnValueOnce(10);

    const settings: PracticeSettings = {
      arithmetic: {
        maxNumber: 10,
        allowNegatives: false,
        allowNegativeAnswers: true,
      },
    };

    // Act
    const question = SubtractionSkill.generate(settings);

    // Assert: Operands are not swapped.
    expect(question.text).toBe('5 - 10');
    expect(question.answer).toBe('-5');
    expect(mockedRandom.randomNumber).toHaveBeenCalledTimes(2);
  });

  it('should generate a problem with negative operands but ensure a positive answer', () => {
    // Arrange: a = -2, b = -5. a - b = 3.
    mockedRandom.randomNumber.mockReturnValueOnce(-2).mockReturnValueOnce(-5);

    const settings: PracticeSettings = {
      arithmetic: {
        maxNumber: 10,
        allowNegatives: true,
        allowNegativeAnswers: false,
      },
    };

    // Act
    const question = SubtractionSkill.generate(settings);

    // Assert
    expect(question.text).toBe('-2 - -5');
    expect(question.answer).toBe('3');
    expect(mockedRandom.randomNumber).toHaveBeenCalledWith(-10, 10);
  });

  it('should swap negative operands to ensure a positive answer when required', () => {
    // Arrange: a = -5, b = -2. a - b = -3. Should be swapped.
    mockedRandom.randomNumber.mockReturnValueOnce(-5).mockReturnValueOnce(-2);

    const settings: PracticeSettings = {
      arithmetic: {
        maxNumber: 10,
        allowNegatives: true,
        allowNegativeAnswers: false,
      },
    };

    // Act
    const question = SubtractionSkill.generate(settings);

    // Assert: Swapped to -2 - -5
    expect(question.text).toBe('-2 - -5');
    expect(question.answer).toBe('3');
  });
});