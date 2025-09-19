import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, EyeOff, User, Mail, Lock, Phone, Building, Truck, Store, UserCircle,
  Star, Package, CheckCircle, Clock, Users, TrendingUp, Award, UserPlus, LogIn,
  Shield, Crown, Globe, Zap, Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import AdvancedRegistration from "./AdvancedRegistration";
import UserProfileCard from "./UserProfileCard";
import UserVerificationCard from "./UserVerificationCard";
import worldIdService from "../services/worldIdService";
import internetIdentityService from "../services/internetIdentityService";
import kycAmlService from "../services/kycAmlService";

const AuthPage = ({ onAuthSuccess, onBackToWelcome }) => {
  // تحديد نوع الصفحة بناءً على اختيار المستخدم في الصفحة الافتتاحية
  const [isLogin, setIsLogin] = useState(() => {
    const authAction = localStorage.getItem("authAction");
    localStorage.removeItem("authAction"); // مسح القيمة بعد الاستخدام
    return authAction === "login";
  });
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedVerificationLevel, setSelectedVerificationLevel] = useState("");
  const [showAdvancedRegistration, setShowAdvancedRegistration] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    worldId: null,
    internetIdentity: null,
    kycAml: null
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    businessName: "",
    businessType: ""
  });

  // أنواع المستخدمين
  const userTypes = [
    {
      id: "store_owner",
      title: "تاجر",
      description: "للتجارة المتقدمة",
      icon: Store,
      color: "bg-green-500 hover:bg-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      id: "customer",
      title: "عميل",
      description: "للأفراد والمسؤولين",
      icon: UserCircle,
      color: "bg-blue-500 hover:bg-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      id: "company",
      title: "مدير",
      description: "للمدراء والإدارة",
      icon: Building,
      color: "bg-purple-500 hover:bg-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    {
      id: "driver",
      title: "سائق",
      description: "لسائقي التوصيل",
      icon: Truck,
      color: "bg-orange-500 hover:bg-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      borderColor: "border-orange-200 dark:border-orange-800"
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // عملية تسجيل الدخول
      console.log("Login attempt for user type:", selectedUserType, "verification level:", selectedVerificationLevel);
      
      // محاكاة نجاح العملية
      setTimeout(() => {
        onAuthSuccess({
          userType: selectedUserType,
          verificationLevel: selectedVerificationLevel,
          name: formData.name || "المستخدم",
          email: formData.email,
          verificationStatus: verificationStatus
        });
      }, 1000);
    } else {
      // بدء عملية التسجيل حسب المستوى المختار
      if (selectedVerificationLevel === 'standard') {
        await handleStandardRegistration();
      } else if (selectedVerificationLevel === 'advanced') {
        await handleAdvancedRegistration();
      }
    }
  };

  const handleStandardRegistration = async () => {
    try {
      setIsVerifying(true);
      
      // تسجيل عادي بالبيانات الأساسية
      console.log("Standard registration for user type:", selectedUserType);
      
      // محاكاة عملية التسجيل العادي
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onAuthSuccess({
        userType: selectedUserType,
        verificationLevel: 'standard',
        name: formData.name || "المستخدم",
        email: formData.email,
        verificationStatus: {
          standard: 'verified',
          worldId: null,
          internetIdentity: null,
          kycAml: null
        }
      });
    } catch (error) {
      console.error('Standard registration failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAdvancedRegistration = async () => {
    try {
      setIsVerifying(true);
      
      console.log("Advanced registration for user type:", selectedUserType);
      
      // بدء عمليات التحقق المتقدمة
      const verificationResults = await performAdvancedVerification();
      
      if (verificationResults.success) {
        onAuthSuccess({
          userType: selectedUserType,
          verificationLevel: 'advanced',
          name: formData.name || "المستخدم",
          email: formData.email,
          verificationStatus: verificationResults
        });
      } else {
        console.error('Advanced verification failed:', verificationResults.error);
        // يمكن إظهار رسالة خطأ للمستخدم
      }
    } catch (error) {
      console.error('Advanced registration failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const performAdvancedVerification = async () => {
    try {
      const results = {
        worldId: null,
        internetIdentity: null,
        kycAml: null,
        success: false
      };

      // 1. تحقق World ID
      try {
        const worldIdResult = await worldIdService.verifyWithWorldId('register');
        results.worldId = worldIdResult;
        setVerificationStatus(prev => ({ ...prev, worldId: worldIdResult }));
      } catch (error) {
        console.error('World ID verification failed:', error);
        results.worldId = { success: false, error: error.message };
      }

      // 2. تحقق Internet Identity
      try {
        const icpResult = await internetIdentityService.authenticateWithInternetIdentity();
        results.internetIdentity = icpResult;
        setVerificationStatus(prev => ({ ...prev, internetIdentity: icpResult }));
      } catch (error) {
        console.error('Internet Identity verification failed:', error);
        results.internetIdentity = { success: false, error: error.message };
      }

      // 3. عمليات KYC/AML
      try {
        const kycAmlResult = await kycAmlService.performKycVerification({
          personalInfo: {
            firstName: formData.name?.split(' ')[0] || '',
            lastName: formData.name?.split(' ').slice(1).join(' ') || '',
            email: formData.email,
            phone: formData.phone
          }
        });
        results.kycAml = kycAmlResult;
        setVerificationStatus(prev => ({ ...prev, kycAml: kycAmlResult }));
      } catch (error) {
        console.error('KYC/AML verification failed:', error);
        results.kycAml = { success: false, error: error.message };
      }

      // تحديد نجاح العملية بناءً على النتائج
      const successCount = Object.values(results).filter(result => 
        result && typeof result === 'object' && result.success
      ).length;

      results.success = successCount >= 2; // نجاح العملية إذا تم التحقق من خدمتين على الأقل

      return results;
    } catch (error) {
      console.error('Advanced verification process failed:', error);
      return {
        success: false,
        error: error.message,
        worldId: null,
        internetIdentity: null,
        kycAml: null
      };
    }
  };

  const handleAdvancedRegistrationComplete = (userData) => {
    // إتمام عملية التسجيل
    console.log("Registration completed for user type:", selectedUserType);
    onAuthSuccess({
      userType: selectedUserType,
      name: userData?.personalInfo?.firstName + " " + userData?.personalInfo?.lastName || "المستخدم",
      email: userData?.personalInfo?.email || formData.email
    });
  };

  const handleBackFromAdvanced = () => {
    setShowAdvancedRegistration(false);
  };

  const isFormValid = () => {
    if (!selectedUserType) return false;
    if (!isLogin && !selectedVerificationLevel) return false;
    if (!formData.email || !formData.password) return false;
    if (!isLogin) {
      if (!formData.name || !formData.phone) return false;
      if (formData.password !== formData.confirmPassword) return false;
      if ((selectedUserType === 'store_owner' || selectedUserType === 'company') && !formData.businessName) return false;
    }
    return true;
  };

  // إظهار صفحة التسجيل المتقدم
  if (showAdvancedRegistration) {
    return (
      <AdvancedRegistration
        userType={selectedUserType}
        onBack={handleBackFromAdvanced}
        onComplete={handleAdvancedRegistrationComplete}
      />
    );
  }

  // إذا لم يتم اختيار نوع المستخدم، عرض صفحة اختيار الأيقونات
  if (!selectedUserType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-4xl"
        >
          {/* العنوان الرئيسي */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent mb-4">
              اختر حسابك
            </h1>
          </motion.div>

          {/* أيقونات أنواع المستخدمين - شبكة 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
            {userTypes.map((type, index) => {
              const Icon = type.icon;
              
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={`transition-all duration-300 hover:shadow-2xl ${type.color.split(' ')[0]}/20 hover:${type.color.split(' ')[0]}/30 backdrop-blur-lg border-2 ${type.borderColor} overflow-hidden group`}
                  >
                    <CardContent className="p-6 text-center relative">
                      {/* تأثير التدرج */}
                      <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${type.color.split(' ')[0]}`}></div>
                      
                      {/* الأيقونة */}
                      <motion.div
                        whileHover={{ rotateY: 360 }}
                        transition={{ duration: 0.6 }}
                        className="relative z-10"
                      >
                        <div className={`w-16 h-16 rounded-full ${type.color.split(' ')[0]} flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                      
                      {/* النص */}
                      <div className="relative z-10">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{type.title}</h3>
                        <p className="text-gray-600 text-xs mb-3">{type.description}</p>
                        
                        {/* أيقونات حساب جديد وتسجيل دخول */}
                        <div className="flex gap-3 justify-center">
                          <Button 
                            onClick={() => {
                              setSelectedUserType(type.id);
                              setIsLogin(false);
                            }}
                            size="sm"
                            className={`${type.color} text-white hover:shadow-lg transition-all duration-200 p-2 rounded-full`}
                            title="حساب جديد"
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => {
                              setSelectedUserType(type.id);
                              setIsLogin(true);
                            }}
                            variant="outline"
                            size="sm"
                            className={`border-2 ${type.color.split(' ')[0]} text-${type.color.split(' ')[0]} hover:${type.color} hover:text-white transition-all duration-200 p-2 rounded-full`}
                            title="تسجيل دخول"
                          >
                            <LogIn className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* تأثير الهالة */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>


          {/* زر العودة للصفحة الافتتاحية */}
          {onBackToWelcome && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-center mt-8"
            >
              <Button
                variant="outline"
                onClick={onBackToWelcome}
                className="relative bg-gradient-to-r from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30 backdrop-blur-lg border-2 border-rose-400/40 hover:border-rose-400/60 text-white hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">
                  الصفحة الرئيسية
                </span>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl"
      >
        <div className="max-w-lg mx-auto">
          {/* نموذج المصادقة */}
          <div>
            {(() => {
              const selectedType = userTypes.find(type => type.id === selectedUserType);
              const colorClass = selectedType?.color?.split(' ')[0] || 'bg-blue-500';
              const borderColorClass = selectedType?.borderColor || 'border-blue-200';
              
              return (
                <Card className={`${colorClass}/10 backdrop-blur-lg shadow-2xl border-2 ${borderColorClass} relative overflow-hidden group`}>
              {/* تأثير التدرج للخلفية */}
              <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${colorClass}`}></div>
              
              {/* أزرار العودة */}
              <div className="p-4 border-b border-white/20 flex justify-between items-center relative z-10">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedUserType("")}
                  className={`relative ${colorClass}/20 hover:${colorClass}/30 backdrop-blur-lg border ${borderColorClass} hover:border-opacity-80 text-white hover:text-white transition-all duration-300 transform hover:scale-105 overflow-hidden group rounded-lg`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-600"></div>
                  <span className="relative z-10">
                    اختر نوع آخر
                  </span>
                </Button>
                {onBackToWelcome && (
                  <Button
                    variant="ghost"
                    onClick={onBackToWelcome}
                    className="relative bg-rose-500/20 hover:bg-rose-500/30 backdrop-blur-lg border border-rose-400/40 hover:border-rose-400/60 text-white hover:text-white transition-all duration-300 transform hover:scale-105 overflow-hidden group rounded-lg text-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-650"></div>
                    <span className="relative z-10">
                      الرئيسية
                    </span>
                  </Button>
                )}
              </div>

              <CardHeader className="text-center pb-6 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {/* أيقونة نوع المستخدم */}
                  <div className={`w-20 h-20 rounded-full ${selectedType?.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    {(() => {
                      const IconComponent = selectedType?.icon;
                      return IconComponent ? <IconComponent className="w-10 h-10 text-white" /> : null;
                    })()}
                  </div>
                  
                  <CardTitle className="text-3xl font-bold text-white mb-2">
                    {isLogin ? "تسجيل الدخول الآمن" : "إنشاء حساب محمي"}
                  </CardTitle>
                  <CardDescription className="text-lg text-white/80 mb-4">
                    {selectedType?.title} - {selectedType?.description}
                  </CardDescription>
                  
                  {/* مميزات الأمان المتقدمة */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-sm">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      نظام هوية وتحقق متقدم
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/70">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>مصادقة متعددة العوامل</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>تكامل World ID</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">✓</span>
                        <span>تحقق بيومتري آمن</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400">✓</span>
                        <span>عمليات KYC/AML</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-white/60 text-center">
                      🔒 حماية شاملة بتقنيات الذكاء الاصطناعي وBiometric Authentication
                    </div>
                  </div>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10">

            {/* اختيار مستوى التحقق (للتسجيل فقط) */}
            {!isLogin && selectedUserType && !selectedVerificationLevel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">اختر مستوى التحقق</h3>
                  <p className="text-white/80">اختر المستوى المناسب لاحتياجاتك</p>
                </div>
                
                <div className="grid gap-4">
                  <UserVerificationCard
                    userType={selectedUserType}
                    verificationLevel="standard"
                    verificationStatus="pending"
                    isSelected={selectedVerificationLevel === 'standard'}
                    onClick={() => setSelectedVerificationLevel('standard')}
                  />
                  
                  <UserVerificationCard
                    userType={selectedUserType}
                    verificationLevel="advanced"
                    verificationStatus="pending"
                    isSelected={selectedVerificationLevel === 'advanced'}
                    onClick={() => setSelectedVerificationLevel('advanced')}
                  />
                </div>
                
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedUserType("")}
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    العودة لاختيار نوع المستخدم
                  </Button>
                </div>
              </motion.div>
            )}

            {/* نموذج التسجيل/الدخول */}
            <AnimatePresence mode="wait">
              {selectedUserType && (isLogin || selectedVerificationLevel) && (
                <motion.form
                  key={isLogin ? "login" : "register"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* البريد الإلكتروني */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-right text-white font-medium">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className={`absolute right-3 top-3 h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`pr-10 text-right bg-white/10 backdrop-blur-sm border-2 ${borderColorClass} text-white placeholder:text-white/60 focus:border-white/50`}
                          placeholder="example@domain.com"
                          required
                        />
                      </div>
                    </div>

                    {/* الاسم (للتسجيل فقط) */}
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-right text-white font-medium">الاسم الكامل</Label>
                        <div className="relative">
                          <User className={`absolute right-3 top-3 h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className={`pr-10 text-right bg-white/10 backdrop-blur-sm border-2 ${borderColorClass} text-white placeholder:text-white/60 focus:border-white/50`}
                            placeholder="أدخل اسمك الكامل"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* كلمة المرور */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-right text-white font-medium">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className={`absolute right-3 top-3 h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={`pr-10 pl-10 text-right bg-white/10 backdrop-blur-sm border-2 ${borderColorClass} text-white placeholder:text-white/60 focus:border-white/50`}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute left-3 top-3 ${colorClass.replace('bg-', 'text-')} hover:text-white/80`}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* تأكيد كلمة المرور (للتسجيل فقط) */}
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-right text-white font-medium">تأكيد كلمة المرور</Label>
                        <div className="relative">
                          <Lock className={`absolute right-3 top-3 h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className={`pr-10 text-right bg-white/10 backdrop-blur-sm border-2 ${borderColorClass} text-white placeholder:text-white/60 focus:border-white/50`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <p className="text-red-300 text-sm text-right">كلمات المرور غير متطابقة</p>
                        )}
                      </div>
                    )}

                    {/* رقم الهاتف (للتسجيل فقط) */}
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-right text-white font-medium">رقم الهاتف</Label>
                        <div className="relative">
                          <Phone className={`absolute right-3 top-3 h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className={`pr-10 text-right bg-white/10 backdrop-blur-sm border-2 ${borderColorClass} text-white placeholder:text-white/60 focus:border-white/50`}
                            placeholder="+966xxxxxxxxx"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* اسم النشاط التجاري (للمتاجر والشركات فقط) */}
                    {!isLogin && (selectedUserType === 'store_owner' || selectedUserType === 'company') && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessName" className="text-right text-white font-medium">
                          {selectedUserType === 'store_owner' ? 'اسم المتجر' : 'اسم الشركة'}
                        </Label>
                        <div className="relative">
                          <Building className={`absolute right-3 top-3 h-4 w-4 ${colorClass.replace('bg-', 'text-')}`} />
                          <Input
                            id="businessName"
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange("businessName", e.target.value)}
                            className={`pr-10 text-right bg-white/10 backdrop-blur-sm border-2 ${borderColorClass} text-white placeholder:text-white/60 focus:border-white/50`}
                            placeholder={selectedUserType === 'store_owner' ? 'أدخل اسم متجرك' : 'أدخل اسم شركتك'}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* معلومات الأمان الإضافية */}
                  {!isLogin && selectedVerificationLevel && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 mb-4">
                      <h5 className="text-white font-medium mb-2 flex items-center gap-2">
                        <span className="text-yellow-400">🛡️</span>
                        {selectedVerificationLevel === 'advanced' ? 'مراحل التحقق المتقدمة' : 'مراحل التحقق العادية'}
                      </h5>
                      <div className="space-y-2 text-sm text-white/80">
                        {selectedVerificationLevel === 'standard' ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                              <span>تحقق من البيانات الأساسية</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                              <span>تحقق برقم الهاتف</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                              <span>إنشاء كلمة مرور آمنة</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                              <span>تحقق من البيانات الأساسية + التشفير المتقدم</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                              <span>مصادقة World ID + التحقق البيومتري</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                              <span>فحص KYC/AML + التحقق من مكافحة غسيل الأموال</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                              <span>تكامل Internet Identity للـ ICP</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* مؤشرات حالة التحقق المتقدم */}
                  {!isLogin && selectedVerificationLevel === 'advanced' && isVerifying && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 mb-4">
                      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        جاري التحقق المتقدم...
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            verificationStatus.worldId ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                          }`}></div>
                          <span className="text-sm text-white/80">World ID Verification</span>
                          {verificationStatus.worldId && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            verificationStatus.internetIdentity ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                          }`}></div>
                          <span className="text-sm text-white/80">Internet Identity (ICP)</span>
                          {verificationStatus.internetIdentity && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            verificationStatus.kycAml ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                          }`}></div>
                          <span className="text-sm text-white/80">KYC/AML Check</span>
                          {verificationStatus.kycAml && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* أزرار العمل */}
                  <div className="space-y-4 pt-4">
                    <Button
                      type="submit"
                      disabled={!isFormValid() || isVerifying}
                      className={`w-full h-12 text-lg font-semibold ${selectedType?.color} hover:opacity-90 transition-all duration-200 text-white shadow-lg relative overflow-hidden group ${
                        isVerifying ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        {isVerifying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>جاري التحقق...</span>
                          </>
                        ) : isLogin ? (
                          <>
                            <span>🔐</span>
                            <span>دخول آمن متعدد العوامل</span>
                          </>
                        ) : (
                          <>
                            <span>🛡️</span>
                            <span>
                              {selectedVerificationLevel === 'advanced' 
                                ? 'بدء التحقق المتقدم' 
                                : 'بدء التسجيل العادي'
                              }
                            </span>
                          </>
                        )}
                      </span>
                    </Button>

                    <div className="text-center space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setSelectedVerificationLevel("");
                          setFormData({
                            email: "",
                            password: "",
                            confirmPassword: "",
                            name: "",
                            phone: "",
                            businessName: "",
                            businessType: ""
                          });
                        }}
                        className={`${colorClass.replace('bg-', 'text-')} hover:text-white/80 transition-colors duration-200 font-medium`}
                      >
                        {isLogin 
                          ? "ليس لديك حساب؟ إنشاء حساب محمي جديد" 
                          : "لديك حساب بالفعل؟ دخول آمن"
                        }
                      </button>
                      
                      {/* شارات الأمان */}
                      <div className="flex justify-center items-center gap-3 pt-2">
                        {selectedVerificationLevel === 'advanced' ? (
                          <>
                            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                              <span className="text-green-400 text-xs">🌍</span>
                              <span className="text-xs text-white/70">World ID</span>
                            </div>
                            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                              <span className="text-blue-400 text-xs">🔐</span>
                              <span className="text-xs text-white/70">MFA</span>
                            </div>
                            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                              <span className="text-purple-400 text-xs">🛡️</span>
                              <span className="text-xs text-white/70">KYC/AML</span>
                            </div>
                            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                              <span className="text-orange-400 text-xs">🌐</span>
                              <span className="text-xs text-white/70">ICP</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                              <span className="text-blue-400 text-xs">📧</span>
                              <span className="text-xs text-white/70">Email</span>
                            </div>
                            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                              <span className="text-green-400 text-xs">📱</span>
                              <span className="text-xs text-white/70">SMS</span>
                            </div>
                            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                              <span className="text-purple-400 text-xs">🔒</span>
                              <span className="text-xs text-white/70">Password</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
              );
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;