import { Gallery, type GalleryPhoto } from "@/components/invitation/Gallery";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  photos: GalleryPhoto[];
  altPrefix: string;
};

export function Galeri({ photos, altPrefix }: Props) {
  return (
    <section id="galeri" className="px-6 pt-16 pb-4">
      <SectionHeading>Galeri</SectionHeading>
      <div className="mt-6">
        <Gallery photos={photos} altPrefix={altPrefix} />
      </div>
    </section>
  );
}
