import { InstagramIcon } from "@/components/icons";
import { PhotoFrame } from "@/components/ui/PhotoFrame";

export type PersonView = {
  nickname: string;
  fullName: string;
  childOrder: string;
  father: string;
  mother: string;
  instagram?: string;
  photo?: string;
  focalX?: number;
  focalY?: number;
};

type Props = {
  person: PersonView;
  label: string;
  relation: "Putra" | "Putri";
  photoLabel: string;
  photoClassName?: string;
};

export function PersonBlock({
  person,
  label,
  relation,
  photoLabel,
  photoClassName = "mt-9",
}: Props) {
  return (
    <>
      <PhotoFrame
        src={person.photo}
        alt={`Foto ${label.toLowerCase()} ${person.nickname}`}
        focalX={person.focalX}
        focalY={person.focalY}
        placeholderLabel={photoLabel}
        className={`${photoClassName} h-[428px] w-[342px] max-w-full`}
        sizes="342px"
      />
      <p className="mt-[22px] text-meta text-accent">{label}</p>
      <p className="mt-1 font-serif text-name font-medium text-ink italic">
        {person.nickname}
      </p>
      <p className="mt-1 font-serif text-fullname font-medium text-ink-soft">
        {person.fullName}
      </p>
      <p className="mt-1.5 max-w-[280px] text-meta text-muted">
        {relation} {person.childOrder} dari {person.father} dan {person.mother}
      </p>
      {person.instagram ? (
        <a
          href={`https://instagram.com/${person.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-meta text-accent transition-colors hover:text-accent-hover focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          <InstagramIcon size={15} />@{person.instagram}
        </a>
      ) : null}
    </>
  );
}
