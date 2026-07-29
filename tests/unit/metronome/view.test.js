// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";

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
    test("renders tempo elements", () => {
      renderTempoScale();
      //expect(document.querySelectorAll("small").map((e) => {}));
    });
  });
});
