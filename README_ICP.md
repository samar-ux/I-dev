# 🚀 I-dev Shipping Platform - ICP Integration
# 🚀 منصة شحن وتوصيل I-dev - تكامل ICP

## نظرة عامة | Overview

منصة شحن وتوصيل متطورة مع تكامل كامل لـ Internet Computer Protocol (ICP) وWeb3 والبلوك تشين.

Advanced shipping and delivery platform with full Internet Computer Protocol (ICP) and Web3 blockchain integration.

## 🌐 ICP Canister Information

- **Canister ID**: `93343-A7BDB-4F45F`
- **Network**: ICP Mainnet
- **Frontend URL**: https://93343-A7BDB-4F45F.ic0.app
- **API URL**: https://93343-A7BDB-4F45F.ic0.app/api
- **Health Check**: https://93343-A7BDB-4F45F.ic0.app/health

## ✨ الميزات الرئيسية | Key Features

### 🎯 الواجهة الأمامية | Frontend
- ✅ React 19 + Vite
- ✅ Tailwind CSS
- ✅ Responsive Design
- ✅ Dark/Light Mode
- ✅ Internationalization (Arabic/English)
- ✅ Web3 Integration

### 🔧 الخادم الخلفي | Backend
- ✅ Rust + Axum
- ✅ PostgreSQL Database
- ✅ Redis Cache
- ✅ JWT Authentication
- ✅ Web3 Payments
- ✅ Real-time Tracking

### 🌐 Web3 Integration
- ✅ Ethereum Support
- ✅ Polygon Support
- ✅ BSC Support
- ✅ ICP Integration
- ✅ Smart Contracts

## 🚀 النشر السريع | Quick Deployment

### 1. تثبيت المتطلبات | Install Prerequisites

```bash
# تثبيت DFX
curl -fsSL https://internetcomputer.org/install.sh | sh

# إضافة إلى PATH
export PATH="$HOME/.local/bin:$PATH"
```

### 2. إعداد الهوية | Setup Identity

```bash
# إنشاء هوية جديدة
dfx identity new default
dfx identity use default
```

### 3. النشر | Deploy

```bash
# اختبار النشر المحلي
npm run test:icp

# النشر على الشبكة المحلية
npm run deploy:icp:local

# النشر على الشبكة الرئيسية
npm run deploy:icp:mainnet
```

## 📋 الأوامر المتاحة | Available Commands

### إدارة Canister | Canister Management
```bash
npm run canister:status   # فحص الحالة
npm run canister:info     # عرض المعلومات
npm run canister:test     # اختبار Canister
npm run canister:update   # تحديث Canister
npm run canister:logs     # عرض السجلات
```

### النشر | Deployment
```bash
npm run deploy:icp        # النشر العام
npm run deploy:icp:local  # النشر المحلي
npm run deploy:icp:mainnet # النشر على الشبكة الرئيسية
npm run test:icp          # اختبار النشر
npm run build:icp         # بناء المشروع لـ ICP
```

### التطوير | Development
```bash
npm run dev               # تشغيل وضع التطوير
npm run build             # بناء المشروع
npm run preview           # معاينة المشروع
npm run lint              # فحص الكود
```

## 📁 هيكل المشروع | Project Structure

```
├── src/                          # كود الواجهة الأمامية
│   ├── components/               # مكونات React
│   ├── config/                   # ملفات التكوين
│   │   └── icp-config.js         # تكوين ICP
│   └── ...
├── backend/                      # كود الخادم الخلفي
│   ├── src/                      # كود Rust
│   ├── Cargo.toml                # تبعيات Rust
│   └── idev_shipping_backend.did # ملف Candid
├── grafana/                      # تكوين Grafana
│   ├── dashboards/               # لوحات التحكم
│   └── datasources/              # مصادر البيانات
├── ssl/                          # شهادات SSL
├── dfx.json                      # تكوين DFX
├── canister.json                 # تكوين Canisters
├── deploy-icp.sh                 # سكريبت النشر
├── manage-canister.sh            # سكريبت الإدارة
└── ...
```

## 🔧 التكوين | Configuration

### متغيرات البيئة | Environment Variables

```bash
# في ملف icp.env
ICP_NETWORK=ic
CANISTER_ID=93343-A7BDB-4F45F
VITE_FRONTEND_URL=https://93343-A7BDB-4F45F.ic0.app
VITE_BACKEND_URL=https://93343-A7BDB-4F45F.ic0.app/api
```

### تكوين Vite | Vite Configuration

```javascript
// في vite.config.icp.js
const CANISTER_ID = '93343-A7BDB-4F45F'
const ICP_NETWORK = 'ic'
```

## 🛡️ الأمان | Security

### الحماية | Protection
- ✅ HTTPS Only
- ✅ CORS Configuration
- ✅ JWT Authentication
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ SQL Injection Protection

### المراقبة | Monitoring
- ✅ Health Checks
- ✅ Performance Metrics
- ✅ Error Logging
- ✅ Security Alerts

## 📊 المراقبة | Monitoring

### المقاييس | Metrics
- **Page Load Time**: < 2s
- **API Response Time**: < 500ms
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%

### الأدوات | Tools
- **Prometheus**: جمع المقاييس
- **Grafana**: لوحات التحكم
- **Nginx**: Reverse Proxy
- **SSL**: شهادات الأمان

## 📚 الوثائق | Documentation

- 📖 [دليل النشر الكامل](ICP_DEPLOYMENT_GUIDE.md)
- 🚀 [دليل النشر السريع](ICP_QUICK_START.md)
- 🔧 [دليل Canister](CANISTER_93343-A7BDB-4F45F_README.md)
- 📋 [دليل المشروع الرئيسي](README.md)

## 🤝 المساهمة | Contributing

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص | License

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 الدعم | Support

### التواصل | Contact
- 📧 Email: support@idev-shipping.com
- 🐛 Issues: [GitHub Issues](https://github.com/samar-ux/I-dev/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/samar-ux/I-dev/discussions)

### الموارد | Resources
- 🔗 [ICP Dashboard](https://dashboard.internetcomputer.org/canister/93343-A7BDB-4F45F)
- 🔗 [ICP Documentation](https://internetcomputer.org/docs)
- 🔗 [DFX CLI](https://internetcomputer.org/docs/current/references/cli-reference/)

## 🎯 خطة التطوير | Development Roadmap

- [ ] Multi-language Support
- [ ] Advanced Analytics
- [ ] Mobile App
- [ ] AI Integration
- [ ] Blockchain Upgrades
- [ ] IoT Integration
- [ ] Advanced Security Features

---

**ملاحظة**: هذا المشروع في طور التطوير النشط. للمساهمة أو الإبلاغ عن مشاكل، يرجى استخدام GitHub Issues.

**Note**: This project is under active development. For contributions or bug reports, please use GitHub Issues.

---

<div align="center">

**صُنع بـ ❤️ بواسطة [Samar UX](https://github.com/samar-ux)**

**Made with ❤️ by [Samar UX](https://github.com/samar-ux)**

</div>
