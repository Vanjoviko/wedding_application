import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationShell } from "@/components/invitation/InvitationShell";
import type { PersonView } from "@/components/ui/PersonBlock";
import {
  countdownParts,
  eventStartUtc,
  formatDateId,
  googleCalendarUrl,
  relativeTimeId,
} from "@/lib/datetime";
import { getEventCached, getWishes, type EventMedia } from "@/lib/events";
import type { EventContent } from "@/lib/schema";
import { brandName } from "@/lib/site";
import { Acara } from "@/themes/modern/Acara";
import { Amplop } from "@/themes/modern/Amplop";
import { CeritaKami } from "@/themes/modern/CeritaKami";
import { Cover } from "@/themes/modern/Cover";
import { Galeri } from "@/themes/modern/Galeri";
import { Mempelai } from "@/themes/modern/Mempelai";
import { Pembuka } from "@/themes/modern/Pembuka";
import { Penutup } from "@/themes/modern/Penutup";
import { Rsvp } from "@/themes/modern/Rsvp";
import { Ucapan } from "@/themes/modern/Ucapan";

// Undangan bergantung pada database dan slug, jadi dirender saat diminta.
// force-dynamic menjaga status 404 tetap 404 (bukan 200 dari shell PPR).
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string | string[] }>;
};

function coupleNames(content: EventContent["content"]) {
  return "groom" in content
    ? `${content.groom.nickname} & ${content.bride.nickname}`
    : content.celebrant.nickname;
}

function pageTitle(content: EventContent["content"]) {
  return "groom" in content
    ? `Undangan Pernikahan ${content.groom.nickname} & ${content.bride.nickname}`
    : `Undangan ${content.celebrant.fullName}`;
}

function guestNameFrom(raw: string | string[] | undefined) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const trimmed = (value ?? "").trim().slice(0, 60);
  return trimmed.length > 0 ? trimmed : "Bapak/Ibu/Saudara/i";
}

function toPerson(
  media: EventMedia | undefined,
): Pick<PersonView, "photo" | "focalX" | "focalY"> {
  return {
    photo: media?.url,
    focalX: media?.focalX,
    focalY: media?.focalY,
  };
}

export async function generateMetadata({
  params,
}: Pick<PageProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const robots = { index: false, follow: false };
  const event = await getEventCached(slug).catch(() => null);

  if (!event || event.status !== "active") {
    return { title: "Undangan tidak tersedia", robots };
  }

  return {
    title: pageTitle(event.content),
    description: `Undangan ${coupleNames(event.content)} — ${brandName}`,
    robots,
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const event = await getEventCached(slug);

  if (!event) notFound();

  if (event.status === "expired") {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center px-8 text-center">
        <h1 className="font-serif text-card text-ink italic">
          Undangan ini sudah tidak aktif
        </h1>
        <p className="mt-3 text-body text-muted">
          Masa aktif undangan telah berakhir. Silakan hubungi pengirim undangan bila
          memerlukan informasi acara.
        </p>
      </main>
    );
  }

  const guestName = guestNameFrom(query.to);
  const content = event.content;
  const isWedding = "groom" in content;
  const names = coupleNames(content);
  const dateLabel = formatDateId(content.events[0]!.date);
  const target = eventStartUtc(content.events[0]!);
  const initialCountdown = countdownParts(target);

  const wishes = event.sections.wishes ? await getWishes(event.id, 0, 20) : [];
  const wishItems = wishes.map((wish) => ({
    ...wish,
    timeLabel: relativeTimeId(wish.createdAt),
  }));

  const coverPhoto = event.cover;
  const watermark = event.plan === "free" ? `Dibuat dengan ${brandName}` : null;

  return (
    <InvitationShell
      musicSrc={event.musicTrack ? `/music/${event.musicTrack}.mp3` : null}
      cover={
        <Cover
          couple={names}
          dateLabel={dateLabel}
          guestName={guestName}
          photo={coverPhoto?.url}
          focalX={coverPhoto?.focalX}
          focalY={coverPhoto?.focalY}
        />
      }
    >
      <main className="mx-auto w-full max-w-[430px]">
        <Pembuka
          quote={content.opening.text}
          source={content.opening.source}
          invitation={content.opening.invitation}
        />

        {isWedding ? (
          <Mempelai
            groom={{
              ...content.groom,
              ...toPerson(event.mediaByPerson.groom),
            }}
            bride={{
              ...content.bride,
              ...toPerson(event.mediaByPerson.bride),
            }}
          />
        ) : (
          <section id="profil" className="px-6 pt-16 pb-20 text-center">
            <h2 className="font-serif text-title text-ink italic">Yang berulang tahun</h2>
            <div className="mx-auto mt-9 h-[428px] w-[342px] max-w-full overflow-hidden rounded-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.mediaByPerson.celebrant?.url ?? "/demo/cover.webp"}
                alt={`Foto ${content.celebrant.fullName}`}
                className="size-full object-cover"
                style={{
                  objectPosition: `${Math.round((event.mediaByPerson.celebrant?.focalX ?? 0.5) * 100)}% ${Math.round((event.mediaByPerson.celebrant?.focalY ?? 0.5) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-5 font-serif text-name text-ink italic">
              {content.celebrant.nickname}
            </p>
            <p className="mt-1 font-serif text-fullname text-ink-soft">
              {content.celebrant.fullName}
            </p>
            <p className="mt-1.5 text-meta text-muted">
              Anak dari {content.celebrant.father} dan {content.celebrant.mother}
            </p>
          </section>
        )}

        {event.sections.story && isWedding && content.story ? (
          <CeritaKami title={content.story.title} text={content.story.text} />
        ) : null}

        <Acara
          dateLabel={dateLabel}
          events={content.events}
          countdownTargetIso={target.toISOString()}
          initialCountdown={initialCountdown}
          calendarHref={`/${slug}/kalender.ics`}
          googleCalendarHref={googleCalendarUrl({
            title: `Pernikahan ${names}`,
            events: content.events,
          })}
        />

        {event.sections.gallery && event.gallery.length > 0 ? (
          <Galeri
            photos={event.gallery.map((photo) => ({
              url: photo.url,
              focalX: photo.focalX,
              focalY: photo.focalY,
            }))}
            altPrefix={`Foto ${names}`}
          />
        ) : null}

        <Rsvp
          slug={slug}
          defaultName={guestName === "Bapak/Ibu/Saudara/i" ? "" : guestName}
          showMessage={event.sections.wishes}
        />

        {event.sections.wishes ? (
          <Ucapan slug={slug} items={wishItems} hasMore={wishes.length === 20} />
        ) : null}

        {event.sections.gifts && content.gifts ? (
          <Amplop accounts={content.gifts.accounts} address={content.gifts.address} />
        ) : null}

        <Penutup
          closing={content.closing}
          coupleNames={names}
          coInviters={content.coInviters}
          watermark={watermark}
        />
      </main>
    </InvitationShell>
  );
}
