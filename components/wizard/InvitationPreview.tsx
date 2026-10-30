import { formatDateId } from "@/lib/datetime";
import type { DraftContent } from "@/lib/draft";
import type { Sections } from "@/lib/schema";
import type { MediaItem } from "@/components/wizard/types";
import { Acara } from "@/themes/modern/Acara";
import { Amplop } from "@/themes/modern/Amplop";
import { CeritaKami } from "@/themes/modern/CeritaKami";
import { Cover } from "@/themes/modern/Cover";
import { Galeri } from "@/themes/modern/Galeri";
import { Mempelai } from "@/themes/modern/Mempelai";
import { Pembuka } from "@/themes/modern/Pembuka";
import { Penutup } from "@/themes/modern/Penutup";

type Props = {
  content: DraftContent;
  sections: Sections;
  media: MediaItem[];
};

function textOr(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export function InvitationPreview({ content, sections, media }: Props) {
  const groom = content.groom ?? {};
  const bride = content.bride ?? {};
  const couple = `${textOr(groom.nickname, "Mempelai pria")} & ${textOr(bride.nickname, "Mempelai wanita")}`;

  const cover = media.find((item) => item.kind === "cover");
  const groomPhoto = media.find(
    (item) => item.kind === "person" && item.personKey === "groom",
  );
  const bridePhoto = media.find(
    (item) => item.kind === "person" && item.personKey === "bride",
  );
  const gallery = media.filter((item) => item.kind === "gallery");

  const events = (content.events ?? [])
    .filter((event) => event.date && event.start && event.venue)
    .map((event) => ({
      name: textOr(event.name, "Acara"),
      date: event.date ?? "",
      start: event.start ?? "",
      end: event.end ?? null,
      tz: event.tz ?? "WIB",
      venue: event.venue ?? "",
      address: event.address ?? "",
      mapsUrl: event.mapsUrl,
    }));

  const firstDate = events[0]?.date;
  const dateLabel = firstDate ? formatDateId(firstDate) : "Tanggal acara";

  const accounts = (content.gifts?.accounts ?? [])
    .filter((account) => account.bank && account.number && account.holder)
    .map((account) => ({
      bank: account.bank ?? "",
      number: account.number ?? "",
      holder: account.holder ?? "",
    }));

  return (
    <div className="mx-auto w-full max-w-[430px]">
      <Cover
        couple={couple}
        dateLabel={dateLabel}
        guestName="Bapak/Ibu/Saudara/i"
        photo={cover?.url}
        focalX={cover?.focalX}
        focalY={cover?.focalY}
      />

      <Pembuka
        quote={content.opening?.text}
        source={content.opening?.source}
        invitation={textOr(
          content.opening?.invitation,
          "Paragraf ajakan akan tampil di sini.",
        )}
      />

      <Mempelai
        groom={{
          nickname: textOr(groom.nickname, "Mempelai pria"),
          fullName: textOr(groom.fullName, "Nama lengkap dan gelar"),
          childOrder: textOr(groom.childOrder, "…"),
          father: textOr(groom.father, "nama ayah"),
          mother: textOr(groom.mother, "nama ibu"),
          instagram: groom.instagram,
          photo: groomPhoto?.url,
          focalX: groomPhoto?.focalX,
          focalY: groomPhoto?.focalY,
        }}
        bride={{
          nickname: textOr(bride.nickname, "Mempelai wanita"),
          fullName: textOr(bride.fullName, "Nama lengkap dan gelar"),
          childOrder: textOr(bride.childOrder, "…"),
          father: textOr(bride.father, "nama ayah"),
          mother: textOr(bride.mother, "nama ibu"),
          instagram: bride.instagram,
          photo: bridePhoto?.url,
          focalX: bridePhoto?.focalX,
          focalY: bridePhoto?.focalY,
        }}
      />

      {sections.story && content.story?.text?.trim() ? (
        <CeritaKami
          title={textOr(content.story.title, "Cerita Kami")}
          text={content.story.text}
        />
      ) : null}

      {events.length > 0 ? (
        <Acara
          dateLabel={dateLabel}
          events={events}
          initialCountdown={{
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            finished: false,
          }}
        />
      ) : (
        <section className="px-6 pt-14 pb-20 text-center">
          <h2 className="font-serif text-title text-ink italic">Acara</h2>
          <p className="mt-3 text-meta text-muted">
            Lengkapi tanggal, jam, dan tempat agar kartu acara tampil.
          </p>
        </section>
      )}

      {sections.gallery && gallery.length > 0 ? (
        <Galeri
          photos={gallery.map((photo) => ({
            url: photo.url,
            focalX: photo.focalX,
            focalY: photo.focalY,
          }))}
          altPrefix="Foto undangan"
        />
      ) : null}

      <section className="px-6 pt-16 pb-4 text-center">
        <h2 className="font-serif text-title text-ink italic">RSVP</h2>
        <p className="mt-3 text-meta text-muted">
          Form RSVP tampil di halaman tamu setelah undangan terbit.
        </p>
      </section>

      {sections.gifts && accounts.length > 0 ? (
        <Amplop accounts={accounts} address={content.gifts?.address} />
      ) : null}

      <Penutup
        closing={textOr(
          content.closing,
          "Kalimat penutup akan tampil di sini setelah diisi.",
        )}
        coupleNames={couple}
        coInviters={(content.coInviters ?? []).filter((name) => name.trim())}
      />
    </div>
  );
}
