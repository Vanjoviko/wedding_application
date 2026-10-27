export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 40;

/** Kata yang dipakai rute aplikasi, tidak boleh menjadi slug undangan. */
export const RESERVED_SLUGS = new Set(["buat", "edit", "api", "demo", "admin", "_next"]);

/**
 * Mengubah teks bebas menjadi slug: huruf kecil, tanpa aksen, hanya huruf/angka,
 * pemisah satu tanda hubung, maksimal 40 karakter.
 */
export function normalizeSlug(input: string) {
  const ascii = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const dashed = ascii.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return dashed.slice(0, SLUG_MAX_LENGTH).replace(/-+$/g, "");
}

/** Saran slug dari nama panggilan kedua mempelai: "Raka" + "Sekar" → "raka-sekar". */
export function slugFromNames(...names: string[]) {
  return normalizeSlug(names.filter(Boolean).join("-"));
}

export type SlugCheck = { valid: true } | { valid: false; message: string };

export function checkSlug(slug: string): SlugCheck {
  if (slug.length < SLUG_MIN_LENGTH) {
    return {
      valid: false,
      message: `Alamat undangan minimal ${SLUG_MIN_LENGTH} karakter.`,
    };
  }

  if (slug.length > SLUG_MAX_LENGTH) {
    return {
      valid: false,
      message: `Alamat undangan maksimal ${SLUG_MAX_LENGTH} karakter.`,
    };
  }

  if (RESERVED_SLUGS.has(slug)) {
    return {
      valid: false,
      message: "Alamat undangan ini dipakai sistem. Pilih alamat lain.",
    };
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return {
      valid: false,
      message:
        "Alamat undangan hanya boleh berisi huruf kecil, angka, dan tanda hubung tunggal.",
    };
  }

  return { valid: true };
}
