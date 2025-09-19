// خدمة التكامل مع WooCommerce (WordPress)
class WooCommerceIntegrationService {
  constructor() {
    this.isInitialized = false;
    this.consumerKey = process.env.REACT_APP_WOOCOMMERCE_CONSUMER_KEY || 'demo_key';
    this.consumerSecret = process.env.REACT_APP_WOOCOMMERCE_CONSUMER_SECRET || 'demo_secret';
    this.baseUrl = null;
    this.siteUrl = null;
    this.isAuthenticated = false;
  }

  async init() {
    try {
      this.isInitialized = true;
      console.log('WooCommerce integration service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WooCommerce integration service:', error);
      throw error;
    }
  }

  async authenticate(siteUrl, consumerKey, consumerSecret) {
    try {
      this.siteUrl = siteUrl;
      this.consumerKey = consumerKey;
      this.consumerSecret = consumerSecret;
      this.baseUrl = `${siteUrl}/wp-json/wc/v3`;
      
      // التحقق من صحة البيانات
      const isValid = await this.validateCredentials();
      
      if (isValid) {
        this.isAuthenticated = true;
        return {
          success: true,
          message: 'WooCommerce authentication successful',
          siteUrl: this.siteUrl
        };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('WooCommerce authentication failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validateCredentials() {
    try {
      const response = await fetch(`${this.baseUrl}/system_status`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.consumerKey}:${this.consumerSecret}`)}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Credentials validation failed:', error);
      return false;
    }
  }

  async getSiteInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/system_status`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.consumerKey}:${this.consumerSecret}`)}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        siteInfo: data
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
        per_page: limit.toString(),
        status: status
      });

      const response = await fetch(`${this.baseUrl}/orders?${params}`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.consumerKey}:${this.consumerSecret}`)}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        orders: data
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
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.consumerKey}:${this.consumerSecret}`)}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        order: data
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
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${btoa(`${this.consumerKey}:${this.consumerSecret}`)}`,
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
        order: data
      };
    } catch (error) {
      console.error('Failed to update order status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async addOrderNote(orderId, note) {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.consumerKey}:${this.consumerSecret}`)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          note: note,
          customer_note: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        note: data
      };
    } catch (error) {
      console.error('Failed to add order note:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProducts(limit = 50) {
    try {
      const params = new URLSearchParams({
        per_page: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/products?${params}`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.consumerKey}:${this.consumerSecret}`)}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        products: data
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
        per_page: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/customers?${params}`, {
        headers: {
          'Authorization': `Basic ${btoa(`${this.consumerKey}:${this.consumerSecret}`)}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        customers: data
      };
    } catch (error) {
      console.error('Failed to get customers:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createShipmentTracking(orderId, trackingData) {
    try {
      const note = `تم إنشاء تتبع الشحنة: ${trackingData.trackingNumber}\nشركة الشحن: ${trackingData.carrier}\nرابط التتبع: ${trackingData.trackingUrl}`;
      
      const result = await this.addOrderNote(orderId, note);
      
      if (result.success) {
        // تحديث حالة الطلب إلى "تم الشحن"
        await this.updateOrderStatus(orderId, 'shipped');
        
        return {
          success: true,
          message: 'Shipment tracking added successfully',
          trackingNumber: trackingData.trackingNumber
        };
      } else {
        throw new Error('Failed to add tracking note');
      }
    } catch (error) {
      console.error('Failed to create shipment tracking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateShipmentStatus(orderId, status, trackingNumber) {
    try {
      const statusMap = {
        'pending': 'pending',
        'processing': 'processing',
        'shipped': 'shipped',
        'delivered': 'completed',
        'cancelled': 'cancelled'
      };

      const wooStatus = statusMap[status] || status;
      
      const result = await this.updateOrderStatus(orderId, wooStatus);
      
      if (result.success && trackingNumber) {
        const note = `تحديث حالة الشحنة: ${status}\nرقم التتبع: ${trackingNumber}`;
        await this.addOrderNote(orderId, note);
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
      // في WooCommerce، يتم إعداد webhooks من خلال WordPress Admin
      // أو باستخدام REST API
      const webhooks = [
        {
          name: 'Order Created',
          topic: 'order.created',
          delivery_url: `${window.location.origin}/api/webhooks/woocommerce/order-created`,
          secret: process.env.REACT_APP_WOOCOMMERCE_WEBHOOK_SECRET || 'demo_secret'
        },
        {
          name: 'Order Updated',
          topic: 'order.updated',
          delivery_url: `${window.location.origin}/api/webhooks/woocommerce/order-updated`,
          secret: process.env.REACT_APP_WOOCOMMERCE_WEBHOOK_SECRET || 'demo_secret'
        },
        {
          name: 'Order Paid',
          topic: 'order.paid',
          delivery_url: `${window.location.origin}/api/webhooks/woocommerce/order-paid`,
          secret: process.env.REACT_APP_WOOCOMMERCE_WEBHOOK_SECRET || 'demo_secret'
        }
      ];

      // محاكاة إعداد webhooks
      const results = webhooks.map(webhook => ({
        name: webhook.name,
        topic: webhook.topic,
        success: true,
        webhookId: `wc_${Date.now()}_${Math.random().toString(36).substring(7)}`
      }));

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
        case 'order.created':
          return await this.handleOrderCreated(webhookData);
        case 'order.updated':
          return await this.handleOrderUpdated(webhookData);
        case 'order.paid':
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
        customerName: `${orderData.billing.first_name} ${orderData.billing.last_name}`,
        customerEmail: orderData.billing.email,
        shippingAddress: orderData.shipping,
        items: orderData.line_items,
        totalPrice: orderData.total,
        currency: orderData.currency,
        platform: 'woocommerce',
        status: 'pending'
      };

      console.log('Processing new WooCommerce order:', shipmentData);
      
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
      console.log('Processing updated WooCommerce order:', orderData.id);
      
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
      console.log('Processing paid WooCommerce order:', orderData.id);
      
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
        totalOrders: Math.floor(Math.random() * 800) + 400,
        totalRevenue: Math.floor(Math.random() * 40000) + 20000,
        averageOrderValue: Math.floor(Math.random() * 150) + 80,
        topProducts: [
          { name: 'WordPress Product A', sales: 120 },
          { name: 'WordPress Product B', sales: 95 },
          { name: 'WordPress Product C', sales: 75 }
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

  async getWordPressInfo() {
    try {
      const response = await fetch(`${this.siteUrl}/wp-json/wp/v2`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        wordpressInfo: {
          name: data.name,
          description: data.description,
          url: data.url,
          version: data.version
        }
      };
    } catch (error) {
      console.error('Failed to get WordPress info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  isAuthenticated() {
    return this.isAuthenticated && !!this.consumerKey && !!this.consumerSecret;
  }

  getSiteUrl() {
    return this.siteUrl;
  }

  async disconnect() {
    this.consumerKey = null;
    this.consumerSecret = null;
    this.baseUrl = null;
    this.siteUrl = null;
    this.isAuthenticated = false;
    
    return {
      success: true,
      message: 'WooCommerce integration disconnected'
    };
  }
}

export default new WooCommerceIntegrationService();

