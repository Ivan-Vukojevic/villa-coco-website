import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FiHome } from "@react-icons/all-files/fi/FiHome";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-[#f2f2f2] px-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <h1 className="font-['Tenor_Sans',sans-serif] text-[120px] md:text-[150px] text-[#d89b5c] leading-none">
            404
          </h1>
        </motion.div>

        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-['Tenor_Sans',sans-serif] text-[28px] md:text-[32px] text-[#2c3e50] mb-4"
        >
          {t("notFound.title")}
        </motion.h2>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-['EB_Garamond',serif] text-[18px] md:text-[20px] text-[#586a68] mb-8"
        >
          {t("notFound.description")}
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(44, 62, 80, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#2c3e50] text-[#f5f5f5] px-8 py-3 rounded-[20px] font-['Tenor_Sans',sans-serif] text-[16px] inline-flex items-center gap-2 cursor-pointer"
            >
              <FiHome size={20} />
              {t("notFound.backHome")}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
