// خدمة التتبع الذكي والشامل
class SmartTrackingService {
  constructor() {
    this.isInitialized = false;
    this.trackingInterval = 5000; // تحديث كل 5 ثواني
    this.activeTrackings = new Map();
    this.notificationService = null;
    this.nftService = null;
    this.gpsService = null;
    this.trackingHistory = [];
    this.notificationSettings = {
      enabled: true,
      types: {
        locationUpdate: true,
        statusChange: true,
        deliveryAlert: true,
        delayWarning: true,
        nftMint: true
      },
      channels: {
        push: true,
        email: true,
        sms: true,
        webhook: true
      }
    };
  }

  async init() {
    try {
      // تهيئة الخدمات المساعدة
      this.notificationService = new NotificationService();
      this.nftService = new NFTShipmentService();
      this.gpsService = new GPSTrackingService();
      
      await Promise.all([
        this.notificationService.init(),
        this.nftService.init(),
        this.gpsService.init()
      ]);
      
      this.isInitialized = true;
      console.log('Smart Tracking service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Smart Tracking service:', error);
      throw error;
    }
  }

  async startTracking(shipmentId, trackingData) {
    try {
      if (this.activeTrackings.has(shipmentId)) {
        throw new Error(`Shipment ${shipmentId} is already being tracked`);
      }

      const trackingInfo = {
        shipmentId,
        ...trackingData,
        startTime: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        status: 'tracking',
        location: {
          lat: trackingData.initialLat || 0,
          lng: trackingData.initialLng || 0,
          address: trackingData.initialAddress || '',
          accuracy: 0
        },
        route: [],
        notifications: [],
        nftMetadata: null
      };

      // بدء التتبع
      this.activeTrackings.set(shipmentId, trackingInfo);
      
      // بدء تحديث الموقع كل 5 ثواني
      const trackingInterval = setInterval(async () => {
        await this.updateLocation(shipmentId);
      }, this.trackingInterval);

      trackingInfo.intervalId = trackingInterval;

      // إرسال إشعار بدء التتبع
      await this.sendNotification(shipmentId, {
        type: 'tracking_started',
        message: `تم بدء تتبع الشحنة ${shipmentId}`,
        data: trackingInfo
      });

      return {
        success: true,
        shipmentId,
        trackingInfo,
        message: 'تم بدء التتبع بنجاح'
      };
    } catch (error) {
      console.error('Failed to start tracking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateLocation(shipmentId) {
    try {
      const trackingInfo = this.activeTrackings.get(shipmentId);
      if (!trackingInfo) {
        return;
      }

      // الحصول على الموقع الحالي
      const location = await this.gpsService.getCurrentLocation();
      
      if (location.success) {
        const newLocation = {
          lat: location.lat,
          lng: location.lng,
          address: location.address,
          accuracy: location.accuracy,
          timestamp: new Date().toISOString()
        };

        // تحديث معلومات التتبع
        trackingInfo.location = newLocation;
        trackingInfo.lastUpdate = new Date().toISOString();
        trackingInfo.route.push(newLocation);

        // حفظ في السجل
        this.trackingHistory.push({
          shipmentId,
          location: newLocation,
          timestamp: new Date().toISOString()
        });

        // إرسال إشعار تحديث الموقع
        await this.sendNotification(shipmentId, {
          type: 'location_update',
          message: `تم تحديث موقع الشحنة ${shipmentId}`,
          data: {
            location: newLocation,
            shipmentId
          }
        });

        // التحقق من الوصول إلى نقاط مهمة
        await this.checkMilestones(shipmentId, newLocation);
      }
    } catch (error) {
      console.error(`Failed to update location for ${shipmentId}:`, error);
    }
  }

  async checkMilestones(shipmentId, location) {
    try {
      const trackingInfo = this.activeTrackings.get(shipmentId);
      if (!trackingInfo) return;

      const milestones = trackingInfo.milestones || [];
      
      for (const milestone of milestones) {
        const distance = this.calculateDistance(
          location.lat, location.lng,
          milestone.lat, milestone.lng
        );

        if (distance < 0.1 && !milestone.reached) { // 100 متر
          milestone.reached = true;
          milestone.reachedAt = new Date().toISOString();

          // إرسال إشعار الوصول للنقطة المهمة
          await this.sendNotification(shipmentId, {
            type: 'milestone_reached',
            message: `تم الوصول إلى ${milestone.name}`,
            data: {
              milestone,
              location,
              shipmentId
            }
          });

          // إذا كانت نقطة التسليم، تحديث الحالة
          if (milestone.type === 'delivery') {
            await this.updateShipmentStatus(shipmentId, 'delivered');
          }
        }
      }
    } catch (error) {
      console.error(`Failed to check milestones for ${shipmentId}:`, error);
    }
  }

  async updateShipmentStatus(shipmentId, newStatus, additionalData = {}) {
    try {
      const trackingInfo = this.activeTrackings.get(shipmentId);
      if (!trackingInfo) {
        throw new Error(`Shipment ${shipmentId} not found`);
      }

      const oldStatus = trackingInfo.status;
      trackingInfo.status = newStatus;
      trackingInfo.statusHistory = trackingInfo.statusHistory || [];
      
      trackingInfo.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        data: additionalData
      });

      // إرسال إشعار تغيير الحالة
      await this.sendNotification(shipmentId, {
        type: 'status_change',
        message: `تم تغيير حالة الشحنة ${shipmentId} من ${oldStatus} إلى ${newStatus}`,
        data: {
          oldStatus,
          newStatus,
          shipmentId,
          ...additionalData
        }
      });

      // إذا تم التسليم، إنشاء NFT
      if (newStatus === 'delivered') {
        await this.createShipmentNFT(shipmentId);
      }

      return {
        success: true,
        shipmentId,
        oldStatus,
        newStatus,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Failed to update status for ${shipmentId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createShipmentNFT(shipmentId) {
    try {
      const trackingInfo = this.activeTrackings.get(shipmentId);
      if (!trackingInfo) {
        throw new Error(`Shipment ${shipmentId} not found`);
      }

      // إنشاء metadata للـ NFT
      const nftMetadata = {
        name: `Shipment NFT #${shipmentId}`,
        description: `NFT representing shipment ${shipmentId} with complete tracking history`,
        image: await this.generateShipmentImage(trackingInfo),
        attributes: [
          {
            trait_type: "Shipment ID",
            value: shipmentId
          },
          {
            trait_type: "Status",
            value: trackingInfo.status
          },
          {
            trait_type: "Distance Traveled",
            value: this.calculateTotalDistance(trackingInfo.route)
          },
          {
            trait_type: "Duration",
            value: this.calculateDuration(trackingInfo.startTime, trackingInfo.lastUpdate)
          },
          {
            trait_type: "Route Points",
            value: trackingInfo.route.length
          },
          {
            trait_type: "Delivery Date",
            value: new Date().toISOString()
          }
        ],
        properties: {
          shipmentId,
          trackingData: trackingInfo,
          route: trackingInfo.route,
          statusHistory: trackingInfo.statusHistory
        }
      };

      // إنشاء NFT
      const nftResult = await this.nftService.createShipmentNFT(shipmentId, nftMetadata);
      
      if (nftResult.success) {
        trackingInfo.nftMetadata = nftResult.nft;
        
        // إرسال إشعار إنشاء NFT
        await this.sendNotification(shipmentId, {
          type: 'nft_mint',
          message: `تم إنشاء NFT للشحنة ${shipmentId}`,
          data: {
            nft: nftResult.nft,
            shipmentId
          }
        });

        return {
          success: true,
          nft: nftResult.nft,
          metadata: nftMetadata
        };
      } else {
        throw new Error('Failed to create NFT');
      }
    } catch (error) {
      console.error(`Failed to create NFT for ${shipmentId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateShipmentImage(trackingInfo) {
    try {
      // إنشاء صورة SVG للشحنة
      const svg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#grad1)"/>
          <text x="200" y="50" text-anchor="middle" fill="white" font-size="24" font-family="Arial">
            Shipment NFT
          </text>
          <text x="200" y="80" text-anchor="middle" fill="white" font-size="16" font-family="Arial">
            ID: ${trackingInfo.shipmentId}
          </text>
          <text x="200" y="120" text-anchor="middle" fill="white" font-size="14" font-family="Arial">
            Status: ${trackingInfo.status}
          </text>
          <text x="200" y="140" text-anchor="middle" fill="white" font-size="14" font-family="Arial">
            Route Points: ${trackingInfo.route.length}
          </text>
          <text x="200" y="160" text-anchor="middle" fill="white" font-size="14" font-family="Arial">
            Distance: ${this.calculateTotalDistance(trackingInfo.route).toFixed(2)} km
          </text>
          <text x="200" y="200" text-anchor="middle" fill="white" font-size="12" font-family="Arial">
            Generated by IDev Smart Tracking System
          </text>
        </svg>
      `;

      // تحويل SVG إلى base64
      const base64 = btoa(svg);
      return `data:image/svg+xml;base64,${base64}`;
    } catch (error) {
      console.error('Failed to generate shipment image:', error);
      return null;
    }
  }

  async sendNotification(shipmentId, notificationData) {
    try {
      if (!this.notificationSettings.enabled) return;

      const trackingInfo = this.activeTrackings.get(shipmentId);
      if (!trackingInfo) return;

      // إضافة الإشعار إلى قائمة الإشعارات
      trackingInfo.notifications.push({
        ...notificationData,
        timestamp: new Date().toISOString()
      });

      // إرسال الإشعار عبر جميع القنوات المحددة
      const promises = [];

      if (this.notificationSettings.channels.push) {
        promises.push(this.notificationService.sendPushNotification(shipmentId, notificationData));
      }

      if (this.notificationSettings.channels.email) {
        promises.push(this.notificationService.sendEmailNotification(shipmentId, notificationData));
      }

      if (this.notificationSettings.channels.sms) {
        promises.push(this.notificationService.sendSMSNotification(shipmentId, notificationData));
      }

      if (this.notificationSettings.channels.webhook) {
        promises.push(this.notificationService.sendWebhookNotification(shipmentId, notificationData));
      }

      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  async stopTracking(shipmentId) {
    try {
      const trackingInfo = this.activeTrackings.get(shipmentId);
      if (!trackingInfo) {
        throw new Error(`Shipment ${shipmentId} not found`);
      }

      // إيقاف التحديث التلقائي
      if (trackingInfo.intervalId) {
        clearInterval(trackingInfo.intervalId);
      }

      // تحديث الحالة النهائية
      trackingInfo.status = 'stopped';
      trackingInfo.endTime = new Date().toISOString();

      // إرسال إشعار إيقاف التتبع
      await this.sendNotification(shipmentId, {
        type: 'tracking_stopped',
        message: `تم إيقاف تتبع الشحنة ${shipmentId}`,
        data: trackingInfo
      });

      // نقل إلى الأرشيف
      this.activeTrackings.delete(shipmentId);

      return {
        success: true,
        shipmentId,
        finalTrackingInfo: trackingInfo
      };
    } catch (error) {
      console.error(`Failed to stop tracking for ${shipmentId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTrackingInfo(shipmentId) {
    try {
      const trackingInfo = this.activeTrackings.get(shipmentId);
      if (!trackingInfo) {
        throw new Error(`Shipment ${shipmentId} not found`);
      }

      return {
        success: true,
        trackingInfo
      };
    } catch (error) {
      console.error(`Failed to get tracking info for ${shipmentId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAllActiveTrackings() {
    try {
      const trackings = Array.from(this.activeTrackings.values());
      return {
        success: true,
        trackings,
        count: trackings.length
      };
    } catch (error) {
      console.error('Failed to get active trackings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTrackingHistory(shipmentId) {
    try {
      const history = this.trackingHistory.filter(entry => entry.shipmentId === shipmentId);
      return {
        success: true,
        history
      };
    } catch (error) {
      console.error(`Failed to get tracking history for ${shipmentId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  calculateTotalDistance(route) {
    if (route.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < route.length; i++) {
      totalDistance += this.calculateDistance(
        route[i - 1].lat, route[i - 1].lng,
        route[i].lat, route[i].lng
      );
    }
    return totalDistance;
  }

  calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  updateNotificationSettings(settings) {
    this.notificationSettings = { ...this.notificationSettings, ...settings };
  }

  getNotificationSettings() {
    return this.notificationSettings;
  }
}

// خدمة الإشعارات المتقدمة
class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.pushSubscriptions = new Map();
    this.emailTemplates = new Map();
    this.smsProvider = null;
    this.webhookEndpoints = new Map();
  }

  async init() {
    try {
      // تهيئة خدمة الإشعارات
      await this.initializePushNotifications();
      await this.initializeEmailService();
      await this.initializeSMSService();
      await this.initializeWebhookService();
      
      this.isInitialized = true;
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      throw error;
    }
  }

  async initializePushNotifications() {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Push notifications initialized');
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  async initializeEmailService() {
    try {
      // تهيئة خدمة البريد الإلكتروني
      console.log('Email service initialized');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  async initializeSMSService() {
    try {
      // تهيئة خدمة الرسائل النصية
      console.log('SMS service initialized');
    } catch (error) {
      console.error('Failed to initialize SMS service:', error);
    }
  }

  async initializeWebhookService() {
    try {
      // تهيئة خدمة Webhooks
      console.log('Webhook service initialized');
    } catch (error) {
      console.error('Failed to initialize webhook service:', error);
    }
  }

  async sendPushNotification(shipmentId, notificationData) {
    try {
      // إرسال إشعار push
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(notificationData.message, {
          body: `Shipment ID: ${shipmentId}`,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: shipmentId,
          data: notificationData.data
        });
      }
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  }

  async sendEmailNotification(shipmentId, notificationData) {
    try {
      // محاكاة إرسال بريد إلكتروني
      console.log(`Email notification sent for shipment ${shipmentId}:`, notificationData.message);
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  async sendSMSNotification(shipmentId, notificationData) {
    try {
      // محاكاة إرسال رسالة نصية
      console.log(`SMS notification sent for shipment ${shipmentId}:`, notificationData.message);
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    }
  }

  async sendWebhookNotification(shipmentId, notificationData) {
    try {
      // إرسال webhook
      const webhookUrl = this.webhookEndpoints.get(shipmentId);
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shipmentId,
            ...notificationData
          })
        });
      }
    } catch (error) {
      console.error('Failed to send webhook notification:', error);
    }
  }
}

// خدمة NFT للشحنات
class NFTShipmentService {
  constructor() {
    this.isInitialized = false;
    this.contractAddress = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || '0x...';
    this.contractABI = [
      {
        "inputs": [
          {"internalType": "address", "name": "to", "type": "address"},
          {"internalType": "string", "name": "uri", "type": "string"}
        ],
        "name": "mint",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
  }

  async init() {
    try {
      this.isInitialized = true;
      console.log('NFT Shipment service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NFT Shipment service:', error);
      throw error;
    }
  }

  async createShipmentNFT(shipmentId, metadata) {
    try {
      // محاكاة إنشاء NFT
      const nft = {
        id: `nft_${shipmentId}_${Date.now()}`,
        contractAddress: this.contractAddress,
        tokenId: Math.floor(Math.random() * 1000000),
        metadata,
        owner: '0x...', // عنوان المالك
        createdAt: new Date().toISOString(),
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`
      };

      return {
        success: true,
        nft
      };
    } catch (error) {
      console.error('Failed to create shipment NFT:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// خدمة GPS للتتبع
class GPSTrackingService {
  constructor() {
    this.isInitialized = false;
    this.watchId = null;
    this.currentLocation = null;
  }

  async init() {
    try {
      if ('geolocation' in navigator) {
        this.isInitialized = true;
        console.log('GPS Tracking service initialized successfully');
      } else {
        throw new Error('Geolocation not supported');
      }
    } catch (error) {
      console.error('Failed to initialize GPS Tracking service:', error);
      throw error;
    }
  }

  async getCurrentLocation() {
    try {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              address: 'Current Location', // يمكن تحسين هذا بالـ reverse geocoding
              timestamp: new Date().toISOString()
            };
            
            this.currentLocation = location;
            resolve({
              success: true,
              ...location
            });
          },
          (error) => {
            reject({
              success: false,
              error: error.message
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
          }
        );
      });
    } catch (error) {
      console.error('Failed to get current location:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async startWatching(callback) {
    try {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            address: 'Current Location',
            timestamp: new Date().toISOString()
          };
          
          this.currentLocation = location;
          if (callback) callback(location);
        },
        (error) => {
          console.error('GPS watch error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );

      return {
        success: true,
        watchId: this.watchId
      };
    } catch (error) {
      console.error('Failed to start GPS watching:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  stopWatching() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}

export default new SmartTrackingService();

