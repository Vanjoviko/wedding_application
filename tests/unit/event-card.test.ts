import { describe, expect, it } from "vitest";
import { formatTimeRange } from "@/lib/datetime";

describe("formatTimeRange", () => {
  it("menampilkan jam mulai dan selesai dengan zona waktu", () => {
    expect(
      formatTimeRange({
        date: "2027-05-15",
        start: "08.00",
        end: "10.00",
        tz: "WIB",
      }),
    ).toBe("08.00 sampai 10.00 WIB");
  });

  it("memakai 'sampai selesai' saat jam selesai kosong", () => {
    expect(
      formatTimeRange({
        date: "2027-05-15",
        start: "11.00",
        end: null,
        tz: "WITA",
      }),
    ).toBe("11.00 sampai selesai WITA");
  });
});
