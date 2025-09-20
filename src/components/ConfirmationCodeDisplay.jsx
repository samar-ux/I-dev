import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Copy, 
  Send, 
  Smartphone, 
  Mail, 
  MessageCircle,
  X,
  Clock,
  Shield,
  QrCode
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useTranslation } from 'react-i18next';

const ConfirmationCodeDisplay = ({ 
  shipmentDetails, 
  confirmationCode, 
  deliveryResults, 
  onClose,
  onResend 
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(confirmationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('خطأ في نسخ الكود:', error);
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'SMS': return <Smartphone className="w-4 h-4" />;
      case 'EMAIL': return <Mail className="w-4 h-4" />;
      case 'WHATSAPP': return <MessageCircle className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'SMS': return 'bg-blue-500';
      case 'EMAIL': return 'bg-red-500';
      case 'WHATSAPP': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="glass-card border-2 border-primary/30 relative overflow-hidden">
          {/* Header */}
          <CardHeader className="text-center pb-4 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute left-4 top-4 text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  تم إنشاء الشحنة بنجاح
                </CardTitle>
                <p className="text-white/70 text-sm">
                  تم إرسال كود التأكيد للعميل
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 relative z-10">
            {/* Shipment Details */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                تفاصيل الشحنة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/70">رقم الشحنة:</span>
                  <span className="text-white font-medium mr-2">{shipmentDetails.id}</span>
                </div>
                <div>
                  <span className="text-white/70">المستلم:</span>
                  <span className="text-white font-medium mr-2">{shipmentDetails.recipient}</span>
                </div>
                <div>
                  <span className="text-white/70">العنوان:</span>
                  <span className="text-white font-medium mr-2">{shipmentDetails.address}</span>
                </div>
                <div>
                  <span className="text-white/70">القيمة:</span>
                  <span className="text-white font-medium mr-2">{shipmentDetails.value}</span>
                </div>
              </div>
            </div>

            {/* Confirmation Code */}
            <div className="bg-gradient-to-r from-primary/20 to-blue-500/20 backdrop-blur-sm rounded-lg p-6 text-center">
              <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                <QrCode className="w-5 h-5" />
                كود تأكيد الشحنة
              </h3>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-white tracking-wider mb-2">
                  {confirmationCode}
                </div>
                <p className="text-white/70 text-sm">
                  استخدم هذا الكود لتأكيد استلام الشحنة
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Copy className="w-4 h-4 ml-2" />
                  {copied ? 'تم النسخ!' : 'نسخ الكود'}
                </Button>
                
                <Button
                  onClick={() => setShowQR(!showQR)}
                  variant="outline"
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                >
                  <QrCode className="w-4 h-4 ml-2" />
                  {showQR ? 'إخفاء QR' : 'عرض QR'}
                </Button>
              </div>

              {showQR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-white/5 rounded-lg"
                >
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center">
                      <div className="text-xs text-gray-600 text-center">
                        QR Code<br />
                        {confirmationCode}
                      </div>
                    </div>
                    <p className="text-white/70 text-xs mt-2">
                      يمكن للعميل مسح هذا الكود لتأكيد الشحنة
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Delivery Status */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                حالة الإرسال
              </h3>
              
              <div className="space-y-3">
                {deliveryResults?.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${getChannelColor(result.channel)} flex items-center justify-center`}>
                        {getChannelIcon(result.channel)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{result.channel}</p>
                        <p className="text-white/70 text-xs">
                          {result.success ? 'تم الإرسال بنجاح' : 'فشل الإرسال'}
                        </p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={result.success ? "default" : "destructive"}
                      className={result.success ? "bg-green-500" : "bg-red-500"}
                    >
                      {result.success ? 'مرسل' : 'فشل'}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                تعليمات مهمة
              </h4>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• احتفظ بكود التأكيد في مكان آمن</li>
                <li>• سيتم إرسال الكود للعميل عبر جميع القنوات المتاحة</li>
                <li>• يمكن للعميل استخدام الكود لتأكيد استلام الشحنة</li>
                <li>• الكود صالح لمدة 7 أيام من تاريخ الإنشاء</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onResend}
                variant="outline"
                className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
              >
                <Send className="w-4 h-4 ml-2" />
                إعادة إرسال الكود
              </Button>
              
              <Button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
              >
                <CheckCircle className="w-4 h-4 ml-2" />
                تم الفهم
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConfirmationCodeDisplay;
