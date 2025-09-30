import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
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
      color: "bg-purple-500",
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

  // Get current time without hooks
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
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Welcome Section - Enhanced for mobile */}
      <div className="glass-card-hero p-4 md:p-6 text-center animate-fade-in-up">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-right">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text arabic-text">
                {t("welcome_title")}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground arabic-text mt-2">
                {t("welcome_subtitle")}
              </p>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-primary arabic-text">
                {currentTime.time}
              </div>
              <div className="text-sm text-muted-foreground arabic-text">
                {currentTime.date}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Statistics Cards - Responsive Grid */}
      {/* {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="glass-card hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground arabic-text">
                      {stat.title}
                    </p>
                    <p className="text-lg md:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-400 ml-1" />
                      <span className="text-xs md:text-sm font-medium text-green-400">
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground mr-2 arabic-text">
                        من الشهر الماضي
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 md:p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })} */}
      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Card className="glass-card animate-fade-in-up animation-delay-100">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  {t("total_shipments")}
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  123
                </p>
              </div>
              <div className="bg-blue-500/20 p-2 md:p-3 rounded-full">
                <Package className="h-4 w-4 md:h-6 md:w-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs md:text-sm">
              <ArrowUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground mr-2 arabic-text">
                {t("from_last_week")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  {t("active_drivers")}
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">89</p>
              </div>
              <div className="bg-orange-500/20 p-2 md:p-3 rounded-full">
                <Truck className="h-4 w-4 md:h-6 md:w-6 text-orange-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs md:text-sm">
              <ArrowUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
              <span className="text-green-500">+5%</span>
              <span className="text-muted-foreground mr-2 arabic-text">
                {t("from_last_week")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-300">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  {t("registered_stores")}
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  156
                </p>
              </div>
              <div className="bg-green-500/20 p-2 md:p-3 rounded-full">
                <Store className="h-4 w-4 md:h-6 md:w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs md:text-sm">
              <ArrowUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground mr-2 arabic-text">
                {t("from_last_week")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-400">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  {t("revenues")}
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  203 ر.س
                </p>
              </div>
              <div className="bg-purple-500/20 p-2 md:p-3 rounded-full">
                <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs md:text-sm">
              <ArrowUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
              <span className="text-green-500">+15%</span>
              <span className="text-muted-foreground mr-2 arabic-text">
                {t("from_last_week")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Responsive Grid */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold gradient-text mb-6 arabic-text">
          الإجراءات السريعة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.id}
                className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${500 + index * 100}ms` }}
                onClick={() => onViewChange(action.id)}
              >
                <CardContent className="p-4 md:p-6 text-center">
                  <div
                    className={`${action.color} w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground arabic-text mb-2">
                    {action.label}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
              // <Card
              //   key={index}
              //   className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in-up"
              //   style={{ animationDelay: `${500 + index * 100}ms` }}
              //   onClick={action.action}
              // >
              //   <CardContent className="p-4 md:p-6 text-center">
              //     <div
              //       className={`inline-flex p-3 md:p-4 rounded-full ${
              //         action.iconBg || action.color
              //       } mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}
              //     >
              //       <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
              //     </div>
              //     <h3 className="text-sm md:text-lg font-semibold text-foreground mb-2 arabic-text">
              //       {action.title}
              //     </h3>
              //     <p className="text-xs md:text-sm text-muted-foreground arabic-text">
              //       {action.description}
              //     </p>
              //     <ArrowUpRight className="h-4 w-4 text-primary mt-3 mx-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              //   </CardContent>
              // </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activities and Platform Features */}
      {/* Recent Activity - Enhanced for mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <Card className="glass-card animate-fade-in-up animation-delay-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl arabic-text">
                الشحنات الأخيرة
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10"
              >
                <Eye className="h-4 w-4 ml-2" />
                <span className="arabic-text">عرض الكل</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(
                      shipment.status
                    )}`}
                  />
                  <div>
                    <p className="font-medium text-sm md:text-base arabic-text">
                      {shipment.customer}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      #{shipment.id}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm md:text-base">
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
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl arabic-text">
              أداء المنصة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="arabic-text">معدل التسليم الناجح</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="arabic-text">رضا العملاء</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="arabic-text">كفاءة السائقين</span>
                  <span>91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground arabic-text">
                  تقارير مفصلة
                </p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <PieChart className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground arabic-text">
                  تحليلات متقدمة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Performance Metrics - Enhanced */}
      {/* <Card className="glass-card animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl gradient-text arabic-text text-center">
            <TrendingUp className="h-5 w-5 text-primary" />
            مؤشرات الأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl md:text-3xl font-bold gradient-text">
                99.8%
              </div>
              <div className="text-xs md:text-sm text-muted-foreground arabic-text">
                معدل التسليم الناجح
              </div>
              <div className="bg-green-500/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl md:text-3xl font-bold gradient-text">
                2.4 ساعة
              </div>
              <div className="text-xs md:text-sm text-muted-foreground arabic-text">
                متوسط وقت التسليم
              </div>
              <div className="bg-blue-500/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl md:text-3xl font-bold gradient-text">
                4.9/5
              </div>
              <div className="text-xs md:text-sm text-muted-foreground arabic-text">
                تقييم العملاء
              </div>
              <div className="bg-yellow-500/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card className="glass-card animate-fade-in-up animation-delay-1100">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl gradient-text arabic-text text-center">
            مميزات المنصة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center space-y-3">
              <div className="bg-blue-500/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              </div>
              <h3 className="font-bold arabic-text">أمان عالي</h3>
              <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                حماية متقدمة للبيانات والمعاملات
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="bg-green-500/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
              </div>
              <h3 className="font-bold arabic-text">سرعة فائقة</h3>
              <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                معالجة سريعة للطلبات والشحنات
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="bg-purple-500/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto">
                <Globe className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
              </div>
              <h3 className="font-bold arabic-text">تغطية شاملة</h3>
              <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                خدمة في جميع أنحاء المملكة
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default HomePage;
