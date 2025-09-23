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
      // إنشاء مصادقة Internet Identity مع إعدادات محسنة للتوجيه
      const authClient = await window.InternetIdentity.create({
        providerUrl: 'https://identity.ic0.app',
        windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=600,left=100,top=100',
        // إعدادات إضافية للتوجيه الصحيح
        derivationOrigin: window.location.origin,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000) // 7 أيام
      });

      // طلب المصادقة مع معالجة محسنة للتوجيه
      const result = await authClient.login({
        onSuccess: () => {
          console.log('Internet Identity authentication successful');
          // إعادة توجيه المستخدم إلى الصفحة الرئيسية بعد تسجيل الدخول الناجح
          this.handleSuccessfulLogin();
        },
        onError: (error) => {
          console.error('Internet Identity authentication failed:', error);
          this.handleLoginError(error);
        }
      });

      // الحصول على الهوية والمبدأ
      this.identity = authClient.getIdentity();
      this.principal = this.identity.getPrincipal();

      // حفظ بيانات المصادقة في localStorage للتوجيه الصحيح
      this.saveAuthenticationData();

      return {
        success: true,
        principal: this.principal.toString(),
        identity: this.identity,
        verificationLevel: 'internet_identity',
        redirectUrl: this.getRedirectUrl()
      };
    } catch (error) {
      console.error('Internet Identity authentication error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // معالجة تسجيل الدخول الناجح
  handleSuccessfulLogin() {
    try {
      // حفظ حالة تسجيل الدخول
      localStorage.setItem('icp_authenticated', 'true');
      localStorage.setItem('icp_principal', this.principal.toString());
      localStorage.setItem('icp_login_time', new Date().toISOString());

      // إعادة توجيه المستخدم إلى الصفحة الرئيسية أو لوحة التحكم
      const redirectUrl = this.getRedirectUrl();
      if (redirectUrl && redirectUrl !== window.location.href) {
        window.location.href = redirectUrl;
      } else {
        // إعادة تحميل الصفحة الحالية لتحديث حالة المصادقة
        window.location.reload();
      }
    } catch (error) {
      console.error('Error handling successful login:', error);
    }
  }

  // معالجة خطأ تسجيل الدخول
  handleLoginError(error) {
    try {
      // إزالة بيانات المصادقة المخزنة
      localStorage.removeItem('icp_authenticated');
      localStorage.removeItem('icp_principal');
      localStorage.removeItem('icp_login_time');

      // عرض رسالة خطأ للمستخدم
      this.showErrorMessage(error.message || 'فشل في تسجيل الدخول');
    } catch (err) {
      console.error('Error handling login error:', err);
    }
  }

  // حفظ بيانات المصادقة
  saveAuthenticationData() {
    try {
      const authData = {
        principal: this.principal.toString(),
        loginTime: new Date().toISOString(),
        verificationLevel: 'internet_identity',
        canisterId: '93343-A7BDB-4F45F'
      };
      
      localStorage.setItem('icp_auth_data', JSON.stringify(authData));
    } catch (error) {
      console.error('Error saving authentication data:', error);
    }
  }

  // الحصول على URL التوجيه المناسب
  getRedirectUrl() {
    try {
      // التحقق من وجود URL توجيه محدد في localStorage
      const storedRedirect = localStorage.getItem('icp_redirect_url');
      if (storedRedirect) {
        localStorage.removeItem('icp_redirect_url');
        return storedRedirect;
      }

      // التوجيه الافتراضي بناءً على نوع المستخدم
      const userType = localStorage.getItem('user_type') || 'customer';
      
      switch (userType) {
        case 'admin':
          return '/admin-dashboard';
        case 'driver':
          return '/driver-dashboard';
        case 'store':
          return '/store-dashboard';
        default:
          return '/dashboard';
      }
    } catch (error) {
      console.error('Error getting redirect URL:', error);
      return '/dashboard';
    }
  }

  // عرض رسالة خطأ
  showErrorMessage(message) {
    try {
      // إنشاء عنصر رسالة خطأ
      const errorDiv = document.createElement('div');
      errorDiv.className = 'icp-error-message';
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        font-family: Arial, sans-serif;
      `;
      errorDiv.textContent = message;

      // إضافة الرسالة إلى الصفحة
      document.body.appendChild(errorDiv);

      // إزالة الرسالة بعد 5 ثوان
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 5000);
    } catch (error) {
      console.error('Error showing error message:', error);
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

      // التحقق من البيانات المخزنة في localStorage
      const storedAuth = localStorage.getItem('icp_auth_data');
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          const loginTime = new Date(authData.loginTime);
          const now = new Date();
          const daysDiff = (now - loginTime) / (1000 * 60 * 60 * 24);

          // التحقق من انتهاء صلاحية الجلسة (7 أيام)
          if (daysDiff < 7) {
            return {
              authenticated: true,
              principal: authData.principal,
              verificationLevel: authData.verificationLevel,
              fromStorage: true
            };
          } else {
            // إزالة البيانات المنتهية الصلاحية
            localStorage.removeItem('icp_auth_data');
            localStorage.removeItem('icp_authenticated');
            localStorage.removeItem('icp_principal');
            localStorage.removeItem('icp_login_time');
          }
        } catch (parseError) {
          console.error('Error parsing stored auth data:', parseError);
          localStorage.removeItem('icp_auth_data');
        }
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

  // استعادة حالة المصادقة من localStorage
  async restoreAuthenticationState() {
    try {
      const authStatus = await this.checkAuthenticationStatus();
      
      if (authStatus.authenticated && authStatus.fromStorage) {
        // استعادة البيانات المخزنة
        this.principal = authStatus.principal;
        
        // إعادة توجيه المستخدم إذا لزم الأمر
        const currentPath = window.location.pathname;
        const expectedPath = this.getRedirectUrl();
        
        if (currentPath === '/' || currentPath === '/login') {
          window.location.href = expectedPath;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error restoring authentication state:', error);
      return false;
    }
  }

  // تعيين URL التوجيه المخصص
  setRedirectUrl(url) {
    try {
      localStorage.setItem('icp_redirect_url', url);
    } catch (error) {
      console.error('Error setting redirect URL:', error);
    }
  }

  // تعيين نوع المستخدم للتوجيه المناسب
  setUserType(userType) {
    try {
      localStorage.setItem('user_type', userType);
    } catch (error) {
      console.error('Error setting user type:', error);
    }
  }
}

export default new InternetIdentityService();
