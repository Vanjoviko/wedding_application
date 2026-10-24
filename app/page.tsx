import Link from "next/link";
import { brandName } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center px-6 py-20">
      <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">Demo v1</p>

      <h1 className="mt-6 font-serif text-5xl leading-none italic">{brandName}</h1>

      <p className="mt-6 max-w-md text-base leading-relaxed text-stone-300">
        Buat undangan pernikahan modern, bagikan link personal ke tiap tamu lewat
        WhatsApp, dan terima RSVP di satu tempat.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/buat"
          className="inline-flex h-12 items-center justify-center rounded-full bg-stone-100 px-7 text-sm font-medium text-stone-950 transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 focus-visible:outline-none"
        >
          Buat undangan
        </Link>
        <Link
          href="/demo"
          className="inline-flex h-12 items-center justify-center rounded-full border border-stone-600 px-7 text-sm font-medium text-stone-200 transition-colors hover:border-stone-400 hover:text-white focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 focus-visible:outline-none"
        >
          Lihat contoh undangan
        </Link>
      </div>

      <p className="mt-12 text-xs leading-relaxed text-stone-500">
        Tanpa akun, tanpa biaya. Undangan dikunci dari mesin pencari dan hanya dibagikan
        lewat link pribadi.
      </p>
    </main>
  );
}
