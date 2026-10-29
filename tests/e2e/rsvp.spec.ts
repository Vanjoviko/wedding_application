import { expect, test, type Page } from "@playwright/test";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const eventId = "11111111-1111-4111-8111-111111111111";

// Tes ini menulis data, jadi hanya dijalankan bila menunjuk database lokal.
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

/** Menghapus kiriman nyata (ip_hash terisi) agar batas per jam bisa diuji ulang. */
async function cleanupResponses() {
  await fetch(
    `${supabaseUrl}/rest/v1/responses?event_id=eq.${eventId}&ip_hash=not.is.null`,
    { method: "DELETE", headers: authHeaders() },
  );
}

async function countResponses(guestName: string) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/responses?event_id=eq.${eventId}&guest_name=eq.${encodeURIComponent(guestName)}&select=id`,
    { headers: authHeaders() },
  );
  const rows = (await response.json()) as unknown[];
  return rows.length;
}

async function openInvitation(page: Page) {
  await page.goto("/raka-sekar");
  await page.getByRole("button", { name: "Buka undangan" }).click();
}

async function submitRsvp(page: Page, guestName: string, message = "", pax = 1) {
  await page.locator("#rsvp").scrollIntoViewIfNeeded();
  await page.locator("#guestName").fill(guestName);
  for (let i = 1; i < pax; i += 1) {
    await page.getByRole("button", { name: "Tambah jumlah orang" }).click();
  }
  if (message) await page.locator("#message").fill(message);
  await page.getByRole("button", { name: "Kirim" }).click();
}

test.describe("RSVP dan ucapan", () => {
  test.skip(!isLocalDatabase, "Menulis data; butuh database lokal.");

  test.beforeEach(async () => {
    await cleanupResponses();
  });

  test.afterAll(async () => {
    await cleanupResponses();
  });

  test("kiriman tersimpan dan HTML tampil sebagai teks biasa", async ({ page }) => {
    const message = "<b>halo</b> & doa terbaik";

    await openInvitation(page);
    await submitRsvp(page, "Tes E2E HTML", message, 2);
    await expect(page.getByText(/sudah kami catat/)).toBeVisible();

    await page.locator("#ucapan").scrollIntoViewIfNeeded();
    await expect(page.getByText(message, { exact: true })).toBeVisible();
    await expect(page.locator("#ucapan b")).toHaveCount(0);
    expect(await countResponses("Tes E2E HTML")).toBe(1);
  });

  test("kiriman keenam dari IP yang sama ditolak", async ({ page }) => {
    for (let i = 1; i <= 5; i += 1) {
      await openInvitation(page);
      await submitRsvp(page, `Tes E2E Batas ${i}`);
      await expect(page.getByText(/sudah kami catat/)).toBeVisible();
    }

    await openInvitation(page);
    await submitRsvp(page, "Tes E2E Batas 6");
    await expect(
      page.getByText(/Terlalu banyak kiriman dari perangkat ini/),
    ).toBeVisible();

    expect(await countResponses("Tes E2E Batas 6")).toBe(0);
  });

  test("honeypot yang terisi tidak menyimpan data", async ({ page }) => {
    await openInvitation(page);
    await page.locator("#rsvp").scrollIntoViewIfNeeded();
    await page.locator("#guestName").fill("Tes E2E Honeypot");
    await page.locator("#website").evaluate((element) => {
      (element as HTMLInputElement).value = "bot";
    });
    await page.getByRole("button", { name: "Kirim" }).click();

    await expect(page.getByText(/Terima kasih/)).toBeVisible();
    expect(await countResponses("Tes E2E Honeypot")).toBe(0);
  });
});
