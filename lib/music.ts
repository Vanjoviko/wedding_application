export type MusicTrack = {
  id: string;
  title: string;
  mood: string;
};

/** Lagu bawaan. Berkas ada di public/music. */
export const MUSIC_TRACKS: MusicTrack[] = [
  { id: "track-01", title: "Sindhu", mood: "Hangat, pelan" },
  { id: "track-02", title: "Laras", mood: "Tenang, cerah" },
  { id: "track-03", title: "Gita", mood: "Lembut, mengalun" },
];

export function musicUrl(trackId: string | null | undefined) {
  if (!trackId) return null;
  return `/music/${trackId}.mp3`;
}
