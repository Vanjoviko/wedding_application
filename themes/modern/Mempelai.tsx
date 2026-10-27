import { PersonBlock, type PersonView } from "@/components/ui/PersonBlock";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  groom: PersonView;
  bride: PersonView;
};

export function Mempelai({ groom, bride }: Props) {
  return (
    <section id="mempelai" className="px-6 pt-16 pb-20">
      <SectionHeading>Mempelai</SectionHeading>

      <div className="flex flex-col items-center text-center">
        <PersonBlock
          person={groom}
          label="Mempelai pria"
          relation="Putra"
          photoLabel="Foto mempelai pria"
        />

        <p
          aria-hidden
          className="mt-10 font-serif text-[44px] leading-none text-accent italic"
        >
          &amp;
        </p>

        <PersonBlock
          person={bride}
          label="Mempelai wanita"
          relation="Putri"
          photoLabel="Foto mempelai wanita"
          photoClassName="mt-10"
        />
      </div>
    </section>
  );
}
