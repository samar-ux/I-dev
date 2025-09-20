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
  User,
  LogOut,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { Badge } from "./ui/badge";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import LanguageSwitcher from "./LanguageSwitcher";
import idevLogo from "../assets/3.jpg";
import "../App.css";

const Layout = ({ children, currentView, onViewChange, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const { t } = useTranslation();

  const navigationItems = [
    { id: "home", label: t("home"), icon: Home, color: "bg-blue-500" },
    {
      id: "store",
      label: t("store_dashboard"),
      icon: Store,
      color: "bg-green-500",
    },
    {
      id: "driver",
      label: t("driver_dashboard"),
      icon: Truck,
      color: "bg-orange-500",
    },
    {
      id: "tracking",
      label: t("track_shipment"),
      icon: Package,
      color: "bg-purple-500",
    },
    {
      id: "returns",
      label: t("returns_management"),
      icon: RotateCcw,
      color: "bg-red-500",
    },
    {
      id: "coordination",
      label: t("shipping_coordination"),
      icon: Globe,
      color: "bg-cyan-500",
    },
    {
      id: "admin",
      label: t("admin_dashboard"),
      icon: BarChart3,
      color: "bg-indigo-500",
    },
    {
      id: "profile",
      label: t("profile"),
      icon: UserCircle,
      color: "bg-pink-500",
    },
    {
      id: "settings",
      label: t("settings"),
      icon: Settings,
      color: "bg-gray-500",
    },
  ];

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (itemId) => {
    onViewChange(itemId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen starry-bg">
      {/* Header */}
      <header className="glass-card border-b border-primary/20 sticky top-0 z-40 backdrop-blur-md">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 md:gap-4">
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "icon"}
                onClick={toggleSidebar}
                className="lg:hidden text-primary hover:bg-primary/10 focus-visible:focus-visible"
                aria-label="فتح القائمة"
              >
                {sidebarOpen ? (
                  <X className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                ) : (
                  <Menu className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                )}
              </Button>

              <div className="flex items-center gap-2 md:gap-3">
                <img
                  src={idevLogo}
                  alt="IDEV Logo"
                  className={`rounded-full idev-logo ${
                    isMobile ? "w-8 h-8" : "w-12 h-12"
                  }`}
                />
                <div className="arabic-text">
                  <h1
                    className={`font-bold gradient-text ${
                      isMobile ? "text-lg" : "text-xl"
                    }`}
                  >
                    IDEV
                  </h1>
                  <p
                    className={`text-muted-foreground ${
                      isMobile ? "text-xs" : "text-sm"
                    }`}
                  >
                    منصة الشحن والتوصيل
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.id)}
                    className={`arabic-text transition-all duration-200 focus-visible:focus-visible ${
                      currentView === item.id
                        ? "btn-primary text-primary-foreground shadow-lg"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4 ml-2" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* User Info and Status */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* User Info */}
              {user && (
                <div className="hidden md:flex items-center gap-2 ml-2">
                  <div className="text-right arabic-text">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.userType}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </div>
              )}
              
              {/* Status Badge */}
              <Badge
                variant="outline"
                className="text-primary border-primary/50"
              >
                متصل
              </Badge>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline mr-1">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          sidebar-responsive glass-card border-l border-primary/20 lg:border-l-0 lg:border-r z-30
          ${isMobile ? "fixed inset-y-0 right-0 w-72" : "lg:static lg:w-64"}
          ${sidebarOpen || !isMobile ? "open" : ""}
          ${isMobile && !sidebarOpen ? "lg:translate-x-0" : ""}
        `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-primary/20 lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={idevLogo}
                  alt="IDEV Logo"
                  className="w-8 h-8 rounded-full idev-logo"
                />
                <div className="arabic-text">
                  <h2 className="font-bold gradient-text text-lg">IDEV</h2>
                  <p className="text-xs text-muted-foreground">منصة الشحن</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="text-primary hover:bg-primary/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-2 overflow-y-auto flex-1">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full justify-start arabic-text transition-all duration-200 
                    animate-fade-in-up focus-visible:focus-visible
                    ${
                      isActive
                        ? "btn-primary text-primary-foreground shadow-lg scale-105"
                        : "text-foreground hover:bg-primary/10 hover:text-primary hover:translate-x-1"
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-2 h-2 rounded-full ml-3 ${item.color}`} />
                  <Icon className="h-4 w-4 ml-2" />
                  <span className="flex-1 text-right">{item.label}</span>
                  {isActive && <ChevronLeft className="h-4 w-4 opacity-70" />}
                </Button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-primary/20">
            <div className="glass-card p-3 text-center">
              <p className="text-xs text-muted-foreground arabic-text">
                الإصدار 2.0.0
              </p>
              <p className="text-xs text-primary arabic-text">
                جميع الحقوق محفوظة © IDEV
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
