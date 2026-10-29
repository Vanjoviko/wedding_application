# Catatan keputusan

Keputusan yang diambil di luar `docs/PRD.md` dicatat di sini, terbaru di atas. Format: tanggal, keputusan, alasan, milestone.

| Tanggal | Keputusan | Alasan | Milestone |
| --- | --- | --- | --- |
| 2026-10-29 | `cacheComponents` dan `partialPrefetching` dimatikan; `/[slug]` memakai `dynamic = "force-dynamic"` | Partial Prerender mengirim status 200 sebelum `notFound()` selesai, sehingga link yang tidak ada tidak menghasilkan 404 | M3 |
| 2026-10-29 | Tes e2e berjalan dengan 1 worker dan timeout 60 detik | Route undangan dirender dinamis; beberapa worker sekaligus membuat kompilasi dev bertumpuk dan tes flaky | M3 |
| 2026-10-29 | Font dipindah dari `next/font/google` ke `next/font/local` dengan berkas woff2 di `app/fonts/` | Build Vercel gagal di Turbopack: `next/font/google queries have exactly one entry` dan tidak bisa me-resolve font internal Vercel. Self-host juga menghapus ketergantungan jaringan saat build | M3 |
| 2026-10-29 | Halaman `/[slug]` dirender dinamis dengan `export const instant = false` | Undangan bergantung pada database dan parameter `?to=`; cacheComponents Next 16 menolak prerender data runtime tanpa Suspense | M3 |
| 2026-10-29 | Countdown dihitung di klien per detik, nilai awal dikirim dari server | Menghindari kedipan dan hydration mismatch, tetap akurat setelah halaman lama terbuka | M3 |
| 2026-10-29 | Offset zona waktu tetap WIB +7, WITA +8, WIT +9; `.ics` memakai `TZID` `Asia/Jakarta`, `Asia/Makassar`, `Asia/Jayapura` | Indonesia tidak memakai DST | M3 |
| 2026-10-29 | Acara tanpa jam selesai memakai durasi 2 jam di `.ics` | Kalender butuh `DTEND`; dua jam adalah perkiraan yang wajar | M3 |
| 2026-10-29 | Rate limit RSVP 5 kiriman per IP per undangan per jam, IP disimpan sebagai hash SHA-256 dengan `IP_HASH_SALT` | Sesuai PRD; hash menjaga privasi tamu | M3 |
| 2026-10-29 | Honeypot `website` yang terisi dijawab sukses tanpa menyimpan data | Bot tidak belajar bahwa kirimannya ditolak | M3 |
| 2026-10-29 | Nama tamu dari `?to=` dipangkas 60 karakter dan dirender sebagai teks biasa; tanpa `to` memakai "Bapak/Ibu/Saudara/i" | Sesuai PRD, mencegah HTML injection | M3 |
| 2026-10-29 | `X-Robots-Tag: noindex, nofollow` dan `Referrer-Policy: no-referrer` dikirim lewat `headers()` untuk `/:slug` | Meta saja tidak cukup; header juga melindungi token edit dari kebocoran referrer | M3 |
| 2026-10-29 | Musik demo `public/music/track-01.mp3` disintesis sendiri (pad lembut 32 detik) | Lagu royalty-free belum tersedia; aset sintetis tidak melanggar lisensi pihak ketiga | M3 |
| 2026-10-29 | Lightbox galeri memakai scroll-snap horizontal, bukan library | Menjaga anggaran JavaScript halaman undangan | M3 |
| 2026-10-28 | `events.slug` nullable, unique index parsial `where slug is not null`, plus constraint `status = 'draft' or slug is not null` | Banyak draf bisa hidup tanpa slug; undangan terbit wajib punya slug | M2 |
| 2026-10-28 | Kolom `type`, `theme`, `plan`, `status`, `kind`, `attendance` memakai `text` + `CHECK`, bukan tipe enum Postgres | Menambah nilai baru cukup ubah constraint, tidak perlu migrasi tipe | M2 |
| 2026-10-28 | `updated_at` diurus trigger `public.touch_updated_at()` | Satu sumber kebenaran, tidak bergantung pada setiap kode tulis | M2 |
| 2026-10-28 | Seed lokal memakai jalur `/demo/*.webp` di `media.storage_path` | Foto demo ada di `public/`, bukan Storage; M3 akan memakai jalur yang diawali `/` apa adanya, sisanya jadi URL publik Storage | M2 |
| 2026-10-28 | `supabase/seed.sql` hanya untuk lokal; data produksi dimasukkan lewat skrip SQL terpisah saat M3 | `seed.sql` ikut `db reset` dan tidak dijalankan ke database hosted | M2 |
| 2026-10-28 | Tipe `content` diturunkan dari skema Zod (`z.infer`), bukan ditulis ulang manual | Satu sumber kebenaran untuk validasi dan TypeScript | M2 |
| 2026-10-28 | Indeks `responses (event_id, ip_hash, created_at desc)` dibuat sekarang | Dibutuhkan untuk rate limit RSVP di M4 | M2 |
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
| Proteksi token edit | `Referrer-Policy: no-referrer` dan noindex untuk `/edit/*`, tanpa embed pihak ketiga | M3 |
| Batas pembuatan draf | Batas draf per IP per jam dan batas jumlah draf aktif per IP | M6 |
| Siklus hidup draf | Draf tanpa aktivitas 30 hari dihapus beserta fotonya | M6 |
| Timeout Bantu Tulis | `maxDuration` eksplisit pada `/api/ai/bantu-tulis` sesuai batas paket Vercel | M8 |
| Anggaran JavaScript | Halaman undangan hanya memakai server component + CSS animation; komponen client dibatasi countdown, galeri, musik, RSVP | M3 |
| Penyimpanan rate limit RSVP | Hitungan per IP per undangan disimpan di Postgres, IP dari header proxy, bukan memori proses | M4 |
