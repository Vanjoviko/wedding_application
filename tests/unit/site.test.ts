import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSite() {
  vi.resetModules();
  return import("@/lib/site");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("siteUrl", () => {
  it("memakai localhost saat NEXT_PUBLIC_SITE_URL kosong", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const { siteUrl } = await loadSite();
    expect(siteUrl).toBe("http://localhost:3000");
  });

  it("membuang garis miring di akhir URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://undangan.example.com///");
    const { siteUrl } = await loadSite();
    expect(siteUrl).toBe("https://undangan.example.com");
  });

  it("memangkas spasi di sekitar URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "  https://undangan.example.com  ");
    const { siteUrl } = await loadSite();
    expect(siteUrl).toBe("https://undangan.example.com");
  });
});

describe("brandName", () => {
  it("memakai nama sementara saat env kosong", async () => {
    vi.stubEnv("NEXT_PUBLIC_BRAND_NAME", "");
    const { brandName } = await loadSite();
    expect(brandName).toBe("Undangan Digital");
  });

  it("memakai nama brand dari env", async () => {
    vi.stubEnv("NEXT_PUBLIC_BRAND_NAME", "  Sekarwangi  ");
    const { brandName } = await loadSite();
    expect(brandName).toBe("Sekarwangi");
  });
});
