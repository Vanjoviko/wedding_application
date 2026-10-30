import "server-only";
import { headers } from "next/headers";
import { resolveMediaUrl } from "@/lib/media";
import type { MediaItem } from "@/components/wizard/types";
import type { EditableEvent } from "@/lib/edit-auth";
import { getEventByEditToken } from "@/lib/edit-auth";
import { isDraftContent, type DraftContent } from "@/lib/draft";
import { defaultSections, sectionsSchema, type Sections } from "@/lib/schema";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type EditData = {
  event: EditableEvent;
  content: DraftContent;
  sections: Sections;
  media: MediaItem[];
  baseUrl: string;
};

export async function loadEditData(token: string): Promise<EditData | null> {
  const event = await getEventByEditToken(token);
  if (!event) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("media")
    .select("id, kind, person_key, storage_path, focal_x, focal_y")
    .eq("event_id", event.id)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);

  const media: MediaItem[] = (data ?? []).map((row) => ({
    id: row.id,
    kind: row.kind,
    personKey: row.person_key,
    url: resolveMediaUrl(row.storage_path),
    focalX: Number(row.focal_x),
    focalY: Number(row.focal_y),
  }));

  const parsedSections = sectionsSchema.safeParse(event.sections);
  const headerList = await headers();
  const host = headerList.get("host");
  const baseUrl = host
    ? `${host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https"}://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

  return {
    event,
    content: isDraftContent(event.content) ? event.content : {},
    sections: parsedSections.success ? parsedSections.data : defaultSections,
    media,
    baseUrl,
  };
}
