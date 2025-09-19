import { ethers } from 'ethers';

class CryptoPaymentService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {
      ethereum: null,
      icp: null
    };
    this.isInitialized = false;
    this.supportedCurrencies = [
      { symbol: "BTC", name: "Bitcoin", contract: null, decimals: 8 },
      { symbol: "ETH", name: "Ethereum", contract: null, decimals: 18 },
      { symbol: "USDT", name: "Tether", contract: null, decimals: 6 },
      { symbol: "BNB", name: "Binance Coin", contract: null, decimals: 18 },
      { symbol: "ADA", name: "Cardano", contract: null, decimals: 18 },
      { symbol: "SOL", name: "Solana", contract: null, decimals: 9 },
      { symbol: "DOT", name: "Polkadot", contract: null, decimals: 10 },
      { symbol: "MATIC", name: "Polygon", contract: null, decimals: 18 }
    ];
  }

  async init() {
    try {
      // تهيئة مزود Ethereum
      if (window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
      }

      // عناوين العقود الذكية للمدفوعات
      this.contractAddresses = {
        ethereum: {
          paymentProcessor: '0x1234567890123456789012345678901234567890',
          invoiceManager: '0x2345678901234567890123456789012345678901',
          multiCurrencyWallet: '0x3456789012345678901234567890123456789012'
        },
        icp: {
          paymentProcessor: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
          invoiceManager: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
          multiCurrencyWallet: 'rdmx6-jaaaa-aaaah-qcaiq-cai'
        }
      };

      // ABI للعقود الذكية
      this.contractABIs = {
        paymentProcessor: [
          "function processPayment(address token, address recipient, uint256 amount, string memory invoiceId) public returns (bool)",
          "function getPaymentStatus(bytes32 paymentHash) public view returns (uint8)",
          "function refundPayment(bytes32 paymentHash) public returns (bool)",
          "function getSupportedTokens() public view returns (address[])",
          "event PaymentProcessed(bytes32 indexed paymentHash, address indexed payer, address indexed recipient, uint256 amount)",
          "event PaymentRefunded(bytes32 indexed paymentHash, address indexed recipient)"
        ],
        invoiceManager: [
          "function createInvoice(address customer, uint256 amount, address token, string memory description, uint256 dueDate) public returns (uint256)",
          "function getInvoice(uint256 invoiceId) public view returns (tuple(address customer, uint256 amount, address token, string description, uint256 dueDate, uint8 status, uint256 createdAt))",
          "function markInvoicePaid(uint256 invoiceId, bytes32 paymentHash) public",
          "function getInvoicesByCustomer(address customer) public view returns (uint256[])",
          "event InvoiceCreated(uint256 indexed invoiceId, address indexed customer)",
          "event InvoicePaid(uint256 indexed invoiceId, bytes32 indexed paymentHash)"
        ],
        multiCurrencyWallet: [
          "function deposit(address token, uint256 amount) public payable",
          "function withdraw(address token, uint256 amount) public",
          "function getBalance(address token, address user) public view returns (uint256)",
          "function transfer(address token, address to, uint256 amount) public returns (bool)",
          "event Deposit(address indexed user, address indexed token, uint256 amount)",
          "event Withdrawal(address indexed user, address indexed token, uint256 amount)"
        ]
      };

      this.isInitialized = true;
      console.log('Crypto Payment Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Crypto Payment Service:', error);
      throw error;
    }
  }

  // إدارة الفواتير
  async createInvoice(invoiceData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const invoiceContract = new ethers.Contract(
        this.contractAddresses.ethereum.invoiceManager,
        this.contractABIs.invoiceManager,
        this.signer
      );

      const { customer, amount, token, description, dueDate } = invoiceData;
      
      const tx = await invoiceContract.createInvoice(
        customer,
        ethers.parseUnits(amount.toString(), this.getTokenDecimals(token)),
        token,
        description,
        Math.floor(new Date(dueDate).getTime() / 1000)
      );

      const receipt = await tx.wait();
      
      // استخراج معرف الفاتورة من الحدث
      const event = receipt.logs.find(log => {
        try {
          const parsed = invoiceContract.interface.parseLog(log);
          return parsed.name === 'InvoiceCreated';
        } catch {
          return false;
        }
      });

      const invoiceId = event ? event.args.invoiceId.toString() : null;

      return {
        success: true,
        invoiceId,
        transactionHash: tx.hash,
        message: 'تم إنشاء الفاتورة بنجاح'
      };
    } catch (error) {
      console.error('Failed to create invoice:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getInvoice(invoiceId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const invoiceContract = new ethers.Contract(
        this.contractAddresses.ethereum.invoiceManager,
        this.contractABIs.invoiceManager,
        this.signer
      );

      const invoice = await invoiceContract.getInvoice(invoiceId);
      
      return {
        id: invoiceId,
        customer: invoice.customer,
        amount: ethers.formatUnits(invoice.amount, this.getTokenDecimals(invoice.token)),
        token: invoice.token,
        description: invoice.description,
        dueDate: new Date(Number(invoice.dueDate) * 1000).toISOString(),
        status: this.getInvoiceStatus(invoice.status),
        createdAt: new Date(Number(invoice.createdAt) * 1000).toISOString()
      };
    } catch (error) {
      console.error('Failed to get invoice:', error);
      throw error;
    }
  }

  async getInvoicesByCustomer(customerAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const invoiceContract = new ethers.Contract(
        this.contractAddresses.ethereum.invoiceManager,
        this.contractABIs.invoiceManager,
        this.signer
      );

      const invoiceIds = await invoiceContract.getInvoicesByCustomer(customerAddress);
      
      const invoices = await Promise.all(
        invoiceIds.map(id => this.getInvoice(id.toString()))
      );

      return invoices;
    } catch (error) {
      console.error('Failed to get invoices by customer:', error);
      throw error;
    }
  }

  // معالجة المدفوعات
  async processPayment(paymentData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const paymentContract = new ethers.Contract(
        this.contractAddresses.ethereum.paymentProcessor,
        this.contractABIs.paymentProcessor,
        this.signer
      );

      const { token, recipient, amount, invoiceId } = paymentData;
      
      const tx = await paymentContract.processPayment(
        token,
        recipient,
        ethers.parseUnits(amount.toString(), this.getTokenDecimals(token)),
        invoiceId
      );

      const receipt = await tx.wait();
      
      // استخراج معرف الدفعة من الحدث
      const event = receipt.logs.find(log => {
        try {
          const parsed = paymentContract.interface.parseLog(log);
          return parsed.name === 'PaymentProcessed';
        } catch {
          return false;
        }
      });

      const paymentHash = event ? event.args.paymentHash : null;

      return {
        success: true,
        paymentHash,
        transactionHash: tx.hash,
        message: 'تم معالجة الدفعة بنجاح'
      };
    } catch (error) {
      console.error('Failed to process payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPaymentStatus(paymentHash) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const paymentContract = new ethers.Contract(
        this.contractAddresses.ethereum.paymentProcessor,
        this.contractABIs.paymentProcessor,
        this.signer
      );

      const status = await paymentContract.getPaymentStatus(paymentHash);
      
      return {
        success: true,
        status: this.getPaymentStatusName(status),
        message: 'تم الحصول على حالة الدفعة'
      };
    } catch (error) {
      console.error('Failed to get payment status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async refundPayment(paymentHash) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const paymentContract = new ethers.Contract(
        this.contractAddresses.ethereum.paymentProcessor,
        this.contractABIs.paymentProcessor,
        this.signer
      );

      const tx = await paymentContract.refundPayment(paymentHash);
      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم استرداد الدفعة بنجاح'
      };
    } catch (error) {
      console.error('Failed to refund payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // إدارة المحفظة متعددة العملات
  async deposit(tokenAddress, amount) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const walletContract = new ethers.Contract(
        this.contractAddresses.ethereum.multiCurrencyWallet,
        this.contractABIs.multiCurrencyWallet,
        this.signer
      );

      const tx = await walletContract.deposit(
        tokenAddress,
        ethers.parseUnits(amount.toString(), this.getTokenDecimals(tokenAddress))
      );

      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم إيداع الأموال بنجاح'
      };
    } catch (error) {
      console.error('Failed to deposit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async withdraw(tokenAddress, amount) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const walletContract = new ethers.Contract(
        this.contractAddresses.ethereum.multiCurrencyWallet,
        this.contractABIs.multiCurrencyWallet,
        this.signer
      );

      const tx = await walletContract.withdraw(
        tokenAddress,
        ethers.parseUnits(amount.toString(), this.getTokenDecimals(tokenAddress))
      );

      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم سحب الأموال بنجاح'
      };
    } catch (error) {
      console.error('Failed to withdraw:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getBalance(tokenAddress, userAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const walletContract = new ethers.Contract(
        this.contractAddresses.ethereum.multiCurrencyWallet,
        this.contractABIs.multiCurrencyWallet,
        this.signer
      );

      const balance = await walletContract.getBalance(tokenAddress, userAddress);
      
      return {
        success: true,
        balance: ethers.formatUnits(balance, this.getTokenDecimals(tokenAddress)),
        message: 'تم الحصول على الرصيد بنجاح'
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async transfer(tokenAddress, toAddress, amount) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const walletContract = new ethers.Contract(
        this.contractAddresses.ethereum.multiCurrencyWallet,
        this.contractABIs.multiCurrencyWallet,
        this.signer
      );

      const tx = await walletContract.transfer(
        tokenAddress,
        toAddress,
        ethers.parseUnits(amount.toString(), this.getTokenDecimals(tokenAddress))
      );

      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم تحويل الأموال بنجاح'
      };
    } catch (error) {
      console.error('Failed to transfer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // أسعار الصرف
  async getExchangeRates() {
    try {
      // محاكاة أسعار الصرف الحقيقية
      const rates = {
        BTC: 45000,
        ETH: 3000,
        USDT: 1,
        BNB: 300,
        ADA: 0.5,
        SOL: 100,
        DOT: 7,
        MATIC: 0.8
      };

      return {
        success: true,
        rates,
        message: 'تم الحصول على أسعار الصرف بنجاح'
      };
    } catch (error) {
      console.error('Failed to get exchange rates:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      const ratesResult = await this.getExchangeRates();
      if (!ratesResult.success) {
        throw new Error('Failed to get exchange rates');
      }

      const rates = ratesResult.rates;
      const fromRate = rates[fromCurrency] || 1;
      const toRate = rates[toCurrency] || 1;
      
      const usdAmount = amount * fromRate;
      const convertedAmount = usdAmount / toRate;

      return {
        success: true,
        amount: convertedAmount,
        message: `تم تحويل ${amount} ${fromCurrency} إلى ${convertedAmount.toFixed(8)} ${toCurrency}`
      };
    } catch (error) {
      console.error('Failed to convert currency:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // وظائف مساعدة
  getTokenDecimals(tokenAddress) {
    const currency = this.supportedCurrencies.find(c => c.contract === tokenAddress);
    return currency ? currency.decimals : 18;
  }

  getInvoiceStatus(status) {
    const statusMap = {
      0: 'pending',
      1: 'paid',
      2: 'overdue',
      3: 'cancelled'
    };
    return statusMap[status] || 'unknown';
  }

  getPaymentStatusName(status) {
    const statusMap = {
      0: 'pending',
      1: 'completed',
      2: 'failed',
      3: 'refunded'
    };
    return statusMap[status] || 'unknown';
  }

  getSupportedCurrencies() {
    return this.supportedCurrencies;
  }

  // إحصائيات النظام
  async getSystemStats() {
    try {
      const [userAddress] = await Promise.all([
        this.signer.getAddress()
      ]);

      const balances = {};
      for (const currency of this.supportedCurrencies) {
        if (currency.contract) {
          const balanceResult = await this.getBalance(currency.contract, userAddress);
          if (balanceResult.success) {
            balances[currency.symbol] = balanceResult.balance;
          }
        }
      }

      return {
        userStats: {
          balances,
          supportedCurrencies: this.supportedCurrencies.length
        }
      };
    } catch (error) {
      console.error('Failed to get system stats:', error);
      throw error;
    }
  }

  // التحقق من صحة العقود
  async validateContracts() {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const paymentContract = new ethers.Contract(
        this.contractAddresses.ethereum.paymentProcessor,
        this.contractABIs.paymentProcessor,
        this.provider
      );

      const contractCode = await this.provider.getCode(this.contractAddresses.ethereum.paymentProcessor);
      
      return {
        isValid: contractCode !== '0x',
        contractAddress: this.contractAddresses.ethereum.paymentProcessor,
        message: contractCode !== '0x' ? 'العقد الذكي صالح ويعمل بشكل صحيح' : 'العقد الذكي غير موجود'
      };
    } catch (error) {
      console.error('Contract validation failed:', error);
      return {
        isValid: false,
        error: error.message,
        message: 'فشل في التحقق من صحة العقد الذكي'
      };
    }
  }

  // إعادة تهيئة الخدمة
  async reconnect() {
    try {
      await this.init();
      return {
        success: true,
        message: 'تم إعادة الاتصال بنجاح'
      };
    } catch (error) {
      console.error('Failed to reconnect:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// إنشاء مثيل واحد من الخدمة
const cryptoPaymentService = new CryptoPaymentService();

export default cryptoPaymentService;
