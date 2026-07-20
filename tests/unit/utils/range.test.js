import { describe, expect, test } from "vitest";
import { getRangeProgress } from "../../../src/scripts/utils/range.js";

describe("getRangeProgress()", () => {
  const input = {
    min: "50",
    max: "100",
  };

  test.each([
    { value: 50, expected: 0 },
    { value: 75, expected: 0.5 },
    { value: 100, expected: 1 },
  ])("returns $expected for value $value", ({ value, expected }) => {
    expect(getRangeProgress(input, value)).toBe(expected);
  });
});
