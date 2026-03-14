import { expect, test } from "@playwright/test";

test.describe("Clinician flow", () => {
  test("role switch to clinician shows cockpit", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /clinician|soignant/i }).click();
    await expect(page.getByText("Cockpit clinique")).toBeVisible();
    await expect(page.getByText("Alertes ouvertes")).toBeVisible();
  });

  test("clinician can open patients list", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /clinician|soignant/i }).click();
    await page.getByRole("button", { name: "Patients" }).click();
    await expect(page.getByText("Patients")).toBeVisible();
  });
});
