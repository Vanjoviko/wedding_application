import { expect, test } from "@playwright/test";

test("pratinjau menampilkan cover, mempelai, dan acara", async ({ page }) => {
  await page.goto("/contoh");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Raka & Sekar");
  await expect(page.getByText("Bapak Hendra Gunawan & Keluarga")).toBeVisible();
  await expect(page.getByText("Sabtu, 15 Mei 2027").first()).toBeVisible();

  await expect(page.getByRole("heading", { level: 2, name: "Mempelai" })).toBeVisible();
  await expect(page.getByText("Mempelai pria")).toBeVisible();
  await expect(page.getByText("Mempelai wanita")).toBeVisible();

  await expect(page.getByRole("heading", { level: 2, name: "Acara" })).toBeVisible();
  await expect(page.getByRole("timer")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Akad nikah" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Buka di Google Maps" }).first(),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("halaman komponen dasar tampil di development", async ({ page }) => {
  await page.goto("/dev/ui");

  await expect(
    page.getByRole("heading", { level: 1, name: "Komponen dasar" }),
  ).toBeVisible();
  await expect(page.getByText("--accent", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tombol nonaktif" })).toBeDisabled();
});
