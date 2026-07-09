import { describe, expect, it } from "vitest";

import { generateDivision } from "./division";

describe("Division Generator", () => {
  it("always produces an integer answer", () => {
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
        generateDivision(settings);

      const answer = Number(
        question.answer,
      );

      expect(
        Number.isInteger(answer),
      ).toBe(true);
    }
  });
});