import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Package, Truck, Store, DollarSign, TrendingUp, 
  AlertTriangle, CheckCircle, Clock, BarChart3, PieChart,
  Activity, Globe, Shield, Settings, UserPlus, UserMinus,
  Edit, Trash2, Eye, Download, Upload, RefreshCw,
  Calendar, MapPin, Phone, Mail, Star, Award,
  Zap, Lock, Unlock, Ban, Check, X, Plus,
  Filter, Search, SortAsc, SortDesc, MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import '../App.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // البيانات الإحصائية
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalShipments: 0,
    pendingShipments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalStores: 0,
    activeDrivers: 0,
    systemHealth: 95,
    uptime: 99.9
  });

  // قائمة المستخدمين
  const [users, setUsers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [stores, setStores] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // إعدادات النظام
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: true,
    autoApproval: false,
    maxFileSize: 10,
    sessionTimeout: 30,
    backupFrequency: 'daily'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // محاكاة تحميل البيانات
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات إحصائية وهمية
      setStats({
        totalUsers: 1250,
        activeUsers: 980,
        totalShipments: 5670,
        pendingShipments: 234,
        totalRevenue: 1250000,
        monthlyRevenue: 85000,
        totalStores: 156,
        activeDrivers: 89,
        systemHealth: 95,
        uptime: 99.9
      });

      // بيانات المستخدمين الوهمية
      const mockUsers = [
        {
          id: 1,
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '0501234567',
          type: 'store_owner',
          status: 'active',
          registrationDate: '2024-01-15',
          lastLogin: '2024-01-20',
          totalOrders: 45,
          rating: 4.8,
          verified: true
        },
        {
          id: 2,
          name: 'فاطمة أحمد',
          email: 'fatima@example.com',
          phone: '0507654321',
          type: 'driver',
          status: 'active',
          registrationDate: '2024-01-10',
          lastLogin: '2024-01-20',
          totalOrders: 120,
          rating: 4.9,
          verified: true
        },
        {
          id: 3,
          name: 'محمد سالم',
          email: 'mohammed@example.com',
          phone: '0509876543',
          type: 'customer',
          status: 'pending',
          registrationDate: '2024-01-18',
          lastLogin: '2024-01-19',
          totalOrders: 8,
          rating: 4.5,
          verified: false
        },
        {
          id: 4,
          name: 'نور الدين',
          email: 'nour@example.com',
          phone: '0504567890',
          type: 'admin',
          status: 'active',
          registrationDate: '2023-12-01',
          lastLogin: '2024-01-20',
          totalOrders: 0,
          rating: 5.0,
          verified: true
        }
      ];

      setUsers(mockUsers);

      // بيانات الشحنات الوهمية
      const mockShipments = [
        {
          id: 'SH001',
          customer: 'أحمد محمد',
          driver: 'فاطمة أحمد',
          status: 'delivered',
          amount: 250,
          date: '2024-01-20',
          from: 'الرياض',
          to: 'جدة'
        },
        {
          id: 'SH002',
          customer: 'محمد سالم',
          driver: 'علي حسن',
          status: 'in_transit',
          amount: 180,
          date: '2024-01-20',
          from: 'الدمام',
          to: 'الرياض'
        },
        {
          id: 'SH003',
          customer: 'سارة أحمد',
          driver: 'خالد محمد',
          status: 'pending',
          amount: 320,
          date: '2024-01-19',
          from: 'الرياض',
          to: 'الطائف'
        }
      ];

      setShipments(mockShipments);

      // بيانات المتاجر الوهمية
      const mockStores = [
        {
          id: 1,
          name: 'متجر الإلكترونيات',
          owner: 'أحمد محمد',
          status: 'active',
          orders: 45,
          revenue: 12500,
          rating: 4.8
        },
        {
          id: 2,
          name: 'متجر الملابس',
          owner: 'فاطمة أحمد',
          status: 'active',
          orders: 32,
          revenue: 8900,
          rating: 4.6
        }
      ];

      setStores(mockStores);

      // بيانات السائقين الوهمية
      const mockDrivers = [
        {
          id: 1,
          name: 'فاطمة أحمد',
          phone: '0507654321',
          status: 'active',
          deliveries: 120,
          rating: 4.9,
          vehicle: 'سيارة صغيرة'
        },
        {
          id: 2,
          name: 'علي حسن',
          phone: '0501234567',
          status: 'busy',
          deliveries: 89,
          rating: 4.7,
          vehicle: 'دراجة نارية'
        }
      ];

      setDrivers(mockDrivers);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = (userId, action) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    
    switch (action) {
      case 'view':
        setShowUserModal(true);
        break;
      case 'edit':
        // فتح نموذج التعديل
        break;
      case 'delete':
        // تأكيد الحذف
        break;
      case 'activate':
        // تفعيل المستخدم
        break;
      case 'deactivate':
        // إلغاء تفعيل المستخدم
        break;
    }
  };

  const handleSystemSettingsChange = (setting, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-red-500';
      case 'busy':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'pending':
        return 'في الانتظار';
      case 'inactive':
        return 'غير نشط';
      case 'busy':
        return 'مشغول';
      default:
        return 'غير محدد';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'store_owner':
        return 'تاجر';
      case 'driver':
        return 'سائق';
      case 'customer':
        return 'عميل';
      case 'admin':
        return 'مدير';
      default:
        return 'غير محدد';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.registrationDate) - new Date(a.registrationDate);
      case 'orders':
        return b.totalOrders - a.totalOrders;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="glass-card-hero p-4 md:p-6 text-center animate-fade-in-up">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text arabic-text">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-sm md:text-base text-muted-foreground arabic-text">
            إدارة شاملة لمنصة الشحن والتوصيل
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        <Card className="glass-card animate-fade-in-up animation-delay-100">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  إجمالي المستخدمين
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-500/20 p-2 md:p-3 rounded-full">
                <Users className="h-4 w-4 md:h-6 md:w-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs md:text-sm">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground mr-2 arabic-text">
                من الشهر الماضي
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  المستخدمين النشطين
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  {stats.activeUsers.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-500/20 p-2 md:p-3 rounded-full">
                <Activity className="h-4 w-4 md:h-6 md:w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs md:text-sm">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground mr-2 arabic-text">
                من الشهر الماضي
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-300">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  إجمالي الشحنات
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  {stats.totalShipments.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-500/20 p-2 md:p-3 rounded-full">
                <Package className="h-4 w-4 md:h-6 md:w-6 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs md:text-sm">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
              <span className="text-green-500">+15%</span>
              <span className="text-muted-foreground mr-2 arabic-text">
                من الشهر الماضي
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-400">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  الإيرادات الشهرية
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  {stats.monthlyRevenue.toLocaleString()} ر.س
                </p>
              </div>
              <div className="bg-yellow-500/20 p-2 md:p-3 rounded-full">
                <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-yellow-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs md:text-sm">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
              <span className="text-green-500">+22%</span>
              <span className="text-muted-foreground mr-2 arabic-text">
                من الشهر الماضي
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-up animation-delay-500">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground arabic-text">
                  صحة النظام
                </p>
                <p className="text-lg md:text-2xl font-bold text-primary">
                  {stats.systemHealth}%
                </p>
              </div>
              <div className="bg-green-500/20 p-2 md:p-3 rounded-full">
                <Shield className="h-4 w-4 md:h-6 md:w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs md:text-sm">
              <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1" />
              <span className="text-green-500">مستقر</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
          <TabsTrigger value="shipments">الشحنات</TabsTrigger>
          <TabsTrigger value="stores">المتاجر</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="arabic-text">النشاط الأخير</CardTitle>
                <CardDescription className="arabic-text">
                  آخر العمليات في النظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'تسجيل مستخدم جديد', user: 'أحمد محمد', time: 'منذ 5 دقائق', type: 'user' },
                    { action: 'تسليم شحنة', user: 'فاطمة أحمد', time: 'منذ 10 دقائق', type: 'shipment' },
                    { action: 'إنشاء متجر جديد', user: 'محمد سالم', time: 'منذ 15 دقيقة', type: 'store' },
                    { action: 'تحديث إعدادات النظام', user: 'نور الدين', time: 'منذ 20 دقيقة', type: 'system' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 space-x-reverse">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'shipment' ? 'bg-green-500' :
                        activity.type === 'store' ? 'bg-purple-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium arabic-text">{activity.action}</p>
                        <p className="text-xs text-muted-foreground arabic-text">
                          {activity.user} - {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="arabic-text">حالة النظام</CardTitle>
                <CardDescription className="arabic-text">
                  مراقبة أداء النظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm arabic-text">صحة النظام</span>
                    <span className="text-sm font-medium">{stats.systemHealth}%</span>
                  </div>
                  <Progress value={stats.systemHealth} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm arabic-text">وقت التشغيل</span>
                    <span className="text-sm font-medium">{stats.uptime}%</span>
                  </div>
                  <Progress value={stats.uptime} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm arabic-text">استخدام الذاكرة</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm arabic-text">استخدام المعالج</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="arabic-text">الإجراءات السريعة</CardTitle>
              <CardDescription className="arabic-text">
                أدوات إدارية سريعة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('users')}
                >
                  <UserPlus className="h-6 w-6" />
                  <span className="arabic-text">إضافة مستخدم</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Settings className="h-6 w-6" />
                  <span className="arabic-text">إعدادات النظام</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Download className="h-6 w-6" />
                  <span className="arabic-text">تصدير البيانات</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <RefreshCw className="h-6 w-6" />
                  <span className="arabic-text">تحديث النظام</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Users Filters */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="البحث عن المستخدمين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="arabic-text"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="فلترة حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">الاسم</SelectItem>
                    <SelectItem value="date">تاريخ التسجيل</SelectItem>
                    <SelectItem value="orders">عدد الطلبات</SelectItem>
                    <SelectItem value="rating">التقييم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="arabic-text">قائمة المستخدمين</CardTitle>
              <CardDescription className="arabic-text">
                إدارة جميع مستخدمي المنصة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="arabic-text">المستخدم</TableHead>
                    <TableHead className="arabic-text">النوع</TableHead>
                    <TableHead className="arabic-text">الحالة</TableHead>
                    <TableHead className="arabic-text">الطلبات</TableHead>
                    <TableHead className="arabic-text">التقييم</TableHead>
                    <TableHead className="arabic-text">آخر دخول</TableHead>
                    <TableHead className="arabic-text">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium arabic-text">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="arabic-text">
                          {getTypeText(user.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusColor(user.status)} text-white`}
                        >
                          {getStatusText(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="arabic-text">{user.totalOrders}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{user.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="arabic-text">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUserAction(user.id, 'view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUserAction(user.id, 'edit')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUserAction(user.id, 'delete')}
                          >
                            <Trash2 className="h-4 w-4" />
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

        {/* Shipments Tab */}
        <TabsContent value="shipments" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="arabic-text">إدارة الشحنات</CardTitle>
              <CardDescription className="arabic-text">
                متابعة وإدارة جميع الشحنات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="arabic-text">رقم الشحنة</TableHead>
                    <TableHead className="arabic-text">العميل</TableHead>
                    <TableHead className="arabic-text">السائق</TableHead>
                    <TableHead className="arabic-text">الحالة</TableHead>
                    <TableHead className="arabic-text">المبلغ</TableHead>
                    <TableHead className="arabic-text">التاريخ</TableHead>
                    <TableHead className="arabic-text">المسار</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.id}</TableCell>
                      <TableCell className="arabic-text">{shipment.customer}</TableCell>
                      <TableCell className="arabic-text">{shipment.driver}</TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusColor(shipment.status)} text-white`}
                        >
                          {getStatusText(shipment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="arabic-text">{shipment.amount} ر.س</TableCell>
                      <TableCell className="arabic-text">{shipment.date}</TableCell>
                      <TableCell className="arabic-text">
                        {shipment.from} → {shipment.to}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="arabic-text">إدارة المتاجر</CardTitle>
              <CardDescription className="arabic-text">
                متابعة أداء المتاجر المسجلة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store) => (
                  <Card key={store.id} className="glass-card">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium arabic-text">{store.name}</h3>
                          <Badge 
                            className={`${getStatusColor(store.status)} text-white`}
                          >
                            {getStatusText(store.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground arabic-text">
                          المالك: {store.owner}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground arabic-text">الطلبات</p>
                            <p className="font-medium">{store.orders}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground arabic-text">الإيرادات</p>
                            <p className="font-medium">{store.revenue.toLocaleString()} ر.س</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{store.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="arabic-text">إعدادات النظام</CardTitle>
              <CardDescription className="arabic-text">
                إدارة إعدادات المنصة العامة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance" className="arabic-text">
                      وضع الصيانة
                    </Label>
                    <Switch
                      id="maintenance"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => 
                        handleSystemSettingsChange('maintenanceMode', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="registration" className="arabic-text">
                      تفعيل التسجيل
                    </Label>
                    <Switch
                      id="registration"
                      checked={systemSettings.registrationEnabled}
                      onCheckedChange={(checked) => 
                        handleSystemSettingsChange('registrationEnabled', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email" className="arabic-text">
                      إشعارات البريد الإلكتروني
                    </Label>
                    <Switch
                      id="email"
                      checked={systemSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        handleSystemSettingsChange('emailNotifications', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms" className="arabic-text">
                      إشعارات الرسائل النصية
                    </Label>
                    <Switch
                      id="sms"
                      checked={systemSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        handleSystemSettingsChange('smsNotifications', checked)
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileSize" className="arabic-text">
                      الحد الأقصى لحجم الملف (MB)
                    </Label>
                    <Input
                      id="fileSize"
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => 
                        handleSystemSettingsChange('maxFileSize', parseInt(e.target.value))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeout" className="arabic-text">
                      انتهاء الجلسة (دقيقة)
                    </Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => 
                        handleSystemSettingsChange('sessionTimeout', parseInt(e.target.value))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup" className="arabic-text">
                      تكرار النسخ الاحتياطي
                    </Label>
                    <Select
                      value={systemSettings.backupFrequency}
                      onValueChange={(value) => 
                        handleSystemSettingsChange('backupFrequency', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">يومي</SelectItem>
                        <SelectItem value="weekly">أسبوعي</SelectItem>
                        <SelectItem value="monthly">شهري</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline" className="arabic-text">
                  إعادة تعيين
                </Button>
                <Button className="arabic-text">
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="arabic-text">تفاصيل المستخدم</DialogTitle>
            <DialogDescription className="arabic-text">
              معلومات مفصلة عن المستخدم المحدد
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="arabic-text">الاسم</Label>
                  <p className="font-medium arabic-text">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="arabic-text">البريد الإلكتروني</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="arabic-text">رقم الهاتف</Label>
                  <p className="font-medium arabic-text">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label className="arabic-text">نوع المستخدم</Label>
                  <p className="font-medium arabic-text">{getTypeText(selectedUser.type)}</p>
                </div>
                <div>
                  <Label className="arabic-text">تاريخ التسجيل</Label>
                  <p className="font-medium arabic-text">{selectedUser.registrationDate}</p>
                </div>
                <div>
                  <Label className="arabic-text">آخر دخول</Label>
                  <p className="font-medium arabic-text">{selectedUser.lastLogin}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline" onClick={() => setShowUserModal(false)}>
                  إغلاق
                </Button>
                <Button>
                  تعديل المستخدم
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
