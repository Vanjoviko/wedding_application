import { CalendarIcon } from "@/components/icons";
import { Countdown } from "@/components/invitation/Countdown";
import { CountdownBox } from "@/components/ui/CountdownBox";
import { EventCard, type EventView } from "@/components/ui/EventCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Countdown as CountdownValue } from "@/lib/datetime";

type Props = {
  dateLabel: string;
  events: EventView[];
  countdownTargetIso?: string;
  initialCountdown?: CountdownValue;
  calendarHref?: string;
  googleCalendarHref?: string | null;
};

export function Acara({
  dateLabel,
  events,
  countdownTargetIso,
  initialCountdown,
  calendarHref,
  googleCalendarHref = null,
}: Props) {
  return (
    <section id="acara" className="px-6 pt-14 pb-20">
      <SectionHeading supporting={dateLabel}>Acara</SectionHeading>

      <div className="mt-6">
        {countdownTargetIso && initialCountdown ? (
          <Countdown targetIso={countdownTargetIso} initial={initialCountdown} />
        ) : (
          <CountdownBox
            values={
              initialCountdown ?? {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
              }
            }
          />
        )}
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

      {googleCalendarHref ? (
        <a
          href={googleCalendarHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-meta text-accent transition-colors hover:text-accent-hover focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
        >
          Buka di Google Calendar
        </a>
      ) : null}
    </section>
  );
}
