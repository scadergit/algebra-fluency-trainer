import { describe, expect, it } from "vitest";

import { generateSubtraction } from "./subtraction";

describe("Subtraction Generator", () => {
  it("never generates a negative answer when negative answers are disabled", () => {
    const settings = {
      maxNumber: 9,

      allowNegativeNumbers: false,
      allowNegativeAnswers: false,

      allowFractions: false,
      allowDecimals: false,

      enabledSkills: [],
    };

    for (let i = 0; i < 1000; i++) {
      const question =
        generateSubtraction(settings);

      expect(
        Number(question.answer),
      ).toBeGreaterThanOrEqual(0);
    }
  });
});