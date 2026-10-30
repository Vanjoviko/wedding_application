import type { DraftContent } from "@/lib/draft";
import type { Sections } from "@/lib/schema";

export type MediaItem = {
  id: string;
  kind: "cover" | "person" | "gallery";
  personKey: "groom" | "bride" | null;
  url: string;
  focalX: number;
  focalY: number;
};

export type Update = (updater: (draft: DraftContent) => DraftContent) => void;

export type StepProps = {
  content: DraftContent;
  onChange: Update;
};

export type WizardStep = {
  id: string;
  title: string;
  description: string;
};

export const STEPS: WizardStep[] = [
  { id: "mempelai", title: "Mempelai", description: "Nama dan orang tua" },
  { id: "acara", title: "Acara", description: "Tanggal, jam, dan tempat" },
  { id: "foto", title: "Foto", description: "Cover, mempelai, galeri" },
  { id: "teks", title: "Teks", description: "Pembuka dan cerita" },
  { id: "fitur", title: "Fitur", description: "Section dan amplop" },
  { id: "publikasi", title: "Publikasi", description: "Alamat dan terbit" },
];

export type { Sections };
