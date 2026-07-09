import { describe, expect, it } from "vitest";

import { divisionSkill } from "./index";

describe("Division Skill", () => {
  it("always produces an integer answer", () => {
    const settings = {
      maxNumber: 9,
      allowNegativeAnswers: false,
      enabledSkills: [],
      allowDecimals: false,
      allowFractions: false,
    };

    for (let i = 0; i < 1000; i++) {
      const question =
        divisionSkill.generate(settings);

      const answer = Number(
        question.answer,
      );

      expect(
        Number.isInteger(answer),
      ).toBe(true);
    }
  });
});
