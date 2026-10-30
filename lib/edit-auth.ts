import "server-only";
import { hashEditToken } from "@/lib/token";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type EditableEvent = {
  id: string;
  type: "wedding" | "sweet17";
  status: "draft" | "published";
  plan: "free" | "premium";
  slug: string | null;
  content: unknown;
  sections: unknown;
  musicTrack: string | null;
  guestMessageTemplate: string | null;
};

/**
 * Token hanya dipakai untuk mencari baris lewat hash SHA-256. Token mentah
 * tidak pernah disimpan atau dicatat di log.
 */
export async function getEventByEditToken(token: string): Promise<EditableEvent | null> {
  if (!token || token.length < 20 || token.length > 100) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, type, status, plan, slug, content, sections, music_track, guest_message_template",
    )
    .eq("edit_token_hash", hashEditToken(token))
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    id: data.id,
    type: data.type,
    status: data.status,
    plan: data.plan,
    slug: data.slug,
    content: data.content,
    sections: data.sections,
    musicTrack: data.music_track,
    guestMessageTemplate: data.guest_message_template,
  };
}
