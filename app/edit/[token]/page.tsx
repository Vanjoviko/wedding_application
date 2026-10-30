import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PublishResult } from "@/app/edit/[token]/actions";
import { DeleteEventButton } from "@/components/edit/DeleteEventButton";
import { EditTabs } from "@/components/edit/EditTabs";
import { GuestsTab } from "@/components/edit/GuestsTab";
import { ResponsesTab, type ResponseRow } from "@/components/edit/ResponsesTab";
import { InvitationPreview } from "@/components/wizard/InvitationPreview";
import { Wizard } from "@/components/wizard/Wizard";
import { relativeTimeId } from "@/lib/datetime";
import { DEFAULT_GUEST_TEMPLATE } from "@/lib/guests";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { loadEditData } from "./load";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit undangan",
  robots: { index: false, follow: false },
};

type Tab = "isi" | "tamu" | "respons";

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const data = await loadEditData(token);
  if (!data) notFound();

  const tab: Tab = query.tab === "tamu" || query.tab === "respons" ? query.tab : "isi";

  const editUrl = `${data.baseUrl}/edit/${token}`;
  const publishedLinks: PublishResult | null =
    data.event.status === "published" && data.event.slug
      ? {
          ok: true,
          slug: data.event.slug,
          invitationUrl: `${data.baseUrl}/${data.event.slug}`,
          editUrl,
        }
      : null;

  const couple =
    data.content.groom?.nickname && data.content.bride?.nickname
      ? `${data.content.groom.nickname} & ${data.content.bride.nickname}`
      : "kami";

  const supabase = getSupabaseAdmin();

  let guests: string[] = [];
  let responses: ResponseRow[] = [];

  if (tab === "tamu") {
    const { data: rows } = await supabase
      .from("guests")
      .select("name")
      .eq("event_id", data.event.id)
      .order("created_at", { ascending: true });
    guests = (rows ?? []).map((row) => row.name);
  }

  if (tab === "respons") {
    const { data: rows } = await supabase
      .from("responses")
      .select("id, guest_name, attendance, pax, message, created_at")
      .eq("event_id", data.event.id)
      .order("created_at", { ascending: false })
      .limit(1000);

    responses = (rows ?? []).map((row) => ({
      id: row.id,
      guestName: row.guest_name,
      attendance: row.attendance,
      pax: row.pax,
      message: row.message,
      createdAt: row.created_at,
      timeLabel: relativeTimeId(row.created_at),
    }));
  }

  const summary = responses.reduce(
    (total, row) => {
      if (row.attendance === "hadir") {
        total.hadir += 1;
        total.pax += row.pax;
      } else {
        total.tidakHadir += 1;
      }
      return total;
    },
    { hadir: 0, pax: 0, tidakHadir: 0 },
  );

  return (
    <main className="mx-auto w-full max-w-[980px] px-4 py-8">
      <EditTabs token={token} active={tab} />

      {tab === "isi" ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
          <div className="min-w-0">
            <Wizard
              token={token}
              editUrl={editUrl}
              initialContent={data.content}
              initialSections={data.sections}
              initialMusic={data.event.musicTrack ?? "track-01"}
              initialSlug={data.event.slug ?? ""}
              status={data.event.status}
              initialMedia={data.media}
              publishedLinks={publishedLinks}
            />

            <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6">
              {publishedLinks ? (
                <a
                  href={publishedLinks.invitationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-meta text-accent underline underline-offset-4"
                >
                  Buka undangan yang sudah terbit
                </a>
              ) : null}
              <DeleteEventButton token={token} />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6 overflow-hidden rounded-[28px] border border-line bg-bg">
              <div className="max-h-[calc(100dvh-3rem)] overflow-y-auto">
                <InvitationPreview
                  content={data.content}
                  sections={data.sections}
                  media={data.media}
                />
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {tab === "tamu" ? (
        <GuestsTab
          token={token}
          slug={data.event.slug}
          couple={couple}
          baseUrl={data.baseUrl}
          names={guests}
          template={data.event.guestMessageTemplate ?? DEFAULT_GUEST_TEMPLATE}
          defaultTemplate={DEFAULT_GUEST_TEMPLATE}
        />
      ) : null}

      {tab === "respons" ? <ResponsesTab rows={responses} summary={summary} /> : null}
    </main>
  );
}
