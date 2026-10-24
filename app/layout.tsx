import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { brandName, siteUrl } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
