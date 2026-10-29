"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { clientIp, hashIp } from "@/lib/ip";
import { sectionsSchema } from "@/lib/schema";
import { initialRsvpState, type RsvpState } from "@/lib/rsvp";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const MAX_PER_HOUR = 5;

const rsvpSchema = z
  .object({
    guestName: z
      .string()
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

export async function submitRsvp(
  _previous: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) {
    return { ...initialRsvpState, status: "error", formError: "Undangan tidak dikenal." };
  }

  const guestNameRaw = String(formData.get("guestName") ?? "").trim();
  const attendanceRaw = String(formData.get("attendance") ?? "");
  const paxRaw = String(formData.get("pax") ?? "0");

  // Honeypot: bots mengisi field tersembunyi. Diterima diam-diam, tidak disimpan.
  if (String(formData.get("website") ?? "").length > 0) {
    return {
      status: "success",
      errors: {},
      guestName: guestNameRaw,
      pax: Number(paxRaw) || 0,
      attendance: attendanceRaw === "tidak_hadir" ? "tidak_hadir" : "hadir",
    };
  }

  const parsed = rsvpSchema.safeParse({
    guestName: guestNameRaw,
    attendance: attendanceRaw,
    pax: paxRaw,
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { status: "error", errors };
  }

  const supabase = getSupabaseAdmin();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, sections, expires_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (eventError) throw new Error(eventError.message);
  if (!event) {
    return {
      ...initialRsvpState,
      status: "error",
      formError: "Undangan tidak ditemukan.",
    };
  }

  if (event.expires_at && new Date(event.expires_at) < new Date()) {
    return {
      ...initialRsvpState,
      status: "error",
      formError: "Undangan ini sudah tidak aktif.",
    };
  }

  const sections = sectionsSchema.safeParse(event.sections);

  const headerList = await headers();
  const ipHash = hashIp(clientIp(headerList));
  const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();

  const { count, error: countError } = await supabase
    .from("responses")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id)
    .eq("ip_hash", ipHash)
    .gte("created_at", oneHourAgo);

  if (countError) throw new Error(countError.message);

  if ((count ?? 0) >= MAX_PER_HOUR) {
    return {
      ...initialRsvpState,
      status: "error",
      formError: "Terlalu banyak kiriman dari perangkat ini. Coba lagi dalam satu jam.",
    };
  }

  const wishesEnabled = sections.success ? sections.data.wishes : true;
  const message = wishesEnabled ? parsed.data.message || null : null;
  const attendance = parsed.data.attendance as "hadir" | "tidak_hadir";
  const pax = attendance === "hadir" ? parsed.data.pax : 0;

  const { error: insertError } = await supabase.from("responses").insert({
    event_id: event.id,
    guest_name: parsed.data.guestName,
    attendance,
    pax,
    message,
    ip_hash: ipHash,
  });

  if (insertError) throw new Error(insertError.message);

  revalidatePath(`/${slug}`);

  return {
    status: "success",
    errors: {},
    guestName: parsed.data.guestName,
    pax,
    attendance,
  };
}
