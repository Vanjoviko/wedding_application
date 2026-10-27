import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center px-6 py-20">
      <h1 className="font-serif text-4xl leading-tight text-ink italic">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 max-w-md text-body text-ink-soft">
        Alamat yang Anda buka tidak tersedia. Periksa kembali link dari pengirim undangan,
        atau kembali ke beranda.
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
