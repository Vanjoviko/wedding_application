import Image from "next/image";
import { MailIcon } from "@/components/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type Props = {
  couple: string;
  dateLabel: string;
  guestName: string;
  photo?: string;
  focalX?: number;
  focalY?: number;
};

export function Cover({
  couple,
  dateLabel,
  guestName,
  photo,
  focalX = 0.45,
  focalY = 0.55,
}: Props) {
  return (
    <section
      id="cover"
      className="relative isolate flex min-h-dvh flex-col overflow-hidden"
    >
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          priority
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover"
          style={{
            objectPosition: `${Math.round(focalX * 100)}% ${Math.round(focalY * 100)}%`,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[image:var(--photo-empty)]" />
      )}

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[540px]"
        style={{ background: "var(--scrim)" }}
      />

      <p className="relative mt-[60px] text-center text-[14px] tracking-[0.04em] text-ink">
        Undangan pernikahan
      </p>

      <div className="relative mt-auto flex flex-col items-center px-8 pb-[52px] text-center">
        <h1 className="font-serif text-cover font-medium text-ink italic">{couple}</h1>
        <p className="mt-3 text-body text-ink-soft">{dateLabel}</p>

        <span aria-hidden className="mt-6 block h-px w-12 bg-accent" />

        <p className="mt-[22px] text-meta text-muted">Kepada Yth.</p>
        <p className="mt-1 font-serif text-guest font-medium text-ink">{guestName}</p>
        <p className="mt-1.5 max-w-[260px] text-note text-muted">
          Mohon maaf bila ada kesalahan penulisan nama dan gelar.
        </p>

        <PrimaryButton icon={<MailIcon size={18} />} className="mt-[22px]">
          Buka undangan
        </PrimaryButton>
      </div>
    </section>
  );
}
