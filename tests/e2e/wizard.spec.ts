import { createHash } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isLocalDatabase = Boolean(
  supabaseUrl && serviceKey && /localhost|127\.0\.0\.1/.test(supabaseUrl),
);

function authHeaders() {
  return {
    apikey: serviceKey!,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

async function deleteDraft(token: string) {
  const hash = createHash("sha256").update(token).digest("hex");
  await fetch(`${supabaseUrl}/rest/v1/events?edit_token_hash=eq.${hash}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

async function createDraft(page: Page) {
  await page.goto("/buat");
  await page.getByRole("button", { name: "Lanjut" }).click();
  await page.waitForURL(/\/edit\//);
  const token = page.url().split("/edit/")[1]!.split("?")[0]!;
  return token;
}

test.describe("wizard pembuatan undangan", () => {
  test.skip(!isLocalDatabase, "Membuat data; butuh database lokal.");

  test("draf dibuat di langkah pertama dan tahan muat ulang", async ({ page }) => {
    const token = await createDraft(page);

    try {
      await expect(page.getByText("Langkah 1 dari 6")).toBeVisible();

      await page.locator("#groom-nickname").fill("Draf E2E");
      await expect(page.getByText("Tersimpan")).toBeVisible({
        timeout: 15_000,
      });

      await page.reload();
      await expect(page.locator("#groom-nickname")).toHaveValue("Draf E2E");
    } finally {
      await deleteDraft(token);
    }
  });

  test("publikasi diblokir selama kolom wajib belum lengkap", async ({ page }) => {
    const token = await createDraft(page);

    try {
      for (let step = 0; step < 5; step += 1) {
        await page.getByRole("button", { name: "Lanjut" }).click();
      }

      await expect(page.getByText("Langkah 6 dari 6")).toBeVisible();
      await expect(
        page.getByText("Nama panggilan mempelai pria belum diisi"),
      ).toBeVisible();
      await expect(page.getByText("Foto cover belum diunggah")).toBeVisible();
      await expect(page.getByRole("button", { name: "Publikasikan" })).toBeDisabled();
    } finally {
      await deleteDraft(token);
    }
  });
});
