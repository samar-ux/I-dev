import React, { useState, useEffect } from "react";
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Award,
  TrendingUp,
  Star,
  Download,
  MessageSquare,
  Package,
  Car,
  Store,
  Building,
  Truck,
  Users,
  Clock,
  CheckCircle,
  X
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AnimatePresence, motion } from "framer-motion"; // استيراد framer-motion
import "../App.css";

const UserProfile = ({ user, onClose, onEdit }) => {
  const { i18n, t } = useTranslation();
  const language = i18n.language;
  const [activeTab, setActiveTab] = useState("overview");

  // بيانات وهمية للإحصائيات حسب نوع المستخدم
  const getStatsForUserType = (userType) => {
    switch (userType) {
      case "customer":
        return [
          { icon: Package, label: t("completed_orders"), value: "12+", color: "text-cyan-500" },
          { icon: Star, label: t("trust_years"), value: "3+", color: "text-blue-500" },
          { icon: CheckCircle, label: t("rating"), value: "4.8", color: "text-yellow-500" },
        ];
      case "driver":
        return [
          { icon: Truck, label: t("completed_trips"), value: "150+", color: "text-cyan-500" },
          { icon: Clock, label: t("experience_years"), value: "2+", color: "text-blue-500" },
          { icon: Star, label: t("driver_rating"), value: "4.9", color: "text-yellow-500" },
        ];
      case "store_owner":
        return [
          { icon: Store, label: t("store_orders"), value: "500+", color: "text-cyan-500" },
          { icon: Users, label: t("customers"), value: "200+", color: "text-blue-500" },
          { icon: TrendingUp, label: t("growth_rate"), value: "25%", color: "text-purple-500" },
        ];
      case "company":
        return [
          { icon: Building, label: t("completed_projects"), value: "50+", color: "text-cyan-500" },
          { icon: Users, label: t("team_size"), value: "15+", color: "text-blue-500" },
          { icon: Award, label: t("operating_years"), value: "5+", color: "text-purple-500" },
        ];
      default:
        return [];
    }
  };

  // مهارات وقدرات حسب نوع المستخدم
  const getSkillsForUserType = (userType) => {
    switch (userType) {
      case "customer":
        return [
          { name: t("smart_shopping"), percentage: 95 },
          { name: t("review_rating"), percentage: 88 },
          { name: t("app_usage"), percentage: 92 },
        ];
      case "driver":
        return [
          { name: t("safe_driving"), percentage: 98 },
          { name: t("customer_service"), percentage: 90 },
          { name: t("time_management"), percentage: 95 },
          { name: t("route_knowledge"), percentage: 92 },
        ];
      case "store_owner":
        return [
          { name: t("inventory_management"), percentage: 95 },
          { name: t("customer_service"), percentage: 90 },
          { name: t("digital_marketing"), percentage: 85 },
          { name: t("sales_management"), percentage: 92 },
        ];
      case "company":
        return [
          { name: t("project_management"), percentage: 95 },
          { name: t("team_leadership"), percentage: 90 },
          { name: t("strategic_planning"), percentage: 88 },
          { name: t("logistics_solutions"), percentage: 93 },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForUserType(user.userType);
  const skills = getSkillsForUserType(user.userType);

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case "customer":
        return User;
      case "driver":
        return Car;
      case "store_owner":
        return Store;
      case "company":
        return Building;
      default:
        return User;
    }
  };

  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case "customer":
        return t("customer");
      case "driver":
        return t("driver");
      case "store_owner":
        return t("store_owner");
      case "company":
        return t("company");
      default:
        return t("user");
    }
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case "store_owner":
        return {
          gradient: "from-green-500 via-green-600 to-green-700",
          bg: "bg-green-500",
          text: "text-green-500",
          border: "border-green-500",
        };
      case "customer":
        return {
          gradient: "from-cyan-500 via-cyan-600 to-cyan-700",
          bg: "bg-cyan-500",
          text: "text-cyan-500",
          border: "border-cyan-500",
        };
      case "company":
        return {
          gradient: "from-purple-500 via-purple-600 to-purple-700",
          bg: "bg-purple-500",
          text: "text-purple-500",
          border: "border-purple-500",
        };
      case "driver":
        return {
          gradient: "from-orange-500 via-orange-600 to-orange-700",
          bg: "bg-orange-500",
          text: "text-orange-500",
          border: "border-orange-500",
        };
      default:
        return {
          gradient: "from-gray-500 via-gray-600 to-gray-700",
          bg: "bg-gray-500",
          text: "text-gray-500",
          border: "border-gray-500",
        };
    }
  };

  const userColors = getUserTypeColor(user.userType);

  // التحقق من تاريخ الانضمام من بيانات المستخدم أو استخدام قيمة افتراضية
  const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString("ar-SA") : "2023-01-01";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#0a1628] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className={`relative bg-gradient-to-br ${userColors.gradient} rounded-t-3xl p-6 md:p-8 text-white`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* صورة المستخدم */}
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    React.createElement(getUserTypeIcon(user.userType), { className: "w-16 h-16 text-white" })
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* معلومات أساسية */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.fullName}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  {React.createElement(getUserTypeIcon(user.userType), { className: "w-5 h-5" })}
                  <span className="text-lg">{getUserTypeLabel(user.userType)}</span>
                </div>
                {user.city && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span>{user.city}</span>
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                <Button
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 transition-colors text-white border border-cyan-500/20"
                >
                  <Download className="w-4 h-4" />
                  {t("download_resume")}
                </Button>
                <Button
                  className={`${userColors.bg} hover:opacity-90 px-4 py-2 rounded-full flex items-center gap-2 transition-colors text-white border-0`}
                >
                  <MessageSquare className="w-4 h-4" />
                  {t("contact_me")}
                </Button>
              </div>
            </div>
          </div>

          {/* المحتوى الرئيسي */}
          <div className="p-6 md:p-8">
            {/* الإحصائيات */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="glass-card text-center">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* نبذة شخصية */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t("personal_overview")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#0d1b33]/50 rounded-2xl p-4">
                  <p className="text-gray-300 leading-relaxed">
                    {user.userType === "customer" && t("customer_overview")}
                    {user.userType === "driver" && t("driver_overview")}
                    {user.userType === "store_owner" && t("store_owner_overview")}
                    {user.userType === "company" && t("company_overview")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* المهارات والقدرات */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {t("skills_and_abilities")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="bg-[#0d1b33]/30 rounded-2xl p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-200">{skill.name}</span>
                        <span className="text-cyan-400 font-bold">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* معلومات الاتصال */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="gradient-text">{t("contact_info")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                  {user.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{t("join_date")}: {joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{t("location")}: {user.city || t("not_specified")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* أزرار الإجراءات */}
            <div className="flex gap-4 mt-6">
              <Button
                onClick={onEdit}
                className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 rounded-full transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                {t("edit_profile")}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-cyan-500/50 text-cyan-500 hover:bg-cyan-500/10 rounded-full"
              >
                {t("close")}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfile;
