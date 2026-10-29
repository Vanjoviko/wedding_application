"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";

export type GalleryPhoto = {
  url: string;
  focalX: number;
  focalY: number;
};

type Props = {
  photos: GalleryPhoto[];
  altPrefix: string;
};

export function Gallery({ photos, altPrefix }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;

    document.body.style.overflow = "hidden";
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: track.clientWidth * openIndex });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") scrollBy(1);
      if (event.key === "ArrowLeft") scrollBy(-1);
    }

    function scrollBy(direction: number) {
      const element = trackRef.current;
      if (!element) return;
      const next = Math.min(
        photos.length - 1,
        Math.max(0, Math.round(element.scrollLeft / element.clientWidth) + direction),
      );
      element.scrollTo({ left: element.clientWidth * next, behavior: "smooth" });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex, photos.length, close]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        {photos.map((photo, index) => (
          <button
            key={photo.url}
            type="button"
            onClick={() => {
              setCurrent(index);
              setOpenIndex(index);
            }}
            aria-label={`Buka ${altPrefix} ${index + 1}`}
            className="relative aspect-square overflow-hidden rounded-photo bg-[image:var(--photo-empty)] focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            <Image
              src={photo.url}
              alt={`${altPrefix} ${index + 1}`}
              fill
              sizes="(max-width: 430px) 45vw, 200px"
              className="object-cover"
              style={{
                objectPosition: `${Math.round(photo.focalX * 100)}% ${Math.round(photo.focalY * 100)}%`,
              }}
            />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto"
          className="fixed inset-0 z-50 bg-bg"
        >
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
            <span className="text-meta text-muted tabular-nums">
              {current + 1}/{photos.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Tutup galeri"
              className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div
            ref={trackRef}
            onScroll={(event) => {
              const element = event.currentTarget;
              const index = Math.round(element.scrollLeft / element.clientWidth);
              setCurrent(Math.min(photos.length - 1, Math.max(0, index)));
            }}
            className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          >
            {photos.map((photo, index) => (
              <div
                key={photo.url}
                className="flex h-full w-full shrink-0 snap-center items-center justify-center p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={`${altPrefix} ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
