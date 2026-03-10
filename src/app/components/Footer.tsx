import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { FiMail } from "@react-icons/all-files/fi/FiMail";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const logoAvifSrc = isDarkMode ? "/logo-white-128.avif" : "/logo-128.avif";
  const logoAvifSrcSet = isDarkMode
    ? "/logo-white-128.avif 128w, /logo-white.avif 1024w"
    : "/logo-128.avif 128w, /logo.avif 1024w";
  const logoWebpSrc = isDarkMode ? "/logo-white-128.webp" : "/logo-128.webp";
  const logoWebpSrcSet = isDarkMode
    ? "/logo-white-128.webp 128w, /logo-white.webp 1024w"
    : "/logo-128.webp 128w, /logo.webp 1024w";
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer className="bg-[#f2f2f2] dark:bg-[#2a2a2a] transition-colors duration-300 py-6 lg:py-4">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <button onClick={scrollToTop} aria-label={t("header.aria.scrollTop")}>
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

          {/* Copyright */}
          <div className="text-center max-w-2xl">
            <p className="font-['EB_Garamond',serif] text-[14px] md:text-[16px] text-[#2c3e50] dark:text-[#d0d0d0]">
              {t("footer.copyright", { year: currentYear })}
            </p>
            <details id="privacy-info" className="mt-2 text-left">
              <summary className="cursor-pointer list-none font-['EB_Garamond',serif] text-[14px] md:text-[16px] text-[#2c3e50] dark:text-[#d0d0d0] underline underline-offset-4 hover:text-[#d89b5c] dark:hover:text-[#d89b5c] transition-colors text-center">
                {t("footer.privacy")}
              </summary>
              <div className="mt-3 rounded-[14px] border border-[#d0d0d0] dark:border-[#555] bg-white/70 dark:bg-[#232323] px-4 py-3">
                <p className="font-['EB_Garamond',serif] text-[14px] md:text-[15px] leading-relaxed text-[#2c3e50] dark:text-[#d0d0d0]">
                  {t("footer.privacySummary")}
                </p>
                <p className="mt-2 font-['EB_Garamond',serif] text-[13px] md:text-[14px] leading-relaxed text-[#2c3e50] dark:text-[#d0d0d0]">
                  {t("footer.privacyRights")}
                </p>
              </div>
            </details>
          </div>

          {/* Social Icons & Language */}
          <div className="flex items-center gap-4 lg:gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[30px] h-[30px] flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
              aria-label={t("header.aria.instagram")}
            >
              <FaInstagram className="w-5 h-5 text-[#2c3e50] dark:text-[#f2f2f2]" aria-hidden />
            </a>
            <a
              href="mailto:villacocokozino@gmail.com"
              className="w-[30px] h-[30px] flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
              aria-label={t("header.aria.email")}
            >
              <FiMail className="w-5 h-5 text-[#2c3e50] dark:text-[#f2f2f2]" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}