import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Package,
  Users,
  Shield,
  Target,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Settings,
  Filter,
  Download,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Truck,
  Route,
  Calendar,
  Bell,
  Eye,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Bot,
  Cpu,
  Database,
  Network,
  Lock,
  Unlock,
  Smartphone,
  Monitor,
  Wifi,
  Signal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "../App.css";

const AISuggestionsComponent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("suggestions");
  const [suggestions, setSuggestions] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  // Sample data
  useEffect(() => {
    setSuggestions([
      {
        id: 1,
        type: "route_optimization",
        title: "تحسين مسار الشحن",
        description: "يمكن توفير 15% من الوقت و20% من التكلفة بتغيير المسار",
        priority: "high",
        impact: "cost_saving",
        estimatedSavings: 250,
        confidence: 92,
        category: "logistics",
        icon: Route,
        details: {
          currentRoute: "الرياض → الدمام → الخبر",
          suggestedRoute: "الرياض → الخبر مباشرة",
          timeSaved: "2.5 ساعة",
          costSaved: "250 ريال"
        }
      },
      {
        id: 2,
        type: "demand_forecast",
        title: "توقع الطلب المتزايد",
        description: "توقع زيادة الطلب بنسبة 35% في المنطقة الشرقية الأسبوع القادم",
        priority: "medium",
        impact: "revenue_increase",
        estimatedSavings: 1500,
        confidence: 87,
        category: "forecasting",
        icon: TrendingUp,
        details: {
          region: "المنطقة الشرقية",
          expectedIncrease: "35%",
          timeframe: "الأسبوع القادم",
          recommendedAction: "زيادة المخزون"
        }
      },
      {
        id: 3,
        type: "customer_retention",
        title: "تحسين تجربة العملاء",
        description: "عملاء VIP يحتاجون إلى تحديثات أكثر تواتراً",
        priority: "high",
        impact: "customer_satisfaction",
        estimatedSavings: 800,
        confidence: 89,
        category: "customer_service",
        icon: Users,
        details: {
          customerSegment: "VIP",
          currentSatisfaction: "78%",
          targetSatisfaction: "95%",
          recommendedAction: "تحديثات كل ساعة"
        }
      },
      {
        id: 4,
        type: "inventory_optimization",
        title: "تحسين المخزون",
        description: "تقليل المخزون في مستودع جدة بنسبة 20%",
        priority: "medium",
        impact: "cost_saving",
        estimatedSavings: 1200,
        confidence: 85,
        category: "inventory",
        icon: Package,
        details: {
          warehouse: "مستودع جدة",
          currentInventory: "1000 وحدة",
          suggestedInventory: "800 وحدة",
          reason: "انخفاض الطلب المتوقع"
        }
      }
    ]);

    setPredictions([
      {
        id: 1,
        type: "delivery_time",
        title: "توقع أوقات التسليم",
        accuracy: 94,
        predictions: [
          { route: "الرياض → الدمام", predictedTime: "4.2 ساعة", confidence: 96 },
          { route: "جدة → مكة", predictedTime: "1.8 ساعة", confidence: 92 },
          { route: "الدمام → الخبر", predictedTime: "0.5 ساعة", confidence: 98 }
        ]
      },
      {
        id: 2,
        type: "demand_pattern",
        title: "أنماط الطلب",
        accuracy: 89,
        predictions: [
          { period: "صباح اليوم", demand: "مرتفع", confidence: 91 },
          { period: "بعد الظهر", demand: "متوسط", confidence: 87 },
          { period: "المساء", demand: "منخفض", confidence: 93 }
        ]
      },
      {
        id: 3,
        type: "weather_impact",
        title: "تأثير الطقس",
        accuracy: 87,
        predictions: [
          { region: "الرياض", weather: "مشمس", impact: "لا تأثير", confidence: 95 },
          { region: "جدة", weather: "عاصفة رملية", impact: "تأخير 30 دقيقة", confidence: 88 },
          { region: "الدمام", weather: "ممطر", impact: "تأخير 15 دقيقة", confidence: 90 }
        ]
      }
    ]);

    setRiskAssessments([
      {
        id: 1,
        type: "delivery_risk",
        title: "مخاطر التسليم",
        riskLevel: "medium",
        score: 65,
        factors: [
          { factor: "الطقس", impact: "منخفض", probability: 30 },
          { factor: "الازدحام المروري", impact: "متوسط", probability: 60 },
          { factor: "حالة الطريق", impact: "منخفض", probability: 25 }
        ],
        recommendations: [
          "استخدام طرق بديلة",
          "تحديث العملاء بالتأخير المحتمل",
          "زيادة وقت التسليم المتوقع"
        ]
      },
      {
        id: 2,
        type: "payment_risk",
        title: "مخاطر الدفع",
        riskLevel: "low",
        score: 25,
        factors: [
          { factor: "صحة العملة الرقمية", impact: "منخفض", probability: 15 },
          { factor: "استقرار الشبكة", impact: "منخفض", probability: 20 },
          { factor: "أمان المعاملة", impact: "منخفض", probability: 10 }
        ],
        recommendations: [
          "استخدام شبكات متعددة",
          "تشفير إضافي للمعاملات",
          "مراقبة مستمرة للأمان"
        ]
      },
      {
        id: 3,
        type: "inventory_risk",
        title: "مخاطر المخزون",
        riskLevel: "high",
        score: 78,
        factors: [
          { factor: "نفاد المخزون", impact: "عالي", probability: 70 },
          { factor: "تلف البضائع", impact: "متوسط", probability: 45 },
          { factor: "سرقة", impact: "منخفض", probability: 20 }
        ],
        recommendations: [
          "زيادة المخزون الاحتياطي",
          "تحسين نظام المراقبة",
          "تأمين إضافي على البضائع"
        ]
      }
    ]);

    setAiInsights([
      {
        id: 1,
        type: "customer_behavior",
        title: "تحليل سلوك العملاء",
        insight: "العملاء يفضلون التسليم في الصباح الباكر",
        confidence: 91,
        data: {
          morningDelivery: "68%",
          afternoonDelivery: "22%",
          eveningDelivery: "10%"
        },
        recommendation: "زيادة ساعات التسليم الصباحية"
      },
      {
        id: 2,
        type: "seasonal_patterns",
        title: "الأنماط الموسمية",
        insight: "زيادة الطلب بنسبة 40% خلال شهر رمضان",
        confidence: 88,
        data: {
          ramadanIncrease: "40%",
          eidIncrease: "60%",
          normalPeriod: "100%"
        },
        recommendation: "زيادة المخزون قبل المواسم الدينية"
      },
      {
        id: 3,
        type: "geographic_analysis",
        title: "التحليل الجغرافي",
        insight: "المنطقة الشرقية تحتاج إلى مستودع إضافي",
        confidence: 85,
        data: {
          easternRegion: "35% من الطلب",
          currentCapacity: "60%",
          neededCapacity: "85%"
        },
        recommendation: "إنشاء مستودع في المنطقة الشرقية"
      }
    ]);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case "cost_saving": return DollarSign;
      case "revenue_increase": return TrendingUp;
      case "customer_satisfaction": return Users;
      case "efficiency": return Zap;
      default: return Target;
    }
  };

  const tabs = [
    { id: "suggestions", label: "الاقتراحات الذكية", icon: Lightbulb },
    { id: "predictions", label: "التوقعات التنبؤية", icon: BarChart3 },
    { id: "risks", label: "تقييم المخاطر", icon: Shield },
    { id: "insights", label: "الرؤى الذكية", icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            الذكاء الاصطناعي والاقتراحات الذكية
          </h1>
          <p className="text-gray-600 text-lg">
            تحليلات ذكية وتوقعات تنبؤية لتحسين الأداء
          </p>
        </div>

        {/* AI Status */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">الذكاء الاصطناعي نشط</span>
                  <Badge className="bg-green-100 text-green-800">متصل</Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>آخر تحديث: منذ دقيقتين</span>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    تحديث
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === "suggestions" && (
          <div className="space-y-6">
            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {suggestions.map((suggestion) => {
                const ImpactIcon = getImpactIcon(suggestion.impact);
                const SuggestionIcon = suggestion.icon;
                return (
                  <Card key={suggestion.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <SuggestionIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                            <p className="text-sm text-gray-600">{suggestion.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority === "high" && "عالي"}
                            {suggestion.priority === "medium" && "متوسط"}
                            {suggestion.priority === "low" && "منخفض"}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <span>{suggestion.confidence}%</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ImpactIcon className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">التوفير المتوقع:</span>
                          </div>
                          <span className="font-semibold text-green-600">
                            {suggestion.estimatedSavings} ريال
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-semibold text-sm mb-2">التفاصيل:</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {Object.entries(suggestion.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button className="flex-1" size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            تطبيق الاقتراح
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* AI Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>أداء الذكاء الاصطناعي</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-600">دقة التوقعات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-gray-600">معدل القبول</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">1.2M</div>
                    <div className="text-sm text-gray-600">نقطة بيانات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">24/7</div>
                    <div className="text-sm text-gray-600">مراقبة مستمرة</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "predictions" && (
          <div className="space-y-6">
            {predictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>{prediction.title}</span>
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">
                      دقة {prediction.accuracy}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prediction.predictions.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{item.route || item.period || item.region}</div>
                          <div className="text-sm text-gray-600">{item.predictedTime || item.demand || item.impact}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-600">{item.confidence}%</div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${item.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "risks" && (
          <div className="space-y-6">
            {riskAssessments.map((risk) => (
              <Card key={risk.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>{risk.title}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRiskColor(risk.riskLevel)}>
                        {risk.riskLevel === "high" && "عالي"}
                        {risk.riskLevel === "medium" && "متوسط"}
                        {risk.riskLevel === "low" && "منخفض"}
                      </Badge>
                      <div className="text-sm font-semibold text-gray-600">
                        نقاط المخاطر: {risk.score}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">عوامل المخاطر:</h4>
                      <div className="space-y-2">
                        {risk.factors.map((factor, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-medium">{factor.factor}</span>
                            <div className="flex items-center space-x-4">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                {factor.impact === "عالي" && "عالي"}
                                {factor.impact === "متوسط" && "متوسط"}
                                {factor.impact === "منخفض" && "منخفض"}
                              </Badge>
                              <span className="text-sm text-gray-600">{factor.probability}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">التوصيات:</h4>
                      <div className="space-y-1">
                        {risk.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-6">
            {aiInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>{insight.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">الرؤية:</h4>
                      <p className="text-blue-800">{insight.insight}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">البيانات:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Object.entries(insight.data).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-gray-50 rounded">
                            <div className="font-semibold text-lg">{value}</div>
                            <div className="text-sm text-gray-600">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-1">التوصية:</h4>
                      <p className="text-green-800">{insight.recommendation}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">مستوى الثقة:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {insight.confidence}%
                        </Badge>
                      </div>
                      <Button size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        تطبيق التوصية
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsComponent;
