"use server";

import { redirect } from "next/navigation";
import { emptyDraft } from "@/lib/draft";
import { defaultSections } from "@/lib/schema";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { createEditToken, hashEditToken } from "@/lib/token";

export async function createDraft(formData: FormData) {
  const type = String(formData.get("type") ?? "wedding");
  if (type !== "wedding" && type !== "sweet17") {
    throw new Error("Jenis acara tidak dikenal.");
  }

  const token = createEditToken();
  const supabase = getSupabaseAdmin();

  const content =
    type === "wedding"
      ? emptyDraft
      : {
          ...emptyDraft,
          groom: undefined,
          bride: undefined,
          celebrant: {},
        };

  const plan = process.env.DEFAULT_PLAN === "free" ? "free" : "premium";

  const { error } = await supabase.from("events").insert({
    type,
    theme: "modern",
    plan,
    status: "draft",
    edit_token_hash: hashEditToken(token),
    content,
    sections: defaultSections,
    music_track: "track-01",
  });

  if (error) throw new Error(error.message);

  redirect(`/edit/${token}`);
}
