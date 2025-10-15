import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Home,
  Store,
  Truck,
  Package,
  Settings,
  Menu,
  X,
  RotateCcw,
  Globe,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  UserCircle,
  Building,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import idevLogo from "../assets/3.jpg";
import "../App.css";
import { motion } from "framer-motion";

// مكون الترجمة الجديد بدلاً من LanguageSelector
const LanguageSwitcher = () => {
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
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
    setShowLanguageOptions(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowLanguageOptions(!showLanguageOptions)}
        className="w-10 h-10 bg-gradient-to-br from-cyan-500/80 to-blue-500/80 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm relative overflow-hidden group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-5 h-5 text-white relative z-10" />
        <motion.div
          className="absolute inset-0 rounded-full bg-white/10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.button>

      {showLanguageOptions && (
        <motion.div
          className="absolute top-full right-0 mt-2 w-32 bg-[#0a1628]/95 backdrop-blur-md rounded-lg shadow-lg p-2 z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md flex items-center gap-2"
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// افتراضي إذا لم يكن SocialMediaLinks معرفًا
const SocialMediaLinks = ({ size }) => <div>{/* Placeholder for SocialMediaLinks */}</div>;

const Layout = ({ children, currentView, onViewChange, user, onLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // الافتراضي مغلق على الجوال، مفتوح على الحاسوب
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t } = useTranslation();

  const navigationItems = [
    { id: "home", label: t("home"), icon: Home, color: "text-blue-400" },
    { id: "store", label: t("store_dashboard"), icon: Store, color: "text-green-400" },
    { id: "driver", label: t("driver_dashboard"), icon: Truck, color: "text-orange-400" },
    { id: "tracking", label: t("track_shipment"), icon: Package, color: "text-cyan-400" },
    { id: "returns", label: t("returns_management"), icon: RotateCcw, color: "text-red-400" },
    { id: "coordination", label: t("shipping_coordination"), icon: Globe, color: "text-purple-400" },
    { id: "admin", label: t("admin_dashboard"), icon: BarChart3, color: "text-teal-400" },
    { id: "settings", label: t("settings"), icon: Settings, color: "text-gray-400" },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      if (!isMobileDevice && !isSidebarExpanded) {
        setIsSidebarExpanded(false); // افتراضي مفتوح على الحاسوب
      } // افتراضي مغلق على الجوال
    };

    window.addEventListener("resize", checkScreenSize);
    checkScreenSize(); // التحقق عند التحميل الأولي
    return () => window.removeEventListener("resize", checkScreenSize); // إزالة المستمع
  }, [isSidebarExpanded]);

  const handleNavigation = (viewId) => {
    onViewChange(viewId);
    if (isMobile) {
      setIsSidebarExpanded(false); // إغلاق القائمة على الجوال بعد الاختيار
    }
  };

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case "store_owner":
        return { icon: Store, color: "bg-green-500" };
      case "customer":
        return { icon: UserCircle, color: "bg-blue-500" };
      case "company":
        return { icon: Building, color: "bg-teal-500" };
      case "driver":
        return { icon: Truck, color: "bg-orange-500" };
      default:
        return { icon: UserCircle, color: "bg-gray-500" };
    }
  };

  const UserIconComponent = user ? getUserTypeIcon(user.userType).icon : UserCircle;
  const userIconColor = user ? getUserTypeIcon(user.userType).color : "bg-gray-500";

  return (
    <div className="flex min-h-screen bg-[#060e1b] text-white starry-bg">
      {/* Sidebar */}
      <aside
        className={`
          flex flex-col transition-all duration-300 ease-in-out z-40
          ${isMobile ? "fixed top-0 right-0 h-full bg-[#0a1628]/95 backdrop-blur-lg border-l border-cyan-500/20" : "sticky top-0 h-screen bg-[#0a1628] border-l border-cyan-500/10"}
          ${isSidebarExpanded ? "w-64 opacity-100" : isMobile ? "w-0 opacity-0" : "w-18 opacity-100"}
        `}
        onTransitionEnd={() => {
          if (!isSidebarExpanded && isMobile) {
            setIsSidebarExpanded(false); // تأكيد الإغلاق الكامل
          }
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-cyan-500/10 h-14 md:h-16">
          {isSidebarExpanded && (
            <div className="flex items-center gap-2 md:gap-3">
              <img src={idevLogo} alt="IDEV Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
              <span className="font-bold text-lg md:text-xl">IDEV</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            {isMobile ? <X /> : isSidebarExpanded ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 md:p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center p-2 md:p-3 rounded-md transition-colors duration-200 ${isActive ? "bg-cyan-500/10 text-cyan-300" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                title={!isSidebarExpanded ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 md:h-6 md:w-6 ${item.color}`} />
                {isSidebarExpanded && <span className="mr-3 md:mr-4 text-xs md:text-sm font-medium">{item.label}</span>}
                {isSidebarExpanded && isActive && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-auto"></div>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 md:p-4 border-t border-cyan-500/10 mt-auto">
          {isSidebarExpanded && <SocialMediaLinks size="sm" />}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isSidebarExpanded && (
        <div
          onClick={() => setIsSidebarExpanded(false)}
          className="fixed inset-0 bg-black/60 z-30 transition-opacity duration-300"
          onTransitionEnd={() => {
            if (!isSidebarExpanded) document.body.style.overflow = "auto"; // استعادة التمرير
          }}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Header for main content */}
        <header className="sticky top-0 z-20 flex items-center justify-between h-14 md:h-16 px-4 md:px-6 bg-[#060e1b]/80 backdrop-blur-md border-b border-cyan-500/10">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarExpanded(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu />
            </Button>
          )}
          <div className="flex-1"></div>
          <div className="flex items-center gap-2 md:gap-4">
            <Badge
              variant="outline"
              className="text-green-400 border-green-400/50 bg-green-400/10 font-medium text-xs md:text-sm"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1 md:mr-2"></div>
              {t("online_status")}
            </Badge>
            <LanguageSwitcher /> {/* استخدام الزر الجديد هنا */}
            <div
              className={`p-1.5 md:p-2 rounded-full cursor-pointer ${userIconColor}`}
              onClick={() => handleNavigation("profile")}
            >
              <UserIconComponent className="w-5 h-5 md:w-6 h-6 text-white" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
