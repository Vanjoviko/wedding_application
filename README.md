# Undangan Digital

Web undangan digital self-service. Pembuat mengisi wizard, lalu membagikan link personal ke tiap tamu lewat WhatsApp. Demo v1 fokus ke undangan pernikahan bertema Modern; sweet seventeen menyusul.

Kode aplikasi dibangun oleh AI coding agent, milestone demi milestone. Status terakhir: **M0 (fondasi proyek) selesai** — landing sementara sudah bisa dijalankan.

## Isi repo

| Path                      | Isi                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `docs/PRD.md`             | Kebutuhan produk lengkap, termasuk milestone M0 sampai M11 dan kriteria selesainya |
| `AGENTS.md`               | Instruksi kerja untuk AI coding agent                                              |
| `docs/design/modern/`     | Mockup HTML statis tema Modern (cover, mempelai, acara) sebagai acuan tampilan     |
| `docs/decisions.md`       | Catatan keputusan yang diambil di luar PRD                                         |
| `app/`                    | Rute Next.js App Router                                                            |
| `lib/`                    | Modul bersama non-UI                                                               |
| `tests/unit`, `tests/e2e` | Tes Vitest dan Playwright                                                          |
| `supabase/`               | Konfigurasi Supabase CLI, migrasi menyusul di M2                                   |

## Perintah

```
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm test           # Vitest
pnpm test:e2e       # Playwright
pnpm exec supabase start
```

## Cara mulai dengan agent

1. Buka repo ini di coding agent pilihanmu.
2. Minta agent membaca `AGENTS.md` dan `docs/PRD.md`.
3. Minta agent mengerjakan **M0. Fondasi proyek** saja, lalu periksa hasilnya sebelum lanjut ke milestone berikutnya.

## Yang perlu disiapkan pemilik produk

Daftar lengkapnya ada di bagian "Hal terbuka dan data demo" di `docs/PRD.md`: nama brand dan domain, lagu royalty-free, foto contoh berlisensi, preset kalimat pembuka, API key LLM, dan spesifikasi desain sweet seventeen.
