import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, CheckCircle, Star, Crown, Diamond, 
  Globe, Lock, Award, Zap, Sparkles
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const UserVerificationCard = ({ 
  userType, 
  verificationLevel, 
  verificationStatus, 
  userData,
  isSelected = false,
  onClick 
}) => {
  const getVerificationInfo = () => {
    switch (verificationLevel) {
      case 'standard':
        return {
          title: 'المستوى العادي',
          description: 'تسجيل بالبيانات الأساسية',
          icon: Shield,
          color: 'bg-blue-500',
          borderColor: 'border-blue-300',
          bgColor: 'bg-blue-50',
          features: [
            'تسجيل بالبريد الإلكتروني',
            'تحقق برقم الهاتف',
            'كلمة مرور آمنة',
            'حماية أساسية'
          ],
          badges: ['أساسي', 'سريع']
        };
      
      case 'advanced':
        return {
          title: 'المستوى المتقدم',
          description: 'تسجيل متكامل مع تقنيات متقدمة',
          icon: Crown,
          color: 'bg-gradient-to-r from-purple-500 to-pink-500',
          borderColor: 'border-purple-300',
          bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
          features: [
            'تكامل World ID',
            'عمليات KYC/AML',
            'Internet Identity للـ ICP',
            'مصادقة متعددة العوامل',
            'تحقق بيومتري',
            'حماية فائقة'
          ],
          badges: ['متقدم', 'آمن', 'Web3']
        };
      
      default:
        return {
          title: 'المستوى الأساسي',
          description: 'تسجيل بسيط',
          icon: Shield,
          color: 'bg-gray-500',
          borderColor: 'border-gray-300',
          bgColor: 'bg-gray-50',
          features: ['تسجيل أساسي'],
          badges: ['بسيط']
        };
    }
  };

  const getUserTypeInfo = () => {
    switch (userType) {
      case 'customer':
        return { icon: '👤', title: 'عميل', color: 'text-blue-600' };
      case 'store_owner':
        return { icon: '🏪', title: 'تاجر', color: 'text-green-600' };
      case 'driver':
        return { icon: '🚚', title: 'سائق', color: 'text-orange-600' };
      case 'company':
        return { icon: '🏢', title: 'شركة', color: 'text-purple-600' };
      default:
        return { icon: '👤', title: 'مستخدم', color: 'text-gray-600' };
    }
  };

  const verificationInfo = getVerificationInfo();
  const userTypeInfo = getUserTypeInfo();
  const IconComponent = verificationInfo.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card 
        className={`transition-all duration-300 ${
          isSelected 
            ? `${verificationInfo.borderColor} border-2 shadow-xl ${verificationInfo.bgColor}` 
            : 'hover:shadow-lg border border-gray-200 hover:border-gray-300'
        }`}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${verificationInfo.color} flex items-center justify-center text-white shadow-lg`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{verificationInfo.title}</h3>
                <p className="text-sm text-gray-600">{verificationInfo.description}</p>
              </div>
            </div>
            
            {/* User Type Badge */}
            <div className="text-right">
              <div className={`text-2xl mb-1 ${userTypeInfo.color}`}>
                {userTypeInfo.icon}
              </div>
              <Badge variant="secondary" className="text-xs">
                {userTypeInfo.title}
              </Badge>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-4">
            {verificationInfo.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {verificationInfo.badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  variant={verificationLevel === 'advanced' ? 'default' : 'secondary'}
                  className={`text-xs ${
                    verificationLevel === 'advanced' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : ''
                  }`}
                >
                  {badge}
                </Badge>
              ))}
            </div>
            
            {/* Verification Status */}
            {verificationStatus && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  verificationStatus === 'verified' ? 'bg-green-500' : 
                  verificationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-600">
                  {verificationStatus === 'verified' ? 'محقق' : 
                   verificationStatus === 'pending' ? 'قيد المراجعة' : 'غير محقق'}
                </span>
              </div>
            )}
          </div>

          {/* Advanced Features Highlight */}
          {verificationLevel === 'advanced' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 border border-purple-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">مميزات متقدمة</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>World ID</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>KYC/AML</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>ICP Identity</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>MFA</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserVerificationCard;
