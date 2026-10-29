import { describe, expect, it } from "vitest";
import { MAX_RSVP_PER_HOUR, rsvpSchema } from "@/lib/schema/rsvp";

function messages(input: Record<string, string>) {
  const result = rsvpSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.message);
}

const base = {
  guestName: "Bapak Hendra",
  attendance: "hadir",
  pax: "2",
  message: "Selamat menempuh hidup baru.",
};

describe("validasi RSVP", () => {
  it("menerima kiriman hadir yang lengkap", () => {
    const result = rsvpSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.pax).toBe(2);
  });

  it("mengubah jumlah orang dari teks form menjadi angka", () => {
    const result = rsvpSchema.safeParse({ ...base, pax: "5" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.pax).toBe(5);
  });

  it("menolak nama kosong", () => {
    expect(messages({ ...base, guestName: "   " })).toContain("Nama wajib diisi.");
  });

  it("menolak nama lebih dari 60 karakter", () => {
    expect(messages({ ...base, guestName: "a".repeat(61) })).toContain(
      "Nama maksimal 60 karakter.",
    );
  });

  it("menolak kehadiran yang tidak dikenal", () => {
    expect(messages({ ...base, attendance: "mungkin" })).toContain("Pilih kehadiran.");
  });

  it("menolak hadir tanpa jumlah orang", () => {
    expect(messages({ ...base, pax: "0" })).toContain("Jumlah orang minimal 1.");
  });

  it("menolak lebih dari 5 orang", () => {
    expect(messages({ ...base, pax: "6" })).toContain("Maksimal 5 orang.");
  });

  it("menolak jumlah orang saat tamu tidak hadir", () => {
    expect(messages({ ...base, attendance: "tidak_hadir", pax: "2" })).toContain(
      "Jumlah orang harus 0 bila tidak hadir.",
    );
  });

  it("menerima tidak hadir dengan jumlah orang 0", () => {
    expect(
      rsvpSchema.safeParse({
        ...base,
        attendance: "tidak_hadir",
        pax: "0",
        message: "",
      }).success,
    ).toBe(true);
  });

  it("menolak ucapan lebih dari 500 karakter", () => {
    expect(messages({ ...base, message: "a".repeat(501) })).toContain(
      "Ucapan maksimal 500 karakter.",
    );
  });

  it("menerima ucapan kosong", () => {
    expect(rsvpSchema.safeParse({ ...base, message: "" }).success).toBe(true);
  });

  it("menyimpan HTML apa adanya sebagai teks, bukan menjalankannya", () => {
    const result = rsvpSchema.safeParse({
      ...base,
      message: "<b>halo</b><script>alert(1)</script>",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toContain("<b>halo</b>");
    }
  });

  it("memakai batas lima kiriman per jam", () => {
    expect(MAX_RSVP_PER_HOUR).toBe(5);
  });
});
