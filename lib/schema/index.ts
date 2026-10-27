import { z } from "zod";
import { sweet17ContentSchema } from "./sweet17";
import { weddingContentSchema } from "./wedding";

export const EVENT_TYPES = ["wedding", "sweet17"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const eventTypeField = z.custom<EventType>(
  (value) =>
    typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value),
  "Jenis acara harus wedding atau sweet17.",
);

/** `content` divalidasi menurut jenis acara, bukan satu skema longgar. */
export const eventContentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("wedding"),
    content: weddingContentSchema,
  }),
  z.object({
    type: z.literal("sweet17"),
    content: sweet17ContentSchema,
  }),
]);

export type EventContent = z.infer<typeof eventContentSchema>;

export const sectionsSchema = z.object({
  story: z.boolean(),
  gallery: z.boolean(),
  wishes: z.boolean(),
  gifts: z.boolean(),
});

export type Sections = z.infer<typeof sectionsSchema>;

export const defaultSections: Sections = {
  story: true,
  gallery: true,
  wishes: true,
  gifts: true,
};

export function parseEventContent(input: unknown) {
  return eventContentSchema.parse(input);
}

/** Mengubah pesan error Zod menjadi daftar yang bisa ditampilkan per kolom. */
export function fieldErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export * from "./fields";
export * from "./sweet17";
export * from "./wedding";
