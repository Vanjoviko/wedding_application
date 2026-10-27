import { MapPinIcon } from "@/components/icons";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

export type EventView = {
  name: string;
  date: string;
  start: string;
  end: string | null;
  tz: "WIB" | "WITA" | "WIT";
  venue: string;
  address: string;
  mapsUrl?: string;
};

export function formatTimeRange(event: EventView) {
  const range = event.end ? `${event.start} sampai ${event.end}` : event.start;
  return `${range} ${event.tz}`;
}

export function EventCard({ event }: { event: EventView }) {
  return (
    <article className="flex flex-col rounded-card border border-line bg-surface p-5">
      <h3 className="font-serif text-card font-medium text-ink italic">{event.name}</h3>
      <p className="mt-1.5 text-body text-ink-soft">{formatTimeRange(event)}</p>
      <p className="mt-2.5 text-body font-medium text-ink">{event.venue}</p>
      <p className="mt-0.5 text-meta text-muted">{event.address}</p>
      {event.mapsUrl ? (
        <SecondaryButton
          href={event.mapsUrl}
          icon={<MapPinIcon size={16} />}
          className="mt-4 self-start"
        >
          Buka di Google Maps
        </SecondaryButton>
      ) : null}
    </article>
  );
}
