"use client";

import { Field, Select, SubHead, TextArea, TextInput } from "@/components/wizard/fields";
import type { StepProps } from "@/components/wizard/types";

const PRESETS = [
  { value: "", label: "Tulis sendiri" },
  { value: "umum", label: "Umum" },
  { value: "peribahasa-jawa", label: "Peribahasa Jawa" },
];

const PRESET_TEXT: Record<string, { text: string; source: string; invitation: string }> =
  {
    umum: {
      text: "Dengan penuh syukur, kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan kami.",
      source: "",
      invitation:
        "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberi doa restu di hari pernikahan kami.",
    },
    "peribahasa-jawa": {
      text: "Witing tresna jalaran saka kulina.",
      source: "Cinta tumbuh karena terbiasa bersama.",
      invitation:
        "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberi doa restu di hari pernikahan kami.",
    },
  };

export function StepTeks({ content, onChange }: StepProps) {
  const opening = content.opening ?? {};
  const story = content.story ?? {};

  return (
    <div>
      <SubHead>Kalimat pembuka</SubHead>
      <Field
        label="Pilih preset"
        htmlFor="opening-preset"
        hint="Memilih preset akan mengganti kalimat pembuka dan paragraf ajakan."
      >
        <Select
          id="opening-preset"
          value={opening.presetId ?? ""}
          onChange={(value) => {
            const preset = PRESET_TEXT[value];
            onChange((draft) => ({
              ...draft,
              opening: {
                ...draft.opening,
                presetId: value || null,
                ...(preset
                  ? {
                      text: preset.text,
                      source: preset.source,
                      invitation: preset.invitation,
                    }
                  : {}),
              },
            }));
          }}
          options={PRESETS}
        />
      </Field>

      <Field
        label="Kutipan atau kalimat pembuka"
        htmlFor="opening-text"
        hint="Maksimal 400 karakter."
      >
        <TextArea
          id="opening-text"
          rows={3}
          maxLength={400}
          value={opening.text ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              opening: { ...draft.opening, text: value },
            }))
          }
        />
      </Field>

      <Field
        label="Sumber kutipan (opsional)"
        htmlFor="opening-source"
        hint="Misalnya terjemahan atau nama penulis."
      >
        <TextInput
          id="opening-source"
          value={opening.source ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              opening: { ...draft.opening, source: value },
            }))
          }
          maxLength={160}
        />
      </Field>

      <Field
        label="Paragraf ajakan"
        htmlFor="opening-invitation"
        hint="Maksimal 600 karakter."
      >
        <TextArea
          id="opening-invitation"
          rows={4}
          maxLength={600}
          value={opening.invitation ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              opening: { ...draft.opening, invitation: value },
            }))
          }
        />
      </Field>

      <SubHead>Cerita Kami (opsional)</SubHead>
      <Field label="Judul" htmlFor="story-title">
        <TextInput
          id="story-title"
          value={story.title ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              story: { ...draft.story, title: value },
            }))
          }
          placeholder="Cerita Kami"
          maxLength={60}
        />
      </Field>
      <Field
        label="Cerita"
        htmlFor="story-text"
        hint={`${(story.text ?? "").length}/1200 karakter. Kosongkan bila tidak ingin menampilkan section ini.`}
      >
        <TextArea
          id="story-text"
          rows={8}
          maxLength={1200}
          value={story.text ?? ""}
          onChange={(value) =>
            onChange((draft) => ({
              ...draft,
              story: { ...draft.story, text: value },
            }))
          }
        />
      </Field>

      <SubHead>Penutup</SubHead>
      <Field label="Kalimat penutup" htmlFor="closing" hint="Maksimal 600 karakter.">
        <TextArea
          id="closing"
          rows={4}
          maxLength={600}
          value={content.closing ?? ""}
          onChange={(value) => onChange((draft) => ({ ...draft, closing: value }))}
        />
      </Field>
    </div>
  );
}
