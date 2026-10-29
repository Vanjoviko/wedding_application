import type { Metadata } from "next";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { Acara } from "@/themes/modern/Acara";
import { Cover } from "@/themes/modern/Cover";
import { Mempelai } from "@/themes/modern/Mempelai";
import { Pembuka } from "@/themes/modern/Pembuka";
import {
  demoBride,
  demoCover,
  demoCountdown,
  demoEvents,
  demoGroom,
  demoOpening,
} from "@/themes/modern/demo";

export const metadata: Metadata = {
  title: "Pratinjau desain undangan",
  robots: { index: false, follow: false },
};

export default function ContohPage() {
  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <Cover
        couple={demoCover.couple}
        dateLabel={demoCover.dateLabel}
        guestName={demoCover.guestName}
        photo={demoCover.photo}
        focalX={demoCover.focalX}
        focalY={demoCover.focalY}
      />

      <Pembuka
        quote={demoOpening.quote}
        source={demoOpening.source}
        invitation={demoOpening.invitation}
      />

      <Mempelai groom={demoGroom} bride={demoBride} />

      <Acara
        dateLabel={demoCover.dateLabel}
        events={demoEvents}
        initialCountdown={demoCountdown}
      />

      <footer className="px-6 pb-16 text-center">
        <p className="text-note text-muted">
          Pratinjau desain. Galeri, RSVP, ucapan, amplop, dan penutup menyusul.
        </p>
      </footer>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-10 mx-auto flex w-full max-w-[430px] px-5">
        <div className="pointer-events-auto">
          <MusicToggle playing />
        </div>
      </div>
    </div>
  );
}
