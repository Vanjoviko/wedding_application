export const MAX_GUESTS = 500;

export const DEFAULT_GUEST_TEMPLATE = `Kepada Yth.
{nama_tamu}

Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan kami.

Info lengkap acara ada di tautan berikut:
{link}

Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih,
{nama_mempelai}`;

/** Satu nama per baris; baris kosong dibuang, duplikat (tanpa beda kapital) dihapus. */
export function parseGuestNames(raw: string) {
  const seen = new Set<string>();
  const names: string[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const name = line.replace(/\s+/g, " ").trim().slice(0, 60);
    if (!name) continue;

    const key = name.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    names.push(name);
    if (names.length >= MAX_GUESTS) break;
  }

  return names;
}

export function guestLink(baseUrl: string, slug: string, name: string) {
  return `${baseUrl}/${slug}?to=${encodeURIComponent(name)}`;
}

export function guestMessage(options: {
  template: string;
  name: string;
  link: string;
  couple: string;
}) {
  return options.template
    .replaceAll("{nama_tamu}", options.name)
    .replaceAll("{link}", options.link)
    .replaceAll("{nama_mempelai}", options.couple);
}

export function whatsappShareUrl(message: string) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function csvCell(value: string) {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

export function toCsv(rows: Array<Array<string | number>>) {
  return rows
    .map((row) => row.map((cell) => csvCell(String(cell))).join(","))
    .join("\r\n");
}
