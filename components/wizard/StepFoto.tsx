"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUploadTarget,
  deleteMedia,
  registerMedia,
  updateFocalPoint,
} from "@/app/edit/[token]/actions";
import { compressImage } from "@/lib/compress-image";
import type { MediaItem } from "@/components/wizard/types";
import { cx } from "@/lib/cx";

type Slot = {
  key: string;
  kind: "cover" | "person" | "gallery";
  personKey: "groom" | "bride" | null;
  label: string;
};

const SLOTS: Slot[] = [
  { key: "cover", kind: "cover", personKey: null, label: "Foto cover" },
  { key: "groom", kind: "person", personKey: "groom", label: "Mempelai pria" },
  { key: "bride", kind: "person", personKey: "bride", label: "Mempelai wanita" },
];

type Props = {
  token: string;
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
};

function PhotoSlot({
  slot,
  existing,
  loading,
  onUpload,
  onFocal,
  onRemove,
}: {
  slot: Slot;
  existing?: MediaItem;
  loading: boolean;
  onUpload: (file: File) => void;
  onFocal: (media: MediaItem) => void;
  onRemove: (media: MediaItem) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-card border border-line p-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] bg-[image:var(--photo-empty)]">
        {existing ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={existing.url}
            alt={slot.label}
            className="size-full object-cover"
            style={{
              objectPosition: `${Math.round(existing.focalX * 100)}% ${Math.round(existing.focalY * 100)}%`,
            }}
          />
        ) : (
          <div className="flex size-full items-center justify-center px-2 text-center text-note text-ink-soft/80">
            Belum ada foto
          </div>
        )}
      </div>

      <p className="mt-2 text-meta text-ink">{slot.label}</p>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="h-9 rounded-full border border-line px-3 text-note text-ink-soft hover:border-accent/60 disabled:opacity-60"
        >
          {loading ? "Mengunggah…" : existing ? "Ganti" : "Unggah"}
        </button>
        {existing ? (
          <>
            <button
              type="button"
              onClick={() => onFocal(existing)}
              className="h-9 rounded-full border border-line px-3 text-note text-ink-soft hover:border-accent/60"
            >
              Titik fokus
            </button>
            <button
              type="button"
              onClick={() => onRemove(existing)}
              className="h-9 rounded-full px-2 text-note text-muted hover:text-ink"
            >
              Hapus
            </button>
          </>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onUpload(file);
        }}
      />
    </div>
  );
}

export function StepFoto({ token, media, onChange }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focalTarget, setFocalTarget] = useState<MediaItem | null>(null);
  const router = useRouter();

  const cover = media.find((item) => item.kind === "cover");
  const people = {
    groom: media.find((item) => item.kind === "person" && item.personKey === "groom"),
    bride: media.find((item) => item.kind === "person" && item.personKey === "bride"),
  };
  const gallery = media.filter((item) => item.kind === "gallery");

  async function upload(
    file: File,
    kind: "cover" | "person" | "gallery",
    personKey: "groom" | "bride" | null,
  ) {
    setError(null);
    setBusy(`${kind}-${personKey ?? "x"}`);
    try {
      const { blob, width, height } = await compressImage(file);

      const target = await createUploadTarget(token, kind, personKey);
      if (!target.ok) throw new Error(target.message);

      const uploadResponse = await fetch(target.signedUrl, {
        method: "PUT",
        headers: { "content-type": "image/webp", "x-upsert": "true" },
        body: blob,
      });
      if (!uploadResponse.ok) {
        throw new Error("Gagal mengunggah foto. Coba lagi.");
      }

      const registered = await registerMedia(token, {
        path: target.path,
        kind,
        personKey,
        width,
        height,
      });
      if (!registered.ok) throw new Error(registered.message);

      onChange([...media, registered.media]);
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Gagal mengunggah foto.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function remove(item: MediaItem) {
    setBusy(`hapus-${item.id}`);
    const result = await deleteMedia(token, item.id);
    if (result.ok) {
      onChange(media.filter((entry) => entry.id !== item.id));
      if (focalTarget?.id === item.id) setFocalTarget(null);
      router.refresh();
    } else {
      setError(result.message);
    }
    setBusy(null);
  }

  async function saveFocal(item: MediaItem, x: number, y: number) {
    onChange(
      media.map((entry) =>
        entry.id === item.id ? { ...entry, focalX: x, focalY: y } : entry,
      ),
    );
    setFocalTarget({ ...item, focalX: x, focalY: y });
    await updateFocalPoint(token, item.id, x, y);
    router.refresh();
  }

  return (
    <div>
      <p className="text-meta text-muted">
        Foto dikompres otomatis ke WebP maksimal 1600px. Format asli boleh JPEG, PNG, atau
        HEIC dari ponsel.
      </p>

      {error ? (
        <p role="alert" className="mt-3 text-note text-danger">
          {error}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <PhotoSlot
          slot={SLOTS[0]!}
          existing={cover}
          loading={busy === "cover-x"}
          onUpload={(file) => void upload(file, "cover", null)}
          onFocal={setFocalTarget}
          onRemove={(item) => void remove(item)}
        />
        <div className="flex flex-col justify-end">
          <p className="text-note text-muted">
            Cover wajib diisi sebelum undangan bisa dipublikasikan.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <PhotoSlot
          slot={SLOTS[1]!}
          existing={people.groom}
          loading={busy === "person-groom"}
          onUpload={(file) => void upload(file, "person", "groom")}
          onFocal={setFocalTarget}
          onRemove={(item) => void remove(item)}
        />
        <PhotoSlot
          slot={SLOTS[2]!}
          existing={people.bride}
          loading={busy === "person-bride"}
          onUpload={(file) => void upload(file, "person", "bride")}
          onFocal={setFocalTarget}
          onRemove={(item) => void remove(item)}
        />
      </div>

      <h3 className="mt-8 border-t border-line pt-6 text-body font-medium text-ink">
        Galeri ({gallery.length}/10)
      </h3>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {gallery.map((photo) => (
          <div key={photo.id} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt="Foto galeri"
              className="aspect-square w-full rounded-[12px] object-cover"
              style={{
                objectPosition: `${Math.round(photo.focalX * 100)}% ${Math.round(photo.focalY * 100)}%`,
              }}
            />
            <button
              type="button"
              onClick={() => void remove(photo)}
              aria-label="Hapus foto galeri"
              className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-bg/80 text-ink"
            >
              ×
            </button>
          </div>
        ))}

        {gallery.length < 10 ? (
          <label
            className={cx(
              "flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[12px]",
              "border border-dashed border-line text-center text-note text-muted hover:border-accent/60",
            )}
          >
            <span className="text-xl">+</span>
            <span className="mt-1 px-1">Tambah</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void upload(file, "gallery", null);
              }}
            />
          </label>
        ) : null}
      </div>

      {focalTarget ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Atur titik fokus"
          className="fixed inset-0 z-50 flex flex-col bg-bg/95 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-body text-ink">Ketuk foto untuk titik fokus</p>
            <button
              type="button"
              onClick={() => setFocalTarget(null)}
              className="h-10 rounded-full border border-line px-4 text-meta text-ink"
            >
              Selesai
            </button>
          </div>

          <div className="relative mt-4 flex-1 overflow-hidden rounded-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={focalTarget.url}
              alt="Atur titik fokus"
              className="size-full cursor-crosshair object-cover"
              style={{
                objectPosition: `${Math.round(focalTarget.focalX * 100)}% ${Math.round(focalTarget.focalY * 100)}%`,
              }}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                void saveFocal(
                  focalTarget,
                  Math.min(1, Math.max(0, x)),
                  Math.min(1, Math.max(0, y)),
                );
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent"
              style={{
                left: `${focalTarget.focalX * 100}%`,
                top: `${focalTarget.focalY * 100}%`,
              }}
            />
          </div>

          <p className="mt-3 text-note text-muted">
            Titik fokus menentukan bagian foto yang tetap terlihat saat dipotong di layar
            ponsel.
          </p>
        </div>
      ) : null}
    </div>
  );
}
