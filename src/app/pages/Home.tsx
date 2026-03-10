import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
const AboutContent = lazy(() => import("../features/about/AboutContent"));
const ContactForm = lazy(() => import("../features/contact/ContactForm"));
const GalleryGrid = lazy(() => import("../features/gallery/GalleryGrid"));

// Import all images
import { imgHero, imgHeroSrcSet } from "../../assets";


export default function Home() {
  const { t } = useTranslation();
  const highFetchPriority = { fetchpriority: "high" } as Record<string, string>;
  const lowFetchPriority = { fetchpriority: "low" } as Record<string, string>;
  const [showAbout, setShowAbout] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const aboutRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

    updateIsDesktop();
    mediaQuery.addEventListener("change", updateIsDesktop);

    return () => mediaQuery.removeEventListener("change", updateIsDesktop);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.target === aboutRef.current) {
            setShowAbout(true);
          }

          if (entry.target === galleryRef.current) {
            setShowGallery(true);
          }

          if (entry.target === contactRef.current) {
            setShowContact(true);
          }

          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -15% 0px",
        threshold: 0.1,
      }
    );

    const refs = [aboutRef.current, galleryRef.current, contactRef.current];
    refs.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* HOME SECTION */}
      <section id="home" className="relative overflow-hidden lg:min-h-screen">
        {/* Background Image - Desktop Only */}
        <div className="hidden lg:block absolute inset-0 z-0">
          <img
            src={imgHero}
            srcSet={imgHeroSrcSet}
            sizes="(min-width: 1024px) 100vw, 0px"
            alt={t("home.hero.imageAlt")}
            className="w-full h-full object-cover"
            width={4000}
            height={3000}
            loading={isDesktop ? "eager" : "lazy"}
            {...(isDesktop ? highFetchPriority : lowFetchPriority)}
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="grid lg:grid-cols-[1fr_3fr] min-h-[calc(100vh-5rem)] lg:min-h-screen bg-[#f2f2f2] dark:bg-[#1a1a1a]">
          {/* Left Content */}
          <div className="bg-[#f2f2f2] lg:bg-black/30 lg:backdrop-blur-sm dark:bg-[#1a1a1a] px-6 md:px-12 lg:px-16 py-12 lg:py-20 flex flex-col justify-center order-2 lg:order-1 relative z-10">
            <div className="max-w-xl">
              <h1 className="font-sans lg:font-['Tenor_Sans',sans-serif] text-[46px] md:text-[56px] lg:text-[60px] text-[#2c3e50] dark:text-[#f2f2f2] lg:text-white mb-8 leading-tight">
                VILLA COCO
              </h1>

              <p className="font-serif lg:font-['EB_Garamond',serif] text-[20px] md:text-[28px] lg:text-[35px] text-[#586a68] dark:text-[#d0d0d0] lg:text-white/90 mb-10 leading-relaxed">
                {t("home.hero.subtitle")}
              </p>

              <div>
                <button
                  onClick={scrollToContact}
                  className="bg-[#2c3e50] text-[#f5f5f5] px-8 py-3 rounded-[20px] font-['Tenor_Sans',sans-serif] text-[16px] transition-transform hover:scale-105 active:scale-95"
                >
                  {t("home.hero.contactButton")}
                </button>
              </div>
            </div>
          </div>

          {/* Right Image - Mobile/Tablet Only */}
          <div className="relative h-[50vh] lg:hidden order-1 overflow-hidden bg-black -mb-px">
            <img
              src={imgHero}
              srcSet={imgHeroSrcSet}
              sizes="(min-width: 1024px) 0px, 100vw"
              alt={t("home.hero.imageAlt")}
              className="block w-full h-full object-cover"
              width={4000}
              height={3000}
              loading={isDesktop ? "lazy" : "eager"}
              {...(isDesktop ? lowFetchPriority : highFetchPriority)}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        ref={aboutRef}
        className="bg-[#f2f2f2] dark:bg-[#1a1a1a] transition-colors duration-300"
      >
        {showAbout ? (
          <Suspense fallback={<div className="min-h-[12rem]" />}>
            <AboutContent />
          </Suspense>
        ) : (
          <div className="min-h-[12rem]" aria-hidden="true" />
        )}
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" ref={galleryRef}>
        {showGallery ? (
          <Suspense fallback={<div className="min-h-[16rem]" />}>
            <GalleryGrid />
          </Suspense>
        ) : (
          <div className="min-h-[16rem]" aria-hidden="true" />
        )}
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" ref={contactRef}>
        {showContact ? (
          <Suspense fallback={<div className="min-h-[10rem]" />}>
            <ContactForm />
          </Suspense>
        ) : (
          <div className="min-h-[10rem]" aria-hidden="true" />
        )}
      </section>

    </div>
  );
}