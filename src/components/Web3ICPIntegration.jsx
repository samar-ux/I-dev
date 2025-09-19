import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Shield, Zap, TrendingUp, Users, Package, Truck, Store,
  Wallet, CreditCard, BarChart3, Activity, CheckCircle, AlertCircle,
  RefreshCw, ExternalLink, Settings, Database, Server, Lock
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import cryptoService from "../services/cryptoService";
import smartContractService from "../services/smartContractService";
import icpBackendService from "../services/icpBackendService";

const Web3ICPIntegration = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [systemStatus, setSystemStatus] = useState({
    crypto: 'disconnected',
    contracts: 'disconnected',
    icp: 'disconnected'
  });
  const [cryptoBalances, setCryptoBalances] = useState({});
  const [contractStats, setContractStats] = useState({});
  const [icpStats, setIcpStats] = useState({});

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      setIsLoading(true);
      
      // تهيئة الخدمات المختلفة
      await Promise.all([
        cryptoService.init(),
        smartContractService.init(),
        icpBackendService.init()
      ]);
      
      setIsInitialized(true);
      setSystemStatus({
        crypto: 'connected',
        contracts: 'connected',
        icp: 'connected'
      });
      
      // تحميل البيانات الأولية
      await loadInitialData();
      
    } catch (error) {
      console.error('Failed to initialize services:', error);
      setSystemStatus({
        crypto: 'error',
        contracts: 'error',
        icp: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      // تحميل أرصدة العملات الرقمية
      await loadCryptoBalances();
      
      // تحميل إحصائيات العقود الذكية
      await loadContractStats();
      
      // تحميل إحصائيات ICP
      await loadICPStats();
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const loadCryptoBalances = async () => {
    try {
      const balances = {};
      const currencies = cryptoService.getSupportedCurrencies();
      
      for (const currency of currencies) {
        const price = cryptoService.getPrice(currency);
        balances[currency] = {
          price: price,
          currencyInfo: cryptoService.getCurrencyInfo(currency)
        };
      }
      
      setCryptoBalances(balances);
    } catch (error) {
      console.error('Failed to load crypto balances:', error);
    }
  };

  const loadContractStats = async () => {
    try {
      const ethereumInfo = smartContractService.getContractInfo('ethereum');
      const icpInfo = smartContractService.getContractInfo('icp');
      
      setContractStats({
        ethereum: ethereumInfo,
        icp: icpInfo,
        platforms: smartContractService.getSupportedPlatforms()
      });
    } catch (error) {
      console.error('Failed to load contract stats:', error);
    }
  };

  const loadICPStats = async () => {
    try {
      const healthCheck = await icpBackendService.healthCheck();
      const canisters = icpBackendService.getAllCanisters();
      
      setIcpStats({
        healthCheck,
        canisters,
        totalCanisters: canisters.length
      });
    } catch (error) {
      console.error('Failed to load ICP stats:', error);
    }
  };

  const handleConnectWallet = async (walletType = 'metamask') => {
    try {
      setIsLoading(true);
      const result = await cryptoService.connectWallet(walletType);
      
      if (result.success) {
        setSystemStatus(prev => ({
          ...prev,
          crypto: 'connected'
        }));
        
        // تحديث الأرصدة بعد الاتصال
        await loadCryptoBalances();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    await loadInitialData();
    setIsLoading(false);
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
            البنية التحتية اللامركزية المتكاملة
          </h1>
          <p className="text-white/80 text-lg">
            نظام متكامل يجمع بين ICP و Ethereum والعملات الرقمية
          </p>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold">العملات الرقمية</h3>
                    <p className="text-white/70 text-sm">8 عملات مدعومة</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${getStatusColor(systemStatus.crypto)}`}>
                  {getStatusIcon(systemStatus.crypto)}
                  <span className="text-sm font-medium">
                    {systemStatus.crypto === 'connected' ? 'متصل' : 
                     systemStatus.crypto === 'error' ? 'خطأ' : 'غير متصل'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold">العقود الذكية</h3>
                    <p className="text-white/70 text-sm">Ethereum & ICP</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${getStatusColor(systemStatus.contracts)}`}>
                  {getStatusIcon(systemStatus.contracts)}
                  <span className="text-sm font-medium">
                    {systemStatus.contracts === 'connected' ? 'متصل' : 
                     systemStatus.contracts === 'error' ? 'خطأ' : 'غير متصل'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="text-white font-semibold">ICP Backend</h3>
                    <p className="text-white/70 text-sm">Rust على ICP</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${getStatusColor(systemStatus.icp)}`}>
                  {getStatusIcon(systemStatus.icp)}
                  <span className="text-sm font-medium">
                    {systemStatus.icp === 'connected' ? 'متصل' : 
                     systemStatus.icp === 'error' ? 'خطأ' : 'غير متصل'}
                  </span>
                </div>
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
            <TabsTrigger value="crypto" className="text-white data-[state=active]:bg-white/20">
              العملات الرقمية
            </TabsTrigger>
            <TabsTrigger value="contracts" className="text-white data-[state=active]:bg-white/20">
              العقود الذكية
            </TabsTrigger>
            <TabsTrigger value="icp" className="text-white data-[state=active]:bg-white/20">
              ICP Backend
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Supported Cryptocurrencies */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    العملات المدعومة
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    8 عملات رقمية رئيسية مدعومة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(cryptoService.getAllCurrencyInfo()).map(([symbol, info]) => (
                      <div key={symbol} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: info.color }}
                        >
                          {info.icon}
                        </div>
                        <div>
                          <div className="text-white font-medium">{symbol}</div>
                          <div className="text-white/70 text-xs">{info.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Architecture */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-400" />
                    البنية التحتية
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    نظام متكامل لامركزي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Server className="w-6 h-6 text-purple-400" />
                      <div>
                        <div className="text-white font-medium">ICP Canisters</div>
                        <div className="text-white/70 text-sm">6 Canisters نشطة</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">Smart Contracts</div>
                        <div className="text-white/70 text-sm">Ethereum & ICP</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Wallet className="w-6 h-6 text-orange-400" />
                      <div>
                        <div className="text-white font-medium">Multi-Wallet Support</div>
                        <div className="text-white/70 text-sm">MetaMask, WalletConnect</div>
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
                  <Zap className="w-5 h-5 text-yellow-400" />
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => handleConnectWallet('metamask')}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    ربط MetaMask
                  </Button>
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
                    onClick={() => setActiveTab('contracts')}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    العقود الذكية
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crypto Tab */}
          <TabsContent value="crypto" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(cryptoBalances).map(([symbol, data]) => (
                <Card key={symbol} className="bg-white/10 backdrop-blur-lg border border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: data.currencyInfo.color }}
                      >
                        {data.currencyInfo.icon}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ${data.price?.toFixed(2) || '0.00'}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{symbol}</div>
                      <div className="text-white/70 text-sm">{data.currencyInfo.name}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Ethereum Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contractStats.ethereum?.contracts?.map((contract, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{contract}</div>
                          <div className="text-white/70 text-sm">Contract Address</div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/70" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-400" />
                    ICP Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contractStats.icp?.contracts?.map((contract, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{contract}</div>
                          <div className="text-white/70 text-sm">Canister ID</div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/70" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ICP Tab */}
          <TabsContent value="icp" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    ICP Canisters Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {icpStats.canisters?.map((canister, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{canister}</div>
                          <div className="text-white/70 text-sm">Canister</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-400 text-sm">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                    ICP Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Total Canisters</span>
                      <span className="text-white font-semibold">{icpStats.totalCanisters || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Active Canisters</span>
                      <span className="text-white font-semibold">{icpStats.totalCanisters || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Last Update</span>
                      <span className="text-white font-semibold">الآن</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Web3ICPIntegration;
