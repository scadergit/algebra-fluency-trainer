import { describe, expect, it } from "vitest";

import { randomInteger } from "./randomInteger";

describe("randomInteger()", () => {
  it("always stays inside the requested range", () => {
    for (let i = 0; i < 1000; i++) {
      const value =
        randomInteger(3, 9);

      expect(value).toBeGreaterThanOrEqual(3);

      expect(value).toBeLessThanOrEqual(9);
    }
  });
});