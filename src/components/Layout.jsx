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
  Building,
} from "lucide-react";
import { Badge } from "./ui/badge";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import SocialMediaLinks from "./SocialMediaLinks";
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

  // دالة للحصول على أيقونة ولون نوع المستخدم
  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'store_owner':
        return { icon: Store, color: 'bg-green-500' };
      case 'customer':
        return { icon: UserCircle, color: 'bg-blue-500' };
      case 'company':
        return { icon: Building, color: 'bg-purple-500' };
      case 'driver':
        return { icon: Truck, color: 'bg-orange-500' };
      default:
        return { icon: User, color: 'bg-gray-500' };
    }
  };

  return (
    <div className="min-h-screen starry-bg">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-[#0b1426]/95 backdrop-blur-lg border-b border-[#6dd5ed]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Mobile Menu and Logo */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
                aria-label="فتح القائمة"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              {/* Logo and Brand */}
              <div className="flex items-center gap-3">
                <img
                  src={idevLogo}
                  alt="IDEV Logo"
                  className={`rounded-full idev-logo ${
                    isMobile ? "w-8 h-8" : "w-10 h-10"
                  }`}
                />
                <div className="arabic-text">
                  <h1 className="text-xl font-bold text-white tracking-tight">IDev</h1>
                  <p className="text-xs text-[#6dd5ed] font-medium">نظام إدارة الشحنات</p>
                </div>
              </div>
            </div>


            {/* Right Side - User Profile, Status and Actions */}
            <div className="flex items-center gap-3">
              {/* User Profile Icon */}
              {user && (() => {
                const userTypeInfo = getUserTypeIcon(user.userType);
                const UserIcon = userTypeInfo.icon;
                return (
                  <div className="relative group">
                    <div className={`w-10 h-10 ${userTypeInfo.color} rounded-full flex items-center justify-center border-2 border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group-hover:scale-110 group-hover:shadow-lg`}>
                      <UserIcon className="w-5 h-5 text-white group-hover:rotateY-180 transition-transform duration-600" />
                  </div>
                    {/* تأثير الهالة */}
                    <div className={`absolute inset-0 ${userTypeInfo.color} rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`}></div>
                    {/* تأثير النبض */}
                    <div className={`absolute inset-0 ${userTypeInfo.color} rounded-full opacity-0 group-hover:opacity-30 animate-ping`}></div>
                  </div>
                );
              })()}
              
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <Badge
                variant="outline"
                  className="text-green-400 border-green-400/50 bg-green-400/10 font-medium"
              >
                متصل
              </Badge>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
                  title="الإعدادات"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-all duration-200"
                title="تسجيل الخروج"
              >
                  <LogOut className="h-4 w-4" />
              </Button>
              </div>
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
            <div className="glass-card p-3 text-center space-y-3">
              {/* Social Media Links */}
              <div className="flex justify-center">
                <SocialMediaLinks 
                  size="sm" 
                  variant="outlined"
                  useDirectLinks={true}
                />
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground arabic-text">
                  الإصدار 2.0.0
                </p>
                <p className="text-xs text-primary arabic-text">
                  جميع الحقوق محفوظة © IDEV
                </p>
              </div>
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
