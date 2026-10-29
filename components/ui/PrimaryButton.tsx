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
  onClick?: () => void;
  className?: string;
  /** Penanda untuk tombol yang membuka undangan, dibaca lewat event delegation. */
  openInvitation?: boolean;
};

const base =
  "inline-flex h-[50px] items-center justify-center gap-2.5 rounded-full bg-accent px-7 " +
  "text-body font-medium text-on-accent transition-colors hover:bg-accent-hover " +
  "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg focus-visible:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export function PrimaryButton({
  children,
  icon,
  href,
  type = "button",
  disabled,
  fullWidth,
  onClick,
  className,
  openInvitation,
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
      <Link href={href} className={classes} data-open-invitation={openInvitation}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      onClick={onClick}
      data-open-invitation={openInvitation}
    >
      {content}
    </button>
  );
}
