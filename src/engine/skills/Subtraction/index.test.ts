import { describe, expect, it } from "vitest";

import { subtractionSkill } from "./index";

describe("Subtraction Skill", () => {
  it("never generates a negative answer when negative answers are disabled", () => {
    const settings = {
      maxNumber: 9,
      allowNegativeAnswers: false,
      enabledSkills: [],
      allowDecimals: false,
      allowFractions: false,
    };

    for (let i = 0; i < 1000; i++) {
      const question =
        subtractionSkill.generate(settings);

      expect(
        Number(question.answer),
      ).toBeGreaterThanOrEqual(0);
    }
  });
});
