"use client";

import { useState } from "react";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { toCsv } from "@/lib/guests";

export type ResponseRow = {
  id: string;
  guestName: string;
  attendance: "hadir" | "tidak_hadir";
  pax: number;
  message: string | null;
  createdAt: string;
  timeLabel: string;
};

type Props = {
  rows: ResponseRow[];
  summary: { hadir: number; pax: number; tidakHadir: number };
};

const PAGE_SIZE = 25;

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([`\uFEFF${content}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ResponsesTab({ rows, summary }: Props) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  function download() {
    const csv: Array<Array<string | number>> = [
      ["Nama", "Kehadiran", "Jumlah orang", "Ucapan", "Waktu"],
    ];
    for (const row of rows) {
      csv.push([
        row.guestName,
        row.attendance === "hadir" ? "Hadir" : "Tidak hadir",
        row.pax,
        row.message ?? "",
        new Date(row.createdAt).toISOString(),
      ]);
    }
    downloadCsv("respons-tamu.csv", toCsv(csv));
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-card border border-line bg-surface p-5">
        <p className="font-serif text-card text-ink italic">Belum ada respons</p>
        <p className="mt-2 text-body text-ink-soft">
          Begitu tamu mengirim RSVP, jawabannya muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Hadir", value: summary.hadir },
          { label: "Total orang", value: summary.pax },
          { label: "Tidak hadir", value: summary.tidakHadir },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-card border border-line bg-surface p-4 text-center"
          >
            <p className="text-[28px] leading-none text-ink tabular-nums">{item.value}</p>
            <p className="mt-1 text-note text-muted">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-meta text-muted">{rows.length} respons</p>
        <SecondaryButton type="button" onClick={download}>
          Unduh CSV
        </SecondaryButton>
      </div>

      <ul className="mt-2 divide-y divide-line">
        {rows.slice(0, visible).map((row) => (
          <li key={row.id} className="py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-body text-ink">{row.guestName}</p>
              <span className="shrink-0 text-note text-muted">{row.timeLabel}</span>
            </div>
            <p className="mt-0.5 text-note text-muted">
              {row.attendance === "hadir"
                ? row.pax > 1
                  ? `Hadir · ${row.pax} orang`
                  : "Hadir"
                : "Tidak hadir"}
            </p>
            {row.message ? (
              <p className="mt-2 text-body text-ink-soft">{row.message}</p>
            ) : null}
          </li>
        ))}
      </ul>

      {rows.length > visible ? (
        <SecondaryButton
          fullWidth
          className="mt-4"
          onClick={() => setVisible((count) => count + PAGE_SIZE)}
        >
          Muat lebih banyak ({rows.length - visible} lagi)
        </SecondaryButton>
      ) : null}
    </div>
  );
}
