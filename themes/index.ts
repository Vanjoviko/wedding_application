import { Acara } from "@/themes/modern/Acara";
import { Amplop } from "@/themes/modern/Amplop";
import { CeritaKami } from "@/themes/modern/CeritaKami";
import { Galeri } from "@/themes/modern/Galeri";
import { Cover } from "@/themes/modern/Cover";
import { Mempelai } from "@/themes/modern/Mempelai";
import { Pembuka } from "@/themes/modern/Pembuka";
import { Penutup } from "@/themes/modern/Penutup";
import { Rsvp } from "@/themes/modern/Rsvp";
import { Ucapan } from "@/themes/modern/Ucapan";

export const themes = {
  modern: {
    id: "modern",
    Cover,
    Pembuka,
    Mempelai,
    Acara,
    CeritaKami,
    Galeri,
    Rsvp,
    Ucapan,
    Amplop,
    Penutup,
  },
} as const;

export type ThemeId = keyof typeof themes;
