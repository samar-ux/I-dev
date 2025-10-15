import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import Footer from "./Footer";
import {
  Package,
  Truck,
  Store,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowUpRight,
  Activity,
  Globe,
  Shield,
  Zap,
  Eye,
  ArrowUp,
  BarChart3,
  PieChart,
  DollarSign,
  Recycle,
  RefreshCcw,
} from "lucide-react";
import "../App.css";
import { useTranslation } from "react-i18next";

const HomePage = ({ onViewChange }) => {
  const { t } = useTranslation();

  const quickActions = [
    {
      id: "store",
      label: t("store_dashboard_label"),
      icon: Store,
      color: "bg-green-500",
      description: t("store_dashboard_desc"),
    },
    {
      id: "driver",
      label: t("driver_dashboard_label"),
      icon: Truck,
      color: "bg-orange-500",
      description: t("driver_dashboard_desc"),
    },
    {
      id: "tracking",
      label: t("track_shipments_label"),
      icon: Package,
      color: "bg-cyan-500",
      description: t("track_shipments_desc"),
    },
    {
      id: "returns",
      label: t("returns_management_label"),
      icon: RefreshCcw,
      color: "bg-red-500",
      description: t("returns_management_desc"),
    },
  ];

  const recentShipments = [
    {
      id: "SH001",
      status: "delivered",
      customer: "أحمد محمد",
      amount: 250,
      time: "10:30 ص",
    },
    {
      id: "SH002",
      status: "in-transit",
      customer: "فاطمة علي",
      amount: 180,
      time: "11:15 ص",
    },
    {
      id: "SH003",
      status: "pending",
      customer: "محمد سالم",
      amount: 320,
      time: "12:00 م",
    },
    {
      id: "SH004",
      status: "delivered",
      customer: "نور الدين",
      amount: 150,
      time: "12:45 م",
    },
  ];

  const getCurrentTime = () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString("ar-SA"),
      date: now.toLocaleDateString("ar-SA"),
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "in-transit":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const currentTime = getCurrentTime();

  return (
    <div className="space-y-4 pb-16 md:pb-6">
      {/* Welcome Section - Enhanced for mobile */}
      <div className="glass-card-hero p-4 md:p-6 rounded-xl border border-white/10 backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent animate-fade-in-up shadow-md">
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-center md:text-right">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 bg-clip-text text-transparent arabic-text drop-shadow-md">
                {t("welcome_title")}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground arabic-text mt-1">
                {t("welcome_subtitle")}
              </p>
            </div>
            <div className="text-center">
              <div className="text-base md:text-lg font-bold text-primary arabic-text">
                {currentTime.time}
              </div>
              <div className="text-xs text-muted-foreground arabic-text">
                {currentTime.date}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="glass-card animate-fade-in-up animation-delay-100 hover:shadow-md hover:scale-105 transition-all duration-300 border-cyan-500/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground arabic-text">
                  {t("total_shipments")}
                </p>
                <p className="text-base md:text-lg font-bold text-primary">123</p>
              </div>
              <div className="bg-blue-500/20 p-1 md:p-2 rounded-full">
                <Package className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-1 text-xs">
              <ArrowUp className="h-2 w-2 md:h-3 md:w-3 text-green-500 ml-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground mr-1 arabic-text">
                {t("from_last_week")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-200 hover:shadow-md hover:scale-105 transition-all duration-300 border-orange-500/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground arabic-text">
                  {t("active_drivers")}
                </p>
                <p className="text-base md:text-lg font-bold text-primary">89</p>
              </div>
              <div className="bg-orange-500/20 p-1 md:p-2 rounded-full">
                <Truck className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
              </div>
            </div>
            <div className="flex items-center mt-1 text-xs">
              <ArrowUp className="h-2 w-2 md:h-3 md:w-3 text-green-500 ml-1" />
              <span className="text-green-500">+5%</span>
              <span className="text-muted-foreground mr-1 arabic-text">
                {t("from_last_week")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-300 hover:shadow-md hover:scale-105 transition-all duration-300 border-green-500/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground arabic-text">
                  {t("registered_stores")}
                </p>
                <p className="text-base md:text-lg font-bold text-primary">156</p>
              </div>
              <div className="bg-green-500/20 p-1 md:p-2 rounded-full">
                <Store className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-1 text-xs">
              <ArrowUp className="h-2 w-2 md:h-3 md:w-3 text-green-500 ml-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground mr-1 arabic-text">
                {t("from_last_week")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-400 hover:shadow-md hover:scale-105 transition-all duration-300 border-teal-500/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground arabic-text">
                  {t("revenues")}
                </p>
                <p className="text-base md:text-lg font-bold text-primary">
                  203 ر.س
                </p>
              </div>
              <div className="bg-teal-500/20 p-1 md:p-2 rounded-full">
                <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-teal-500" />
              </div>
            </div>
            <div className="flex items-center mt-1 text-xs">
              <ArrowUp className="h-2 w-2 md:h-3 md:w-3 text-green-500 ml-1" />
              <span className="text-green-500">+15%</span>
              <span className="text-muted-foreground mr-1 arabic-text">
                {t("from_last_week")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Responsive Grid */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 arabic-text">
          {t("quick_actions") || "الإجراءات السريعة"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.id}
                className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${500 + index * 100}ms` }}
                onClick={() => onViewChange(action.id)}
              >
                <CardContent className="p-2 md:p-3 text-center flex flex-col items-center justify-center h-full">
                  <div
                    className={`${action.color} w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mx-auto mb-1`}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-xs md:text-sm text-foreground arabic-text">
                    {action.label}
                  </h3>
                  <p className="text-xs text-muted-foreground arabic-text">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity - Enhanced for mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Shipments */}
        <Card className="glass-card animate-fade-in-up animation-delay-900">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm md:text-base arabic-text">
                الشحنات الأخيرة
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10"
              >
                <Eye className="h-3 w-3 ml-1" />
                <span className="arabic-text text-xs">عرض الكل</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between p-2 rounded-md bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(
                      shipment.status
                    )}`}
                  />
                  <div>
                    <p className="font-medium text-xs md:text-sm arabic-text">
                      {shipment.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{shipment.id}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs md:text-sm">
                    {shipment.amount} ر.س
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="glass-card animate-fade-in-up animation-delay-1000">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base arabic-text">
              أداء المنصة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="arabic-text">معدل التسليم الناجح</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="arabic-text">رضا العملاء</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="arabic-text">كفاءة السائقين</span>
                  <span>91%</span>
                </div>
                <Progress value={91} className="h-1.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-center p-2 bg-background/50 rounded-md">
                <BarChart3 className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground arabic-text">
                  تقارير مفصلة
                </p>
              </div>
              <div className="text-center p-2 bg-background/50 rounded-md">
                <PieChart className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground arabic-text">
                  تحليلات متقدمة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
