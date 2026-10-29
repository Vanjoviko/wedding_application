import { MusicIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

type Props = {
  playing?: boolean;
  className?: string;
  onClick?: () => void;
};

export function MusicToggle({ playing = true, className, onClick }: Props) {
  return (
    <button
      type="button"
      aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
      aria-pressed={playing}
      onClick={onClick}
      className={cx(
        "flex size-[46px] items-center justify-center rounded-full border border-line bg-surface text-accent",
        "transition-colors hover:border-accent/60 focus-visible:ring-2 focus-visible:ring-focus",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
        className,
      )}
    >
      <MusicIcon size={20} />
    </button>
  );
}
