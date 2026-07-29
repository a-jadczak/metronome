import { describe, test, expect, beforeEach } from "vitest";
import { page } from "vitest/browser"

let renderTempoScale;

describe("view.js", () => {
  beforeEach(async () => {
    vi.resetModules();

    document.body.innerHTML = `
      <div class="metronome__tempo-scale-board"></div>
    `;

    const view = await import("../../../src/scripts/metronome/view.js");
    renderTempoScale = view.renderTempoScale;
  });

  describe("renderTempoScale", () => {
    test("renders tempo elements", async () => {
    renderTempoScale();

    const tempoElements = document.querySelectorAll(".metronome__tempo-scale-board small",);

    expect(tempoElements.length).toBeGreaterThan(0);
    });
  });
});
