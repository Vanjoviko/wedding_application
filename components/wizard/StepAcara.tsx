"use client";

import { Field, Select, SubHead, TextInput } from "@/components/wizard/fields";
import type { StepProps } from "@/components/wizard/types";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

const PRESETS = ["Akad nikah", "Pemberkatan", "Resepsi", "Ngunduh mantu"];

export function StepAcara({ content, onChange }: StepProps) {
  const events = content.events ?? [];

  function updateEvent(index: number, patch: Record<string, unknown>) {
    onChange((draft) => ({
      ...draft,
      events: (draft.events ?? []).map((event, position) =>
        position === index ? { ...event, ...patch } : event,
      ),
    }));
  }

  function addEvent() {
    if (events.length >= 3) return;
    onChange((draft) => ({
      ...draft,
      events: [
        ...(draft.events ?? []),
        {
          name: "Resepsi",
          date: draft.events?.[0]?.date ?? "",
          start: "11.00",
          end: "14.00",
          tz: draft.events?.[0]?.tz ?? "WIB",
          venue: "",
          address: "",
        },
      ],
    }));
  }

  function removeEvent(index: number) {
    onChange((draft) => ({
      ...draft,
      events: (draft.events ?? []).filter((_, position) => position !== index),
    }));
  }

  return (
    <div>
      {events.map((event, index) => (
        <div key={index} className="mb-4 rounded-card border border-line p-4">
          <div className="flex items-center justify-between">
            <SubHead>Acara {index + 1}</SubHead>
            {events.length > 1 ? (
              <button
                type="button"
                onClick={() => removeEvent(index)}
                className="text-note text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                Hapus
              </button>
            ) : null}
          </div>

          <Field label="Nama acara" htmlFor={`event-name-${index}`}>
            <TextInput
              id={`event-name-${index}`}
              value={event.name ?? ""}
              onChange={(value) => updateEvent(index, { name: value })}
              placeholder="Akad nikah"
              maxLength={60}
            />
          </Field>

          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateEvent(index, { name: preset })}
                className="h-8 rounded-full border border-line px-3 text-note text-muted transition-colors hover:border-accent/60 hover:text-ink"
              >
                {preset}
              </button>
            ))}
          </div>

          <Field label="Tanggal" htmlFor={`event-date-${index}`}>
            <TextInput
              id={`event-date-${index}`}
              type="date"
              value={event.date ?? ""}
              onChange={(value) => updateEvent(index, { date: value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Jam mulai" htmlFor={`event-start-${index}`}>
              <TextInput
                id={`event-start-${index}`}
                type="time"
                value={(event.start ?? "").replace(".", ":")}
                onChange={(value) =>
                  updateEvent(index, { start: value.replace(":", ".") })
                }
              />
            </Field>
            <Field label="Jam selesai" htmlFor={`event-end-${index}`}>
              <TextInput
                id={`event-end-${index}`}
                type="time"
                value={(event.end ?? "").replace(".", ":")}
                onChange={(value) => updateEvent(index, { end: value.replace(":", ".") })}
              />
            </Field>
          </div>

          <label className="mt-2 flex items-center gap-2 text-meta text-muted">
            <input
              type="checkbox"
              checked={!event.end}
              onChange={(input) =>
                updateEvent(index, {
                  end: input.target.checked ? null : "14.00",
                })
              }
              className="size-4 accent-[var(--accent)]"
            />
            Sampai selesai
          </label>

          <Field label="Zona waktu" htmlFor={`event-tz-${index}`}>
            <Select
              id={`event-tz-${index}`}
              value={event.tz ?? "WIB"}
              onChange={(value) => updateEvent(index, { tz: value })}
              options={[
                { value: "WIB", label: "WIB (UTC+7)" },
                { value: "WITA", label: "WITA (UTC+8)" },
                { value: "WIT", label: "WIT (UTC+9)" },
              ]}
            />
          </Field>

          <Field label="Nama tempat" htmlFor={`event-venue-${index}`}>
            <TextInput
              id={`event-venue-${index}`}
              value={event.venue ?? ""}
              onChange={(value) => updateEvent(index, { venue: value })}
              placeholder="Pendopo Ndalem Sekar"
            />
          </Field>

          <Field label="Alamat" htmlFor={`event-address-${index}`}>
            <TextInput
              id={`event-address-${index}`}
              value={event.address ?? ""}
              onChange={(value) => updateEvent(index, { address: value })}
              placeholder="Jl. Contoh No. 12, Sleman, Yogyakarta"
            />
          </Field>

          <Field
            label="Link Google Maps (opsional)"
            htmlFor={`event-maps-${index}`}
            hint="Tombol peta hanya muncul bila link diisi."
          >
            <TextInput
              id={`event-maps-${index}`}
              type="url"
              value={event.mapsUrl ?? ""}
              onChange={(value) => updateEvent(index, { mapsUrl: value })}
              placeholder="https://maps.google.com/..."
            />
          </Field>
        </div>
      ))}

      {events.length < 3 ? (
        <SecondaryButton onClick={addEvent} fullWidth>
          Tambah acara
        </SecondaryButton>
      ) : null}
    </div>
  );
}
