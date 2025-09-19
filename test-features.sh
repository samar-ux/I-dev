#!/bin/bash

# Web3 Shipping Platform - Feature Testing Script
# This script tests all the major features of the platform

echo "🧪 Starting Web3 Shipping Platform Feature Tests..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
API_BASE_URL="http://localhost:3000/api"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="TestPassword123"

# Function to print test results
print_test_result() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ $test_name: PASS${NC}"
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ $test_name: FAIL${NC} - $message"
    else
        echo -e "${YELLOW}⚠️  $test_name: SKIP${NC} - $message"
    fi
}

# Function to make API requests
make_request() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local headers="$4"
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
             -H "Content-Type: application/json" \
             -H "$headers" \
             -d "$data" \
             "$API_BASE_URL$endpoint"
    else
        curl -s -X "$method" \
             -H "$headers" \
             "$API_BASE_URL$endpoint"
    fi
}

# Test 1: Health Check
echo -e "\n${BLUE}1. Testing Health Check${NC}"
health_response=$(make_request "GET" "/health" "" "")
if echo "$health_response" | grep -q "healthy"; then
    print_test_result "Health Check" "PASS"
else
    print_test_result "Health Check" "FAIL" "Server not responding"
fi

# Test 2: User Registration
echo -e "\n${BLUE}2. Testing User Registration${NC}"
register_data='{
    "email": "'$TEST_USER_EMAIL'",
    "username": "testuser",
    "password": "'$TEST_USER_PASSWORD'",
    "first_name": "Test",
    "last_name": "User",
    "role": "customer"
}'

register_response=$(make_request "POST" "/auth/register" "$register_data" "")
if echo "$register_response" | grep -q "token"; then
    print_test_result "User Registration" "PASS"
    # Extract token for future requests
    TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    print_test_result "User Registration" "FAIL" "Registration failed"
fi

# Test 3: User Login
echo -e "\n${BLUE}3. Testing User Login${NC}"
login_data='{
    "email": "'$TEST_USER_EMAIL'",
    "password": "'$TEST_USER_PASSWORD'"
}'

login_response=$(make_request "POST" "/auth/login" "$login_data" "")
if echo "$login_response" | grep -q "token"; then
    print_test_result "User Login" "PASS"
    TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    print_test_result "User Login" "FAIL" "Login failed"
fi

# Test 4: Create Shipment
echo -e "\n${BLUE}4. Testing Shipment Creation${NC}"
shipment_data='{
    "sender_id": "test-sender-id",
    "receiver_id": "test-receiver-id",
    "weight": 2.5,
    "dimensions": {"length": 30, "width": 20, "height": 15},
    "description": "Test package",
    "value": 100.0,
    "currency": "USD",
    "pickup_address": {"city": "Riyadh", "country": "Saudi Arabia"},
    "delivery_address": {"city": "Jeddah", "country": "Saudi Arabia"},
    "priority": "medium"
}'

shipment_response=$(make_request "POST" "/tracking/create" "$shipment_data" "Authorization: Bearer $TOKEN")
if echo "$shipment_response" | grep -q "tracking_number"; then
    print_test_result "Shipment Creation" "PASS"
    SHIPMENT_ID=$(echo "$shipment_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
else
    print_test_result "Shipment Creation" "FAIL" "Shipment creation failed"
fi

# Test 5: Update Shipment Location
echo -e "\n${BLUE}5. Testing Location Update${NC}"
location_data='{
    "latitude": 24.7136,
    "longitude": 46.6753,
    "address": "Riyadh, Saudi Arabia",
    "city": "Riyadh",
    "country": "Saudi Arabia",
    "accuracy": 10.0
}'

location_response=$(make_request "PUT" "/tracking/$SHIPMENT_ID/update" "$location_data" "Authorization: Bearer $TOKEN")
if echo "$location_response" | grep -q "latitude"; then
    print_test_result "Location Update" "PASS"
else
    print_test_result "Location Update" "FAIL" "Location update failed"
fi

# Test 6: AI Suggestions
echo -e "\n${BLUE}6. Testing AI Suggestions${NC}"
ai_response=$(make_request "GET" "/ai/suggestions" "" "Authorization: Bearer $TOKEN")
if echo "$ai_response" | grep -q "suggestion_type"; then
    print_test_result "AI Suggestions" "PASS"
else
    print_test_result "AI Suggestions" "FAIL" "AI suggestions failed"
fi

# Test 7: Support Ticket Creation
echo -e "\n${BLUE}7. Testing Support Ticket Creation${NC}"
ticket_data='{
    "title": "Test Support Ticket",
    "description": "This is a test support ticket",
    "category": "technical",
    "priority": "medium"
}'

ticket_response=$(make_request "POST" "/support/tickets" "$ticket_data" "Authorization: Bearer $TOKEN")
if echo "$ticket_response" | grep -q "id"; then
    print_test_result "Support Ticket Creation" "PASS"
else
    print_test_result "Support Ticket Creation" "FAIL" "Ticket creation failed"
fi

# Test 8: Payment Creation
echo -e "\n${BLUE}8. Testing Payment Creation${NC}"
payment_data='{
    "amount": 50.0,
    "currency": "USD",
    "payment_method": "ethereum",
    "recipient_address": "0x1234567890123456789012345678901234567890"
}'

payment_response=$(make_request "POST" "/payments/create" "$payment_data" "Authorization: Bearer $TOKEN")
if echo "$payment_response" | grep -q "id"; then
    print_test_result "Payment Creation" "PASS"
else
    print_test_result "Payment Creation" "FAIL" "Payment creation failed"
fi

# Test 9: Rating Creation
echo -e "\n${BLUE}9. Testing Rating Creation${NC}"
rating_data='{
    "ratee_id": "test-ratee-id",
    "rating": 5,
    "comment": "Excellent service!"
}'

rating_response=$(make_request "POST" "/ratings" "$rating_data" "Authorization: Bearer $TOKEN")
if echo "$rating_response" | grep -q "id"; then
    print_test_result "Rating Creation" "PASS"
else
    print_test_result "Rating Creation" "FAIL" "Rating creation failed"
fi

# Test 10: Dashboard Data
echo -e "\n${BLUE}10. Testing Dashboard Data${NC}"
dashboard_response=$(make_request "GET" "/dashboard/customer" "" "Authorization: Bearer $TOKEN")
if echo "$dashboard_response" | grep -q "user_info"; then
    print_test_result "Dashboard Data" "PASS"
else
    print_test_result "Dashboard Data" "FAIL" "Dashboard data failed"
fi

# Test 11: Analytics
echo -e "\n${BLUE}11. Testing Analytics${NC}"
analytics_response=$(make_request "GET" "/analytics/kpis" "" "Authorization: Bearer $TOKEN")
if echo "$analytics_response" | grep -q "total_revenue"; then
    print_test_result "Analytics" "PASS"
else
    print_test_result "Analytics" "FAIL" "Analytics failed"
fi

# Test 12: Business Integration
echo -e "\n${BLUE}12. Testing Business Integration${NC}"
integration_data='{
    "shop_domain": "test-shop.myshopify.com",
    "access_token": "test-access-token"
}'

integration_response=$(make_request "POST" "/integrations/shopify" "$integration_data" "Authorization: Bearer $TOKEN")
if echo "$integration_response" | grep -q "id"; then
    print_test_result "Business Integration" "PASS"
else
    print_test_result "Business Integration" "FAIL" "Integration failed"
fi

# Test 13: Dual Confirmation
echo -e "\n${BLUE}13. Testing Dual Confirmation${NC}"
confirmation_data='{
    "confirmation_type": "delivery_confirmation",
    "title": "Test Confirmation",
    "description": "Test delivery confirmation",
    "priority": "high",
    "participants": [{"id": "user1", "role": "sender"}, {"id": "user2", "role": "receiver"}],
    "verification_methods": {"biometric": true, "signature": true}
}'

confirmation_response=$(make_request "POST" "/confirmation/create" "$confirmation_data" "Authorization: Bearer $TOKEN")
if echo "$confirmation_response" | grep -q "id"; then
    print_test_result "Dual Confirmation" "PASS"
else
    print_test_result "Dual Confirmation" "FAIL" "Confirmation creation failed"
fi

# Test 14: Notifications
echo -e "\n${BLUE}14. Testing Notifications${NC}"
notifications_response=$(make_request "GET" "/notifications" "" "Authorization: Bearer $TOKEN")
if echo "$notifications_response" | grep -q "notifications"; then
    print_test_result "Notifications" "PASS"
else
    print_test_result "Notifications" "FAIL" "Notifications failed"
fi

# Test Summary
echo -e "\n${BLUE}Test Summary${NC}"
echo "============="
echo -e "${GREEN}✅ All major features have been tested${NC}"
echo -e "${YELLOW}⚠️  Some tests may fail if the server is not running or configured properly${NC}"
echo -e "${BLUE}📊 Check the individual test results above for details${NC}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Ensure the backend server is running on port 3000"
echo "2. Check that PostgreSQL and Redis are running"
echo "3. Verify that the .env file is properly configured"
echo "4. Run individual tests to debug any failures"

echo -e "\n${GREEN}🎉 Feature testing completed!${NC}"
