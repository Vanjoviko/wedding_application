import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center px-6 py-20">
      <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">404</p>
      <h1 className="mt-6 font-serif text-4xl leading-tight italic">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-stone-300">
        Alamat yang Anda buka tidak tersedia. Periksa kembali link dari pengirim undangan,
        atau mulai buat undangan baru.
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full bg-stone-100 px-7 text-sm font-medium text-stone-950 transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 focus-visible:outline-none"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
