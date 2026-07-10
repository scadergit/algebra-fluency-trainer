import { describe, it, expect, vi, beforeEach } from "vitest";
import { MultiplicationSkill } from "./index";
import * as random from "../../random/randomInteger";
import type { AppSettings } from "../../../shared/types/settings";

// Mock the random integer generator for deterministic tests.
vi.mock("../../random/randomInteger", async (importOriginal) => {
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
  enabledSkills: ["multiplication"],
};

describe("MultiplicationSkill", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have the correct id, title, and category", () => {
    expect(MultiplicationSkill.id).toBe("multiplication");
    expect(MultiplicationSkill.title).toBe("Multiplication");
    expect(MultiplicationSkill.category).toBe("Arithmetic");
  });

  it("should generate a simple positive multiplication problem", () => {
    mockedRandom.randomInteger.mockReturnValueOnce(3).mockReturnValueOnce(7);

    const problem = MultiplicationSkill.generate(baseSettings);

    expect(problem.question.prompt).toBe("3 × 7");
    expect(problem.evaluate("21").correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledWith(0, 10);
    expect(mockedRandom.randomInteger).toHaveBeenCalledTimes(2);
  });

  it("should generate a problem with negative numbers when allowNegativeNumbers is true", () => {
    mockedRandom.randomInteger.mockReturnValueOnce(-4).mockReturnValueOnce(5);

    const settings: AppSettings = { ...baseSettings, maxNumber: 10, allowNegativeNumbers: true };

    const problem = MultiplicationSkill.generate(settings);

    expect(problem.question.prompt).toBe("-4 × 5");
    expect(problem.evaluate("-20").correct).toBe(true);
    expect(mockedRandom.randomInteger).toHaveBeenCalledWith(-10, 10);
  });

  it("should evaluate an incorrect answer as false", () => {
    mockedRandom.randomInteger.mockReturnValueOnce(6).mockReturnValueOnce(6);

    const problem = MultiplicationSkill.generate(baseSettings);

    expect(problem.evaluate("35").correct).toBe(false);
    expect(problem.evaluate("36").correct).toBe(true);
  });
});
