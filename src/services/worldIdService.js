// خدمة تكامل World ID للمصادقة المتقدمة
class WorldIdService {
  constructor() {
    this.isInitialized = false;
    
    // استخدام متغير بيئة Vite
    this.worldIdAppId = 
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WORLD_ID_APP_ID) ||
      window.VITE_WORLD_ID_APP_ID ||
      'app_staging_1234567890abcdef'; // القيمة الافتراضية
  }

  async init() {
    try {
      // تحميل مكتبة World ID
      if (typeof window !== 'undefined' && !window.WorldID) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@worldcoin/id@latest/dist/index.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }
      
      this.isInitialized = true;
      console.log('World ID service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize World ID service:', error);
      throw error;
    }
  }

  async verifyWithWorldId(action = 'login') {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const result = await window.WorldID.verify({
        app_id: this.worldIdAppId,
        action: action,
        signal: this.generateSignal(),
      });

      return {
        success: true,
        nullifier_hash: result.nullifier_hash,
        merkle_root: result.merkle_root,
        proof: result.proof,
        verification_level: 'orb' // مستوى التحقق المتقدم
      };
    } catch (error) {
      console.error('World ID verification failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateSignal() {
    // إنشاء إشارة فريدة للتحقق
    return btoa(JSON.stringify({
      timestamp: Date.now(),
      random: Math.random().toString(36).substring(7),
      userAgent: navigator.userAgent
    }));
  }

  async checkVerificationStatus(nullifierHash) {
    try {
      // التحقق من حالة التحقق في قاعدة البيانات
      const response = await fetch('/api/verify-world-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nullifier_hash: nullifierHash })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to check verification status:', error);
      return { verified: false, error: error.message };
    }
  }
}

// إنشاء نسخة واحدة من الخدمة
const worldIdService = new WorldIdService();
export default worldIdService;