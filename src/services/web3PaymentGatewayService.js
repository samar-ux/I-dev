// خدمة بوابات الدفع المتوافقة مع Web3 وICP
class Web3PaymentGatewayService {
  constructor() {
    this.isInitialized = false;
    this.supportedChains = {
      ethereum: {
        name: 'Ethereum',
        chainId: 1,
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
        explorer: 'https://etherscan.io',
        nativeCurrency: 'ETH',
        color: '#627EEA'
      },
      polygon: {
        name: 'Polygon',
        chainId: 137,
        rpcUrl: 'https://polygon-rpc.com',
        explorer: 'https://polygonscan.com',
        nativeCurrency: 'MATIC',
        color: '#8247E5'
      },
      binance: {
        name: 'Binance Smart Chain',
        chainId: 56,
        rpcUrl: 'https://bsc-dataseed.binance.org',
        explorer: 'https://bscscan.com',
        nativeCurrency: 'BNB',
        color: '#F3BA2F'
      },
      icp: {
        name: 'Internet Computer',
        chainId: 'icp',
        rpcUrl: 'https://ic0.app',
        explorer: 'https://dashboard.internetcomputer.org',
        nativeCurrency: 'ICP',
        color: '#29BEB0'
      }
    };
    
    this.paymentMethods = {
      crypto: {
        name: 'العملات الرقمية',
        icon: '₿',
        color: '#F7931A',
        methods: ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'SOL', 'MATIC', 'ICP']
      },
      web3: {
        name: 'Web3 Payments',
        icon: '🌐',
        color: '#8B5CF6',
        methods: ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Phantom']
      },
      icp: {
        name: 'ICP Payments',
        icon: '🦀',
        color: '#29BEB0',
        methods: ['Internet Identity', 'Plug Wallet', 'Stoic Wallet']
      },
      traditional: {
        name: 'المدفوعات التقليدية',
        icon: '💳',
        color: '#3B82F6',
        methods: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay']
      }
    };
    
    this.activeConnections = new Map();
    this.paymentHistory = [];
  }

  async init() {
    try {
      this.isInitialized = true;
      console.log('Web3 Payment Gateway service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Web3 Payment Gateway service:', error);
      throw error;
    }
  }

  async connectWallet(walletType, chainId = 'ethereum') {
    try {
      let result;
      
      switch (walletType) {
        case 'metamask':
          result = await this.connectMetaMask(chainId);
          break;
        case 'walletconnect':
          result = await this.connectWalletConnect(chainId);
          break;
        case 'coinbase':
          result = await this.connectCoinbaseWallet(chainId);
          break;
        case 'phantom':
          result = await this.connectPhantomWallet();
          break;
        case 'internet-identity':
          result = await this.connectInternetIdentity();
          break;
        case 'plug':
          result = await this.connectPlugWallet();
          break;
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }

      if (result.success) {
        this.activeConnections.set(walletType, {
          ...result,
          connectedAt: new Date().toISOString(),
          chainId: chainId
        });
      }

      return result;
    } catch (error) {
      console.error(`Failed to connect ${walletType} wallet:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async connectMetaMask(chainId) {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      // طلب الاتصال
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // تبديل الشبكة إذا لزم الأمر
      await this.switchChain(chainId);

      return {
        success: true,
        walletType: 'metamask',
        address: accounts[0],
        chainId: chainId,
        provider: window.ethereum
      };
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      throw error;
    }
  }

  async connectWalletConnect(chainId) {
    try {
      // محاكاة WalletConnect
      const mockAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      return {
        success: true,
        walletType: 'walletconnect',
        address: mockAddress,
        chainId: chainId,
        provider: 'walletconnect'
      };
    } catch (error) {
      console.error('WalletConnect connection failed:', error);
      throw error;
    }
  }

  async connectCoinbaseWallet(chainId) {
    try {
      if (window.coinbaseWalletExtension) {
        const accounts = await window.coinbaseWalletExtension.request({
          method: 'eth_requestAccounts'
        });

        return {
          success: true,
          walletType: 'coinbase',
          address: accounts[0],
          chainId: chainId,
          provider: window.coinbaseWalletExtension
        };
      } else {
        throw new Error('Coinbase Wallet not installed');
      }
    } catch (error) {
      console.error('Coinbase Wallet connection failed:', error);
      throw error;
    }
  }

  async connectPhantomWallet() {
    try {
      if (window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        
        return {
          success: true,
          walletType: 'phantom',
          address: response.publicKey.toString(),
          chainId: 'solana',
          provider: window.solana
        };
      } else {
        throw new Error('Phantom Wallet not installed');
      }
    } catch (error) {
      console.error('Phantom Wallet connection failed:', error);
      throw error;
    }
  }

  async connectInternetIdentity() {
    try {
      // محاكاة Internet Identity
      const mockPrincipal = `rdmx6-jaaaa-aaaah-qcaiq-cai`;
      
      return {
        success: true,
        walletType: 'internet-identity',
        address: mockPrincipal,
        chainId: 'icp',
        provider: 'internet-identity'
      };
    } catch (error) {
      console.error('Internet Identity connection failed:', error);
      throw error;
    }
  }

  async connectPlugWallet() {
    try {
      if (window.ic && window.ic.plug) {
        const isConnected = await window.ic.plug.isConnected();
        
        if (!isConnected) {
          await window.ic.plug.requestConnect();
        }

        const principal = await window.ic.plug.getPrincipal();
        
        return {
          success: true,
          walletType: 'plug',
          address: principal.toString(),
          chainId: 'icp',
          provider: window.ic.plug
        };
      } else {
        throw new Error('Plug Wallet not installed');
      }
    } catch (error) {
      console.error('Plug Wallet connection failed:', error);
      throw error;
    }
  }

  async switchChain(chainId) {
    try {
      const chain = this.supportedChains[chainId];
      if (!chain) {
        throw new Error(`Unsupported chain: ${chainId}`);
      }

      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chain.chainId.toString(16)}` }]
          });
        } catch (switchError) {
          // إضافة الشبكة إذا لم تكن موجودة
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${chain.chainId.toString(16)}`,
                chainName: chain.name,
                rpcUrls: [chain.rpcUrl],
                nativeCurrency: {
                  name: chain.nativeCurrency,
                  symbol: chain.nativeCurrency,
                  decimals: 18
                },
                blockExplorerUrls: [chain.explorer]
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      return {
        success: true,
        chainId: chainId,
        chain: chain
      };
    } catch (error) {
      console.error('Failed to switch chain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processPayment(paymentData) {
    try {
      const {
        amount,
        currency,
        recipientAddress,
        paymentMethod,
        walletType,
        chainId = 'ethereum'
      } = paymentData;

      let result;

      switch (paymentMethod) {
        case 'crypto':
          result = await this.processCryptoPayment(paymentData);
          break;
        case 'web3':
          result = await this.processWeb3Payment(paymentData);
          break;
        case 'icp':
          result = await this.processICPPayment(paymentData);
          break;
        case 'traditional':
          result = await this.processTraditionalPayment(paymentData);
          break;
        default:
          throw new Error(`Unsupported payment method: ${paymentMethod}`);
      }

      if (result.success) {
        // حفظ في سجل المدفوعات
        this.paymentHistory.push({
          ...result,
          timestamp: new Date().toISOString(),
          id: `payment_${Date.now()}_${Math.random().toString(36).substring(7)}`
        });
      }

      return result;
    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processCryptoPayment(paymentData) {
    try {
      const { amount, currency, recipientAddress, walletType } = paymentData;
      
      const connection = this.activeConnections.get(walletType);
      if (!connection) {
        throw new Error(`${walletType} wallet not connected`);
      }

      let txHash;

      switch (walletType) {
        case 'metamask':
        case 'walletconnect':
        case 'coinbase':
          txHash = await this.sendEthereumTransaction(connection, recipientAddress, amount, currency);
          break;
        case 'phantom':
          txHash = await this.sendSolanaTransaction(connection, recipientAddress, amount);
          break;
        default:
          throw new Error(`Unsupported wallet for crypto payment: ${walletType}`);
      }

      return {
        success: true,
        paymentMethod: 'crypto',
        currency: currency,
        amount: amount,
        txHash: txHash,
        recipientAddress: recipientAddress,
        walletType: walletType
      };
    } catch (error) {
      console.error('Crypto payment failed:', error);
      throw error;
    }
  }

  async processWeb3Payment(paymentData) {
    try {
      const { amount, currency, recipientAddress, walletType } = paymentData;
      
      // Web3 payments هي نفس crypto payments ولكن مع مميزات إضافية
      const result = await this.processCryptoPayment(paymentData);
      
      if (result.success) {
        // إضافة مميزات Web3 مثل NFTs أو DeFi
        result.web3Features = {
          nftSupport: true,
          defiIntegration: true,
          smartContractInteraction: true
        };
      }

      return result;
    } catch (error) {
      console.error('Web3 payment failed:', error);
      throw error;
    }
  }

  async processICPPayment(paymentData) {
    try {
      const { amount, currency, recipientAddress, walletType } = paymentData;
      
      const connection = this.activeConnections.get(walletType);
      if (!connection) {
        throw new Error(`${walletType} wallet not connected`);
      }

      let txHash;

      switch (walletType) {
        case 'internet-identity':
        case 'plug':
          txHash = await this.sendICPTransaction(connection, recipientAddress, amount);
          break;
        default:
          throw new Error(`Unsupported wallet for ICP payment: ${walletType}`);
      }

      return {
        success: true,
        paymentMethod: 'icp',
        currency: 'ICP',
        amount: amount,
        txHash: txHash,
        recipientAddress: recipientAddress,
        walletType: walletType,
        icpFeatures: {
          canisterInteraction: true,
          internetIdentity: true,
          decentralizedStorage: true
        }
      };
    } catch (error) {
      console.error('ICP payment failed:', error);
      throw error;
    }
  }

  async processTraditionalPayment(paymentData) {
    try {
      const { amount, currency, paymentGateway } = paymentData;
      
      // محاكاة المدفوعات التقليدية
      const mockTransactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      return {
        success: true,
        paymentMethod: 'traditional',
        currency: currency,
        amount: amount,
        transactionId: mockTransactionId,
        paymentGateway: paymentGateway || 'stripe',
        traditionalFeatures: {
          instantProcessing: true,
          refundSupport: true,
          chargebackProtection: true
        }
      };
    } catch (error) {
      console.error('Traditional payment failed:', error);
      throw error;
    }
  }

  async sendEthereumTransaction(connection, toAddress, amount, currency) {
    try {
      if (currency === 'ETH') {
        // معاملة ETH الأصلية
        const tx = await connection.provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: connection.address,
            to: toAddress,
            value: `0x${(parseFloat(amount) * Math.pow(10, 18)).toString(16)}`
          }]
        });
        return tx;
      } else {
        // معاملة ERC-20 token
        const contractAddress = this.getTokenContractAddress(currency);
        const contract = new window.ethers.Contract(
          contractAddress,
          ['function transfer(address to, uint256 amount) returns (bool)'],
          connection.provider
        );
        
        const tx = await contract.transfer(toAddress, amount);
        return tx.hash;
      }
    } catch (error) {
      console.error('Ethereum transaction failed:', error);
      throw error;
    }
  }

  async sendSolanaTransaction(connection, toAddress, amount) {
    try {
      const transaction = new window.solana.Transaction();
      // إضافة تعليمات التحويل
      const tx = await window.solana.sendTransaction(transaction);
      return tx;
    } catch (error) {
      console.error('Solana transaction failed:', error);
      throw error;
    }
  }

  async sendICPTransaction(connection, toAddress, amount) {
    try {
      // محاكاة معاملة ICP
      const txHash = `icp_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return txHash;
    } catch (error) {
      console.error('ICP transaction failed:', error);
      throw error;
    }
  }

  getTokenContractAddress(currency) {
    const addresses = {
      'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      'USDC': '0xA0b86a33E6441b8c4C8C0d4B0c8e8e8e8e8e8e8e',
      'MATIC': '0x0000000000000000000000000000000000000000'
    };
    return addresses[currency] || null;
  }

  async getBalance(address, currency, chainId = 'ethereum') {
    try {
      let balance;

      switch (chainId) {
        case 'ethereum':
        case 'polygon':
        case 'binance':
          balance = await this.getEthereumBalance(address, currency);
          break;
        case 'solana':
          balance = await this.getSolanaBalance(address);
          break;
        case 'icp':
          balance = await this.getICPBalance(address);
          break;
        default:
          throw new Error(`Unsupported chain: ${chainId}`);
      }

      return {
        success: true,
        address: address,
        currency: currency,
        balance: balance,
        chainId: chainId
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getEthereumBalance(address, currency) {
    try {
      if (currency === 'ETH') {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        return parseInt(balance, 16) / Math.pow(10, 18);
      } else {
        const contractAddress = this.getTokenContractAddress(currency);
        if (!contractAddress) {
          throw new Error(`Unsupported token: ${currency}`);
        }
        
        const contract = new window.ethers.Contract(
          contractAddress,
          ['function balanceOf(address) view returns (uint256)'],
          window.ethereum
        );
        
        const balance = await contract.balanceOf(address);
        return balance.toString();
      }
    } catch (error) {
      console.error('Failed to get Ethereum balance:', error);
      return '0';
    }
  }

  async getSolanaBalance(address) {
    try {
      if (window.solana) {
        const connection = new window.solana.Connection('https://api.mainnet-beta.solana.com');
        const balance = await connection.getBalance(new window.solana.PublicKey(address));
        return balance / Math.pow(10, 9);
      }
      return 0;
    } catch (error) {
      console.error('Failed to get Solana balance:', error);
      return 0;
    }
  }

  async getICPBalance(address) {
    try {
      // محاكاة رصيد ICP
      return Math.random() * 100;
    } catch (error) {
      console.error('Failed to get ICP balance:', error);
      return 0;
    }
  }

  getSupportedChains() {
    return this.supportedChains;
  }

  getPaymentMethods() {
    return this.paymentMethods;
  }

  getActiveConnections() {
    return Array.from(this.activeConnections.keys());
  }

  getPaymentHistory() {
    return this.paymentHistory;
  }

  async disconnectWallet(walletType) {
    try {
      if (this.activeConnections.has(walletType)) {
        this.activeConnections.delete(walletType);
        return {
          success: true,
          message: `${walletType} wallet disconnected`
        };
      } else {
        throw new Error(`${walletType} wallet not connected`);
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new Web3PaymentGatewayService();

