import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type Props = {
  children: ReactNode;
  icon?: ReactNode;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
};

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-accent px-[18px] " +
  "text-[14px] font-medium text-accent transition-colors hover:border-accent-hover " +
  "hover:text-accent-hover focus-visible:ring-2 focus-visible:ring-focus " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export function SecondaryButton({
  children,
  icon,
  href,
  type = "button",
  disabled,
  fullWidth,
  className,
}: Props) {
  const classes = cx(base, fullWidth && "w-full", className);
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
