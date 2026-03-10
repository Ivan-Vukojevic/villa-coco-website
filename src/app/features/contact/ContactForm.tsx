import { motion } from "motion/react";
import { useState } from "react";
import { imgContact, imgContactSrcSet } from "../../../assets";
import { useTranslation } from "react-i18next";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzbwdyl";

type ContactFormProps = {
  prioritizeImage?: boolean;
};

export default function ContactForm({ prioritizeImage = false }: ContactFormProps) {
  const { t } = useTranslation();
  const highFetchPriority = { fetchpriority: "high" } as Record<string, string>;
  const lowFetchPriority = { fetchpriority: "low" } as Record<string, string>;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"success" | "error" | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState(null);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send form");
      }

      setSubmitState("success");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch {
      setSubmitState("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrivacyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const privacyDetails = document.getElementById("privacy-info") as HTMLDetailsElement | null;
    if (privacyDetails) {
      privacyDetails.open = true;
      privacyDetails.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={imgContact}
            srcSet={imgContactSrcSet}
            sizes="(min-width: 1280px) 100vw, (min-width: 768px) 100vw, 100vw"
            alt={t("contact.backgroundAlt")}
            className="w-full h-full object-cover object-center"
            loading={prioritizeImage ? "eager" : "lazy"}
            {...(prioritizeImage ? highFetchPriority : lowFetchPriority)}
            decoding={prioritizeImage ? "sync" : "async"}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[calc(100vh-88px)] flex items-start lg:items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg">
            {/* Title */}
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="font-['Tenor_Sans',sans-serif] text-[32px] md:text-[38px] text-white text-center mb-12"
            >
              {t("contact.title")}
            </motion.h1>

            {/* Form */}
            <motion.form
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="bg-[#f2f2f2] rounded-[20px] p-8 md:p-10 shadow-2xl md:backdrop-blur-sm"
            >
              {/* Name Field */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <label
                  htmlFor="name"
                  className="block font-['EB_Garamond',serif] text-[16px] text-[#2c3e50] mb-2"
                >
                  {t("contact.form.nameLabel")}
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#fdfdfd] rounded-[20px] px-6 py-3 font-['EB_Garamond',serif] text-[16px] text-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#d89b5c] transition-all"
                  placeholder={t("contact.form.namePlaceholder")}
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6"
              >
                <label
                  htmlFor="email"
                  className="block font-['EB_Garamond',serif] text-[16px] text-[#3a3a3a] mb-2"
                >
                  {t("contact.form.emailLabel")}
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#fdfdfd] rounded-[20px] px-6 py-3 font-['EB_Garamond',serif] text-[16px] text-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#d89b5c] transition-all"
                  placeholder={t("contact.form.emailPlaceholder")}
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <label
                  htmlFor="message"
                  className="block font-['EB_Garamond',serif] text-[16px] text-[#2c3e50] mb-2"
                >
                  {t("contact.form.messageLabel")}
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  id="message"
                  name="message"
                  autoComplete="off"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-white rounded-[20px] px-6 py-4 font-['EB_Garamond',serif] text-[16px] text-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#d89b5c] transition-all resize-none"
                  placeholder={t("contact.form.messagePlaceholder")}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center"
              >
                <p className="mb-4 font-['EB_Garamond',serif] text-[14px] md:text-[15px] text-[#2c3e50]">
                  {t("contact.form.privacyNotice")} {" "}
                  <a
                    href="#privacy-info"
                    onClick={handlePrivacyClick}
                    className="underline underline-offset-4 hover:text-[#d89b5c] transition-colors"
                  >
                    {t("footer.privacy")}
                  </a>
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(44, 62, 80, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2c3e50] text-[#f5f5f5] px-12 py-3 rounded-[20px] font-['Tenor_Sans',sans-serif] text-[16px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      {t("contact.form.sending")}
                    </span>
                  ) : (
                    t("contact.form.send")
                  )}
                </motion.button>
                {submitState && (
                  <p className="mt-4 font-['EB_Garamond',serif] text-[15px] text-[#2c3e50]">
                    {submitState === "success" ? t("contact.toastSuccess") : t("contact.toastError")}
                  </p>
                )}
              </motion.div>
            </motion.form>

            {/* Contact Info */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 text-center"
            >
              <div className="bg-white/10 md:backdrop-blur-md rounded-[20px] p-6 text-white">
                <p className="font-['EB_Garamond',serif] text-[16px] mb-2">
                  {t("contact.directLabel")}
                </p>
                <a
                  href="mailto:villacocokozino@gmail.com"
                  className="font-['Tenor_Sans',sans-serif] text-[18px] hover:text-[#d89b5c] transition-colors"
                >
                  villacocokozino@gmail.com
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
  );
}
