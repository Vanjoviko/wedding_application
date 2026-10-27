import { describe, expect, it } from "vitest";
import { formatTimeRange } from "@/components/ui/EventCard";

describe("formatTimeRange", () => {
  it("menampilkan jam mulai dan selesai dengan zona waktu", () => {
    expect(
      formatTimeRange({
        name: "Akad nikah",
        date: "2027-05-15",
        start: "08.00",
        end: "10.00",
        tz: "WIB",
        venue: "Pendopo",
        address: "Jl. Contoh",
      }),
    ).toBe("08.00 sampai 10.00 WIB");
  });

  it("memakai 'sampai selesai' saat jam selesai kosong", () => {
    expect(
      formatTimeRange({
        name: "Resepsi",
        date: "2027-05-15",
        start: "11.00",
        end: null,
        tz: "WITA",
        venue: "Ballroom",
        address: "Jl. Contoh",
      }),
    ).toBe("11.00 WITA");
  });
});
