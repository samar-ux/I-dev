import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, FileText, DollarSign, TrendingUp, Users, Package, 
  AlertTriangle, CheckCircle, Clock, Zap, Lock, Globe,
  BarChart3, Activity, RefreshCw, Settings, ExternalLink,
  Calculator, CreditCard, Receipt, FileCheck, Smartphone
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const DecentralizedInsurance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [insuranceFund, setInsuranceFund] = useState({
    totalValue: 2500000,
    availableFunds: 1800000,
    activePolicies: 1250,
    claimsProcessed: 89,
    riskLevel: "low"
  });
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [newPolicy, setNewPolicy] = useState({
    shipmentId: "",
    value: "",
    destination: "",
    riskCategory: "",
    coverageType: "",
    description: ""
  });

  useEffect(() => {
    loadInsuranceData();
  }, []);

  const loadInsuranceData = async () => {
    setIsLoading(true);
    try {
      // محاكاة تحميل البيانات
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات السياسات النشطة
      const mockPolicies = [
        {
          id: "POL-001",
          shipmentId: "SHIP-2024-001",
          value: 50000,
          premium: 2500,
          coverage: 100,
          status: "active",
          createdAt: "2024-01-15",
          expiresAt: "2024-07-15",
          destination: "دبي، الإمارات",
          riskCategory: "متوسط"
        },
        {
          id: "POL-002", 
          shipmentId: "SHIP-2024-002",
          value: 120000,
          premium: 6000,
          coverage: 100,
          status: "active",
          createdAt: "2024-01-20",
          expiresAt: "2024-07-20",
          destination: "لندن، المملكة المتحدة",
          riskCategory: "عالي"
        },
        {
          id: "POL-003",
          shipmentId: "SHIP-2024-003", 
          value: 25000,
          premium: 1250,
          coverage: 100,
          status: "expired",
          createdAt: "2023-12-01",
          expiresAt: "2024-01-01",
          destination: "الرياض، السعودية",
          riskCategory: "منخفض"
        }
      ];

      // بيانات المطالبات
      const mockClaims = [
        {
          id: "CLM-001",
          policyId: "POL-001",
          amount: 15000,
          status: "approved",
          submittedAt: "2024-01-25",
          processedAt: "2024-01-28",
          reason: "تلف البضائع أثناء النقل"
        },
        {
          id: "CLM-002",
          policyId: "POL-002", 
          amount: 35000,
          status: "pending",
          submittedAt: "2024-02-01",
          reason: "فقدان البضائع"
        }
      ];

      setPolicies(mockPolicies);
      setClaims(mockClaims);
    } catch (error) {
      console.error('Failed to load insurance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    if (!newPolicy.shipmentId || !newPolicy.value || !newPolicy.destination) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      // محاكاة إنشاء سياسة تأمين جديدة
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const policy = {
        id: `POL-${Date.now()}`,
        shipmentId: newPolicy.shipmentId,
        value: parseFloat(newPolicy.value),
        premium: parseFloat(newPolicy.value) * 0.05, // 5% من قيمة البضاعة
        coverage: 100,
        status: "active",
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        destination: newPolicy.destination,
        riskCategory: newPolicy.riskCategory,
        description: newPolicy.description
      };

      setPolicies(prev => [policy, ...prev]);
      setNewPolicy({
        shipmentId: "",
        value: "",
        destination: "",
        riskCategory: "",
        coverageType: "",
        description: ""
      });

      alert('تم إنشاء بوليصة التأمين بنجاح!');
    } catch (error) {
      console.error('Failed to create policy:', error);
      alert('حدث خطأ أثناء إنشاء بوليصة التأمين');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitClaim = async (policyId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const claim = {
        id: `CLM-${Date.now()}`,
        policyId: policyId,
        amount: Math.floor(Math.random() * 50000) + 10000,
        status: "pending",
        submittedAt: new Date().toISOString().split('T')[0],
        reason: "مطالبة تأمين تلقائية"
      };

      setClaims(prev => [claim, ...prev]);
      alert('تم تقديم المطالبة بنجاح!');
    } catch (error) {
      console.error('Failed to submit claim:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'expired': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      case 'approved': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'expired': return <Badge className="bg-red-100 text-red-800">منتهي</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">معلق</Badge>;
      case 'approved': return <Badge className="bg-green-100 text-green-800">موافق عليه</Badge>;
      default: return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent mb-4">
            نظام التأمين اللامركزي للشحنات
          </h1>
          <p className="text-white/80 text-lg">
            بوليصة تأمين تلقائية وصندوق تأمين ذكي لامركزي
          </p>
        </motion.div>

        {/* Insurance Fund Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold">إجمالي الصندوق</h3>
                    <p className="text-white/70 text-sm">{formatCurrency(insuranceFund.totalValue)}</p>
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold">الأموال المتاحة</h3>
                    <p className="text-white/70 text-sm">{formatCurrency(insuranceFund.availableFunds)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {Math.round((insuranceFund.availableFunds / insuranceFund.totalValue) * 100)}%
                  </div>
                  <Progress 
                    value={(insuranceFund.availableFunds / insuranceFund.totalValue) * 100} 
                    className="w-16 h-2 mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="text-white font-semibold">السياسات النشطة</h3>
                    <p className="text-white/70 text-sm">{insuranceFund.activePolicies} بوليصة</p>
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Receipt className="w-8 h-8 text-orange-400" />
                  <div>
                    <h3 className="text-white font-semibold">المطالبات المعالجة</h3>
                    <p className="text-white/70 text-sm">{insuranceFund.claimsProcessed} مطالبة</p>
                  </div>
                </div>
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-lg border border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="policies" className="text-white data-[state=active]:bg-white/20">
              السياسات
            </TabsTrigger>
            <TabsTrigger value="claims" className="text-white data-[state=active]:bg-white/20">
              المطالبات
            </TabsTrigger>
            <TabsTrigger value="create" className="text-white data-[state=active]:bg-white/20">
              إنشاء بوليصة
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              التحليلات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Smart Contract Features */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-400" />
                    ميزات العقد الذكي
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    نظام تأمين ذكي آمن وشفاف
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      <div>
                        <div className="text-white font-medium">تأمين تلقائي</div>
                        <div className="text-white/70 text-sm">إنشاء بوليصة تأمين تلقائياً</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">حماية شاملة</div>
                        <div className="text-white/70 text-sm">تغطية 100% لقيمة البضائع</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Globe className="w-6 h-6 text-purple-400" />
                      <div>
                        <div className="text-white font-medium">لامركزي</div>
                        <div className="text-white/70 text-sm">لا توجد سلطة مركزية</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    تقييم المخاطر
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    تحليل ذكي للمخاطر المحتملة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">مستوى المخاطر الحالي</span>
                      <Badge className="bg-green-100 text-green-800">منخفض</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">السياسات عالية المخاطر</span>
                      <span className="text-white font-semibold">12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">متوسط قيمة المطالبة</span>
                      <span className="text-white font-semibold">{formatCurrency(25000)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">معدل الموافقة</span>
                      <span className="text-white font-semibold">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "تم إنشاء بوليصة تأمين جديدة", policy: "POL-004", time: "منذ 5 دقائق" },
                    { action: "تم معالجة مطالبة", claim: "CLM-003", time: "منذ 15 دقيقة" },
                    { action: "تم تجديد بوليصة تأمين", policy: "POL-001", time: "منذ ساعة" },
                    { action: "تم إيداع أموال جديدة في الصندوق", amount: "500,000 ريال", time: "منذ ساعتين" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">{activity.action}</div>
                          <div className="text-white/70 text-sm">
                            {activity.policy && `البوليصة: ${activity.policy}`}
                            {activity.claim && `المطالبة: ${activity.claim}`}
                            {activity.amount && `المبلغ: ${activity.amount}`}
                          </div>
                        </div>
                      </div>
                      <span className="text-white/70 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {policies.map((policy) => (
                <Card key={policy.id} className="bg-white/10 backdrop-blur-lg border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <div>
                          <h3 className="text-white font-semibold">{policy.id}</h3>
                          <p className="text-white/70 text-sm">الشحنة: {policy.shipmentId}</p>
                        </div>
                      </div>
                      {getStatusBadge(policy.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-white/70 text-sm">قيمة البضاعة</div>
                        <div className="text-white font-semibold">{formatCurrency(policy.value)}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-sm">قسط التأمين</div>
                        <div className="text-white font-semibold">{formatCurrency(policy.premium)}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-sm">الوجهة</div>
                        <div className="text-white font-semibold">{policy.destination}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-sm">مستوى المخاطر</div>
                        <div className="text-white font-semibold">{policy.riskCategory}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-white/70 text-sm">
                        صالحة حتى: {policy.expiresAt}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10"
                          onClick={() => handleSubmitClaim(policy.id)}
                          disabled={policy.status !== 'active'}
                        >
                          <Receipt className="w-4 h-4 mr-2" />
                          تقديم مطالبة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          عرض التفاصيل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Claims Tab */}
          <TabsContent value="claims" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {claims.map((claim) => (
                <Card key={claim.id} className="bg-white/10 backdrop-blur-lg border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Receipt className="w-8 h-8 text-orange-400" />
                        <div>
                          <h3 className="text-white font-semibold">{claim.id}</h3>
                          <p className="text-white/70 text-sm">البوليصة: {claim.policyId}</p>
                        </div>
                      </div>
                      {getStatusBadge(claim.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-white/70 text-sm">مبلغ المطالبة</div>
                        <div className="text-white font-semibold">{formatCurrency(claim.amount)}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-sm">تاريخ التقديم</div>
                        <div className="text-white font-semibold">{claim.submittedAt}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-sm">تاريخ المعالجة</div>
                        <div className="text-white font-semibold">{claim.processedAt || 'لم يتم المعالجة'}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-sm">السبب</div>
                        <div className="text-white font-semibold">{claim.reason}</div>
                      </div>
                    </div>

                    {claim.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          الموافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-300 hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4 mr-2" />
                          الرفض
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Policy Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  إنشاء بوليصة تأمين جديدة
                </CardTitle>
                <CardDescription className="text-white/70">
                  إنشاء بوليصة تأمين تلقائية للشحنة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">رقم الشحنة *</Label>
                    <Input
                      value={newPolicy.shipmentId}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, shipmentId: e.target.value }))}
                      placeholder="SHIP-2024-XXX"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">قيمة البضاعة (ريال) *</Label>
                    <Input
                      type="number"
                      value={newPolicy.value}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="50000"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">الوجهة *</Label>
                    <Input
                      value={newPolicy.destination}
                      onChange={(e) => setNewPolicy(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="دبي، الإمارات العربية المتحدة"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">مستوى المخاطر</Label>
                    <Select value={newPolicy.riskCategory} onValueChange={(value) => setNewPolicy(prev => ({ ...prev, riskCategory: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="اختر مستوى المخاطر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="منخفض">منخفض</SelectItem>
                        <SelectItem value="متوسط">متوسط</SelectItem>
                        <SelectItem value="عالي">عالي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">وصف البضاعة</Label>
                  <Textarea
                    value={newPolicy.description}
                    onChange={(e) => setNewPolicy(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف تفصيلي للبضائع المراد شحنها..."
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    rows={3}
                  />
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">ملخص البوليصة</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/70">قسط التأمين المقدر:</span>
                      <span className="text-white font-semibold ml-2">
                        {newPolicy.value ? formatCurrency(parseFloat(newPolicy.value) * 0.05) : '0.00 ريال'}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/70">نسبة التغطية:</span>
                      <span className="text-white font-semibold ml-2">100%</span>
                    </div>
                    <div>
                      <span className="text-white/70">مدة الصلاحية:</span>
                      <span className="text-white font-semibold ml-2">6 أشهر</span>
                    </div>
                    <div>
                      <span className="text-white/70">نوع التغطية:</span>
                      <span className="text-white font-semibold ml-2">شاملة</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreatePolicy}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      جاري إنشاء البوليصة...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      إنشاء بوليصة التأمين
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    إحصائيات السياسات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي السياسات</span>
                      <span className="text-white font-semibold">{policies.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">السياسات النشطة</span>
                      <span className="text-white font-semibold">
                        {policies.filter(p => p.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي قيمة التأمين</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(policies.reduce((sum, p) => sum + p.value, 0))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">متوسط قسط التأمين</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(policies.reduce((sum, p) => sum + p.premium, 0) / policies.length || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    إحصائيات المطالبات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي المطالبات</span>
                      <span className="text-white font-semibold">{claims.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">المطالبات المعلقة</span>
                      <span className="text-white font-semibold">
                        {claims.filter(c => c.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">المطالبات الموافق عليها</span>
                      <span className="text-white font-semibold">
                        {claims.filter(c => c.status === 'approved').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي مبلغ المطالبات</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(claims.reduce((sum, c) => sum + c.amount, 0))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  مؤشرات الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">94%</div>
                    <div className="text-white/70">معدل الموافقة على المطالبات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">2.3</div>
                    <div className="text-white/70">متوسط أيام معالجة المطالبات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">98.5%</div>
                    <div className="text-white/70">معدل نجاح التسليم</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DecentralizedInsurance;
