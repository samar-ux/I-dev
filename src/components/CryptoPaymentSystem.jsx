import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, DollarSign, Receipt, Wallet, TrendingUp, 
  CheckCircle, Clock, AlertTriangle, Download, Send, 
  RefreshCw, Settings, Eye, Edit, Trash2, Plus,
  Bitcoin, Ethereum, ArrowUpDown, Calculator, FileText,
  BarChart3, Activity, Users, Package, Truck, Globe
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

const CryptoPaymentSystem = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    customerEmail: "",
    amount: "",
    currency: "BTC",
    description: "",
    dueDate: ""
  });
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [exchangeRates, setExchangeRates] = useState({});

  // العملات المدعومة
  const supportedCurrencies = [
    { symbol: "BTC", name: "Bitcoin", icon: "₿", color: "#f7931a" },
    { symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "#627eea" },
    { symbol: "USDT", name: "Tether", icon: "₮", color: "#26a17b" },
    { symbol: "BNB", name: "Binance Coin", icon: "B", color: "#f3ba2f" },
    { symbol: "ADA", name: "Cardano", icon: "₳", color: "#0033ad" },
    { symbol: "SOL", name: "Solana", icon: "◎", color: "#9945ff" },
    { symbol: "DOT", name: "Polkadot", icon: "●", color: "#e6007a" },
    { symbol: "MATIC", name: "Polygon", icon: "⬟", color: "#8247e5" }
  ];

  useEffect(() => {
    loadPaymentData();
    loadExchangeRates();
  }, []);

  const loadPaymentData = async () => {
    setIsLoading(true);
    try {
      // محاكاة تحميل البيانات
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInvoices = [
        {
          id: "INV-001",
          customerName: "أحمد محمد",
          customerEmail: "ahmed@example.com",
          amount: 0.05,
          currency: "BTC",
          description: "خدمات الشحن",
          status: "paid",
          createdAt: "2024-01-15",
          dueDate: "2024-01-20",
          paidAt: "2024-01-18",
          transactionHash: "0x1234567890abcdef..."
        },
        {
          id: "INV-002",
          customerName: "فاطمة أحمد",
          customerEmail: "fatima@example.com",
          amount: 2.5,
          currency: "ETH",
          description: "تأمين الشحنة",
          status: "pending",
          createdAt: "2024-01-20",
          dueDate: "2024-01-25",
          transactionHash: null
        }
      ];

      const mockPayments = [
        {
          id: "PAY-001",
          invoiceId: "INV-001",
          amount: 0.05,
          currency: "BTC",
          status: "completed",
          timestamp: "2024-01-18T10:30:00Z",
          transactionHash: "0x1234567890abcdef...",
          networkFee: 0.001
        }
      ];

      setInvoices(mockInvoices);
      setPayments(mockPayments);
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExchangeRates = async () => {
    try {
      // محاكاة أسعار الصرف
      const mockRates = {
        BTC: 45000,
        ETH: 3000,
        USDT: 1,
        BNB: 300,
        ADA: 0.5,
        SOL: 100,
        DOT: 7,
        MATIC: 0.8
      };
      setExchangeRates(mockRates);
    } catch (error) {
      console.error('Failed to load exchange rates:', error);
    }
  };

  const handleCreateInvoice = async () => {
    if (!newInvoice.customerName || !newInvoice.amount) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const invoice = {
        id: `INV-${Date.now()}`,
        customerName: newInvoice.customerName,
        customerEmail: newInvoice.customerEmail,
        amount: parseFloat(newInvoice.amount),
        currency: newInvoice.currency,
        description: newInvoice.description,
        status: "pending",
        createdAt: new Date().toISOString().split('T')[0],
        dueDate: newInvoice.dueDate,
        transactionHash: null
      };

      setInvoices(prev => [invoice, ...prev]);
      setNewInvoice({
        customerName: "",
        customerEmail: "",
        amount: "",
        currency: "BTC",
        description: "",
        dueDate: ""
      });

      alert('تم إنشاء الفاتورة بنجاح!');
    } catch (error) {
      console.error('Failed to create invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessPayment = async (invoiceId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) return;

      const payment = {
        id: `PAY-${Date.now()}`,
        invoiceId: invoiceId,
        amount: invoice.amount,
        currency: invoice.currency,
        status: "completed",
        timestamp: new Date().toISOString(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
        networkFee: invoice.amount * 0.01
      };

      setPayments(prev => [payment, ...prev]);
      setInvoices(prev => prev.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, status: 'paid', paidAt: new Date().toISOString().split('T')[0] }
          : inv
      ));

      alert('تم معالجة الدفع بنجاح!');
    } catch (error) {
      console.error('Failed to process payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount, currency) => {
    const currencyInfo = supportedCurrencies.find(c => c.symbol === currency);
    return `${amount} ${currencyInfo?.symbol || currency}`;
  };

  const formatUSD = (amount, currency) => {
    const rate = exchangeRates[currency] || 1;
    const usdAmount = amount * rate;
    return `$${usdAmount.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'overdue': return 'text-red-500';
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return <Badge className="bg-green-100 text-green-800">مدفوعة</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">معلقة</Badge>;
      case 'overdue': return <Badge className="bg-red-100 text-red-800">متأخرة</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-800">مكتملة</Badge>;
      case 'failed': return <Badge className="bg-red-100 text-red-800">فشلت</Badge>;
      default: return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent mb-4">
            النظام المالي المرن والمتكامل
          </h1>
          <p className="text-white/80 text-lg">
            دعم 8 عملات رقمية مع نظام فواتير إلكترونية ذكي
          </p>
        </motion.div>

        {/* Supported Currencies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
        >
          {supportedCurrencies.map((currency) => (
            <Card key={currency.symbol} className="bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-105 transition-transform">
              <CardContent className="p-4 text-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2"
                  style={{ backgroundColor: currency.color }}
                >
                  {currency.icon}
                </div>
                <div className="text-white font-semibold text-sm">{currency.symbol}</div>
                <div className="text-white/70 text-xs">{currency.name}</div>
                <div className="text-white/60 text-xs mt-1">
                  ${exchangeRates[currency.symbol]?.toFixed(2) || '0.00'}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-lg border border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="invoices" className="text-white data-[state=active]:bg-white/20">
              الفواتير
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-white data-[state=active]:bg-white/20">
              المدفوعات
            </TabsTrigger>
            <TabsTrigger value="create" className="text-white data-[state=active]:bg-white/20">
              إنشاء فاتورة
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              التحليلات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Receipt className="w-8 h-8 text-blue-400" />
                      <div>
                        <h3 className="text-white font-semibold">إجمالي الفواتير</h3>
                        <p className="text-white/70 text-sm">{invoices.length} فاتورة</p>
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
                        <h3 className="text-white font-semibold">الفواتير المدفوعة</h3>
                        <p className="text-white/70 text-sm">
                          {invoices.filter(inv => inv.status === 'paid').length} فاتورة
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {invoices.length > 0 ? Math.round((invoices.filter(inv => inv.status === 'paid').length / invoices.length) * 100) : 0}%
                      </div>
                      <Progress 
                        value={invoices.length > 0 ? (invoices.filter(inv => inv.status === 'paid').length / invoices.length) * 100 : 0} 
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
                        <h3 className="text-white font-semibold">إجمالي المدفوعات</h3>
                        <p className="text-white/70 text-sm">{payments.length} دفعة</p>
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
                      <Clock className="w-8 h-8 text-orange-400" />
                      <div>
                        <h3 className="text-white font-semibold">الفواتير المعلقة</h3>
                        <p className="text-white/70 text-sm">
                          {invoices.filter(inv => inv.status === 'pending').length} فاتورة
                        </p>
                      </div>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
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
                    { action: "تم إنشاء فاتورة جديدة", invoice: "INV-003", time: "منذ 5 دقائق" },
                    { action: "تم معالجة دفعة", payment: "PAY-002", time: "منذ 15 دقيقة" },
                    { action: "تم إرسال فاتورة", invoice: "INV-002", time: "منذ ساعة" },
                    { action: "تم تحديث أسعار الصرف", currencies: "8 عملات", time: "منذ ساعتين" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">{activity.action}</div>
                          <div className="text-white/70 text-sm">
                            {activity.invoice && `الفاتورة: ${activity.invoice}`}
                            {activity.payment && `الدفعة: ${activity.payment}`}
                            {activity.currencies && `العملات: ${activity.currencies}`}
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

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white">الفاتورة</TableHead>
                      <TableHead className="text-white">العميل</TableHead>
                      <TableHead className="text-white">المبلغ</TableHead>
                      <TableHead className="text-white">العملة</TableHead>
                      <TableHead className="text-white">الحالة</TableHead>
                      <TableHead className="text-white">تاريخ الاستحقاق</TableHead>
                      <TableHead className="text-white">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-white/20">
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{invoice.id}</div>
                            <div className="text-white/70 text-sm">{invoice.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{invoice.customerName}</div>
                            <div className="text-white/70 text-sm">{invoice.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{formatCurrency(invoice.amount, invoice.currency)}</div>
                            <div className="text-white/70 text-sm">{formatUSD(invoice.amount, invoice.currency)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: supportedCurrencies.find(c => c.symbol === invoice.currency)?.color }}
                            >
                              {supportedCurrencies.find(c => c.symbol === invoice.currency)?.icon}
                            </div>
                            {invoice.currency}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          {getStatusBadge(invoice.status)}
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="text-sm">{invoice.dueDate}</div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex gap-2">
                            {invoice.status === 'pending' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleProcessPayment(invoice.id)}
                                disabled={isLoading}
                              >
                                <CreditCard className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              <Download className="w-4 h-4" />
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

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white">الدفعة</TableHead>
                      <TableHead className="text-white">الفاتورة</TableHead>
                      <TableHead className="text-white">المبلغ</TableHead>
                      <TableHead className="text-white">العملة</TableHead>
                      <TableHead className="text-white">الحالة</TableHead>
                      <TableHead className="text-white">التاريخ</TableHead>
                      <TableHead className="text-white">الرسوم</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id} className="border-white/20">
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{payment.id}</div>
                            <div className="text-white/70 text-sm truncate max-w-32">
                              {payment.transactionHash}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="font-medium">{payment.invoiceId}</div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{formatCurrency(payment.amount, payment.currency)}</div>
                            <div className="text-white/70 text-sm">{formatUSD(payment.amount, payment.currency)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: supportedCurrencies.find(c => c.symbol === payment.currency)?.color }}
                            >
                              {supportedCurrencies.find(c => c.symbol === payment.currency)?.icon}
                            </div>
                            {payment.currency}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          {getStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="text-sm">
                            {new Date(payment.timestamp).toLocaleDateString('ar-SA')}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="text-sm">
                            {formatCurrency(payment.networkFee, payment.currency)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Invoice Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-green-400" />
                  إنشاء فاتورة إلكترونية جديدة
                </CardTitle>
                <CardDescription className="text-white/70">
                  إنشاء فاتورة ذكية مع دعم العملات الرقمية المتعددة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">اسم العميل *</Label>
                    <Input
                      value={newInvoice.customerName}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="أحمد محمد"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={newInvoice.customerEmail}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="ahmed@example.com"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">المبلغ *</Label>
                    <Input
                      type="number"
                      step="0.00000001"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.05"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">العملة *</Label>
                    <Select value={newInvoice.currency} onValueChange={(value) => setNewInvoice(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="اختر العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedCurrencies.map((currency) => (
                          <SelectItem key={currency.symbol} value={currency.symbol}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold text-xs"
                                style={{ backgroundColor: currency.color }}
                              >
                                {currency.icon}
                              </div>
                              {currency.symbol} - {currency.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">تاريخ الاستحقاق</Label>
                    <Input
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">وصف الخدمة</Label>
                  <Textarea
                    value={newInvoice.description}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف تفصيلي للخدمة المقدمة..."
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    rows={3}
                  />
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">ملخص الفاتورة</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/70">المبلغ:</span>
                      <span className="text-white font-semibold ml-2">
                        {newInvoice.amount ? formatCurrency(newInvoice.amount, newInvoice.currency) : '0.00'}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/70">القيمة بالدولار:</span>
                      <span className="text-white font-semibold ml-2">
                        {newInvoice.amount ? formatUSD(newInvoice.amount, newInvoice.currency) : '$0.00'}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/70">العملة:</span>
                      <span className="text-white font-semibold ml-2">{newInvoice.currency}</span>
                    </div>
                    <div>
                      <span className="text-white/70">تاريخ الاستحقاق:</span>
                      <span className="text-white font-semibold ml-2">
                        {newInvoice.dueDate || 'غير محدد'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreateInvoice}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      جاري إنشاء الفاتورة...
                    </>
                  ) : (
                    <>
                      <Receipt className="w-4 h-4 mr-2" />
                      إنشاء الفاتورة الإلكترونية
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
                    إحصائيات الفواتير
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي الفواتير</span>
                      <span className="text-white font-semibold">{invoices.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">الفواتير المدفوعة</span>
                      <span className="text-white font-semibold">
                        {invoices.filter(inv => inv.status === 'paid').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">الفواتير المعلقة</span>
                      <span className="text-white font-semibold">
                        {invoices.filter(inv => inv.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">معدل الدفع</span>
                      <span className="text-white font-semibold">
                        {invoices.length > 0 ? Math.round((invoices.filter(inv => inv.status === 'paid').length / invoices.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    إحصائيات المدفوعات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي المدفوعات</span>
                      <span className="text-white font-semibold">{payments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">المدفوعات المكتملة</span>
                      <span className="text-white font-semibold">
                        {payments.filter(p => p.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي الرسوم</span>
                      <span className="text-white font-semibold">
                        {payments.reduce((sum, p) => sum + p.networkFee, 0).toFixed(4)} BTC
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">معدل النجاح</span>
                      <span className="text-white font-semibold">
                        {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Currency Distribution */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bitcoin className="w-5 h-5 text-orange-400" />
                  توزيع العملات المستخدمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {supportedCurrencies.map((currency) => {
                    const count = invoices.filter(inv => inv.currency === currency.symbol).length;
                    const percentage = invoices.length > 0 ? (count / invoices.length) * 100 : 0;
                    
                    return (
                      <div key={currency.symbol} className="text-center p-3 bg-white/5 rounded-lg">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2"
                          style={{ backgroundColor: currency.color }}
                        >
                          {currency.icon}
                        </div>
                        <div className="text-white font-semibold text-sm">{currency.symbol}</div>
                        <div className="text-white/70 text-xs">{count} فاتورة</div>
                        <div className="text-white/60 text-xs">{percentage.toFixed(1)}%</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CryptoPaymentSystem;
