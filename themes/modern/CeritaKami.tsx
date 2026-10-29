import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  title: string;
  text: string;
};

export function CeritaKami({ title, text }: Props) {
  return (
    <section id="cerita" className="px-6 pt-16 pb-4">
      <SectionHeading>{title}</SectionHeading>
      <p className="mt-6 text-body leading-[1.75] whitespace-pre-line text-ink-soft">
        {text}
      </p>
    </section>
  );
}
