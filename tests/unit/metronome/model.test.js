import { describe, test, expect } from "vitest";
import { metronome } from "../../../src/scripts/metronome/model.js";

describe("metronome.getSecondsPerBeat()", () => {
  test.each([
    [60, 1],
    [120, 0.5],
    [180, 1 / 3],
  ])("at %i BPM returns %f seconds", (tempo, expected) => {
    const metronomeCopy = { ...metronome, tempo };
    expect(metronomeCopy.getSecondsPerBeat()).toBeCloseTo(expected);
  });
});
