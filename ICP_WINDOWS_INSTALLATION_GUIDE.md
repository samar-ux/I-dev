# 🚀 دليل التثبيت السريع لـ ICP - Windows
# 🚀 Quick ICP Installation Guide - Windows

## نظرة عامة | Overview

هذا الدليل يوضح كيفية تثبيت DFX وإعداد الهوية والمحفظة للنشر على Internet Computer Protocol (ICP) على Windows.

This guide explains how to install DFX and setup identity and wallet for deploying on Internet Computer Protocol (ICP) on Windows.

## ⚡ التثبيت السريع | Quick Installation

### الطريقة الأولى: استخدام سكريبت التثبيت التلقائي
### Method 1: Using Automatic Installation Script

```bash
# تشغيل سكريبت الإعداد الشامل
# Run comprehensive setup script
npm run setup:icp

# أو مباشرة
# Or directly
./setup-icp-windows.sh
```

### الطريقة الثانية: التثبيت اليدوي
### Method 2: Manual Installation

#### 1. تثبيت DFX
#### 1. Install DFX

```bash
# تشغيل سكريبت تثبيت DFX
# Run DFX installation script
npm run install:dfx

# أو مباشرة
# Or directly
./install-dfx-windows.sh
```

#### 2. إعادة تشغيل Terminal
#### 2. Restart Terminal

```bash
# إعادة تحميل إعدادات Terminal
# Reload Terminal settings
source ~/.bashrc

# أو أعد تشغيل Terminal بالكامل
# Or restart Terminal completely
```

#### 3. التحقق من التثبيت
#### 3. Verify Installation

```bash
# التحقق من إصدار DFX
# Check DFX version
dfx --version

# يجب أن تظهر رسالة مثل: dfx 0.15.0
# Should show message like: dfx 0.15.0
```

## 🔐 إعداد الهوية | Identity Setup

```bash
# إنشاء هوية جديدة
# Create new identity
dfx identity new mainnet-identity

# استخدام الهوية الجديدة
# Use new identity
dfx identity use mainnet-identity

# عرض الهوية الحالية
# Show current identity
dfx identity whoami
```

## 💰 إعداد المحفظة | Wallet Setup

```bash
# إنشاء محفظة جديدة
# Create new wallet
dfx wallet create

# عرض عنوان المحفظة
# Show wallet address
dfx wallet address

# عرض رصيد المحفظة
# Show wallet balance
dfx wallet balance
```

## 🧪 اختبار النشر | Test Deployment

```bash
# اختبار النشر المحلي
# Test local deployment
npm run test:icp

# النشر على الشبكة المحلية
# Deploy to local network
npm run deploy:icp:local
```

## 🌐 النشر على الشبكة الرئيسية | Deploy to Mainnet

### 1. إضافة Cycles للمحفظة
### 1. Add Cycles to Wallet

```bash
# عرض عنوان المحفظة
# Show wallet address
dfx wallet address

# إرسال ICP إلى محفظة Cycles
# Send ICP to Cycles wallet
dfx wallet send-cycles --amount 1000000000000 <wallet-address>
```

### 2. النشر على الشبكة الرئيسية
### 2. Deploy to Mainnet

```bash
# النشر على الشبكة الرئيسية
# Deploy to mainnet
npm run deploy:icp:mainnet
```

## 🔧 الأوامر المتاحة | Available Commands

### إعداد ICP
### ICP Setup
```bash
npm run setup:icp          # إعداد شامل لـ ICP
npm run install:dfx        # تثبيت DFX فقط
```

### النشر
### Deployment
```bash
npm run deploy:icp         # النشر العام
npm run deploy:icp:local    # النشر المحلي
npm run deploy:icp:mainnet # النشر على الشبكة الرئيسية
npm run test:icp           # اختبار النشر
```

### إدارة Canister
### Canister Management
```bash
npm run canister:status    # فحص الحالة
npm run canister:info      # عرض المعلومات
npm run canister:test      # اختبار Canister
npm run canister:update    # تحديث Canister
npm run canister:logs      # عرض السجلات
```

## 🛠️ استكشاف الأخطاء | Troubleshooting

### مشكلة: DFX غير موجود
### Issue: DFX not found

```bash
# التحقق من PATH
# Check PATH
echo $PATH

# إضافة DFX إلى PATH يدوياً
# Add DFX to PATH manually
export PATH="$HOME/.local/bin:$PATH"
```

### مشكلة: خطأ في الشبكة
### Issue: Network error

```bash
# استخدام شبكة محلية للاختبار
# Use local network for testing
dfx start --background
dfx deploy
```

### مشكلة: خطأ في الهوية
### Issue: Identity error

```bash
# إعادة إنشاء الهوية
# Recreate identity
dfx identity new test-identity
dfx identity use test-identity
```

## 📋 قائمة التحقق | Checklist

- [ ] ✅ تثبيت DFX
- [ ] ✅ إعداد الهوية
- [ ] ✅ إعداد المحفظة
- [ ] ✅ اختبار النشر المحلي
- [ ] ✅ إضافة Cycles للمحفظة
- [ ] ✅ النشر على الشبكة الرئيسية

## 🔗 روابط مفيدة | Useful Links

- [وثائق DFX الرسمية](https://internetcomputer.org/docs/current/references/cli-reference/)
- [دليل النشر على ICP](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally/)
- [مجتمع ICP](https://forum.dfinity.org/)
- [ICP Dashboard](https://dashboard.internetcomputer.org/)

## 📞 الدعم | Support

- 📧 Email: support@idev-shipping.com
- 🐛 Issues: [GitHub Issues](https://github.com/samar-ux/I-dev/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/samar-ux/I-dev/discussions)

---

**ملاحظة**: تأكد من إعادة تشغيل Terminal بعد تثبيت DFX لضمان تحديث PATH.

**Note**: Make sure to restart Terminal after installing DFX to ensure PATH is updated.

---

<div align="center">

**صُنع بـ ❤️ بواسطة [Samar UX](https://github.com/samar-ux)**

**Made with ❤️ by [Samar UX](https://github.com/samar-ux)**

</div>
