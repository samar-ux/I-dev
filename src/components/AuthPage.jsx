import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building, Truck, Store, UserCircle, Globe, Shield, Zap, Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import internetIdentityService from "../services/internetIdentityService";
import { useTranslation } from "react-i18next";

const AuthPage = ({ onAuthSuccess, onBackToWelcome }) => {
  const { t } = useTranslation();
  
  const [selectedUserType, setSelectedUserType] = useState("");
  const [authenticatingUserType, setAuthenticatingUserType] = useState(null);

  // أنواع المستخدمين
  const userTypes = [
    {
      id: "store_owner",
      title: t("merchant"),
      description: t("merchant_desc"),
      icon: Store,
      color: "bg-green-500 hover:bg-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      id: "customer",
      title: t("customer"),
      description: t("customer_desc"),
      icon: UserCircle,
      color: "bg-blue-500 hover:bg-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      id: "company",
      title: t("manager"),
      description: t("manager_desc"),
      icon: Building,
      color: "bg-teal-500 hover:bg-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950",
      borderColor: "border-teal-200 dark:border-teal-800"
    },
    {
      id: "driver",
      title: t("driver"),
      description: t("driver_desc"),
      icon: Truck,
      color: "bg-orange-500 hover:bg-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      borderColor: "border-orange-200 dark:border-orange-800"
    }
  ];

  const handleInternetIdentityAuth = async (userType) => {
    try {
      // التحقق من عدم وجود عملية مصادقة جارية
      if (authenticatingUserType) {
        console.log('Authentication already in progress for:', authenticatingUserType);
        return;
      }
      
      setAuthenticatingUserType(userType);
      
      // حفظ نوع المستخدم المختار
      localStorage.setItem('user_type', userType);
      
      // بدء عملية المصادقة عبر Internet Identity
      const result = await internetIdentityService.authenticateWithInternetIdentity();
      
      if (result.success) {
        // إنشاء بيانات المستخدم من Internet Identity
        const userData = {
          name: "مستخدم Internet Identity",
          email: result.principal,
          userType: userType,
          verificationLevel: 'internet_identity',
          principal: result.principal,
          authMethod: 'internet_identity'
        };
        
        // استدعاء دالة النجاح مع البيانات
        onAuthSuccess(userData);
        
        console.log('Internet Identity authentication successful for:', userType, result);
      } else {
        console.error('Internet Identity authentication failed for:', userType, result.error);
        // عرض رسالة خطأ أكثر تفصيلاً
        const errorMessage = result.error || 'فشل في تسجيل الدخول عبر Internet Identity';
        alert(`خطأ في المصادقة لـ ${userType}: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error during Internet Identity authentication for:', userType, error);
      // عرض رسالة خطأ أكثر تفصيلاً
      const errorMessage = error.message || error.error || 'حدث خطأ غير متوقع أثناء تسجيل الدخول';
      alert(`خطأ في المصادقة لـ ${userType}: ${errorMessage}`);
    } finally {
      setAuthenticatingUserType(null);
    }
  };


  // إذا لم يتم اختيار نوع المستخدم، عرض صفحة اختيار الأيقونات
  if (!selectedUserType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d2137] to-[#0a1628] flex items-center justify-center p-4 relative">
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 animate-pulse" style={{ animationDuration: '6s' }}></div>
        {/* Enhanced Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => {
            const size = Math.random() > 0.7 ? 'w-2 h-2' : 'w-1 h-1';
            const color = Math.random() > 0.5 ? 'bg-cyan-400/40' : 'bg-white/30';
            return (
              <motion.div
                key={i}
                className={`absolute ${size} ${color} rounded-full blur-sm`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 2, 0.8],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              />
            );
          })}
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
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent mb-4 drop-shadow-2xl" style={{ textShadow: '0 0 40px rgba(6, 182, 212, 0.3)' }}>
              {t("choose_account")}
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
                    className="transition-all duration-300 hover:shadow-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 overflow-hidden group cursor-pointer"
                  >
                    <CardContent className="p-6 text-center relative">
                      {/* Enhanced gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
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
                        <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{type.title}</h3>
                        <p className="text-white/80 text-sm mb-3">{type.description}</p>
                        <div className="text-sm text-cyan-300 mb-4 font-medium flex items-center justify-center gap-2">
                          <Globe className="w-4 h-4" />
                          <span>{t("internet_identity_auth") || "Internet Identity"}</span>
                        </div>
                        
                        {/* زر المصادقة عبر Internet Identity */}
                        <div className="flex justify-center">
                          <Button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleInternetIdentityAuth(type.id);
                            }}
                            disabled={authenticatingUserType !== null}
                            size="lg"
                            className={`${type.color} text-white hover:shadow-lg transition-all duration-200 px-6 py-3 rounded-full ${
                              authenticatingUserType !== null ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                            title={`التسجيل وتسجيل الدخول عبر Internet Identity - ${type.title}`}
                          >
                            {authenticatingUserType === type.id ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                <span className="font-medium">جاري المصادقة...</span>
                              </>
                            ) : (
                              <>
                                <Globe className="w-5 h-5 mr-2" />
                                <span className="font-medium">ابدأ الآن</span>
                              </>
                            )}
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
                className="relative bg-white/10 hover:bg-white/20 backdrop-blur-lg border-2 border-white/30 hover:border-white/50 text-white hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">
                  {t("back_to_home")}
                </span>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // إذا تم اختيار نوع المستخدم، عرض صفحة تأكيد المصادقة
  if (selectedUserType) {
    const selectedType = userTypes.find(type => type.id === selectedUserType);
    const colorClass = selectedType?.color?.split(' ')[0] || 'bg-blue-500';
    const borderColorClass = selectedType?.borderColor || 'border-blue-200';

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d2137] to-[#0a1628] flex items-center justify-center p-4 relative">
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 animate-pulse" style={{ animationDuration: '6s' }}></div>

        {/* Enhanced Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => {
            const size = Math.random() > 0.7 ? 'w-2 h-2' : 'w-1 h-1';
            const color = Math.random() > 0.5 ? 'bg-cyan-400/40' : 'bg-white/30';
            return (
              <motion.div
                key={i}
                className={`absolute ${size} ${color} rounded-full blur-sm`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 2, 0.8],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-lg mx-auto"
        >
          <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border-2 border-white/20 relative overflow-hidden group">
            {/* Enhanced gradient background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent opacity-50"></div>
            
            {/* أزرار العودة */}
            <div className="p-4 border-b border-white/20 flex justify-between items-center relative z-10">
              <Button
                variant="ghost"
                onClick={() => setSelectedUserType("")}
                className="relative bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white hover:text-white transition-all duration-300 transform hover:scale-105 overflow-hidden group rounded-lg"
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
                  className="relative bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white hover:text-white transition-all duration-300 transform hover:scale-105 overflow-hidden group rounded-lg text-sm"
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
                  تسجيل الدخول عبر Internet Identity
                </CardTitle>
                <CardDescription className="text-lg text-white/80 mb-4">
                  {selectedType?.title} - {selectedType?.description}
                </CardDescription>
                
                {/* مميزات Internet Identity */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-sm">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    نظام الهوية اللامركزية
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/70">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span>مصادقة آمنة ومشفرة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      <span>لا حاجة لكلمة مرور</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-400">✓</span>
                      <span>حماية الخصوصية</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400">✓</span>
                      <span>تقنية البلوك تشين</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-white/60 text-center">
                    🔒 حماية متقدمة ومضمونة
                  </div>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
              {/* زر المصادقة */}
              <div className="text-center">
                <Button
                  onClick={() => handleInternetIdentityAuth(selectedUserType)}
                  disabled={authenticatingUserType !== null}
                  className={`w-full h-16 text-xl font-semibold ${selectedType?.color} hover:opacity-90 transition-all duration-200 text-white shadow-lg relative overflow-hidden group ${
                    authenticatingUserType !== null ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {authenticatingUserType === selectedUserType ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>جاري المصادقة عبر Internet Identity...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-6 h-6" />
                        <span>ابدأ المصادقة الآن</span>
                      </>
                    )}
                  </span>
                </Button>
                
                <p className="text-white/60 text-sm mt-4">
                  سيتم فتح نافذة جديدة لإتمام عملية المصادقة
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
};

export default AuthPage;
