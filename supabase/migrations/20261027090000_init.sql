-- M2: model data undangan digital
-- Empat tabel (events, media, guests, responses) + bucket media.
-- RLS aktif di semua tabel tanpa policy untuk anon: browser tidak bisa membaca
-- atau menulis data. Semua akses lewat server dengan service role key.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text,
  type text not null check (type in ('wedding', 'sweet17')),
  theme text not null default 'modern' check (theme in ('modern')),
  plan text not null default 'premium' check (plan in ('free', 'premium')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  edit_token_hash text not null unique,
  content jsonb not null default '{}'::jsonb,
  sections jsonb not null default jsonb_build_object(
    'story', true,
    'gallery', true,
    'wishes', true,
    'gifts', true
  ),
  music_track text,
  ai_uses integer not null default 0 check (ai_uses >= 0),
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_published_has_slug
    check (status = 'draft' or slug is not null),
  constraint events_slug_format
    check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint events_slug_length
    check (slug is null or char_length(slug) between 3 and 40)
);

-- Draf boleh hidup tanpa slug; hanya slug terisi yang harus unik.
create unique index events_slug_key
  on public.events (slug)
  where slug is not null;

create index events_status_idx on public.events (status, created_at desc);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  kind text not null check (kind in ('cover', 'person', 'gallery')),
  person_key text check (person_key in ('groom', 'bride', 'celebrant')),
  storage_path text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  focal_x numeric(4, 3) not null default 0.5 check (focal_x between 0 and 1),
  focal_y numeric(4, 3) not null default 0.5 check (focal_y between 0 and 1),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint media_person_key_required
    check (kind <> 'person' or person_key is not null)
);

create index media_event_idx on public.media (event_id, kind, sort_order);
create unique index media_cover_once on public.media (event_id) where kind = 'cover';
create unique index media_person_once
  on public.media (event_id, person_key)
  where kind = 'person';

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  created_at timestamptz not null default now()
);

create index guests_event_idx on public.guests (event_id, created_at);

create table public.responses (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  guest_name text not null check (char_length(btrim(guest_name)) between 1 and 60),
  attendance text not null check (attendance in ('hadir', 'tidak_hadir')),
  pax integer not null default 0 check (pax between 0 and 5),
  message text check (message is null or char_length(message) <= 500),
  ip_hash text,
  created_at timestamptz not null default now(),
  constraint responses_pax_matches_attendance
    check (
      (attendance = 'hadir' and pax between 1 and 5)
      or (attendance = 'tidak_hadir' and pax = 0)
    )
);

create index responses_event_idx on public.responses (event_id, created_at desc);
create index responses_rate_limit_idx
  on public.responses (event_id, ip_hash, created_at desc);

-- updated_at diurus database, bukan aplikasi.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_touch_updated_at
  before update on public.events
  for each row execute function public.touch_updated_at();

-- RLS aktif tanpa policy untuk anon: kunci publik Supabase tidak bisa membaca apa pun.
alter table public.events enable row level security;
alter table public.media enable row level security;
alter table public.guests enable row level security;
alter table public.responses enable row level security;

-- Bucket foto: publik untuk dibaca, penulisan hanya lewat signed URL dari server.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
