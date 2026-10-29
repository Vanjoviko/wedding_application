import { expect, test } from "@playwright/test";

const hasDatabase = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

test.describe("halaman undangan tamu", () => {
  test.skip(!hasDatabase, "Butuh SUPABASE_URL dan service role key.");

  test("mengunci halaman, menampilkan nama tamu, lalu membuka undangan", async ({
    page,
  }) => {
    await page.goto("/raka-sekar?to=Bapak%20Hendra");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Raka & Sekar");
    await expect(
      page.locator("#cover").getByText("Bapak Hendra", { exact: true }),
    ).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden");

    await page.getByRole("button", { name: "Buka undangan" }).click();

    await expect(page.getByRole("button", { name: /musik/i })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
    await expect(page.getByRole("heading", { level: 2, name: "Mempelai" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "RSVP" })).toBeAttached();
    await expect(
      page.getByRole("heading", { level: 2, name: "Amplop digital" }),
    ).toBeAttached();
    await expect(page.getByText("Turut mengundang")).toBeAttached();
  });

  test("tanpa parameter to memakai sapaan umum", async ({ page }) => {
    await page.goto("/raka-sekar");
    await expect(page.getByText("Bapak/Ibu/Saudara/i").first()).toBeVisible();
  });

  test("galeri terbuka layar penuh dan bisa ditutup", async ({ page }) => {
    await page.goto("/raka-sekar");
    await page.getByRole("button", { name: "Buka undangan" }).click();

    await page.locator("#galeri").scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: /^Buka Foto/ })
      .first()
      .click();
    await expect(page.getByRole("dialog", { name: "Galeri foto" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Galeri foto" })).toHaveCount(0);
  });

  test("tautan kalender mengarah ke berkas ics", async ({ page }) => {
    await page.goto("/raka-sekar");
    await page.getByRole("button", { name: "Buka undangan" }).click();

    await expect(page.getByRole("link", { name: /Simpan ke kalender/ })).toHaveAttribute(
      "href",
      "/raka-sekar/kalender.ics",
    );
  });

  test("slug yang tidak ada menghasilkan 404 berbahasa Indonesia", async ({ page }) => {
    const response = await page.goto("/undangan-tidak-ada");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Halaman tidak ditemukan")).toBeVisible();
  });
});
