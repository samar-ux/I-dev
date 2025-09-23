#!/bin/bash

# ICP Setup Script for Windows
# سكريبت إعداد ICP لـ Windows

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 إعداد ICP للنشر على Windows${NC}"
echo -e "${BLUE}🚀 Setting up ICP for deployment on Windows${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install DFX
install_dfx() {
    echo -e "${YELLOW}📥 تثبيت DFX...${NC}"
    echo -e "${YELLOW}📥 Installing DFX...${NC}"
    
    # Create dfx directory
    DFX_DIR="$HOME/.local/bin"
    mkdir -p "$DFX_DIR"
    
    # Try to download DFX
    if command_exists curl; then
        echo -e "${BLUE}استخدام curl للتحميل...${NC}"
        curl -L -o "$DFX_DIR/dfx.exe" "https://github.com/dfinity/sdk/releases/download/0.15.0/dfx-0.15.0-x86_64-pc-windows-msvc.exe" || {
            echo -e "${RED}❌ فشل تحميل DFX باستخدام curl${NC}"
            return 1
        }
    elif command_exists wget; then
        echo -e "${BLUE}استخدام wget للتحميل...${NC}"
        wget -O "$DFX_DIR/dfx.exe" "https://github.com/dfinity/sdk/releases/download/0.15.0/dfx-0.15.0-x86_64-pc-windows-msvc.exe" || {
            echo -e "${RED}❌ فشل تحميل DFX باستخدام wget${NC}"
            return 1
        }
    else
        echo -e "${RED}❌ لم يتم العثور على curl أو wget${NC}"
        echo -e "${RED}❌ curl or wget not found${NC}"
        return 1
    fi
    
    # Make executable
    chmod +x "$DFX_DIR/dfx.exe"
    
    # Add to PATH
    echo -e "${BLUE}🔧 إضافة DFX إلى PATH...${NC}"
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.profile
    
    # Export for current session
    export PATH="$HOME/.local/bin:$PATH"
    
    echo -e "${GREEN}✅ تم تثبيت DFX بنجاح!${NC}"
    echo -e "${GREEN}✅ DFX installed successfully!${NC}"
}

# Function to setup identity
setup_identity() {
    echo -e "${YELLOW}🔐 إعداد الهوية...${NC}"
    echo -e "${YELLOW}🔐 Setting up identity...${NC}"
    
    # Check if DFX is available
    if ! command_exists dfx; then
        echo -e "${RED}❌ DFX غير مثبت. يرجى تثبيته أولاً${NC}"
        echo -e "${RED}❌ DFX not installed. Please install it first${NC}"
        return 1
    fi
    
    # Create identity
    echo -e "${BLUE}إنشاء هوية جديدة...${NC}"
    dfx identity new mainnet-identity --storage-mode=plaintext || {
        echo -e "${YELLOW}⚠️ الهوية موجودة بالفعل${NC}"
        echo -e "${YELLOW}⚠️ Identity already exists${NC}"
    }
    
    # Use identity
    echo -e "${BLUE}استخدام الهوية الجديدة...${NC}"
    dfx identity use mainnet-identity
    
    # Show identity
    echo -e "${GREEN}✅ الهوية الحالية: $(dfx identity whoami)${NC}"
    echo -e "${GREEN}✅ Current identity: $(dfx identity whoami)${NC}"
}

# Function to setup wallet
setup_wallet() {
    echo -e "${YELLOW}💰 إعداد المحفظة...${NC}"
    echo -e "${YELLOW}💰 Setting up wallet...${NC}"
    
    # Create wallet
    echo -e "${BLUE}إنشاء محفظة جديدة...${NC}"
    dfx wallet create || {
        echo -e "${YELLOW}⚠️ المحفظة موجودة بالفعل${NC}"
        echo -e "${YELLOW}⚠️ Wallet already exists${NC}"
    }
    
    # Show wallet address
    WALLET_ADDRESS=$(dfx wallet address)
    echo -e "${GREEN}✅ عنوان المحفظة: $WALLET_ADDRESS${NC}"
    echo -e "${GREEN}✅ Wallet address: $WALLET_ADDRESS${NC}"
    
    # Show balance
    echo -e "${BLUE}عرض رصيد المحفظة...${NC}"
    dfx wallet balance || {
        echo -e "${YELLOW}⚠️ لا يمكن عرض الرصيد (قد تكون المحفظة فارغة)${NC}"
        echo -e "${YELLOW}⚠️ Cannot show balance (wallet might be empty)${NC}"
    }
}

# Function to test deployment
test_deployment() {
    echo -e "${YELLOW}🧪 اختبار النشر...${NC}"
    echo -e "${YELLOW}🧪 Testing deployment...${NC}"
    
    # Check if project files exist
    if [ ! -f "dfx.json" ]; then
        echo -e "${RED}❌ ملف dfx.json غير موجود${NC}"
        echo -e "${RED}❌ dfx.json file not found${NC}"
        return 1
    fi
    
    # Test local deployment
    echo -e "${BLUE}اختبار النشر المحلي...${NC}"
    dfx start --background --clean || {
        echo -e "${YELLOW}⚠️ فشل بدء الشبكة المحلية${NC}"
        echo -e "${YELLOW}⚠️ Failed to start local network${NC}"
        return 1
    }
    
    # Wait for network to be ready
    sleep 10
    
    # Deploy canisters
    echo -e "${BLUE}نشر Canisters...${NC}"
    dfx deploy || {
        echo -e "${RED}❌ فشل نشر Canisters${NC}"
        echo -e "${RED}❌ Failed to deploy canisters${NC}"
        return 1
    }
    
    echo -e "${GREEN}✅ تم اختبار النشر بنجاح!${NC}"
    echo -e "${GREEN}✅ Deployment test successful!${NC}"
}

# Function to show next steps
show_next_steps() {
    echo ""
    echo -e "${BLUE}📋 الخطوات التالية:${NC}"
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo ""
    echo -e "${GREEN}1. إعادة تشغيل Terminal أو استخدم:${NC}"
    echo -e "${GREEN}1. Restart Terminal or use:${NC}"
    echo "   source ~/.bashrc"
    echo ""
    echo -e "${GREEN}2. التحقق من التثبيت:${NC}"
    echo -e "${GREEN}2. Verify installation:${NC}"
    echo "   dfx --version"
    echo ""
    echo -e "${GREEN}3. اختبار النشر:${NC}"
    echo -e "${GREEN}3. Test deployment:${NC}"
    echo "   npm run test:icp"
    echo ""
    echo -e "${GREEN}4. النشر على الشبكة الرئيسية:${NC}"
    echo -e "${GREEN}4. Deploy to mainnet:${NC}"
    echo "   npm run deploy:icp:mainnet"
    echo ""
    echo -e "${GREEN}5. إضافة Cycles للمحفظة:${NC}"
    echo -e "${GREEN}5. Add Cycles to wallet:${NC}"
    echo "   - اشتر ICP من منصة تداول"
    echo "   - Buy ICP from exchange"
    echo "   - أرسل ICP إلى محفظة Cycles"
    echo "   - Send ICP to Cycles wallet"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 بدء إعداد ICP${NC}"
    echo -e "${BLUE}🚀 Starting ICP setup${NC}"
    echo ""
    
    # Step 1: Install DFX
    if ! command_exists dfx; then
        install_dfx
    else
        echo -e "${GREEN}✅ DFX مثبت بالفعل${NC}"
        echo -e "${GREEN}✅ DFX already installed${NC}"
    fi
    
    # Step 2: Setup identity
    setup_identity
    
    # Step 3: Setup wallet
    setup_wallet
    
    # Step 4: Test deployment
    test_deployment
    
    # Step 5: Show next steps
    show_next_steps
    
    echo ""
    echo -e "${GREEN}🎉 تم إكمال إعداد ICP بنجاح!${NC}"
    echo -e "${GREEN}🎉 ICP setup completed successfully!${NC}"
}

# Run main function
main "$@"
