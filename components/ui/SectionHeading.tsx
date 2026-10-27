import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type Props = {
  children: ReactNode;
  supporting?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  children,
  supporting,
  className,
  as: Tag = "h2",
}: Props) {
  return (
    <div className={cx("flex flex-col items-center text-center", className)}>
      <Tag className="font-serif text-title font-medium text-ink italic">{children}</Tag>
      {supporting ? <p className="mt-2 text-body text-ink-soft">{supporting}</p> : null}
    </div>
  );
}
