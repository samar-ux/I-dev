import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Mail, 
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
  Award,
  TrendingUp
} from 'lucide-react';

const UserProfileCard = ({ userType, isDemo = true }) => {
  // بيانات تجريبية مختلفة حسب نوع المستخدم
  const getDemoData = (type) => {
    switch(type) {
      case 'customer':
        return {
          name: 'أحمد محمد',
          title: 'عميل متميز',
          location: 'الرياض، السعودية',
          avatar: '/api/placeholder/120/120',
          stats: [
            { label: 'الطلبات المكتملة', value: '12+', icon: Package, color: 'text-blue-500' },
            { label: 'سنوات الثقة', value: '3+', icon: Clock, color: 'text-green-500' },
            { label: 'التقييم', value: '4.8', icon: Star, color: 'text-yellow-500' }
          ],
          skills: [
            { name: 'التسوق الذكي', percentage: 95 },
            { name: 'التقييم', percentage: 88 },
            { name: 'التطبيقات', percentage: 92 }
          ],
          description: 'عميل متميز يهتم بجودة الخدمة والتسليم في الوقت المحدد.'
        };
      case 'driver':
        return {
          name: 'خالد العتيبي',
          title: 'سائق محترف',
          location: 'جدة، السعودية',
          avatar: '/api/placeholder/120/120',
          stats: [
            { label: 'رحلات مكتملة', value: '150+', icon: Truck, color: 'text-blue-500' },
            { label: 'سنوات الخبرة', value: '2+', icon: Clock, color: 'text-green-500' },
            { label: 'تقييم السائق', value: '4.9', icon: Star, color: 'text-yellow-500' }
          ],
          skills: [
            { name: 'القيادة الآمنة', percentage: 98 },
            { name: 'خدمة العملاء', percentage: 90 },
            { name: 'إدارة الوقت', percentage: 95 },
            { name: 'معرفة الطرق', percentage: 92 }
          ],
          description: 'سائق محترف متخصص في خدمات التوصيل السريع والآمن.'
        };
      case 'store_owner':
        return {
          name: 'فاطمة الأحمد',
          title: 'صاحبة متجر',
          location: 'الدمام، السعودية',
          avatar: '/api/placeholder/120/120',
          stats: [
            { label: 'طلبات المتجر', value: '500+', icon: Store, color: 'text-blue-500' },
            { label: 'العملاء', value: '200+', icon: Users, color: 'text-green-500' },
            { label: 'معدل النمو', value: '25%', icon: TrendingUp, color: 'text-purple-500' }
          ],
          skills: [
            { name: 'إدارة المخزون', percentage: 95 },
            { name: 'خدمة العملاء', percentage: 90 },
            { name: 'التسويق الرقمي', percentage: 85 },
            { name: 'إدارة المبيعات', percentage: 92 }
          ],
          description: 'صاحبة متجر تسعى لتقديم أفضل المنتجات والخدمات.'
        };
      case 'company':
        return {
          name: 'شركة النقل السريع',
          title: 'شركة لوجستية',
          location: 'المنطقة الشرقية، السعودية',
          avatar: '/api/placeholder/120/120',
          stats: [
            { label: 'مشاريع منجزة', value: '50+', icon: Building, color: 'text-blue-500' },
            { label: 'فريق العمل', value: '15+', icon: Users, color: 'text-green-500' },
            { label: 'سنوات العمل', value: '5+', icon: Award, color: 'text-purple-500' }
          ],
          skills: [
            { name: 'إدارة المشاريع', percentage: 95 },
            { name: 'قيادة الفرق', percentage: 90 },
            { name: 'التخطيط الاستراتيجي', percentage: 88 },
            { name: 'حلول اللوجستيات', percentage: 93 }
          ],
          description: 'شركة رائدة في مجال الخدمات اللوجستية والشحن.'
        };
      default:
        return null;
    }
  };

  const data = getDemoData(userType);
  
  if (!data) return null;

  const getUserTypeIcon = (type) => {
    switch(type) {
      case 'customer': return User;
      case 'driver': return Car;
      case 'store_owner': return Store;
      case 'company': return Building;
      default: return User;
    }
  };

  const UserTypeIcon = getUserTypeIcon(userType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      dir="rtl"
    >
      {/* Header مع الخلفية الملونة */}
      <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-800 p-8 text-white">
        {/* الشكل الديكوري */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
        
        {/* صورة المستخدم */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto overflow-hidden">
            <UserTypeIcon className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* معلومات المستخدم */}
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1">{data.name}</h2>
          <p className="text-white/90 mb-2">{data.title}</p>
          <div className="flex items-center justify-center gap-1 text-white/80 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{data.location}</span>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex justify-center gap-3 mt-4">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 transition-colors text-sm">
            <Download className="w-3 h-3" />
            السيرة
          </button>
          <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-full flex items-center gap-2 transition-colors text-sm">
            <MessageSquare className="w-3 h-3" />
            تواصل
          </button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="p-6">
        {/* النبذة */}
        <div className="mb-6">
          <div className="text-center text-gray-700 text-sm leading-relaxed">
            {data.description}
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {data.stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2`}>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600 text-xs">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* المهارات */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            المهارات
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {data.skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-xs font-medium text-gray-700 mb-1">{skill.name}</div>
                <div className="text-sm text-blue-600 font-bold">{skill.percentage}%</div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 1 }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfileCard;