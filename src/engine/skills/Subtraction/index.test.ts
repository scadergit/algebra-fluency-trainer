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

    // Act
    const problem = SubtractionSkill.generate(baseSettings);

    // Assert
    expect(problem.question.prompt).toBe('10 - 5');
    expect(problem.evaluate('5').correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledWith(0, 10);
    expect(mockedRandom.randomInteger).toHaveBeenCalledTimes(2);
  });

  it('should allow a negative answer when allowNegativeNumbers is false (a < b)', () => {
    // Arrange: a=5, b=10 → answer is -5
    mockedRandom.randomInteger.mockReturnValueOnce(5).mockReturnValueOnce(10);

    // Act
    const problem = SubtractionSkill.generate(baseSettings);

    // Assert: operands are NOT swapped; negative answers are natural
    expect(problem.question.prompt).toBe('5 - 10');
    expect(problem.evaluate('-5').correct).toBe(true);
  });

  it('should generate a problem with negative operands when allowNegativeNumbers is true', () => {
    // Arrange: a = -2, b = -5 → answer = 3
    mockedRandom.randomInteger.mockReturnValueOnce(-2).mockReturnValueOnce(-5);

    const settings: AppSettings = { ...baseSettings, allowNegativeNumbers: true };

    // Act
    const problem = SubtractionSkill.generate(settings);

    // Assert
    expect(problem.question.prompt).toBe('-2 - -5');
    expect(problem.evaluate('3').correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledWith(-10, 10);
  });

  it('should produce a negative answer with negative operands when allowNegativeNumbers is true', () => {
    // Arrange: a = -5, b = -2 → answer = -3
    mockedRandom.randomInteger.mockReturnValueOnce(-5).mockReturnValueOnce(-2);

    const settings: AppSettings = { ...baseSettings, allowNegativeNumbers: true };

    // Act
    const problem = SubtractionSkill.generate(settings);

    // Assert: no swapping; negative answers are allowed
    expect(problem.question.prompt).toBe('-5 - -2');
    expect(problem.evaluate('-3').correct).toBe(true);
  });
});
