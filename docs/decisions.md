# Catatan keputusan

Keputusan yang diambil di luar `docs/PRD.md` dicatat di sini, terbaru di atas. Format: tanggal, keputusan, alasan, milestone.

| Tanggal | Keputusan | Alasan | Milestone |
| --- | --- | --- | --- |
| 2026-10-24 | Next.js 16.4 (App Router), React 19.3, Tailwind CSS 4.3, TypeScript 5.9 `strict`, Node 20+ | Versi stabil saat M0; TypeScript 7 belum dipakai karena belum tentu cocok dengan `eslint-config-next` | M0 |
| 2026-10-24 | pnpm memakai `nodeLinker: hoisted` di `pnpm-workspace.yaml` | Proyek berada di filesystem mount Windows (drvfs) yang tidak andal untuk symlink | M0 |
| 2026-10-24 | Font Cormorant Garamond dan Jost dimuat lewat `next/font/google` (self-host saat build), bukan `<link>` ke fonts.googleapis.com | Menghindari request pihak ketiga dan membantu target LCP | M0 |
| 2026-10-24 | Foto cover demo memakai Unsplash `dvF6s1H1x68` (Leonardo Miranda), disimpan sebagai `public/demo/cover.webp` 1600px; bukti lisensi di `public/demo/CREDITS.md` | PRD mewajibkan foto stok berlisensi, bukan foto orang lain dari internet | M0 |
| 2026-10-24 | File asli 4,7 MB tidak masuk repo, hanya versi WebP teroptimasi | Menjaga ukuran repo dan waktu build | M0 |
| 2026-10-24 | Tombol "Buat undangan" di landing mengarah ke `/buat` yang belum ada; 404 memakai `app/not-found.tsx` berbahasa Indonesia | Wizard baru dibangun di M6; 404 berbahasa Indonesia tetap dibutuhkan | M0 |
| 2026-10-24 | Wilayah fungsi Vercel diset `sin1` lewat `vercel.json` | Sebagian besar tamu berada di Indonesia | M0 |

## Keputusan tertunda

Sudah dianalisa tetapi sengaja belum diterapkan karena di luar cakupan M0. Wajib diputuskan sebelum milestone yang disebut.

| Topik | Keputusan yang diusulkan | Milestone |
| --- | --- | --- |
| Kolom `slug` | `text NULL` + unique index parsial `WHERE slug IS NOT NULL`, supaya banyak draf bisa ada tanpa slug | M2 |
| Proteksi token edit | `Referrer-Policy: no-referrer` dan noindex untuk `/edit/*`, tanpa embed pihak ketiga | M3 |
| Batas pembuatan draf | Batas draf per IP per jam dan batas jumlah draf aktif per IP | M6 |
| Siklus hidup draf | Draf tanpa aktivitas 30 hari dihapus beserta fotonya | M6 |
| Timeout Bantu Tulis | `maxDuration` eksplisit pada `/api/ai/bantu-tulis` sesuai batas paket Vercel | M8 |
| Anggaran JavaScript | Halaman undangan hanya memakai server component + CSS animation; komponen client dibatasi countdown, galeri, musik, RSVP | M3 |
| Penyimpanan rate limit RSVP | Hitungan per IP per undangan disimpan di Postgres, IP dari header proxy, bukan memori proses | M4 |
| Rasio foto | Cover 390×844, foto mempelai 4:5, galeri 1:1, dengan titik fokus `object-position` | M1 |
| Section Pembuka | Section tersendiri di atas Mempelai, bukan bagian dari Mempelai seperti di mockup | M1 |
