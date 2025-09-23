# دليل النشر السريع على ICP
# ICP Quick Start Guide

## النشر السريع | Quick Deployment

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

## الأوامر المفيدة | Useful Commands

```bash
# عرض حالة Canisters
dfx canister --network ic list

# عرض سجلات Canister
dfx canister --network ic logs <CANISTER_ID>

# تحديث Canister
dfx deploy --network ic --upgrade-unchanged
```

## استكشاف الأخطاء | Troubleshooting

- **خطأ في Cycles**: تأكد من وجود رصيد كافي
- **خطأ في البناء**: تحقق من تثبيت Rust و wasm32 target
- **خطأ في الشبكة**: جرب الشبكة المحلية أولاً

## الدعم | Support

- 📖 [الدليل الكامل](ICP_DEPLOYMENT_GUIDE.md)
- 🐛 [الإبلاغ عن مشاكل](https://github.com/samar-ux/I-dev/issues)
- 📧 support@idev-shipping.com
