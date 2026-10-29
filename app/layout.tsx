import type { Metadata } from "next";
import localFont from "next/font/local";
import { brandName, siteUrl } from "@/lib/site";
import "./globals.css";

// Font di-host sendiri supaya build tidak bergantung pada fonts.googleapis.com.
// Lisensi Cormorant Garamond dan Jost: SIL Open Font License 1.1.
const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [
    {
      path: "./fonts/cormorant-garamond-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/cormorant-garamond-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
});

const jost = localFont({
  variable: "--font-jost",
  display: "swap",
  src: [
    {
      path: "./fonts/jost-400-500.woff2",
      weight: "400 500",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brandName} — Undangan pernikahan digital`,
    template: `%s · ${brandName}`,
  },
  description:
    "Buat undangan pernikahan modern, bagikan link personal ke tiap tamu lewat WhatsApp, dan terima RSVP di satu tempat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-stone-950 font-sans text-stone-100">
        {children}
      </body>
    </html>
  );
}
