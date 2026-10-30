import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationPreview } from "@/components/wizard/InvitationPreview";
import { Wizard } from "@/components/wizard/Wizard";
import type { PublishResult } from "@/app/edit/[token]/actions";
import { loadEditData } from "./load";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit undangan",
  robots: { index: false, follow: false },
};

export default async function EditPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await loadEditData(token);
  if (!data) notFound();

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

  return (
    <main className="mx-auto grid w-full max-w-[980px] gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
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
    </main>
  );
}
