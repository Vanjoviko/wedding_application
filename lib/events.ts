import "server-only";
import { cache } from "react";
import { resolveMediaUrl } from "@/lib/media";
import {
  defaultSections,
  eventContentSchema,
  sectionsSchema,
  type EventContent,
  type Sections,
} from "@/lib/schema";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type EventMedia = {
  id: string;
  kind: "cover" | "person" | "gallery";
  personKey: "groom" | "bride" | "celebrant" | null;
  url: string;
  focalX: number;
  focalY: number;
  sortOrder: number;
};

export type PublishedEvent = {
  id: string;
  slug: string;
  plan: "free" | "premium";
  sections: Sections;
  content: EventContent["content"];
  musicTrack: string | null;
  expiresAt: Date | null;
  status: "active" | "expired";
  cover: EventMedia | null;
  mediaByPerson: Partial<Record<"groom" | "bride" | "celebrant", EventMedia>>;
  gallery: EventMedia[];
};

type MediaRow = {
  id: string;
  kind: string;
  person_key: string | null;
  storage_path: string;
  focal_x: number | string;
  focal_y: number | string;
  sort_order: number;
};

function toMedia(row: MediaRow): EventMedia {
  return {
    id: row.id,
    kind: row.kind as EventMedia["kind"],
    personKey: row.person_key as EventMedia["personKey"],
    url: resolveMediaUrl(row.storage_path),
    focalX: Number(row.focal_x),
    focalY: Number(row.focal_y),
    sortOrder: row.sort_order,
  };
}

export async function getPublishedEvent(slug: string): Promise<PublishedEvent | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, slug, type, plan, content, sections, music_track, expires_at, media(id, kind, person_key, storage_path, focal_x, focal_y, sort_order)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Gagal membaca undangan: ${error.message}`);
  if (!data) return null;

  const parsedContent = eventContentSchema.safeParse({
    type: data.type,
    content: data.content,
  });

  if (!parsedContent.success) {
    console.error(
      "Konten undangan tidak lolos skema:",
      parsedContent.error.issues.map((issue) => issue.path.join(".")),
    );
    return null;
  }

  const parsedSections = sectionsSchema.safeParse(data.sections);
  const sections = parsedSections.success ? parsedSections.data : defaultSections;

  const media = ((data.media ?? []) as MediaRow[]).map(toMedia);
  const cover = media.find((item) => item.kind === "cover") ?? null;

  const mediaByPerson: PublishedEvent["mediaByPerson"] = {};
  for (const item of media) {
    if (item.kind === "person" && item.personKey) {
      mediaByPerson[item.personKey] = item;
    }
  }

  const gallery = media
    .filter((item) => item.kind === "gallery")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
  const status = expiresAt && expiresAt.getTime() < Date.now() ? "expired" : "active";

  return {
    id: data.id,
    slug: data.slug,
    plan: data.plan,
    sections,
    content: parsedContent.data.content,
    musicTrack: data.music_track,
    expiresAt,
    status,
    cover,
    mediaByPerson,
    gallery,
  };
}

export type WishItem = {
  id: string;
  guestName: string;
  attendance: "hadir" | "tidak_hadir";
  pax: number;
  message: string | null;
  createdAt: string;
};

export async function getWishes(
  eventId: string,
  offset = 0,
  limit = 20,
): Promise<WishItem[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("responses")
    .select("id, guest_name, attendance, pax, message, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`Gagal membaca ucapan: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    guestName: row.guest_name,
    attendance: row.attendance,
    pax: row.pax,
    message: row.message,
    createdAt: row.created_at,
  }));
}

/** Satu kali query per request walau dipakai page dan generateMetadata. */
export const getEventCached = cache(getPublishedEvent);
