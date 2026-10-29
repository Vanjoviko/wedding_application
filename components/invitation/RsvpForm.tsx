"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitRsvp } from "@/app/[slug]/actions";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { initialRsvpState } from "@/lib/rsvp";

type Props = {
  slug: string;
  defaultName: string;
  showMessage: boolean;
};

const fieldClass =
  "mt-2 h-12 w-full rounded-count border border-line bg-bg px-4 text-body text-ink " +
  "placeholder:text-muted/70 focus-visible:ring-2 focus-visible:ring-focus " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none";

export function RsvpForm({ slug, defaultName, showMessage }: Props) {
  const [state, formAction, pending] = useActionState(submitRsvp, initialRsvpState);
  const [attendance, setAttendance] = useState<"hadir" | "tidak_hadir">("hadir");
  const [pax, setPax] = useState(1);
  const [messageLength, setMessageLength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [state.status, router]);

  if (state.status === "success") {
    return (
      <div className="rounded-card border border-line bg-surface p-6 text-center">
        <p className="font-serif text-card text-ink italic">Terima kasih</p>
        <p className="mt-2 text-body text-ink-soft">
          {state.attendance === "hadir"
            ? `Kehadiran ${state.guestName} untuk ${state.pax} orang sudah kami catat.`
            : `Kabar dari ${state.guestName} sudah kami catat.`}
        </p>
        <p className="mt-1 text-meta text-muted">Sampai jumpa di hari bahagia kami.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-card border border-line bg-surface p-5">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="pax" value={attendance === "hadir" ? pax : 0} />
      <input type="hidden" name="attendance" value={attendance} />

      <label className="block text-meta text-muted" htmlFor="guestName">
        Nama
      </label>
      <input
        id="guestName"
        name="guestName"
        defaultValue={defaultName}
        maxLength={60}
        required
        className={fieldClass}
        aria-invalid={Boolean(state.errors.guestName)}
      />
      {state.errors.guestName ? (
        <p className="mt-1 text-note text-danger">{state.errors.guestName}</p>
      ) : null}

      <p className="mt-5 text-meta text-muted">Kehadiran</p>
      <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="Kehadiran">
        {(
          [
            ["hadir", "Hadir"],
            ["tidak_hadir", "Tidak hadir"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={attendance === value}
            onClick={() => setAttendance(value)}
            className={`h-11 rounded-full border text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none ${
              attendance === value
                ? "border-accent bg-accent text-on-accent"
                : "border-line bg-bg text-ink-soft hover:border-accent/60"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {state.errors.attendance ? (
        <p className="mt-1 text-note text-danger">{state.errors.attendance}</p>
      ) : null}

      {attendance === "hadir" ? (
        <>
          <p className="mt-5 text-meta text-muted">Jumlah orang</p>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPax((value) => Math.max(1, value - 1))}
              aria-label="Kurangi jumlah orang"
              className="flex size-11 items-center justify-center rounded-full border border-line bg-bg text-lg text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
            >
              −
            </button>
            <span className="min-w-8 text-center text-body text-ink tabular-nums">
              {pax}
            </span>
            <button
              type="button"
              onClick={() => setPax((value) => Math.min(5, value + 1))}
              aria-label="Tambah jumlah orang"
              className="flex size-11 items-center justify-center rounded-full border border-line bg-bg text-lg text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
            >
              +
            </button>
          </div>
          {state.errors.pax ? (
            <p className="mt-1 text-note text-danger">{state.errors.pax}</p>
          ) : null}
        </>
      ) : null}

      {showMessage ? (
        <>
          <label className="mt-5 block text-meta text-muted" htmlFor="message">
            Ucapan dan doa (opsional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={500}
            onChange={(event) => setMessageLength(event.target.value.length)}
            className={`${fieldClass} h-auto resize-none py-3`}
            aria-invalid={Boolean(state.errors.message)}
          />
          <div className="mt-1 flex items-center justify-between">
            {state.errors.message ? (
              <p className="text-note text-danger">{state.errors.message}</p>
            ) : (
              <span />
            )}
            <span className="text-note text-muted tabular-nums">{messageLength}/500</span>
          </div>
        </>
      ) : null}

      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.formError ? (
        <p role="alert" className="mt-4 text-note text-danger">
          {state.formError}
        </p>
      ) : null}

      <PrimaryButton type="submit" fullWidth disabled={pending} className="mt-5">
        {pending ? "Mengirim…" : "Kirim"}
      </PrimaryButton>
    </form>
  );
}
