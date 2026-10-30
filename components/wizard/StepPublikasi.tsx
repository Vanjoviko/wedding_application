"use client";

import { useEffect, useState } from "react";
import {
  checkSlugAvailability,
  publishInvitation,
  type PublishResult,
} from "@/app/edit/[token]/actions";
import { Field, TextInput } from "@/components/wizard/fields";
import { missingForPublish, type DraftContent } from "@/lib/draft";
import type { MediaItem } from "@/components/wizard/types";
import { CopyButton } from "@/components/invitation/CopyButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type Props = {
  token: string;
  saveNow: () => Promise<boolean>;
  content: DraftContent;
  slug: string;
  onSlug: (slug: string) => void;
  media: MediaItem[];
  publishedLinks: PublishResult | null;
  onPublished: (result: PublishResult) => void;
};

export function StepPublikasi({
  token,
  saveNow,
  content,
  slug,
  onSlug,
  media,
  publishedLinks,
  onPublished,
}: Props) {
  const [slugState, setSlugState] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<PublishResult | null>(publishedLinks);
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    if (!slug) return;

    const timer = window.setTimeout(async () => {
      setChecking(true);
      const state = await checkSlugAvailability(token, slug);
      setSlugState({ valid: state.valid, message: state.message });
      if (state.slug && state.slug !== slug) onSlug(state.slug);
      setChecking(false);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [slug, token, onSlug]);

  const slugFeedback = slug ? slugState : null;

  const localMissing = [
    ...missingForPublish(content).map((item) => item.message),
    ...(media.some((item) => item.kind === "cover") ? [] : ["Foto cover belum diunggah"]),
  ];

  async function publish() {
    setPublishing(true);
    setMissing([]);

    // Pastikan perubahan terakhir sudah tersimpan sebelum divalidasi server.
    const saved = await saveNow();
    if (!saved) {
      setPublishing(false);
      setMissing(["Perubahan terakhir belum tersimpan. Coba lagi."]);
      return;
    }

    const response = await publishInvitation(token, slug);
    setPublishing(false);

    if (response.ok) {
      setResult(response);
      onPublished(response);
      return;
    }

    if (response.missing) setMissing(response.missing);
    else setMissing([response.message]);
  }

  if (result && result.ok) {
    const whatsapp = `https://wa.me/?text=${encodeURIComponent(
      `Undangan kami: ${result.invitationUrl}\n\nLink edit (rahasia): ${result.editUrl}`,
    )}`;

    return (
      <div>
        <div className="rounded-card border border-accent/40 bg-surface p-5">
          <p className="font-serif text-card text-ink italic">Undangan sudah terbit</p>
          <p className="mt-1 text-meta text-muted">
            Setiap perubahan yang kamu simpan langsung tampil di halaman tamu.
          </p>

          <p className="mt-5 text-meta text-muted">Link undangan</p>
          <p className="mt-1 text-note break-all text-ink">{result.invitationUrl}</p>
          <div className="mt-2">
            <CopyButton value={result.invitationUrl} label="Salin link undangan" />
          </div>

          <p className="mt-5 text-meta text-muted">Link edit rahasia</p>
          <p className="mt-1 text-note break-all text-ink">{result.editUrl}</p>
          <div className="mt-2 flex flex-col gap-2">
            <CopyButton value={result.editUrl} label="Salin link edit" />
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-accent px-[18px] text-[14px] font-medium text-accent hover:border-accent-hover hover:text-accent-hover"
            >
              Kirim ke WhatsApp saya
            </a>
          </div>
        </div>

        <p className="mt-4 text-note text-muted">
          Simpan link edit di tempat aman. Tanpa link itu, undangan tidak bisa diubah
          lagi.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-meta text-muted">
        Pilih alamat undangan. Huruf kecil, angka, dan tanda hubung.
      </p>

      <Field
        label="Alamat undangan"
        htmlFor="slug"
        hint={
          slugFeedback
            ? slugFeedback.message
            : "Contoh: raka-sekar. Saran otomatis dari nama panggilan."
        }
      >
        <TextInput
          id="slug"
          value={slug}
          onChange={onSlug}
          placeholder="raka-sekar"
          maxLength={40}
        />
      </Field>

      {checking ? <p className="text-note text-muted">Memeriksa ketersediaan…</p> : null}

      <div className="mt-6 rounded-card border border-line p-4">
        <p className="text-meta text-muted">Sebelum terbit</p>
        {localMissing.length === 0 ? (
          <p className="mt-1 text-body text-ink">Semua kolom wajib sudah terisi.</p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-meta text-ink-soft">
            {localMissing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {missing.length > 0 ? (
          <div role="alert" className="mt-3 rounded-count bg-bg p-3">
            <p className="text-note text-danger">Undangan belum bisa dipublikasikan:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-note text-ink-soft">
              {missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <PrimaryButton
        type="button"
        fullWidth
        className="mt-5"
        disabled={publishing || !slugFeedback?.valid}
        onClick={() => void publish()}
      >
        {publishing ? "Menerbitkan…" : "Publikasikan"}
      </PrimaryButton>

      {!slugFeedback?.valid ? (
        <p className="mt-2 text-center text-note text-muted">
          Isi alamat undangan yang tersedia untuk mengaktifkan tombol.
        </p>
      ) : null}
    </div>
  );
}
