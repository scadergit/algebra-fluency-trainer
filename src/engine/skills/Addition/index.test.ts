import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdditionSkill } from './index';
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
  enabledSkills: ['addition'],
};

describe('AdditionSkill', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure isolation.
    vi.clearAllMocks();
  });

  it('should have the correct id, title, and category', () => {
    expect(AdditionSkill.id).toBe('addition');
    expect(AdditionSkill.title).toBe('Addition');
    expect(AdditionSkill.category).toBe('Arithmetic');
  });

  it('should generate a simple positive addition problem', () => {
    // Arrange: Mock randomInteger to return specific values.
    mockedRandom.randomInteger.mockReturnValueOnce(5).mockReturnValueOnce(10);

    const settings: AppSettings = { ...baseSettings, maxNumber: 10, allowNegativeNumbers: false };

    // Act
    const problem = AdditionSkill.generate(settings);

    // Assert
    expect(problem.question.prompt).toBe('5 + 10');
    expect(problem.evaluate('15').correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledWith(0, 10);
    expect(mockedRandom.randomInteger).toHaveBeenCalledTimes(2);
  });

  it('should generate a problem with negative numbers when allowNegativeNumbers is true', () => {
    // Arrange
    mockedRandom.randomInteger.mockReturnValueOnce(-5).mockReturnValueOnce(12);

    const settings: AppSettings = { ...baseSettings, maxNumber: 15, allowNegativeNumbers: true };

    // Act
    const problem = AdditionSkill.generate(settings);

    // Assert
    expect(problem.question.prompt).toBe('-5 + 12');
    expect(problem.evaluate('7').correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledWith(-15, 15);
    expect(mockedRandom.randomInteger).toHaveBeenCalledTimes(2);
  });

  it('should generate a problem with two negative numbers', () => {
    // Arrange
    mockedRandom.randomInteger.mockReturnValueOnce(-8).mockReturnValueOnce(-9);

    const settings: AppSettings = { ...baseSettings, maxNumber: 10, allowNegativeNumbers: true };

    // Act
    const problem = AdditionSkill.generate(settings);

    // Assert
    expect(problem.question.prompt).toBe('-8 + -9');
    expect(problem.evaluate('-17').correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledWith(-10, 10);
  });
});
