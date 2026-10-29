/**
 * Foto demo disimpan di `public/demo`, sedangkan unggahan pengguna berada di
 * bucket Storage `media`. Jalur yang diawali "/" dipakai apa adanya.
 */
export function resolveMediaUrl(storagePath: string) {
  if (storagePath.startsWith("/")) return storagePath;

  const base = process.env.SUPABASE_URL;
  if (!base) return "";

  return `${base.replace(/\/+$/, "")}/storage/v1/object/public/media/${storagePath}`;
}
