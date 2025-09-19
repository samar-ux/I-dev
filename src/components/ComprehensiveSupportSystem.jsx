import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  MessageCircle,
  Phone,
  Video,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Send,
  Paperclip,
  Smile,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Users,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Bell,
  Archive,
  Trash2,
  Edit,
  Plus,
  MoreHorizontal,
  HelpCircle,
  BookOpen,
  Zap,
  Shield,
  Globe,
  Headphones,
  Monitor,
  Share2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "../App.css";

const ComprehensiveSupportSystem = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("tickets");
  const [tickets, setTickets] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isAudioCallActive, setIsAudioCallActive] = useState(false);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Sample data
  useEffect(() => {
    setTickets([
      {
        id: 1,
        title: "مشكلة في تتبع الشحنة",
        description: "لا يمكنني رؤية موقع الشحنة الحالي",
        status: "open",
        priority: "high",
        category: "tracking",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
        customer: "أحمد محمد",
        agent: "سارة أحمد",
        rating: 5,
        messages: [
          {
            id: 1,
            sender: "customer",
            message: "مرحباً، لدي مشكلة في تتبع الشحنة",
            timestamp: "2024-01-15 10:30",
            attachments: []
          },
          {
            id: 2,
            sender: "agent",
            message: "مرحباً أحمد، سأساعدك في حل هذه المشكلة",
            timestamp: "2024-01-15 10:32",
            attachments: []
          }
        ]
      },
      {
        id: 2,
        title: "استفسار عن التأمين",
        description: "أريد معرفة تفاصيل بوليصة التأمين",
        status: "in_progress",
        priority: "medium",
        category: "insurance",
        createdAt: "2024-01-14",
        updatedAt: "2024-01-15",
        customer: "فاطمة علي",
        agent: "محمد حسن",
        rating: 4,
        messages: []
      },
      {
        id: 3,
        title: "مشكلة في الدفع",
        description: "فشل في عملية الدفع بالعملة الرقمية",
        status: "resolved",
        priority: "high",
        category: "payment",
        createdAt: "2024-01-13",
        updatedAt: "2024-01-14",
        customer: "خالد إبراهيم",
        agent: "نور الدين",
        rating: 5,
        messages: []
      }
    ]);

    setChatMessages([
      {
        id: 1,
        sender: "customer",
        message: "مرحباً، أحتاج مساعدة",
        timestamp: "2024-01-15 14:30",
        type: "text"
      },
      {
        id: 2,
        sender: "agent",
        message: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
        timestamp: "2024-01-15 14:31",
        type: "text"
      },
      {
        id: 3,
        sender: "customer",
        message: "لدي مشكلة في تتبع الشحنة",
        timestamp: "2024-01-15 14:32",
        type: "text"
      }
    ]);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: "customer",
        message: newMessage,
        timestamp: new Date().toLocaleString(),
        type: "text"
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const message = {
        id: Date.now(),
        sender: "customer",
        message: `تم رفع الملف: ${file.name}`,
        timestamp: new Date().toLocaleString(),
        type: "file",
        file: file
      };
      setChatMessages([...chatMessages, message]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
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

  const tabs = [
    { id: "tickets", label: "نظام التذاكر", icon: FileText },
    { id: "chat", label: "الدردشة المباشرة", icon: MessageCircle },
    { id: "video", label: "الدعم المرئي", icon: Video },
    { id: "knowledge", label: "قاعدة المعرفة", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            نظام الدعم الفني الشامل
          </h1>
          <p className="text-gray-600 text-lg">
            دعم فني متقدم مع دردشة مباشرة ودعم مرئي
          </p>
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
                      ? "bg-blue-600 text-white shadow-sm"
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
        {activeTab === "tickets" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>التذاكر</span>
                    <Badge className="ml-auto">{tickets.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {ticket.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {ticket.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>العميل: {ticket.customer}</span>
                              <span>الوكيل: {ticket.agent}</span>
                              <span>{ticket.createdAt}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status === "open" && "مفتوح"}
                              {ticket.status === "in_progress" && "قيد المعالجة"}
                              {ticket.status === "resolved" && "محلول"}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority === "high" && "عالي"}
                              {ticket.priority === "medium" && "متوسط"}
                              {ticket.priority === "low" && "منخفض"}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{ticket.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ticket Details */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل التذكرة</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTicket ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">{selectedTicket.title}</h3>
                        <p className="text-gray-600 text-sm">{selectedTicket.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">الحالة:</span>
                          <Badge className={getStatusColor(selectedTicket.status)}>
                            {selectedTicket.status === "open" && "مفتوح"}
                            {selectedTicket.status === "in_progress" && "قيد المعالجة"}
                            {selectedTicket.status === "resolved" && "محلول"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">الأولوية:</span>
                          <Badge className={getPriorityColor(selectedTicket.priority)}>
                            {selectedTicket.priority === "high" && "عالي"}
                            {selectedTicket.priority === "medium" && "متوسط"}
                            {selectedTicket.priority === "low" && "منخفض"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">التقييم:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{selectedTicket.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2">المحادثة</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {selectedTicket.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`p-2 rounded-lg text-sm ${
                                message.sender === "customer"
                                  ? "bg-blue-100 text-blue-900 ml-4"
                                  : "bg-gray-100 text-gray-900 mr-4"
                              }`}
                            >
                              <p>{message.message}</p>
                              <span className="text-xs opacity-70">{message.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          الرد
                        </Button>
                        <Button variant="outline" size="sm">
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      اختر تذكرة لعرض التفاصيل
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Messages */}
            <div className="lg:col-span-3">
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>الدردشة المباشرة</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        متصل
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "customer" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === "customer"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Paperclip className="w-4 h-4" />
                        </span>
                      </Button>
                    </label>
                    
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Controls */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>أدوات الدردشة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      variant={isAudioCallActive ? "destructive" : "default"}
                      onClick={() => setIsAudioCallActive(!isAudioCallActive)}
                    >
                      {isAudioCallActive ? (
                        <MicOff className="w-4 h-4 mr-2" />
                      ) : (
                        <Mic className="w-4 h-4 mr-2" />
                      )}
                      {isAudioCallActive ? "إيقاف الميكروفون" : "بدء المكالمة الصوتية"}
                    </Button>
                    
                    <Button
                      className="w-full"
                      variant={isVideoCallActive ? "destructive" : "default"}
                      onClick={() => setIsVideoCallActive(!isVideoCallActive)}
                    >
                      {isVideoCallActive ? (
                        <VideoOff className="w-4 h-4 mr-2" />
                      ) : (
                        <Video className="w-4 h-4 mr-2" />
                      )}
                      {isVideoCallActive ? "إيقاف الفيديو" : "بدء المكالمة المرئية"}
                    </Button>
                    
                    <Button
                      className="w-full"
                      variant={screenShareActive ? "destructive" : "outline"}
                      onClick={() => setScreenShareActive(!screenShareActive)}
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      {screenShareActive ? "إيقاف مشاركة الشاشة" : "مشاركة الشاشة"}
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">الردود السريعة</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full text-right">
                        شكراً لك
                      </Button>
                      <Button variant="outline" size="sm" className="w-full text-right">
                        أحتاج مساعدة إضافية
                      </Button>
                      <Button variant="outline" size="sm" className="w-full text-right">
                        المشكلة محلولة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Call Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>الدعم المرئي</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">مكالمة فيديو</p>
                    <p className="text-sm opacity-75">انقر لبدء المكالمة</p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={isVideoCallActive ? "destructive" : "default"}
                    onClick={() => setIsVideoCallActive(!isVideoCallActive)}
                  >
                    {isVideoCallActive ? (
                      <VideoOff className="w-4 h-4 mr-2" />
                    ) : (
                      <Video className="w-4 h-4 mr-2" />
                    )}
                    {isVideoCallActive ? "إيقاف الفيديو" : "بدء الفيديو"}
                  </Button>
                  
                  <Button
                    variant={isAudioCallActive ? "destructive" : "default"}
                    onClick={() => setIsAudioCallActive(!isAudioCallActive)}
                  >
                    {isAudioCallActive ? (
                      <MicOff className="w-4 h-4 mr-2" />
                    ) : (
                      <Mic className="w-4 h-4 mr-2" />
                    )}
                    {isAudioCallActive ? "إيقاف الصوت" : "بدء الصوت"}
                  </Button>
                  
                  <Button
                    variant={screenShareActive ? "destructive" : "outline"}
                    onClick={() => setScreenShareActive(!screenShareActive)}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    {screenShareActive ? "إيقاف المشاركة" : "مشاركة الشاشة"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Controls */}
            <Card>
              <CardHeader>
                <CardTitle>أدوات الفيديو</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">جودة الفيديو</span>
                    <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      <option>عالية (1080p)</option>
                      <option>متوسطة (720p)</option>
                      <option>منخفضة (480p)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">جودة الصوت</span>
                    <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      <option>عالية</option>
                      <option>متوسطة</option>
                      <option>منخفضة</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">مشاركة الملفات</span>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      رفع ملف
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">إحصائيات المكالمة</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>مدة المكالمة:</span>
                      <span>00:05:23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>جودة الاتصال:</span>
                      <Badge className="bg-green-100 text-green-800">ممتازة</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>البيانات المستخدمة:</span>
                      <span>15.2 MB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Knowledge Base */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>قاعدة المعرفة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="ابحث في قاعدة المعرفة..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button>
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold mb-2">كيفية تتبع الشحنة</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          دليل شامل لتتبع الشحنات والاستعلام عن حالة التسليم
                        </p>
                        <Badge className="bg-blue-100 text-blue-800">تتبع</Badge>
                      </div>

                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold mb-2">نظام الدفع</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          شرح طرق الدفع المتاحة والعملات الرقمية المدعومة
                        </p>
                        <Badge className="bg-green-100 text-green-800">دفع</Badge>
                      </div>

                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold mb-2">التأمين على الشحنات</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          معلومات عن بوليصة التأمين والتغطية المتاحة
                        </p>
                        <Badge className="bg-purple-100 text-purple-800">تأمين</Badge>
                      </div>

                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold mb-2">حل المشاكل الشائعة</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          حلول للمشاكل الأكثر شيوعاً في النظام
                        </p>
                        <Badge className="bg-orange-100 text-orange-800">مساعدة</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>التصنيفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      تتبع الشحنات
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      الدفع والفوترة
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      التأمين
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      الإعدادات
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      المساعدة العامة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveSupportSystem;
