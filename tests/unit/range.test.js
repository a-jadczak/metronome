import { expect, test } from "vitest";
import { getRangeProgress } from "../../src/scripts/utils/range.js";

test("getRangeProgress", () => {
  const input = {
    min: 50,
    max: 100,
  };
  const arr = [
    [50, 0],
    [75, 0.5],
    [100, 1],
  ];
  arr.forEach(([value, expected]) =>
    expect(getRangeProgress(input, value)).toBe(expected),
  );
});
