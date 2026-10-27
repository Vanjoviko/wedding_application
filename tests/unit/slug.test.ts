import { describe, expect, it } from "vitest";
import { checkSlug, normalizeSlug, slugFromNames, SLUG_MAX_LENGTH } from "@/lib/slug";

describe("normalizeSlug", () => {
  it("mengubah nama pasangan menjadi slug", () => {
    expect(normalizeSlug("Raka & Sekar")).toBe("raka-sekar");
  });

  it("membuang aksen dan karakter di luar huruf/angka", () => {
    expect(normalizeSlug("  Jösé  &  Nia!  ")).toBe("jose-nia");
  });

  it("merapikan tanda hubung berurutan dan di ujung", () => {
    expect(normalizeSlug("--raka---sekar--")).toBe("raka-sekar");
  });

  it("memotong hasil lebih dari 40 karakter tanpa menyisakan tanda hubung", () => {
    const result = normalizeSlug("a".repeat(60));
    expect(result).toHaveLength(SLUG_MAX_LENGTH);
    expect(result.endsWith("-")).toBe(false);
  });

  it("mengembalikan string kosong bila tidak ada huruf atau angka", () => {
    expect(normalizeSlug("!!! ###")).toBe("");
  });
});

describe("slugFromNames", () => {
  it("menggabungkan nama panggilan dengan tanda hubung", () => {
    expect(slugFromNames("Raka", "Sekar")).toBe("raka-sekar");
  });

  it("mengabaikan nama kosong", () => {
    expect(slugFromNames("Nadia", "")).toBe("nadia");
  });
});

describe("checkSlug", () => {
  it("menerima slug yang sah", () => {
    expect(checkSlug("raka-sekar")).toEqual({ valid: true });
  });

  it("menolak slug terlalu pendek", () => {
    const result = checkSlug("ra");
    expect(result.valid).toBe(false);
    expect(result.valid === false && result.message).toContain("minimal 3");
  });

  it("menolak huruf kapital", () => {
    const result = checkSlug("Raka-Sekar");
    expect(result.valid).toBe(false);
  });

  it("menolak tanda hubung berurutan", () => {
    const result = checkSlug("raka--sekar");
    expect(result.valid).toBe(false);
  });

  it("menolak slug lebih dari 40 karakter", () => {
    const result = checkSlug("a".repeat(41));
    expect(result.valid).toBe(false);
    expect(result.valid === false && result.message).toContain("maksimal 40");
  });

  it("menolak kata cadangan milik rute aplikasi", () => {
    for (const reserved of ["buat", "edit", "api", "demo", "admin", "_next"]) {
      const result = checkSlug(reserved);
      expect(result.valid).toBe(false);
      expect(result.valid === false && result.message).toContain("dipakai sistem");
    }
  });
});
