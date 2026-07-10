import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubtractionSkill } from './index';
import * as random from '../../random/randomInteger';
import type { AppSettings } from '../../../shared/types/settings';

// Mock the random integer generator for deterministic tests.
vi.mock('../../random/randomInteger', async (importOriginal) => {
  const originalModule = await importOriginal<typeof random>();
  return {
    ...originalModule,
    randomInteger: vi.fn(),
  };
});

// Cast the mocked module to get types for the spy.
const mockedRandom = vi.mocked(random);

const baseSettings: AppSettings = {
  maxNumber: 10,
  allowNegativeNumbers: false,
  allowNegativeAnswers: false,
  allowFractions: false,
  allowDecimals: false,
  enabledSkills: ['subtraction'],
};

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
    mockedRandom.randomInteger.mockReturnValueOnce(10).mockReturnValueOnce(5);

    const settings: AppSettings = { ...baseSettings, maxNumber: 10, allowNegativeNumbers: false, allowNegativeAnswers: false };

    // Act
    const problem = SubtractionSkill.generate(settings);

    // Assert
    expect(problem.question.prompt).toBe('10 - 5');
    expect(problem.evaluate('5').correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledWith(0, 10);
    expect(mockedRandom.randomInteger).toHaveBeenCalledTimes(2);
  });

  it('should swap operands to ensure a positive answer when required', () => {
    // Arrange
    mockedRandom.randomInteger.mockReturnValueOnce(5).mockReturnValueOnce(10);

    const settings: AppSettings = { ...baseSettings, maxNumber: 10, allowNegativeNumbers: false, allowNegativeAnswers: false };

    // Act
    const problem = SubtractionSkill.generate(settings);

    // Assert: The operands should be swapped.
    expect(problem.question.prompt).toBe('10 - 5');
    expect(problem.evaluate('5').correct).toBe(true);
  });

  it('should generate a problem with a negative answer when allowed', () => {
    // Arrange
    mockedRandom.randomInteger.mockReturnValueOnce(5).mockReturnValueOnce(10);

    const settings: AppSettings = { ...baseSettings, maxNumber: 10, allowNegativeNumbers: false, allowNegativeAnswers: true };

    // Act
    const problem = SubtractionSkill.generate(settings);

    // Assert: Operands are not swapped.
    expect(problem.question.prompt).toBe('5 - 10');
    expect(problem.evaluate('-5').correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledTimes(2);
  });

  it('should generate a problem with negative operands but ensure a positive answer', () => {
    // Arrange: a = -2, b = -5. a - b = 3.
    mockedRandom.randomInteger.mockReturnValueOnce(-2).mockReturnValueOnce(-5);

    const settings: AppSettings = { ...baseSettings, maxNumber: 10, allowNegativeNumbers: true, allowNegativeAnswers: false };

    // Act
    const problem = SubtractionSkill.generate(settings);

    // Assert
    expect(problem.question.prompt).toBe('-2 - -5');
    expect(problem.evaluate('3').correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledWith(-10, 10);
  });

  it('should swap negative operands to ensure a positive answer when required', () => {
    // Arrange: a = -5, b = -2. a - b = -3. Should be swapped.
    mockedRandom.randomInteger.mockReturnValueOnce(-5).mockReturnValueOnce(-2);

    const settings: AppSettings = { ...baseSettings, maxNumber: 10, allowNegativeNumbers: true, allowNegativeAnswers: false };

    // Act
    const problem = SubtractionSkill.generate(settings);

    // Assert: Swapped to -2 - -5
    expect(problem.question.prompt).toBe('-2 - -5');
    expect(problem.evaluate('3').correct).toBe(true);
  });
});
