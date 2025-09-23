// ICP Configuration for Canister 93343-A7BDB-4F45F
// تكوين ICP لـ Canister 93343-A7BDB-4F45F

export const ICP_CONFIG = {
  // Canister Information
  CANISTER_ID: '93343-A7BDB-4F45F',
  NETWORK: import.meta.env.VITE_ICP_NETWORK || 'ic',
  
  // URLs
  FRONTEND_URL: `https://93343-A7BDB-4F45F.ic0.app`,
  BACKEND_URL: `https://93343-A7BDB-4F45F.ic0.app/api`,
  HEALTH_URL: `https://93343-A7BDB-4F45F.ic0.app/health`,
  
  // API Endpoints
  API_ENDPOINTS: {
    HEALTH: '/health',
    USERS: '/api/users',
    SHIPMENTS: '/api/shipments',
    PAYMENTS: '/api/payments',
    TRACKING: '/api/tracking',
    ANALYTICS: '/api/analytics'
  },
  
  // Web3 Configuration
  WEB3_CONFIG: {
    ETHEREUM_RPC: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    POLYGON_RPC: 'https://polygon-rpc.com',
    BSC_RPC: 'https://bsc-dataseed.binance.org',
    ICP_PROVIDER: 'https://ic0.app'
  },
  
  // Security
  SECURITY: {
    CORS_ORIGINS: ['https://93343-A7BDB-4F45F.ic0.app', 'https://*.ic0.app'],
    ALLOWED_HOSTS: ['93343-A7BDB-4F45F.ic0.app', '*.ic0.app'],
    JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production'
  },
  
  // Performance
  PERFORMANCE: {
    REQUEST_TIMEOUT: 30000,
    MAX_RETRIES: 3,
    CACHE_TTL: 300000, // 5 minutes
    RATE_LIMIT: 1000
  },
  
  // Monitoring
  MONITORING: {
    ENABLED: true,
    METRICS_URL: 'https://93343-A7BDB-4F45F.ic0.app/metrics',
    LOGS_URL: 'https://93343-A7BDB-4F45F.ic0.app/logs',
    HEALTH_CHECK_INTERVAL: 60000 // 1 minute
  }
}

// Helper functions
export const getApiUrl = (endpoint) => {
  return `${ICP_CONFIG.BACKEND_URL}${endpoint}`
}

export const getFrontendUrl = (path = '') => {
  return `${ICP_CONFIG.FRONTEND_URL}${path}`
}

export const isLocalNetwork = () => {
  return ICP_CONFIG.NETWORK === 'local'
}

export const isMainnet = () => {
  return ICP_CONFIG.NETWORK === 'ic'
}

// Export default
export default ICP_CONFIG
