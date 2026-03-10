import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useReducedMotion } from "motion/react";
import { type ComponentType, useRef } from "react";
import { imgAbout, imgAboutSrcSet } from "../../../assets";
import { FaSwimmingPool } from "@react-icons/all-files/fa/FaSwimmingPool";
import { FaBath } from "@react-icons/all-files/fa/FaBath";
import { GiCookingPot } from "@react-icons/all-files/gi/GiCookingPot";
import { GiBed } from "@react-icons/all-files/gi/GiBed";
import { GiIsland } from "@react-icons/all-files/gi/GiIsland";
import { FiHome } from "@react-icons/all-files/fi/FiHome";
import { FiWifi } from "@react-icons/all-files/fi/FiWifi";
import { MdLocalParking } from "@react-icons/all-files/md/MdLocalParking";
import { useTranslation } from "react-i18next";

const amenities = [
  { icon: FaSwimmingPool, key: "privateHeatedPool" },
  { icon: GiCookingPot, key: "equippedKitchens" },
  { icon: FiHome, key: "separateApartments" },
  { icon: MdLocalParking, key: "privateParking" },
  { icon: FaBath, key: "elegantBathrooms" },
  { icon: GiCookingPot, key: "outdoorTerrace" },
  { icon: GiBed, key: "doubleBeds" },
  { icon: GiBed, key: "singleBeds" },
  { icon: GiIsland, key: "seaView" },
  { icon: FiWifi, key: "fastWifi" },
];

type AboutProps = {
  prioritizeImage?: boolean;
};

export default function About({ prioritizeImage = false }: AboutProps) {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const highFetchPriority = { fetchpriority: "high" } as Record<string, string>;
  const lowFetchPriority = { fetchpriority: "low" } as Record<string, string>;
  const isCroatian = (i18n.resolvedLanguage ?? i18n.language ?? "en").startsWith("hr");
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const amenitiesRef = useRef(null);

  const contentInView = useInView(contentRef, { once: true, amount: 0.3 });
  const imageInView = useInView(imageRef, { once: true, amount: 0.3 });
  const amenitiesInView = useInView(amenitiesRef, { once: true, amount: 0.2 });

  return (
      <div className="bg-[#f2f2f2] dark:bg-[#1a1a1a]">
        {/* Hero Section */}
        <section className="bg-[#f2f2f2] dark:bg-[#1a1a1a]" aria-labelledby="about-title">
          <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
            <div className="grid items-center lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 py-12 lg:py-20">
            {/* Left Content */}
            <div className="flex items-center">
              <motion.div
                ref={contentRef}
                initial={shouldReduceMotion ? false : { x: -50, opacity: 0 }}
                animate={contentInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
                className="w-full"
              >
                <h1 id="about-title" className="font-['Tenor_Sans',sans-serif] text-[32px] md:text-[38px] text-[#2c3e50] dark:text-[#f2f2f2] mb-3">
                  {t("about.title")}
                </h1>
                <p className="font-['EB_Garamond',serif] text-[20px] md:text-[24px] text-[#2c3e50] dark:text-[#e6e6e6] mb-8">
                  {t("about.subtitle")}
                </p>

                <div className="font-['EB_Garamond',serif] text-[18px] md:text-[22px] lg:text-[24px] text-[#2c3e50] dark:text-[#e6e6e6] text-left md:text-justify space-y-6 leading-relaxed tracking-wide max-w-[68ch]">
                  <motion.p
                    initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
                    animate={contentInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
                  >
                    {t("about.description.paragraph1")}
                  </motion.p>

                  <motion.p
                    initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
                    animate={contentInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.4 }}
                  >
                    {t("about.description.paragraph2")}
                  </motion.p>

                  <motion.p
                    initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
                    animate={contentInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.55 }}
                  >
                    {t("about.description.paragraph3")}
                  </motion.p>
                </div>
              </motion.div>
            </div>

            {/* Right Image */}
            <div className="flex items-center justify-center">
              <motion.div
                ref={imageRef}
                initial={shouldReduceMotion ? false : { x: 50, opacity: 0, scale: 0.95 }}
                animate={imageInView ? { x: 0, opacity: 1, scale: 1 } : {}}
                transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                className="w-full overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={imgAbout}
                  srcSet={imgAboutSrcSet}
                  sizes="(min-width: 1280px) 520px, (min-width: 1024px) 48vw, 92vw"
                  alt={t("about.imageAlt")}
                  className="w-full h-full object-cover"
                  loading={prioritizeImage ? "eager" : "lazy"}
                  {...(prioritizeImage ? highFetchPriority : lowFetchPriority)}
                  decoding={prioritizeImage ? "sync" : "async"}
                />
              </motion.div>
            </div>
          </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="bg-[#f2f2f2] dark:bg-[#1a1a1a] py-12 lg:py-20">
          <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
            <motion.h2
              ref={amenitiesRef}
              initial={shouldReduceMotion ? false : { y: 30, opacity: 0 }}
              animate={amenitiesInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
              className={`${
                isCroatian
                  ? "font-['EB_Garamond',serif] font-medium tracking-[0.01em]"
                  : "font-['Tenor_Sans',sans-serif]"
              } text-[28px] md:text-[32px] text-[#2c3e50] dark:text-[#f2f2f2] text-center mb-12`}
            >
              {t("about.amenitiesTitle")}
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              {amenities.map((amenity, index) => (
                <motion.div
                  key={amenity.key}
                  initial={shouldReduceMotion ? false : { scale: 0.9, opacity: 0, y: 16 }}
                  animate={amenitiesInView ? { scale: 1, opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.45,
                    delay: shouldReduceMotion ? 0 : 0.2 + index * 0.06,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -6 }}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <motion.div
                    whileHover={shouldReduceMotion ? undefined : { rotate: 8 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] mb-3 bg-white dark:bg-[#222] rounded-full p-2 shadow-md group-hover:shadow-xl transition-shadow flex items-center justify-center"
                  >
                    {(() => {
                      const Icon = amenity.icon as ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
                      return <Icon className="w-6 h-6 text-[#2c3e50] dark:text-[#f2f2f2]" aria-hidden />;
                    })()}
                  </motion.div>
                  <p className="font-['EB_Garamond',serif] text-[13px] md:text-[14px] text-[#2c3e50] dark:text-[#e6e6e6] leading-tight max-w-[100px]">
                    {t(`about.amenities.${amenity.key}`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
  );
}
