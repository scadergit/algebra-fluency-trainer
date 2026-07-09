import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdditionSkill } from './AdditionSkill';
import * as random from '../../random/randomNumber';
import type { PracticeSettings } from '../../models/PracticeSettings';

// Mock the random number generator for deterministic tests.
// This is hoisted by Vitest.
vi.mock('../../random/randomNumber', async (importOriginal) => {
  const originalModule = await importOriginal<typeof random>();
  return {
    ...originalModule,
    randomNumber: vi.fn(),
  };
});

// Cast the mocked module to get types for the spy.
const mockedRandom = vi.mocked(random);

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
    // Arrange: Mock randomNumber to return specific values.
    mockedRandom.randomNumber.mockReturnValueOnce(5).mockReturnValueOnce(10);

    const settings: PracticeSettings = {
      arithmetic: {
        maxNumber: 10,
        allowNegatives: false,
      },
    };

    // Act
    const question = AdditionSkill.generate(settings);

    // Assert
    expect(question.text).toBe('5 + 10');
    expect(question.answer).toBe('15');
    expect(mockedRandom.randomNumber).toHaveBeenCalledWith(0, 10);
    expect(mockedRandom.randomNumber).toHaveBeenCalledTimes(2);
  });

  it('should generate a problem with negative numbers when allowNegatives is true', () => {
    // Arrange
    mockedRandom.randomNumber.mockReturnValueOnce(-5).mockReturnValueOnce(12);

    const settings: PracticeSettings = {
      arithmetic: {
        maxNumber: 15,
        allowNegatives: true,
      },
    };

    // Act
    const question = AdditionSkill.generate(settings);

    // Assert
    expect(question.text).toBe('-5 + 12');
    expect(question.answer).toBe('7');
    expect(mockedRandom.randomNumber).toHaveBeenCalledWith(-15, 15);
    expect(mockedRandom.randomNumber).toHaveBeenCalledTimes(2);
  });

  it('should generate a problem with two negative numbers', () => {
    // Arrange
    mockedRandom.randomNumber.mockReturnValueOnce(-8).mockReturnValueOnce(-9);

    const settings: PracticeSettings = {
      arithmetic: {
        maxNumber: 10,
        allowNegatives: true,
      },
    };

    // Act
    const question = AdditionSkill.generate(settings);

    // Assert
    expect(question.text).toBe('-8 + -9');
    expect(question.answer).toBe('-17');
    expect(mockedRandom.randomNumber).toHaveBeenCalledWith(-10, 10);
  });
});