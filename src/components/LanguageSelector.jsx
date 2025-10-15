import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const [showLanguageBalls, setShowLanguageBalls] = useState(false);
  const { i18n, t } = useTranslation();

  const languageOptions = [
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem("language", languageCode);
    document.documentElement.dir = languageCode === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = languageCode;
    setShowLanguageBalls(false);
  };

  return (
    <div className="absolute top-6 right-6 z-50">
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.button
          onClick={() => setShowLanguageBalls(!showLanguageBalls)}
          className="w-14 h-14 min-w-[56px] bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-white/20 backdrop-blur-md relative overflow-hidden group"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
          <Languages className="w-6 h-6 text-white relative z-10" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.button>

        <AnimatePresence>
          {showLanguageBalls && (
            <motion.div
              className="absolute top-0 right-16 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {languageOptions.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-14 h-14 min-w-[56px] bg-gradient-to-br from-teal-400/20 to-cyan-400/20 backdrop-blur-md rounded-full flex items-center justify-center hover:from-teal-400/40 hover:to-cyan-400/40 transition-all duration-300 cursor-pointer border-2 border-white/30 hover:border-white/50 shadow-md hover:shadow-lg relative overflow-hidden group"
                  initial={{ x: 50, opacity: 0, scale: 0 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: 50, opacity: 0, scale: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
                  <span className="text-xl relative z-10 drop-shadow-md">{lang.flag}</span>
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/20"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;
