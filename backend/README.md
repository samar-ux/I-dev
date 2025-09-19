# Web3 Shipping Platform - Backend

## نظرة عامة

هذا هو الباك إند لمنصة الشحن اللامركزية المبنية بلغة Rust. يوفر API شامل لجميع مكونات المنصة بما في ذلك المصادقة المتقدمة، التكامل مع Web3 وICP، نظام التتبع الذكي، الذكاء الاصطناعي، الدعم الفني، ونظام التأكيد المزدوج.

## المميزات الرئيسية

### 🔐 نظام المصادقة المتقدم
- مصادقة متعددة العوامل
- تكامل مع World ID
- عمليات KYC/AML
- Internet Identity مع ICP
- التحقق البيومتري

### 🌐 تكامل Web3 وICP
- دعم العملات الرقمية (BTC, ETH, USDT, USDC, BNB, ADA, SOL, MATIC)
- عقود ذكية على Ethereum
- تكامل كامل مع Internet Computer Protocol (ICP)
- تحويل الشحنات إلى NFT

### 📍 نظام التتبع الذكي
- تتبع GPS في الوقت الفعلي
- تحديثات الموقع كل 5 ثواني
- إشعارات فورية
- تحويل الشحنات إلى NFT

### 🤖 الذكاء الاصطناعي
- اقتراحات ذكية لتحسين المسارات
- توقعات تنبؤية للطلب
- تقييم المخاطر
- رؤى ذكية للأعمال

### 🎧 نظام الدعم الفني
- نظام التذاكر
- الدردشة المباشرة
- الدعم المرئي
- قاعدة المعرفة

### ✅ نظام التأكيد المزدوج
- تأكيدات مشفرة وآمنة
- توقيعات رقمية
- تنفيذ تلقائي عبر العقود الذكية

## التقنيات المستخدمة

- **Language**: Rust
- **Web Framework**: Axum
- **Database**: PostgreSQL with SQLx
- **Cache**: Redis
- **Authentication**: JWT + Argon2
- **Web3**: Ethers.rs, Web3.rs
- **ICP**: ic-agent, ic-cdk
- **AI**: OpenAI, Anthropic APIs
- **External Services**: Twilio, SendGrid

## التثبيت والتشغيل

### المتطلبات

- Rust 1.70+
- PostgreSQL 13+
- Redis 6+
- Node.js 18+ (للتطوير)

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd web3-shipping-platform/backend
```

2. **تثبيت التبعيات**
```bash
cargo build
```

3. **إعداد قاعدة البيانات**
```bash
# إنشاء قاعدة البيانات
createdb web3_shipping_platform

# تشغيل المايجريشن
cargo run --bin migrate
```

4. **إعداد متغيرات البيئة**
```bash
cp env.example .env
# تعديل ملف .env بالقيم المناسبة
```

5. **تشغيل الخادم**
```bash
cargo run
```

## إعداد متغيرات البيئة

### إعدادات الخادم
```env
SERVER_ADDRESS=0.0.0.0:3000
LOG_LEVEL=info
PROMETHEUS_PORT=9090
```

### قاعدة البيانات
```env
DATABASE_URL=postgresql://user:password@localhost:5432/web3_shipping_platform
REDIS_URL=redis://localhost:6379
```

### الأمان
```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=3600
ENCRYPTION_KEY=your-encryption-key
```

### Web3 وICP
```env
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
ETHEREUM_CHAIN_ID=1
ETHEREUM_PRIVATE_KEY=your-private-key
ICP_CANISTER_ID=your-canister-id
ICP_NETWORK_URL=https://ic0.app
```

### الخدمات الخارجية
```env
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
SENDGRID_API_KEY=your-sendgrid-key
OPENAI_API_KEY=your-openai-key
```

## API Documentation

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/kyc` - التحقق من الهوية
- `POST /api/auth/biometric` - المصادقة البيومترية
- `POST /api/auth/world-id` - التحقق عبر World ID
- `POST /api/auth/internet-identity` - المصادقة عبر ICP

### Web3 والبلوك تشين
- `POST /api/web3/connect` - ربط المحفظة
- `GET /api/web3/balance` - الحصول على الرصيد
- `POST /api/web3/send` - إرسال معاملة
- `POST /api/web3/nft/mint` - سك NFT
- `POST /api/icp/connect` - ربط ICP
- `POST /api/icp/call` - استدعاء كانيستر

### التتبع
- `POST /api/tracking/create` - إنشاء شحنة
- `GET /api/tracking/:id` - الحصول على شحنة
- `PUT /api/tracking/:id/update` - تحديث الموقع
- `PUT /api/tracking/:id/status` - تحديث الحالة
- `POST /api/tracking/:id/nft` - تحويل إلى NFT

### الذكاء الاصطناعي
- `GET /api/ai/suggestions` - الحصول على الاقتراحات
- `GET /api/ai/predictions` - التوقعات التنبؤية
- `GET /api/ai/risks` - تقييم المخاطر
- `GET /api/ai/insights` - الرؤى الذكية
- `POST /api/ai/apply-suggestion` - تطبيق اقتراح

### الدعم الفني
- `GET /api/support/tickets` - الحصول على التذاكر
- `POST /api/support/tickets` - إنشاء تذكرة
- `POST /api/support/chat/start` - بدء دردشة
- `POST /api/support/chat/:id/messages` - إرسال رسالة
- `POST /api/support/video/start` - بدء مكالمة فيديو

### التأكيد المزدوج
- `POST /api/confirmation/create` - إنشاء تأكيد
- `GET /api/confirmation/:id` - الحصول على تأكيد
- `POST /api/confirmation/:id/confirm` - تأكيد
- `GET /api/confirmation/pending` - التأكيدات المعلقة
- `GET /api/confirmation/completed` - التأكيدات المكتملة

## البنية التحتية

### قاعدة البيانات
- **Users**: معلومات المستخدمين والمصادقة
- **Shipments**: بيانات الشحنات
- **Location Updates**: تحديثات الموقع
- **AI Suggestions**: اقتراحات الذكاء الاصطناعي
- **Support Tickets**: تذاكر الدعم الفني
- **Chat Messages**: رسائل الدردشة
- **Confirmations**: التأكيدات المزدوجة
- **Insurance Policies**: بوالص التأمين
- **Ratings**: التقييمات
- **Payments**: المدفوعات

### الأمان
- تشفير كلمات المرور باستخدام Argon2
- JWT للمصادقة
- تشفير البيانات الحساسة
- Rate limiting
- CORS protection

### المراقبة
- Prometheus metrics
- Structured logging
- Health checks
- Error tracking

## التطوير

### تشغيل الاختبارات
```bash
cargo test
```

### تشغيل الاختبارات مع التغطية
```bash
cargo tarpaulin --out Html
```

### فحص الكود
```bash
cargo clippy
cargo fmt
```

### بناء للإنتاج
```bash
cargo build --release
```

## النشر

### Docker
```bash
docker build -t web3-shipping-backend .
docker run -p 3000:3000 web3-shipping-backend
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. إنشاء Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف LICENSE للتفاصيل.

## الدعم

للحصول على الدعم، يرجى:
- فتح issue في GitHub
- التواصل عبر البريد الإلكتروني
- الانضمام إلى Discord community

## التحديثات المستقبلية

- [ ] دعم المزيد من العملات الرقمية
- [ ] تكامل مع المزيد من منصات الأعمال
- [ ] تحسينات الذكاء الاصطناعي
- [ ] دعم المزيد من اللغات
- [ ] تطبيق موبايل
- [ ] تكامل مع المزيد من شبكات البلوك تشين
