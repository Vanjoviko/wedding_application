import { expect, test } from "@playwright/test";

test("landing menampilkan penjelasan dan tombol buat undangan", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Buat undangan" })).toBeDisabled();
  await expect(page.getByRole("link", { name: "Lihat contoh undangan" })).toBeVisible();
});

test("landing memakai Bahasa Indonesia", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});
