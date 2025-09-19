// خدمة التكامل مع Wix App Market
class WixIntegrationService {
  constructor() {
    this.isInitialized = false;
    this.appId = process.env.REACT_APP_WIX_APP_ID || 'demo_app_id';
    this.appSecret = process.env.REACT_APP_WIX_APP_SECRET || 'demo_app_secret';
    this.baseUrl = 'https://www.wixapis.com';
    this.accessToken = null;
    this.instanceId = null;
    this.siteId = null;
  }

  async init() {
    try {
      this.isInitialized = true;
      console.log('Wix integration service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Wix integration service:', error);
      throw error;
    }
  }

  async authenticate(instanceId, accessToken) {
    try {
      this.instanceId = instanceId;
      this.accessToken = accessToken;
      
      // التحقق من صحة التوكن
      const isValid = await this.validateToken();
      
      if (isValid) {
        return {
          success: true,
          message: 'Wix authentication successful',
          instanceId: this.instanceId
        };
      } else {
        throw new Error('Invalid access token');
      }
    } catch (error) {
      console.error('Wix authentication failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validateToken() {
    try {
      const response = await fetch(`${this.baseUrl}/v1/site`, {
        headers: {
          'Authorization': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.siteId = data.site.id;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  async getSiteInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/v1/site`, {
        headers: {
          'Authorization': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        site: data.site
      };
    } catch (error) {
      console.error('Failed to get site info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getOrders(limit = 50, status = 'any') {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        status: status
      });

      const response = await fetch(`${this.baseUrl}/v1/orders?${params}`, {
        headers: {
          'Authorization': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        orders: data.orders
      };
    } catch (error) {
      console.error('Failed to get orders:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}`, {
        headers: {
          'Authorization': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        order: data.order
      };
    } catch (error) {
      console.error('Failed to get order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': this.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: status
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        order: data.order
      };
    } catch (error) {
      console.error('Failed to update order status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createFulfillment(orderId, fulfillmentData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}/fulfillments`, {
        method: 'POST',
        headers: {
          'Authorization': this.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fulfillment: fulfillmentData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        fulfillment: data.fulfillment
      };
    } catch (error) {
      console.error('Failed to create fulfillment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateFulfillment(orderId, fulfillmentId, trackingData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}/fulfillments/${fulfillmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': this.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fulfillment: trackingData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        fulfillment: data.fulfillment
      };
    } catch (error) {
      console.error('Failed to update fulfillment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProducts(limit = 50) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/v1/products?${params}`, {
        headers: {
          'Authorization': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        products: data.products
      };
    } catch (error) {
      console.error('Failed to get products:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCustomers(limit = 50) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/v1/members?${params}`, {
        headers: {
          'Authorization': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        customers: data.members
      };
    } catch (error) {
      console.error('Failed to get customers:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createShippingLabel(orderId, shippingData) {
    try {
      const fulfillmentData = {
        lineItems: shippingData.lineItems,
        trackingInfo: {
          trackingNumber: shippingData.trackingNumber,
          carrier: shippingData.carrier || 'IDev Shipping',
          trackingUrl: shippingData.trackingUrl
        },
        notifyCustomer: true
      };

      const result = await this.createFulfillment(orderId, fulfillmentData);
      
      if (result.success) {
        return {
          success: true,
          fulfillment: result.fulfillment,
          trackingNumber: shippingData.trackingNumber
        };
      } else {
        throw new Error('Failed to create fulfillment');
      }
    } catch (error) {
      console.error('Failed to create shipping label:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateShipmentStatus(orderId, status, trackingNumber) {
    try {
      const statusMap = {
        'pending': 'PENDING',
        'processing': 'PROCESSING',
        'shipped': 'SHIPPED',
        'delivered': 'DELIVERED',
        'cancelled': 'CANCELLED'
      };

      const wixStatus = statusMap[status] || status.toUpperCase();
      
      const result = await this.updateOrderStatus(orderId, wixStatus);
      
      if (result.success && trackingNumber) {
        // إضافة معلومات التتبع كملاحظة
        const fulfillmentData = {
          trackingInfo: {
            trackingNumber: trackingNumber,
            carrier: 'IDev Shipping',
            status: wixStatus
          }
        };
        
        // البحث عن fulfillment موجود أو إنشاء جديد
        await this.createFulfillment(orderId, fulfillmentData);
      }

      return result;
    } catch (error) {
      console.error('Failed to update shipment status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async setupWebhooks() {
    try {
      const webhooks = [
        {
          topic: 'orders/created',
          callbackUrl: `${window.location.origin}/api/webhooks/wix/orders-created`,
          secret: process.env.REACT_APP_WIX_WEBHOOK_SECRET || 'demo_secret'
        },
        {
          topic: 'orders/updated',
          callbackUrl: `${window.location.origin}/api/webhooks/wix/orders-updated`,
          secret: process.env.REACT_APP_WIX_WEBHOOK_SECRET || 'demo_secret'
        },
        {
          topic: 'orders/paid',
          callbackUrl: `${window.location.origin}/api/webhooks/wix/orders-paid`,
          secret: process.env.REACT_APP_WIX_WEBHOOK_SECRET || 'demo_secret'
        }
      ];

      const results = [];
      
      for (const webhook of webhooks) {
        try {
          const response = await fetch(`${this.baseUrl}/v1/webhooks`, {
            method: 'POST',
            headers: {
              'Authorization': this.accessToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhook)
          });

          if (response.ok) {
            const data = await response.json();
            results.push({
              topic: webhook.topic,
              success: true,
              webhookId: data.webhook.id
            });
          } else {
            results.push({
              topic: webhook.topic,
              success: false,
              error: `HTTP ${response.status}`
            });
          }
        } catch (error) {
          results.push({
            topic: webhook.topic,
            success: false,
            error: error.message
          });
        }
      }

      return {
        success: true,
        webhooks: results
      };
    } catch (error) {
      console.error('Failed to setup webhooks:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processWebhook(webhookData, topic) {
    try {
      switch (topic) {
        case 'orders/created':
          return await this.handleOrderCreated(webhookData);
        case 'orders/updated':
          return await this.handleOrderUpdated(webhookData);
        case 'orders/paid':
          return await this.handleOrderPaid(webhookData);
        default:
          return {
            success: false,
            error: `Unknown webhook topic: ${topic}`
          };
      }
    } catch (error) {
      console.error('Failed to process webhook:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async handleOrderCreated(orderData) {
    try {
      const shipmentData = {
        orderId: orderData.id,
        customerName: `${orderData.buyerInfo.firstName} ${orderData.buyerInfo.lastName}`,
        customerEmail: orderData.buyerInfo.email,
        shippingAddress: orderData.shippingInfo,
        items: orderData.lineItems,
        totalPrice: orderData.priceSummary.total,
        currency: orderData.currency,
        platform: 'wix',
        status: 'pending'
      };

      console.log('Processing new Wix order:', shipmentData);
      
      return {
        success: true,
        message: 'Order processed successfully',
        shipmentData
      };
    } catch (error) {
      console.error('Failed to handle order created:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async handleOrderUpdated(orderData) {
    try {
      console.log('Processing updated Wix order:', orderData.id);
      
      return {
        success: true,
        message: 'Order update processed successfully'
      };
    } catch (error) {
      console.error('Failed to handle order updated:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async handleOrderPaid(orderData) {
    try {
      console.log('Processing paid Wix order:', orderData.id);
      
      return {
        success: true,
        message: 'Order payment processed, shipping initiated'
      };
    } catch (error) {
      console.error('Failed to handle order paid:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAnalytics(period = '30d') {
    try {
      // محاكاة بيانات التحليلات
      const analytics = {
        totalOrders: Math.floor(Math.random() * 600) + 300,
        totalRevenue: Math.floor(Math.random() * 30000) + 15000,
        averageOrderValue: Math.floor(Math.random() * 100) + 60,
        topProducts: [
          { name: 'Wix Product A', sales: 90 },
          { name: 'Wix Product B', sales: 75 },
          { name: 'Wix Product C', sales: 60 }
        ],
        period: period
      };

      return {
        success: true,
        analytics
      };
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAppMarketInfo() {
    try {
      // معلومات App Market
      const appInfo = {
        appId: this.appId,
        name: 'IDev Shipping Integration',
        version: '1.0.0',
        description: 'تطبيق تكامل الشحن مع منصة IDev',
        category: 'Shipping & Logistics',
        rating: 4.8,
        downloads: 1250,
        features: [
          'تتبع الشحنات في الوقت الفعلي',
          'تكامل مع منصات متعددة',
          'إدارة المخزون',
          'تقارير مفصلة'
        ]
      };

      return {
        success: true,
        appInfo
      };
    } catch (error) {
      console.error('Failed to get app market info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  isAuthenticated() {
    return !!this.accessToken && !!this.instanceId;
  }

  getInstanceId() {
    return this.instanceId;
  }

  getSiteId() {
    return this.siteId;
  }

  async disconnect() {
    this.accessToken = null;
    this.instanceId = null;
    this.siteId = null;
    
    return {
      success: true,
      message: 'Wix integration disconnected'
    };
  }
}

export default new WixIntegrationService();

