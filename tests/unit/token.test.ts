import { describe, expect, it } from "vitest";
import { createEditToken, hashEditToken, matchesEditToken } from "@/lib/token";

describe("createEditToken", () => {
  it("menghasilkan 32 byte acak dalam bentuk base64url", () => {
    const token = createEditToken();
    expect(token).toHaveLength(43);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token.endsWith("=")).toBe(false);
  });

  it("tidak pernah menghasilkan token yang sama", () => {
    const tokens = new Set(Array.from({ length: 50 }, () => createEditToken()));
    expect(tokens.size).toBe(50);
  });
});

describe("hashEditToken", () => {
  it("menghasilkan hash SHA-256 hex 64 karakter", () => {
    const hash = hashEditToken("token-contoh");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("deterministik untuk token yang sama", () => {
    expect(hashEditToken("token-contoh")).toBe(hashEditToken("token-contoh"));
  });
});

describe("matchesEditToken", () => {
  const token = "demo-raka-sekar-edit-token-2027";
  const hash = hashEditToken(token);

  it("cocok untuk token yang benar", () => {
    expect(matchesEditToken(token, hash)).toBe(true);
  });

  it("menolak token yang salah", () => {
    expect(matchesEditToken(`${token}x`, hash)).toBe(false);
  });

  it("menolak hash dengan panjang berbeda tanpa melempar error", () => {
    expect(matchesEditToken(token, "abcd")).toBe(false);
  });

  it("cocok dengan hash yang disimpan di seed demo", () => {
    expect(hash).toBe("2c3df0389c723f09162776e515c6c1c170c529484e2716e6664355ad0e60c977");
  });
});
