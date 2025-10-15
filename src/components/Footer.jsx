import React from "react";
import { useTranslation } from "react-i18next";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-8 glass-card rounded-xl border border-white/10 backdrop-blur-xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 animate-fade-in-up animation-delay-1200">
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t("app_name") || "IDEV Shipping"}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground arabic-text leading-relaxed">
              {t("footer_desc") ||
                "منصة شحن وتوصيل متطورة مع تكامل Web3 والبلوك تشين لتوفير خدمات لوجستية آمنة وسريعة."}
            </p>
            <div className="flex gap-2 md:gap-3">
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-fade-in-up animation-delay-1300"
              >
                <Facebook className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-fade-in-up animation-delay-1400"
              >
                <Twitter className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-500/20 hover:bg-pink-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-fade-in-up animation-delay-1500"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />
              </a>
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600/20 hover:bg-blue-600/30 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-fade-in-up animation-delay-1600"
              >
                <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-bold text-white arabic-text">
              {t("quick_links") || "روابط سريعة"}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
                >
                  {t("about_us") || "من نحن"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
                >
                  {t("our_services") || "خدماتنا"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
                >
                  {t("pricing") || "الأسعار"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
                >
                  {t("contact_us") || "اتصل بنا"}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-bold text-white arabic-text">
              {t("our_services") || "خدماتنا"}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
                >
                  {t("express_shipping") || "الشحن السريع"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
                >
                  {t("tracking_service") || "خدمة التتبع"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
                >
                  {t("returns_management") || "إدارة المرتجعات"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
                >
                  {t("business_solutions") || "حلول الأعمال"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-bold text-white arabic-text">
              {t("contact_us") || "تواصل معنا"}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  support@idev-shipping.com
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <span className="text-xs md:text-sm text-muted-foreground arabic-text">
                  +966 50 123 4567
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <span className="text-xs md:text-sm text-muted-foreground arabic-text">
                  {t("address") || "الرياض، المملكة العربية السعودية"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-right">
              {t("copyright") || "© 2025 IDEV Shipping. جميع الحقوق محفوظة."}
            </p>
            <div className="flex gap-3 md:gap-4">
              <a
                href="#"
                className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
              >
                {t("privacy_policy") || "سياسة الخصوصية"}
              </a>
              <a
                href="#"
                className="text-xs md:text-sm text-muted-foreground hover:text-cyan-400 transition-colors arabic-text"
              >
                {t("terms_conditions") || "الشروط والأحكام"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
