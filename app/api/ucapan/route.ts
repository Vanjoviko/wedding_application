import { relativeTimeId } from "@/lib/datetime";
import { getPublishedEvent, getWishes } from "@/lib/events";

const PAGE_SIZE = 20;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = (url.searchParams.get("slug") ?? "").trim();
  const offsetParam = Number(url.searchParams.get("offset") ?? "0");
  const offset =
    Number.isFinite(offsetParam) && offsetParam >= 0 ? Math.floor(offsetParam) : 0;

  if (!slug) {
    return Response.json({ error: "Slug wajib diisi." }, { status: 400 });
  }

  const event = await getPublishedEvent(slug);
  if (!event || event.status !== "active" || !event.sections.wishes) {
    return Response.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  }

  const wishes = await getWishes(event.id, offset, PAGE_SIZE);

  return Response.json(
    {
      items: wishes.map((wish) => ({
        ...wish,
        timeLabel: relativeTimeId(wish.createdAt),
      })),
      hasMore: wishes.length === PAGE_SIZE,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
