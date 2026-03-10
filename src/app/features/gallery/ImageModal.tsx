import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { FiChevronLeft } from "@react-icons/all-files/fi/FiChevronLeft";
import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { FiX } from "@react-icons/all-files/fi/FiX";

type ImageModalProps = {
  isOpen: boolean;
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  title?: string;
  description?: string;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function ImageModal({
  isOpen,
  src,
  srcSet,
  sizes,
  alt,
  title,
  description,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

    updateIsDesktop();
    mediaQuery.addEventListener("change", updateIsDesktop);

    return () => mediaQuery.removeEventListener("change", updateIsDesktop);
  }, []);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    const threshold = 50;

    if (Math.abs(deltaX) >= threshold) {
      if (deltaX > 0) {
        onPrev();
      } else {
        onNext();
      }
    }

    touchStartXRef.current = null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <FiX size={32} />
          </motion.button>

          <motion.button
            whileHover={isDesktop ? { scale: 1.1, x: -5 } : undefined}
            whileTap={{ scale: 0.9 }}
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            className="absolute z-20 left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white p-2 sm:p-3 bg-white/10 md:bg-transparent md:hover:bg-white/10 rounded-full transition-colors opacity-100 md:opacity-70 md:hover:opacity-100"
          >
            <FiChevronLeft size={32} className="sm:w-9 sm:h-9" />
          </motion.button>

          <motion.button
            whileHover={isDesktop ? { scale: 1.1, x: 5 } : undefined}
            whileTap={{ scale: 0.9 }}
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className="absolute z-20 right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white p-2 sm:p-3 bg-white/10 md:bg-transparent md:hover:bg-white/10 rounded-full transition-colors opacity-100 md:opacity-70 md:hover:opacity-100"
          >
            <FiChevronRight size={32} className="sm:w-9 sm:h-9" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative z-10 max-w-5xl max-h-[90vh] w-full"
          >
            {!isLoaded && (
              <div className="absolute inset-0 bg-white/10 animate-pulse rounded-lg" />
            )}
            <img
              src={src}
              srcSet={srcSet}
              sizes={sizes}
              alt={alt}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg mx-auto"
              onLoad={() => setIsLoaded(true)}
              decoding="async"
            />
          </motion.div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white font-['Tenor_Sans',sans-serif] max-w-xl px-4">
            {title && (
              <h3 className="text-sm sm:text-base drop-shadow-lg">{title}</h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-white/75 drop-shadow-md mt-0.5">{description}</p>
            )}
            <span className="text-xs sm:text-sm text-white/50 mt-1 inline-block">
              {index + 1} / {total}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
