"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEventPermanently } from "@/app/edit/[token]/actions";

export function DeleteEventButton({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function remove() {
    setBusy(true);
    setError(null);
    const result = await deleteEventPermanently(token);
    setBusy(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-meta text-muted underline decoration-line underline-offset-4 hover:text-danger"
      >
        Hapus undangan
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Hapus undangan"
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 p-6"
        >
          <div className="w-full max-w-[420px] rounded-card border border-line bg-surface p-5">
            <h2 className="font-serif text-card text-ink italic">Hapus undangan ini?</h2>
            <p className="mt-2 text-body text-ink-soft">
              Undangan, semua foto, daftar tamu, dan respons akan dihapus permanen.
              Tindakan ini tidak bisa dibatalkan.
            </p>

            <label className="mt-4 block text-meta text-muted" htmlFor="delete-confirm">
              Ketik HAPUS untuk melanjutkan
            </label>
            <input
              id="delete-confirm"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-count border border-line bg-bg px-3 text-body text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
            />

            {error ? (
              <p role="alert" className="mt-2 text-note text-danger">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setConfirmation("");
                }}
                className="h-11 flex-1 rounded-full border border-line text-meta text-ink-soft"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={confirmation !== "HAPUS" || busy}
                onClick={() => void remove()}
                className="h-11 flex-1 rounded-full bg-danger text-meta font-medium text-bg disabled:opacity-50"
              >
                {busy ? "Menghapus…" : "Hapus permanen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
