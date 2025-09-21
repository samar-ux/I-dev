// خدمة التكامل مع منصة إيزي أوردر العربية
class EasyOrderIntegrationService {
  constructor() {
    this.isInitialized = false;
    this.apiKey = import.meta.env.VITE_EASYORDER_API_KEY || 'demo_key';
    this.apiSecret = import.meta.env.VITE_EASYORDER_API_SECRET || 'demo_secret';
    this.baseUrl = import.meta.env.VITE_EASYORDER_BASE_URL || 'https://api.easyorder.sa';
    this.accessToken = null;
    this.merchantId = null;
    this.isAuthenticated = false;
  }

  async init() {
    try {
      this.isInitialized = true;
      console.log('EasyOrder integration service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EasyOrder integration service:', error);
      throw error;
    }
  }

  async authenticate(merchantId, apiKey, apiSecret) {
    try {
      this.merchantId = merchantId;
      this.apiKey = apiKey;
      this.apiSecret = apiSecret;
      
      // الحصول على access token
      const tokenResult = await this.getAccessToken();
      
      if (tokenResult.success) {
        this.accessToken = tokenResult.accessToken;
        this.isAuthenticated = true;
        
        return {
          success: true,
          message: 'EasyOrder authentication successful',
          merchantId: this.merchantId
        };
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error('EasyOrder authentication failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAccessToken() {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.apiKey}:${this.apiSecret}`)}`
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          merchant_id: this.merchantId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        accessToken: data.access_token,
        expiresIn: data.expires_in
      };
    } catch (error) {
      console.error('Failed to get access token:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getMerchantInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/v1/merchant`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        merchant: data.merchant
      };
    } catch (error) {
      console.error('Failed to get merchant info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getOrders(limit = 50, status = 'all') {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        status: status,
        merchant_id: this.merchantId
      });

      const response = await fetch(`${this.baseUrl}/v1/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
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
          'Authorization': `Bearer ${this.accessToken}`,
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

  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: status,
          notes: notes,
          updated_at: new Date().toISOString()
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

  async createShipment(orderId, shipmentData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}/shipments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shipment: {
            ...shipmentData,
            merchant_id: this.merchantId,
            created_at: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        shipment: data.shipment
      };
    } catch (error) {
      console.error('Failed to create shipment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateShipmentTracking(orderId, shipmentId, trackingData) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/orders/${orderId}/shipments/${shipmentId}/tracking`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tracking: {
            ...trackingData,
            updated_at: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        shipment: data.shipment
      };
    } catch (error) {
      console.error('Failed to update shipment tracking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProducts(limit = 50) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        merchant_id: this.merchantId
      });

      const response = await fetch(`${this.baseUrl}/v1/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
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
        limit: limit.toString(),
        merchant_id: this.merchantId
      });

      const response = await fetch(`${this.baseUrl}/v1/customers?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
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

  async createShippingLabel(orderId, shippingData) {
    try {
      const shipmentData = {
        carrier: shippingData.carrier || 'IDev Shipping',
        service_type: shippingData.serviceType || 'standard',
        tracking_number: shippingData.trackingNumber,
        tracking_url: shippingData.trackingUrl,
        estimated_delivery: shippingData.estimatedDelivery,
        weight: shippingData.weight,
        dimensions: shippingData.dimensions,
        shipping_address: shippingData.shippingAddress,
        billing_address: shippingData.billingAddress
      };

      const result = await this.createShipment(orderId, shipmentData);
      
      if (result.success) {
        // تحديث حالة الطلب إلى "تم الشحن"
        await this.updateOrderStatus(orderId, 'shipped', `تم إنشاء تتبع الشحنة: ${shippingData.trackingNumber}`);
        
        return {
          success: true,
          shipment: result.shipment,
          trackingNumber: shippingData.trackingNumber
        };
      } else {
        throw new Error('Failed to create shipment');
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
        'pending': 'قيد الانتظار',
        'processing': 'قيد المعالجة',
        'shipped': 'تم الشحن',
        'delivered': 'تم التسليم',
        'cancelled': 'ملغي'
      };

      const arabicStatus = statusMap[status] || status;
      
      const result = await this.updateOrderStatus(orderId, arabicStatus, 
        trackingNumber ? `رقم التتبع: ${trackingNumber}` : ''
      );

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
          event: 'order.created',
          url: `${window.location.origin}/api/webhooks/easyorder/order-created`,
          secret: process.env.REACT_APP_EASYORDER_WEBHOOK_SECRET || 'demo_secret'
        },
        {
          event: 'order.updated',
          url: `${window.location.origin}/api/webhooks/easyorder/order-updated`,
          secret: process.env.REACT_APP_EASYORDER_WEBHOOK_SECRET || 'demo_secret'
        },
        {
          event: 'order.paid',
          url: `${window.location.origin}/api/webhooks/easyorder/order-paid`,
          secret: process.env.REACT_APP_EASYORDER_WEBHOOK_SECRET || 'demo_secret'
        },
        {
          event: 'order.cancelled',
          url: `${window.location.origin}/api/webhooks/easyorder/order-cancelled`,
          secret: process.env.REACT_APP_EASYORDER_WEBHOOK_SECRET || 'demo_secret'
        }
      ];

      const results = [];
      
      for (const webhook of webhooks) {
        try {
          const response = await fetch(`${this.baseUrl}/v1/webhooks`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              webhook: {
                ...webhook,
                merchant_id: this.merchantId
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            results.push({
              event: webhook.event,
              success: true,
              webhookId: data.webhook.id
            });
          } else {
            results.push({
              event: webhook.event,
              success: false,
              error: `HTTP ${response.status}`
            });
          }
        } catch (error) {
          results.push({
            event: webhook.event,
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

  async processWebhook(webhookData, event) {
    try {
      switch (event) {
        case 'order.created':
          return await this.handleOrderCreated(webhookData);
        case 'order.updated':
          return await this.handleOrderUpdated(webhookData);
        case 'order.paid':
          return await this.handleOrderPaid(webhookData);
        case 'order.cancelled':
          return await this.handleOrderCancelled(webhookData);
        default:
          return {
            success: false,
            error: `Unknown webhook event: ${event}`
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
        customerName: `${orderData.customer.first_name} ${orderData.customer.last_name}`,
        customerEmail: orderData.customer.email,
        customerPhone: orderData.customer.phone,
        shippingAddress: orderData.shipping_address,
        items: orderData.items,
        totalPrice: orderData.total_amount,
        currency: orderData.currency || 'SAR',
        platform: 'easyorder',
        status: 'قيد الانتظار',
        orderDate: orderData.created_at
      };

      console.log('Processing new EasyOrder order:', shipmentData);
      
      return {
        success: true,
        message: 'تم معالجة الطلب بنجاح',
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
      console.log('Processing updated EasyOrder order:', orderData.id);
      
      return {
        success: true,
        message: 'تم معالجة تحديث الطلب بنجاح'
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
      console.log('Processing paid EasyOrder order:', orderData.id);
      
      return {
        success: true,
        message: 'تم معالجة الدفع، بدء عملية الشحن'
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
      console.log('Processing cancelled EasyOrder order:', orderData.id);
      
      return {
        success: true,
        message: 'تم معالجة إلغاء الطلب'
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
        totalOrders: Math.floor(Math.random() * 400) + 200,
        totalRevenue: Math.floor(Math.random() * 25000) + 12000,
        averageOrderValue: Math.floor(Math.random() * 80) + 50,
        topProducts: [
          { name: 'منتج إيزي أوردر أ', sales: 60 },
          { name: 'منتج إيزي أوردر ب', sales: 45 },
          { name: 'منتج إيزي أوردر ج', sales: 35 }
        ],
        period: period,
        currency: 'SAR'
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

  async getPlatformInfo() {
    try {
      const platformInfo = {
        name: 'إيزي أوردر',
        description: 'منصة التجارة الإلكترونية العربية الرائدة',
        country: 'المملكة العربية السعودية',
        language: 'العربية',
        currency: 'SAR',
        features: [
          'دعم اللغة العربية الكامل',
          'تكامل مع البنوك المحلية',
          'شحن محلي ودولي',
          'دعم العملات المحلية',
          'واجهة عربية سهلة الاستخدام'
        ],
        supportedRegions: [
          'المملكة العربية السعودية',
          'دولة الإمارات العربية المتحدة',
          'دولة الكويت',
          'دولة قطر',
          'مملكة البحرين'
        ]
      };

      return {
        success: true,
        platformInfo
      };
    } catch (error) {
      console.error('Failed to get platform info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  isAuthenticated() {
    return this.isAuthenticated && !!this.accessToken && !!this.merchantId;
  }

  getMerchantId() {
    return this.merchantId;
  }

  async disconnect() {
    this.accessToken = null;
    this.merchantId = null;
    this.isAuthenticated = false;
    
    return {
      success: true,
      message: 'تم قطع الاتصال مع إيزي أوردر'
    };
  }
}

export default new EasyOrderIntegrationService();

