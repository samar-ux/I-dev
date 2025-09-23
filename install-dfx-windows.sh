#!/bin/bash

# DFX Installation Script for Windows
# سكريبت تثبيت DFX لـ Windows

echo "🚀 بدء تثبيت DFX على Windows..."
echo "🚀 Starting DFX installation on Windows..."

# Check if we're on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    echo "✅ تم اكتشاف نظام Windows"
    echo "✅ Windows system detected"
else
    echo "❌ هذا السكريبت مخصص لـ Windows فقط"
    echo "❌ This script is for Windows only"
    exit 1
fi

# Create dfx directory
DFX_DIR="$HOME/.local/bin"
mkdir -p "$DFX_DIR"

# Download DFX binary
echo "📥 تحميل DFX..."
echo "📥 Downloading DFX..."

# Try different download methods
if command -v curl &> /dev/null; then
    curl -L -o "$DFX_DIR/dfx.exe" "https://github.com/dfinity/sdk/releases/download/0.15.0/dfx-0.15.0-x86_64-pc-windows-msvc.exe"
elif command -v wget &> /dev/null; then
    wget -O "$DFX_DIR/dfx.exe" "https://github.com/dfinity/sdk/releases/download/0.15.0/dfx-0.15.0-x86_64-pc-windows-msvc.exe"
else
    echo "❌ لم يتم العثور على curl أو wget"
    echo "❌ curl or wget not found"
    exit 1
fi

# Make executable
chmod +x "$DFX_DIR/dfx.exe"

# Add to PATH
echo "🔧 إضافة DFX إلى PATH..."
echo "🔧 Adding DFX to PATH..."

# Add to .bashrc
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

# Add to .profile
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.profile

# Export for current session
export PATH="$HOME/.local/bin:$PATH"

# Verify installation
echo "🔍 التحقق من التثبيت..."
echo "🔍 Verifying installation..."

if "$DFX_DIR/dfx.exe" --version; then
    echo "✅ تم تثبيت DFX بنجاح!"
    echo "✅ DFX installed successfully!"
    echo ""
    echo "📋 الخطوات التالية:"
    echo "📋 Next steps:"
    echo "1. أعد تشغيل Terminal أو استخدم: source ~/.bashrc"
    echo "1. Restart Terminal or use: source ~/.bashrc"
    echo "2. تحقق من التثبيت: dfx --version"
    echo "2. Verify installation: dfx --version"
    echo "3. إنشاء هوية جديدة: dfx identity new mainnet-identity"
    echo "3. Create new identity: dfx identity new mainnet-identity"
else
    echo "❌ فشل تثبيت DFX"
    echo "❌ DFX installation failed"
    exit 1
fi
