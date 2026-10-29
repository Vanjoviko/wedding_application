import { buildIcs } from "@/lib/datetime";
import { getEventCached } from "@/lib/events";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = await getEventCached(slug).catch(() => null);

  if (!event || event.status !== "active") {
    return new Response("Undangan tidak ditemukan.", { status: 404 });
  }

  const content = event.content;
  const title =
    "groom" in content
      ? `Pernikahan ${content.groom.nickname} & ${content.bride.nickname}`
      : `Ulang tahun ${content.celebrant.nickname}`;

  const ics = buildIcs({
    uidBase: event.id,
    title,
    events: content.events,
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
