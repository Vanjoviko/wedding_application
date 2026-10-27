# Catatan keputusan

Keputusan yang diambil di luar `docs/PRD.md` dicatat di sini, terbaru di atas. Format: tanggal, keputusan, alasan, milestone.

| Tanggal | Keputusan | Alasan | Milestone |
| --- | --- | --- | --- |
| 2026-10-27 | Vercel wajib punya environment variable `PNPM_CONFIG_NODE_LINKER=isolated` untuk Production dan Preview | `nodeLinker: hoisted` di `pnpm-workspace.yaml` ikut terbaca saat Vercel menyiapkan engine pnpm 12, sehingga `node_modules/pnpm` tidak ada dan build gagal dengan "pnpm wrapper is missing" | M0 |
| 2026-10-27 | `nodeLinker: hoisted` tetap dipakai di repo hanya untuk mesin lokal | Proyek berada di mount Windows (drvfs) yang tidak andal untuk symlink; Vercel menimpanya dengan `isolated` | M0 |
| 2026-10-27 | Nama brand sementara "Undangan Digital" sebagai fallback `NEXT_PUBLIC_BRAND_NAME`; repo GitHub dibiarkan public | Keputusan pemilik produk | M0 |
| 2026-10-27 | Token tambahan `focus` #F2ECE2 dan `danger` #E7A99B, di luar palet PRD | Fokus keyboard dan pesan error butuh warna sendiri; emas sudah berarti "aksi" | M1 |
| 2026-10-27 | Skala teks tambahan `quote` 26px untuk kutipan di Pembuka | PRD tidak mendefinisikan ukuran kutipan, hanya judul, isi, dan catatan | M1 |
| 2026-10-27 | Section Pembuka berdiri sendiri di atas Mempelai. Paragraf ajakan hadir yang di `mempelai.html` tampil tepat di bawah judul Mempelai dipindah ke Pembuka | PRD menetapkan Pembuka sebagai section wajib yang memuat paragraf ajakan hadir | M1 |
| 2026-10-27 | `/dev/ui` dan `/contoh` boleh dibuka di preview deployment, tetap 404 di production | Supaya desain bisa ditinjau dari ponsel tanpa menjalankan server lokal | M1 |
| 2026-10-27 | `/contoh` adalah pratinjau statis (Cover, Pembuka, Mempelai, Acara) dengan `noindex`; halaman undangan tamu yang sesungguhnya tetap dibangun di M3 | Memberi pemilik produk sesuatu yang bisa dibuka sebelum M3 | M1 |
| 2026-10-27 | Semua foto demo memakai satu foto Unsplash `dvF6s1H1x68` dengan crop berbeda per slot | Foto asli belum tersedia; jalur file sengaja tetap agar bisa ditimpa tanpa mengubah kode | M1 |
| 2026-10-27 | Foto cover memakai `next/image` dengan `priority` | LCP dan penyajian WebP otomatis | M1 |
| 2026-10-24 | Next.js 16.4 (App Router), React 19.3, Tailwind CSS 4.3, TypeScript 5.9 `strict`, Node 20+ | Versi stabil saat M0; TypeScript 7 belum dipakai karena belum tentu cocok dengan `eslint-config-next` | M0 |
| 2026-10-24 | Font Cormorant Garamond dan Jost dimuat lewat `next/font/google` (self-host saat build), bukan `<link>` ke fonts.googleapis.com | Menghindari request pihak ketiga dan membantu target LCP | M0 |
| 2026-10-24 | Foto cover demo memakai Unsplash `dvF6s1H1x68` (Leonardo Miranda); bukti lisensi di `public/demo/CREDITS.md` | PRD mewajibkan foto stok berlisensi, bukan foto orang lain dari internet | M0 |
| 2026-10-24 | Tombol "Buat undangan" di landing mengarah ke `/buat` yang belum ada; 404 memakai `app/not-found.tsx` berbahasa Indonesia | Wizard baru dibangun di M6 | M0 |
| 2026-10-24 | Wilayah fungsi Vercel diset `sin1` lewat `vercel.json` | Sebagian besar tamu berada di Indonesia | M0 |

## Keputusan tertunda

| Topik | Keputusan yang diusulkan | Milestone |
| --- | --- | --- |
| Kolom `slug` | `text NULL` + unique index parsial `WHERE slug IS NOT NULL`, supaya banyak draf bisa ada tanpa slug | M2 |
| Proteksi token edit | `Referrer-Policy: no-referrer` dan noindex untuk `/edit/*`, tanpa embed pihak ketiga | M3 |
| Batas pembuatan draf | Batas draf per IP per jam dan batas jumlah draf aktif per IP | M6 |
| Siklus hidup draf | Draf tanpa aktivitas 30 hari dihapus beserta fotonya | M6 |
| Timeout Bantu Tulis | `maxDuration` eksplisit pada `/api/ai/bantu-tulis` sesuai batas paket Vercel | M8 |
| Anggaran JavaScript | Halaman undangan hanya memakai server component + CSS animation; komponen client dibatasi countdown, galeri, musik, RSVP | M3 |
| Penyimpanan rate limit RSVP | Hitungan per IP per undangan disimpan di Postgres, IP dari header proxy, bukan memori proses | M4 |
