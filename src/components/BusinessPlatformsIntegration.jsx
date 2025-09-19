import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, Globe, Settings, BarChart3, Package, Users, 
  CheckCircle, AlertCircle, RefreshCw, ExternalLink, 
  Plus, Trash2, Edit, Eye, Zap, Shield, Link,
  Wallet, CreditCard, Coins, TrendingUp, Activity,
  Database, Server, Lock, ArrowRight, ArrowLeft
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import businessPlatformsService from "../services/businessPlatformsService";
import web3PaymentGatewayService from "../services/web3PaymentGatewayService";

const BusinessPlatformsIntegration = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [connectionStatus, setConnectionStatus] = useState({});
  const [platformAnalytics, setPlatformAnalytics] = useState({});
  const [allOrders, setAllOrders] = useState({});
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [connectionForm, setConnectionForm] = useState({});
  
  // بوابات الدفع Web3
  const [paymentMethods, setPaymentMethods] = useState({});
  const [activeWallets, setActiveWallets] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentForm, setPaymentForm] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    try {
      setIsLoading(true);
      
      // تهيئة خدمات منصات الأعمال وبوابات الدفع
      await Promise.all([
        businessPlatformsService.init(),
        web3PaymentGatewayService.init()
      ]);
      
      setIsInitialized(true);
      
      // تحميل البيانات الأولية
      await loadInitialData();
    } catch (error) {
      console.error('Failed to initialize services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      // تحميل حالة الاتصالات
      const status = businessPlatformsService.getConnectionStatus();
      setConnectionStatus(status);
      
      // تحميل التحليلات
      const analytics = await businessPlatformsService.getAllAnalytics();
      if (analytics.success) {
        setPlatformAnalytics(analytics.analytics);
      }
      
      // تحميل الطلبات
      const orders = await businessPlatformsService.getAllOrders();
      if (orders.success) {
        setAllOrders(orders.orders);
      }
      
      // تحميل بيانات بوابات الدفع
      const paymentMethodsData = web3PaymentGatewayService.getPaymentMethods();
      setPaymentMethods(paymentMethodsData);
      
      const activeWalletsData = web3PaymentGatewayService.getActiveConnections();
      setActiveWallets(activeWalletsData);
      
      const paymentHistoryData = web3PaymentGatewayService.getPaymentHistory();
      setPaymentHistory(paymentHistoryData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const handleConnectPlatform = async () => {
    try {
      setIsLoading(true);
      
      const result = await businessPlatformsService.connectPlatform(selectedPlatform, connectionForm);
      
      if (result.success) {
        setShowConnectDialog(false);
        setConnectionForm({});
        setSelectedPlatform("");
        await loadInitialData();
      } else {
        console.error('Failed to connect platform:', result.error);
      }
    } catch (error) {
      console.error('Failed to connect platform:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectPlatform = async (platformName) => {
    try {
      setIsLoading(true);
      
      const result = await businessPlatformsService.disconnectPlatform(platformName);
      
      if (result.success) {
        await loadInitialData();
      } else {
        console.error('Failed to disconnect platform:', result.error);
      }
    } catch (error) {
      console.error('Failed to disconnect platform:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    await loadInitialData();
    setIsLoading(false);
  };

  // دوال إدارة بوابات الدفع
  const handleConnectWallet = async (walletType, chainId = 'ethereum') => {
    try {
      setIsLoading(true);
      
      const result = await web3PaymentGatewayService.connectWallet(walletType, chainId);
      
      if (result.success) {
        await loadInitialData();
      } else {
        console.error('Failed to connect wallet:', result.error);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectWallet = async (walletType) => {
    try {
      setIsLoading(true);
      
      const result = await web3PaymentGatewayService.disconnectWallet(walletType);
      
      if (result.success) {
        await loadInitialData();
      } else {
        console.error('Failed to disconnect wallet:', result.error);
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    try {
      setIsLoading(true);
      
      const result = await web3PaymentGatewayService.processPayment(paymentForm);
      
      if (result.success) {
        setShowPaymentDialog(false);
        setPaymentForm({});
        setSelectedPaymentMethod("");
        await loadInitialData();
      } else {
        console.error('Failed to process payment:', result.error);
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-gray-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const renderConnectionForm = () => {
    switch (selectedPlatform) {
      case 'shopify':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="shopDomain">Shop Domain</Label>
              <Input
                id="shopDomain"
                placeholder="your-shop.myshopify.com"
                value={connectionForm.shopDomain || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, shopDomain: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="accessToken">Access Token</Label>
              <Input
                id="accessToken"
                type="password"
                placeholder="shpat_..."
                value={connectionForm.accessToken || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, accessToken: e.target.value }))}
              />
            </div>
          </div>
        );
      
      case 'woocommerce':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteUrl">WordPress Site URL</Label>
              <Input
                id="siteUrl"
                placeholder="https://your-site.com"
                value={connectionForm.siteUrl || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, siteUrl: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="consumerKey">Consumer Key</Label>
              <Input
                id="consumerKey"
                placeholder="ck_..."
                value={connectionForm.consumerKey || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, consumerKey: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="consumerSecret">Consumer Secret</Label>
              <Input
                id="consumerSecret"
                type="password"
                placeholder="cs_..."
                value={connectionForm.consumerSecret || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, consumerSecret: e.target.value }))}
              />
            </div>
          </div>
        );
      
      case 'wix':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="instanceId">Instance ID</Label>
              <Input
                id="instanceId"
                placeholder="Instance ID from Wix"
                value={connectionForm.instanceId || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, instanceId: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="accessToken">Access Token</Label>
              <Input
                id="accessToken"
                type="password"
                placeholder="Access Token"
                value={connectionForm.accessToken || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, accessToken: e.target.value }))}
              />
            </div>
          </div>
        );
      
      case 'easyorder':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="merchantId">Merchant ID</Label>
              <Input
                id="merchantId"
                placeholder="Merchant ID"
                value={connectionForm.merchantId || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, merchantId: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                placeholder="API Key"
                value={connectionForm.apiKey || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                placeholder="API Secret"
                value={connectionForm.apiSecret || ''}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, apiSecret: e.target.value }))}
              />
            </div>
          </div>
        );
      
      default:
        return null;
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
            تكامل سلس مع منصات الأعمال العالمية
          </h1>
          <p className="text-white/80 text-lg mb-6">
            ربط متكامل مع Shopify و WooCommerce و Wix وإيزي أوردر
          </p>
          
          {/* Payment Gateway Status */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
              <Wallet className="w-5 h-5 text-blue-400" />
              <span className="text-white text-sm">Web3 Payments</span>
              <Badge variant="secondary" className="text-xs">
                {activeWallets.length} محفظة متصلة
              </Badge>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
              <Database className="w-5 h-5 text-green-400" />
              <span className="text-white text-sm">ICP Integration</span>
              <Badge variant="secondary" className="text-xs">
                نشط
              </Badge>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm">Blockchain Security</span>
              <Badge variant="secondary" className="text-xs">
                محمي
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Platform Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {Object.entries(businessPlatformsService.getAllPlatformInfo()).map(([platformName, info]) => {
            const isConnected = connectionStatus[platformName]?.connected || false;
            
            return (
              <Card key={platformName} className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                        style={{ backgroundColor: info.color }}
                      >
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{info.name}</h3>
                        <p className="text-white/70 text-sm">{info.description}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 ${getStatusColor(isConnected ? 'connected' : 'disconnected')}`}>
                      {getStatusIcon(isConnected ? 'connected' : 'disconnected')}
                      <span className="text-sm font-medium">
                        {isConnected ? 'متصل' : 'غير متصل'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {info.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    {isConnected ? (
                      <Button
                        onClick={() => handleDisconnectPlatform(platformName)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        قطع الاتصال
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedPlatform(platformName);
                          setShowConnectDialog(true);
                        }}
                        size="sm"
                        className="flex-1"
                        style={{ backgroundColor: info.color }}
                      >
                        <Link className="w-4 h-4 mr-1" />
                        ربط
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-lg border border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-white data-[state=active]:bg-white/20">
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-white data-[state=active]:bg-white/20">
              بوابات الدفع
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white/20">
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connected Platforms */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Link className="w-5 h-5 text-green-400" />
                    المنصات المتصلة
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {businessPlatformsService.getConnectedPlatforms().length} منصة متصلة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {businessPlatformsService.getConnectedPlatforms().map((platformName) => {
                      const info = businessPlatformsService.getPlatformInfo(platformName);
                      const status = connectionStatus[platformName];
                      
                      return (
                        <div key={platformName} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                              style={{ backgroundColor: info.color }}
                            >
                              {info.icon}
                            </div>
                            <div>
                              <div className="text-white font-medium">{info.name}</div>
                              <div className="text-white/70 text-sm">متصل منذ {new Date(status.connectedAt).toLocaleDateString('ar-SA')}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-400 text-sm">نشط</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Platform Features */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    المميزات المتاحة
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    جميع المميزات المدعومة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Package className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">إدارة الطلبات</div>
                        <div className="text-white/70 text-sm">مزامنة الطلبات من جميع المنصات</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="text-white font-medium">التحليلات</div>
                        <div className="text-white/70 text-sm">تقارير مفصلة لكل منصة</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Shield className="w-6 h-6 text-purple-400" />
                      <div>
                        <div className="text-white font-medium">الأمان</div>
                        <div className="text-white/70 text-sm">حماية البيانات والاتصالات</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-400" />
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleRefreshData}
                    disabled={isLoading}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    تحديث البيانات
                  </Button>
                  <Button
                    onClick={() => setActiveTab('orders')}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    عرض الطلبات
                  </Button>
                  <Button
                    onClick={() => setActiveTab('analytics')}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    التحليلات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    طرق الدفع المتاحة
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Web3 و ICP و المدفوعات التقليدية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(paymentMethods).map(([methodKey, method]) => (
                      <div key={methodKey} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                            style={{ backgroundColor: method.color }}
                          >
                            {method.icon}
                          </div>
                          <div>
                            <div className="text-white font-medium">{method.name}</div>
                            <div className="text-white/70 text-sm">
                              {method.methods.slice(0, 2).join(', ')}
                              {method.methods.length > 2 && ` +${method.methods.length - 2} أخرى`}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedPaymentMethod(methodKey);
                            setShowPaymentDialog(true);
                          }}
                          size="sm"
                          style={{ backgroundColor: method.color }}
                        >
                          <ArrowRight className="w-4 h-4 mr-1" />
                          استخدام
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Wallets */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-400" />
                    المحافظ المتصلة
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {activeWallets.length} محفظة نشطة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeWallets.map((walletType, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium capitalize">{walletType}</div>
                            <div className="text-white/70 text-sm">متصل</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDisconnectWallet(walletType)}
                          variant="outline"
                          size="sm"
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {activeWallets.length === 0 && (
                      <div className="text-center py-8 text-white/70">
                        <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>لا توجد محافظ متصلة</p>
                        <p className="text-sm">قم بربط محفظة لبدء استخدام المدفوعات</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  سجل المدفوعات
                </CardTitle>
                <CardDescription className="text-white/70">
                  آخر المعاملات المالية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentHistory.slice(0, 5).map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {payment.amount} {payment.currency}
                          </div>
                          <div className="text-white/70 text-sm">
                            {payment.paymentMethod} - {payment.walletType}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {new Date(payment.timestamp).toLocaleDateString('ar-SA')}
                        </div>
                        <div className="text-white/70 text-sm">
                          {payment.txHash ? payment.txHash.substring(0, 10) + '...' : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {paymentHistory.length === 0 && (
                    <div className="text-center py-8 text-white/70">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد معاملات مالية</p>
                      <p className="text-sm">ستظهر معاملاتك هنا عند إجرائها</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(allOrders).map(([platformName, orders]) => {
                const info = businessPlatformsService.getPlatformInfo(platformName);
                
                return (
                  <Card key={platformName} className="bg-white/10 backdrop-blur-lg border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                          style={{ backgroundColor: info.color }}
                        >
                          {info.icon}
                        </div>
                        {info.name} - الطلبات
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        {orders?.length || 0} طلب
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {orders?.slice(0, 5).map((order, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div>
                              <div className="text-white font-medium">طلب #{order.id || order.number}</div>
                              <div className="text-white/70 text-sm">
                                {order.customer?.name || order.billing?.first_name || 'عميل'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">
                                {order.total || order.total_price} {order.currency || 'SAR'}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {order.status || 'pending'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(platformAnalytics).map(([platformName, analytics]) => {
                const info = businessPlatformsService.getPlatformInfo(platformName);
                
                if (!analytics) return null;
                
                return (
                  <Card key={platformName} className="bg-white/10 backdrop-blur-lg border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                          style={{ backgroundColor: info.color }}
                        >
                          {info.icon}
                        </div>
                        {info.name} - التحليلات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-white">{analytics.totalOrders}</div>
                            <div className="text-white/70 text-sm">إجمالي الطلبات</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-white">{analytics.totalRevenue}</div>
                            <div className="text-white/70 text-sm">إجمالي الإيرادات</div>
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-xl font-bold text-white">{analytics.averageOrderValue}</div>
                          <div className="text-white/70 text-sm">متوسط قيمة الطلب</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  إعدادات التكامل
                </CardTitle>
                <CardDescription className="text-white/70">
                  إدارة إعدادات منصات الأعمال
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-medium">إعداد Webhooks</div>
                      <div className="text-white/70 text-sm">تلقائي لجميع المنصات المتصلة</div>
                    </div>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      إعداد
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-medium">مزامنة البيانات</div>
                      <div className="text-white/70 text-sm">كل 15 دقيقة</div>
                    </div>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      تحديث
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Connect Platform Dialog */}
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogContent className="bg-white/95 backdrop-blur-lg border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-gray-800">
                ربط {selectedPlatform && businessPlatformsService.getPlatformInfo(selectedPlatform)?.name}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                أدخل بيانات الاتصال للمنصة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {renderConnectionForm()}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleConnectPlatform}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'جاري الربط...' : 'ربط المنصة'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConnectDialog(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="bg-white/95 backdrop-blur-lg border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-gray-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                معالجة الدفع
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {selectedPaymentMethod && paymentMethods[selectedPaymentMethod]?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">المبلغ</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={paymentForm.amount || ''}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="currency">العملة</Label>
                <Select
                  value={paymentForm.currency || ''}
                  onValueChange={(value) => setPaymentForm(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="ICP">ICP</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="MATIC">MATIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="recipient">عنوان المستلم</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={paymentForm.recipientAddress || ''}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, recipientAddress: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="wallet">المحفظة</Label>
                <Select
                  value={paymentForm.walletType || ''}
                  onValueChange={(value) => setPaymentForm(prev => ({ ...prev, walletType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المحفظة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metamask">MetaMask</SelectItem>
                    <SelectItem value="walletconnect">WalletConnect</SelectItem>
                    <SelectItem value="coinbase">Coinbase Wallet</SelectItem>
                    <SelectItem value="phantom">Phantom</SelectItem>
                    <SelectItem value="internet-identity">Internet Identity</SelectItem>
                    <SelectItem value="plug">Plug Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleProcessPayment}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'جاري المعالجة...' : 'معالجة الدفع'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BusinessPlatformsIntegration;
