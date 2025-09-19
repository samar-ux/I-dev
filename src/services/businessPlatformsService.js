// خدمة موحدة لإدارة منصات الأعمال العالمية
import shopifyIntegrationService from './shopifyIntegrationService';
import wooCommerceIntegrationService from './wooCommerceIntegrationService';
import wixIntegrationService from './wixIntegrationService';
import easyOrderIntegrationService from './easyOrderIntegrationService';

class BusinessPlatformsService {
  constructor() {
    this.isInitialized = false;
    this.platforms = {
      shopify: shopifyIntegrationService,
      woocommerce: wooCommerceIntegrationService,
      wix: wixIntegrationService,
      easyorder: easyOrderIntegrationService
    };
    this.connectedPlatforms = new Map();
    this.platformInfo = {
      shopify: {
        name: 'Shopify',
        description: 'منصة التجارة الإلكترونية العالمية الرائدة',
        icon: '🛍️',
        color: '#96BF48',
        features: ['متجر إلكتروني', 'إدارة المخزون', 'تحليلات متقدمة', 'تطبيقات متعددة'],
        supportedRegions: ['عالمي'],
        languages: ['الإنجليزية', 'العربية', 'الفرنسية', 'الألمانية', 'الإسبانية']
      },
      woocommerce: {
        name: 'WooCommerce',
        description: 'إضافة WordPress للتجارة الإلكترونية',
        icon: '🔧',
        color: '#96588A',
        features: ['WordPress', 'مرونة عالية', 'تخصيص كامل', 'مجاني'],
        supportedRegions: ['عالمي'],
        languages: ['الإنجليزية', 'العربية', 'متعدد اللغات']
      },
      wix: {
        name: 'Wix',
        description: 'منصة إنشاء المواقع والتجارة الإلكترونية',
        icon: '🎨',
        color: '#FF6B6B',
        features: ['مصمم مواقع', 'متجر إلكتروني', 'سهولة الاستخدام', 'قوالب جاهزة'],
        supportedRegions: ['عالمي'],
        languages: ['الإنجليزية', 'العربية', 'متعدد اللغات']
      },
      easyorder: {
        name: 'إيزي أوردر',
        description: 'منصة التجارة الإلكترونية العربية الرائدة',
        icon: '🇸🇦',
        color: '#00A651',
        features: ['عربي كامل', 'بنوك محلية', 'شحن محلي', 'عملات عربية'],
        supportedRegions: ['السعودية', 'الإمارات', 'الكويت', 'قطر', 'البحرين'],
        languages: ['العربية']
      }
    };
  }

  async init() {
    try {
      // تهيئة جميع خدمات المنصات
      await Promise.all([
        shopifyIntegrationService.init(),
        wooCommerceIntegrationService.init(),
        wixIntegrationService.init(),
        easyOrderIntegrationService.init()
      ]);
      
      this.isInitialized = true;
      console.log('Business platforms service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize business platforms service:', error);
      throw error;
    }
  }

  async connectPlatform(platformName, credentials) {
    try {
      const platform = this.platforms[platformName];
      if (!platform) {
        throw new Error(`Unsupported platform: ${platformName}`);
      }

      let result;
      
      switch (platformName) {
        case 'shopify':
          result = await platform.authenticate(credentials.shopDomain, credentials.accessToken);
          break;
        case 'woocommerce':
          result = await platform.authenticate(credentials.siteUrl, credentials.consumerKey, credentials.consumerSecret);
          break;
        case 'wix':
          result = await platform.authenticate(credentials.instanceId, credentials.accessToken);
          break;
        case 'easyorder':
          result = await platform.authenticate(credentials.merchantId, credentials.apiKey, credentials.apiSecret);
          break;
        default:
          throw new Error(`Unknown platform: ${platformName}`);
      }

      if (result.success) {
        this.connectedPlatforms.set(platformName, {
          platform: platform,
          credentials: credentials,
          connectedAt: new Date().toISOString(),
          status: 'connected'
        });
      }

      return result;
    } catch (error) {
      console.error(`Failed to connect ${platformName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async disconnectPlatform(platformName) {
    try {
      const platformConnection = this.connectedPlatforms.get(platformName);
      if (!platformConnection) {
        throw new Error(`Platform ${platformName} is not connected`);
      }

      const result = await platformConnection.platform.disconnect();
      
      if (result.success) {
        this.connectedPlatforms.delete(platformName);
      }

      return result;
    } catch (error) {
      console.error(`Failed to disconnect ${platformName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPlatformOrders(platformName, limit = 50) {
    try {
      const platformConnection = this.connectedPlatforms.get(platformName);
      if (!platformConnection) {
        throw new Error(`Platform ${platformName} is not connected`);
      }

      const result = await platformConnection.platform.getOrders(limit);
      return result;
    } catch (error) {
      console.error(`Failed to get orders from ${platformName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAllOrders(limit = 50) {
    try {
      const allOrders = {};
      
      for (const [platformName, connection] of this.connectedPlatforms) {
        try {
          const result = await connection.platform.getOrders(limit);
          if (result.success) {
            allOrders[platformName] = result.orders;
          }
        } catch (error) {
          console.error(`Failed to get orders from ${platformName}:`, error);
          allOrders[platformName] = [];
        }
      }

      return {
        success: true,
        orders: allOrders,
        totalPlatforms: this.connectedPlatforms.size
      };
    } catch (error) {
      console.error('Failed to get all orders:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createShipmentOnPlatform(platformName, orderId, shipmentData) {
    try {
      const platformConnection = this.connectedPlatforms.get(platformName);
      if (!platformConnection) {
        throw new Error(`Platform ${platformName} is not connected`);
      }

      let result;
      
      switch (platformName) {
        case 'shopify':
          result = await platformConnection.platform.createShippingLabel(orderId, shipmentData);
          break;
        case 'woocommerce':
          result = await platformConnection.platform.createShipmentTracking(orderId, shipmentData);
          break;
        case 'wix':
          result = await platformConnection.platform.createShippingLabel(orderId, shipmentData);
          break;
        case 'easyorder':
          result = await platformConnection.platform.createShippingLabel(orderId, shipmentData);
          break;
        default:
          throw new Error(`Unsupported platform: ${platformName}`);
      }

      return result;
    } catch (error) {
      console.error(`Failed to create shipment on ${platformName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateShipmentStatusOnPlatform(platformName, orderId, status, trackingNumber) {
    try {
      const platformConnection = this.connectedPlatforms.get(platformName);
      if (!platformConnection) {
        throw new Error(`Platform ${platformName} is not connected`);
      }

      let result;
      
      switch (platformName) {
        case 'shopify':
          result = await platformConnection.platform.updateOrderFulfillment(orderId, trackingNumber, { status });
          break;
        case 'woocommerce':
          result = await platformConnection.platform.updateShipmentStatus(orderId, status, trackingNumber);
          break;
        case 'wix':
          result = await platformConnection.platform.updateShipmentStatus(orderId, status, trackingNumber);
          break;
        case 'easyorder':
          result = await platformConnection.platform.updateShipmentStatus(orderId, status, trackingNumber);
          break;
        default:
          throw new Error(`Unsupported platform: ${platformName}`);
      }

      return result;
    } catch (error) {
      console.error(`Failed to update shipment status on ${platformName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async setupWebhooksForPlatform(platformName) {
    try {
      const platformConnection = this.connectedPlatforms.get(platformName);
      if (!platformConnection) {
        throw new Error(`Platform ${platformName} is not connected`);
      }

      const result = await platformConnection.platform.setupWebhooks();
      return result;
    } catch (error) {
      console.error(`Failed to setup webhooks for ${platformName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async setupAllWebhooks() {
    try {
      const results = {};
      
      for (const [platformName, connection] of this.connectedPlatforms) {
        try {
          const result = await connection.platform.setupWebhooks();
          results[platformName] = result;
        } catch (error) {
          console.error(`Failed to setup webhooks for ${platformName}:`, error);
          results[platformName] = {
            success: false,
            error: error.message
          };
        }
      }

      return {
        success: true,
        webhooks: results
      };
    } catch (error) {
      console.error('Failed to setup all webhooks:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processWebhook(platformName, webhookData, topic) {
    try {
      const platformConnection = this.connectedPlatforms.get(platformName);
      if (!platformConnection) {
        throw new Error(`Platform ${platformName} is not connected`);
      }

      const result = await platformConnection.platform.processWebhook(webhookData, topic);
      return result;
    } catch (error) {
      console.error(`Failed to process webhook for ${platformName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPlatformAnalytics(platformName, period = '30d') {
    try {
      const platformConnection = this.connectedPlatforms.get(platformName);
      if (!platformConnection) {
        throw new Error(`Platform ${platformName} is not connected`);
      }

      const result = await platformConnection.platform.getAnalytics(period);
      return result;
    } catch (error) {
      console.error(`Failed to get analytics for ${platformName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAllAnalytics(period = '30d') {
    try {
      const allAnalytics = {};
      
      for (const [platformName, connection] of this.connectedPlatforms) {
        try {
          const result = await connection.platform.getAnalytics(period);
          if (result.success) {
            allAnalytics[platformName] = result.analytics;
          }
        } catch (error) {
          console.error(`Failed to get analytics for ${platformName}:`, error);
          allAnalytics[platformName] = null;
        }
      }

      return {
        success: true,
        analytics: allAnalytics,
        period: period
      };
    } catch (error) {
      console.error('Failed to get all analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getSupportedPlatforms() {
    return Object.keys(this.platforms);
  }

  getPlatformInfo(platformName) {
    return this.platformInfo[platformName] || null;
  }

  getAllPlatformInfo() {
    return this.platformInfo;
  }

  getConnectedPlatforms() {
    return Array.from(this.connectedPlatforms.keys());
  }

  isPlatformConnected(platformName) {
    return this.connectedPlatforms.has(platformName);
  }

  getConnectionStatus() {
    const status = {};
    
    for (const [platformName, connection] of this.connectedPlatforms) {
      status[platformName] = {
        connected: true,
        connectedAt: connection.connectedAt,
        status: connection.status
      };
    }

    // إضافة المنصات غير المتصلة
    for (const platformName of Object.keys(this.platforms)) {
      if (!this.connectedPlatforms.has(platformName)) {
        status[platformName] = {
          connected: false,
          connectedAt: null,
          status: 'disconnected'
        };
      }
    }

    return status;
  }

  async getPlatformHealth() {
    try {
      const health = {};
      
      for (const [platformName, connection] of this.connectedPlatforms) {
        try {
          // اختبار الاتصال بكل منصة
          let isHealthy = false;
          
          switch (platformName) {
            case 'shopify':
              isHealthy = await connection.platform.validateToken();
              break;
            case 'woocommerce':
              isHealthy = await connection.platform.validateCredentials();
              break;
            case 'wix':
              isHealthy = await connection.platform.validateToken();
              break;
            case 'easyorder':
              isHealthy = !!connection.platform.accessToken;
              break;
          }
          
          health[platformName] = {
            status: isHealthy ? 'healthy' : 'unhealthy',
            lastChecked: new Date().toISOString()
          };
        } catch (error) {
          health[platformName] = {
            status: 'unhealthy',
            error: error.message,
            lastChecked: new Date().toISOString()
          };
        }
      }

      return {
        success: true,
        health: health,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get platform health:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new BusinessPlatformsService();

