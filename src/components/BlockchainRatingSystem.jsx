import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Shield, Users, TrendingUp, Award, CheckCircle, 
  AlertTriangle, Clock, Globe, Lock, Zap, BarChart3,
  ThumbsUp, ThumbsDown, MessageCircle, Flag, Eye,
  RefreshCw, Settings, ExternalLink, FileText, Activity,
  Calendar, MapPin, Truck, Package, StarHalf
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const BlockchainRatingSystem = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [reputation, setReputation] = useState({});
  const [newRating, setNewRating] = useState({
    targetId: "",
    targetType: "",
    rating: 5,
    comment: "",
    category: ""
  });
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    loadRatingData();
  }, []);

  const loadRatingData = async () => {
    setIsLoading(true);
    try {
      // محاكاة تحميل البيانات من البلوكشين
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات التقييمات
      const mockRatings = [
        {
          id: "RAT-001",
          targetId: "DRV-001",
          targetType: "driver",
          targetName: "أحمد محمد",
          raterId: "USR-001",
          raterName: "سارة أحمد",
          rating: 5,
          comment: "سائق ممتاز، توصيل سريع وآمن",
          category: "delivery",
          timestamp: "2024-01-15T10:30:00Z",
          blockchainHash: "0x1234567890abcdef...",
          verified: true,
          helpful: 12,
          reported: false
        },
        {
          id: "RAT-002",
          targetId: "CAR-001",
          targetType: "carrier",
          targetName: "شركة الشحن الدولية",
          raterId: "USR-002",
          raterName: "محمد علي",
          rating: 4,
          comment: "خدمة جيدة مع بعض التأخير",
          category: "service",
          timestamp: "2024-01-14T15:45:00Z",
          blockchainHash: "0xabcdef1234567890...",
          verified: true,
          helpful: 8,
          reported: false
        },
        {
          id: "RAT-003",
          targetId: "PKG-001",
          targetType: "package",
          targetName: "شحنة إلكترونيات",
          raterId: "USR-003",
          raterName: "فاطمة خالد",
          rating: 3,
          comment: "البضاعة وصلت بحالة جيدة لكن مع تأخير",
          category: "condition",
          timestamp: "2024-01-13T09:20:00Z",
          blockchainHash: "0x567890abcdef1234...",
          verified: true,
          helpful: 5,
          reported: false
        }
      ];

      // بيانات السمعة
      const mockReputation = {
        drivers: [
          {
            id: "DRV-001",
            name: "أحمد محمد",
            avatar: "/avatars/ahmed.jpg",
            totalRatings: 156,
            averageRating: 4.8,
            reputationScore: 95,
            verified: true,
            badges: ["ممتاز", "سريع", "موثوق"],
            recentRatings: [
              { rating: 5, comment: "ممتاز جداً" },
              { rating: 5, comment: "توصيل سريع" },
              { rating: 4, comment: "جيد جداً" }
            ]
          },
          {
            id: "DRV-002",
            name: "محمد علي",
            avatar: "/avatars/mohammed.jpg",
            totalRatings: 89,
            averageRating: 4.2,
            reputationScore: 78,
            verified: true,
            badges: ["جيد", "موثوق"],
            recentRatings: [
              { rating: 4, comment: "جيد" },
              { rating: 4, comment: "مقبول" },
              { rating: 5, comment: "ممتاز" }
            ]
          }
        ],
        carriers: [
          {
            id: "CAR-001",
            name: "شركة الشحن الدولية",
            logo: "/logos/shipping-intl.jpg",
            totalRatings: 234,
            averageRating: 4.5,
            reputationScore: 88,
            verified: true,
            badges: ["موثوق", "سريع", "احترافي"],
            recentRatings: [
              { rating: 5, comment: "خدمة ممتازة" },
              { rating: 4, comment: "جيد جداً" },
              { rating: 4, comment: "مقبول" }
            ]
          }
        ]
      };

      setRatings(mockRatings);
      setReputation(mockReputation);
    } catch (error) {
      console.error('Failed to load rating data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!newRating.targetId || !newRating.comment) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      // محاكاة إرسال التقييم إلى البلوكشين
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const rating = {
        id: `RAT-${Date.now()}`,
        targetId: newRating.targetId,
        targetType: newRating.targetType,
        targetName: "كيان جديد",
        raterId: "USR-CURRENT",
        raterName: "المستخدم الحالي",
        rating: newRating.rating,
        comment: newRating.comment,
        category: newRating.category,
        timestamp: new Date().toISOString(),
        blockchainHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
        verified: true,
        helpful: 0,
        reported: false
      };

      setRatings(prev => [rating, ...prev]);
      setNewRating({
        targetId: "",
        targetType: "",
        rating: 5,
        comment: "",
        category: ""
      });
      setShowRatingModal(false);

      alert('تم إرسال التقييم بنجاح! تم تسجيله على البلوكشين');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpfulRating = async (ratingId) => {
    try {
      setRatings(prev => prev.map(rating => 
        rating.id === ratingId 
          ? { ...rating, helpful: rating.helpful + 1 }
          : rating
      ));
    } catch (error) {
      console.error('Failed to mark rating as helpful:', error);
    }
  };

  const handleReportRating = async (ratingId) => {
    try {
      setRatings(prev => prev.map(rating => 
        rating.id === ratingId 
          ? { ...rating, reported: true }
          : rating
      ));
      alert('تم الإبلاغ عن التقييم. سيتم مراجعته من قبل فريق الإدارة');
    } catch (error) {
      console.error('Failed to report rating:', error);
    }
  };

  const renderStars = (rating, size = "sm") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 text-yellow-400 fill-current ${size === "lg" ? "w-6 h-6" : ""}`} 
        />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarHalf 
          key="half" 
          className={`w-4 h-4 text-yellow-400 fill-current ${size === "lg" ? "w-6 h-6" : ""}`} 
        />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className={`w-4 h-4 text-gray-300 ${size === "lg" ? "w-6 h-6" : ""}`} 
        />
      );
    }
    
    return stars;
  };

  const getReputationColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getReputationBadge = (score) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">ممتاز</Badge>;
    if (score >= 70) return <Badge className="bg-blue-100 text-blue-800">جيد</Badge>;
    if (score >= 50) return <Badge className="bg-yellow-100 text-yellow-800">مقبول</Badge>;
    return <Badge className="bg-red-100 text-red-800">ضعيف</Badge>;
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
            نظام التقييم والسمعة القائم على البلوكشين
          </h1>
          <p className="text-white/80 text-lg">
            تقييمات لامركزية غير قابلة للتزوير مبنية على تقنية البلوكشين
          </p>
        </motion.div>

        {/* Blockchain Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="text-white font-semibold">غير قابل للتزوير</h3>
                    <p className="text-white/70 text-sm">محمي بتقنية البلوكشين</p>
                  </div>
                </div>
                <Lock className="w-6 h-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold">لامركزي</h3>
                    <p className="text-white/70 text-sm">لا توجد سلطة مركزية</p>
                  </div>
                </div>
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="text-white font-semibold">موثق</h3>
                    <p className="text-white/70 text-sm">جميع التقييمات موثقة</p>
                  </div>
                </div>
                <Award className="w-6 h-6 text-purple-400" />
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
            <TabsTrigger value="ratings" className="text-white data-[state=active]:bg-white/20">
              التقييمات
            </TabsTrigger>
            <TabsTrigger value="reputation" className="text-white data-[state=active]:bg-white/20">
              السمعة
            </TabsTrigger>
            <TabsTrigger value="submit" className="text-white data-[state=active]:bg-white/20">
              إضافة تقييم
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
              التحليلات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Ratings */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    التقييمات الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ratings.slice(0, 5).map((rating) => (
                      <div key={rating.id} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-500 text-white text-xs">
                                {rating.raterName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-white font-medium text-sm">{rating.raterName}</div>
                              <div className="text-white/70 text-xs">{rating.targetName}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(rating.rating)}
                          </div>
                        </div>
                        <p className="text-white/80 text-sm mb-2">{rating.comment}</p>
                        <div className="flex items-center justify-between text-xs text-white/60">
                          <span>{new Date(rating.timestamp).toLocaleDateString('ar-SA')}</span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {rating.helpful}
                            </span>
                            <Badge variant="outline" className="text-xs border-green-300 text-green-300">
                              موثق
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Rated Entities */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    الأعلى تقييماً
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reputation.drivers?.slice(0, 3).map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-500 text-white">
                              {driver.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-white font-medium">{driver.name}</div>
                            <div className="text-white/70 text-sm">{driver.totalRatings} تقييم</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {renderStars(driver.averageRating)}
                          </div>
                          <div className={`text-sm font-semibold ${getReputationColor(driver.reputationScore)}`}>
                            {driver.averageRating}/5
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blockchain Verification */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  التحقق من البلوكشين
                </CardTitle>
                <CardDescription className="text-white/70">
                  جميع التقييمات محمية ومؤكدة على البلوكشين
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-800 dark:text-green-200">تقييمات موثقة</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">جميع التقييمات محمية</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">غير قابلة للتزوير</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">محمية بتقنية البلوكشين</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200">لامركزية</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">لا توجد سلطة مركزية</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white">المقيّم</TableHead>
                      <TableHead className="text-white">المقيّم عليه</TableHead>
                      <TableHead className="text-white">التقييم</TableHead>
                      <TableHead className="text-white">التعليق</TableHead>
                      <TableHead className="text-white">التاريخ</TableHead>
                      <TableHead className="text-white">الحالة</TableHead>
                      <TableHead className="text-white">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ratings.map((rating) => (
                      <TableRow key={rating.id} className="border-white/20">
                        <TableCell className="text-white">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-500 text-white text-xs">
                                {rating.raterName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{rating.raterName}</div>
                              <div className="text-white/70 text-xs">{rating.raterId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium text-sm">{rating.targetName}</div>
                            <div className="text-white/70 text-xs">{rating.targetType}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex items-center gap-1">
                            {renderStars(rating.rating)}
                            <span className="text-sm ml-1">{rating.rating}/5</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="max-w-xs truncate">{rating.comment}</div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="text-sm">
                            {new Date(rating.timestamp).toLocaleDateString('ar-SA')}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex items-center gap-2">
                            {rating.verified ? (
                              <Badge className="bg-green-100 text-green-800">موثق</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
                            )}
                            {rating.reported && (
                              <Badge className="bg-red-100 text-red-800">مبلغ عنه</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10"
                              onClick={() => handleHelpfulRating(rating.id)}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10"
                              onClick={() => handleReportRating(rating.id)}
                            >
                              <Flag className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              <Eye className="w-4 h-4" />
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

          {/* Reputation Tab */}
          <TabsContent value="reputation" className="space-y-6">
            {/* Drivers Reputation */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-400" />
                  سمعة السائقين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reputation.drivers?.map((driver) => (
                    <div key={driver.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-500 text-white">
                              {driver.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-white font-semibold">{driver.name}</div>
                            <div className="text-white/70 text-sm">{driver.totalRatings} تقييم</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getReputationBadge(driver.reputationScore)}
                          <div className={`text-lg font-bold mt-1 ${getReputationColor(driver.reputationScore)}`}>
                            {driver.reputationScore}/100
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-white/70 text-sm">متوسط التقييم</div>
                          <div className="flex items-center gap-1">
                            {renderStars(driver.averageRating, "lg")}
                            <span className="text-white font-semibold ml-2">{driver.averageRating}/5</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-white/70 text-sm">الشارات</div>
                          <div className="flex gap-1 mt-1">
                            {driver.badges.map((badge, index) => (
                              <Badge key={index} variant="outline" className="border-white/30 text-white text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-white/70 text-sm mb-2">التقييمات الأخيرة</div>
                        <div className="space-y-2">
                          {driver.recentRatings.map((rating, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                              <div className="flex items-center gap-2">
                                {renderStars(rating.rating)}
                                <span className="text-white/80 text-sm">{rating.comment}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Carriers Reputation */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-400" />
                  سمعة شركات الشحن
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reputation.carriers?.map((carrier) => (
                    <div key={carrier.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-green-500 text-white">
                              {carrier.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-white font-semibold">{carrier.name}</div>
                            <div className="text-white/70 text-sm">{carrier.totalRatings} تقييم</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getReputationBadge(carrier.reputationScore)}
                          <div className={`text-lg font-bold mt-1 ${getReputationColor(carrier.reputationScore)}`}>
                            {carrier.reputationScore}/100
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-white/70 text-sm">متوسط التقييم</div>
                          <div className="flex items-center gap-1">
                            {renderStars(carrier.averageRating, "lg")}
                            <span className="text-white font-semibold ml-2">{carrier.averageRating}/5</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-white/70 text-sm">الشارات</div>
                          <div className="flex gap-1 mt-1">
                            {carrier.badges.map((badge, index) => (
                              <Badge key={index} variant="outline" className="border-white/30 text-white text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-white/70 text-sm mb-2">التقييمات الأخيرة</div>
                        <div className="space-y-2">
                          {carrier.recentRatings.map((rating, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                              <div className="flex items-center gap-2">
                                {renderStars(rating.rating)}
                                <span className="text-white/80 text-sm">{rating.comment}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Rating Tab */}
          <TabsContent value="submit" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  إضافة تقييم جديد
                </CardTitle>
                <CardDescription className="text-white/70">
                  سيتم تسجيل التقييم على البلوكشين لضمان عدم التزوير
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">معرف الكيان المراد تقييمه *</Label>
                    <Input
                      value={newRating.targetId}
                      onChange={(e) => setNewRating(prev => ({ ...prev, targetId: e.target.value }))}
                      placeholder="DRV-001, CAR-001, PKG-001"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">نوع الكيان *</Label>
                    <Select value={newRating.targetType} onValueChange={(value) => setNewRating(prev => ({ ...prev, targetType: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="اختر نوع الكيان" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="driver">سائق</SelectItem>
                        <SelectItem value="carrier">شركة شحن</SelectItem>
                        <SelectItem value="package">شحنة</SelectItem>
                        <SelectItem value="service">خدمة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">التقييم *</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={newRating.rating}
                        onChange={(e) => setNewRating(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-1">
                        {renderStars(newRating.rating)}
                        <span className="text-white font-semibold ml-2">{newRating.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">فئة التقييم</Label>
                    <Select value={newRating.category} onValueChange={(value) => setNewRating(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery">التوصيل</SelectItem>
                        <SelectItem value="service">الخدمة</SelectItem>
                        <SelectItem value="condition">حالة البضاعة</SelectItem>
                        <SelectItem value="communication">التواصل</SelectItem>
                        <SelectItem value="timing">التوقيت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">التعليق *</Label>
                  <Textarea
                    value={newRating.comment}
                    onChange={(e) => setNewRating(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="اكتب تعليقك المفصل حول التجربة..."
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    rows={4}
                  />
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">معلومات البلوكشين</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/70">الحماية:</span>
                      <span className="text-white font-semibold ml-2">محمي بالبلوكشين</span>
                    </div>
                    <div>
                      <span className="text-white/70">التزوير:</span>
                      <span className="text-white font-semibold ml-2">غير ممكن</span>
                    </div>
                    <div>
                      <span className="text-white/70">الشفافية:</span>
                      <span className="text-white font-semibold ml-2">كاملة</span>
                    </div>
                    <div>
                      <span className="text-white/70">اللامركزية:</span>
                      <span className="text-white font-semibold ml-2">مضمونة</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitRating}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      جاري إرسال التقييم إلى البلوكشين...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      إرسال التقييم إلى البلوكشين
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
                    إحصائيات التقييمات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي التقييمات</span>
                      <span className="text-white font-semibold">{ratings.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">متوسط التقييم العام</span>
                      <span className="text-white font-semibold">
                        {(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)}/5
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">التقييمات الموثقة</span>
                      <span className="text-white font-semibold">
                        {ratings.filter(r => r.verified).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">معدل التقييمات المفيدة</span>
                      <span className="text-white font-semibold">
                        {ratings.length > 0 ? Math.round(ratings.reduce((sum, r) => sum + r.helpful, 0) / ratings.length) : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    إحصائيات السمعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">إجمالي الكيانات</span>
                      <span className="text-white font-semibold">
                        {(reputation.drivers?.length || 0) + (reputation.carriers?.length || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">متوسط السمعة</span>
                      <span className="text-white font-semibold">
                        {(() => {
                          const allEntities = [...(reputation.drivers || []), ...(reputation.carriers || [])];
                          return allEntities.length > 0 ? 
                            Math.round(allEntities.reduce((sum, e) => sum + e.reputationScore, 0) / allEntities.length) : 0;
                        })()}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">الكيانات المتميزة</span>
                      <span className="text-white font-semibold">
                        {(() => {
                          const allEntities = [...(reputation.drivers || []), ...(reputation.carriers || [])];
                          return allEntities.filter(e => e.reputationScore >= 90).length;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">الكيانات الموثقة</span>
                      <span className="text-white font-semibold">
                        {(() => {
                          const allEntities = [...(reputation.drivers || []), ...(reputation.carriers || [])];
                          return allEntities.filter(e => e.verified).length;
                        })()}
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
                    <div className="text-3xl font-bold text-green-400 mb-2">98.5%</div>
                    <div className="text-white/70">معدل التقييمات الموثقة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">4.2</div>
                    <div className="text-white/70">متوسط التقييم العام</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">0.1%</div>
                    <div className="text-white/70">معدل التقييمات المبلغ عنها</div>
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

export default BlockchainRatingSystem;
