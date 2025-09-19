import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Award,
  TrendingUp,
  Star,
  Download,
  MessageSquare,
  Package,
  Car,
  Store,
  Building,
  Truck,
  Users,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import '../App.css';

const UserProfile = ({ user, onClose, onEdit }) => {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const [activeTab, setActiveTab] = useState('overview');

  // بيانات وهمية للإحصائيات حسب نوع المستخدم
  const getStatsForUserType = (userType) => {
    switch(userType) {
      case 'customer':
        return [
          { icon: Package, label: 'الطلبات المكتملة', value: '12+', color: 'text-blue-500' },
          { icon: Star, label: 'سنوات الثقة', value: '3+', color: 'text-green-500' },
          { icon: CheckCircle, label: 'التقييم', value: '4.8', color: 'text-yellow-500' }
        ];
      case 'driver':
        return [
          { icon: Truck, label: 'رحلات مكتملة', value: '150+', color: 'text-blue-500' },
          { icon: Clock, label: 'سنوات الخبرة', value: '2+', color: 'text-green-500' },
          { icon: Star, label: 'تقييم السائق', value: '4.9', color: 'text-yellow-500' }
        ];
      case 'store_owner':
        return [
          { icon: Store, label: 'طلبات المتجر', value: '500+', color: 'text-blue-500' },
          { icon: Users, label: 'العملاء', value: '200+', color: 'text-green-500' },
          { icon: TrendingUp, label: 'معدل النمو', value: '25%', color: 'text-purple-500' }
        ];
      case 'company':
        return [
          { icon: Building, label: 'مشاريع منجزة', value: '50+', color: 'text-blue-500' },
          { icon: Users, label: 'فريق العمل', value: '15+', color: 'text-green-500' },
          { icon: Award, label: 'سنوات العمل', value: '5+', color: 'text-purple-500' }
        ];
      default:
        return [];
    }
  };

  // مهارات وقدرات حسب نوع المستخدم
  const getSkillsForUserType = (userType) => {
    switch(userType) {
      case 'customer':
        return [
          { name: 'التسوق الذكي', percentage: 95 },
          { name: 'التقييم والمراجعة', percentage: 88 },
          { name: 'التعامل مع التطبيقات', percentage: 92 }
        ];
      case 'driver':
        return [
          { name: 'القيادة الآمنة', percentage: 98 },
          { name: 'خدمة العملاء', percentage: 90 },
          { name: 'إدارة الوقت', percentage: 95 },
          { name: 'معرفة الطرق', percentage: 92 }
        ];
      case 'store_owner':
        return [
          { name: 'إدارة المخزون', percentage: 95 },
          { name: 'خدمة العملاء', percentage: 90 },
          { name: 'التسويق الرقمي', percentage: 85 },
          { name: 'إدارة المبيعات', percentage: 92 }
        ];
      case 'company':
        return [
          { name: 'إدارة المشاريع', percentage: 95 },
          { name: 'قيادة الفرق', percentage: 90 },
          { name: 'التخطيط الاستراتيجي', percentage: 88 },
          { name: 'حلول اللوجستيات', percentage: 93 }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForUserType(user.userType);
  const skills = getSkillsForUserType(user.userType);

  const getUserTypeIcon = (userType) => {
    switch(userType) {
      case 'customer': return User;
      case 'driver': return Car;
      case 'store_owner': return Store;
      case 'company': return Building;
      default: return User;
    }
  };

  const getUserTypeLabel = (userType) => {
    switch(userType) {
      case 'customer': return 'عميل';
      case 'driver': return 'سائق';
      case 'store_owner': return 'صاحب متجر';
      case 'company': return 'صاحب شركة';
      default: return 'مستخدم';
    }
  };

  const UserTypeIcon = getUserTypeIcon(user.userType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto arabic-text"
        onClick={(e) => e.stopPropagation()}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-800 rounded-t-3xl p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-6">
            {/* صورة المستخدم */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserTypeIcon className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* معلومات أساسية */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <div className="flex items-center gap-2 mb-2">
                <UserTypeIcon className="w-5 h-5" />
                <span className="text-lg">{getUserTypeLabel(user.userType)}</span>
              </div>
              {user.city && (
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span>{user.city}</span>
                </div>
              )}
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex flex-col gap-3">
              <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-2 rounded-full flex items-center gap-2 transition-colors text-white border-0">
                <Download className="w-4 h-4" />
                تحميل السيرة
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-full flex items-center gap-2 transition-colors text-white border-0">
                <MessageSquare className="w-4 h-4" />
                تواصل معي
              </Button>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="p-8">
          {/* الإحصائيات */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="glass-card text-center">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* نبذة شخصية */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <User className="w-5 h-5" />
                نبذة شخصية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  {user.userType === 'customer' && 'عميل متميز يهتم بجودة الخدمة والتسليم في الوقت المحدد. لدي خبرة في التسوق الإلكتروني وأقدر الخدمة الاحترافية.'}
                  {user.userType === 'driver' && 'سائق محترف متخصص في خدمات التوصيل السريع والآمن. أتميز بالالتزام بالمواعيد ومعرفة جيدة بالطرق والمناطق المختلفة.'}
                  {user.userType === 'store_owner' && 'صاحب متجر يسعى لتقديم أفضل المنتجات والخدمات للعملاء. لدي خبرة في إدارة المخزون وخدمة العملاء.'}
                  {user.userType === 'company' && 'شركة رائدة في مجال الخدمات اللوجستية والشحن. نفخر بتقديم حلول متكاملة وخدمات عالية الجودة لعملائنا.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* المهارات والقدرات */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <Award className="w-5 h-5" />
                المهارات والقدرات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{skill.name}</span>
                      <span className="text-blue-600 font-bold">{skill.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* معلومات الاتصال */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">معلومات الاتصال</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                {user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>تاريخ الانضمام: {new Date().toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>الموقع: {user.city || 'غير محدد'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أزرار الإجراءات */}
          <div className="flex gap-4 mt-6">
            <Button onClick={onEdit} className="btn-primary flex-1">
              <User className="w-4 h-4 ml-2" />
              تعديل البروفايل
            </Button>
            <Button variant="outline" onClick={onClose} className="border-primary/20">
              إغلاق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;