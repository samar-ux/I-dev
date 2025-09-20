/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Rocket, Globe, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

const WelcomeAnimation = ({ onComplete }) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [showLanguageBalls, setShowLanguageBalls] = useState(false);
  const { i18n, t } = useTranslation();

  const texts = [
    t("welcome_title_1"),
    t("welcome_title_2"),
    t("welcome_title_3"),
  ];

  const languageOptions = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
    setShowLanguageBalls(false);
  };

  useEffect(() => {
    // تبديل بين الصورتين كل 2.5 ثانية باستمرار
    const interval = setInterval(() => {
      setShowLogo((prev) => !prev);
    }, 2500);

    // تبديل النصوص كل 3 ثوان باستمرار
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  if (!showWelcome) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] overflow-hidden">
      {/* Language Selection Ball - Top Right */}
      <div className="absolute top-6 right-6 z-60">
        {/* Main Language Ball */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.button
            onClick={() => setShowLanguageBalls(!showLanguageBalls)}
            className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(6, 182, 212, 0.5)",
                "0 0 40px rgba(6, 182, 212, 0.8)",
                "0 0 20px rgba(6, 182, 212, 0.5)",
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
            }}
          >
            <Languages className="w-8 h-8 text-white" />
          </motion.button>

          {/* Language Option Balls */}
          <AnimatePresence>
            {showLanguageBalls && (
              <motion.div
                className="absolute top-0 right-20 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {languageOptions.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20"
                    initial={{ x: 50, opacity: 0, scale: 0 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 50, opacity: 0, scale: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg">{lang.flag}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center relative">
        {/* Background Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 border-2 border-cyan-400 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-40 right-32 w-6 h-6 border-2 border-blue-400"
          animate={{
            rotate: [0, 45, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-32 left-40 w-3 h-3 bg-cyan-400 rounded-full"
          animate={{
            x: [0, 30, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Mr. Dev Character with circle */}
        <div className="text-center relative pt-16">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-12"
          >
            {/* Outer decorative circle */}
            <motion.div
              className="w-60 h-60 rounded-full border-2 border-cyan-400/30 absolute inset-0 m-auto"
              animate={{
                rotate: 360,
                y: [0, -6, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            />

            {/* Images Only */}
            <motion.div
              className="relative z-10 w-48 h-48 mx-auto"
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <AnimatePresence>
                <motion.img
                  key="mrdev"
                  initial={{ opacity: !showLogo ? 1 : 0 }}
                  animate={{ 
                    opacity: !showLogo ? 1 : 0,
                    rotateY: !showLogo ? 0 : 180,
                    boxShadow: [
                      "0 0 30px rgba(6, 182, 212, 0.5)",
                      "0 0 60px rgba(6, 182, 212, 0.8)",
                      "0 0 30px rgba(6, 182, 212, 0.5)",
                    ],
                  }}
                  transition={{
                    opacity: { duration: 0.4 },
                    rotateY: { duration: 0.8 },
                    boxShadow: { duration: 2, repeat: Infinity },
                  }}
                  src="https://unaaneys.manus.space/mr-dev.jpg"
                  alt="Mr. Dev"
                  className="absolute inset-0 w-full h-full rounded-full object-cover"
                />
                
                <motion.img
                  key="logo"
                  initial={{ opacity: showLogo ? 1 : 0 }}
                  animate={{ 
                    opacity: showLogo ? 1 : 0,
                    rotateY: showLogo ? 0 : -180,
                    boxShadow: [
                      "0 0 30px rgba(6, 182, 212, 0.5)",
                      "0 0 60px rgba(6, 182, 212, 0.8)",
                      "0 0 30px rgba(6, 182, 212, 0.5)",
                    ],
                  }}
                  transition={{
                    opacity: { duration: 0.4 },
                    rotateY: { duration: 0.8 },
                    boxShadow: { duration: 2, repeat: Infinity },
                  }}
                  src="/idev-logo.jpg"
                  alt="IDEV Logo"
                  className="absolute inset-0 w-full h-full rounded-full object-cover"
                  style={{ filter: "brightness(1.1) contrast(1.1)" }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Floating icons around Mr. Dev */}
            <motion.div
              className="absolute top-8 right-8 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Rocket className="h-4 w-4 text-cyan-900" />
            </motion.div>

            <motion.div
              className="absolute bottom-8 left-8 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center"
              animate={{
                x: [0, 15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 text-blue-900" />
            </motion.div>

            <motion.div
              className="absolute top-1/2 left-0 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Globe className="h-3 w-3 text-purple-900" />
            </motion.div>
          </motion.div>

          {/* Main Text */}
          <motion.h1
            key={currentText}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-4 leading-tight"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                {texts[currentText]}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-base bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent mb-3 max-w-2xl mx-auto leading-relaxed"
          >
            {t("welcome_subtitle")}
          </motion.p>

          {/* Technology Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-white/80 mb-4 max-w-xl mx-auto"
          >
            <div className="flex items-center justify-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg py-1 px-2">
              🔗 {t("blockchain_tech")}
            </div>
            <div className="flex items-center justify-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg py-1 px-2">
              🌐 {t("web3_tech")}
            </div>
            <div className="flex items-center justify-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg py-1 px-2">
              ⚡ {t("icp_protocol")}
            </div>
            <div className="flex items-center justify-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg py-1 px-2">
              🚚 {t("smart_logistics")}
            </div>
          </motion.div>

          {/* Progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center space-x-2 space-x-reverse mb-4"
          >
            {texts.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentText === index
                    ? "bg-cyan-400 scale-125"
                    : "bg-gray-600"
                }`}
                animate={{
                  scale: currentText === index ? 1.25 : 1,
                  backgroundColor:
                    currentText === index ? "#22d3ee" : "#4b5563",
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.div>

          {/* Start Journey Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            onClick={() => {
              setShowWelcome(false);
              onComplete();
            }}
            className="relative bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden group"
            data-testid="button-start-journey"
          >
            {/* Shiny effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="relative z-10">{t("start_journey")}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;