import { test, expect } from "@playwright/test";

test.describe("app flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator(".metronome__tempo-scale-board span").first(),
    ).toBeVisible();
  });

  test("button text changes when playback starts", async ({ page }) => {
    const button = page.locator("#toggle-metronome-button");

    await expect(button).toHaveText("START");
    await button.click();
    await expect(button).toHaveText("STOP");
  });

  test("pendulum starts swinging when playback starts", async ({ page }) => {
    const button = page.locator("#toggle-metronome-button");
    const pendulum = page.locator("#metronome__pendulum");

    await expect(pendulum).toHaveAttribute("data-state", "idle");
    await button.click();
    await expect(pendulum).toHaveAttribute("data-state", "swing");
  });
});
