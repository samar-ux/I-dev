import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Globe,
  Shield,
  Zap,
  Brain,
  Coins,
  Smartphone,
  MapPin,
  Users,
  BarChart3,
  Lock,
  Cpu,
  Network,
  Wallet,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
} from "lucide-react";

const AdvancedFeaturesShowcase = ({ onViewChange }) => {
  const advancedFeatures = [
    {
      id: "web3",
      title: "تقنيات Web3 المتقدمة",
      description: "تكامل كامل مع البلوك تشين والعملات الرقمية",
      icon: Globe,
      color: "bg-blue-500",
      features: [
        "دعم 8 عملات رقمية رئيسية",
        "عقود ذكية على Ethereum",
        "تكامل مع ICP",
        "دفع NFT للسلع الرقمية",
      ],
      stats: "8 عملات مدعومة",
    },
    {
      id: "ai",
      title: "الذكاء الاصطناعي",
      description: "تحليلات ذكية وتوقعات متقدمة",
      icon: Brain,
      color: "bg-purple-500",
      features: [
        "اقتراحات ذكية للمسارات",
        "توقعات تنبؤية للطلب",
        "تقييم المخاطر",
        "رؤى ذكية للأعمال",
      ],
      stats: "99% دقة التوقعات",
    },
    {
      id: "tracking",
      title: "نظام التتبع الذكي",
      description: "تتبع فوري ودقيق للشحنات",
      icon: MapPin,
      color: "bg-green-500",
      features: [
        "تتبع GPS كل 5 ثواني",
        "خرائط تفاعلية",
        "إشعارات فورية",
        "تحويل الشحنات إلى NFT",
      ],
      stats: "تحديث كل 5 ثواني",
    },
    {
      id: "security",
      title: "الأمان المتقدم",
      description: "حماية شاملة للبيانات والمعاملات",
      icon: Shield,
      color: "bg-red-500",
      features: [
        "مصادقة متعددة العوامل",
        "تشفير متقدم",
        "Internet Identity",
        "KYC/AML متكامل",
      ],
      stats: "256-bit تشفير",
    },
  ];

  const businessIntegrations = [
    {
      name: "Shopify",
      logo: "🛍️",
      status: "متكامل بالكامل",
      features: ["إدارة الطلبات", "تتبع المخزون", "دفع آمن"],
    },
    {
      name: "WooCommerce",
      logo: "🛒",
      status: "إضافة WordPress",
      features: ["تكامل سلس", "إدارة المنتجات", "تقارير متقدمة"],
    },
    {
      name: "Wix",
      logo: "🎨",
      status: "App Market",
      features: ["واجهة سهلة", "إعداد سريع", "دعم فني"],
    },
    {
      name: "إيزي أوردر",
      logo: "📱",
      status: "منصة عربية",
      features: ["دعم عربي كامل", "دفع محلي", "خدمة عملاء"],
    },
  ];

  const cryptoCurrencies = [
    { name: "Bitcoin", symbol: "BTC", price: "$43,250", change: "+2.5%" },
    { name: "Ethereum", symbol: "ETH", price: "$2,650", change: "+1.8%" },
    { name: "Tether USD", symbol: "USDT", price: "$1.00", change: "0.0%" },
    { name: "USD Coin", symbol: "USDC", price: "$1.00", change: "0.0%" },
    { name: "Binance Coin", symbol: "BNB", price: "$315", change: "+3.2%" },
    { name: "Cardano", symbol: "ADA", price: "$0.45", change: "+1.1%" },
    { name: "Solana", symbol: "SOL", price: "$98", change: "+4.7%" },
    { name: "Polygon", symbol: "MATIC", price: "$0.85", change: "+2.1%" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section - Advanced Features */}
      <div className="modern-card p-6 md:p-8 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f3e47] arabic-text">
              منصة الشحن الأكثر تطوراً في العالم
            </h2>
            <Sparkles className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-lg text-[#155e63] arabic-text max-w-3xl mx-auto">
            منصة شاملة تجمع بين تقنيات Web3 والذكاء الاصطناعي والتتبع الذكي 
            لتوفير تجربة شحن وتوصيل متطورة وآمنة
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Cpu className="h-4 w-4 ml-2" />
              ICP Integration
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Network className="h-4 w-4 ml-2" />
              Web3 Ready
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Brain className="h-4 w-4 ml-2" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Shield className="h-4 w-4 ml-2" />
              Enterprise Security
            </Badge>
          </div>
        </div>
      </div>

      {/* Advanced Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advancedFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.id}
              className="modern-card hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={() => onViewChange(feature.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${feature.color} p-3 rounded-full`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-[#0f3e47] arabic-text">
                        {feature.title}
                      </CardTitle>
                      <p className="text-sm text-[#155e63] arabic-text">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {feature.stats}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-[#0f3e47] arabic-text">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-[#0f3e47] hover:bg-[#e6f4f4] group-hover:bg-[#e6f4f4]"
                >
                  <span className="arabic-text">استكشف المزيد</span>
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Business Integrations */}
      <div className="modern-card p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#0f3e47] arabic-text mb-2">
            تكامل سلس مع منصات الأعمال
          </h3>
          <p className="text-[#155e63] arabic-text">
            ربط مباشر مع أشهر منصات التجارة الإلكترونية
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {businessIntegrations.map((platform, index) => (
            <Card
              key={index}
              className="modern-card text-center p-4 hover:scale-105 transition-all duration-300"
            >
              <div className="text-3xl mb-2">{platform.logo}</div>
              <h4 className="font-bold text-[#0f3e47] arabic-text mb-1">
                {platform.name}
              </h4>
              <Badge className="bg-green-100 text-green-800 text-xs mb-2">
                {platform.status}
              </Badge>
              <div className="space-y-1">
                {platform.features.map((feature, idx) => (
                  <div key={idx} className="text-xs text-[#155e63] arabic-text">
                    • {feature}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Crypto Currencies Support */}
      <div className="modern-card p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#0f3e47] arabic-text mb-2">
            دعم العملات الرقمية
          </h3>
          <p className="text-[#155e63] arabic-text">
            دفع آمن وسريع بأشهر العملات الرقمية
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cryptoCurrencies.map((crypto, index) => (
            <Card
              key={index}
              className="modern-card p-4 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-[#0f3e47] text-sm">
                    {crypto.symbol}
                  </h4>
                  <p className="text-xs text-[#155e63] arabic-text">
                    {crypto.name}
                  </p>
                </div>
                <Wallet className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-right">
                <p className="font-bold text-[#0f3e47] text-sm">
                  {crypto.price}
                </p>
                <p
                  className={`text-xs ${
                    crypto.change.startsWith("+") ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {crypto.change}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="modern-card text-center p-4">
          <div className="text-2xl font-bold text-[#0f3e47] mb-1">99.9%</div>
          <p className="text-sm text-[#155e63] arabic-text">معدل التشغيل</p>
          <TrendingUp className="h-5 w-5 text-green-500 mx-auto mt-2" />
        </Card>
        <Card className="modern-card text-center p-4">
          <div className="text-2xl font-bold text-[#0f3e47] mb-1">5 ثواني</div>
          <p className="text-sm text-[#155e63] arabic-text">تحديث التتبع</p>
          <Activity className="h-5 w-5 text-blue-500 mx-auto mt-2" />
        </Card>
        <Card className="modern-card text-center p-4">
          <div className="text-2xl font-bold text-[#0f3e47] mb-1">256-bit</div>
          <p className="text-sm text-[#155e63] arabic-text">تشفير البيانات</p>
          <Lock className="h-5 w-5 text-red-500 mx-auto mt-2" />
        </Card>
        <Card className="modern-card text-center p-4">
          <div className="text-2xl font-bold text-[#0f3e47] mb-1">24/7</div>
          <p className="text-sm text-[#155e63] arabic-text">دعم فني</p>
          <Users className="h-5 w-5 text-purple-500 mx-auto mt-2" />
        </Card>
      </div>
    </div>
  );
};

export default AdvancedFeaturesShowcase;

