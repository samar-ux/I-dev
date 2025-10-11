import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  MapPin,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Navigation,
  Zap,
  Eye,
  Bell,
  Smartphone,
  Globe,
  Shield,
  Activity,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

const SmartTrackingShowcase = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trackingData, setTrackingData] = useState([
    {
      id: "TR001",
      status: "in-transit",
      driver: "أحمد السائق",
      location: "شارع الملك فهد، الرياض",
      progress: 65,
      estimatedTime: "30 دقيقة",
      lastUpdate: "منذ 2 دقيقة",
      customer: "محمد العلي",
      package: "جهاز كمبيوتر محمول",
      value: "2,500 ر.س",
    },
    {
      id: "TR002",
      status: "delivered",
      driver: "فاطمة الموصلة",
      location: "تم التسليم - حي النرجس",
      progress: 100,
      estimatedTime: "تم التسليم",
      lastUpdate: "منذ 15 دقيقة",
      customer: "سارة أحمد",
      package: "ملابس نسائية",
      value: "450 ر.س",
    },
    {
      id: "TR003",
      status: "preparing",
      driver: "علي المستودع",
      location: "مستودع الرياض الرئيسي",
      progress: 25,
      estimatedTime: "45 دقيقة",
      lastUpdate: "منذ 5 دقائق",
      customer: "خالد محمد",
      package: "أجهزة إلكترونية",
      value: "1,800 ر.س",
    },
  ]);

  const trackingFeatures = [
    {
      icon: MapPin,
      title: "تتبع GPS فوري",
      description: "تحديث الموقع كل 5 ثواني",
      color: "bg-blue-500",
    },
    {
      icon: Bell,
      title: "إشعارات ذكية",
      description: "تنبيهات فورية للعملاء",
      color: "bg-green-500",
    },
    {
      icon: Shield,
      title: "أمان متقدم",
      description: "تشفير البيانات والحماية",
      color: "bg-red-500",
    },
    {
      icon: Globe,
      title: "خرائط تفاعلية",
      description: "عرض المسار والموقع",
      color: "bg-purple-500",
    },
  ];

  const notificationTypes = [
    {
      type: "order_confirmed",
      title: "تم تأكيد الطلب",
      message: "طلبك #TR001 جاري التحضير",
      time: "10:30 ص",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      type: "in_transit",
      title: "الشحنة في الطريق",
      message: "طلبك #TR001 في الطريق إليك",
      time: "11:15 ص",
      icon: Truck,
      color: "bg-blue-500",
    },
    {
      type: "delivered",
      title: "تم التسليم",
      message: "طلبك #TR002 تم تسليمه بنجاح",
      time: "12:00 م",
      icon: Package,
      color: "bg-purple-500",
    },
    {
      type: "delay",
      title: "تأخير في التسليم",
      message: "تأخير متوقع 15 دقيقة للطلب #TR003",
      time: "12:30 م",
      icon: AlertCircle,
      color: "bg-orange-500",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "in-transit":
        return "bg-blue-500";
      case "preparing":
        return "bg-yellow-500";
      case "pending":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "تم التسليم";
      case "in-transit":
        return "في الطريق";
      case "preparing":
        return "جاري التحضير";
      case "pending":
        return "في الانتظار";
      default:
        return "غير محدد";
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="modern-card p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <MapPin className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-[#0f3e47] arabic-text">
            نظام التتبع الذكي المتقدم
          </h2>
          <Activity className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-[#155e63] arabic-text">
          تتبع فوري ودقيق لجميع الشحنات مع تحديثات كل 5 ثواني
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge className="bg-green-100 text-green-800">
            <Clock className="h-4 w-4 ml-2" />
            تحديث كل 5 ثواني
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            <Eye className="h-4 w-4 ml-2" />
            رؤية مباشرة
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            <Bell className="h-4 w-4 ml-2" />
            إشعارات فورية
          </Badge>
        </div>
      </div>

      {/* Tracking Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trackingFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="modern-card text-center p-4">
              <div className={`${feature.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-[#0f3e47] arabic-text mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-[#155e63] arabic-text">
                {feature.description}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Live Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Shipments */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#0f3e47] arabic-text flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              الشحنات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trackingData.map((shipment) => (
              <div
                key={shipment.id}
                className="border border-[#e6f4f4] rounded-lg p-4 hover:bg-[#f8fafa] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(shipment.status)}`} />
                    <span className="font-bold text-[#0f3e47]">{shipment.id}</span>
                    <Badge className={`${getStatusColor(shipment.status)} text-white text-xs`}>
                      {getStatusText(shipment.status)}
                    </Badge>
                  </div>
                  <span className="text-xs text-[#155e63]">{shipment.lastUpdate}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#155e63]" />
                    <span className="text-sm text-[#0f3e47] arabic-text">{shipment.customer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#155e63]" />
                    <span className="text-sm text-[#0f3e47] arabic-text">{shipment.package}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#155e63]" />
                    <span className="text-sm text-[#0f3e47] arabic-text">{shipment.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#155e63]" />
                    <span className="text-sm text-[#0f3e47] arabic-text">{shipment.driver}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#155e63] arabic-text">التقدم</span>
                    <span className="text-[#0f3e47] font-bold">{shipment.progress}%</span>
                  </div>
                  <Progress value={shipment.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm">
                    <span className="text-[#155e63] arabic-text">القيمة: </span>
                    <span className="font-bold text-[#0f3e47]">{shipment.value}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-[#155e63] arabic-text">الوقت المتوقع: </span>
                    <span className="font-bold text-[#0f3e47]">{shipment.estimatedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#0f3e47] arabic-text flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-500" />
              الإشعارات الفورية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notificationTypes.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border border-[#e6f4f4] rounded-lg hover:bg-[#f8fafa] transition-colors"
                >
                  <div className={`${notification.color} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-[#0f3e47] arabic-text text-sm">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-[#155e63]">{notification.time}</span>
                    </div>
                    <p className="text-sm text-[#155e63] arabic-text">
                      {notification.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="modern-card text-center p-4">
          <div className="text-2xl font-bold text-[#0f3e47] mb-1">156</div>
          <p className="text-sm text-[#155e63] arabic-text">شحنة نشطة</p>
          <TrendingUp className="h-5 w-5 text-green-500 mx-auto mt-2" />
        </Card>
        <Card className="modern-card text-center p-4">
          <div className="text-2xl font-bold text-[#0f3e47] mb-1">5 ثواني</div>
          <p className="text-sm text-[#155e63] arabic-text">معدل التحديث</p>
          <Zap className="h-5 w-5 text-blue-500 mx-auto mt-2" />
        </Card>
        <Card className="modern-card text-center p-4">
          <div className="text-2xl font-bold text-[#0f3e47] mb-1">98.5%</div>
          <p className="text-sm text-[#155e63] arabic-text">معدل النجاح</p>
          <Star className="h-5 w-5 text-yellow-500 mx-auto mt-2" />
        </Card>
        <Card className="modern-card text-center p-4">
          <div className="text-2xl font-bold text-[#0f3e47] mb-1">24/7</div>
          <p className="text-sm text-[#155e63] arabic-text">مراقبة مستمرة</p>
          <Activity className="h-5 w-5 text-purple-500 mx-auto mt-2" />
        </Card>
      </div>
    </div>
  );
};

export default SmartTrackingShowcase;

