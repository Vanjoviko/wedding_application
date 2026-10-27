import { z } from "zod";
import {
  dateField,
  instagramField,
  mapsUrlField,
  requiredText,
  timeField,
  timezoneField,
} from "./fields";
import { giftsSchema, openingSchema } from "./wedding";

export const celebrantSchema = z.object({
  nickname: requiredText("Nama panggilan", 40),
  fullName: requiredText("Nama lengkap", 120),
  father: requiredText("Nama ayah", 120),
  mother: requiredText("Nama ibu", 120),
  instagram: instagramField,
});

export const rundownItemSchema = z.object({
  time: timeField,
  activity: requiredText("Kegiatan rundown", 80),
});

export const sweet17EventSchema = z.object({
  name: requiredText("Nama acara", 60),
  date: dateField,
  start: timeField,
  end: timeField.nullable(),
  tz: timezoneField,
  venue: requiredText("Nama tempat", 120),
  address: requiredText("Alamat", 240),
  mapsUrl: mapsUrlField,
  rundown: z
    .array(rundownItemSchema)
    .max(12, "Rundown maksimal dua belas baris.")
    .optional(),
  dressCode: z.string().trim().max(80, "Dress code maksimal 80 karakter.").optional(),
});

export const sweet17ContentSchema = z.object({
  celebrant: celebrantSchema,
  events: z
    .array(sweet17EventSchema)
    .min(1, "Isi minimal satu acara.")
    .max(3, "Maksimal tiga acara."),
  opening: openingSchema,
  gifts: giftsSchema.optional(),
  coInviters: z
    .array(requiredText("Turut mengundang", 80))
    .max(10, "Maksimal sepuluh nama turut mengundang.")
    .optional(),
  closing: requiredText("Kalimat penutup", 600),
});

export type Sweet17Content = z.infer<typeof sweet17ContentSchema>;
