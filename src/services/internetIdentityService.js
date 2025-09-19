// خدمة تكامل Internet Identity للـ ICP
class InternetIdentityService {
  constructor() {
    this.isInitialized = false;
    this.identity = null;
    this.principal = null;
  }

  async init() {
    try {
      // تحميل مكتبة Internet Identity
      if (typeof window !== 'undefined' && !window.InternetIdentity) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@dfinity/identity@latest/dist/index.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }
      
      this.isInitialized = true;
      console.log('Internet Identity service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Internet Identity service:', error);
      throw error;
    }
  }

  async authenticateWithInternetIdentity() {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      // إنشاء مصادقة Internet Identity
      const authClient = await window.InternetIdentity.create({
        providerUrl: 'https://identity.ic0.app',
        windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=600,left=100,top=100'
      });

      // طلب المصادقة
      await authClient.login({
        onSuccess: () => {
          console.log('Internet Identity authentication successful');
        },
        onError: (error) => {
          console.error('Internet Identity authentication failed:', error);
        }
      });

      // الحصول على الهوية والمبدأ
      this.identity = authClient.getIdentity();
      this.principal = this.identity.getPrincipal();

      return {
        success: true,
        principal: this.principal.toString(),
        identity: this.identity,
        verificationLevel: 'internet_identity'
      };
    } catch (error) {
      console.error('Internet Identity authentication error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPrincipal() {
    if (this.principal) {
      return this.principal.toString();
    }
    return null;
  }

  async signMessage(message) {
    if (!this.identity) {
      throw new Error('No identity available. Please authenticate first.');
    }

    try {
      const messageBytes = new TextEncoder().encode(message);
      const signature = await this.identity.sign(messageBytes);
      
      return {
        success: true,
        signature: Array.from(signature),
        message: message
      };
    } catch (error) {
      console.error('Failed to sign message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async logout() {
    try {
      if (this.identity) {
        // إجراء تسجيل الخروج
        this.identity = null;
        this.principal = null;
        console.log('Internet Identity logout successful');
      }
      return { success: true };
    } catch (error) {
      console.error('Internet Identity logout error:', error);
      return { success: false, error: error.message };
    }
  }

  async checkAuthenticationStatus() {
    try {
      // التحقق من حالة المصادقة الحالية
      if (this.identity && this.principal) {
        return {
          authenticated: true,
          principal: this.principal.toString(),
          verificationLevel: 'internet_identity'
        };
      }
      
      return {
        authenticated: false,
        verificationLevel: 'none'
      };
    } catch (error) {
      console.error('Failed to check authentication status:', error);
      return {
        authenticated: false,
        error: error.message
      };
    }
  }
}

export default new InternetIdentityService();
