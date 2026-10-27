import { CalendarIcon } from "@/components/icons";
import { CountdownBox } from "@/components/ui/CountdownBox";
import { EventCard, type EventView } from "@/components/ui/EventCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  dateLabel: string;
  events: EventView[];
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  calendarHref?: string;
};

export function Acara({ dateLabel, events, countdown, calendarHref }: Props) {
  return (
    <section id="acara" className="px-6 pt-14 pb-20">
      <SectionHeading supporting={dateLabel}>Acara</SectionHeading>

      <div className="mt-6">
        <CountdownBox values={countdown} />
      </div>

      <div className="mt-6 flex flex-col gap-3.5">
        {events.map((event) => (
          <EventCard key={`${event.name}-${event.start}`} event={event} />
        ))}
      </div>

      <PrimaryButton
        href={calendarHref}
        icon={<CalendarIcon size={18} />}
        fullWidth
        className="mt-5"
      >
        Simpan ke kalender
      </PrimaryButton>
    </section>
  );
}
