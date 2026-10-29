import "server-only";
import { createHash } from "node:crypto";

/** IP tamu tidak pernah disimpan mentah, hanya hash dengan salt rahasia. */
export function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT ?? "salt-pengembangan-lokal";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "tidak-diketahui";
}
