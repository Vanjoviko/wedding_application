"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveDraft, type PublishResult } from "@/app/edit/[token]/actions";
import { CopyButton } from "@/components/invitation/CopyButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { StepAcara } from "@/components/wizard/StepAcara";
import { StepFitur } from "@/components/wizard/StepFitur";
import { StepFoto } from "@/components/wizard/StepFoto";
import { StepMempelai } from "@/components/wizard/StepMempelai";
import { StepPublikasi } from "@/components/wizard/StepPublikasi";
import { StepTeks } from "@/components/wizard/StepTeks";
import { STEPS, type MediaItem } from "@/components/wizard/types";
import type { DraftContent } from "@/lib/draft";
import type { Sections } from "@/lib/schema";
import { normalizeSlug } from "@/lib/slug";
import { cx } from "@/lib/cx";

type Props = {
  token: string;
  editUrl: string;
  initialContent: DraftContent;
  initialSections: Sections;
  initialMusic: string;
  initialSlug: string;
  status: "draft" | "published";
  initialMedia: MediaItem[];
  publishedLinks: PublishResult | null;
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function Wizard({
  token,
  editUrl,
  initialContent,
  initialSections,
  initialMusic,
  initialSlug,
  status,
  initialMedia,
  publishedLinks,
}: Props) {
  const [step, setStep] = useState(0);
  const [content, setContent] = useState<DraftContent>(initialContent);
  const [sections, setSections] = useState<Sections>(initialSections);
  const [music, setMusic] = useState(initialMusic);
  const [slug, setSlug] = useState(initialSlug);
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(
    publishedLinks,
  );

  const router = useRouter();
  const firstRender = useRef(true);

  // Simpan otomatis 2 detik setelah berhenti mengetik.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = window.setTimeout(async () => {
      setSaveState("saving");
      const result = await saveDraft(token, content, sections, music);
      if (result.ok) {
        setSaveState("saved");
        router.refresh();
      } else {
        setSaveState("error");
      }
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [content, sections, music, token, router]);

  async function saveNow() {
    const result = await saveDraft(token, content, sections, music);
    if (result.ok) {
      setSaveState("saved");
      router.refresh();
      return true;
    }
    setSaveState("error");
    return false;
  }

  function goNext() {
    if (step === 4 && !slug) {
      const suggestion = normalizeSlug(
        `${content.groom?.nickname ?? ""}-${content.bride?.nickname ?? ""}`,
      );
      if (suggestion.length >= 3) setSlug(suggestion);
    }
    setStep((current) => Math.min(STEPS.length - 1, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const current = STEPS[step]!;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-note text-muted">
            {status === "published" ? "Undangan terbit" : "Draf"}
          </p>
          <h1 className="mt-1 font-serif text-[28px] leading-tight text-ink italic">
            Edit undangan
          </h1>
        </div>
        {saveState !== "idle" ? (
          <span
            className={cx(
              "rounded-full border px-3 py-1 text-note",
              saveState === "error"
                ? "border-danger/60 text-danger"
                : "border-line text-muted",
            )}
            aria-live="polite"
          >
            {saveState === "saving"
              ? "Menyimpan…"
              : saveState === "saved"
                ? "Tersimpan"
                : "Gagal menyimpan"}
          </span>
        ) : null}
      </div>

      <div className="mt-4 rounded-card border border-line bg-surface p-4">
        <p className="text-meta text-ink">
          Alamat halaman ini adalah kunci edit. Simpan dan jangan dibagikan.
        </p>
        <p className="mt-1 truncate text-note text-muted">{editUrl}</p>
        <div className="mt-2">
          <CopyButton value={editUrl} label="Salin link edit" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-note text-muted">
          Langkah {step + 1} dari {STEPS.length} · {current.title}
        </p>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="text-note text-accent underline underline-offset-4"
        >
          Lihat pratinjau
        </button>
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <section className="mt-6">
        <h2 className="font-serif text-card text-ink italic">{current.title}</h2>
        <p className="mt-1 text-meta text-muted">{current.description}</p>

        <div className="mt-5">
          {step === 0 ? <StepMempelai content={content} onChange={setContent} /> : null}
          {step === 1 ? <StepAcara content={content} onChange={setContent} /> : null}
          {step === 2 ? (
            <StepFoto token={token} media={media} onChange={setMedia} />
          ) : null}
          {step === 3 ? <StepTeks content={content} onChange={setContent} /> : null}
          {step === 4 ? (
            <StepFitur
              content={content}
              onChange={setContent}
              sections={sections}
              onSections={setSections}
              music={music}
              onMusic={setMusic}
            />
          ) : null}
          {step === 5 ? (
            <StepPublikasi
              token={token}
              saveNow={saveNow}
              content={content}
              slug={slug}
              onSlug={setSlug}
              media={media}
              publishedLinks={publishResult}
              onPublished={setPublishResult}
            />
          ) : null}
        </div>
      </section>

      <div className="mt-8 flex gap-3">
        {step > 0 ? (
          <SecondaryButton onClick={goBack} fullWidth className="flex-1">
            Kembali
          </SecondaryButton>
        ) : null}
        {step < STEPS.length - 1 ? (
          <PrimaryButton onClick={goNext} fullWidth className="flex-1">
            Lanjut
          </PrimaryButton>
        ) : null}
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-meta text-muted">Pratinjau</p>
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="h-10 rounded-full border border-line px-4 text-meta text-ink"
            >
              Tutup
            </button>
          </div>
          <iframe
            title="Pratinjau undangan"
            src={`/edit/${token}/pratinjau`}
            className="size-full flex-1 bg-bg"
          />
        </div>
      ) : null}
    </div>
  );
}
