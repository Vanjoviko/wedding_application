"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveGuests, saveGuestTemplate } from "@/app/edit/[token]/actions";
import { CopyButton } from "@/components/invitation/CopyButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import {
  MAX_GUESTS,
  guestLink,
  guestMessage,
  parseGuestNames,
  toCsv,
  whatsappShareUrl,
} from "@/lib/guests";

type Props = {
  token: string;
  slug: string | null;
  couple: string;
  baseUrl: string;
  names: string[];
  template: string;
  defaultTemplate: string;
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

export function GuestsTab({
  token,
  slug,
  couple,
  baseUrl,
  names,
  template,
  defaultTemplate,
}: Props) {
  const [list, setList] = useState(names);
  const [templateText, setTemplateText] = useState(template);
  const [namesText, setNamesText] = useState(names.join("\n"));
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<"guests" | "template" | null>(null);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const router = useRouter();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return list;
    return list.filter((name) => name.toLowerCase().includes(query));
  }, [list, search]);

  const rows = useMemo(() => {
    if (!slug) return [];
    return filtered.slice(0, visible).map((name) => {
      const link = guestLink(baseUrl, slug, name);
      return {
        name,
        link,
        message: guestMessage({ template: templateText, name, link, couple }),
      };
    });
  }, [filtered, visible, slug, baseUrl, templateText, couple]);

  async function saveNames() {
    setBusy("guests");
    setMessage(null);
    const result = await saveGuests(token, namesText);
    setBusy(null);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    const parsed = parseGuestNames(namesText);
    setList(parsed);
    setNamesText(parsed.join("\n"));
    setVisible(PAGE_SIZE);
    setMessage(`${result.count} nama tamu disimpan.`);
    router.refresh();
  }

  async function saveTemplate() {
    setBusy("template");
    setMessage(null);
    const result = await saveGuestTemplate(token, templateText);
    setBusy(null);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage("Template pesan disimpan.");
    router.refresh();
  }

  function downloadAll() {
    if (!slug) return;
    const csvRows: Array<Array<string>> = [["Nama", "Link", "Pesan"]];
    for (const name of list) {
      const link = guestLink(baseUrl, slug, name);
      csvRows.push([
        name,
        link,
        guestMessage({ template: templateText, name, link, couple }),
      ]);
    }
    downloadCsv("daftar-tamu.csv", toCsv(csvRows));
  }

  if (!slug) {
    return (
      <div className="rounded-card border border-line bg-surface p-5">
        <p className="font-serif text-card text-ink italic">Undangan belum terbit</p>
        <p className="mt-2 text-body text-ink-soft">
          Publikasikan undangan dulu di tab Isi undangan. Setelah itu generator link tamu
          bisa dipakai.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <h2 className="font-serif text-card text-ink italic">Daftar tamu</h2>
        <p className="mt-1 text-meta text-muted">
          Satu nama per baris, maksimal {MAX_GUESTS} nama sekali proses. Nama duplikat
          otomatis dihapus.
        </p>

        <textarea
          rows={10}
          value={namesText}
          onChange={(event) => setNamesText(event.target.value)}
          placeholder={"Bapak Hendra Gunawan\nIbu Maya Kartika\nAndi Saputra"}
          className="mt-3 w-full rounded-count border border-line bg-bg p-3 text-body text-ink placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
        />

        <div className="mt-3 flex flex-wrap gap-3">
          <PrimaryButton
            type="button"
            onClick={() => void saveNames()}
            disabled={busy !== null}
          >
            {busy === "guests" ? "Menyimpan…" : "Simpan daftar"}
          </PrimaryButton>
          <SecondaryButton
            type="button"
            onClick={downloadAll}
            disabled={list.length === 0}
          >
            Unduh CSV
          </SecondaryButton>
        </div>

        {message ? (
          <p role="status" className="mt-2 text-note text-accent">
            {message}
          </p>
        ) : (
          <p className="mt-2 text-note text-muted">{list.length} nama tersimpan.</p>
        )}

        <h3 className="mt-8 border-t border-line pt-6 text-body font-medium text-ink">
          Template pesan
        </h3>
        <p className="mt-1 text-meta text-muted">
          Variabel: {"{nama_tamu}"}, {"{link}"}, {"{nama_mempelai}"}.
        </p>
        <textarea
          rows={12}
          value={templateText}
          onChange={(event) => setTemplateText(event.target.value)}
          className="mt-3 w-full rounded-count border border-line bg-bg p-3 text-body text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-3">
          <SecondaryButton
            type="button"
            onClick={() => void saveTemplate()}
            disabled={busy !== null}
          >
            {busy === "template" ? "Menyimpan…" : "Simpan template"}
          </SecondaryButton>
          <SecondaryButton
            type="button"
            onClick={() => setTemplateText(defaultTemplate)}
            disabled={busy !== null}
          >
            Pakai template bawaan
          </SecondaryButton>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-card text-ink italic">Link tamu</h2>
        <p className="mt-1 text-meta text-muted">
          {list.length} link siap dibagikan. Salin satu per satu atau unduh CSV.
        </p>

        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder="Cari nama"
          className="mt-3 h-11 w-full rounded-count border border-line bg-bg px-3 text-body text-ink placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
        />

        {rows.length === 0 ? (
          <p className="mt-4 text-body text-muted">Belum ada nama yang cocok.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {rows.map((row) => (
              <li key={row.name} className="py-4">
                <p className="text-body text-ink">{row.name}</p>
                <p className="mt-0.5 text-note break-all text-muted">{row.link}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void navigator.clipboard.writeText(row.link)}
                    className="h-9 rounded-full border border-line px-3 text-note text-ink-soft hover:border-accent/60"
                  >
                    Salin link
                  </button>
                  <button
                    type="button"
                    onClick={() => void navigator.clipboard.writeText(row.message)}
                    className="h-9 rounded-full border border-line px-3 text-note text-ink-soft hover:border-accent/60"
                  >
                    Salin pesan
                  </button>
                  <a
                    href={whatsappShareUrl(row.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center rounded-full border border-accent/60 px-3 text-note text-accent hover:border-accent"
                  >
                    Kirim lewat WhatsApp
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}

        {filtered.length > visible ? (
          <SecondaryButton
            fullWidth
            className="mt-4"
            onClick={() => setVisible((count) => count + PAGE_SIZE)}
          >
            Muat lebih banyak ({filtered.length - visible} lagi)
          </SecondaryButton>
        ) : null}

        <div className="mt-6">
          <CopyButton value={templateText} label="Salin template pesan" />
        </div>
      </div>
    </div>
  );
}
