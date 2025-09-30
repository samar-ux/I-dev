import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import StoreDashboard from "./components/StoreDashboard";
import DriverDashboard from "./components/DriverDashboard";
import CustomerTracking from "./components/CustomerTracking";
import WelcomeAnimation from "./components/WelcomeAnimation"; // Import the welcome component
import AuthPage from "./components/AuthPage"; // Import new auth page

import ReturnsManagement from "./components/ReturnsManagement";
import ShippingCoordination from "./components/ShippingCoordination";
import AdminDashboard from "./components/AdminDashboard";
import UserProfile from "./components/UserProfile";
import Settings from "./components/Settings";
import Web3Integration from "./components/Web3Integration";
import web3Service from "./services/web3Service";
import internetIdentityService from "./services/internetIdentityService";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isInitialized, setIsInitialized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true); // 👈 control welcome page
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 👈 authentication state
  const [user, setUser] = useState(null); // 👈 user data
  const [showProfile, setShowProfile] = useState(false); // 👈 control profile modal
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check if user has seen the welcome animation before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    const savedUser = localStorage.getItem("currentUser");
    
    // التحقق من تسجيل الدخول عبر Internet Identity
    const checkInternetIdentityAuth = async () => {
      try {
        const authStatus = await internetIdentityService.checkAuthenticationStatus();
        if (authStatus.authenticated) {
          // إنشاء بيانات مستخدم من Internet Identity
          const icpUser = {
            name: "مستخدم Internet Identity",
            email: authStatus.principal,
            userType: localStorage.getItem('user_type') || 'customer',
            verificationLevel: 'internet_identity',
            principal: authStatus.principal,
            authMethod: 'internet_identity'
          };
          
          setUser(icpUser);
          setIsAuthenticated(true);
          localStorage.setItem("currentUser", JSON.stringify(icpUser));
          return true;
        }
      } catch (error) {
        console.error('Error checking Internet Identity auth:', error);
      }
      return false;
    };
    
    // التحقق من المصادقة المحلية أولاً
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    } else {
      // التحقق من Internet Identity
      checkInternetIdentityAuth();
    }
    
    if (hasSeenWelcome === "true") {
      setShowWelcome(false);
      initializeApp();
    } else {
      // Show welcome animation for first-time users
      initializeApp();
    }
  }, []);

  // معالج لإعادة التوجيه عند refresh أو إعادة تحميل الصفحة
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // عند إعادة تحميل الصفحة أو إغلاق المتصفح، إعادة تعيين حالة الصفحة الافتتاحية
      localStorage.removeItem("hasSeenWelcome");
      
      // إضافة رسالة تأكيد عند محاولة إغلاق المتصفح
      const message = i18n.t('confirm_exit');
      event.returnValue = message;
      return message;
    };

    const handlePageShow = (event) => {
      // عند العودة للصفحة من cache أو إعادة تحميل
      if (event.persisted) {
        localStorage.removeItem("hasSeenWelcome");
        setShowWelcome(true);
      }
    };

    const handleVisibilityChange = () => {
      // عند العودة للصفحة بعد إخفائها أو إغلاق التبويب
      if (document.visibilityState === 'visible') {
        const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
        const savedUser = localStorage.getItem("currentUser");
        
        if (!hasSeenWelcome) {
          setShowWelcome(true);
          setIsAuthenticated(false);
          setUser(null);
        } else if (!savedUser) {
          // إذا لم يكن هناك مستخدم محفوظ، إعادة التوجيه للصفحة الافتتاحية
          setShowWelcome(true);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }

    // Set document direction based on language
    const updateDirection = () => {
      document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = i18n.language;
    };

    updateDirection();

    // Listen for language changes
    i18n.on("languageChanged", updateDirection);

    return () => {
      i18n.off("languageChanged", updateDirection);
    };
  }, [i18n]);

  const initializeApp = async () => {
    try {
      // Initialize Web3 services
      await web3Service.init();
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize app:", error);
      setIsInitialized(true); // Continue even if initialization fails
    }
  };

  const handleWelcomeComplete = (action) => {
    // Mark that user has seen the welcome animation
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
    // تمرير نوع الإجراء (تسجيل دخول أو إنشاء حساب) للصفحة التالية
    if (action) {
      localStorage.setItem("authAction", action);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowWelcome(false); // إخفاء صفحة الترحيب بعد تسجيل الدخول الناجح
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      // تسجيل الخروج من Internet Identity إذا كان المستخدم مسجل دخول عبره
      if (user && user.authMethod === 'internet_identity') {
        await internetIdentityService.logout();
      }
      
      // تنظيف البيانات المحلية
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("hasSeenWelcome");
      localStorage.removeItem("icp_authenticated");
      localStorage.removeItem("icp_principal");
      localStorage.removeItem("icp_login_time");
      localStorage.removeItem("icp_auth_data");
      localStorage.removeItem("user_type");
      
      setCurrentView("home");
      setShowWelcome(true); // إظهار الصفحة الافتتاحية
    } catch (error) {
      console.error('Error during logout:', error);
      // تنظيف البيانات المحلية حتى في حالة الخطأ
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("currentUser");
      setCurrentView("home");
      setShowWelcome(true);
    }
  };

  const handleViewChange = (viewId) => {
    if (viewId === "profile") {
      setShowProfile(true);
    } else {
      setCurrentView(viewId);
      setShowProfile(false);
    }
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    localStorage.removeItem("hasSeenWelcome");
  };

  const renderCurrentView = () => {
    if (!isInitialized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Initializing Web3 services...
            </p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case "home":
        return <HomePage onViewChange={setCurrentView} />;
      case "store":
        return <StoreDashboard />;
      case "driver":
        return <DriverDashboard />;
      case "tracking":
        return <CustomerTracking />;
      case "returns":
        return <ReturnsManagement />;
      case "coordination":
        return <ShippingCoordination />;
      case "admin":
        return <AdminDashboard />;
      case "web3":
        return <Web3Integration />;
      case "settings":
        return <Settings />;
      default:
        return <HomePage onViewChange={setCurrentView} />;
    }
  };

  // Show welcome animation first
  if (showWelcome) {
    return <WelcomeAnimation onComplete={handleWelcomeComplete} />;
  }

  // Show authentication page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} onBackToWelcome={handleBackToWelcome} />;
  }

  // Show main app after authentication
  return (
    <div className="App">
      <Layout 
        currentView={currentView} 
        onViewChange={handleViewChange}
        user={user}
        onLogout={handleLogout}
      >
        {renderCurrentView()}
      </Layout>
      
      {/* Profile Modal */}
      {showProfile && user && (
        <UserProfile 
          user={user}
          onClose={() => setShowProfile(false)}
          onEdit={() => {
            setShowProfile(false);
            setCurrentView("settings");
          }}
        />
      )}
    </div>
  );
}

export default App;
