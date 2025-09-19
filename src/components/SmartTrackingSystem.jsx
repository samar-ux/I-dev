import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Navigation, Bell, Package, Truck, Clock, 
  CheckCircle, AlertCircle, RefreshCw, Play, Pause, 
  Stop, Settings, Eye, Download, Share, Zap,
  Route, Target, Compass, Activity, BarChart3,
  Globe, Shield, Lock, Star, Award, Gift
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import smartTrackingService from "../services/smartTrackingService";

const SmartTrackingSystem = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tracking");
  const [activeTrackings, setActiveTrackings] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showStartTrackingDialog, setShowStartTrackingDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [trackingForm, setTrackingForm] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 }); // الرياض
  const [mapZoom, setMapZoom] = useState(10);
  const mapRef = useRef(null);

  useEffect(() => {
    initializeService();
  }, []);

  useEffect(() => {
    // تحديث البيانات كل 5 ثواني
    const interval = setInterval(() => {
      loadActiveTrackings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const initializeService = async () => {
    try {
      setIsLoading(true);
      await smartTrackingService.init();
      setIsInitialized(true);
      
      // تحميل البيانات الأولية
      await loadInitialData();
    } catch (error) {
      console.error('Failed to initialize smart tracking service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      await loadActiveTrackings();
      await loadNotificationSettings();
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const loadActiveTrackings = async () => {
    try {
      const result = await smartTrackingService.getAllActiveTrackings();
      if (result.success) {
        setActiveTrackings(result.trackings);
      }
    } catch (error) {
      console.error('Failed to load active trackings:', error);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const settings = smartTrackingService.getNotificationSettings();
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  const handleStartTracking = async () => {
    try {
      setIsLoading(true);
      
      const result = await smartTrackingService.startTracking(
        trackingForm.shipmentId,
        {
          initialLat: trackingForm.initialLat || mapCenter.lat,
          initialLng: trackingForm.initialLng || mapCenter.lng,
          initialAddress: trackingForm.initialAddress || 'الرياض، المملكة العربية السعودية',
          milestones: trackingForm.milestones || [],
          customerInfo: trackingForm.customerInfo || {}
        }
      );
      
      if (result.success) {
        setShowStartTrackingDialog(false);
        setTrackingForm({});
        await loadActiveTrackings();
      } else {
        console.error('Failed to start tracking:', result.error);
      }
    } catch (error) {
      console.error('Failed to start tracking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopTracking = async (shipmentId) => {
    try {
      setIsLoading(true);
      
      const result = await smartTrackingService.stopTracking(shipmentId);
      
      if (result.success) {
        await loadActiveTrackings();
        if (selectedShipment?.shipmentId === shipmentId) {
          setSelectedShipment(null);
        }
      } else {
        console.error('Failed to stop tracking:', result.error);
      }
    } catch (error) {
      console.error('Failed to stop tracking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (shipmentId, newStatus) => {
    try {
      setIsLoading(true);
      
      const result = await smartTrackingService.updateShipmentStatus(shipmentId, newStatus);
      
      if (result.success) {
        await loadActiveTrackings();
        if (selectedShipment?.shipmentId === shipmentId) {
          setSelectedShipment(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        console.error('Failed to update status:', result.error);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNFT = async (shipmentId) => {
    try {
      setIsLoading(true);
      
      const result = await smartTrackingService.createShipmentNFT(shipmentId);
      
      if (result.success) {
        await loadActiveTrackings();
        if (selectedShipment?.shipmentId === shipmentId) {
          setSelectedShipment(prev => ({ ...prev, nftMetadata: result.nft }));
        }
      } else {
        console.error('Failed to create NFT:', result.error);
      }
    } catch (error) {
      console.error('Failed to create NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectShipment = async (shipmentId) => {
    try {
      const result = await smartTrackingService.getTrackingInfo(shipmentId);
      if (result.success) {
        setSelectedShipment(result.trackingInfo);
        
        // تحديث مركز الخريطة
        if (result.trackingInfo.location) {
          setMapCenter({
            lat: result.trackingInfo.location.lat,
            lng: result.trackingInfo.location.lng
          });
        }
        
        // تحميل سجل التتبع
        const historyResult = await smartTrackingService.getTrackingHistory(shipmentId);
        if (historyResult.success) {
          setTrackingHistory(historyResult.history);
        }
      }
    } catch (error) {
      console.error('Failed to select shipment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'tracking': return 'text-blue-500';
      case 'delivered': return 'text-green-500';
      case 'delayed': return 'text-yellow-500';
      case 'cancelled': return 'text-red-500';
      case 'stopped': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'tracking': return <Navigation className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'delayed': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      case 'stopped': return <Stop className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} م`;
    }
    return `${distance.toFixed(2)} كم`;
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}س ${diffMinutes}د`;
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
            نظام التتبع الذكي والشامل
          </h1>
          <p className="text-white/80 text-lg mb-6">
            تتبع GPS كل 5 ثواني • إشعارات فورية • تحويل الشحنات إلى NFT
          </p>
          
          {/* System Status */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
              <Navigation className="w-5 h-5 text-blue-400" />
              <span className="text-white text-sm">GPS Tracking</span>
              <Badge variant="secondary" className="text-xs">
                كل 5 ثواني
              </Badge>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
              <Bell className="w-5 h-5 text-green-400" />
              <span className="text-white text-sm">إشعارات فورية</span>
              <Badge variant="secondary" className="text-xs">
                نشط
              </Badge>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
              <Gift className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm">NFT Integration</span>
              <Badge variant="secondary" className="text-xs">
                متوفر
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg border border-white/20">
            <TabsTrigger value="tracking" className="text-white data-[state=active]:bg-white/20">
              التتبع المباشر
            </TabsTrigger>
            <TabsTrigger value="map" className="text-white data-[state=active]:bg-white/20">
              الخريطة
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-white/20">
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="nft" className="text-white data-[state=active]:bg-white/20">
              NFT Collection
            </TabsTrigger>
          </TabsList>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Trackings */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-400" />
                          الشحنات النشطة
                        </CardTitle>
                        <CardDescription className="text-white/70">
                          {activeTrackings.length} شحنة قيد التتبع
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => setShowStartTrackingDialog(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        بدء تتبع جديد
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeTrackings.map((tracking) => (
                        <motion.div
                          key={tracking.shipmentId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                          onClick={() => handleSelectShipment(tracking.shipmentId)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="text-white font-semibold">
                                  {tracking.shipmentId}
                                </div>
                                <div className="text-white/70 text-sm">
                                  بدء التتبع: {new Date(tracking.startTime).toLocaleTimeString('ar-SA')}
                                </div>
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 ${getStatusColor(tracking.status)}`}>
                              {getStatusIcon(tracking.status)}
                              <span className="text-sm font-medium capitalize">
                                {tracking.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-white/70">المسافة المقطوعة</div>
                              <div className="text-white font-medium">
                                {formatDistance(smartTrackingService.calculateTotalDistance(tracking.route))}
                              </div>
                            </div>
                            <div>
                              <div className="text-white/70">نقاط المسار</div>
                              <div className="text-white font-medium">
                                {tracking.route.length}
                              </div>
                            </div>
                            <div>
                              <div className="text-white/70">المدة</div>
                              <div className="text-white font-medium">
                                {formatDuration(tracking.startTime, tracking.lastUpdate)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStopTracking(tracking.shipmentId);
                              }}
                              variant="outline"
                              size="sm"
                              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                            >
                              <Stop className="w-4 h-4 mr-1" />
                              إيقاف
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(tracking.shipmentId, 'delivered');
                              }}
                              variant="outline"
                              size="sm"
                              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              تسليم
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                      
                      {activeTrackings.length === 0 && (
                        <div className="text-center py-12 text-white/70">
                          <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-2">لا توجد شحنات قيد التتبع</p>
                          <p className="text-sm">ابدأ بتتبع شحنة جديدة</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Selected Shipment Details */}
              <div>
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-green-400" />
                      تفاصيل الشحنة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedShipment ? (
                      <div className="space-y-4">
                        <div>
                          <div className="text-white/70 text-sm">رقم الشحنة</div>
                          <div className="text-white font-semibold">{selectedShipment.shipmentId}</div>
                        </div>
                        
                        <div>
                          <div className="text-white/70 text-sm">الحالة</div>
                          <div className={`flex items-center gap-2 ${getStatusColor(selectedShipment.status)}`}>
                            {getStatusIcon(selectedShipment.status)}
                            <span className="font-medium capitalize">{selectedShipment.status}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-white/70 text-sm">الموقع الحالي</div>
                          <div className="text-white font-medium">
                            {selectedShipment.location?.address || 'غير محدد'}
                          </div>
                          <div className="text-white/70 text-xs">
                            {selectedShipment.location?.lat?.toFixed(6)}, {selectedShipment.location?.lng?.toFixed(6)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-white/70 text-sm">المسافة الإجمالية</div>
                          <div className="text-white font-medium">
                            {formatDistance(smartTrackingService.calculateTotalDistance(selectedShipment.route))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-white/70 text-sm">نقاط المسار</div>
                          <div className="text-white font-medium">{selectedShipment.route.length}</div>
                        </div>
                        
                        <div>
                          <div className="text-white/70 text-sm">الإشعارات</div>
                          <div className="text-white font-medium">{selectedShipment.notifications?.length || 0}</div>
                        </div>
                        
                        {selectedShipment.nftMetadata && (
                          <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-2">
                              <Gift className="w-4 h-4 text-purple-400" />
                              <span className="text-white font-medium">NFT متوفر</span>
                            </div>
                            <div className="text-white/70 text-sm">
                              Token ID: {selectedShipment.nftMetadata.tokenId}
                            </div>
                          </div>
                        )}
                        
                        {!selectedShipment.nftMetadata && selectedShipment.status === 'delivered' && (
                          <Button
                            onClick={() => handleCreateNFT(selectedShipment.shipmentId)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Gift className="w-4 h-4 mr-2" />
                            إنشاء NFT
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-white/70">
                        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>اختر شحنة لعرض التفاصيل</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  خريطة التتبع المباشر
                </CardTitle>
                <CardDescription className="text-white/70">
                  عرض مواقع الشحنات في الوقت الفعلي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white/70">
                    <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">خريطة تفاعلية</p>
                    <p className="text-sm">سيتم عرض الخريطة هنا مع مواقع الشحنات</p>
                    <div className="mt-4 text-xs">
                      المركز: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    الإشعارات الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeTrackings.flatMap(tracking => 
                      tracking.notifications?.slice(-5).map((notification, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Bell className="w-4 h-4 text-yellow-400 mt-1" />
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm">
                                {notification.message}
                              </div>
                              <div className="text-white/70 text-xs">
                                {new Date(notification.timestamp).toLocaleString('ar-SA')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {activeTrackings.every(tracking => !tracking.notifications?.length) && (
                      <div className="text-center py-8 text-white/70">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>لا توجد إشعارات</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    إعدادات الإشعارات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications-enabled" className="text-white">
                        تفعيل الإشعارات
                      </Label>
                      <Switch
                        id="notifications-enabled"
                        checked={notificationSettings.enabled}
                        onCheckedChange={(checked) => {
                          const newSettings = { ...notificationSettings, enabled: checked };
                          setNotificationSettings(newSettings);
                          smartTrackingService.updateNotificationSettings(newSettings);
                        }}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-white font-medium text-sm">أنواع الإشعارات</div>
                      {Object.entries(notificationSettings.types || {}).map(([type, enabled]) => (
                        <div key={type} className="flex items-center justify-between">
                          <Label className="text-white text-sm capitalize">
                            {type.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => {
                              const newSettings = {
                                ...notificationSettings,
                                types: { ...notificationSettings.types, [type]: checked }
                              };
                              setNotificationSettings(newSettings);
                              smartTrackingService.updateNotificationSettings(newSettings);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NFT Tab */}
          <TabsContent value="nft" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-400" />
                  مجموعة NFT للشحنات
                </CardTitle>
                <CardDescription className="text-white/70">
                  تحويل الشحنات إلى NFTs فريدة وجميلة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTrackings
                    .filter(tracking => tracking.nftMetadata)
                    .map((tracking) => (
                      <motion.div
                        key={tracking.shipmentId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-all"
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                              <Gift className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-white font-semibold">
                                {tracking.nftMetadata.name}
                              </div>
                              <div className="text-white/70 text-sm">
                                Token ID: {tracking.nftMetadata.tokenId}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-white/70">المسافة:</span>
                              <span className="text-white">
                                {formatDistance(smartTrackingService.calculateTotalDistance(tracking.route))}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">نقاط المسار:</span>
                              <span className="text-white">{tracking.route.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">تاريخ الإنشاء:</span>
                              <span className="text-white">
                                {new Date(tracking.nftMetadata.createdAt).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              عرض
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                            >
                              <Share className="w-4 h-4 mr-1" />
                              مشاركة
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  
                  {activeTrackings.filter(tracking => tracking.nftMetadata).length === 0 && (
                    <div className="col-span-full text-center py-12 text-white/70">
                      <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">لا توجد NFTs متاحة</p>
                      <p className="text-sm">سيتم إنشاء NFTs تلقائياً عند تسليم الشحنات</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Start Tracking Dialog */}
        <Dialog open={showStartTrackingDialog} onOpenChange={setShowStartTrackingDialog}>
          <DialogContent className="bg-white/95 backdrop-blur-lg border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-gray-800 flex items-center gap-2">
                <Play className="w-5 h-5" />
                بدء تتبع شحنة جديدة
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                أدخل بيانات الشحنة لبدء التتبع
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="shipmentId">رقم الشحنة</Label>
                <Input
                  id="shipmentId"
                  placeholder="SHIP-2024-001"
                  value={trackingForm.shipmentId || ''}
                  onChange={(e) => setTrackingForm(prev => ({ ...prev, shipmentId: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="initialAddress">العنوان الأولي</Label>
                <Input
                  id="initialAddress"
                  placeholder="الرياض، المملكة العربية السعودية"
                  value={trackingForm.initialAddress || ''}
                  onChange={(e) => setTrackingForm(prev => ({ ...prev, initialAddress: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="initialLat">خط العرض</Label>
                  <Input
                    id="initialLat"
                    type="number"
                    step="0.000001"
                    placeholder="24.7136"
                    value={trackingForm.initialLat || ''}
                    onChange={(e) => setTrackingForm(prev => ({ ...prev, initialLat: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="initialLng">خط الطول</Label>
                  <Input
                    id="initialLng"
                    type="number"
                    step="0.000001"
                    placeholder="46.6753"
                    value={trackingForm.initialLng || ''}
                    onChange={(e) => setTrackingForm(prev => ({ ...prev, initialLng: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleStartTracking}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'جاري البدء...' : 'بدء التتبع'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowStartTrackingDialog(false)}
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

export default SmartTrackingSystem;

