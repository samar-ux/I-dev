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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0a1628] via-[#0d1b33] to-[#0a1628] overflow-hidden">
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Radial gradient pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
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
            className="w-18 h-18 bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer border-2 border-white/20 backdrop-blur-sm relative overflow-hidden group"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 25px rgba(10, 22, 40, 0.6)",
                "0 0 50px rgba(10, 22, 40, 0.9)",
                "0 0 25px rgba(10, 22, 40, 0.6)",
              ],
            }}
            transition={{
              boxShadow: { duration: 3, repeat: Infinity },
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            {/* Inner glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>

            {/* Icon with enhanced styling */}
            <Languages className="w-9 h-9 text-white relative z-10 drop-shadow-lg" />

            {/* Pulsing ring */}
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
                    className="w-14 h-14 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 backdrop-blur-md rounded-full flex items-center justify-center hover:from-teal-400/40 hover:to-cyan-400/40 transition-all duration-500 cursor-pointer border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl relative overflow-hidden group"
                    initial={{ x: 50, opacity: 0, scale: 0 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 50, opacity: 0, scale: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                    {/* Inner glow */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>

                    <span className="text-xl relative z-10 drop-shadow-md">{lang.flag}</span>

                    {/* Pulsing effect */}
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

      {/* Main Content */}
      <div className="h-full flex items-center justify-center relative">
        {/* Background Stars (NO MOVEMENT) */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className={`absolute ${Math.random() > 0.7 ? "w-1.5 h-1.5" : "w-1 h-1"} ${Math.random() > 0.5 ? "bg-cyan-300" : "bg-white"} rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: "blur(0.5px)",
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Light Particles (NO MOVEMENT) */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-cyan-400/40 rounded-full blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Enhanced Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-6 h-6 border-2 border-cyan-400/60 rounded-full shadow-lg shadow-cyan-400/30"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-40 right-32 w-8 h-8 border-2 border-blue-400/60 shadow-lg shadow-blue-400/30"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.3, 1],
            borderRadius: ['25%', '50%', '25%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-32 left-40 w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-xl shadow-cyan-400/50"
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/4 w-4 h-4 border-2 border-teal-400/60"
          animate={{
            rotate: [45, 225, 45],
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-cyan-300/50 rounded-full blur-sm"
          animate={{
            y: [0, -25, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 4,
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
              className="absolute top-1/2 left-0 w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Globe className="h-3 w-3 text-teal-900" />
            </motion.div>
          </motion.div>

          {/* Enhanced Main Text with better animations */}
          <div className="relative mb-6 flex items-center justify-center min-h-[160px] md:min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentText}
                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.9,
                  filter: "blur(10px)"
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)"
                }}
                exit={{
                  opacity: 0,
                  y: -50,
                  scale: 1.1,
                  filter: "blur(10px)"
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-white bg-clip-text text-transparent leading-tight"
                style={{
                  textShadow: '0 0 40px rgba(6, 182, 212, 0.3)',
                }}
              >
                {texts[currentText]}
              </motion.h1>
            </AnimatePresence>

            {/* Text glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-transparent blur-3xl -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="text-lg md:text-2xl font-light bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent mb-8 max-w-3xl mx-auto leading-relaxed"
            style={{
              textShadow: '0 0 30px rgba(34, 211, 238, 0.2)',
            }}
          >
            {t("welcome_subtitle")}
          </motion.p>

          {/* Technology Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white mb-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 bg-white/15 backdrop-blur-md rounded-lg py-2 px-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
              🔗 {t("blockchain_tech")}
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/15 backdrop-blur-md rounded-lg py-2 px-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
              🌐 {t("web3_tech")}
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/15 backdrop-blur-md rounded-lg py-2 px-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
              ⚡ {t("icp_protocol")}
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/15 backdrop-blur-md rounded-lg py-2 px-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
              🚚 {t("smart_logistics")}
            </div>
          </motion.div>

          {/* Progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center gap-3 mb-6"
          >
            {texts.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentText === index
                  ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                  : "bg-gray-500/50"
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
            className="relative bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 backdrop-blur-lg border-2 border-white/30 hover:border-white/60 text-white px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:scale-105 overflow-hidden group"
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
