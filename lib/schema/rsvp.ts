import { z } from "zod";

/** Batas kiriman RSVP per IP per undangan per jam (PRD § RSVP). */
export const MAX_RSVP_PER_HOUR = 5;

export const rsvpSchema = z
  .object({
    guestName: z
      .string({ error: "Nama wajib diisi." })
      .trim()
      .min(1, "Nama wajib diisi.")
      .max(60, "Nama maksimal 60 karakter."),
    attendance: z
      .string()
      .refine(
        (value) => value === "hadir" || value === "tidak_hadir",
        "Pilih kehadiran.",
      ),
    pax: z.coerce
      .number()
      .int("Jumlah orang harus berupa angka.")
      .min(0, "Jumlah orang tidak valid.")
      .max(5, "Maksimal 5 orang."),
    message: z.string().trim().max(500, "Ucapan maksimal 500 karakter.").optional(),
  })
  .superRefine((value, ctx) => {
    if (value.attendance === "hadir" && value.pax < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["pax"],
        message: "Jumlah orang minimal 1.",
      });
    }
    if (value.attendance === "tidak_hadir" && value.pax !== 0) {
      ctx.addIssue({
        code: "custom",
        path: ["pax"],
        message: "Jumlah orang harus 0 bila tidak hadir.",
      });
    }
  });

export type RsvpInput = z.infer<typeof rsvpSchema>;
