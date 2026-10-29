export type RsvpState = {
  status: "idle" | "success" | "error";
  errors: Record<string, string>;
  formError?: string;
  guestName?: string;
  pax?: number;
  attendance?: "hadir" | "tidak_hadir";
};

export const initialRsvpState: RsvpState = {
  status: "idle",
  errors: {},
};
