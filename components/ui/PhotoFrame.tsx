import Image from "next/image";
import { cx } from "@/lib/cx";
import { PhotoIcon } from "@/components/icons";

type Props = {
  src?: string;
  alt: string;
  focalX?: number;
  focalY?: number;
  priority?: boolean;
  sizes?: string;
  placeholderLabel?: string;
  className?: string;
  imageClassName?: string;
};

/**
 * Bingkai foto dengan titik fokus. `focalX`/`focalY` bernilai 0–1 dan dipetakan
 * ke `object-position`, sehingga wajah tidak terpotong pada rasio yang berbeda.
 */
export function PhotoFrame({
  src,
  alt,
  focalX = 0.5,
  focalY = 0.5,
  priority = false,
  sizes = "(max-width: 430px) 100vw, 430px",
  placeholderLabel,
  className,
  imageClassName,
}: Props) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-photo bg-[image:var(--photo-empty)]",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cx("object-cover", imageClassName)}
          style={{
            objectPosition: `${Math.round(focalX * 100)}% ${Math.round(focalY * 100)}%`,
          }}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 text-ink-soft/80">
          <PhotoIcon size={26} />
          {placeholderLabel ? <p className="text-meta">{placeholderLabel}</p> : null}
        </div>
      )}
    </div>
  );
}
