export type SubmittedWish = {
  guestName: string;
  attendance: "hadir" | "tidak_hadir";
  pax: number;
  message: string | null;
};

export type RsvpState = {
  status: "idle" | "success" | "error";
  errors: Record<string, string>;
  formError?: string;
  guestName?: string;
  pax?: number;
  attendance?: "hadir" | "tidak_hadir";
  submitted?: SubmittedWish;
};

export const initialRsvpState: RsvpState = {
  status: "idle",
  errors: {},
};
