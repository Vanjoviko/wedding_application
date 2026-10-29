"use client";

import { useState } from "react";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

export type WishView = {
  id: string;
  guestName: string;
  attendance: "hadir" | "tidak_hadir";
  pax: number;
  message: string | null;
  timeLabel: string;
};

type Props = {
  slug: string;
  initial: WishView[];
  initialHasMore: boolean;
};

export function WishesList({ slug, initial, initialHasMore }: Props) {
  const [items, setItems] = useState(initial);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMore() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/ucapan?slug=${encodeURIComponent(slug)}&offset=${items.length}`,
      );
      if (!response.ok) throw new Error("gagal");
      const data = (await response.json()) as {
        items: WishView[];
        hasMore: boolean;
      };
      setItems((current) => [...current, ...data.items]);
      setHasMore(data.hasMore);
    } catch {
      setError("Ucapan belum bisa dimuat. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-body text-muted">
        Belum ada ucapan. Jadilah yang pertama.
      </p>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-line">
        {items.map((wish) => (
          <li key={wish.id} className="py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-serif text-fullname text-ink">{wish.guestName}</p>
              <span className="shrink-0 text-note text-muted">{wish.timeLabel}</span>
            </div>
            <p className="mt-0.5 text-note text-muted">
              {wish.attendance === "hadir"
                ? wish.pax > 1
                  ? `Hadir · ${wish.pax} orang`
                  : "Hadir"
                : "Tidak hadir"}
            </p>
            {wish.message ? (
              <p className="mt-2 text-body text-ink-soft">{wish.message}</p>
            ) : null}
          </li>
        ))}
      </ul>

      {error ? <p className="mt-3 text-note text-danger">{error}</p> : null}

      {hasMore ? (
        <SecondaryButton
          onClick={() => {
            if (!loading) void loadMore();
          }}
          disabled={loading}
          fullWidth
          className="mt-4"
        >
          {loading ? "Memuat…" : "Muat lebih banyak"}
        </SecondaryButton>
      ) : null}
    </div>
  );
}
