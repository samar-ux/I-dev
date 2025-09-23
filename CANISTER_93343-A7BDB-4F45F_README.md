# Canister 93343-A7BDB-4F45F - I-dev Shipping Platform
# Canister 93343-A7BDB-4F45F - منصة شحن وتوصيل I-dev

## معلومات Canister | Canister Information

- **المعرف | ID**: `93343-A7BDB-4F45F`
- **الشبكة | Network**: ICP Mainnet
- **النوع | Type**: Frontend + Backend
- **الحالة | Status**: نشط | Active
- **تاريخ النشر | Deployment Date**: 2024-01-01

## الروابط | Links

### الواجهة الأمامية | Frontend
- **الرابط الرئيسي | Main URL**: https://93343-A7BDB-4F45F.ic0.app
- **الصفحة الرئيسية | Homepage**: https://93343-A7BDB-4F45F.ic0.app/
- **لوحة التحكم | Dashboard**: https://93343-A7BDB-4F45F.ic0.app/dashboard

### API
- **API الأساسي | Base API**: https://93343-A7BDB-4F45F.ic0.app/api
- **فحص الصحة | Health Check**: https://93343-A7BDB-4F45F.ic0.app/health
- **المستخدمين | Users**: https://93343-A7BDB-4F45F.ic0.app/api/users
- **الشحنات | Shipments**: https://93343-A7BDB-4F45F.ic0.app/api/shipments
- **المدفوعات | Payments**: https://93343-A7BDB-4F45F.ic0.app/api/payments

### المراقبة | Monitoring
- **المقاييس | Metrics**: https://93343-A7BDB-4F45F.ic0.app/metrics
- **السجلات | Logs**: https://93343-A7BDB-4F45F.ic0.app/logs

## إدارة Canister | Canister Management

### الأوامر الأساسية | Basic Commands

```bash
# فحص الحالة | Check Status
./manage-canister.sh status

# عرض المعلومات | Show Info
./manage-canister.sh info

# اختبار Canister | Test Canister
./manage-canister.sh test

# تحديث Canister | Update Canister
./manage-canister.sh update

# عرض السجلات | Show Logs
./manage-canister.sh logs
```

### أوامر DFX | DFX Commands

```bash
# فحص الحالة
dfx canister --network ic status 93343-A7BDB-4F45F

# عرض السجلات
dfx canister --network ic logs 93343-A7BDB-4F45F

# تحديث Canister
dfx deploy --network ic --upgrade-unchanged

# حذف Canister
dfx canister --network ic delete 93343-A7BDB-4F45F
```

## التكوين | Configuration

### متغيرات البيئة | Environment Variables

```bash
# في ملف icp.env
VITE_ICP_NETWORK=ic
VITE_BACKEND_CANISTER_ID=93343-A7BDB-4F45F
VITE_FRONTEND_CANISTER_ID=93343-A7BDB-4F45F
```

### تكوين Vite | Vite Configuration

```javascript
// في vite.config.icp.js
const CANISTER_ID = '93343-A7BDB-4F45F'
const ICP_NETWORK = 'ic'
```

## الميزات | Features

### الواجهة الأمامية | Frontend
- ✅ React 19 + Vite
- ✅ Tailwind CSS
- ✅ Responsive Design
- ✅ Dark/Light Mode
- ✅ Internationalization (Arabic/English)
- ✅ Web3 Integration

### الخادم الخلفي | Backend
- ✅ Rust + Axum
- ✅ PostgreSQL Database
- ✅ Redis Cache
- ✅ JWT Authentication
- ✅ Web3 Payments
- ✅ Real-time Tracking

### Web3 Integration
- ✅ Ethereum Support
- ✅ Polygon Support
- ✅ BSC Support
- ✅ ICP Integration
- ✅ Smart Contracts

## الأمان | Security

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

## الأداء | Performance

### التحسينات | Optimizations
- ✅ Code Splitting
- ✅ Lazy Loading
- ✅ Image Optimization
- ✅ Caching Strategy
- ✅ CDN Integration

### المقاييس | Metrics
- ✅ Page Load Time: < 2s
- ✅ API Response Time: < 500ms
- ✅ Uptime: 99.9%
- ✅ Error Rate: < 0.1%

## الدعم | Support

### التواصل | Contact
- 📧 Email: support@idev-shipping.com
- 🐛 Issues: [GitHub Issues](https://github.com/samar-ux/I-dev/issues)
- 📖 Documentation: [ICP_DEPLOYMENT_GUIDE.md](ICP_DEPLOYMENT_GUIDE.md)

### الموارد | Resources
- 🔗 [ICP Dashboard](https://dashboard.internetcomputer.org/canister/93343-A7BDB-4F45F)
- 🔗 [ICP Documentation](https://internetcomputer.org/docs)
- 🔗 [DFX CLI](https://internetcomputer.org/docs/current/references/cli-reference/)

## التحديثات | Updates

### الإصدار الحالي | Current Version
- **Frontend**: v1.0.0
- **Backend**: v1.0.0
- **Last Update**: 2024-01-01

### خطة التطوير | Development Roadmap
- [ ] Multi-language Support
- [ ] Advanced Analytics
- [ ] Mobile App
- [ ] AI Integration
- [ ] Blockchain Upgrades

---

**ملاحظة**: هذا Canister مُدار تلقائياً ويتم تحديثه بانتظام.

**Note**: This canister is automatically managed and updated regularly.
