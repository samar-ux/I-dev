import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Globe, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plane,
  Ship,
  Building,
  Shield,
  FileText,
  DollarSign,
  Receipt,
  Star,
  Award,
  ThumbsUp,
  MessageCircle,
  CreditCard,
  Wallet,
  Bitcoin,
  ArrowUpDown
} from 'lucide-react';
import '../App.css';

const ShippingCoordination = () => {
  const [selectedView, setSelectedView] = useState('overview');

  // وظائف التأمين
  const handleCreateInsurancePolicy = (shipmentId) => {
    alert(`سيتم إنشاء بوليصة تأمين تلقائية للشحنة ${shipmentId}`);
  };

  const handleViewInsurancePolicy = (policyId) => {
    alert(`عرض تفاصيل بوليصة التأمين ${policyId}`);
  };

  const handleSubmitInsuranceClaim = (shipmentId, policyId) => {
    alert(`تقديم مطالبة تأمين للشحنة ${shipmentId} - البوليصة ${policyId}`);
  };

  // وظائف التقييم
  const handleRateDriver = (driverId, driverName) => {
    alert(`تقييم السائق ${driverName} (${driverId})`);
  };

  const handleRateCarrier = (carrierId, carrierName) => {
    alert(`تقييم شركة الشحن ${carrierName} (${carrierId})`);
  };

  const handleViewDriverReputation = (driverId) => {
    alert(`عرض سمعة السائق ${driverId}`);
  };

  const handleViewCarrierReputation = (carrierId) => {
    alert(`عرض سمعة شركة الشحن ${carrierId}`);
  };

  // وظائف الدفع
  const handleCreateInvoice = (shipmentId, amount, currency) => {
    alert(`إنشاء فاتورة للشحنة ${shipmentId} - ${amount} ${currency}`);
  };

  const handleProcessPayment = (invoiceId) => {
    alert(`معالجة الدفع للفاتورة ${invoiceId}`);
  };

  const handleViewInvoice = (invoiceId) => {
    alert(`عرض الفاتورة ${invoiceId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  const getReputationColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const stats = [
    {
      title: 'الشحن الداخلي',
      value: '156',
      icon: Truck,
      change: '+12%',
      color: 'text-blue-400'
    },
    {
      title: 'الشحن الخارجي',
      value: '89',
      icon: Plane,
      change: '+8%',
      color: 'text-green-400'
    },
    {
      title: 'الشحن البحري',
      value: '23',
      icon: Ship,
      change: '+15%',
      color: 'text-purple-400'
    },
    {
      title: 'المراكز النشطة',
      value: '12',
      icon: Building,
      change: '+5%',
      color: 'text-cyan-400'
    },
    {
      title: 'سياسات التأمين النشطة',
      value: '1,250',
      icon: Shield,
      change: '+18%',
      color: 'text-emerald-400'
    },
    {
      title: 'إجمالي قيمة التأمين',
      value: '2.5M ريال',
      icon: DollarSign,
      change: '+22%',
      color: 'text-yellow-400'
    },
    {
      title: 'التقييمات الموثقة',
      value: '1,847',
      icon: Star,
      change: '+15%',
      color: 'text-orange-400'
    },
    {
      title: 'نقاط السمعة المتوسطة',
      value: '87/100',
      icon: Award,
      change: '+8%',
      color: 'text-purple-400'
    },
    {
      title: 'الفواتير الإلكترونية',
      value: '1,247',
      icon: Receipt,
      change: '+25%',
      color: 'text-indigo-400'
    },
    {
      title: 'المدفوعات الرقمية',
      value: '8 عملات',
      icon: Bitcoin,
      change: '+12%',
      color: 'text-orange-400'
    }
  ];

  const internalShipments = [
    {
      id: 'INT001',
      route: 'الرياض → جدة',
      driver: 'أحمد محمد',
      packages: 15,
      status: 'in-transit',
      estimatedArrival: '2024-01-15 - 6:00 م',
      distance: '950 كم',
      insurancePolicy: 'POL-001',
      insuranceValue: 50000,
      insuranceStatus: 'active',
      driverRating: 4.8,
      driverReputation: 95,
      totalRatings: 156,
      verifiedDriver: true,
      paymentMethod: "BTC",
      paymentAmount: 0.05,
      paymentStatus: "paid",
      invoiceId: "INV-001"
    },
    {
      id: 'INT002',
      route: 'الدمام → الرياض',
      driver: 'محمد علي',
      packages: 8,
      status: 'loading',
      estimatedArrival: '2024-01-15 - 8:00 م',
      distance: '400 كم',
      insurancePolicy: 'POL-002',
      insuranceValue: 25000,
      insuranceStatus: 'active',
      driverRating: 4.2,
      driverReputation: 78,
      totalRatings: 89,
      verifiedDriver: true,
      paymentMethod: "ETH",
      paymentAmount: 0.8,
      paymentStatus: "pending",
      invoiceId: "INV-002"
    }
  ];

  const externalShipments = [
    {
      id: 'EXT001',
      destination: 'دبي، الإمارات',
      carrier: 'شركة الشحن الدولية',
      packages: 25,
      status: 'customs',
      estimatedArrival: '2024-01-17',
      method: 'جوي',
      insurancePolicy: 'POL-003',
      insuranceValue: 120000,
      insuranceStatus: 'active',
      carrierRating: 4.5,
      carrierReputation: 88,
      totalRatings: 234,
      verifiedCarrier: true,
      paymentMethod: "USDT",
      paymentAmount: 120,
      paymentStatus: "paid",
      invoiceId: "INV-003"
    },
    {
      id: 'EXT002',
      destination: 'الكويت',
      carrier: 'الخليج للشحن',
      packages: 12,
      status: 'shipped',
      estimatedArrival: '2024-01-16',
      method: 'بري',
      insurancePolicy: 'POL-004',
      insuranceValue: 75000,
      insuranceStatus: 'active',
      carrierRating: 4.1,
      carrierReputation: 82,
      totalRatings: 167,
      verifiedCarrier: true,
      paymentMethod: "BNB",
      paymentAmount: 0.5,
      paymentStatus: "pending",
      invoiceId: "INV-004"
    }
  ];

  const shippingCenters = [
    {
      id: 'CTR001',
      name: 'مركز الرياض الرئيسي',
      location: 'الرياض، حي الصناعية',
      capacity: '1000 طرد',
      currentLoad: '750 طرد',
      utilization: 75,
      status: 'active'
    },
    {
      id: 'CTR002',
      name: 'مركز جدة',
      location: 'جدة، المنطقة الصناعية',
      capacity: '800 طرد',
      currentLoad: '600 طرد',
      utilization: 75,
      status: 'active'
    },
    {
      id: 'CTR003',
      name: 'مركز الدمام',
      location: 'الدمام، المنطقة الشرقية',
      capacity: '600 طرد',
      currentLoad: '200 طرد',
      utilization: 33,
      status: 'low'
    }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>
                      <TrendingUp className="h-4 w-4 inline ml-1" />
                      {stat.change}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Shipping Centers Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">حالة مراكز الشحن</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shippingCenters.map((center) => (
              <div key={center.id} className="p-4 rounded-lg bg-card/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{center.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {center.location}
                    </p>
                  </div>
                  <Badge className={`${
                    center.status === 'active' ? 'status-delivered' :
                    center.status === 'low' ? 'status-pending' :
                    'status-returned'
                  } text-white`}>
                    {center.status === 'active' ? 'نشط' :
                     center.status === 'low' ? 'حمولة منخفضة' : 'غير نشط'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">السعة الكاملة:</p>
                    <p className="font-medium">{center.capacity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الحمولة الحالية:</p>
                    <p className="font-medium">{center.currentLoad}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>معدل الاستخدام</span>
                    <span>{center.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        center.utilization > 80 ? 'bg-red-500' :
                        center.utilization > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${center.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const InternalTab = () => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center gap-2">
          <Truck className="h-5 w-5" />
          الشحن الداخلي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {internalShipments.map((shipment) => (
            <div key={shipment.id} className="p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{shipment.id}</h3>
                  <p className="text-sm text-muted-foreground">{shipment.route}</p>
                </div>
                <Badge className={`${
                  shipment.status === 'in-transit' ? 'status-in-transit' :
                  shipment.status === 'loading' ? 'status-pending' :
                  'status-delivered'
                } text-white`}>
                  {shipment.status === 'in-transit' ? 'في الطريق' :
                   shipment.status === 'loading' ? 'قيد التحميل' : 'تم التسليم'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">السائق:</p>
                  <p className="font-medium">{shipment.driver}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">عدد الطرود:</p>
                  <p className="font-medium">{shipment.packages} طرد</p>
                </div>
                <div>
                  <p className="text-muted-foreground">المسافة:</p>
                  <p className="font-medium">{shipment.distance}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الوصول المتوقع:</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {shipment.estimatedArrival}
                  </p>
                </div>
              </div>

              {/* معلومات التأمين */}
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">معلومات التأمين</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    {shipment.insuranceStatus === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-700 dark:text-green-300">بوليصة التأمين:</p>
                    <p className="font-medium text-green-800 dark:text-green-200">{shipment.insurancePolicy}</p>
                  </div>
                  <div>
                    <p className="text-green-700 dark:text-green-300">قيمة التأمين:</p>
                    <p className="font-medium text-green-800 dark:text-green-200">{formatCurrency(shipment.insuranceValue)}</p>
                  </div>
                </div>
              </div>

              {/* معلومات الدفع */}
              <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">معلومات الدفع</span>
                  </div>
                  <Badge className={`${
                    shipment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                    shipment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                    'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {shipment.paymentStatus === 'paid' ? 'مدفوعة' :
                     shipment.paymentStatus === 'pending' ? 'معلقة' : 'غير مدفوعة'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-indigo-700 dark:text-indigo-300">طريقة الدفع:</p>
                    <p className="font-medium text-indigo-800 dark:text-indigo-200">{shipment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-indigo-700 dark:text-indigo-300">المبلغ:</p>
                    <p className="font-medium text-indigo-800 dark:text-indigo-200">{shipment.paymentAmount} {shipment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-indigo-700 dark:text-indigo-300">رقم الفاتورة:</p>
                    <p className="font-medium text-indigo-800 dark:text-indigo-200">{shipment.invoiceId}</p>
                  </div>
                </div>
              </div>

              {/* معلومات التقييم */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">تقييم السائق</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {shipment.verifiedDriver && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs">
                        موثق
                      </Badge>
                    )}
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs">
                      {shipment.totalRatings} تقييم
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 dark:text-blue-300">التقييم:</p>
                    <div className="flex items-center gap-1">
                      {renderStars(shipment.driverRating)}
                      <span className="font-medium text-blue-800 dark:text-blue-200 ml-1">
                        {shipment.driverRating}/5
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-blue-700 dark:text-blue-300">نقاط السمعة:</p>
                    <p className={`font-medium ${getReputationColor(shipment.driverReputation)}`}>
                      {shipment.driverReputation}/100
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="border-primary/20">
                  تتبع الرحلة
                </Button>
                <Button size="sm" variant="outline" className="border-primary/20">
                  تواصل مع السائق
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-green-300 text-green-600 hover:bg-green-50"
                  onClick={() => handleViewInsurancePolicy(shipment.insurancePolicy)}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  عرض التأمين
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  onClick={() => handleSubmitInsuranceClaim(shipment.id, shipment.insurancePolicy)}
                >
                  <Receipt className="h-4 w-4 mr-1" />
                  مطالبة تأمين
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => handleRateDriver(`DRV-${shipment.id}`, shipment.driver)}
                >
                  <Star className="w-4 h-4 mr-1" />
                  تقييم السائق
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  onClick={() => handleViewDriverReputation(`DRV-${shipment.id}`)}
                >
                  <Award className="w-4 h-4 mr-1" />
                  عرض السمعة
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                  onClick={() => handleViewInvoice(shipment.invoiceId)}
                >
                  <Receipt className="w-4 h-4 mr-1" />
                  عرض الفاتورة
                </Button>
                {shipment.paymentStatus === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-green-300 text-green-600 hover:bg-green-50"
                    onClick={() => handleProcessPayment(shipment.invoiceId)}
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    معالجة الدفع
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const RatingTab = () => (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            <Star className="h-5 w-5" />
            نظام التقييم والسمعة القائم على البلوكشين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">تقييمات لامركزية</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">غير قابلة للتزوير</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">نظام السمعة</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">تقييم شامل للأداء</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800 dark:text-green-200">موثق بالبلوكشين</h3>
              <p className="text-sm text-green-700 dark:text-green-300">شفافية كاملة</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي التقييمات</p>
                <p className="text-2xl font-bold">1,847</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +15%
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">متوسط التقييم</p>
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +8%
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نقاط السمعة المتوسطة</p>
                <p className="text-2xl font-bold">87</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +5%
                </p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">التقييمات الموثقة</p>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +2%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">إجراءات التقييم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-yellow-50 border-yellow-200"
            >
              <div className="p-3 rounded-full bg-yellow-500">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">إضافة تقييم</h3>
                <p className="text-sm text-muted-foreground">تقييم السائقين أو شركات الشحن</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-blue-50 border-blue-200"
            >
              <div className="p-3 rounded-full bg-blue-500">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">عرض السمعة</h3>
                <p className="text-sm text-muted-foreground">مراجعة نقاط السمعة</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-green-50 border-green-200"
            >
              <div className="p-3 rounded-full bg-green-500">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">التعليقات</h3>
                <p className="text-sm text-muted-foreground">مراجعة التعليقات والتقييمات</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PaymentTab = () => (
    <div className="space-y-6">
      {/* Payment Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            النظام المالي المرن والمتكامل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Bitcoin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">8 عملات رقمية</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">دعم شامل للعملات</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Receipt className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800 dark:text-green-200">فواتير إلكترونية</h3>
              <p className="text-sm text-green-700 dark:text-green-300">نظام فواتير ذكي</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Wallet className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">محفظة متعددة العملات</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">إدارة شاملة للأموال</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الفواتير</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +25%
                </p>
              </div>
              <Receipt className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الفواتير المدفوعة</p>
                <p className="text-2xl font-bold">1,180</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +22%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">العملات المدعومة</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +12%
                </p>
              </div>
              <Bitcoin className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">معدل الدفع</p>
                <p className="text-2xl font-bold">94.6%</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +3%
                </p>
              </div>
              <ArrowUpDown className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">إجراءات النظام المالي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-blue-50 border-blue-200"
            >
              <div className="p-3 rounded-full bg-blue-500">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">إنشاء فاتورة</h3>
                <p className="text-sm text-muted-foreground">إنشاء فاتورة إلكترونية جديدة</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-green-50 border-green-200"
            >
              <div className="p-3 rounded-full bg-green-500">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">معالجة الدفع</h3>
                <p className="text-sm text-muted-foreground">معالجة المدفوعات الرقمية</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-purple-50 border-purple-200"
            >
              <div className="p-3 rounded-full bg-purple-500">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">إدارة المحفظة</h3>
                <p className="text-sm text-muted-foreground">إدارة العملات المتعددة</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const InsuranceTab = () => (
    <div className="space-y-6">
      {/* Insurance Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text flex items-center gap-2">
            <Shield className="h-5 w-5" />
            نظام التأمين اللامركزي للشحنات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800 dark:text-green-200">بوليصة تأمين تلقائية</h3>
              <p className="text-sm text-green-700 dark:text-green-300">إنشاء تلقائي لسياسات التأمين</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">صندوق تأمين ذكي</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">إدارة لامركزية للأموال</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Receipt className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">معالجة المطالبات</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">نظام ذكي للمطالبات</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي السياسات</p>
                <p className="text-2xl font-bold">1,250</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +18%
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">السياسات النشطة</p>
                <p className="text-2xl font-bold">1,180</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +15%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي قيمة التأمين</p>
                <p className="text-2xl font-bold">2.5M</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +22%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">المطالبات المعالجة</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-green-400">
                  <TrendingUp className="h-4 w-4 inline ml-1" />
                  +12%
                </p>
              </div>
              <Receipt className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insurance Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">إجراءات التأمين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-green-50 border-green-200"
              onClick={() => handleCreateInsurancePolicy('NEW-SHIPMENT')}
            >
              <div className="p-3 rounded-full bg-green-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">إنشاء بوليصة تأمين</h3>
                <p className="text-sm text-muted-foreground">إنشاء بوليصة تأمين جديدة</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-blue-50 border-blue-200"
            >
              <div className="p-3 rounded-full bg-blue-500">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">إدارة السياسات</h3>
                <p className="text-sm text-muted-foreground">عرض وإدارة جميع السياسات</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-orange-50 border-orange-200"
            >
              <div className="p-3 rounded-full bg-orange-500">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">معالجة المطالبات</h3>
                <p className="text-sm text-muted-foreground">مراجعة ومعالجة المطالبات</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ExternalTab = () => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center gap-2">
          <Globe className="h-5 w-5" />
          الشحن الخارجي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {externalShipments.map((shipment) => (
            <div key={shipment.id} className="p-4 rounded-lg bg-card/50 hover:bg-card/70 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{shipment.id}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {shipment.destination}
                  </p>
                </div>
                <Badge className={`${
                  shipment.status === 'shipped' ? 'status-in-transit' :
                  shipment.status === 'customs' ? 'status-pending' :
                  'status-delivered'
                } text-white`}>
                  {shipment.status === 'shipped' ? 'تم الشحن' :
                   shipment.status === 'customs' ? 'في الجمارك' : 'تم التسليم'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">شركة الشحن:</p>
                  <p className="font-medium">{shipment.carrier}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">عدد الطرود:</p>
                  <p className="font-medium">{shipment.packages} طرد</p>
                </div>
                <div>
                  <p className="text-muted-foreground">طريقة الشحن:</p>
                  <p className="font-medium">{shipment.method}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الوصول المتوقع:</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {shipment.estimatedArrival}
                  </p>
                </div>
              </div>

              {/* معلومات التأمين */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">معلومات التأمين</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                    {shipment.insuranceStatus === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 dark:text-blue-300">بوليصة التأمين:</p>
                    <p className="font-medium text-blue-800 dark:text-blue-200">{shipment.insurancePolicy}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 dark:text-blue-300">قيمة التأمين:</p>
                    <p className="font-medium text-blue-800 dark:text-blue-200">{formatCurrency(shipment.insuranceValue)}</p>
                  </div>
                </div>
              </div>

              {/* معلومات الدفع */}
              <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">معلومات الدفع</span>
                  </div>
                  <Badge className={`${
                    shipment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                    shipment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                    'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {shipment.paymentStatus === 'paid' ? 'مدفوعة' :
                     shipment.paymentStatus === 'pending' ? 'معلقة' : 'غير مدفوعة'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-indigo-700 dark:text-indigo-300">طريقة الدفع:</p>
                    <p className="font-medium text-indigo-800 dark:text-indigo-200">{shipment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-indigo-700 dark:text-indigo-300">المبلغ:</p>
                    <p className="font-medium text-indigo-800 dark:text-indigo-200">{shipment.paymentAmount} {shipment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-indigo-700 dark:text-indigo-300">رقم الفاتورة:</p>
                    <p className="font-medium text-indigo-800 dark:text-indigo-200">{shipment.invoiceId}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="border-primary/20">
                  تتبع الشحنة
                </Button>
                <Button size="sm" variant="outline" className="border-primary/20">
                  تواصل مع الشركة
                </Button>
                <Button size="sm" variant="outline" className="border-primary/20">
                  تحديث الحالة
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleViewInsurancePolicy(shipment.insurancePolicy)}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  عرض التأمين
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  onClick={() => handleSubmitInsuranceClaim(shipment.id, shipment.insurancePolicy)}
                >
                  <Receipt className="h-4 w-4 mr-1" />
                  مطالبة تأمين
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => handleRateCarrier(`CAR-${shipment.id}`, shipment.carrier)}
                >
                  <Star className="w-4 h-4 mr-1" />
                  تقييم الشركة
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  onClick={() => handleViewCarrierReputation(`CAR-${shipment.id}`)}
                >
                  <Award className="w-4 h-4 mr-1" />
                  عرض السمعة
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                  onClick={() => handleViewInvoice(shipment.invoiceId)}
                >
                  <Receipt className="w-4 h-4 mr-1" />
                  عرض الفاتورة
                </Button>
                {shipment.paymentStatus === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-green-300 text-green-600 hover:bg-green-50"
                    onClick={() => handleProcessPayment(shipment.invoiceId)}
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    معالجة الدفع
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="space-y-6 arabic-text">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-4">تنسيق عمليات الشحن</h1>
        <p className="text-muted-foreground">إدارة وتنسيق عمليات الشحن الداخلية والخارجية</p>
      </div>

      {/* Navigation Tabs */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex gap-4">
            <Button
              variant={selectedView === 'overview' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('overview')}
              className={selectedView === 'overview' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <Building className="h-4 w-4 ml-2" />
              نظرة عامة
            </Button>
            <Button
              variant={selectedView === 'internal' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('internal')}
              className={selectedView === 'internal' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <Truck className="h-4 w-4 ml-2" />
              الشحن الداخلي
            </Button>
            <Button
              variant={selectedView === 'external' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('external')}
              className={selectedView === 'external' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <Globe className="h-4 w-4 ml-2" />
              الشحن الخارجي
            </Button>
            <Button
              variant={selectedView === 'insurance' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('insurance')}
              className={selectedView === 'insurance' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <Shield className="h-4 w-4 ml-2" />
              التأمين اللامركزي
            </Button>
            <Button
              variant={selectedView === 'rating' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('rating')}
              className={selectedView === 'rating' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <Star className="h-4 w-4 ml-2" />
              التقييم والسمعة
            </Button>
            <Button
              variant={selectedView === 'payment' ? 'default' : 'ghost'}
              onClick={() => setSelectedView('payment')}
              className={selectedView === 'payment' ? 'btn-primary' : 'hover:bg-primary/10'}
            >
              <CreditCard className="h-4 w-4 ml-2" />
              النظام المالي
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Content */}
      {selectedView === 'overview' && <OverviewTab />}
      {selectedView === 'internal' && <InternalTab />}
      {selectedView === 'external' && <ExternalTab />}
      {selectedView === 'insurance' && <InsuranceTab />}
      {selectedView === 'rating' && <RatingTab />}
      {selectedView === 'payment' && <PaymentTab />}

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/10 border-primary/20">
              <div className="p-3 rounded-full bg-blue-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">إنشاء شحنة جديدة</h3>
                <p className="text-sm text-muted-foreground">أضف شحنة داخلية أو خارجية</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/10 border-primary/20">
              <div className="p-3 rounded-full bg-green-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">إدارة الشركاء</h3>
                <p className="text-sm text-muted-foreground">إدارة شركات الشحن الخارجية</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-emerald-50 border-emerald-200"
              onClick={() => setSelectedView('insurance')}
            >
              <div className="p-3 rounded-full bg-emerald-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">التأمين اللامركزي</h3>
                <p className="text-sm text-muted-foreground">إدارة سياسات التأمين</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-yellow-50 border-yellow-200"
              onClick={() => setSelectedView('rating')}
            >
              <div className="p-3 rounded-full bg-yellow-500">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">التقييم والسمعة</h3>
                <p className="text-sm text-muted-foreground">نظام التقييم اللامركزي</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-indigo-50 border-indigo-200"
              onClick={() => setSelectedView('payment')}
            >
              <div className="p-3 rounded-full bg-indigo-500">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">النظام المالي</h3>
                <p className="text-sm text-muted-foreground">8 عملات رقمية وفواتير ذكية</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/10 border-primary/20">
              <div className="p-3 rounded-full bg-purple-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">تقارير الأداء</h3>
                <p className="text-sm text-muted-foreground">عرض تقارير مفصلة</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default ShippingCoordination;

