import Link from "next/link";
import { brandName } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center px-6 py-20">
      <h1 className="font-serif text-5xl leading-none text-ink italic">{brandName}</h1>

      <p className="mt-6 max-w-md text-body text-ink-soft">
        Undangan pernikahan digital yang dibuka dari link WhatsApp. Tamu melihat nama
        mereka sendiri di halaman undangan, lalu mengirim RSVP tanpa akun.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/contoh"
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          Lihat contoh undangan
        </Link>
        <Link
          href="/buat"
          className="inline-flex h-12 items-center justify-center rounded-full border border-accent/60 px-7 text-sm font-medium text-accent transition-colors hover:border-accent hover:text-accent-hover focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          Buat undangan
        </Link>
      </div>

      <p className="mt-8 max-w-md text-note text-muted">
        Tombol buat undangan aktif setelah wizard selesai dibangun. Sementara itu, contoh
        undangan di atas sudah bisa dibuka seperti yang diterima tamu.
      </p>
    </main>
  );
}
