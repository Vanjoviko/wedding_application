import { WishesList, type WishView } from "@/components/invitation/WishesList";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  slug: string;
  items: WishView[];
  hasMore: boolean;
};

export function Ucapan({ slug, items, hasMore }: Props) {
  return (
    <section id="ucapan" className="px-6 pt-16 pb-4">
      <SectionHeading>Ucapan dan doa</SectionHeading>
      <div className="mt-4">
        <WishesList slug={slug} initial={items} initialHasMore={hasMore} />
      </div>
    </section>
  );
}
