# دليل النشر على ICP - I-dev Shipping Platform
# ICP Deployment Guide - I-dev Shipping Platform

## نظرة عامة | Overview

هذا الدليل يوضح كيفية نشر مشروع I-dev Shipping Platform على شبكة Internet Computer Protocol (ICP).

This guide explains how to deploy the I-dev Shipping Platform project on the Internet Computer Protocol (ICP) network.

## المتطلبات | Prerequisites

### 1. تثبيت DFX
### 1. Install DFX

```bash
# تثبيت DFX
# Install DFX
curl -fsSL https://internetcomputer.org/install.sh | sh

# إضافة DFX إلى PATH
# Add DFX to PATH
export PATH="$HOME/.local/bin:$PATH"

# التحقق من التثبيت
# Verify installation
dfx --version
```

### 2. إعداد الهوية
### 2. Setup Identity

```bash
# إنشاء هوية جديدة
# Create new identity
dfx identity new default

# استخدام الهوية الافتراضية
# Use default identity
dfx identity use default

# عرض معلومات الهوية
# Show identity information
dfx identity whoami
```

### 3. الحصول على Cycles
### 3. Get Cycles

```bash
# إنشاء محفظة Cycles
# Create Cycles wallet
dfx wallet --network ic create

# عرض رصيد المحفظة
# Show wallet balance
dfx wallet --network ic balance
```

## خطوات النشر | Deployment Steps

### 1. إعداد البيئة
### 1. Environment Setup

```bash
# نسخ ملف البيئة
# Copy environment file
cp icp.env .env

# تحرير المتغيرات المطلوبة
# Edit required variables
nano .env
```

### 2. بناء المشروع
### 2. Build Project

```bash
# تثبيت التبعيات
# Install dependencies
npm install -g pnpm
pnpm install

# بناء الواجهة الأمامية
# Build frontend
pnpm run build

# بناء الخادم الخلفي
# Build backend
cd backend
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
cd ..
```

### 3. النشر على الشبكة المحلية (للاختبار)
### 3. Deploy to Local Network (for testing)

```bash
# بدء الشبكة المحلية
# Start local network
dfx start --background

# نشر المشروع
# Deploy project
dfx deploy

# فحص الحالة
# Check status
dfx canister status idev_shipping_frontend
dfx canister status idev_shipping_backend
```

### 4. النشر على الشبكة الرئيسية
### 4. Deploy to Mainnet

```bash
# استخدام سكريبت النشر
# Use deployment script
./deploy-icp.sh

# أو النشر اليدوي
# Or manual deployment
dfx deploy --network ic --with-cycles 1000000000000
```

## إدارة المشروع | Project Management

### عرض معلومات Canisters
### View Canister Information

```bash
# عرض جميع Canisters
# List all canisters
dfx canister --network ic list

# عرض تفاصيل Canister
# Show canister details
dfx canister --network ic status <CANISTER_ID>

# عرض الكود المصدري
# Show source code
dfx canister --network ic call <CANISTER_ID> --query
```

### تحديث المشروع
### Update Project

```bash
# إعادة بناء المشروع
# Rebuild project
pnpm run build
cd backend && cargo build --target wasm32-unknown-unknown --release && cd ..

# تحديث Canisters
# Update canisters
dfx deploy --network ic --upgrade-unchanged
```

### حذف المشروع
### Delete Project

```bash
# حذف Canisters
# Delete canisters
dfx canister --network ic delete <CANISTER_ID>

# أو حذف جميع Canisters
# Or delete all canisters
dfx canister --network ic delete --all
```

## استكشاف الأخطاء | Troubleshooting

### مشاكل شائعة
### Common Issues

1. **خطأ في Cycles**
   - تأكد من وجود رصيد كافي في المحفظة
   - استخدم `dfx wallet --network ic balance` للتحقق

2. **خطأ في البناء**
   - تأكد من تثبيت Rust و wasm32 target
   - تحقق من ملفات Cargo.toml

3. **خطأ في الشبكة**
   - تأكد من الاتصال بالإنترنت
   - جرب استخدام شبكة محلية للاختبار

### سجلات النظام
### System Logs

```bash
# عرض سجلات Canister
# View canister logs
dfx canister --network ic logs <CANISTER_ID>

# عرض سجلات النظام
# View system logs
dfx start --clean --background
```

## الأمان | Security

### أفضل الممارسات
### Best Practices

1. **حماية المفاتيح الخاصة**
   - لا تشارك مفاتيح الهوية
   - استخدم محافظ الأجهزة عند الإمكان

2. **مراجعة الكود**
   - راجع جميع التغييرات قبل النشر
   - استخدم اختبارات شاملة

3. **مراقبة النظام**
   - راقب استخدام Cycles
   - تتبع سجلات النظام بانتظام

## الدعم | Support

### موارد مفيدة
### Useful Resources

- [وثائق ICP الرسمية](https://internetcomputer.org/docs)
- [مستودع GitHub للمشروع](https://github.com/samar-ux/I-dev)
- [مجتمع ICP](https://forum.dfinity.org/)

### الاتصال
### Contact

- البريد الإلكتروني: support@idev-shipping.com
- GitHub Issues: [إنشاء مشكلة جديدة](https://github.com/samar-ux/I-dev/issues)

---

**ملاحظة**: تأكد من قراءة جميع الوثائق الرسمية لـ ICP قبل النشر على الشبكة الرئيسية.

**Note**: Make sure to read all official ICP documentation before deploying to mainnet.
