#!/bin/bash

# ICP Deployment Script
# سكريبت النشر على ICP

set -e

echo "🚀 بدء نشر مشروع I-dev Shipping Platform على ICP..."
echo "🚀 Starting deployment of I-dev Shipping Platform to ICP..."

# Load environment variables
if [ -f "icp.env" ]; then
    source icp.env
    echo "✅ تم تحميل متغيرات البيئة"
    echo "✅ Environment variables loaded"
else
    echo "❌ ملف icp.env غير موجود"
    echo "❌ icp.env file not found"
    exit 1
fi

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx غير مثبت. يرجى تثبيته أولاً"
    echo "❌ dfx is not installed. Please install it first"
    echo "curl -fsSL https://internetcomputer.org/install.sh | sh"
    exit 1
fi

# Check if user is authenticated
if ! dfx identity whoami &> /dev/null; then
    echo "❌ لم يتم تسجيل الدخول إلى ICP. يرجى تسجيل الدخول أولاً"
    echo "❌ Not logged in to ICP. Please login first"
    echo "dfx identity new default"
    echo "dfx identity use default"
    exit 1
fi

echo "👤 المستخدم الحالي: $(dfx identity whoami)"
echo "👤 Current user: $(dfx identity whoami)"

# Set network
if [ "$ICP_NETWORK" = "ic" ]; then
    echo "🌐 استخدام شبكة ICP الرئيسية"
    echo "🌐 Using mainnet ICP network"
    dfx config set networks.ic.providers '["https://ic0.app"]'
else
    echo "🌐 استخدام الشبكة المحلية"
    echo "🌐 Using local network"
    dfx config set networks.local.bind "$ICP_LOCAL_BIND"
fi

# Build frontend
echo "🔨 بناء الواجهة الأمامية..."
echo "🔨 Building frontend..."
npm install -g pnpm
pnpm install
pnpm run build

# Build backend
echo "🔨 بناء الخادم الخلفي..."
echo "🔨 Building backend..."
cd backend
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
cd ..

# Deploy to ICP
echo "🚀 نشر المشروع على ICP..."
echo "🚀 Deploying project to ICP..."

if [ "$ICP_NETWORK" = "ic" ]; then
    # Deploy to mainnet
    dfx deploy --network ic --with-cycles $ICP_CYCLES_AMOUNT
    
    # Get canister IDs
    FRONTEND_CANISTER_ID=$(dfx canister id idev_shipping_frontend --network ic)
    BACKEND_CANISTER_ID=$(dfx canister id idev_shipping_backend --network ic)
    
    echo "✅ تم النشر بنجاح على ICP الرئيسية!"
    echo "✅ Successfully deployed to ICP mainnet!"
    echo "🌐 Frontend URL: https://$FRONTEND_CANISTER_ID.ic0.app"
    echo "🌐 Backend Canister ID: $BACKEND_CANISTER_ID"
    
    # Update environment variables
    echo "VITE_FRONTEND_CANISTER_ID=$FRONTEND_CANISTER_ID" >> icp.env
    echo "VITE_BACKEND_CANISTER_ID=$BACKEND_CANISTER_ID" >> icp.env
    
else
    # Deploy to local network
    dfx start --background
    dfx deploy
    
    # Get canister IDs
    FRONTEND_CANISTER_ID=$(dfx canister id idev_shipping_frontend)
    BACKEND_CANISTER_ID=$(dfx canister id idev_shipping_backend)
    
    echo "✅ تم النشر بنجاح على الشبكة المحلية!"
    echo "✅ Successfully deployed to local network!"
    echo "🌐 Frontend URL: http://$FRONTEND_CANISTER_ID.localhost:4943"
    echo "🌐 Backend Canister ID: $BACKEND_CANISTER_ID"
fi

# Health check
echo "🔍 فحص صحة النظام..."
echo "🔍 Health check..."
sleep 10

if [ "$ICP_NETWORK" = "ic" ]; then
    HEALTH_URL="https://$FRONTEND_CANISTER_ID.ic0.app/health"
else
    HEALTH_URL="http://$FRONTEND_CANISTER_ID.localhost:4943/health"
fi

if curl -f "$HEALTH_URL" &> /dev/null; then
    echo "✅ النظام يعمل بشكل صحيح!"
    echo "✅ System is healthy!"
else
    echo "⚠️ تحذير: فحص الصحة فشل"
    echo "⚠️ Warning: Health check failed"
fi

echo ""
echo "🎉 تم إكمال النشر بنجاح!"
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 معلومات النشر:"
echo "📋 Deployment Information:"
echo "   Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo "   Backend Canister ID: $BACKEND_CANISTER_ID"
echo "   Network: $ICP_NETWORK"
echo ""
echo "🔗 روابط مفيدة:"
echo "🔗 Useful Links:"
if [ "$ICP_NETWORK" = "ic" ]; then
    echo "   Frontend: https://$FRONTEND_CANISTER_ID.ic0.app"
    echo "   ICP Dashboard: https://dashboard.internetcomputer.org/canister/$FRONTEND_CANISTER_ID"
else
    echo "   Frontend: http://$FRONTEND_CANISTER_ID.localhost:4943"
    echo "   Local Dashboard: http://localhost:4943"
fi
echo ""
echo "📚 أوامر مفيدة:"
echo "📚 Useful Commands:"
echo "   dfx canister status $FRONTEND_CANISTER_ID --network $ICP_NETWORK"
echo "   dfx canister status $BACKEND_CANISTER_ID --network $ICP_NETWORK"
echo "   dfx canister call $BACKEND_CANISTER_ID health_check --network $ICP_NETWORK"
