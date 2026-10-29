import type { Timezone } from "@/lib/schema";

export const TZ_OFFSET_HOURS: Record<Timezone, number> = {
  WIB: 7,
  WITA: 8,
  WIT: 9,
};

export const TZ_IANA: Record<Timezone, string> = {
  WIB: "Asia/Jakarta",
  WITA: "Asia/Makassar",
  WIT: "Asia/Jayapura",
};

type EventTime = { date: string; start: string; end: string | null; tz: Timezone };

function splitDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year: year!, month: month!, day: day! };
}

function splitTime(time: string) {
  const [hour, minute] = time.split(".").map(Number);
  return { hour: hour!, minute: minute! };
}

/** Waktu dinding (WIB/WITA/WIT) diubah ke instan UTC. Indonesia tanpa DST. */
export function eventStartUtc(event: EventTime) {
  const { year, month, day } = splitDate(event.date);
  const { hour, minute } = splitTime(event.start);
  return new Date(
    Date.UTC(year, month - 1, day, hour, minute) - TZ_OFFSET_HOURS[event.tz] * 3_600_000,
  );
}

export function eventEndUtc(event: EventTime) {
  const start = eventStartUtc(event).getTime();
  if (!event.end) return new Date(start + 2 * 3_600_000);
  const { year, month, day } = splitDate(event.date);
  const { hour, minute } = splitTime(event.end);
  return new Date(
    Date.UTC(year, month - 1, day, hour, minute) - TZ_OFFSET_HOURS[event.tz] * 3_600_000,
  );
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "2027-05-15" → "Sabtu, 15 Mei 2027". */
export function formatDateId(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return dateFormatter.format(new Date(Date.UTC(year!, month! - 1, day!)));
}

export function formatTimeRange(event: EventTime) {
  const range = event.end
    ? `${event.start} sampai ${event.end}`
    : `${event.start} sampai selesai`;
  return `${range} ${event.tz}`;
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

export function countdownParts(target: Date, now = new Date()): Countdown {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    finished: false,
  };
}

const relativeFormatter = new Intl.RelativeTimeFormat("id-ID", {
  numeric: "auto",
});

/** "3 jam lalu" untuk daftar ucapan. */
export function relativeTimeId(iso: string, now = new Date()) {
  const diffSeconds = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
  const abs = Math.abs(diffSeconds);

  if (abs < 60) return "baru saja";
  if (abs < 3_600) {
    return relativeFormatter.format(Math.round(diffSeconds / 60), "minute");
  }
  if (abs < 86_400) {
    return relativeFormatter.format(Math.round(diffSeconds / 3_600), "hour");
  }
  if (abs < 2_592_000) {
    return relativeFormatter.format(Math.round(diffSeconds / 86_400), "day");
  }
  return relativeFormatter.format(Math.round(diffSeconds / 2_592_000), "month");
}

function icsEscape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function icsStamp(date: Date) {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function icsLocal(date: Date, tz: Timezone) {
  const shifted = new Date(date.getTime() + TZ_OFFSET_HOURS[tz] * 3_600_000);
  return shifted.toISOString().replace(/[-:]/g, "").split(".")[0]!;
}

type CalendarEvent = EventTime & { name: string; venue: string; address: string };

export function buildIcs(options: {
  uidBase: string;
  title: string;
  events: CalendarEvent[];
}) {
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Undangan Digital//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  options.events.forEach((event, index) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${options.uidBase}-${index}@undangan-digital`,
      `DTSTAMP:${icsStamp(now)}`,
      `DTSTART;TZID=${TZ_IANA[event.tz]}:${icsLocal(eventStartUtc(event), event.tz)}`,
      `DTEND;TZID=${TZ_IANA[event.tz]}:${icsLocal(eventEndUtc(event), event.tz)}`,
      `SUMMARY:${icsEscape(`${options.title} — ${event.name}`)}`,
      `LOCATION:${icsEscape(`${event.venue}, ${event.address}`)}`,
      `DESCRIPTION:${icsEscape(`Undangan ${options.title}`)}`,
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

export function googleCalendarUrl(options: { title: string; events: CalendarEvent[] }) {
  const first = options.events[0];
  if (!first) return null;

  const start = eventStartUtc(first);
  const end = eventEndUtc(first);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${options.title} — ${first.name}`,
    dates: `${icsStamp(start).replace("Z", "")}Z/${icsStamp(end).replace("Z", "")}Z`,
    location: `${first.venue}, ${first.address}`,
    details: `Undangan ${options.title}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
