# IDEV Web3 Shipping Platform - Environment Variables Template
# ============================================================
# Copy this file to .env and fill in your actual values

# Application Settings
VITE_APP_NAME="IDEV - منصة الشحن والتوصيل"
VITE_APP_VERSION="2.0.0"
VITE_APP_DESCRIPTION="منصة شحن وتوصيل متطورة مع تكامل Web3 والبلوك تشين"
VITE_APP_URL="http://localhost:5000"
VITE_API_URL="http://localhost:3000/api"

# Development Settings
NODE_ENV="development"
VITE_NODE_ENV="development"
PORT=5000
VITE_PORT=5000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/idev_shipping"
DB_HOST="localhost"
DB_PORT=5432
DB_NAME="idev_shipping"
DB_USER="username"
DB_PASSWORD="password"
DB_SSL=false

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# Web3 & Blockchain Configuration
# Ethereum Mainnet
VITE_ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/YOUR_INFURA_KEY"
VITE_ETHEREUM_CHAIN_ID=1
VITE_ETHEREUM_NETWORK_NAME="Ethereum Mainnet"

# Ethereum Testnet (Goerli)
VITE_ETHEREUM_TESTNET_RPC_URL="https://goerli.infura.io/v3/YOUR_INFURA_KEY"
VITE_ETHEREUM_TESTNET_CHAIN_ID=5
VITE_ETHEREUM_TESTNET_NETWORK_NAME="Goerli Testnet"

# Polygon Network
VITE_POLYGON_RPC_URL="https://polygon-rpc.com"
VITE_POLYGON_CHAIN_ID=137
VITE_POLYGON_NETWORK_NAME="Polygon Mainnet"

# Binance Smart Chain
VITE_BSC_RPC_URL="https://bsc-dataseed.binance.org"
VITE_BSC_CHAIN_ID=56
VITE_BSC_NETWORK_NAME="BSC Mainnet"

# Internet Computer Protocol (ICP)
VITE_ICP_CANISTER_ID="YOUR_CANISTER_ID"
VITE_ICP_NETWORK_URL="https://ic0.app"
VITE_ICP_LOCAL_URL="http://localhost:8000"

# Smart Contract Addresses
VITE_SHIPPING_CONTRACT_ADDRESS="0x..."
VITE_INSURANCE_CONTRACT_ADDRESS="0x..."
VITE_PAYMENT_CONTRACT_ADDRESS="0x..."
VITE_RATING_CONTRACT_ADDRESS="0x..."

# Cryptocurrency API Keys
VITE_COINGECKO_API_KEY="YOUR_COINGECKO_API_KEY"
VITE_COINMARKETCAP_API_KEY="YOUR_COINMARKETCAP_API_KEY"

# Authentication & Security
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
VITE_JWT_SECRET="your-super-secret-jwt-key-here"

# Encryption Keys
ENCRYPTION_KEY="your-32-character-encryption-key"
VITE_ENCRYPTION_KEY="your-32-character-encryption-key"

# Session Configuration
SESSION_SECRET="your-session-secret-key"
SESSION_COOKIE_NAME="idev_session"
SESSION_MAX_AGE=86400000

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
VITE_SMTP_HOST="smtp.gmail.com"
VITE_SMTP_PORT=587

# SMS Configuration
SMS_PROVIDER="twilio"
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
VITE_TWILIO_ACCOUNT_SID="your-twilio-account-sid"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"
VITE_MAX_FILE_SIZE=10485760
VITE_UPLOAD_PATH="./uploads"

# Image Processing
IMAGE_QUALITY=80
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1080
VITE_IMAGE_QUALITY=80

# Payment Gateway Configuration
# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
VITE_PAYPAL_CLIENT_ID="your-paypal-client-id"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
VITE_RAZORPAY_KEY_ID="your-razorpay-key-id"

# Business Platform Integrations
# Shopify
SHOPIFY_API_KEY="your-shopify-api-key"
SHOPIFY_API_SECRET="your-shopify-api-secret"
SHOPIFY_WEBHOOK_SECRET="your-shopify-webhook-secret"
VITE_SHOPIFY_API_KEY="your-shopify-api-key"

# WooCommerce
WOOCOMMERCE_URL="https://your-store.com"
WOOCOMMERCE_CONSUMER_KEY="your-woocommerce-consumer-key"
WOOCOMMERCE_CONSUMER_SECRET="your-woocommerce-consumer-secret"
VITE_WOOCOMMERCE_URL="https://your-store.com"

# Wix
WIX_API_KEY="your-wix-api-key"
WIX_API_SECRET="your-wix-api-secret"
VITE_WIX_API_KEY="your-wix-api-key"

# EasyOrder
EASYORDER_API_KEY="your-easyorder-api-key"
EASYORDER_API_SECRET="your-easyorder-api-secret"
VITE_EASYORDER_API_KEY="your-easyorder-api-key"

# Maps & Location Services
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Analytics & Monitoring
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
VITE_GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"

# Sentry Error Tracking
SENTRY_DSN="your-sentry-dsn"
VITE_SENTRY_DSN="your-sentry-dsn"

# Logging Configuration
LOG_LEVEL="info"
LOG_FILE_PATH="./logs/app.log"
VITE_LOG_LEVEL="info"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
VITE_RATE_LIMIT_WINDOW_MS=900000

# CORS Configuration
CORS_ORIGIN="http://localhost:5000"
CORS_CREDENTIALS=true
VITE_CORS_ORIGIN="http://localhost:5000"

# Cache Configuration
CACHE_TTL=3600
CACHE_MAX_SIZE=100
VITE_CACHE_TTL=3600

# Backup Configuration
BACKUP_SCHEDULE="0 2 * * *"
BACKUP_RETENTION_DAYS=30
BACKUP_PATH="./backups"
VITE_BACKUP_SCHEDULE="0 2 * * *"

# Notification Settings
PUSH_NOTIFICATION_KEY="your-push-notification-key"
VITE_PUSH_NOTIFICATION_KEY="your-push-notification-key"

# Webhook Configuration
WEBHOOK_SECRET="your-webhook-secret"
WEBHOOK_TIMEOUT=30000
VITE_WEBHOOK_SECRET="your-webhook-secret"

# Feature Flags
ENABLE_WEB3_FEATURES=true
ENABLE_AI_FEATURES=true
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
VITE_ENABLE_WEB3_FEATURES=true
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Development Tools
ENABLE_DEBUG_MODE=true
ENABLE_HOT_RELOAD=true
ENABLE_SOURCE_MAPS=true
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_HOT_RELOAD=true
VITE_ENABLE_SOURCE_MAPS=true

# Testing Configuration
TEST_DATABASE_URL="postgresql://username:password@localhost:5432/idev_shipping_test"
TEST_REDIS_URL="redis://localhost:6379/1"
VITE_TEST_DATABASE_URL="postgresql://username:password@localhost:5432/idev_shipping_test"

# Production Settings (for production deployment)
# Uncomment and configure these for production
# NODE_ENV="production"
# VITE_NODE_ENV="production"
# VITE_APP_URL="https://your-domain.com"
# VITE_API_URL="https://api.your-domain.com"
# DATABASE_URL="postgresql://prod_user:prod_password@prod_host:5432/idev_shipping_prod"
# REDIS_URL="redis://prod_host:6379"
# JWT_SECRET="your-production-jwt-secret"
# SESSION_SECRET="your-production-session-secret"
# SMTP_USER="production-email@your-domain.com"
# SMTP_PASS="production-email-password"
# STRIPE_PUBLISHABLE_KEY="pk_live_..."
# STRIPE_SECRET_KEY="sk_live_..."
# GOOGLE_MAPS_API_KEY="your-production-google-maps-key"
# GOOGLE_ANALYTICS_ID="GA-PRODUCTION-ID"
# SENTRY_DSN="your-production-sentry-dsn"
# CORS_ORIGIN="https://your-domain.com"
# VITE_CORS_ORIGIN="https://your-domain.com"
# ENABLE_DEBUG_MODE=false
# VITE_ENABLE_DEBUG_MODE=false
# ENABLE_HOT_RELOAD=false
# VITE_ENABLE_HOT_RELOAD=false
# ENABLE_SOURCE_MAPS=false
# VITE_ENABLE_SOURCE_MAPS=false
