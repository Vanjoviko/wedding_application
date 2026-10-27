import type { EventView } from "@/components/ui/EventCard";
import type { PersonView } from "@/components/ui/PersonBlock";

export const demoGroom: PersonView = {
  nickname: "Raka",
  fullName: "Raka Pradipta Wibowo, S.T.",
  childOrder: "pertama",
  father: "Bapak Haryo Wibowo",
  mother: "Ibu Sri Lestari",
  instagram: "raka.pradipta",
  photo: "/demo/groom.webp",
  focalX: 0.5,
  focalY: 0.4,
};

export const demoBride: PersonView = {
  nickname: "Sekar",
  fullName: "Sekar Ayu Kinanti, S.Ds.",
  childOrder: "kedua",
  father: "Bapak Bambang Kuncoro",
  mother: "Ibu Ratna Dewi",
  instagram: "sekar.kinanti",
  photo: "/demo/bride.webp",
  focalX: 0.5,
  focalY: 0.4,
};

export const demoEvents: EventView[] = [
  {
    name: "Akad nikah",
    date: "2027-05-15",
    start: "08.00",
    end: "10.00",
    tz: "WIB",
    venue: "Pendopo Ndalem Sekar",
    address: "Jl. Contoh No. 12, Sleman, Yogyakarta",
    mapsUrl: "https://maps.google.com/?q=Pendopo+Ndalem+Sekar+Yogyakarta",
  },
  {
    name: "Resepsi",
    date: "2027-05-15",
    start: "11.00",
    end: "14.00",
    tz: "WIB",
    venue: "Pendopo Ndalem Sekar",
    address: "Jl. Contoh No. 12, Sleman, Yogyakarta",
    mapsUrl: "https://maps.google.com/?q=Pendopo+Ndalem+Sekar+Yogyakarta",
  },
];

export const demoOpening = {
  quote: "Witing tresna jalaran saka kulina.",
  source: "Cinta tumbuh karena terbiasa bersama.",
  invitation:
    "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberi doa restu di hari pernikahan kami.",
};

export const demoCountdown = {
  days: 203,
  hours: 8,
  minutes: 45,
  seconds: 12,
};

export const demoCover = {
  couple: "Raka & Sekar",
  dateLabel: "Sabtu, 15 Mei 2027",
  guestName: "Bapak Hendra Gunawan & Keluarga",
  photo: "/demo/cover.webp",
  focalX: 0.45,
  focalY: 0.55,
};
