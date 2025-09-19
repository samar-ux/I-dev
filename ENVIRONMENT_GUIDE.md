# 🔧 إعداد متغيرات البيئة - IDEV Web3 Shipping Platform

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد متغيرات البيئة لمشروع IDEV منصة الشحن والتوصيل مع تكامل Web3 والبلوك تشين.

## 🚀 البدء السريع

### 1. إنشاء ملف البيئة

```bash
# انسخ ملف القالب
cp config/env.template .env

# أو انسخ ملف الإعدادات
cp ENVIRONMENT_SETUP.md .env
```

### 2. تحديث المتغيرات المطلوبة

افتح ملف `.env` وحدث القيم التالية:

```env
# إعدادات التطبيق الأساسية
VITE_APP_NAME="IDEV - منصة الشحن والتوصيل"
VITE_APP_URL="http://localhost:5000"
VITE_API_URL="http://localhost:3000/api"

# قاعدة البيانات
DATABASE_URL="postgresql://username:password@localhost:5432/idev_shipping"

# Redis
REDIS_URL="redis://localhost:6379"

# Web3 والبلوك تشين
VITE_ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/YOUR_INFURA_KEY"
VITE_POLYGON_RPC_URL="https://polygon-rpc.com"
```

## 🔑 المتغيرات الأساسية المطلوبة

### 🏗️ إعدادات التطبيق
```env
VITE_APP_NAME="IDEV - منصة الشحن والتوصيل"
VITE_APP_VERSION="2.0.0"
VITE_APP_URL="http://localhost:5000"
VITE_API_URL="http://localhost:3000/api"
```

### 🗄️ قاعدة البيانات
```env
DATABASE_URL="postgresql://username:password@localhost:5432/idev_shipping"
DB_HOST="localhost"
DB_PORT=5432
DB_NAME="idev_shipping"
DB_USER="username"
DB_PASSWORD="password"
```

### 🔗 Web3 والبلوك تشين
```env
# Ethereum
VITE_ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/YOUR_INFURA_KEY"
VITE_ETHEREUM_CHAIN_ID=1

# Polygon
VITE_POLYGON_RPC_URL="https://polygon-rpc.com"
VITE_POLYGON_CHAIN_ID=137

# Binance Smart Chain
VITE_BSC_RPC_URL="https://bsc-dataseed.binance.org"
VITE_BSC_CHAIN_ID=56

# Internet Computer Protocol
VITE_ICP_CANISTER_ID="YOUR_CANISTER_ID"
VITE_ICP_NETWORK_URL="https://ic0.app"
```

### 🔐 الأمان والمصادقة
```env
JWT_SECRET="your-super-secret-jwt-key-here"
ENCRYPTION_KEY="your-32-character-encryption-key"
SESSION_SECRET="your-session-secret-key"
```

### 📧 البريد الإلكتروني
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 💳 بوابات الدفع
```env
# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
```

### 🏪 تكامل منصات الأعمال
```env
# Shopify
SHOPIFY_API_KEY="your-shopify-api-key"
SHOPIFY_API_SECRET="your-shopify-api-secret"

# WooCommerce
WOOCOMMERCE_URL="https://your-store.com"
WOOCOMMERCE_CONSUMER_KEY="your-woocommerce-consumer-key"
WOOCOMMERCE_CONSUMER_SECRET="your-woocommerce-consumer-secret"

# Wix
WIX_API_KEY="your-wix-api-key"
WIX_API_SECRET="your-wix-api-secret"
```

### 🗺️ الخرائط والموقع
```env
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 📊 التحليلات والمراقبة
```env
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
SENTRY_DSN="your-sentry-dsn"
```

## 🔧 إعداد الخدمات الخارجية

### 1. Infura (للبلوك تشين)
1. اذهب إلى [infura.io](https://infura.io)
2. أنشئ حساب جديد
3. احصل على API Key
4. ضع المفتاح في `VITE_ETHEREUM_RPC_URL`

### 2. Stripe (للدفع)
1. اذهب إلى [stripe.com](https://stripe.com)
2. أنشئ حساب جديد
3. احصل على المفاتيح من لوحة التحكم
4. ضع المفاتيح في متغيرات Stripe

### 3. Google Maps
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. فعّل Google Maps API
3. احصل على API Key
4. ضع المفتاح في `GOOGLE_MAPS_API_KEY`

### 4. Twilio (للرسائل النصية)
1. اذهب إلى [twilio.com](https://twilio.com)
2. أنشئ حساب جديد
3. احصل على Account SID و Auth Token
4. ضع القيم في متغيرات Twilio

## 🚀 تشغيل المشروع

### 1. تثبيت التبعيات
```bash
npm install
# أو
pnpm install
```

### 2. تشغيل قاعدة البيانات
```bash
# PostgreSQL
sudo service postgresql start

# Redis
sudo service redis-server start
```

### 3. تشغيل المشروع
```bash
npm run dev
# أو
pnpm dev
```

## 🔒 الأمان

### ⚠️ تحذيرات مهمة:
- **لا تشارك ملف `.env`** في Git
- استخدم مفاتيح مختلفة للإنتاج والتطوير
- غيّر جميع القيم الافتراضية
- استخدم مفاتيح قوية ومعقدة

### 🛡️ أفضل الممارسات:
- استخدم متغيرات مختلفة للإنتاج والتطوير
- فعّل HTTPS في الإنتاج
- استخدم مفاتيح API محدودة الصلاحيات
- راجع الصلاحيات بانتظام

## 📝 ملاحظات إضافية

### 🔄 التحديثات:
- تأكد من تحديث المتغيرات عند تغيير الخدمات
- احتفظ بنسخة احتياطية من ملف `.env`
- وثّق أي تغييرات في المتغيرات

### 🐛 استكشاف الأخطاء:
- تأكد من صحة صيغة المتغيرات
- تحقق من اتصال الخدمات الخارجية
- راجع سجلات الأخطاء

### 📞 الدعم:
إذا واجهت مشاكل في الإعداد، يمكنك:
- مراجعة ملفات التوثيق
- فتح Issue في الريبو
- التواصل مع فريق الدعم

---

## 📋 قائمة التحقق

- [ ] إنشاء ملف `.env`
- [ ] تحديث إعدادات التطبيق
- [ ] إعداد قاعدة البيانات
- [ ] إعداد Redis
- [ ] إعداد Web3 والبلوك تشين
- [ ] إعداد الأمان والمصادقة
- [ ] إعداد البريد الإلكتروني
- [ ] إعداد بوابات الدفع
- [ ] إعداد تكامل منصات الأعمال
- [ ] إعداد الخرائط والموقع
- [ ] إعداد التحليلات والمراقبة
- [ ] اختبار الاتصالات
- [ ] تشغيل المشروع

**🎉 تهانينا! تم إعداد البيئة بنجاح!**
