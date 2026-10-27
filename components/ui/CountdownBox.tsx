const units = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

type Values = Record<(typeof units)[number]["key"], number>;

export function CountdownBox({ values }: { values: Values }) {
  return (
    <div className="grid grid-cols-4 gap-2" role="timer" aria-live="off">
      {units.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-col items-center gap-0.5 rounded-count bg-surface py-3"
        >
          <span className="text-count font-medium text-ink tabular-nums">
            {String(values[key]).padStart(2, "0")}
          </span>
          <span className="text-note text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
