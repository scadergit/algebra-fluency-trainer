import { describe, expect, it } from "vitest";

import { subtractionSkill } from "./index";

describe("Subtraction Skill", () => {
  it("never generates a negative answer when negative answers are disabled", () => {
    const settings = {
      maxNumber: 9,
      allowNegativeNumbers: false,
      allowNegativeAnswers: false,
      enabledSkills: [],
      allowDecimals: false,
      allowFractions: false,
    };

    for (let i = 0; i < 1000; i++) {
      const problem = subtractionSkill.generate(settings);
      const { left, right } = problem.metadata;

      expect(
        Number(problem.evaluate(String(Number(left) - Number(right))).correct),
      ).toBeGreaterThanOrEqual(0);
    }
  });
});
