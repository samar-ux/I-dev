# دليل تثبيت DFX يدوي لـ Windows
# Manual DFX Installation Guide for Windows

## الطريقة الأولى: استخدام Chocolatey
### Method 1: Using Chocolatey

```powershell
# تثبيت Chocolatey (إذا لم يكن مثبتاً)
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# تثبيت DFX
# Install DFX
choco install dfx
```

## الطريقة الثانية: التحميل المباشر
### Method 2: Direct Download

1. **تحميل DFX**:
   - اذهب إلى: https://github.com/dfinity/sdk/releases
   - حمل أحدث إصدار من `dfx-*-x86_64-pc-windows-msvc.exe`
   - احفظ الملف في مجلد مثل `C:\dfx\`

2. **إضافة إلى PATH**:
   ```powershell
   # إضافة مجلد DFX إلى PATH
   # Add DFX folder to PATH
   $env:PATH += ";C:\dfx"
   
   # إضافة دائم إلى PATH
   # Add permanently to PATH
   [Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\dfx", [EnvironmentVariableTarget]::User)
   ```

## الطريقة الثالثة: استخدام Git Bash
### Method 3: Using Git Bash

```bash
# إنشاء مجلد DFX
# Create DFX directory
mkdir -p ~/.local/bin

# تحميل DFX
# Download DFX
curl -L -o ~/.local/bin/dfx.exe "https://github.com/dfinity/sdk/releases/download/0.15.0/dfx-0.15.0-x86_64-pc-windows-msvc.exe"

# إضافة إلى PATH
# Add to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## التحقق من التثبيت
### Verify Installation

```bash
# التحقق من إصدار DFX
# Check DFX version
dfx --version

# يجب أن تظهر رسالة مثل:
# Should show message like:
# dfx 0.15.0
```

## إعداد الهوية
### Setup Identity

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

## إعداد المحفظة
### Setup Wallet

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

## إضافة Cycles
### Add Cycles

1. **شراء ICP**:
   - اذهب إلى منصة تداول مثل Binance أو Coinbase
   - اشتر رموز ICP

2. **تحويل إلى Cycles**:
   ```bash
   # إرسال ICP إلى محفظة Cycles
   # Send ICP to Cycles wallet
   dfx wallet send-cycles --amount 1000000000000 <wallet-address>
   ```

## اختبار النشر
### Test Deployment

```bash
# اختبار النشر المحلي
# Test local deployment
npm run test:icp

# النشر على الشبكة المحلية
# Deploy to local network
npm run deploy:icp:local

# النشر على الشبكة الرئيسية
# Deploy to mainnet
npm run deploy:icp:mainnet
```

## استكشاف الأخطاء
### Troubleshooting

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

## روابط مفيدة
### Useful Links

- [وثائق DFX الرسمية](https://internetcomputer.org/docs/current/references/cli-reference/)
- [دليل النشر على ICP](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally/)
- [مجتمع ICP](https://forum.dfinity.org/)

---

**ملاحظة**: تأكد من إعادة تشغيل Terminal بعد تثبيت DFX لضمان تحديث PATH.

**Note**: Make sure to restart Terminal after installing DFX to ensure PATH is updated.
