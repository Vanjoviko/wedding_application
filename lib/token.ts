import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_BYTES = 32;

/** Token edit: 32 byte acak, base64url. Hanya hash-nya yang disimpan. */
export function createEditToken() {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function hashEditToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/**
 * Membandingkan token dengan hash tersimpan memakai waktu konstan, supaya
 * penyerang tidak bisa menebak isi token dari selisih waktu respons.
 */
export function matchesEditToken(token: string, storedHash: string) {
  const candidate = Buffer.from(hashEditToken(token), "hex");
  const stored = Buffer.from(storedHash, "hex");

  if (candidate.length !== stored.length) return false;

  return timingSafeEqual(candidate, stored);
}
