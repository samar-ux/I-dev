#!/bin/bash

# Canister Management Script for 93343-A7BDB-4F45F
# سكريبت إدارة Canister للمعرف 93343-A7BDB-4F45F

set -e

CANISTER_ID="93343-A7BDB-4F45F"
NETWORK="ic"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 إدارة Canister: $CANISTER_ID${NC}"
echo -e "${BLUE}🔧 Managing Canister: $CANISTER_ID${NC}"
echo ""

# Function to check canister status
check_status() {
    echo -e "${BLUE}🔍 فحص حالة Canister...${NC}"
    echo -e "${BLUE}🔍 Checking canister status...${NC}"
    
    if command -v dfx &> /dev/null; then
        dfx canister --network $NETWORK status $CANISTER_ID
    else
        echo -e "${YELLOW}⚠️ DFX غير مثبت. استخدام API مباشرة...${NC}"
        echo -e "${YELLOW}⚠️ DFX not installed. Using direct API...${NC}"
        
        # Use direct API call
        curl -s "https://ic0.app/api/v2/canister/$CANISTER_ID/status" | jq .
    fi
}

# Function to get canister info
get_info() {
    echo -e "${BLUE}📋 معلومات Canister:${NC}"
    echo -e "${BLUE}📋 Canister Information:${NC}"
    echo "   ID: $CANISTER_ID"
    echo "   Network: $NETWORK"
    echo "   Frontend URL: https://$CANISTER_ID.ic0.app"
    echo "   API URL: https://$CANISTER_ID.ic0.app/api"
    echo "   Health Check: https://$CANISTER_ID.ic0.app/health"
    echo ""
}

# Function to test canister
test_canister() {
    echo -e "${BLUE}🧪 اختبار Canister...${NC}"
    echo -e "${BLUE}🧪 Testing canister...${NC}"
    
    # Test frontend
    echo -e "${YELLOW}🌐 اختبار الواجهة الأمامية...${NC}"
    echo -e "${YELLOW}🌐 Testing frontend...${NC}"
    
    if curl -f -s "https://$CANISTER_ID.ic0.app" > /dev/null; then
        echo -e "${GREEN}✅ الواجهة الأمامية تعمل${NC}"
        echo -e "${GREEN}✅ Frontend is working${NC}"
    else
        echo -e "${RED}❌ الواجهة الأمامية لا تعمل${NC}"
        echo -e "${RED}❌ Frontend is not working${NC}"
    fi
    
    # Test API
    echo -e "${YELLOW}🔌 اختبار API...${NC}"
    echo -e "${YELLOW}🔌 Testing API...${NC}"
    
    if curl -f -s "https://$CANISTER_ID.ic0.app/api/health" > /dev/null; then
        echo -e "${GREEN}✅ API يعمل${NC}"
        echo -e "${GREEN}✅ API is working${NC}"
    else
        echo -e "${RED}❌ API لا يعمل${NC}"
        echo -e "${RED}❌ API is not working${NC}"
    fi
}

# Function to update canister
update_canister() {
    echo -e "${BLUE}🔄 تحديث Canister...${NC}"
    echo -e "${BLUE}🔄 Updating canister...${NC}"
    
    if command -v dfx &> /dev/null; then
        # Build project
        echo -e "${YELLOW}🔨 بناء المشروع...${NC}"
        echo -e "${YELLOW}🔨 Building project...${NC}"
        
        npm run build:icp
        
        # Deploy update
        echo -e "${YELLOW}🚀 نشر التحديث...${NC}"
        echo -e "${YELLOW}🚀 Deploying update...${NC}"
        
        dfx deploy --network $NETWORK --upgrade-unchanged
    else
        echo -e "${RED}❌ DFX غير مثبت. لا يمكن التحديث${NC}"
        echo -e "${RED}❌ DFX not installed. Cannot update${NC}"
    fi
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📜 سجلات Canister:${NC}"
    echo -e "${BLUE}📜 Canister Logs:${NC}"
    
    if command -v dfx &> /dev/null; then
        dfx canister --network $NETWORK logs $CANISTER_ID
    else
        echo -e "${YELLOW}⚠️ DFX غير مثبت. لا يمكن عرض السجلات${NC}"
        echo -e "${YELLOW}⚠️ DFX not installed. Cannot show logs${NC}"
    fi
}

# Function to show usage
show_usage() {
    echo -e "${BLUE}📖 الاستخدام:${NC}"
    echo -e "${BLUE}📖 Usage:${NC}"
    echo "   $0 status    - فحص حالة Canister"
    echo "   $0 info      - عرض معلومات Canister"
    echo "   $0 test      - اختبار Canister"
    echo "   $0 update    - تحديث Canister"
    echo "   $0 logs      - عرض سجلات Canister"
    echo "   $0 help      - عرض هذه المساعدة"
    echo ""
}

# Main function
main() {
    case "${1:-help}" in
        "status")
            check_status
            ;;
        "info")
            get_info
            ;;
        "test")
            test_canister
            ;;
        "update")
            update_canister
            ;;
        "logs")
            show_logs
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Run main function
main "$@"
