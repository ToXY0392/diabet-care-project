import { expect, test } from "@playwright/test";

test.describe("Patient flow", () => {
  test("dashboard shows and navigation works", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main", { name: /contenu principal/i })).toBeVisible();
    await expect(page.getByText("Tableau de bord")).toBeVisible();
    await page.getByRole("button", { name: "mesures" }).click();
    await expect(page.getByText(/Suivi|Tendances|Jour/i)).toBeVisible();
  });

  test("exchanges tab shows messages and documents", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "echanges" }).click();
    await expect(page.getByText("Échanges")).toBeVisible();
    await expect(page.getByRole("button", { name: "Messages" })).toBeVisible();
  });
});
