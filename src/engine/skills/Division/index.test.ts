import { describe, expect, it } from "vitest";

import { divisionSkill } from "./index";

describe("Division Skill", () => {
  it("always produces an integer answer", () => {
    const settings = {
      maxNumber: 9,
      allowNegativeNumbers: false,
      enabledSkills: [],
      allowDecimals: false,
      allowFractions: false,
    };

    for (let i = 0; i < 1000; i++) {
      const problem = divisionSkill.generate(settings);
      const answer = Number(problem.metadata.correctAnswer);

      expect(
        Number.isInteger(answer),
      ).toBe(true);
    }
  });
});
