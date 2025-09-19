import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Package,
  Truck,
  MapPin,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Smartphone,
  Monitor,
  Database,
  Network,
  Globe,
  Zap,
  Activity,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  Camera,
  QrCode,
  Scan,
  CheckSquare,
  Square,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Save,
  Send,
  Copy,
  ExternalLink,
  AlertCircle,
  Info,
  HelpCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "../App.css";

const DualConfirmationSystem = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("confirmations");
  const [confirmations, setConfirmations] = useState([]);
  const [pendingConfirmations, setPendingConfirmations] = useState([]);
  const [completedConfirmations, setCompletedConfirmations] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({});

  // Sample data
  useEffect(() => {
    setConfirmations([
      {
        id: 1,
        type: "delivery_confirmation",
        title: "تأكيد تسليم الشحنة #SH001",
        description: "تأكيد تسليم الشحنة إلى العميل أحمد محمد",
        status: "pending",
        priority: "high",
        createdAt: "2024-01-15 10:30",
        expiresAt: "2024-01-15 12:30",
        participants: [
          { id: 1, name: "أحمد محمد", role: "customer", status: "confirmed", method: "biometric" },
          { id: 2, name: "سارة أحمد", role: "driver", status: "pending", method: "qr_code" }
        ],
        location: { lat: 24.7136, lng: 46.6753, address: "الرياض، المملكة العربية السعودية" },
        verification: {
          biometric: true,
          qrCode: true,
          signature: false,
          photo: true
        },
        blockchain: {
          transactionHash: "0x1234567890abcdef",
          blockNumber: 12345678,
          gasUsed: 21000,
          status: "pending"
        }
      },
      {
        id: 2,
        type: "payment_confirmation",
        title: "تأكيد الدفع للشحنة #SH002",
        description: "تأكيد استلام الدفع بالعملة الرقمية",
        status: "completed",
        priority: "high",
        createdAt: "2024-01-15 09:15",
        completedAt: "2024-01-15 09:45",
        participants: [
          { id: 3, name: "فاطمة علي", role: "customer", status: "confirmed", method: "digital_signature" },
          { id: 4, name: "محمد حسن", role: "merchant", status: "confirmed", method: "biometric" }
        ],
        location: { lat: 21.4858, lng: 39.1925, address: "جدة، المملكة العربية السعودية" },
        verification: {
          biometric: true,
          qrCode: false,
          signature: true,
          photo: false
        },
        blockchain: {
          transactionHash: "0xabcdef1234567890",
          blockNumber: 12345679,
          gasUsed: 25000,
          status: "confirmed"
        }
      },
      {
        id: 3,
        type: "pickup_confirmation",
        title: "تأكيد استلام الشحنة #SH003",
        description: "تأكيد استلام الشحنة من المتجر",
        status: "pending",
        priority: "medium",
        createdAt: "2024-01-15 11:00",
        expiresAt: "2024-01-15 13:00",
        participants: [
          { id: 5, name: "خالد إبراهيم", role: "driver", status: "pending", method: "qr_code" },
          { id: 6, name: "نور الدين", role: "store_manager", status: "pending", method: "biometric" }
        ],
        location: { lat: 26.4207, lng: 50.0888, address: "الدمام، المملكة العربية السعودية" },
        verification: {
          biometric: true,
          qrCode: true,
          signature: true,
          photo: true
        },
        blockchain: {
          transactionHash: "0x9876543210fedcba",
          blockNumber: 12345680,
          gasUsed: 30000,
          status: "pending"
        }
      }
    ]);

    setPendingConfirmations([
      {
        id: 1,
        title: "تأكيد تسليم الشحنة #SH001",
        type: "delivery",
        timeRemaining: "1:45:30",
        participants: 2,
        confirmed: 1
      },
      {
        id: 3,
        title: "تأكيد استلام الشحنة #SH003",
        type: "pickup",
        timeRemaining: "1:30:15",
        participants: 2,
        confirmed: 0
      }
    ]);

    setCompletedConfirmations([
      {
        id: 2,
        title: "تأكيد الدفع للشحنة #SH002",
        type: "payment",
        completedAt: "2024-01-15 09:45",
        participants: 2,
        confirmed: 2
      }
    ]);

    setSecuritySettings({
      biometricEnabled: true,
      qrCodeEnabled: true,
      signatureEnabled: true,
      photoEnabled: true,
      autoExpire: true,
      expireTime: 2, // hours
      requireAllParticipants: true,
      blockchainVerification: true,
      encryptionLevel: "high"
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "biometric": return Fingerprint;
      case "qr_code": return QrCode;
      case "digital_signature": return Key;
      case "photo": return Camera;
      default: return CheckCircle;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "customer": return "bg-blue-100 text-blue-800";
      case "driver": return "bg-green-100 text-green-800";
      case "merchant": return "bg-purple-100 text-purple-800";
      case "store_manager": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "confirmations", label: "التأكيدات", icon: CheckCircle },
    { id: "pending", label: "في الانتظار", icon: Clock },
    { id: "completed", label: "مكتملة", icon: CheckSquare },
    { id: "security", label: "الأمان", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            نظام التأكيد المزدوج اللامركزي
          </h1>
          <p className="text-gray-600 text-lg">
            تأكيدات مشفرة وآمنة لجميع العمليات المهمة
          </p>
        </div>

        {/* Security Status */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">نظام الأمان نشط</span>
                  <Badge className="bg-green-100 text-green-800">محمي</Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>آخر فحص أمني: منذ 5 دقائق</span>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    فحص أمني
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
                      ? "bg-green-600 text-white shadow-sm"
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
        {activeTab === "confirmations" && (
          <div className="space-y-6">
            {confirmations.map((confirmation) => (
              <Card key={confirmation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span>{confirmation.title}</span>
                      </CardTitle>
                      <p className="text-gray-600 text-sm mb-3">{confirmation.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>أنشئ: {confirmation.createdAt}</span>
                        {confirmation.expiresAt && (
                          <span>ينتهي: {confirmation.expiresAt}</span>
                        )}
                        {confirmation.completedAt && (
                          <span>اكتمل: {confirmation.completedAt}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(confirmation.status)}>
                        {confirmation.status === "pending" && "في الانتظار"}
                        {confirmation.status === "completed" && "مكتمل"}
                        {confirmation.status === "expired" && "منتهي الصلاحية"}
                        {confirmation.status === "cancelled" && "ملغي"}
                      </Badge>
                      <Badge className={getPriorityColor(confirmation.priority)}>
                        {confirmation.priority === "high" && "عالي"}
                        {confirmation.priority === "medium" && "متوسط"}
                        {confirmation.priority === "low" && "منخفض"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Participants */}
                    <div>
                      <h4 className="font-semibold mb-2">المشاركون:</h4>
                      <div className="space-y-2">
                        {confirmation.participants.map((participant) => {
                          const MethodIcon = getMethodIcon(participant.method);
                          return (
                            <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-lg">
                                  <MethodIcon className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{participant.name}</div>
                                  <Badge className={getRoleColor(participant.role)}>
                                    {participant.role === "customer" && "عميل"}
                                    {participant.role === "driver" && "سائق"}
                                    {participant.role === "merchant" && "تاجر"}
                                    {participant.role === "store_manager" && "مدير متجر"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={
                                  participant.status === "confirmed" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }>
                                  {participant.status === "confirmed" && "مؤكد"}
                                  {participant.status === "pending" && "في الانتظار"}
                                </Badge>
                                {participant.status === "confirmed" ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h4 className="font-semibold mb-2">الموقع:</h4>
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{confirmation.location.address}</span>
                      </div>
                    </div>

                    {/* Verification Methods */}
                    <div>
                      <h4 className="font-semibold mb-2">طرق التحقق:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className={`p-2 rounded-lg text-center text-sm ${
                          confirmation.verification.biometric ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}>
                          <Fingerprint className="w-4 h-4 mx-auto mb-1" />
                          بصمة
                        </div>
                        <div className={`p-2 rounded-lg text-center text-sm ${
                          confirmation.verification.qrCode ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}>
                          <QrCode className="w-4 h-4 mx-auto mb-1" />
                          QR Code
                        </div>
                        <div className={`p-2 rounded-lg text-center text-sm ${
                          confirmation.verification.signature ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}>
                          <Key className="w-4 h-4 mx-auto mb-1" />
                          توقيع
                        </div>
                        <div className={`p-2 rounded-lg text-center text-sm ${
                          confirmation.verification.photo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}>
                          <Camera className="w-4 h-4 mx-auto mb-1" />
                          صورة
                        </div>
                      </div>
                    </div>

                    {/* Blockchain Info */}
                    <div>
                      <h4 className="font-semibold mb-2">معلومات البلوك تشين:</h4>
                      <div className="p-3 bg-gray-900 text-white rounded-lg font-mono text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span>Transaction Hash:</span>
                          <Button variant="outline" size="sm" className="text-white border-white">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-gray-300 break-all">
                          {confirmation.blockchain.transactionHash}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span>Block: {confirmation.blockchain.blockNumber}</span>
                          <span>Gas: {confirmation.blockchain.gasUsed}</span>
                          <Badge className={
                            confirmation.blockchain.status === "confirmed" 
                              ? "bg-green-600" 
                              : "bg-yellow-600"
                          }>
                            {confirmation.blockchain.status === "confirmed" && "مؤكد"}
                            {confirmation.blockchain.status === "pending" && "في الانتظار"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      {confirmation.status === "pending" && (
                        <>
                          <Button className="flex-1" size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            تأكيد
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {confirmation.status === "completed" && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          تحميل الشهادة
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "pending" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingConfirmations.map((confirmation) => (
                <Card key={confirmation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{confirmation.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">الوقت المتبقي:</span>
                        <Badge className="bg-red-100 text-red-800">
                          {confirmation.timeRemaining}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">المشاركون:</span>
                        <span className="text-sm font-medium">
                          {confirmation.confirmed}/{confirmation.participants}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(confirmation.confirmed / confirmation.participants) * 100}%` }}
                        ></div>
                      </div>
                      <Button className="w-full" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        تأكيد الآن
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-6">
            {completedConfirmations.map((confirmation) => (
              <Card key={confirmation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <CheckSquare className="w-5 h-5 text-green-600" />
                      <span>{confirmation.title}</span>
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">اكتمل في:</span>
                      <span className="text-sm font-medium">{confirmation.completedAt}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">المشاركون المؤكدون:</span>
                      <span className="text-sm font-medium">
                        {confirmation.confirmed}/{confirmation.participants}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل الشهادة
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>إعدادات الأمان</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">التحقق البيومتري</span>
                    <Button 
                      size="sm" 
                      variant={securitySettings.biometricEnabled ? "default" : "outline"}
                      onClick={() => setSecuritySettings({
                        ...securitySettings,
                        biometricEnabled: !securitySettings.biometricEnabled
                      })}
                    >
                      {securitySettings.biometricEnabled ? "مفعل" : "معطل"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">QR Code</span>
                    <Button 
                      size="sm" 
                      variant={securitySettings.qrCodeEnabled ? "default" : "outline"}
                      onClick={() => setSecuritySettings({
                        ...securitySettings,
                        qrCodeEnabled: !securitySettings.qrCodeEnabled
                      })}
                    >
                      {securitySettings.qrCodeEnabled ? "مفعل" : "معطل"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">التوقيع الرقمي</span>
                    <Button 
                      size="sm" 
                      variant={securitySettings.signatureEnabled ? "default" : "outline"}
                      onClick={() => setSecuritySettings({
                        ...securitySettings,
                        signatureEnabled: !securitySettings.signatureEnabled
                      })}
                    >
                      {securitySettings.signatureEnabled ? "مفعل" : "معطل"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">التصوير</span>
                    <Button 
                      size="sm" 
                      variant={securitySettings.photoEnabled ? "default" : "outline"}
                      onClick={() => setSecuritySettings({
                        ...securitySettings,
                        photoEnabled: !securitySettings.photoEnabled
                      })}
                    >
                      {securitySettings.photoEnabled ? "مفعل" : "معطل"}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">انتهاء الصلاحية التلقائي</span>
                      <Button 
                        size="sm" 
                        variant={securitySettings.autoExpire ? "default" : "outline"}
                        onClick={() => setSecuritySettings({
                          ...securitySettings,
                          autoExpire: !securitySettings.autoExpire
                        })}
                      >
                        {securitySettings.autoExpire ? "مفعل" : "معطل"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">وقت الانتهاء (ساعات)</span>
                      <select 
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                        value={securitySettings.expireTime}
                        onChange={(e) => setSecuritySettings({
                          ...securitySettings,
                          expireTime: parseInt(e.target.value)
                        })}
                      >
                        <option value={1}>1 ساعة</option>
                        <option value={2}>2 ساعات</option>
                        <option value={4}>4 ساعات</option>
                        <option value={8}>8 ساعات</option>
                        <option value={24}>24 ساعة</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>حالة الأمان</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">مستوى التشفير</span>
                    <Badge className="bg-green-100 text-green-800">
                      {securitySettings.encryptionLevel === "high" && "عالي"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">التحقق من البلوك تشين</span>
                    <Badge className="bg-green-100 text-green-800">مفعل</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">تطلب جميع المشاركين</span>
                    <Badge className="bg-green-100 text-green-800">مفعل</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">إحصائيات الأمان</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>التأكيدات المكتملة:</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>معدل النجاح:</span>
                      <span className="font-medium text-green-600">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>التأكيدات المنتهية:</span>
                      <span className="font-medium text-red-600">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>آخر فحص أمني:</span>
                      <span className="font-medium">منذ 5 دقائق</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DualConfirmationSystem;
