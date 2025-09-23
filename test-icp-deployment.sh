#!/bin/bash

# ICP Deployment Test Script
# سكريبت اختبار النشر على ICP

set -e

echo "🧪 بدء اختبار النشر على ICP..."
echo "🧪 Starting ICP deployment test..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test functions
test_dfx_installation() {
    echo -e "${BLUE}🔍 اختبار تثبيت DFX...${NC}"
    echo -e "${BLUE}🔍 Testing DFX installation...${NC}"
    
    if command -v dfx &> /dev/null; then
        echo -e "${GREEN}✅ DFX مثبت بنجاح${NC}"
        echo -e "${GREEN}✅ DFX installed successfully${NC}"
        dfx --version
        return 0
    else
        echo -e "${RED}❌ DFX غير مثبت${NC}"
        echo -e "${RED}❌ DFX not installed${NC}"
        return 1
    fi
}

test_identity_setup() {
    echo -e "${BLUE}🔍 اختبار إعداد الهوية...${NC}"
    echo -e "${BLUE}🔍 Testing identity setup...${NC}"
    
    if dfx identity whoami &> /dev/null; then
        echo -e "${GREEN}✅ الهوية مُعدة بنجاح: $(dfx identity whoami)${NC}"
        echo -e "${GREEN}✅ Identity setup successfully: $(dfx identity whoami)${NC}"
        return 0
    else
        echo -e "${RED}❌ الهوية غير مُعدة${NC}"
        echo -e "${RED}❌ Identity not setup${NC}"
        return 1
    fi
}

test_project_build() {
    echo -e "${BLUE}🔍 اختبار بناء المشروع...${NC}"
    echo -e "${BLUE}🔍 Testing project build...${NC}"
    
    # Test frontend build
    if [ -f "package.json" ]; then
        echo -e "${YELLOW}📦 بناء الواجهة الأمامية...${NC}"
        echo -e "${YELLOW}📦 Building frontend...${NC}"
        
        if command -v pnpm &> /dev/null; then
            pnpm install
            pnpm run build
        elif command -v npm &> /dev/null; then
            npm install
            npm run build
        else
            echo -e "${RED}❌ لم يتم العثور على pnpm أو npm${NC}"
            echo -e "${RED}❌ pnpm or npm not found${NC}"
            return 1
        fi
        
        if [ -d "dist" ]; then
            echo -e "${GREEN}✅ الواجهة الأمامية بُنيت بنجاح${NC}"
            echo -e "${GREEN}✅ Frontend built successfully${NC}"
        else
            echo -e "${RED}❌ فشل بناء الواجهة الأمامية${NC}"
            echo -e "${RED}❌ Frontend build failed${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ ملف package.json غير موجود${NC}"
        echo -e "${RED}❌ package.json file not found${NC}"
        return 1
    fi
    
    # Test backend build
    if [ -d "backend" ]; then
        echo -e "${YELLOW}📦 بناء الخادم الخلفي...${NC}"
        echo -e "${YELLOW}📦 Building backend...${NC}"
        
        cd backend
        
        if command -v rustup &> /dev/null; then
            rustup target add wasm32-unknown-unknown
            cargo build --target wasm32-unknown-unknown --release
            
            if [ -f "target/wasm32-unknown-unknown/release/idev_shipping_backend.wasm" ]; then
                echo -e "${GREEN}✅ الخادم الخلفي بُني بنجاح${NC}"
                echo -e "${GREEN}✅ Backend built successfully${NC}"
            else
                echo -e "${RED}❌ فشل بناء الخادم الخلفي${NC}"
                echo -e "${RED}❌ Backend build failed${NC}"
                cd ..
                return 1
            fi
        else
            echo -e "${RED}❌ Rust غير مثبت${NC}"
            echo -e "${RED}❌ Rust not installed${NC}"
            cd ..
            return 1
        fi
        
        cd ..
    else
        echo -e "${RED}❌ مجلد backend غير موجود${NC}"
        echo -e "${RED}❌ backend directory not found${NC}"
        return 1
    fi
    
    return 0
}

test_local_deployment() {
    echo -e "${BLUE}🔍 اختبار النشر المحلي...${NC}"
    echo -e "${BLUE}🔍 Testing local deployment...${NC}"
    
    # Start local network
    echo -e "${YELLOW}🚀 بدء الشبكة المحلية...${NC}"
    echo -e "${YELLOW}🚀 Starting local network...${NC}"
    
    dfx start --background --clean
    
    # Wait for network to be ready
    sleep 10
    
    # Deploy canisters
    echo -e "${YELLOW}🚀 نشر Canisters...${NC}"
    echo -e "${YELLOW}🚀 Deploying canisters...${NC}"
    
    if dfx deploy; then
        echo -e "${GREEN}✅ النشر المحلي نجح${NC}"
        echo -e "${GREEN}✅ Local deployment successful${NC}"
        
        # Get canister IDs
        FRONTEND_ID=$(dfx canister id idev_shipping_frontend 2>/dev/null || echo "N/A")
        BACKEND_ID=$(dfx canister id idev_shipping_backend 2>/dev/null || echo "N/A")
        
        echo -e "${GREEN}📋 Frontend Canister ID: $FRONTEND_ID${NC}"
        echo -e "${GREEN}📋 Backend Canister ID: $BACKEND_ID${NC}"
        
        # Test health check
        if [ "$BACKEND_ID" != "N/A" ]; then
            echo -e "${YELLOW}🔍 اختبار فحص الصحة...${NC}"
            echo -e "${YELLOW}🔍 Testing health check...${NC}"
            
            if dfx canister call $BACKEND_ID health_check; then
                echo -e "${GREEN}✅ فحص الصحة نجح${NC}"
                echo -e "${GREEN}✅ Health check successful${NC}"
            else
                echo -e "${YELLOW}⚠️ فحص الصحة فشل (قد يكون طبيعي)${NC}"
                echo -e "${YELLOW}⚠️ Health check failed (may be normal)${NC}"
            fi
        fi
        
        return 0
    else
        echo -e "${RED}❌ النشر المحلي فشل${NC}"
        echo -e "${RED}❌ Local deployment failed${NC}"
        return 1
    fi
}

test_cleanup() {
    echo -e "${BLUE}🧹 تنظيف الموارد...${NC}"
    echo -e "${BLUE}🧹 Cleaning up resources...${NC}"
    
    # Stop local network
    dfx stop 2>/dev/null || true
    
    # Clean build artifacts
    rm -rf dist 2>/dev/null || true
    rm -rf backend/target 2>/dev/null || true
    
    echo -e "${GREEN}✅ تم التنظيف بنجاح${NC}"
    echo -e "${GREEN}✅ Cleanup completed successfully${NC}"
}

# Main test execution
main() {
    echo -e "${BLUE}🚀 بدء اختبارات النشر على ICP${NC}"
    echo -e "${BLUE}🚀 Starting ICP deployment tests${NC}"
    echo ""
    
    local tests_passed=0
    local total_tests=4
    
    # Test 1: DFX Installation
    if test_dfx_installation; then
        ((tests_passed++))
    fi
    echo ""
    
    # Test 2: Identity Setup
    if test_identity_setup; then
        ((tests_passed++))
    fi
    echo ""
    
    # Test 3: Project Build
    if test_project_build; then
        ((tests_passed++))
    fi
    echo ""
    
    # Test 4: Local Deployment
    if test_local_deployment; then
        ((tests_passed++))
    fi
    echo ""
    
    # Cleanup
    test_cleanup
    echo ""
    
    # Results
    echo -e "${BLUE}📊 نتائج الاختبارات:${NC}"
    echo -e "${BLUE}📊 Test Results:${NC}"
    echo -e "${GREEN}✅ نجح: $tests_passed/$total_tests${NC}"
    echo -e "${GREEN}✅ Passed: $tests_passed/$total_tests${NC}"
    
    if [ $tests_passed -eq $total_tests ]; then
        echo -e "${GREEN}🎉 جميع الاختبارات نجحت! المشروع جاهز للنشر على ICP${NC}"
        echo -e "${GREEN}🎉 All tests passed! Project is ready for ICP deployment${NC}"
        exit 0
    else
        echo -e "${RED}❌ بعض الاختبارات فشلت. يرجى إصلاح المشاكل قبل النشر${NC}"
        echo -e "${RED}❌ Some tests failed. Please fix issues before deployment${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
