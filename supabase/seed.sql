-- Data demo untuk pengembangan lokal: undangan raka-sekar.
-- Token edit demo: "demo-raka-sekar-edit-token-2027" (hanya hash yang disimpan).
-- Foto memakai berkas di public/demo, bukan Storage, supaya seed tetap ringan.

insert into public.events (
  id, slug, type, theme, plan, status, edit_token_hash,
  content, sections, music_track, published_at, expires_at
) values (
  '11111111-1111-4111-8111-111111111111',
  'raka-sekar',
  'wedding',
  'modern',
  'premium',
  'published',
  '2c3df0389c723f09162776e515c6c1c170c529484e2716e6664355ad0e60c977',
  '{
    "groom": {
      "nickname": "Raka",
      "fullName": "Raka Pradipta Wibowo, S.T.",
      "childOrder": "pertama",
      "father": "Bapak Haryo Wibowo",
      "mother": "Ibu Sri Lestari",
      "instagram": "raka.pradipta"
    },
    "bride": {
      "nickname": "Sekar",
      "fullName": "Sekar Ayu Kinanti, S.Ds.",
      "childOrder": "kedua",
      "father": "Bapak Bambang Kuncoro",
      "mother": "Ibu Ratna Dewi",
      "instagram": "sekar.kinanti"
    },
    "events": [
      {
        "name": "Akad nikah",
        "date": "2027-05-15",
        "start": "08.00",
        "end": "10.00",
        "tz": "WIB",
        "venue": "Pendopo Ndalem Sekar",
        "address": "Jl. Contoh No. 12, Sleman, Yogyakarta"
      },
      {
        "name": "Resepsi",
        "date": "2027-05-15",
        "start": "11.00",
        "end": "14.00",
        "tz": "WIB",
        "venue": "Pendopo Ndalem Sekar",
        "address": "Jl. Contoh No. 12, Sleman, Yogyakarta"
      }
    ],
    "opening": {
      "presetId": "peribahasa-jawa",
      "text": "Witing tresna jalaran saka kulina.",
      "source": "Cinta tumbuh karena terbiasa bersama.",
      "invitation": "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberi doa restu di hari pernikahan kami."
    },
    "story": {
      "title": "Cerita Kami",
      "text": "Kami pertama kali bertemu di sebuah lokakarya desain di Yogyakarta pada 2021. Obrolan singkat soal kopi berlanjut menjadi kebiasaan pulang bersama, lalu menjadi rencana masa depan. Awal 2026, Raka melamar Sekar di teras rumah keluarga, disaksikan kedua orang tua."
    },
    "gifts": {
      "accounts": [
        {
          "bank": "Bank Contoh",
          "number": "1234567890",
          "holder": "Sekar Ayu Kinanti"
        }
      ],
      "address": "Jl. Contoh No. 12, Sleman, Yogyakarta"
    },
    "coInviters": [
      "Keluarga Besar Wibowo",
      "Keluarga Besar Kuncoro"
    ],
    "closing": "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami ucapkan terima kasih."
  }'::jsonb,
  '{"story": true, "gallery": true, "wishes": true, "gifts": true}'::jsonb,
  'track-01',
  now() - interval '1 day',
  timestamptz '2027-08-13 23:59:59+07'
);

insert into public.media (
  id, event_id, kind, person_key, storage_path, width, height, focal_x, focal_y, sort_order
) values
  (
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111111',
    'cover', null, '/demo/cover.webp', 1067, 1600, 0.45, 0.55, 0
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111111',
    'person', 'groom', '/demo/groom.webp', 1280, 1600, 0.50, 0.40, 0
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111111',
    'person', 'bride', '/demo/bride.webp', 1280, 1600, 0.50, 0.40, 0
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    '11111111-1111-4111-8111-111111111111',
    'gallery', null, '/demo/gallery-01.webp', 1000, 1000, 0.50, 0.50, 0
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    '11111111-1111-4111-8111-111111111111',
    'gallery', null, '/demo/gallery-02.webp', 1000, 1000, 0.50, 0.30, 1
  ),
  (
    '22222222-2222-4222-8222-222222222206',
    '11111111-1111-4111-8111-111111111111',
    'gallery', null, '/demo/gallery-03.webp', 1000, 1000, 0.35, 0.70, 2
  ),
  (
    '22222222-2222-4222-8222-222222222207',
    '11111111-1111-4111-8111-111111111111',
    'gallery', null, '/demo/gallery-04.webp', 1000, 1000, 0.70, 0.50, 3
  );

insert into public.guests (id, event_id, name) values
  (
    '33333333-3333-4333-8333-333333333301',
    '11111111-1111-4111-8111-111111111111',
    'Bapak Hendra Gunawan'
  ),
  (
    '33333333-3333-4333-8333-333333333302',
    '11111111-1111-4111-8111-111111111111',
    'Andi Saputra'
  ),
  (
    '33333333-3333-4333-8333-333333333303',
    '11111111-1111-4111-8111-111111111111',
    'Maya Kartika'
  );

insert into public.responses (
  id, event_id, guest_name, attendance, pax, message, ip_hash, created_at
) values
  (
    '44444444-4444-4444-8444-444444444401',
    '11111111-1111-4111-8111-111111111111',
    'Bapak Hendra Gunawan', 'hadir', 2,
    'Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah dan penuh berkah.',
    null,
    now() - interval '3 hours'
  ),
  (
    '44444444-4444-4444-8444-444444444402',
    '11111111-1111-4111-8111-111111111111',
    'Andi Saputra', 'hadir', 1,
    'Ikut bahagia untuk kalian berdua. Sampai jumpa di Jogja!',
    null,
    now() - interval '2 hours'
  ),
  (
    '44444444-4444-4444-8444-444444444403',
    '11111111-1111-4111-8111-111111111111',
    'Maya Kartika', 'tidak_hadir', 0,
    'Maaf belum bisa hadir. Doa terbaik untuk Raka dan Sekar.',
    null,
    now() - interval '1 hour'
  );
