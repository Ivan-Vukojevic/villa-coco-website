import { FiMenu } from "@react-icons/all-files/fi/FiMenu";
import { FiX } from "@react-icons/all-files/fi/FiX";
import { FiSun } from "@react-icons/all-files/fi/FiSun";
import { FiMoon } from "@react-icons/all-files/fi/FiMoon";
import { useEffect, useState, type ChangeEvent } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useTranslation } from "react-i18next";
import { ensureLanguageResources, type SupportedLanguage } from "../../i18n";

const navItems = ["home", "about", "gallery", "contact"] as const;

const supportedLanguages: SupportedLanguage[] = ["en", "hr", "de", "cs", "pl"];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language ?? "en").slice(0, 2);
  const logoAvifSrc = isDarkMode ? "/logo-white-128.avif" : "/logo-128.avif";
  const logoAvifSrcSet = isDarkMode
    ? "/logo-white-128.avif 128w, /logo-white.avif 1024w"
    : "/logo-128.avif 128w, /logo.avif 1024w";
  const logoWebpSrc = isDarkMode ? "/logo-white-128.webp" : "/logo-128.webp";
  const logoWebpSrcSet = isDarkMode
    ? "/logo-white-128.webp 128w, /logo-white.webp 1024w"
    : "/logo-128.webp 128w, /logo.webp 1024w";

  useEffect(() => {
    // Mobile uses a collapsed nav, so skip section tracking to keep first load lighter.
    if (window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    const sectionElements = navItems
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element): element is HTMLElement => element !== null);

    if (sectionElements.length === 0) {
      return;
    }

    let frameRequested = false;

    const getHeaderHeight = () => {
      const headerElement = document.querySelector("header");
      return headerElement instanceof HTMLElement ? headerElement.offsetHeight : 80;
    };

    const computeActiveSection = () => {
      frameRequested = false;
      const scrollPosition = window.scrollY + getHeaderHeight() + 60;
      const currentSection = sectionElements.reduce((activeId, section) => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= scrollPosition) {
          return section.id;
        }
        return activeId;
      }, sectionElements[0].id);

      setActiveSection((previousSection) =>
        previousSection === currentSection ? previousSection : currentSection,
      );
    };

    const requestActiveSectionUpdate = () => {
      if (frameRequested) {
        return;
      }

      frameRequested = true;
      requestAnimationFrame(computeActiveSection);
    };

    const handleResize = () => requestActiveSectionUpdate();

    computeActiveSection();
    window.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", requestActiveSectionUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Close menu first
    setMobileMenuOpen(false);
    
    // Small delay to let menu close, then scroll
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerElement = document.querySelector("header");
        const headerHeight = headerElement instanceof HTMLElement ? headerElement.offsetHeight : 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(elementPosition - headerHeight, 0);

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        setActiveSection(sectionId);
      }
    }, 100);
  };

  const changeLanguage = async (language: SupportedLanguage) => {
    if (language !== currentLanguage) {
      await ensureLanguageResources(language);
      await i18n.changeLanguage(language);
    }
  };

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    void changeLanguage(event.target.value as SupportedLanguage);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f2f2f2] dark:bg-[#2a2a2a] transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative flex items-center justify-between h-20 lg:h-[88px]">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex-shrink-0 cursor-pointer transition-transform active:scale-[0.98]"
            aria-label={t("header.aria.scrollTop")}
          >
            <picture>
              <source srcSet={logoAvifSrcSet} sizes="(min-width: 1024px) 70px, 64px" type="image/avif" />
              <source srcSet={logoWebpSrcSet} sizes="(min-width: 1024px) 70px, 64px" type="image/webp" />
              <img
                src={logoWebpSrc}
                width={128}
                height={128}
                sizes="(min-width: 1024px) 70px, 64px"
                alt="Villa Coco"
                className="w-16 h-16 lg:w-[70px] lg:h-[70px] rounded-[10px] object-cover transition-transform hover:scale-105"
              />
            </picture>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = activeSection === item;
              return (
                <button key={item} onClick={() => scrollToSection(item)} className="cursor-pointer">
                  <div
                    className={`px-5 py-2 rounded-[20px] transition-colors ${
                      isActive
                        ? "bg-[#d89b5c] text-[#f5f5f5]"
                        : "bg-[#f2f2f2] dark:bg-[#3a3a3a] text-[#2c3e50] dark:text-[#f2f2f2] hover:bg-[#e4e4e4] dark:hover:bg-[#4a4a4a]"
                    }`}
                  >
                    <span className="font-['Tenor_Sans',sans-serif] text-[16px]">
                      {t(`header.nav.${item}`)}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Desktop Social Icons & Language */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <label className="sr-only" htmlFor="desktop-language-select">
              {t("header.language.selector")}
            </label>
            <select
              id="desktop-language-select"
              value={currentLanguage}
              onChange={handleLanguageChange}
              aria-label={t("header.language.selector")}
              className="font-['Tenor_Sans',sans-serif] text-[11px] w-[64px] bg-[#f2f2f2] dark:bg-[#3a3a3a] text-[#2c3e50] dark:text-[#f2f2f2] border border-[#d0d0d0] dark:border-[#555] rounded-[10px] px-2 py-1 cursor-pointer transition-transform active:scale-[0.99] focus:outline-none"
            >
              {supportedLanguages.map((language) => (
                <option key={language} value={language}>
                  {t(`header.language.${language}`)}
                </option>
              ))}
            </select>
            <button
              onClick={toggleDarkMode}
              className="w-[24px] h-[24px] text-[#2c3e50] dark:text-[#d89b5c] transition-transform active:scale-90"
              aria-label={
                isDarkMode ? t("header.aria.switchToLight") : t("header.aria.switchToDark")
              }
            >
              {isDarkMode ? <FiMoon size={24} /> : <FiSun size={24} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-[30px] h-[30px] text-[#2c3e50] dark:text-[#f2f2f2] transition-transform active:scale-90"
            aria-label={mobileMenuOpen ? t("header.aria.closeMenu") : t("header.aria.openMenu")}
          >
            {mobileMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden overflow-hidden bg-[#f2f2f2] dark:bg-[#2a2a2a] border-t border-[#d0d0d0] dark:border-[#444] transition-colors">
            <nav className="mx-auto w-full max-w-md px-4 py-4 flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = activeSection === item;
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="w-full cursor-pointer"
                  >
                    <div
                      className={`px-5 py-3 rounded-[20px] text-center transition-colors ${
                        isActive
                          ? "bg-[#d89b5c] text-[#f5f5f5]"
                          : "bg-white dark:bg-[#3a3a3a] text-[#2c3e50] dark:text-[#f2f2f2]"
                      }`}
                    >
                      <span className="font-['Tenor_Sans',sans-serif] text-[16px]">
                        {t(`header.nav.${item}`)}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Mobile Controls */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <label className="sr-only" htmlFor="mobile-language-select">
                  {t("header.language.selector")}
                </label>
                <select
                  id="mobile-language-select"
                  value={currentLanguage}
                  onChange={handleLanguageChange}
                  aria-label={t("header.language.selector")}
                  className="font-['Tenor_Sans',sans-serif] text-[11px] w-[64px] bg-white dark:bg-[#3a3a3a] text-[#2c3e50] dark:text-[#f2f2f2] border border-[#d0d0d0] dark:border-[#555] rounded-[10px] px-2 py-1 cursor-pointer transition-transform active:scale-[0.99] focus:outline-none"
                >
                  {supportedLanguages.map((language) => (
                    <option key={language} value={language}>
                      {t(`header.language.${language}`)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleDarkMode}
                  className="w-[24px] h-[24px] text-[#2c3e50] cursor-pointer transition-transform active:scale-90"
                  aria-label={
                    isDarkMode ? t("header.aria.switchToLight") : t("header.aria.switchToDark")
                  }
                >
                  {isDarkMode ? <FiMoon size={24} /> : <FiSun size={24} />}
                </button>
              </div>
            </nav>
        </div>
      )}
    </header>
  );
}