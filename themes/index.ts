import { Acara } from "@/themes/modern/Acara";
import { Cover } from "@/themes/modern/Cover";
import { Mempelai } from "@/themes/modern/Mempelai";
import { Pembuka } from "@/themes/modern/Pembuka";

export const themes = {
  modern: {
    id: "modern",
    Cover,
    Pembuka,
    Mempelai,
    Acara,
  },
} as const;

export type ThemeId = keyof typeof themes;
