"use client";

import { useEffect, useRef, useState } from "react";
import { Field, SubHead, TextArea, TextInput, Toggle } from "@/components/wizard/fields";
import type { StepProps } from "@/components/wizard/types";
import type { Sections } from "@/lib/schema";
import { MUSIC_TRACKS } from "@/lib/music";

type Props = StepProps & {
  sections: Sections;
  onSections: (sections: Sections) => void;
  music: string;
  onMusic: (track: string) => void;
};

export function StepFitur({
  content,
  onChange,
  sections,
  onSections,
  music,
  onMusic,
}: Props) {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function preview(trackId: string) {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing === trackId) {
      audio.pause();
      setPlaying(null);
      return;
    }

    audio.src = `/music/${trackId}.mp3`;
    audio.currentTime = 0;
    audio.volume = 0.5;
    void audio.play();
    setPlaying(trackId);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      audio.pause();
      setPlaying(null);
    }, 10_000);
  }

  function updateAccount(index: number, patch: Record<string, string>) {
    onChange((draft) => {
      const accounts = [...(draft.gifts?.accounts ?? [])];
      accounts[index] = { ...accounts[index], ...patch };
      return { ...draft, gifts: { ...draft.gifts, accounts } };
    });
  }

  function addAccount() {
    const accounts = content.gifts?.accounts ?? [];
    if (accounts.length >= 3) return;
    onChange((draft) => ({
      ...draft,
      gifts: {
        ...draft.gifts,
        accounts: [...(draft.gifts?.accounts ?? []), {}],
      },
    }));
  }

  function removeAccount(index: number) {
    onChange((draft) => ({
      ...draft,
      gifts: {
        ...draft.gifts,
        accounts: (draft.gifts?.accounts ?? []).filter(
          (_, position) => position !== index,
        ),
      },
    }));
  }

  return (
    <div>
      <SubHead>Section opsional</SubHead>
      <div className="rounded-card border border-line px-4">
        <Toggle
          label="Cerita Kami"
          description="Satu blok teks tentang perjalanan kalian"
          checked={sections.story}
          onChange={(value) => onSections({ ...sections, story: value })}
        />
        <Toggle
          label="Galeri"
          description="Maksimal 10 foto, tampil dua kolom"
          checked={sections.gallery}
          onChange={(value) => onSections({ ...sections, gallery: value })}
        />
        <Toggle
          label="Ucapan dan doa"
          description="Daftar ucapan tamu setelah RSVP"
          checked={sections.wishes}
          onChange={(value) => onSections({ ...sections, wishes: value })}
        />
        <Toggle
          label="Amplop digital"
          description="Info rekening dan alamat kirim kado"
          checked={sections.gifts}
          onChange={(value) => onSections({ ...sections, gifts: value })}
        />
      </div>

      {sections.gifts ? (
        <>
          <SubHead>Rekening (maksimal 3)</SubHead>
          {(content.gifts?.accounts ?? []).map((account, index) => (
            <div key={index} className="mb-3 rounded-card border border-line p-4">
              <div className="flex items-center justify-between">
                <p className="text-meta text-muted">Rekening {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeAccount(index)}
                  className="text-note text-muted underline underline-offset-4 hover:text-ink"
                >
                  Hapus
                </button>
              </div>
              <Field label="Bank atau e-wallet" htmlFor={`account-bank-${index}`}>
                <TextInput
                  id={`account-bank-${index}`}
                  value={account.bank ?? ""}
                  onChange={(value) => updateAccount(index, { bank: value })}
                  placeholder="Bank Contoh"
                  maxLength={60}
                />
              </Field>
              <Field label="Nomor" htmlFor={`account-number-${index}`}>
                <TextInput
                  id={`account-number-${index}`}
                  value={account.number ?? ""}
                  onChange={(value) => updateAccount(index, { number: value })}
                  placeholder="1234567890"
                  maxLength={40}
                />
              </Field>
              <Field label="Atas nama" htmlFor={`account-holder-${index}`}>
                <TextInput
                  id={`account-holder-${index}`}
                  value={account.holder ?? ""}
                  onChange={(value) => updateAccount(index, { holder: value })}
                  placeholder="Sekar Ayu Kinanti"
                  maxLength={120}
                />
              </Field>
            </div>
          ))}

          {(content.gifts?.accounts ?? []).length < 3 ? (
            <button
              type="button"
              onClick={addAccount}
              className="h-11 w-full rounded-full border border-line text-meta text-ink-soft hover:border-accent/60"
            >
              Tambah rekening
            </button>
          ) : null}

          <Field label="Alamat kirim kado (opsional)" htmlFor="gift-address">
            <TextInput
              id="gift-address"
              value={content.gifts?.address ?? ""}
              onChange={(value) =>
                onChange((draft) => ({
                  ...draft,
                  gifts: { ...draft.gifts, address: value },
                }))
              }
              maxLength={240}
            />
          </Field>
        </>
      ) : null}

      <SubHead>Turut mengundang (opsional)</SubHead>
      <Field label="Satu nama per baris" htmlFor="co-inviters" hint="Maksimal 10 nama.">
        <TextArea
          id="co-inviters"
          rows={4}
          value={(content.coInviters ?? []).join("\n")}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              coInviters: value.split("\n").slice(0, 10),
            }))
          }
          placeholder={"Keluarga Besar Wibowo\nKeluarga Besar Kuncoro"}
        />
      </Field>

      <SubHead>Musik</SubHead>
      <div className="flex flex-col gap-2">
        {MUSIC_TRACKS.map((track) => (
          <div
            key={track.id}
            className="flex items-center justify-between gap-3 rounded-card border border-line p-3"
          >
            <label className="flex flex-1 items-center gap-3">
              <input
                type="radio"
                name="music"
                checked={music === track.id}
                onChange={() => onMusic(track.id)}
                className="size-4 accent-[var(--accent)]"
              />
              <span>
                <span className="block text-body text-ink">{track.title}</span>
                <span className="block text-note text-muted">{track.mood}</span>
              </span>
            </label>
            <button
              type="button"
              onClick={() => preview(track.id)}
              className="h-9 rounded-full border border-line px-3 text-note text-ink-soft hover:border-accent/60"
            >
              {playing === track.id ? "Berhenti" : "Dengar 10 detik"}
            </button>
          </div>
        ))}
      </div>
      <audio ref={audioRef} preload="none" />
    </div>
  );
}
