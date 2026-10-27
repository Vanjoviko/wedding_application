import { describe, expect, it } from "vitest";
import { eventContentSchema, parseEventContent, type WeddingContent } from "@/lib/schema";

const weddingContent: WeddingContent = {
  groom: {
    nickname: "Raka",
    fullName: "Raka Pradipta Wibowo, S.T.",
    childOrder: "pertama",
    father: "Bapak Haryo Wibowo",
    mother: "Ibu Sri Lestari",
    instagram: "raka.pradipta",
  },
  bride: {
    nickname: "Sekar",
    fullName: "Sekar Ayu Kinanti, S.Ds.",
    childOrder: "kedua",
    father: "Bapak Bambang Kuncoro",
    mother: "Ibu Ratna Dewi",
    instagram: "sekar.kinanti",
  },
  events: [
    {
      name: "Akad nikah",
      date: "2027-05-15",
      start: "08.00",
      end: "10.00",
      tz: "WIB",
      venue: "Pendopo Ndalem Sekar",
      address: "Jl. Contoh No. 12, Sleman, Yogyakarta",
    },
  ],
  opening: {
    presetId: "peribahasa-jawa",
    text: "Witing tresna jalaran saka kulina.",
    source: "Cinta tumbuh karena terbiasa bersama.",
    invitation:
      "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir.",
  },
  story: {
    title: "Cerita Kami",
    text: "Kami bertemu di sebuah lokakarya desain di Yogyakarta.",
  },
  gifts: {
    accounts: [
      {
        bank: "Bank Contoh",
        number: "1234567890",
        holder: "Sekar Ayu Kinanti",
      },
    ],
    address: "Jl. Contoh No. 12, Sleman, Yogyakarta",
  },
  coInviters: ["Keluarga Besar Wibowo"],
  closing: "Terima kasih atas doa restunya.",
};

const sweet17Content = {
  celebrant: {
    nickname: "Nadia",
    fullName: "Nadia Putri Maharani",
    father: "Bapak Arif Maharani",
    mother: "Ibu Lina Kusuma",
    instagram: "nadia.putri",
  },
  events: [
    {
      name: "Acara ulang tahun",
      date: "2027-02-20",
      start: "18.00",
      end: "21.00",
      tz: "WIB",
      venue: "Ballroom Contoh",
      address: "Jl. Contoh No. 1, Jakarta",
      rundown: [
        { time: "18.00", activity: "Pembukaan" },
        { time: "18.30", activity: "Makan malam" },
      ],
      dressCode: "Nuansa pastel",
    },
  ],
  opening: {
    presetId: null,
    text: "Dengan penuh syukur kami mengundang Anda.",
    invitation: "Mohon doa restu untuk putri kami.",
  },
  closing: "Terima kasih atas kehadiran dan doanya.",
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function errorMessages(input: unknown) {
  const result = eventContentSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.message);
}

describe("skema pernikahan", () => {
  it("menerima data demo yang lengkap", () => {
    const result = parseEventContent({
      type: "wedding",
      content: clone(weddingContent),
    });
    expect(result.type).toBe("wedding");
    expect(result.content.events).toHaveLength(1);
  });

  it("menolak data yang kurang dengan pesan Bahasa Indonesia", () => {
    const content = clone(weddingContent) as Record<string, unknown>;
    delete (content.groom as Record<string, unknown>).nickname;

    const messages = errorMessages({ type: "wedding", content });
    expect(messages).toContain("Nama panggilan wajib diisi.");
  });

  it("menolak undangan tanpa acara", () => {
    const content = clone(weddingContent);
    content.events = [];
    expect(errorMessages({ type: "wedding", content })).toContain(
      "Isi minimal satu acara.",
    );
  });

  it("menolak lebih dari tiga acara", () => {
    const content = clone(weddingContent);
    const one = content.events[0]!;
    content.events = [one, one, one, one];
    expect(errorMessages({ type: "wedding", content })).toContain("Maksimal tiga acara.");
  });

  it("menolak zona waktu di luar WIB, WITA, WIT", () => {
    const content = clone(weddingContent) as unknown as {
      events: Array<{ tz: string }>;
    };
    content.events[0]!.tz = "GMT";
    expect(errorMessages({ type: "wedding", content })).toContain(
      "Zona waktu harus WIB, WITA, atau WIT.",
    );
  });

  it("menolak tanggal yang tidak ada di kalender", () => {
    const content = clone(weddingContent);
    content.events[0]!.date = "2027-02-30";
    const messages = errorMessages({ type: "wedding", content });
    expect(messages.some((m) => m.includes("tanggal yang valid"))).toBe(true);
  });

  it("menolak cerita lebih dari 1200 karakter", () => {
    const content = clone(weddingContent);
    content.story = { title: "Cerita Kami", text: "a".repeat(1201) };
    const messages = errorMessages({ type: "wedding", content });
    expect(messages.some((m) => m.includes("maksimal 1200"))).toBe(true);
  });

  it("membuang tanda @ pada nama pengguna Instagram", () => {
    const content = clone(weddingContent);
    content.groom.instagram = "@raka.pradipta";
    const result = parseEventContent({ type: "wedding", content });
    if (result.type !== "wedding") throw new Error("jenis acara salah");
    expect(result.content.groom.instagram).toBe("raka.pradipta");
  });
});

describe("skema sweet seventeen", () => {
  it("menerima data dengan rundown dan dress code", () => {
    const result = parseEventContent({
      type: "sweet17",
      content: clone(sweet17Content),
    });
    expect(result.type).toBe("sweet17");
    if (result.type !== "sweet17") return;
    expect(result.content.events[0]!.rundown).toHaveLength(2);
  });

  it("menolak konten pernikahan yang dikirim sebagai sweet seventeen", () => {
    const messages = errorMessages({
      type: "sweet17",
      content: clone(weddingContent),
    });
    expect(messages.length).toBeGreaterThan(0);
  });

  it("menolak jenis acara yang tidak dikenal", () => {
    const messages = errorMessages({
      type: "khitanan",
      content: clone(weddingContent),
    });
    expect(messages.length).toBeGreaterThan(0);
  });
});
