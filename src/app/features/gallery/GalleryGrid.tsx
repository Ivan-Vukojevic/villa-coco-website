import { motion, AnimatePresence } from "motion/react";
import { useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft } from "@react-icons/all-files/fi/FiChevronLeft";
import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import PageTransition from "../../components/PageTransition";
import ImageModal from "./ImageModal";
import { galleryImages } from "./galleryImages";
import { useTranslation } from "react-i18next";
type GalleryImage = {
  key: string;
  thumbnailSrc: string;
  thumbnailSrcSet?: string;
  displaySrc: string;
  displaySrcSet?: string;
  fullSrc: string;
  fullSrcSet?: string;
  alt: string;
  title: string;
  description: string;
};

export default function Gallery() {
  const { t } = useTranslation();
  const [images] = useState<GalleryImage[]>(galleryImages as GalleryImage[]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loadedThumbnails, setLoadedThumbnails] = useState<Record<number, boolean>>({});
  const galleryTopRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const thumbnailsRef = useRef<HTMLElement | null>(null);
  const previewCount = 8;

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const thumbnailsInView = useInView(thumbnailsRef, { once: true, amount: 0.2 });
  const hasImages = images.length > 0;
  const translatedImages = useMemo(
    () =>
      images.map((image) => ({
        ...image,
        alt: t(`gallery.images.${image.key}.alt`, { defaultValue: image.alt }),
        title: t(`gallery.images.${image.key}.title`, { defaultValue: image.title }),
        description: t(`gallery.images.${image.key}.description`, { defaultValue: image.description }),
      })),
    [images, t]
  );
  const hasMoreThanPreview = translatedImages.length > previewCount;
  const visibleImageEntries = useMemo(
    () =>
      (showAllImages ? translatedImages : translatedImages.slice(0, previewCount)).map((image, index) => ({
        image,
        index,
      })),
    [translatedImages, showAllImages]
  );
  const currentImage = useMemo(
    () => (hasImages ? translatedImages[currentSlide] : null),
    [hasImages, translatedImages, currentSlide]
  );
  const indicatorIndices = useMemo(() => {
    if (isDesktop || translatedImages.length <= 5) {
      return translatedImages.map((_, imageIndex) => imageIndex);
    }

    const maxVisibleIndicators = 5;
    const halfWindow = Math.floor(maxVisibleIndicators / 2);
    const lastIndex = translatedImages.length - 1;

    let startIndex = Math.max(0, currentSlide - halfWindow);
    let endIndex = Math.min(lastIndex, startIndex + maxVisibleIndicators - 1);

    if (endIndex - startIndex + 1 < maxVisibleIndicators) {
      startIndex = Math.max(0, endIndex - maxVisibleIndicators + 1);
    }

    return Array.from(
      { length: endIndex - startIndex + 1 },
      (_, offset) => startIndex + offset
    );
  }, [isDesktop, translatedImages, currentSlide]);

  useEffect(() => {
    setHeroLoaded(false);
  }, [currentSlide]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

    updateIsDesktop();
    mediaQuery.addEventListener("change", updateIsDesktop);

    return () => mediaQuery.removeEventListener("change", updateIsDesktop);
  }, []);

  const nextSlide = () => {
    if (!hasImages) return;
    setCurrentSlide((prev) => (prev + 1) % translatedImages.length);
  };

  const prevSlide = () => {
    if (!hasImages) return;
    setCurrentSlide((prev) => (prev - 1 + translatedImages.length) % translatedImages.length);
  };

  const openLightbox = (index: number) => {
    if (!hasImages) return;
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const handleToggleImages = () => {
    if (showAllImages) {
      setShowAllImages(false);
      requestAnimationFrame(() => {
        galleryTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    setShowAllImages(true);
  };

  const nextImage = () => {
    if (!hasImages) return;
    setSelectedImage((prev) => (prev !== null ? (prev + 1) % translatedImages.length : 0));
  };

  const prevImage = () => {
    if (!hasImages) return;
    setSelectedImage((prev) =>
      prev !== null ? (prev - 1 + translatedImages.length) % translatedImages.length : 0
    );
  };

  const modalImage = selectedImage !== null ? translatedImages[selectedImage] : null;

  return (
    <PageTransition>
      <div ref={galleryTopRef} className="min-h-screen bg-[#f2f2f2] dark:bg-[#1a1a1a]">
        {/* Header */}
        <section className="py-12 lg:py-16 text-center">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-['Tenor_Sans',sans-serif] text-[32px] md:text-[38px] text-[#2c3e50] dark:text-[#f2f2f2]"
          >
            {t("gallery.title")}
          </motion.h1>
        </section>

        {/* Hero Carousel */}
        <section ref={heroRef} className="relative mb-12 lg:mb-16 px-4 lg:px-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={heroInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/3] md:aspect-[16/10] cursor-pointer"
                onClick={() => openLightbox(currentSlide)}
              >
                {!heroLoaded && (
                  <div className="absolute inset-0 bg-[#e9e2dc] animate-pulse" />
                )}
                {currentImage && (
                  <img
                    src={currentImage.displaySrc}
                    srcSet={currentImage.displaySrcSet}
                    sizes="(min-width: 1280px) 1152px, (min-width: 1024px) calc(100vw - 6rem), (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2rem)"
                    alt={currentImage.alt}
                    className="w-full h-full object-cover"
                    onLoad={() => setHeroLoaded(true)}
                    loading="eager"
                    decoding="async"
                  />
                )}
                {/* Hero Caption */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-4 sm:px-6 pb-10 sm:pb-12 pt-16 pointer-events-none">
                  <h3 className="text-white text-sm sm:text-base font-['Tenor_Sans',sans-serif] drop-shadow-lg">
                    {currentImage?.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm font-['Tenor_Sans',sans-serif] drop-shadow-md mt-0.5">
                    {currentImage?.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.button
              whileHover={isDesktop ? { scale: 1.1, x: -5 } : undefined}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 md:hover:bg-white text-[#2c3e50] p-2 sm:p-3 rounded-full shadow-lg transition-colors opacity-100 md:opacity-80 md:hover:opacity-100"
            >
              <FiChevronLeft size={24} className="sm:w-7 sm:h-7" aria-hidden="true" />
            </motion.button>

            <motion.button
              whileHover={isDesktop ? { scale: 1.1, x: 5 } : undefined}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 md:hover:bg-white text-[#2c3e50] p-2 sm:p-3 rounded-full shadow-lg transition-colors opacity-100 md:opacity-80 md:hover:opacity-100"
            >
              <FiChevronRight size={24} className="sm:w-7 sm:h-7" aria-hidden="true" />
            </motion.button>

            {/* Slide Indicators */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-2">
              {isDesktop ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  {indicatorIndices.map((index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={currentSlide === index ? "true" : undefined}
                      className={`h-2 w-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                        currentSlide === index
                          ? "bg-white"
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-full bg-black/35 px-3 py-1 text-[12px] text-white font-['Tenor_Sans',sans-serif]">
                  {currentSlide + 1} / {translatedImages.length}
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Thumbnail Grid */}
        <section
          ref={thumbnailsRef}
          className="bg-[#e4cfc6] py-12 lg:py-16 px-4 lg:px-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {visibleImageEntries.map(({ image, index }) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0, y: 30 }}
                  animate={thumbnailsInView ? { scale: 1, opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{ scale: 1.05, y: -10, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg cursor-pointer group"
                >
                  {!loadedThumbnails[index] && (
                    <div className="absolute inset-0 bg-[#f2e6df] animate-pulse" />
                  )}
                  <img
                    src={image.thumbnailSrc}
                    srcSet={image.thumbnailSrcSet}
                    sizes="(min-width: 1280px) 260px, (min-width: 1024px) 24vw, (min-width: 768px) 31vw, 46vw"
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    onLoad={() =>
                      setLoadedThumbnails((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                  />
                  {/* Caption overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 pb-2.5 pt-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xs sm:text-[13px] font-['Tenor_Sans',sans-serif] leading-snug drop-shadow-md">
                      {image.title}
                    </h3>
                    <p className="text-white/75 text-[10px] sm:text-[11px] font-['Tenor_Sans',sans-serif] leading-snug drop-shadow-sm mt-0.5">
                      {image.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>

            {hasMoreThanPreview && (
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleToggleImages}
                  className="bg-[#2c3e50] text-[#f5f5f5] px-8 py-3 rounded-[20px] font-['Tenor_Sans',sans-serif] text-[15px] transition-colors hover:bg-[#1f2d3a]"
                >
                  {showAllImages
                    ? t("gallery.showLess")
                    : t("gallery.showAll", { count: translatedImages.length - previewCount })}
                </motion.button>
              </div>
            )}
          </div>
        </section>

        <ImageModal
          isOpen={selectedImage !== null && modalImage !== null}
          src={modalImage?.fullSrc ?? ""}
          srcSet={modalImage?.fullSrcSet}
          sizes="(min-width: 1280px) 1200px, 92vw"
          alt={modalImage?.alt ?? ""}
          title={modalImage?.title}
          description={modalImage?.description}
          index={selectedImage ?? 0}
          total={translatedImages.length}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      </div>
    </PageTransition>
  );
}
