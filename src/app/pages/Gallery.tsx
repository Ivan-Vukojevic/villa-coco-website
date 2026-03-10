import PageTransition from "../components/PageTransition";
import GalleryGrid from "../features/gallery/GalleryGrid";

export default function Gallery() {
  return (
    <PageTransition>
      <GalleryGrid />
    </PageTransition>
  );
}
