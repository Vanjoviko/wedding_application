import { z } from "zod";
import {
  dateField,
  instagramField,
  mapsUrlField,
  optionalText,
  requiredText,
  timeField,
  timezoneField,
} from "./fields";

export const personSchema = z.object({
  nickname: requiredText("Nama panggilan", 40),
  fullName: requiredText("Nama lengkap", 120),
  childOrder: requiredText("Urutan anak", 40),
  father: requiredText("Nama ayah", 120),
  mother: requiredText("Nama ibu", 120),
  instagram: instagramField,
});

export const eventItemSchema = z.object({
  name: requiredText("Nama acara", 60),
  date: dateField,
  start: timeField,
  end: timeField.nullable(),
  tz: timezoneField,
  venue: requiredText("Nama tempat", 120),
  address: requiredText("Alamat", 240),
  mapsUrl: mapsUrlField,
});

export const openingSchema = z.object({
  presetId: z.string().trim().max(60).nullable(),
  text: requiredText("Kalimat pembuka", 400),
  source: optionalText("Sumber kutipan", 160),
  invitation: requiredText("Paragraf ajakan", 600),
});

export const storySchema = z.object({
  title: requiredText("Judul Cerita Kami", 60),
  text: requiredText("Cerita Kami", 1200),
});

export const giftAccountSchema = z.object({
  bank: requiredText("Nama bank atau e-wallet", 60),
  number: requiredText("Nomor rekening", 40),
  holder: requiredText("Nama pemilik rekening", 120),
});

export const giftsSchema = z.object({
  accounts: z
    .array(giftAccountSchema)
    .min(1, "Isi minimal satu rekening atau e-wallet.")
    .max(3, "Maksimal tiga rekening atau e-wallet."),
  address: optionalText("Alamat kirim kado", 240),
});

export const weddingContentSchema = z.object({
  groom: personSchema,
  bride: personSchema,
  events: z
    .array(eventItemSchema)
    .min(1, "Isi minimal satu acara.")
    .max(3, "Maksimal tiga acara."),
  opening: openingSchema,
  story: storySchema.optional(),
  gifts: giftsSchema.optional(),
  coInviters: z
    .array(requiredText("Turut mengundang", 80))
    .max(10, "Maksimal sepuluh nama turut mengundang.")
    .optional(),
  closing: requiredText("Kalimat penutup", 600),
});

export type WeddingContent = z.infer<typeof weddingContentSchema>;
