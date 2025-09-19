// Frontend Integration Service
// This service handles communication between the React frontend and Rust backend

import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Verify token
  verify: async () => {
    const response = await apiClient.post('/auth/verify');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  },

  // KYC verification
  kycVerification: async (kycData) => {
    const response = await apiClient.post('/auth/kyc', kycData);
    return response.data;
  },

  // Biometric authentication
  biometricAuth: async (biometricData) => {
    const response = await apiClient.post('/auth/biometric', biometricData);
    return response.data;
  },

  // World ID verification
  worldIdVerify: async (worldIdData) => {
    const response = await apiClient.post('/auth/world-id', worldIdData);
    return response.data;
  },

  // Internet Identity authentication
  internetIdentityAuth: async (icpData) => {
    const response = await apiClient.post('/auth/internet-identity', icpData);
    return response.data;
  },
};

// Web3 API
export const web3API = {
  // Connect wallet
  connectWallet: async (walletData) => {
    const response = await apiClient.post('/web3/connect', walletData);
    return response.data;
  },

  // Get wallet balance
  getBalance: async (address, chainId) => {
    const response = await apiClient.get('/web3/balance', {
      params: { address, chain_id: chainId }
    });
    return response.data;
  },

  // Send transaction
  sendTransaction: async (transactionData) => {
    const response = await apiClient.post('/web3/send', transactionData);
    return response.data;
  },

  // Mint NFT
  mintNFT: async (nftData) => {
    const response = await apiClient.post('/web3/nft/mint', nftData);
    return response.data;
  },

  // Get NFT
  getNFT: async (tokenId) => {
    const response = await apiClient.get(`/web3/nft/${tokenId}`);
    return response.data;
  },

  // Connect ICP
  connectICP: async (icpData) => {
    const response = await apiClient.post('/icp/connect', icpData);
    return response.data;
  },

  // Get ICP canister
  getCanister: async (canisterId) => {
    const response = await apiClient.get(`/icp/canister/${canisterId}`);
    return response.data;
  },

  // Call ICP canister
  callCanister: async (callData) => {
    const response = await apiClient.post('/icp/call', callData);
    return response.data;
  },
};

// Tracking API
export const trackingAPI = {
  // Create shipment
  createShipment: async (shipmentData) => {
    const response = await apiClient.post('/tracking/create', shipmentData);
    return response.data;
  },

  // Get shipment
  getShipment: async (shipmentId) => {
    const response = await apiClient.get(`/tracking/${shipmentId}`);
    return response.data;
  },

  // Update location
  updateLocation: async (shipmentId, locationData) => {
    const response = await apiClient.put(`/tracking/${shipmentId}/update`, locationData);
    return response.data;
  },

  // Update status
  updateStatus: async (shipmentId, statusData) => {
    const response = await apiClient.put(`/tracking/${shipmentId}/status`, statusData);
    return response.data;
  },

  // Convert to NFT
  convertToNFT: async (shipmentId, nftData) => {
    const response = await apiClient.post(`/tracking/${shipmentId}/nft`, nftData);
    return response.data;
  },

  // Search shipments
  searchShipments: async (searchParams) => {
    const response = await apiClient.get('/tracking/search', { params: searchParams });
    return response.data;
  },
};

// AI API
export const aiAPI = {
  // Get suggestions
  getSuggestions: async (params) => {
    const response = await apiClient.get('/ai/suggestions', { params });
    return response.data;
  },

  // Get predictions
  getPredictions: async (params) => {
    const response = await apiClient.get('/ai/predictions', { params });
    return response.data;
  },

  // Get risk assessment
  getRiskAssessment: async (params) => {
    const response = await apiClient.get('/ai/risks', { params });
    return response.data;
  },

  // Get insights
  getInsights: async (params) => {
    const response = await apiClient.get('/ai/insights', { params });
    return response.data;
  },

  // Apply suggestion
  applySuggestion: async (suggestionData) => {
    const response = await apiClient.post('/ai/apply-suggestion', suggestionData);
    return response.data;
  },
};

// Support API
export const supportAPI = {
  // Get tickets
  getTickets: async (params) => {
    const response = await apiClient.get('/support/tickets', { params });
    return response.data;
  },

  // Create ticket
  createTicket: async (ticketData) => {
    const response = await apiClient.post('/support/tickets', ticketData);
    return response.data;
  },

  // Get ticket
  getTicket: async (ticketId) => {
    const response = await apiClient.get(`/support/tickets/${ticketId}`);
    return response.data;
  },

  // Update ticket
  updateTicket: async (ticketId, updateData) => {
    const response = await apiClient.put(`/support/tickets/${ticketId}`, updateData);
    return response.data;
  },

  // Start chat
  startChat: async (chatData) => {
    const response = await apiClient.post('/support/chat/start', chatData);
    return response.data;
  },

  // Get messages
  getMessages: async (sessionId) => {
    const response = await apiClient.get(`/support/chat/${sessionId}/messages`);
    return response.data;
  },

  // Send message
  sendMessage: async (sessionId, messageData) => {
    const response = await apiClient.post(`/support/chat/${sessionId}/messages`, messageData);
    return response.data;
  },

  // Start video call
  startVideoCall: async (videoData) => {
    const response = await apiClient.post('/support/video/start', videoData);
    return response.data;
  },

  // Get knowledge base
  getKnowledgeBase: async (params) => {
    const response = await apiClient.get('/support/knowledge', { params });
    return response.data;
  },
};

// Confirmation API
export const confirmationAPI = {
  // Create confirmation
  createConfirmation: async (confirmationData) => {
    const response = await apiClient.post('/confirmation/create', confirmationData);
    return response.data;
  },

  // Get confirmation
  getConfirmation: async (confirmationId) => {
    const response = await apiClient.get(`/confirmation/${confirmationId}`);
    return response.data;
  },

  // Confirm
  confirm: async (confirmationId, confirmData) => {
    const response = await apiClient.post(`/confirmation/${confirmationId}/confirm`, confirmData);
    return response.data;
  },

  // Cancel confirmation
  cancelConfirmation: async (confirmationId) => {
    const response = await apiClient.post(`/confirmation/${confirmationId}/cancel`);
    return response.data;
  },

  // Get pending confirmations
  getPendingConfirmations: async (params) => {
    const response = await apiClient.get('/confirmation/pending', { params });
    return response.data;
  },

  // Get completed confirmations
  getCompletedConfirmations: async (params) => {
    const response = await apiClient.get('/confirmation/completed', { params });
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  // Get KPIs
  getKPIs: async (params) => {
    const response = await apiClient.get('/analytics/kpis', { params });
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params) => {
    const response = await apiClient.get('/analytics/revenue', { params });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async (params) => {
    const response = await apiClient.get('/analytics/customers', { params });
    return response.data;
  },

  // Get product analytics
  getProductAnalytics: async (params) => {
    const response = await apiClient.get('/analytics/products', { params });
    return response.data;
  },

  // Get campaign analytics
  getCampaignAnalytics: async (params) => {
    const response = await apiClient.get('/analytics/campaigns', { params });
    return response.data;
  },

  // Export data
  exportData: async (params) => {
    const response = await apiClient.get('/analytics/export', { params });
    return response.data;
  },
};

// Insurance API
export const insuranceAPI = {
  // Get policies
  getPolicies: async (params) => {
    const response = await apiClient.get('/insurance/policies', { params });
    return response.data;
  },

  // Create policy
  createPolicy: async (policyData) => {
    const response = await apiClient.post('/insurance/policies', policyData);
    return response.data;
  },

  // Create claim
  createClaim: async (claimData) => {
    const response = await apiClient.post('/insurance/claims', claimData);
    return response.data;
  },

  // Get claim
  getClaim: async (claimId) => {
    const response = await apiClient.get(`/insurance/claims/${claimId}`);
    return response.data;
  },
};

// Rating API
export const ratingAPI = {
  // Create rating
  createRating: async (ratingData) => {
    const response = await apiClient.post('/ratings', ratingData);
    return response.data;
  },

  // Get rating
  getRating: async (ratingId) => {
    const response = await apiClient.get(`/ratings/${ratingId}`);
    return response.data;
  },

  // Get user ratings
  getUserRatings: async (userId) => {
    const response = await apiClient.get(`/ratings/user/${userId}`);
    return response.data;
  },

  // Get shipment ratings
  getShipmentRatings: async (shipmentId) => {
    const response = await apiClient.get(`/ratings/shipment/${shipmentId}`);
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  // Create payment
  createPayment: async (paymentData) => {
    const response = await apiClient.post('/payments/create', paymentData);
    return response.data;
  },

  // Get payment
  getPayment: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentId) => {
    const response = await apiClient.post(`/payments/${paymentId}/confirm`);
    return response.data;
  },

  // Get crypto balance
  getCryptoBalance: async (params) => {
    const response = await apiClient.get('/payments/crypto/balance', { params });
    return response.data;
  },

  // Get invoices
  getInvoices: async (params) => {
    const response = await apiClient.get('/payments/invoices', { params });
    return response.data;
  },

  // Create invoice
  createInvoice: async (invoiceData) => {
    const response = await apiClient.post('/payments/invoices', invoiceData);
    return response.data;
  },
};

// Business Integrations API
export const integrationsAPI = {
  // Shopify connect
  shopifyConnect: async (shopifyData) => {
    const response = await apiClient.post('/integrations/shopify', shopifyData);
    return response.data;
  },

  // WooCommerce connect
  woocommerceConnect: async (woocommerceData) => {
    const response = await apiClient.post('/integrations/woocommerce', woocommerceData);
    return response.data;
  },

  // Wix connect
  wixConnect: async (wixData) => {
    const response = await apiClient.post('/integrations/wix', wixData);
    return response.data;
  },

  // EasyOrder connect
  easyorderConnect: async (easyorderData) => {
    const response = await apiClient.post('/integrations/easyorder', easyorderData);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  // Customer dashboard
  getCustomerDashboard: async (params) => {
    const response = await apiClient.get('/dashboard/customer', { params });
    return response.data;
  },

  // Store dashboard
  getStoreDashboard: async (params) => {
    const response = await apiClient.get('/dashboard/store', { params });
    return response.data;
  },

  // Driver dashboard
  getDriverDashboard: async (params) => {
    const response = await apiClient.get('/dashboard/driver', { params });
    return response.data;
  },

  // Admin dashboard
  getAdminDashboard: async (params) => {
    const response = await apiClient.get('/dashboard/admin', { params });
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  // Upload document
  uploadDocument: async (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await apiClient.post('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload image
  uploadImage: async (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  // Get notifications
  getNotifications: async (params) => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Get notification settings
  getSettings: async () => {
    const response = await apiClient.get('/notifications/settings');
    return response.data;
  },

  // Update notification settings
  updateSettings: async (settings) => {
    const response = await apiClient.put('/notifications/settings', settings);
    return response.data;
  },
};

// Blockchain Payment API (replaces traditional payments)
export const blockchainPaymentAPI = {
  // Create crypto payment
  createCryptoPayment: async (paymentData) => {
    const response = await apiClient.post('/blockchain/payments/crypto', paymentData);
    return response.data;
  },

  // Create ICP payment
  createICPPayment: async (paymentData) => {
    const response = await apiClient.post('/blockchain/payments/icp', paymentData);
    return response.data;
  },

  // Create NFT payment
  createNFTPayment: async (paymentData) => {
    const response = await apiClient.post('/blockchain/payments/nft', paymentData);
    return response.data;
  },

  // Get crypto balance
  getCryptoBalance: async (address, currency) => {
    const response = await apiClient.get(`/blockchain/balance/crypto?address=${address}&currency=${currency}`);
    return response.data;
  },

  // Get ICP balance
  getICPBalance: async (principal) => {
    const response = await apiClient.get(`/blockchain/balance/icp?principal=${principal}`);
    return response.data;
  },

  // Get DeFi yields
  getDeFiYields: async (protocol = 'all') => {
    const response = await apiClient.get(`/blockchain/defi/yields?protocol=${protocol}`);
    return response.data;
  },

  // Execute smart contract
  executeSmartContract: async (contractData) => {
    const response = await apiClient.post('/blockchain/smart-contract/execute', contractData);
    return response.data;
  },
};

// Smart Contracts API
export const smartContractAPI = {
  // Deploy contract
  deployContract: async (contractData) => {
    const response = await apiClient.post('/smart-contracts/deploy', contractData);
    return response.data;
  },

  // Execute contract function
  executeContractFunction: async (functionData) => {
    const response = await apiClient.post('/smart-contracts/execute', functionData);
    return response.data;
  },

  // Create shipment contract
  createShipmentContract: async (contractData) => {
    const response = await apiClient.post('/smart-contracts/shipment', contractData);
    return response.data;
  },

  // Get contract events
  getContractEvents: async (params = {}) => {
    const response = await apiClient.get('/smart-contracts/events', { params });
    return response.data;
  },

  // Get contract balance
  getContractBalance: async (contractAddress) => {
    const response = await apiClient.get(`/smart-contracts/balance/${contractAddress}`);
    return response.data;
  },

  // Trigger contract event
  triggerContractEvent: async (eventData) => {
    const response = await apiClient.post('/smart-contracts/trigger-event', eventData);
    return response.data;
  },
};

// DeFi API
export const defiAPI = {
  // Create staking
  createStaking: async (stakingData) => {
    const response = await apiClient.post('/defi/staking', stakingData);
    return response.data;
  },

  // Create liquidity pool
  createLiquidityPool: async (poolData) => {
    const response = await apiClient.post('/defi/liquidity-pool', poolData);
    return response.data;
  },

  // Create lending
  createLending: async (lendingData) => {
    const response = await apiClient.post('/defi/lending', lendingData);
    return response.data;
  },

  // Create yield farming
  createYieldFarming: async (farmingData) => {
    const response = await apiClient.post('/defi/yield-farming', farmingData);
    return response.data;
  },

  // Get DeFi portfolio
  getDeFiPortfolio: async (userId) => {
    const response = await apiClient.get(`/defi/portfolio?user_id=${userId}`);
    return response.data;
  },

  // Get DeFi protocols
  getDeFiProtocols: async () => {
    const response = await apiClient.get('/defi/protocols');
    return response.data;
  },

  // Claim rewards
  claimRewards: async (positionId) => {
    const response = await apiClient.post(`/defi/rewards/${positionId}/claim`);
    return response.data;
  },
};

// NFT API
export const nftAPI = {
  // Create shipment NFT
  createShipmentNFT: async (nftData) => {
    const response = await apiClient.post('/nft/shipment', nftData);
    return response.data;
  },

  // Create document NFT
  createDocumentNFT: async (nftData) => {
    const response = await apiClient.post('/nft/document', nftData);
    return response.data;
  },

  // Create certificate NFT
  createCertificateNFT: async (nftData) => {
    const response = await apiClient.post('/nft/certificate', nftData);
    return response.data;
  },

  // Create reward NFT
  createRewardNFT: async (nftData) => {
    const response = await apiClient.post('/nft/reward', nftData);
    return response.data;
  },

  // Get NFT collections
  getNFTCollections: async (params = {}) => {
    const response = await apiClient.get('/nft/collections', { params });
    return response.data;
  },

  // List NFT on marketplace
  listNFTOnMarketplace: async (listingData) => {
    const response = await apiClient.post('/nft/marketplace/list', listingData);
    return response.data;
  },

  // Transfer NFT
  transferNFT: async (transferData) => {
    const response = await apiClient.post('/nft/transfer', transferData);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  // Check API health
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

// Export all APIs
export default {
  auth: authAPI,
  web3: web3API,
  tracking: trackingAPI,
  ai: aiAPI,
  support: supportAPI,
  confirmation: confirmationAPI,
  analytics: analyticsAPI,
  insurance: insuranceAPI,
  rating: ratingAPI,
  payment: paymentAPI,
  integrations: integrationsAPI,
  dashboard: dashboardAPI,
  upload: uploadAPI,
  notifications: notificationsAPI,
  blockchainPayment: blockchainPaymentAPI,
  smartContract: smartContractAPI,
  defi: defiAPI,
  nft: nftAPI,
  health: healthAPI,
};
