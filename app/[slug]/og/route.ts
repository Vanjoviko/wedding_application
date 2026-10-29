import sharp from "sharp";
import { formatDateId } from "@/lib/datetime";
import { getEventCached } from "@/lib/events";
import { renderOgImage } from "@/lib/og-image";
import { brandName, siteUrl } from "@/lib/site";

export const runtime = "nodejs";

/** Satori tidak menerima WebP, jadi foto diubah ke JPEG lebih dulu. */
async function photoDataUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const jpeg = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize(1200, 630, { fit: "cover", position: "center" })
      .jpeg({ quality: 72 })
      .toBuffer();

    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = await getEventCached(slug).catch(() => null);
  const content = event?.content;

  const title = content
    ? "groom" in content
      ? `${content.groom.nickname} & ${content.bride.nickname}`
      : content.celebrant.nickname
    : brandName;

  const dateLabel =
    content && content.events[0]
      ? formatDateId(content.events[0].date)
      : "Undangan pernikahan digital";

  const photoUrl = event?.cover?.url.startsWith("/")
    ? `${siteUrl}${event.cover.url}`
    : event?.cover?.url;

  const photo = photoUrl ? await photoDataUrl(photoUrl) : null;

  // PNG dari Satori berukuran besar untuk foto; JPEG lebih ramah WhatsApp.
  const png = Buffer.from(await renderOgImage({ title, dateLabel, photo }).arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
    },
  });
}
