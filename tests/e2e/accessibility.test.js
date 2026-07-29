import {test,expect} from "@playwright/test";

test.describe("accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  const userControls = ["volume-slider", "tempo-slider", "toggle-metronome-button", "beats-slider"]

  test("user has access to controls via keyboard", async ({ page }) => {
    for (const controlId of userControls) {
      await page.keyboard.press("Tab");
      await expect(page.locator(`#${controlId}`)).toBeFocused();  
    }
  })

})