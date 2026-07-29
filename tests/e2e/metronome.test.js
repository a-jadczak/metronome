import { test, expect } from "@playwright/test";

test.describe("Metronome", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays the metronome and its controls", async ({ page }) => {
    await expect(page).toHaveTitle("Metronome");
    await expect(
      page.getByRole("heading", { name: "Metronome", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("contentinfo", { name: "Metronome controls" }),
    ).toBeVisible();
  });

  test("initializes the controls with their default values", async ({
    page,
  }) => {
    const controls = getControls(page);

    await expectRange(controls.tempo, controls.tempoLabel, "120", "120 BPM");
    await expectRange(controls.beats, controls.beatsLabel, "1", "Beats: 1");
    await expect(controls.volume).toHaveValue("50");
    await expect(controls.toggle).toBeVisible();
    await expect(controls.toggle).toBeEnabled();
  });

  test("updates the tempo and beats labels when settings change", async ({
    page,
  }) => {
    const controls = getControls(page);

    await controls.tempo.press("ArrowRight");
    await expectRange(controls.tempo, controls.tempoLabel, "121", "121 BPM");

    await controls.beats.press("ArrowRight");
    await expectRange(controls.beats, controls.beatsLabel, "2", "Beats: 2");
  });

  test("shows the muted state when volume is set to zero", async ({ page }) => {
    const controls = getControls(page);

    await controls.volume.press("Home");

    await expect(controls.volume).toHaveValue("0");
    await expect(page.locator(".volume-control__icon")).toHaveAttribute(
      "data-muted",
      "true",
    );
  });
});

function getControls(page) {
  return {
    tempo: page.locator("#tempo-slider"),
    tempoLabel: page.locator('label[for="tempo-slider"]'),
    beats: page.locator("#beats-slider"),
    beatsLabel: page.locator('label[for="beats-slider"]'),
    volume: page.locator("#volume-slider"),
    toggle: page.getByRole("button", { name: "START" }),
  };
}

async function expectRange(slider, label, value, labelText) {
  await expect(slider).toHaveValue(value);
  await expect(label).toHaveText(labelText);
}
