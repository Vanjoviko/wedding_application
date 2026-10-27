import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CalendarIcon, MailIcon, MapPinIcon } from "@/components/icons";
import { CountdownBox } from "@/components/ui/CountdownBox";
import { EventCard } from "@/components/ui/EventCard";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { PersonBlock } from "@/components/ui/PersonBlock";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { assertDevPreview } from "@/lib/dev-preview";
import { demoBride, demoCountdown, demoEvents, demoGroom } from "@/themes/modern/demo";

export const metadata: Metadata = {
  title: "Komponen dasar",
  robots: { index: false, follow: false },
};

const colors = [
  { token: "--bg", name: "bg", hex: "#1C1916" },
  { token: "--surface", name: "surface", hex: "#26211D" },
  { token: "--line", name: "line", hex: "#3A332D" },
  { token: "--text", name: "text", hex: "#F2ECE2" },
  { token: "--text-2", name: "text-2", hex: "#E9E1D4" },
  { token: "--muted", name: "muted", hex: "#B9AFA2" },
  { token: "--accent", name: "accent", hex: "#C8A46A" },
  { token: "--on-accent", name: "on-accent", hex: "#1C1916" },
  { token: "--focus", name: "focus", hex: "#F2ECE2" },
  { token: "--danger", name: "danger", hex: "#E7A99B" },
];

const typeScale = [
  { name: "Nama di cover", className: "text-cover font-serif italic", size: "56px" },
  { name: "Nama panggilan", className: "text-name font-serif italic", size: "46px" },
  { name: "Judul section", className: "text-title font-serif italic", size: "42px" },
  { name: "Judul kartu acara", className: "text-card font-serif italic", size: "30px" },
  { name: "Angka countdown", className: "text-count tabular-nums", size: "26px" },
  { name: "Nama lengkap", className: "text-fullname font-serif", size: "21px" },
  { name: "Nama tamu", className: "text-guest font-serif", size: "24px" },
  { name: "Teks isi", className: "text-body", size: "15px" },
  { name: "Teks pendukung", className: "text-meta", size: "13px" },
  { name: "Catatan kecil", className: "text-note", size: "12px" },
];

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12 border-t border-line pt-6">
      <h2 className="text-meta text-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function DevUiPage() {
  assertDevPreview();

  return (
    <main className="mx-auto w-full max-w-[430px] px-6 py-12">
      <h1 className="font-serif text-[34px] leading-tight italic">Komponen dasar</h1>
      <p className="mt-2 text-meta text-muted">
        Hanya tampil di development dan preview deployment. Token mengikuti docs/PRD.md.
      </p>

      <Block title="Warna">
        <ul className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <li key={color.token} className="rounded-count border border-line p-2">
              <span
                className="block h-10 rounded-[8px] border border-line"
                style={{ backgroundColor: color.hex }}
              />
              <span className="mt-2 block text-meta text-ink">{color.name}</span>
              <span className="block text-note text-muted">
                {color.hex} · {color.token}
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Tipografi">
        <ul className="flex flex-col gap-4">
          {typeScale.map((item) => (
            <li key={item.name}>
              <span className="block text-note text-muted">
                {item.name} · {item.size}
              </span>
              <span className={`block text-ink ${item.className}`}>Raka &amp; Sekar</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Tombol">
        <div className="flex flex-col gap-3">
          <PrimaryButton icon={<MailIcon size={18} />}>Buka undangan</PrimaryButton>
          <PrimaryButton disabled>Tombol nonaktif</PrimaryButton>
          <SecondaryButton icon={<MapPinIcon size={16} />}>
            Buka di Google Maps
          </SecondaryButton>
          <PrimaryButton icon={<CalendarIcon size={18} />} fullWidth>
            Simpan ke kalender
          </PrimaryButton>
        </div>
      </Block>

      <Block title="Judul section">
        <SectionHeading supporting="Sabtu, 15 Mei 2027">Acara</SectionHeading>
      </Block>

      <Block title="Bingkai foto">
        <div className="grid grid-cols-2 gap-3">
          <PhotoFrame
            src="/demo/cover.webp"
            alt="Contoh foto dengan titik fokus"
            focalX={0.45}
            focalY={0.55}
            className="aspect-[4/5]"
            sizes="200px"
          />
          <PhotoFrame
            alt="Bingkai foto kosong"
            placeholderLabel="Foto belum diisi"
            className="aspect-[4/5]"
          />
        </div>
      </Block>

      <Block title="Blok mempelai">
        <div className="text-center">
          <PersonBlock
            person={demoBride}
            label="Mempelai wanita"
            relation="Putri"
            photoLabel="Foto mempelai wanita"
            photoClassName="mx-auto"
          />
        </div>
      </Block>

      <Block title="Countdown">
        <CountdownBox values={demoCountdown} />
      </Block>

      <Block title="Kartu acara">
        <EventCard event={demoEvents[0]!} />
      </Block>

      <Block title="Tombol musik">
        <div className="flex items-center gap-4">
          <MusicToggle playing />
          <MusicToggle playing={false} />
        </div>
      </Block>

      <Block title="Data contoh">
        <p className="text-meta text-muted">
          {demoGroom.fullName} &amp; {demoBride.fullName}
        </p>
      </Block>
    </main>
  );
}
