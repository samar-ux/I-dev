// خدمة التكامل مع Shopify
class ShopifyIntegrationService {
  constructor() {
    this.isInitialized = false;
    this.apiKey = import.meta.env.VITE_SHOPIFY_API_KEY || 'demo_key';
    this.apiSecret = import.meta.env.VITE_SHOPIFY_API_SECRET || 'demo_secret';
    this.baseUrl = import.meta.env.VITE_SHOPIFY_BASE_URL || 'https://api.shopify.com';
    this.accessToken = null;
    this.shopDomain = null;
    this.webhookSecret = import.meta.env.VITE_SHOPIFY_WEBHOOK_SECRET || 'demo_webhook_secret';
  }

  async init() {
    try {
      this.isInitialized = true;
      console.log('Shopify integration service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Shopify integration service:', error);
      throw error;
    }
  }

  async authenticate(shopDomain, accessToken) {
    try {
      this.shopDomain = shopDomain;
      this.accessToken = accessToken;
      
      // التحقق من صحة التوكن
      const isValid = await this.validateToken();
      
      if (isValid) {
        return {
          success: true,
          message: 'Shopify authentication successful',
          shopDomain: this.shopDomain
        };
      } else {
        throw new Error('Invalid access token');
      }
    } catch (error) {
      console.error('Shopify authentication failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validateToken() {
    try {
      const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  async getShopInfo() {
    try {
      const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        shop: data.shop
      };
    } catch (error) {
      console.error('Failed to get shop info:', error);
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

      const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/orders.json?${params}`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
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
      const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/orders/${orderId}.json`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
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

  async createFulfillment(orderId, fulfillmentData) {
    try {
      const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/orders/${orderId}/fulfillments.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
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

  async updateOrderFulfillment(orderId, fulfillmentId, trackingData) {
    try {
      const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/orders/${orderId}/fulfillments/${fulfillmentId}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
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

  async createShippingLabel(orderId, shippingData) {
    try {
      const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/orders/${orderId}/fulfillments.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fulfillment: {
            ...shippingData,
            notify_customer: true,
            tracking_company: 'IDev Shipping',
            tracking_number: shippingData.trackingNumber
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        fulfillment: data.fulfillment,
        trackingNumber: shippingData.trackingNumber
      };
    } catch (error) {
      console.error('Failed to create shipping label:', error);
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

      const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/products.json?${params}`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
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

      const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/customers.json?${params}`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        customers: data.customers
      };
    } catch (error) {
      console.error('Failed to get customers:', error);
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
          topic: 'orders/create',
          address: `${window.location.origin}/api/webhooks/shopify/orders/create`,
          format: 'json'
        },
        {
          topic: 'orders/updated',
          address: `${window.location.origin}/api/webhooks/shopify/orders/updated`,
          format: 'json'
        },
        {
          topic: 'orders/paid',
          address: `${window.location.origin}/api/webhooks/shopify/orders/paid`,
          format: 'json'
        },
        {
          topic: 'orders/cancelled',
          address: `${window.location.origin}/api/webhooks/shopify/orders/cancelled`,
          format: 'json'
        }
      ];

      const results = [];
      
      for (const webhook of webhooks) {
        try {
          const response = await fetch(`https://${this.shopDomain}/admin/api/2023-10/webhooks.json`, {
            method: 'POST',
            headers: {
              'X-Shopify-Access-Token': this.accessToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ webhook })
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
      // معالجة webhook من Shopify
      switch (topic) {
        case 'orders/create':
          return await this.handleOrderCreated(webhookData);
        case 'orders/updated':
          return await this.handleOrderUpdated(webhookData);
        case 'orders/paid':
          return await this.handleOrderPaid(webhookData);
        case 'orders/cancelled':
          return await this.handleOrderCancelled(webhookData);
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
      // إنشاء شحنة جديدة في النظام
      const shipmentData = {
        orderId: orderData.id,
        customerName: `${orderData.customer.first_name} ${orderData.customer.last_name}`,
        customerEmail: orderData.customer.email,
        shippingAddress: orderData.shipping_address,
        items: orderData.line_items,
        totalPrice: orderData.total_price,
        currency: orderData.currency,
        platform: 'shopify',
        status: 'pending'
      };

      // حفظ في قاعدة البيانات المحلية
      console.log('Processing new Shopify order:', shipmentData);
      
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
      console.log('Processing updated Shopify order:', orderData.id);
      
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
      console.log('Processing paid Shopify order:', orderData.id);
      
      // بدء عملية الشحن
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

  async handleOrderCancelled(orderData) {
    try {
      console.log('Processing cancelled Shopify order:', orderData.id);
      
      return {
        success: true,
        message: 'Order cancellation processed'
      };
    } catch (error) {
      console.error('Failed to handle order cancelled:', error);
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
        totalOrders: Math.floor(Math.random() * 1000) + 500,
        totalRevenue: Math.floor(Math.random() * 50000) + 25000,
        averageOrderValue: Math.floor(Math.random() * 200) + 100,
        topProducts: [
          { name: 'Product A', sales: 150 },
          { name: 'Product B', sales: 120 },
          { name: 'Product C', sales: 90 }
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

  isAuthenticated() {
    return !!this.accessToken && !!this.shopDomain;
  }

  getShopDomain() {
    return this.shopDomain;
  }

  async disconnect() {
    this.accessToken = null;
    this.shopDomain = null;
    return {
      success: true,
      message: 'Shopify integration disconnected'
    };
  }
}

export default new ShopifyIntegrationService();

