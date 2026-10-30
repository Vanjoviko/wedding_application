import { z } from "zod";

export function requiredText(label: string, max: number) {
  return z
    .string({ error: `${label} wajib diisi.` })
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`);
}

export function optionalText(label: string, max: number) {
  return z.string().trim().max(max, `${label} maksimal ${max} karakter.`).optional();
}

export const timeField = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3])\.[0-5]\d$/, "Jam harus berformat HH.MM, misalnya 08.00.");

function isRealDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export const dateField = z
  .string()
  .trim()
  .refine(
    isRealDate,
    "Tanggal harus berformat YYYY-MM-DD dan merupakan tanggal yang valid.",
  );

export const TIMEZONES = ["WIB", "WITA", "WIT"] as const;
export type Timezone = (typeof TIMEZONES)[number];

export const timezoneField = z.custom<Timezone>(
  (value) =>
    typeof value === "string" && (TIMEZONES as readonly string[]).includes(value),
  "Zona waktu harus WIB, WITA, atau WIT.",
);

export const instagramField = z
  .string()
  .trim()
  .max(30, "Nama pengguna Instagram maksimal 30 karakter.")
  .regex(
    /^@?[A-Za-z0-9._]*$/,
    "Nama pengguna Instagram hanya boleh huruf, angka, titik, dan garis bawah.",
  )
  .optional()
  .transform((value) => {
    if (!value) return undefined;
    const withoutAt = value.replace(/^@/, "");
    return withoutAt.length > 0 ? withoutAt : undefined;
  });

export const mapsUrlField = z
  .string()
  .trim()
  .refine(
    (value) => value.length > 0 && URL.canParse(value),
    "Link Google Maps harus berupa URL yang valid.",
  )
  .optional();
