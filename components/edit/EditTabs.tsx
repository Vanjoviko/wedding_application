import Link from "next/link";
import { cx } from "@/lib/cx";

type Props = {
  token: string;
  active: "isi" | "tamu" | "respons";
};

const TABS = [
  { id: "isi", label: "Isi undangan", href: "" },
  { id: "tamu", label: "Tamu", href: "?tab=tamu" },
  { id: "respons", label: "Respons", href: "?tab=respons" },
] as const;

export function EditTabs({ token, active }: Props) {
  return (
    <nav
      aria-label="Bagian halaman edit"
      className="mb-6 flex gap-1 overflow-x-auto border-b border-line"
    >
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={`/edit/${token}${tab.href}`}
          aria-current={active === tab.id ? "page" : undefined}
          className={cx(
            "-mb-px shrink-0 border-b-2 px-4 py-3 text-meta transition-colors",
            active === tab.id
              ? "border-accent text-ink"
              : "border-transparent text-muted hover:text-ink",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
