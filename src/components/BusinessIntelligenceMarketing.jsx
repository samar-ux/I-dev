import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Target,
  Eye,
  Download,
  Filter,
  Calendar,
  MapPin,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "../App.css";

const BusinessIntelligenceMarketing = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for demonstration
  const businessMetrics = {
    revenue: {
      current: 125000,
      previous: 98000,
      growth: 27.6,
      trend: "up"
    },
    customers: {
      current: 2847,
      previous: 2156,
      growth: 32.1,
      trend: "up"
    },
    orders: {
      current: 15623,
      previous: 12890,
      growth: 21.2,
      trend: "up"
    },
    conversion: {
      current: 3.8,
      previous: 3.2,
      growth: 18.8,
      trend: "up"
    }
  };

  const topProducts = [
    { id: 1, name: "منتج إلكتروني متقدم", sales: 1250, revenue: 45000, growth: 15.2 },
    { id: 2, name: "أجهزة ذكية", sales: 980, revenue: 32000, growth: 8.7 },
    { id: 3, name: "ملحقات تقنية", sales: 756, revenue: 18500, growth: 22.1 },
    { id: 4, name: "أدوات منزلية", sales: 634, revenue: 15200, growth: 12.5 },
    { id: 5, name: "ملابس رياضية", sales: 521, revenue: 12800, growth: 18.9 }
  ];

  const customerSegments = [
    { segment: "عملاء VIP", count: 156, percentage: 5.5, revenue: 45000 },
    { segment: "عملاء منتظمون", count: 1245, percentage: 43.7, revenue: 38000 },
    { segment: "عملاء جدد", count: 892, percentage: 31.3, revenue: 25000 },
    { segment: "عملاء نائمون", count: 554, percentage: 19.5, revenue: 8000 }
  ];

  const marketingCampaigns = [
    {
      id: 1,
      name: "حملة الصيف الكبرى",
      status: "active",
      budget: 15000,
      spent: 8750,
      impressions: 125000,
      clicks: 3200,
      conversions: 156,
      roi: 245
    },
    {
      id: 2,
      name: "عرض العودة للمدرسة",
      status: "completed",
      budget: 8000,
      spent: 8000,
      impressions: 89000,
      clicks: 2100,
      conversions: 98,
      roi: 180
    },
    {
      id: 3,
      name: "تخفيضات نهاية العام",
      status: "paused",
      budget: 12000,
      spent: 4200,
      impressions: 67000,
      clicks: 1800,
      conversions: 67,
      roi: 95
    }
  ];

  const regionalData = [
    { region: "الرياض", orders: 4567, revenue: 45000, growth: 12.5 },
    { region: "جدة", orders: 3890, revenue: 38000, growth: 8.7 },
    { region: "الدمام", orders: 2345, revenue: 25000, growth: 15.2 },
    { region: "مكة المكرمة", orders: 1890, revenue: 18000, growth: 6.8 },
    { region: "المدينة المنورة", orders: 1567, revenue: 15000, growth: 9.3 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "paused":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "نشط";
      case "completed":
        return "مكتمل";
      case "paused":
        return "متوقف";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('ar-SA').format(number);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header Section */}
      <div className="glass-card-hero p-4 md:p-6 animate-fade-in-up">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-right">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text arabic-text">
              الذكاء التجاري والتسويق
            </h1>
            <p className="text-sm md:text-base text-muted-foreground arabic-text mt-2">
              تحليلات متقدمة ورؤى تسويقية لتحسين الأداء التجاري
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="arabic-text">
              <Download className="h-4 w-4 ml-2" />
              تصدير التقرير
            </Button>
            <Button variant="outline" size="sm" className="arabic-text">
              <Settings className="h-4 w-4 ml-2" />
              الإعدادات
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="glass-card animate-fade-in-up animation-delay-100">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedPeriod === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("week")}
                className="arabic-text"
              >
                أسبوع
              </Button>
              <Button
                variant={selectedPeriod === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("month")}
                className="arabic-text"
              >
                شهر
              </Button>
              <Button
                variant={selectedPeriod === "quarter" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("quarter")}
                className="arabic-text"
              >
                ربع سنوي
              </Button>
              <Button
                variant={selectedPeriod === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("year")}
                className="arabic-text"
              >
                سنوي
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="arabic-text">
                <Filter className="h-4 w-4 ml-2" />
                فلتر متقدم
              </Button>
              <Button variant="outline" size="sm" className="arabic-text">
                <Calendar className="h-4 w-4 ml-2" />
                اختيار التاريخ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Card className="glass-card animate-fade-in-up animation-delay-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  إجمالي الإيرادات
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  {formatCurrency(businessMetrics.revenue.current)}
                </p>
                <div className="flex items-center mt-2 text-xs md:text-sm">
                  {businessMetrics.revenue.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 md:h-4 md:w-4 text-red-500 ml-1" />
                  )}
                  <span className={businessMetrics.revenue.trend === "up" ? "text-green-500" : "text-red-500"}>
                    +{businessMetrics.revenue.growth}%
                  </span>
                  <span className="text-muted-foreground mr-2 arabic-text">
                    من الفترة السابقة
                  </span>
                </div>
              </div>
              <div className="bg-green-500/20 p-2 md:p-3 rounded-full">
                <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-300">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  إجمالي العملاء
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  {formatNumber(businessMetrics.customers.current)}
                </p>
                <div className="flex items-center mt-2 text-xs md:text-sm">
                  <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
                  <span className="text-green-500">+{businessMetrics.customers.growth}%</span>
                  <span className="text-muted-foreground mr-2 arabic-text">
                    من الفترة السابقة
                  </span>
                </div>
              </div>
              <div className="bg-blue-500/20 p-2 md:p-3 rounded-full">
                <Users className="h-4 w-4 md:h-6 md:w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-400">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  إجمالي الطلبات
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  {formatNumber(businessMetrics.orders.current)}
                </p>
                <div className="flex items-center mt-2 text-xs md:text-sm">
                  <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
                  <span className="text-green-500">+{businessMetrics.orders.growth}%</span>
                  <span className="text-muted-foreground mr-2 arabic-text">
                    من الفترة السابقة
                  </span>
                </div>
              </div>
              <div className="bg-purple-500/20 p-2 md:p-3 rounded-full">
                <Package className="h-4 w-4 md:h-6 md:w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-500">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  معدل التحويل
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  {businessMetrics.conversion.current}%
                </p>
                <div className="flex items-center mt-2 text-xs md:text-sm">
                  <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
                  <span className="text-green-500">+{businessMetrics.conversion.growth}%</span>
                  <span className="text-muted-foreground mr-2 arabic-text">
                    من الفترة السابقة
                  </span>
                </div>
              </div>
              <div className="bg-orange-500/20 p-2 md:p-3 rounded-full">
                <Target className="h-4 w-4 md:h-6 md:w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="glass-card animate-fade-in-up animation-delay-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl arabic-text">
                تطور الإيرادات
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                <BarChart3 className="h-4 w-4 ml-2" />
                <span className="arabic-text">عرض التفاصيل</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground arabic-text">رسم بياني للإيرادات</p>
                <p className="text-xs text-muted-foreground arabic-text">
                  سيتم عرض البيانات التفصيلية هنا
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-green-500">+27.6%</p>
                <p className="text-xs text-muted-foreground arabic-text">نمو الإيرادات</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-blue-500">94.2%</p>
                <p className="text-xs text-muted-foreground arabic-text">تحقيق الهدف</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segmentation */}
        <Card className="glass-card animate-fade-in-up animation-delay-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl arabic-text">
                تجزئة العملاء
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                <PieChart className="h-4 w-4 ml-2" />
                <span className="arabic-text">عرض التفاصيل</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground arabic-text">رسم بياني لتجزئة العملاء</p>
                <p className="text-xs text-muted-foreground arabic-text">
                  سيتم عرض البيانات التفصيلية هنا
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-sm arabic-text">{segment.segment}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{segment.count}</p>
                    <p className="text-xs text-muted-foreground">{segment.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="glass-card animate-fade-in-up animation-delay-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl arabic-text">
                أفضل المنتجات
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                <Eye className="h-4 w-4 ml-2" />
                <span className="arabic-text">عرض الكل</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base arabic-text">
                      {product.name}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {formatNumber(product.sales)} مبيعة
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm md:text-base">
                    {formatCurrency(product.revenue)}
                  </p>
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                    <span className="text-xs text-green-500">+{product.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card className="glass-card animate-fade-in-up animation-delay-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl arabic-text">
                الأداء الإقليمي
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                <MapPin className="h-4 w-4 ml-2" />
                <span className="arabic-text">عرض الخريطة</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {regionalData.map((region, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base arabic-text">
                      {region.region}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {formatNumber(region.orders)} طلب
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm md:text-base">
                    {formatCurrency(region.revenue)}
                  </p>
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                    <span className="text-xs text-green-500">+{region.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Marketing Campaigns */}
      <Card className="glass-card animate-fade-in-up animation-delay-1000">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl arabic-text">
              الحملات التسويقية
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="arabic-text">
                <Plus className="h-4 w-4 ml-2" />
                حملة جديدة
              </Button>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                <Eye className="h-4 w-4 ml-2" />
                <span className="arabic-text">عرض الكل</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {marketingCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(campaign.status)} text-white border-0`}
                  >
                    {getStatusText(campaign.status)}
                  </Badge>
                  <h3 className="font-bold text-base arabic-text">{campaign.name}</h3>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground arabic-text">الميزانية</p>
                  <p className="font-bold">{formatCurrency(campaign.budget)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground arabic-text">المصروف</p>
                  <p className="font-bold">{formatCurrency(campaign.spent)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground arabic-text">التحويلات</p>
                  <p className="font-bold">{campaign.conversions}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground arabic-text">عائد الاستثمار</p>
                  <p className="font-bold text-green-500">{campaign.roi}%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="arabic-text">تقدم الحملة</span>
                  <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                </div>
                <Progress 
                  value={(campaign.spent / campaign.budget) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="glass-card animate-fade-in-up animation-delay-1100">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl gradient-text arabic-text text-center">
            رؤى الأداء والتوصيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center space-y-3">
              <div className="bg-green-500/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
              </div>
              <h3 className="font-bold arabic-text">نمو مستمر</h3>
              <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                نمو الإيرادات بنسبة 27.6% مع زيادة في عدد العملاء
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="bg-blue-500/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              </div>
              <h3 className="font-bold arabic-text">تحسين التحويل</h3>
              <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                معدل التحويل ارتفع إلى 3.8% مع تحسين تجربة المستخدم
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="bg-purple-500/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
              </div>
              <h3 className="font-bold arabic-text">كفاءة التسويق</h3>
              <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                الحملات التسويقية تحقق عائد استثمار ممتاز بنسبة 245%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessIntelligenceMarketing;
