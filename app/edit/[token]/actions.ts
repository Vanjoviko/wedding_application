"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getEventByEditToken } from "@/lib/edit-auth";
import { parseGuestNames } from "@/lib/guests";
import {
  MAX_DRAFT_BYTES,
  isDraftContent,
  missingForPublish,
  type DraftContent,
} from "@/lib/draft";
import { resolveMediaUrl } from "@/lib/media";
import {
  defaultSections,
  eventContentSchema,
  sectionsSchema,
  type EventContent,
} from "@/lib/schema";
import { checkSlug, normalizeSlug } from "@/lib/slug";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const PLAN_DAYS = { free: 7, premium: 90 } as const;

function baseUrl(host: string | null) {
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const proto =
    host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${proto}://${host}`;
}

function trimOrUndefined(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

/** Draf boleh setengah jadi; dirapikan dulu sebelum divalidasi skema penuh. */
function normalizeContent(
  type: "wedding" | "sweet17",
  draft: DraftContent,
): EventContent {
  const person = (source: DraftContent["groom"]) => ({
    nickname: source?.nickname?.trim() ?? "",
    fullName: source?.fullName?.trim() ?? "",
    childOrder: source?.childOrder?.trim() ?? "",
    father: source?.father?.trim() ?? "",
    mother: source?.mother?.trim() ?? "",
    instagram: trimOrUndefined(source?.instagram?.replace(/^@/, "")),
  });

  const events = (draft.events ?? [])
    .filter((event) => event.date || event.venue || event.address)
    .map((event) => ({
      name: event.name?.trim() || "Acara",
      date: event.date?.trim() ?? "",
      start: event.start?.trim() ?? "",
      end: event.end ? event.end : null,
      tz: event.tz ?? "WIB",
      venue: event.venue?.trim() ?? "",
      address: event.address?.trim() ?? "",
      mapsUrl: trimOrUndefined(event.mapsUrl),
    }));

  const accounts = (draft.gifts?.accounts ?? []).filter(
    (account) => account.bank || account.number || account.holder,
  );

  const opening = {
    presetId: draft.opening?.presetId ?? null,
    text: draft.opening?.text?.trim() ?? "",
    source: trimOrUndefined(draft.opening?.source),
    invitation: draft.opening?.invitation?.trim() ?? "",
  };

  if (type === "sweet17") {
    return {
      type: "sweet17",
      content: {
        celebrant: {
          nickname: draft.celebrant?.nickname?.trim() ?? "",
          fullName: draft.celebrant?.fullName?.trim() ?? "",
          father: draft.celebrant?.father?.trim() ?? "",
          mother: draft.celebrant?.mother?.trim() ?? "",
          instagram: trimOrUndefined(draft.celebrant?.instagram?.replace(/^@/, "")),
        },
        events,
        opening,
        gifts:
          accounts.length > 0
            ? {
                accounts: accounts.map((account) => ({
                  bank: account.bank?.trim() ?? "",
                  number: account.number?.trim() ?? "",
                  holder: account.holder?.trim() ?? "",
                })),
                address: trimOrUndefined(draft.gifts?.address),
              }
            : undefined,
        coInviters: (draft.coInviters ?? []).map((name) => name.trim()).filter(Boolean),
        closing: draft.closing?.trim() ?? "",
      },
    } as EventContent;
  }

  return {
    type: "wedding",
    content: {
      groom: person(draft.groom),
      bride: person(draft.bride),
      events,
      opening,
      story: draft.story?.text?.trim()
        ? {
            title: draft.story.title?.trim() || "Cerita Kami",
            text: draft.story.text.trim(),
          }
        : undefined,
      gifts:
        accounts.length > 0
          ? {
              accounts: accounts.map((account) => ({
                bank: account.bank?.trim() ?? "",
                number: account.number?.trim() ?? "",
                holder: account.holder?.trim() ?? "",
              })),
              address: trimOrUndefined(draft.gifts?.address),
            }
          : undefined,
      coInviters: (draft.coInviters ?? []).map((name) => name.trim()).filter(Boolean),
      closing: draft.closing?.trim() ?? "",
    },
  } as EventContent;
}

export type SaveResult = { ok: true } | { ok: false; message: string };

export async function saveDraft(
  token: string,
  content: unknown,
  sections: unknown,
  musicTrack: string | null,
): Promise<SaveResult> {
  const event = await getEventByEditToken(token);
  if (!event) return { ok: false, message: "Alamat edit tidak dikenal." };
  if (!isDraftContent(content)) {
    return { ok: false, message: "Data undangan tidak valid." };
  }

  const size = JSON.stringify(content).length;
  if (size > MAX_DRAFT_BYTES) {
    return { ok: false, message: "Data undangan terlalu besar." };
  }

  const parsedSections = sectionsSchema.safeParse(sections);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("events")
    .update({
      content,
      sections: parsedSections.success ? parsedSections.data : defaultSections,
      music_track: musicTrack,
    })
    .eq("id", event.id);

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/edit/${token}`);
  return { ok: true };
}

export type SlugState = { valid: boolean; slug: string; message: string };

export async function checkSlugAvailability(
  token: string,
  rawSlug: string,
): Promise<SlugState> {
  const event = await getEventByEditToken(token);
  if (!event) {
    return { valid: false, slug: "", message: "Alamat edit tidak dikenal." };
  }

  const slug = normalizeSlug(rawSlug);
  const check = checkSlug(slug);
  if (!check.valid) return { valid: false, slug, message: check.message };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) return { valid: false, slug, message: error.message };

  if (data && data.id !== event.id) {
    return {
      valid: false,
      slug,
      message: "Alamat undangan sudah dipakai. Pilih yang lain.",
    };
  }

  return { valid: true, slug, message: "Alamat ini tersedia." };
}

export type PublishResult =
  | { ok: true; slug: string; invitationUrl: string; editUrl: string }
  | { ok: false; message: string; missing?: string[] };

export async function publishInvitation(
  token: string,
  rawSlug: string,
): Promise<PublishResult> {
  const event = await getEventByEditToken(token);
  if (!event) return { ok: false, message: "Alamat edit tidak dikenal." };

  const slugState = await checkSlugAvailability(token, rawSlug);
  if (!slugState.valid) {
    return { ok: false, message: slugState.message };
  }

  if (!isDraftContent(event.content)) {
    return { ok: false, message: "Data undangan tidak valid." };
  }

  const missing = missingForPublish(event.content);

  const supabase = getSupabaseAdmin();
  const { data: mediaRows, error: mediaError } = await supabase
    .from("media")
    .select("id, kind")
    .eq("event_id", event.id)
    .eq("kind", "cover");

  if (mediaError) return { ok: false, message: mediaError.message };

  const problems = missing.map((item) => item.message);
  if (!mediaRows || mediaRows.length === 0) {
    problems.push("Foto cover belum diunggah");
  }

  const normalized = normalizeContent(event.type, event.content as DraftContent);
  const parsed = eventContentSchema.safeParse(normalized);

  if (problems.length > 0 || !parsed.success) {
    const messages = parsed.success
      ? problems
      : [...problems, ...parsed.error.issues.map((issue) => issue.message)];
    return {
      ok: false,
      message: "Undangan belum bisa dipublikasikan.",
      missing: [...new Set(messages)],
    };
  }

  const events = parsed.data.content.events;
  const lastDate = events
    .map((item) => item.date)
    .sort()
    .at(-1) as string;

  const expiresAt = new Date(`${lastDate}T23:59:59+07:00`);
  expiresAt.setDate(expiresAt.getDate() + PLAN_DAYS[event.plan]);

  const { error } = await supabase
    .from("events")
    .update({
      slug: slugState.slug,
      status: "published",
      content: normalized.content,
      published_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .eq("id", event.id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "Alamat undangan baru saja dipakai orang lain." };
    }
    return { ok: false, message: error.message };
  }

  const headerList = await headers();
  const base = baseUrl(headerList.get("host"));

  revalidatePath(`/${slugState.slug}`);
  revalidatePath(`/edit/${token}`);

  return {
    ok: true,
    slug: slugState.slug,
    invitationUrl: `${base}/${slugState.slug}`,
    editUrl: `${base}/edit/${token}`,
  };
}

/* ------------------------------- foto ------------------------------- */

export type UploadTarget =
  { ok: true; path: string; signedUrl: string } | { ok: false; message: string };

export async function createUploadTarget(
  token: string,
  kind: "cover" | "person" | "gallery",
  personKey: "groom" | "bride" | null,
): Promise<UploadTarget> {
  const event = await getEventByEditToken(token);
  if (!event) return { ok: false, message: "Alamat edit tidak dikenal." };

  const suffix = kind === "person" && personKey ? personKey : kind;
  const path = `${event.id}/${suffix}-${randomUUID()}.webp`;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from("media")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Gagal menyiapkan unggahan." };
  }

  return { ok: true, path, signedUrl: data.signedUrl };
}

export type RegisteredMedia = {
  id: string;
  kind: "cover" | "person" | "gallery";
  personKey: "groom" | "bride" | null;
  url: string;
  focalX: number;
  focalY: number;
};

export async function registerMedia(
  token: string,
  input: {
    path: string;
    kind: "cover" | "person" | "gallery";
    personKey: "groom" | "bride" | null;
    width: number;
    height: number;
  },
): Promise<{ ok: true; media: RegisteredMedia } | { ok: false; message: string }> {
  const event = await getEventByEditToken(token);
  if (!event) return { ok: false, message: "Alamat edit tidak dikenal." };

  if (!input.path.startsWith(`${event.id}/`)) {
    return { ok: false, message: "Berkas tidak dikenal." };
  }

  const supabase = getSupabaseAdmin();

  const { data: existing, error: countError } = await supabase
    .from("media")
    .select("id, kind, person_key")
    .eq("event_id", event.id);

  if (countError) return { ok: false, message: countError.message };

  const rows = existing ?? [];
  if (input.kind === "cover" && rows.some((row) => row.kind === "cover")) {
    return { ok: false, message: "Foto cover hanya boleh satu." };
  }
  if (
    input.kind === "person" &&
    rows.some((row) => row.kind === "person" && row.person_key === input.personKey)
  ) {
    return { ok: false, message: "Foto mempelai ini sudah ada." };
  }
  if (
    input.kind === "gallery" &&
    rows.filter((row) => row.kind === "gallery").length >= 10
  ) {
    return { ok: false, message: "Galeri maksimal 10 foto." };
  }

  const { data, error } = await supabase
    .from("media")
    .insert({
      event_id: event.id,
      kind: input.kind,
      person_key: input.kind === "person" ? input.personKey : null,
      storage_path: input.path,
      width: Math.round(input.width),
      height: Math.round(input.height),
      focal_x: 0.5,
      focal_y: 0.5,
      sort_order: rows.filter((row) => row.kind === input.kind).length,
    })
    .select("id, kind, person_key, storage_path, focal_x, focal_y")
    .single();

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Gagal menyimpan foto." };
  }

  revalidatePath(`/edit/${token}`);

  return {
    ok: true,
    media: {
      id: data.id,
      kind: data.kind,
      personKey: data.person_key,
      url: resolveMediaUrl(data.storage_path),
      focalX: Number(data.focal_x),
      focalY: Number(data.focal_y),
    },
  };
}

export async function updateFocalPoint(
  token: string,
  mediaId: string,
  focalX: number,
  focalY: number,
): Promise<SaveResult> {
  const event = await getEventByEditToken(token);
  if (!event) return { ok: false, message: "Alamat edit tidak dikenal." };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("media")
    .update({
      focal_x: Math.min(1, Math.max(0, focalX)),
      focal_y: Math.min(1, Math.max(0, focalY)),
    })
    .eq("id", mediaId)
    .eq("event_id", event.id);

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/edit/${token}`);
  return { ok: true };
}

export async function deleteMedia(token: string, mediaId: string): Promise<SaveResult> {
  const event = await getEventByEditToken(token);
  if (!event) return { ok: false, message: "Alamat edit tidak dikenal." };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("media")
    .select("storage_path")
    .eq("id", mediaId)
    .eq("event_id", event.id)
    .maybeSingle();

  if (error) return { ok: false, message: error.message };
  if (!data) return { ok: false, message: "Foto tidak ditemukan." };

  await supabase.storage.from("media").remove([data.storage_path]);

  const { error: deleteError } = await supabase
    .from("media")
    .delete()
    .eq("id", mediaId)
    .eq("event_id", event.id);

  if (deleteError) return { ok: false, message: deleteError.message };

  revalidatePath(`/edit/${token}`);
  return { ok: true };
}

/* ------------------------------ tamu ------------------------------ */

export type GuestsResult = { ok: true; count: number } | { ok: false; message: string };

export async function saveGuests(token: string, rawNames: string): Promise<GuestsResult> {
  const event = await getEventByEditToken(token);
  if (!event) return { ok: false, message: "Alamat edit tidak dikenal." };

  const names = parseGuestNames(rawNames);
  if (names.length === 0) {
    return { ok: false, message: "Isi minimal satu nama tamu." };
  }

  const supabase = getSupabaseAdmin();

  const { error: deleteError } = await supabase
    .from("guests")
    .delete()
    .eq("event_id", event.id);

  if (deleteError) return { ok: false, message: deleteError.message };

  const { error: insertError } = await supabase
    .from("guests")
    .insert(names.map((name) => ({ event_id: event.id, name })));

  if (insertError) return { ok: false, message: insertError.message };

  revalidatePath(`/edit/${token}`);
  return { ok: true, count: names.length };
}

export async function saveGuestTemplate(
  token: string,
  template: string,
): Promise<SaveResult> {
  const event = await getEventByEditToken(token);
  if (!event) return { ok: false, message: "Alamat edit tidak dikenal." };

  const trimmed = template.slice(0, 1200);
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("events")
    .update({ guest_message_template: trimmed.trim() ? trimmed : null })
    .eq("id", event.id);

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/edit/${token}`);
  return { ok: true };
}

/* --------------------------- hapus undangan --------------------------- */

export async function deleteEventPermanently(token: string): Promise<SaveResult> {
  const event = await getEventByEditToken(token);
  if (!event) return { ok: false, message: "Alamat edit tidak dikenal." };

  const supabase = getSupabaseAdmin();

  const { data: mediaRows } = await supabase
    .from("media")
    .select("storage_path")
    .eq("event_id", event.id);

  const paths = (mediaRows ?? []).map((row) => row.storage_path);
  if (paths.length > 0) {
    await supabase.storage.from("media").remove(paths);
  }

  const { error } = await supabase.from("events").delete().eq("id", event.id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  return { ok: true };
}
