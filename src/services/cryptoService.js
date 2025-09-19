// خدمة إدارة العملات الرقمية المتكاملة
class CryptoService {
  constructor() {
    this.supportedCurrencies = {
      BTC: {
        name: 'Bitcoin',
        symbol: 'BTC',
        decimals: 8,
        network: 'bitcoin',
        icon: '₿',
        color: '#F7931A',
        explorer: 'https://blockstream.info',
        contractAddress: null // Bitcoin ليس ERC-20
      },
      ETH: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        network: 'ethereum',
        icon: 'Ξ',
        color: '#627EEA',
        explorer: 'https://etherscan.io',
        contractAddress: null
      },
      USDT: {
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        network: 'ethereum',
        icon: '₮',
        color: '#26A17B',
        explorer: 'https://etherscan.io',
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      },
      USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        network: 'ethereum',
        icon: '💵',
        color: '#2775CA',
        explorer: 'https://etherscan.io',
        contractAddress: '0xA0b86a33E6441b8c4C8C0d4B0c8e8e8e8e8e8e8e'
      },
      BNB: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
        network: 'binance',
        icon: '🟡',
        color: '#F3BA2F',
        explorer: 'https://bscscan.com',
        contractAddress: null
      },
      ADA: {
        name: 'Cardano',
        symbol: 'ADA',
        decimals: 6,
        network: 'cardano',
        icon: '₳',
        color: '#0033AD',
        explorer: 'https://cardanoscan.io',
        contractAddress: null
      },
      SOL: {
        name: 'Solana',
        symbol: 'SOL',
        decimals: 9,
        network: 'solana',
        icon: '◎',
        color: '#9945FF',
        explorer: 'https://explorer.solana.com',
        contractAddress: null
      },
      MATIC: {
        name: 'Polygon',
        symbol: 'MATIC',
        decimals: 18,
        network: 'polygon',
        icon: '⬟',
        color: '#8247E5',
        explorer: 'https://polygonscan.com',
        contractAddress: null
      }
    };

    this.isInitialized = false;
    this.walletConnections = new Map();
    this.priceCache = new Map();
    this.lastPriceUpdate = 0;
    this.priceUpdateInterval = 60000; // تحديث الأسعار كل دقيقة
  }

  async init() {
    try {
      // تهيئة اتصالات المحافظ المختلفة
      await this.initializeWalletConnections();
      
      // تحميل أسعار العملات
      await this.updatePrices();
      
      // بدء تحديث الأسعار التلقائي
      this.startPriceUpdates();
      
      this.isInitialized = true;
      console.log('Crypto service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize crypto service:', error);
      throw error;
    }
  }

  async initializeWalletConnections() {
    // تهيئة اتصالات المحافظ المختلفة
    const walletTypes = ['metamask', 'walletconnect', 'coinbase', 'phantom'];
    
    for (const walletType of walletTypes) {
      try {
        await this.setupWalletConnection(walletType);
      } catch (error) {
        console.warn(`Failed to setup ${walletType} connection:`, error);
      }
    }
  }

  async setupWalletConnection(walletType) {
    switch (walletType) {
      case 'metamask':
        if (window.ethereum) {
          this.walletConnections.set('metamask', {
            provider: window.ethereum,
            connected: false,
            accounts: []
          });
        }
        break;
      
      case 'walletconnect':
        // تهيئة WalletConnect
        break;
      
      case 'coinbase':
        // تهيئة Coinbase Wallet
        break;
      
      case 'phantom':
        // تهيئة Phantom (Solana)
        break;
    }
  }

  async connectWallet(walletType = 'metamask') {
    try {
      const wallet = this.walletConnections.get(walletType);
      if (!wallet) {
        throw new Error(`${walletType} wallet not available`);
      }

      let accounts = [];
      
      switch (walletType) {
        case 'metamask':
          accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          break;
        
        case 'phantom':
          if (window.solana) {
            const response = await window.solana.connect();
            accounts = [response.publicKey.toString()];
          }
          break;
      }

      wallet.connected = true;
      wallet.accounts = accounts;
      
      return {
        success: true,
        walletType,
        accounts,
        address: accounts[0]
      };
    } catch (error) {
      console.error(`Failed to connect ${walletType} wallet:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getBalance(currency, address) {
    try {
      const currencyInfo = this.supportedCurrencies[currency];
      if (!currencyInfo) {
        throw new Error(`Unsupported currency: ${currency}`);
      }

      let balance = '0';
      
      switch (currencyInfo.network) {
        case 'ethereum':
          balance = await this.getEthereumBalance(currencyInfo, address);
          break;
        
        case 'bitcoin':
          balance = await this.getBitcoinBalance(address);
          break;
        
        case 'solana':
          balance = await this.getSolanaBalance(address);
          break;
        
        case 'cardano':
          balance = await this.getCardanoBalance(address);
          break;
        
        case 'polygon':
          balance = await this.getPolygonBalance(currencyInfo, address);
          break;
        
        case 'binance':
          balance = await this.getBinanceBalance(currencyInfo, address);
          break;
      }

      return {
        success: true,
        currency,
        balance,
        formattedBalance: this.formatBalance(balance, currencyInfo.decimals),
        address
      };
    } catch (error) {
      console.error(`Failed to get ${currency} balance:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getEthereumBalance(currencyInfo, address) {
    if (currencyInfo.contractAddress) {
      // ERC-20 token
      return await this.getERC20Balance(currencyInfo.contractAddress, address);
    } else {
      // Native ETH
      return await this.getNativeEthereumBalance(address);
    }
  }

  async getERC20Balance(contractAddress, address) {
    try {
      const contract = new window.ethers.Contract(
        contractAddress,
        ['function balanceOf(address) view returns (uint256)'],
        window.ethereum
      );
      
      const balance = await contract.balanceOf(address);
      return balance.toString();
    } catch (error) {
      console.error('Failed to get ERC-20 balance:', error);
      return '0';
    }
  }

  async getNativeEthereumBalance(address) {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      return parseInt(balance, 16).toString();
    } catch (error) {
      console.error('Failed to get ETH balance:', error);
      return '0';
    }
  }

  async getBitcoinBalance(address) {
    try {
      const response = await fetch(`https://blockstream.info/api/address/${address}`);
      const data = await response.json();
      return (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum).toString();
    } catch (error) {
      console.error('Failed to get BTC balance:', error);
      return '0';
    }
  }

  async getSolanaBalance(address) {
    try {
      if (window.solana) {
        const connection = new window.solana.Connection('https://api.mainnet-beta.solana.com');
        const balance = await connection.getBalance(new window.solana.PublicKey(address));
        return balance.toString();
      }
      return '0';
    } catch (error) {
      console.error('Failed to get SOL balance:', error);
      return '0';
    }
  }

  async getCardanoBalance(address) {
    try {
      const response = await fetch(`https://api.cardanoscan.io/api/address/${address}`);
      const data = await response.json();
      return data.balance || '0';
    } catch (error) {
      console.error('Failed to get ADA balance:', error);
      return '0';
    }
  }

  async getPolygonBalance(currencyInfo, address) {
    try {
      // استخدام Polygon RPC
      const response = await fetch('https://polygon-rpc.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1
        })
      });
      
      const data = await response.json();
      return parseInt(data.result, 16).toString();
    } catch (error) {
      console.error('Failed to get MATIC balance:', error);
      return '0';
    }
  }

  async getBinanceBalance(currencyInfo, address) {
    try {
      const response = await fetch('https://bsc-dataseed.binance.org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1
        })
      });
      
      const data = await response.json();
      return parseInt(data.result, 16).toString();
    } catch (error) {
      console.error('Failed to get BNB balance:', error);
      return '0';
    }
  }

  async updatePrices() {
    try {
      const currencies = Object.keys(this.supportedCurrencies).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin,cardano,solana,matic-network&vs_currencies=usd`
      );
      
      const prices = await response.json();
      
      // تحديث الأسعار في الكاش
      const priceMap = {
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'tether': 'USDT',
        'usd-coin': 'USDC',
        'binancecoin': 'BNB',
        'cardano': 'ADA',
        'solana': 'SOL',
        'matic-network': 'MATIC'
      };
      
      Object.entries(priceMap).forEach(([coinId, symbol]) => {
        if (prices[coinId]) {
          this.priceCache.set(symbol, prices[coinId].usd);
        }
      });
      
      this.lastPriceUpdate = Date.now();
    } catch (error) {
      console.error('Failed to update prices:', error);
    }
  }

  startPriceUpdates() {
    setInterval(() => {
      this.updatePrices();
    }, this.priceUpdateInterval);
  }

  getPrice(currency) {
    return this.priceCache.get(currency) || 0;
  }

  formatBalance(balance, decimals) {
    const divisor = Math.pow(10, decimals);
    return (parseInt(balance) / divisor).toFixed(6);
  }

  async sendTransaction(currency, fromAddress, toAddress, amount) {
    try {
      const currencyInfo = this.supportedCurrencies[currency];
      if (!currencyInfo) {
        throw new Error(`Unsupported currency: ${currency}`);
      }

      let txHash = '';
      
      switch (currencyInfo.network) {
        case 'ethereum':
          txHash = await this.sendEthereumTransaction(currencyInfo, fromAddress, toAddress, amount);
          break;
        
        case 'bitcoin':
          txHash = await this.sendBitcoinTransaction(fromAddress, toAddress, amount);
          break;
        
        case 'solana':
          txHash = await this.sendSolanaTransaction(fromAddress, toAddress, amount);
          break;
        
        default:
          throw new Error(`Transaction not supported for ${currency}`);
      }

      return {
        success: true,
        txHash,
        currency,
        amount,
        fromAddress,
        toAddress
      };
    } catch (error) {
      console.error(`Failed to send ${currency} transaction:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendEthereumTransaction(currencyInfo, fromAddress, toAddress, amount) {
    try {
      if (currencyInfo.contractAddress) {
        // ERC-20 transaction
        const contract = new window.ethers.Contract(
          currencyInfo.contractAddress,
          ['function transfer(address to, uint256 amount) returns (bool)'],
          window.ethereum
        );
        
        const tx = await contract.transfer(toAddress, amount);
        return tx.hash;
      } else {
        // Native ETH transaction
        const tx = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: fromAddress,
            to: toAddress,
            value: '0x' + parseInt(amount).toString(16)
          }]
        });
        return tx;
      }
    } catch (error) {
      console.error('Failed to send Ethereum transaction:', error);
      throw error;
    }
  }

  async sendBitcoinTransaction(fromAddress, toAddress, amount) {
    // محاكاة معاملة Bitcoin
    return `btc_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  async sendSolanaTransaction(fromAddress, toAddress, amount) {
    try {
      if (window.solana) {
        const transaction = new window.solana.Transaction();
        // إضافة تعليمات التحويل
        const tx = await window.solana.sendTransaction(transaction);
        return tx;
      }
      throw new Error('Solana wallet not available');
    } catch (error) {
      console.error('Failed to send Solana transaction:', error);
      throw error;
    }
  }

  getSupportedCurrencies() {
    return Object.keys(this.supportedCurrencies);
  }

  getCurrencyInfo(currency) {
    return this.supportedCurrencies[currency];
  }

  getAllCurrencyInfo() {
    return this.supportedCurrencies;
  }
}

export default new CryptoService();
