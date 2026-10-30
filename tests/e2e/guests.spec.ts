import { createHash, randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isLocalDatabase = Boolean(
  supabaseUrl && serviceKey && /localhost|127\.0\.0\.1/.test(supabaseUrl),
);

function authHeaders(prefer = "return=representation") {
  return {
    apikey: serviceKey!,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

async function createEvent(slugSuffix: string) {
  const token = `e2e-${randomUUID()}`;
  const hash = createHash("sha256").update(token).digest("hex");
  const slug = `e2e-${slugSuffix}-${randomUUID().slice(0, 6)}`;

  const response = await fetch(`${supabaseUrl}/rest/v1/events`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      slug,
      type: "wedding",
      theme: "modern",
      plan: "premium",
      status: "published",
      edit_token_hash: hash,
      content: {
        groom: { nickname: "E2E" },
        bride: { nickname: "Tamu" },
      },
      sections: { story: true, gallery: true, wishes: true, gifts: true },
      music_track: "track-01",
      published_at: new Date().toISOString(),
    }),
  });

  const rows = (await response.json()) as Array<{ id: string }>;
  return { id: rows[0]!.id, token, slug };
}

async function deleteEvent(id: string) {
  await fetch(`${supabaseUrl}/rest/v1/events?id=eq.${id}`, {
    method: "DELETE",
    headers: authHeaders("return=minimal"),
  });
}

async function openTab(page: Page, token: string, tab: string) {
  await page.goto(`/edit/${token}?tab=${tab}`);
}

test.describe("tab tamu dan respons", () => {
  test.skip(!isLocalDatabase, "Menulis data; butuh database lokal.");

  test("menyimpan daftar tamu, membuat link, dan mengunduh CSV", async ({ page }) => {
    const event = await createEvent("tamu");
    try {
      await openTab(page, event.token, "tamu");

      await page
        .locator("textarea")
        .first()
        .fill(["Bapak Satu", "Ibu Dua", "Bapak Satu", "Saudara Tiga"].join("\n"));
      await page.getByRole("button", { name: "Simpan daftar" }).click();
      await expect(page.getByText("3 nama tamu disimpan.")).toBeVisible();

      await expect(page.locator("li p.break-all")).toHaveCount(3);
      await expect(page.locator("li p.break-all").first()).toContainText(
        `/${event.slug}?to=`,
      );

      const download = page.waitForEvent("download");
      await page.getByRole("button", { name: "Unduh CSV" }).click();
      const file = await download;
      expect(file.suggestedFilename()).toBe("daftar-tamu.csv");
    } finally {
      await deleteEvent(event.id);
    }
  });

  test("ringkasan respons menghitung hadir, total orang, dan tidak hadir", async ({
    page,
  }) => {
    const event = await createEvent("respons");
    try {
      await fetch(`${supabaseUrl}/rest/v1/responses`, {
        method: "POST",
        headers: authHeaders("return=minimal"),
        body: JSON.stringify([
          {
            event_id: event.id,
            guest_name: "Tamu Hadir",
            attendance: "hadir",
            pax: 2,
            message: "Sampai jumpa.",
          },
          {
            event_id: event.id,
            guest_name: "Tamu Tidak Hadir",
            attendance: "tidak_hadir",
            pax: 0,
            message: null,
          },
        ]),
      });

      await openTab(page, event.token, "respons");

      const summary = page.locator("main");
      await expect(summary.getByText("Hadir", { exact: true })).toBeVisible();
      await expect(summary.getByText("Total orang")).toBeVisible();
      await expect(
        summary.getByText("Tidak hadir", { exact: true }).first(),
      ).toBeVisible();

      await expect(page.getByText("Tamu Hadir")).toBeVisible();
      await expect(page.getByText("Tamu Tidak Hadir")).toBeVisible();
      await expect(page.getByText("2 respons")).toBeVisible();
    } finally {
      await deleteEvent(event.id);
    }
  });

  test("hapus undangan meminta konfirmasi dan menghapus permanen", async ({ page }) => {
    const event = await createEvent("hapus");

    await page.goto(`/edit/${event.token}`);
    await page.getByRole("button", { name: "Hapus undangan" }).click();
    await page.locator("#delete-confirm").fill("HAPUS");
    await page.getByRole("button", { name: "Hapus permanen" }).click();

    await page.waitForURL("/");
    const response = await page.goto(`/edit/${event.token}`);
    expect(response?.status()).toBe(404);
  });
});
