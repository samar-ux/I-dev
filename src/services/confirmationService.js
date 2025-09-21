// خدمة إرسال كود التأكيد للعملاء
class ConfirmationService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  // إنشاء كود تأكيد فريد
  generateConfirmationCode() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `IDEV-${timestamp}-${randomPart}`.toUpperCase();
  }

  // إرسال كود التأكيد عبر الرسائل النصية
  async sendSMSConfirmation(phoneNumber, confirmationCode, shipmentDetails) {
    try {
      const message = `
🚚 تأكيد شحنة IDEV
كود التأكيد: ${confirmationCode}
رقم الشحنة: ${shipmentDetails.id}
المستلم: ${shipmentDetails.recipient}
العنوان: ${shipmentDetails.address}
التاريخ: ${new Date().toLocaleDateString('ar-SA')}

استخدم هذا الكود لتأكيد استلام الشحنة
منصة IDEV للشحن والتوصيل
      `.trim();

      // محاكاة إرسال الرسالة النصية
      console.log('📱 إرسال رسالة نصية إلى:', phoneNumber);
      console.log('📄 محتوى الرسالة:', message);

      // في التطبيق الحقيقي، هنا سيتم إرسال الرسالة عبر خدمة SMS
      // مثل Twilio أو أي خدمة أخرى
      
      return {
        success: true,
        messageId: `SMS-${Date.now()}`,
        deliveryStatus: 'sent'
      };
    } catch (error) {
      console.error('خطأ في إرسال الرسالة النصية:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // إرسال كود التأكيد عبر البريد الإلكتروني
  async sendEmailConfirmation(email, confirmationCode, shipmentDetails) {
    try {
      const emailContent = {
        to: email,
        subject: `تأكيد شحنة IDEV - ${shipmentDetails.id}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🚚 منصة IDEV للشحن</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">تأكيد شحنة جديدة</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; text-align: center; margin-bottom: 25px;">كود تأكيد الشحنة</h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h3 style="color: #667eea; font-size: 24px; margin: 0; letter-spacing: 2px;">${confirmationCode}</h3>
                <p style="color: #666; margin: 10px 0 0 0;">استخدم هذا الكود لتأكيد استلام الشحنة</p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #333; margin-bottom: 15px;">تفاصيل الشحنة:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px; font-weight: bold; color: #555;">رقم الشحنة:</td>
                    <td style="padding: 10px; color: #333;">${shipmentDetails.id}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px; font-weight: bold; color: #555;">المستلم:</td>
                    <td style="padding: 10px; color: #333;">${shipmentDetails.recipient}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px; font-weight: bold; color: #555;">العنوان:</td>
                    <td style="padding: 10px; color: #333;">${shipmentDetails.address}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px; font-weight: bold; color: #555;">القيمة:</td>
                    <td style="padding: 10px; color: #333;">${shipmentDetails.value}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold; color: #555;">تاريخ الإنشاء:</td>
                    <td style="padding: 10px; color: #333;">${new Date().toLocaleDateString('ar-SA')}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="color: #1976d2; margin: 0 0 10px 0;">📱 كيفية استخدام الكود:</h4>
                <ol style="color: #555; margin: 0; padding-right: 20px;">
                  <li>احتفظ بكود التأكيد في مكان آمن</li>
                  <li>عند وصول الشحنة، قدم الكود للسائق</li>
                  <li>سيتم تأكيد استلام الشحنة تلقائياً</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">
                  شكراً لاستخدامك منصة IDEV للشحن والتوصيل<br>
                  <strong>تقنية البلوك تشين | أمان وموثوقية</strong>
                </p>
              </div>
            </div>
          </div>
        `
      };

      // محاكاة إرسال البريد الإلكتروني
      console.log('📧 إرسال بريد إلكتروني إلى:', email);
      console.log('📄 موضوع الرسالة:', emailContent.subject);

      // في التطبيق الحقيقي، هنا سيتم إرسال البريد عبر خدمة مثل SendGrid أو AWS SES
      
      return {
        success: true,
        messageId: `EMAIL-${Date.now()}`,
        deliveryStatus: 'sent'
      };
    } catch (error) {
      console.error('خطأ في إرسال البريد الإلكتروني:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // إرسال كود التأكيد عبر WhatsApp (محاكاة)
  async sendWhatsAppConfirmation(phoneNumber, confirmationCode, shipmentDetails) {
    try {
      const message = `🚚 *تأكيد شحنة IDEV*

كود التأكيد: *${confirmationCode}*
رقم الشحنة: ${shipmentDetails.id}
المستلم: ${shipmentDetails.recipient}
العنوان: ${shipmentDetails.address}
القيمة: ${shipmentDetails.value}

استخدم هذا الكود لتأكيد استلام الشحنة

_منصة IDEV للشحن والتوصيل_
_تقنية البلوك تشين | أمان وموثوقية_`;

      console.log('💬 إرسال رسالة WhatsApp إلى:', phoneNumber);
      console.log('📄 محتوى الرسالة:', message);

      return {
        success: true,
        messageId: `WA-${Date.now()}`,
        deliveryStatus: 'sent'
      };
    } catch (error) {
      console.error('خطأ في إرسال رسالة WhatsApp:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // إرسال كود التأكيد عبر جميع القنوات المتاحة
  async sendConfirmationCode(shipmentDetails, contactInfo) {
    try {
      const confirmationCode = this.generateConfirmationCode();
      const results = [];

      // إرسال عبر الرسائل النصية
      if (contactInfo.phone) {
        const smsResult = await this.sendSMSConfirmation(
          contactInfo.phone, 
          confirmationCode, 
          shipmentDetails
        );
        results.push({
          channel: 'SMS',
          ...smsResult
        });
      }

      // إرسال عبر البريد الإلكتروني
      if (contactInfo.email) {
        const emailResult = await this.sendEmailConfirmation(
          contactInfo.email, 
          confirmationCode, 
          shipmentDetails
        );
        results.push({
          channel: 'EMAIL',
          ...emailResult
        });
      }

      // إرسال عبر WhatsApp
      if (contactInfo.phone) {
        const whatsappResult = await this.sendWhatsAppConfirmation(
          contactInfo.phone, 
          confirmationCode, 
          shipmentDetails
        );
        results.push({
          channel: 'WHATSAPP',
          ...whatsappResult
        });
      }

      return {
        success: true,
        confirmationCode,
        results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('خطأ في إرسال كود التأكيد:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // حفظ كود التأكيد في قاعدة البيانات (محاكاة)
  async saveConfirmationCode(shipmentId, confirmationCode, contactInfo) {
    try {
      const confirmationData = {
        shipmentId,
        confirmationCode,
        contactInfo,
        createdAt: new Date().toISOString(),
        status: 'active',
        attempts: 0,
        maxAttempts: 3
      };

      // محاكاة حفظ البيانات
      console.log('💾 حفظ كود التأكيد:', confirmationData);

      // في التطبيق الحقيقي، هنا سيتم حفظ البيانات في قاعدة البيانات
      localStorage.setItem(`confirmation_${shipmentId}`, JSON.stringify(confirmationData));

      return {
        success: true,
        data: confirmationData
      };
    } catch (error) {
      console.error('خطأ في حفظ كود التأكيد:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new ConfirmationService();
