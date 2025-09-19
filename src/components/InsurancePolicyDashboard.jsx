import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, FileText, DollarSign, TrendingUp, Users, Package, 
  AlertTriangle, CheckCircle, Clock, Zap, Lock, Globe,
  BarChart3, Activity, RefreshCw, Settings, ExternalLink,
  Calculator, CreditCard, Receipt, FileCheck, Smartphone,
  Search, Filter, Download, Upload, Eye, Edit, Trash2,
  Calendar, MapPin, Truck, Box, AlertCircle, Info
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import insuranceSmartContractService from "../services/insuranceSmartContractService";

const InsurancePolicyDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    expiredPolicies: 0,
    totalValue: 0,
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // محاكاة تحميل البيانات من الخدمة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات السياسات
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
          riskCategory: "متوسط",
          customerName: "أحمد محمد",
          customerEmail: "ahmed@example.com",
          customerPhone: "+966501234567",
          description: "شحنة إلكترونيات",
          trackingNumber: "TRK-001-2024",
          carrier: "DHL",
          estimatedDelivery: "2024-02-15"
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
          riskCategory: "عالي",
          customerName: "فاطمة أحمد",
          customerEmail: "fatima@example.com",
          customerPhone: "+966507654321",
          description: "شحنة مجوهرات",
          trackingNumber: "TRK-002-2024",
          carrier: "FedEx",
          estimatedDelivery: "2024-02-20"
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
          riskCategory: "منخفض",
          customerName: "محمد علي",
          customerEmail: "mohammed@example.com",
          customerPhone: "+966509876543",
          description: "شحنة ملابس",
          trackingNumber: "TRK-003-2024",
          carrier: "Aramex",
          estimatedDelivery: "2024-01-15"
        },
        {
          id: "POL-004",
          shipmentId: "SHIP-2024-004",
          value: 75000,
          premium: 3750,
          coverage: 100,
          status: "active",
          createdAt: "2024-02-01",
          expiresAt: "2024-08-01",
          destination: "نيويورك، الولايات المتحدة",
          riskCategory: "متوسط",
          customerName: "سارة خالد",
          customerEmail: "sara@example.com",
          customerPhone: "+966501112223",
          description: "شحنة أدوات طبية",
          trackingNumber: "TRK-004-2024",
          carrier: "UPS",
          estimatedDelivery: "2024-02-25"
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
          reason: "تلف البضائع أثناء النقل",
          customerName: "أحمد محمد",
          description: "تلف جزئي في الشحنة الإلكترونية"
        },
        {
          id: "CLM-002",
          policyId: "POL-002", 
          amount: 35000,
          status: "pending",
          submittedAt: "2024-02-01",
          reason: "فقدان البضائع",
          customerName: "فاطمة أحمد",
          description: "فقدان كامل للشحنة"
        },
        {
          id: "CLM-003",
          policyId: "POL-004",
          amount: 25000,
          status: "processing",
          submittedAt: "2024-02-05",
          reason: "تأخير في التسليم",
          customerName: "سارة خالد",
          description: "تأخير أكثر من 7 أيام"
        }
      ];

      setPolicies(mockPolicies);
      setClaims(mockClaims);

      // حساب الإحصائيات
      const totalPolicies = mockPolicies.length;
      const activePolicies = mockPolicies.filter(p => p.status === 'active').length;
      const expiredPolicies = mockPolicies.filter(p => p.status === 'expired').length;
      const totalValue = mockPolicies.reduce((sum, p) => sum + p.value, 0);
      const totalClaims = mockClaims.length;
      const pendingClaims = mockClaims.filter(c => c.status === 'pending').length;
      const approvedClaims = mockClaims.filter(c => c.status === 'approved').length;

      setStats({
        totalPolicies,
        activePolicies,
        expiredPolicies,
        totalValue,
        totalClaims,
        pendingClaims,
        approvedClaims
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowPolicyDetails(true);
  };

  const handleApproveClaim = async (claimId) => {
    setIsLoading(true);
    try {
      // محاكاة معالجة المطالبة
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setClaims(prev => prev.map(claim => 
        claim.id === claimId 
          ? { ...claim, status: 'approved', processedAt: new Date().toISOString().split('T')[0] }
          : claim
      ));
      
      alert('تم الموافقة على المطالبة بنجاح!');
    } catch (error) {
      console.error('Failed to approve claim:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectClaim = async (claimId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setClaims(prev => prev.map(claim => 
        claim.id === claimId 
          ? { ...claim, status: 'rejected', processedAt: new Date().toISOString().split('T')[0] }
          : claim
      ));
      
      alert('تم رفض المطالبة');
    } catch (error) {
      console.error('Failed to reject claim:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || policy.status === filterStatus;
    const matchesRisk = filterRisk === "all" || policy.riskCategory === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'expired': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      case 'processing': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'expired': return <Badge className="bg-red-100 text-red-800">منتهي</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">معلق</Badge>;
      case 'approved': return <Badge className="bg-green-100 text-green-800">موافق عليه</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>;
      case 'processing': return <Badge className="bg-blue-100 text-blue-800">قيد المعالجة</Badge>;
      default: return <Badge variant="secondary">غير محدد</Badge>;
    }
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
            لوحة إدارة سياسات التأمين
          </h1>
          <p className="text-white/80 text-lg">
            إدارة شاملة لسياسات التأمين والمطالبات
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold">إجمالي السياسات</h3>
                    <p className="text-white/70 text-sm">{stats.totalPolicies} بوليصة</p>
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold">السياسات النشطة</h3>
                    <p className="text-white/70 text-sm">{stats.activePolicies} بوليصة</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {stats.totalPolicies > 0 ? Math.round((stats.activePolicies / stats.totalPolicies) * 100) : 0}%
                  </div>
                  <Progress 
                    value={stats.totalPolicies > 0 ? (stats.activePolicies / stats.totalPolicies) * 100 : 0} 
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
                  <DollarSign className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="text-white font-semibold">إجمالي القيمة</h3>
                    <p className="text-white/70 text-sm">{formatCurrency(stats.totalValue)}</p>
                  </div>
                </div>
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Receipt className="w-8 h-8 text-orange-400" />
                  <div>
                    <h3 className="text-white font-semibold">المطالبات المعلقة</h3>
                    <p className="text-white/70 text-sm">{stats.pendingClaims} مطالبة</p>
                  </div>
                </div>
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg border border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="policies" className="text-white data-[state=active]:bg-white/20">
              السياسات
            </TabsTrigger>
            <TabsTrigger value="claims" className="text-white data-[state=active]:bg-white/20">
              المطالبات
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              التحليلات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Policies */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    السياسات الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {policies.slice(0, 5).map((policy) => (
                      <div key={policy.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{policy.id}</div>
                            <div className="text-white/70 text-sm">{policy.customerName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(policy.status)}
                          <div className="text-white/70 text-sm mt-1">
                            {formatCurrency(policy.value)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Claims */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-orange-400" />
                    المطالبات الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {claims.slice(0, 5).map((claim) => (
                      <div key={claim.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{claim.id}</div>
                            <div className="text-white/70 text-sm">{claim.customerName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(claim.status)}
                          <div className="text-white/70 text-sm mt-1">
                            {formatCurrency(claim.amount)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => setActiveTab('policies')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    عرض جميع السياسات
                  </Button>
                  <Button
                    onClick={() => setActiveTab('claims')}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    معالجة المطالبات
                  </Button>
                  <Button
                    onClick={loadDashboardData}
                    disabled={isLoading}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    تحديث البيانات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            {/* Filters */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <Input
                      placeholder="البحث في السياسات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="حالة السياسة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="expired">منتهي</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="مستوى المخاطر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المستويات</SelectItem>
                      <SelectItem value="منخفض">منخفض</SelectItem>
                      <SelectItem value="متوسط">متوسط</SelectItem>
                      <SelectItem value="عالي">عالي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Policies Table */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white">البوليصة</TableHead>
                      <TableHead className="text-white">العميل</TableHead>
                      <TableHead className="text-white">الوجهة</TableHead>
                      <TableHead className="text-white">القيمة</TableHead>
                      <TableHead className="text-white">المخاطر</TableHead>
                      <TableHead className="text-white">الحالة</TableHead>
                      <TableHead className="text-white">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPolicies.map((policy) => (
                      <TableRow key={policy.id} className="border-white/20">
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{policy.id}</div>
                            <div className="text-white/70 text-sm">{policy.shipmentId}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{policy.customerName}</div>
                            <div className="text-white/70 text-sm">{policy.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-white/70" />
                            {policy.destination}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{formatCurrency(policy.value)}</div>
                            <div className="text-white/70 text-sm">قسط: {formatCurrency(policy.premium)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <Badge variant="outline" className="border-white/30 text-white">
                            {policy.riskCategory}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {getStatusBadge(policy.status)}
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10"
                              onClick={() => handleViewPolicy(policy)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Claims Tab */}
          <TabsContent value="claims" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white">المطالبة</TableHead>
                      <TableHead className="text-white">البوليصة</TableHead>
                      <TableHead className="text-white">العميل</TableHead>
                      <TableHead className="text-white">المبلغ</TableHead>
                      <TableHead className="text-white">السبب</TableHead>
                      <TableHead className="text-white">الحالة</TableHead>
                      <TableHead className="text-white">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.map((claim) => (
                      <TableRow key={claim.id} className="border-white/20">
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{claim.id}</div>
                            <div className="text-white/70 text-sm">{claim.submittedAt}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-white/70" />
                            {claim.policyId}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{claim.customerName}</div>
                            <div className="text-white/70 text-sm">{claim.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          {formatCurrency(claim.amount)}
                        </TableCell>
                        <TableCell className="text-white">
                          {claim.reason}
                        </TableCell>
                        <TableCell className="text-white">
                          {getStatusBadge(claim.status)}
                        </TableCell>
                        <TableCell className="text-white">
                          {claim.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApproveClaim(claim.id)}
                                disabled={isLoading}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-300 hover:bg-red-900/20"
                                onClick={() => handleRejectClaim(claim.id)}
                                disabled={isLoading}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          {claim.status === 'processing' && (
                            <Badge className="bg-blue-100 text-blue-800">قيد المعالجة</Badge>
                          )}
                          {claim.status === 'approved' && (
                            <Badge className="bg-green-100 text-green-800">تمت الموافقة</Badge>
                          )}
                          {claim.status === 'rejected' && (
                            <Badge className="bg-red-100 text-red-800">مرفوض</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                      <span className="text-white font-semibold">{stats.totalPolicies}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">السياسات النشطة</span>
                      <span className="text-white font-semibold">{stats.activePolicies}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">السياسات المنتهية</span>
                      <span className="text-white font-semibold">{stats.expiredPolicies}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي قيمة التأمين</span>
                      <span className="text-white font-semibold">{formatCurrency(stats.totalValue)}</span>
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
                      <span className="text-white font-semibold">{stats.totalClaims}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">المطالبات المعلقة</span>
                      <span className="text-white font-semibold">{stats.pendingClaims}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">المطالبات الموافق عليها</span>
                      <span className="text-white font-semibold">{stats.approvedClaims}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">معدل الموافقة</span>
                      <span className="text-white font-semibold">
                        {stats.totalClaims > 0 ? Math.round((stats.approvedClaims / stats.totalClaims) * 100) : 0}%
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

        {/* Policy Details Modal */}
        <AnimatePresence>
          {showPolicyDetails && selectedPolicy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowPolicyDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">تفاصيل البوليصة</h2>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => setShowPolicyDetails(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">رقم البوليصة</Label>
                      <div className="text-white font-semibold">{selectedPolicy.id}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">رقم الشحنة</Label>
                      <div className="text-white font-semibold">{selectedPolicy.shipmentId}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">اسم العميل</Label>
                      <div className="text-white font-semibold">{selectedPolicy.customerName}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">البريد الإلكتروني</Label>
                      <div className="text-white font-semibold">{selectedPolicy.customerEmail}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">رقم الهاتف</Label>
                      <div className="text-white font-semibold">{selectedPolicy.customerPhone}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">الوجهة</Label>
                      <div className="text-white font-semibold">{selectedPolicy.destination}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">قيمة البضاعة</Label>
                      <div className="text-white font-semibold">{formatCurrency(selectedPolicy.value)}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">قسط التأمين</Label>
                      <div className="text-white font-semibold">{formatCurrency(selectedPolicy.premium)}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">مستوى المخاطر</Label>
                      <div className="text-white font-semibold">{selectedPolicy.riskCategory}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">الحالة</Label>
                      <div>{getStatusBadge(selectedPolicy.status)}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">تاريخ الإنشاء</Label>
                      <div className="text-white font-semibold">{selectedPolicy.createdAt}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">تاريخ الانتهاء</Label>
                      <div className="text-white font-semibold">{selectedPolicy.expiresAt}</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/70">وصف البضاعة</Label>
                    <div className="text-white font-semibold">{selectedPolicy.description}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">رقم التتبع</Label>
                      <div className="text-white font-semibold">{selectedPolicy.trackingNumber}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">شركة الشحن</Label>
                      <div className="text-white font-semibold">{selectedPolicy.carrier}</div>
                    </div>
                    <div>
                      <Label className="text-white/70">التاريخ المتوقع للتسليم</Label>
                      <div className="text-white font-semibold">{selectedPolicy.estimatedDelivery}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InsurancePolicyDashboard;
