import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationPreview } from "@/components/wizard/InvitationPreview";
import { loadEditData } from "../load";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pratinjau undangan",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await loadEditData(token);
  if (!data) notFound();

  return (
    <div className="bg-bg">
      <InvitationPreview
        content={data.content}
        sections={data.sections}
        media={data.media}
      />
    </div>
  );
}
