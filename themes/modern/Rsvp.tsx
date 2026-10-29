import { RsvpForm } from "@/components/invitation/RsvpForm";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  slug: string;
  defaultName: string;
  showMessage: boolean;
};

export function Rsvp({ slug, defaultName, showMessage }: Props) {
  return (
    <section id="rsvp" className="px-6 pt-16 pb-4">
      <SectionHeading supporting="Konfirmasi kehadiran Anda">RSVP</SectionHeading>
      <div className="mt-6">
        <RsvpForm slug={slug} defaultName={defaultName} showMessage={showMessage} />
      </div>
    </section>
  );
}
