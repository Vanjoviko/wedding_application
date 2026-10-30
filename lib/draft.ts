import { z } from "zod";

/** Bagian `content` yang boleh kosong selama draf masih diisi. */
export type DraftPerson = {
  nickname?: string;
  fullName?: string;
  childOrder?: string;
  father?: string;
  mother?: string;
  instagram?: string;
};

export type DraftEventItem = {
  name?: string;
  date?: string;
  start?: string;
  end?: string | null;
  tz?: "WIB" | "WITA" | "WIT";
  venue?: string;
  address?: string;
  mapsUrl?: string;
};

export type DraftContent = {
  groom?: DraftPerson;
  bride?: DraftPerson;
  celebrant?: DraftPerson;
  events?: DraftEventItem[];
  opening?: {
    presetId?: string | null;
    text?: string;
    source?: string;
    invitation?: string;
  };
  story?: { title?: string; text?: string };
  gifts?: {
    accounts?: Array<{ bank?: string; number?: string; holder?: string }>;
    address?: string;
  };
  coInviters?: string[];
  closing?: string;
};

export const emptyDraft: DraftContent = {
  groom: {},
  bride: {},
  events: [
    {
      name: "Akad nikah",
      date: "",
      start: "08.00",
      end: null,
      tz: "WIB",
      venue: "",
      address: "",
    },
  ],
  opening: {
    presetId: "peribahasa-jawa",
    text: "Witing tresna jalaran saka kulina.",
    source: "Cinta tumbuh karena terbiasa bersama.",
    invitation:
      "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberi doa restu di hari pernikahan kami.",
  },
  story: { title: "Cerita Kami", text: "" },
  gifts: { accounts: [], address: "" },
  coInviters: [],
  closing:
    "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. Atas kehadiran dan doa restunya, kami ucapkan terima kasih.",
};

export const draftContentSchema = z.object({}).passthrough();

export type PublishMissing = { field: string; message: string };

export function missingForPublish(content: DraftContent): PublishMissing[] {
  const missing: PublishMissing[] = [];

  const required: Array<[string, string | undefined, string]> = [
    ["groom.nickname", content.groom?.nickname, "Nama panggilan mempelai pria"],
    ["groom.fullName", content.groom?.fullName, "Nama lengkap mempelai pria"],
    ["bride.nickname", content.bride?.nickname, "Nama panggilan mempelai wanita"],
    ["bride.fullName", content.bride?.fullName, "Nama lengkap mempelai wanita"],
  ];

  for (const [field, value, label] of required) {
    if (!value || value.trim().length === 0) {
      missing.push({ field, message: `${label} belum diisi` });
    }
  }

  const events = content.events ?? [];
  const complete = events.filter(
    (event) => event.date && event.start && event.venue?.trim() && event.address?.trim(),
  );

  if (complete.length === 0) {
    missing.push({
      field: "events",
      message: "Minimal satu acara harus lengkap (tanggal, jam, tempat, alamat)",
    });
  }

  return missing;
}

/** Membatasi ukuran draf supaya tidak ada kiriman raksasa ke server. */
export const MAX_DRAFT_BYTES = 100_000;

export function isDraftContent(value: unknown): value is DraftContent {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
