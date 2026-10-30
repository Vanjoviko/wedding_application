import type { Metadata } from "next";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { createDraft } from "./actions";

export const metadata: Metadata = {
  title: "Buat undangan",
  robots: { index: false, follow: false },
};

export default function BuatPage() {
  return (
    <main className="mx-auto w-full max-w-[430px] px-6 py-12">
      <h1 className="font-serif text-[34px] leading-tight text-ink italic">
        Buat undangan
      </h1>
      <p className="mt-3 text-body text-ink-soft">
        Pilih jenis acara dulu. Setelah ini kamu akan mendapat alamat edit rahasia —
        simpan baik-baik, karena hanya alamat itu yang bisa dipakai untuk mengubah
        undangan.
      </p>

      <form action={createDraft} className="mt-8 flex flex-col gap-5">
        <fieldset>
          <legend className="text-meta text-muted">Jenis acara</legend>
          <div className="mt-3 flex flex-col gap-3">
            {[
              {
                value: "wedding",
                title: "Pernikahan",
                description: "Mempelai, acara, cerita, galeri, RSVP, dan amplop",
              },
              {
                value: "sweet17",
                title: "Sweet seventeen",
                description: "Profil yang berulang tahun, rundown, dan dress code",
              },
            ].map((option, index) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-card border border-line bg-surface p-4 focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-bg has-checked:border-accent"
              >
                <input
                  type="radio"
                  name="type"
                  value={option.value}
                  defaultChecked={index === 0}
                  className="mt-1 size-4 accent-[var(--accent)]"
                />
                <span>
                  <span className="block text-body font-medium text-ink">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-meta text-muted">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <PrimaryButton type="submit" fullWidth>
          Lanjut
        </PrimaryButton>
      </form>
    </main>
  );
}
