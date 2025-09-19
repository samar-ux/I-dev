// خدمة العقود الذكية المتكاملة مع Ethereum وICP
class SmartContractService {
  constructor() {
    this.isInitialized = false;
    this.ethereumContracts = new Map();
    this.icpContracts = new Map();
    this.contractABIs = new Map();
    this.contractAddresses = new Map();
  }

  async init() {
    try {
      // تهيئة العقود الذكية
      await this.initializeEthereumContracts();
      await this.initializeICPContracts();
      
      this.isInitialized = true;
      console.log('Smart contract service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize smart contract service:', error);
      throw error;
    }
  }

  async initializeEthereumContracts() {
    try {
      // عقود Ethereum للشحن والتوصيل
      const shippingContractABI = [
        {
          "inputs": [
            {"internalType": "address", "name": "sender", "type": "address"},
            {"internalType": "address", "name": "receiver", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "string", "name": "trackingId", "type": "string"}
          ],
          "name": "createShipment",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint256", "name": "shipmentId", "type": "uint256"}],
          "name": "updateShipmentStatus",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint256", "name": "shipmentId", "type": "uint256"}],
          "name": "getShipmentDetails",
          "outputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint8", "name": "", "type": "uint8"}
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];

      const paymentContractABI = [
        {
          "inputs": [
            {"internalType": "address", "name": "token", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "address", "name": "recipient", "type": "address"}
          ],
          "name": "processPayment",
          "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {"internalType": "address", "name": "token", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
          ],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
          "name": "getBalance",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }
      ];

      // حفظ ABIs
      this.contractABIs.set('shipping', shippingContractABI);
      this.contractABIs.set('payment', paymentContractABI);

      // عناوين العقود (ستكون مختلفة في البيئة الحقيقية)
      this.contractAddresses.set('shipping', '0x1234567890123456789012345678901234567890');
      this.contractAddresses.set('payment', '0x0987654321098765432109876543210987654321');

      console.log('Ethereum contracts initialized');
    } catch (error) {
      console.error('Failed to initialize Ethereum contracts:', error);
      throw error;
    }
  }

  async initializeICPContracts() {
    try {
      // تهيئة عقود ICP
      // في البيئة الحقيقية، ستكون هذه عقود Canister على ICP
      
      const icpShippingContract = {
        canisterId: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
        methods: {
          createShipment: 'create_shipment',
          updateStatus: 'update_shipment_status',
          getShipment: 'get_shipment_details',
          getHistory: 'get_shipment_history'
        }
      };

      const icpPaymentContract = {
        canisterId: 'rrkah-fqaaa-aaaah-qcaiq-cai',
        methods: {
          processPayment: 'process_payment',
          deposit: 'deposit_funds',
          withdraw: 'withdraw_funds',
          getBalance: 'get_balance'
        }
      };

      this.icpContracts.set('shipping', icpShippingContract);
      this.icpContracts.set('payment', icpPaymentContract);

      console.log('ICP contracts initialized');
    } catch (error) {
      console.error('Failed to initialize ICP contracts:', error);
      throw error;
    }
  }

  async createShipment(senderAddress, receiverAddress, amount, trackingId, platform = 'ethereum') {
    try {
      if (platform === 'ethereum') {
        return await this.createEthereumShipment(senderAddress, receiverAddress, amount, trackingId);
      } else if (platform === 'icp') {
        return await this.createICPShipment(senderAddress, receiverAddress, amount, trackingId);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error('Failed to create shipment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createEthereumShipment(senderAddress, receiverAddress, amount, trackingId) {
    try {
      if (!window.ethereum) {
        throw new Error('Ethereum wallet not available');
      }

      const contractABI = this.contractABIs.get('shipping');
      const contractAddress = this.contractAddresses.get('shipping');
      
      const contract = new window.ethers.Contract(contractAddress, contractABI, window.ethereum);
      
      const tx = await contract.createShipment(
        senderAddress,
        receiverAddress,
        amount,
        trackingId
      );

      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        platform: 'ethereum',
        shipmentId: tx.hash
      };
    } catch (error) {
      console.error('Failed to create Ethereum shipment:', error);
      throw error;
    }
  }

  async createICPShipment(senderAddress, receiverAddress, amount, trackingId) {
    try {
      const contract = this.icpContracts.get('shipping');
      
      // محاكاة استدعاء ICP Canister
      const result = await this.callICPMethod(
        contract.canisterId,
        contract.methods.createShipment,
        [senderAddress, receiverAddress, amount, trackingId]
      );

      return {
        success: true,
        platform: 'icp',
        shipmentId: result.shipmentId,
        canisterId: contract.canisterId
      };
    } catch (error) {
      console.error('Failed to create ICP shipment:', error);
      throw error;
    }
  }

  async updateShipmentStatus(shipmentId, status, platform = 'ethereum') {
    try {
      if (platform === 'ethereum') {
        return await this.updateEthereumShipmentStatus(shipmentId, status);
      } else if (platform === 'icp') {
        return await this.updateICPShipmentStatus(shipmentId, status);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error('Failed to update shipment status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateEthereumShipmentStatus(shipmentId, status) {
    try {
      const contractABI = this.contractABIs.get('shipping');
      const contractAddress = this.contractAddresses.get('shipping');
      
      const contract = new window.ethers.Contract(contractAddress, contractABI, window.ethereum);
      
      const tx = await contract.updateShipmentStatus(shipmentId);
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        platform: 'ethereum'
      };
    } catch (error) {
      console.error('Failed to update Ethereum shipment status:', error);
      throw error;
    }
  }

  async updateICPShipmentStatus(shipmentId, status) {
    try {
      const contract = this.icpContracts.get('shipping');
      
      const result = await this.callICPMethod(
        contract.canisterId,
        contract.methods.updateStatus,
        [shipmentId, status]
      );

      return {
        success: true,
        platform: 'icp',
        canisterId: contract.canisterId
      };
    } catch (error) {
      console.error('Failed to update ICP shipment status:', error);
      throw error;
    }
  }

  async getShipmentDetails(shipmentId, platform = 'ethereum') {
    try {
      if (platform === 'ethereum') {
        return await this.getEthereumShipmentDetails(shipmentId);
      } else if (platform === 'icp') {
        return await this.getICPShipmentDetails(shipmentId);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error('Failed to get shipment details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getEthereumShipmentDetails(shipmentId) {
    try {
      const contractABI = this.contractABIs.get('shipping');
      const contractAddress = this.contractAddresses.get('shipping');
      
      const contract = new window.ethers.Contract(contractAddress, contractABI, window.ethereum);
      
      const details = await contract.getShipmentDetails(shipmentId);

      return {
        success: true,
        platform: 'ethereum',
        details: {
          sender: details[0],
          receiver: details[1],
          amount: details[2].toString(),
          trackingId: details[3],
          status: details[4]
        }
      };
    } catch (error) {
      console.error('Failed to get Ethereum shipment details:', error);
      throw error;
    }
  }

  async getICPShipmentDetails(shipmentId) {
    try {
      const contract = this.icpContracts.get('shipping');
      
      const result = await this.callICPMethod(
        contract.canisterId,
        contract.methods.getShipment,
        [shipmentId]
      );

      return {
        success: true,
        platform: 'icp',
        details: result
      };
    } catch (error) {
      console.error('Failed to get ICP shipment details:', error);
      throw error;
    }
  }

  async processPayment(tokenAddress, amount, recipientAddress, platform = 'ethereum') {
    try {
      if (platform === 'ethereum') {
        return await this.processEthereumPayment(tokenAddress, amount, recipientAddress);
      } else if (platform === 'icp') {
        return await this.processICPPayment(tokenAddress, amount, recipientAddress);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processEthereumPayment(tokenAddress, amount, recipientAddress) {
    try {
      const contractABI = this.contractABIs.get('payment');
      const contractAddress = this.contractAddresses.get('payment');
      
      const contract = new window.ethers.Contract(contractAddress, contractABI, window.ethereum);
      
      const tx = await contract.processPayment(tokenAddress, amount, recipientAddress);
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        platform: 'ethereum'
      };
    } catch (error) {
      console.error('Failed to process Ethereum payment:', error);
      throw error;
    }
  }

  async processICPPayment(tokenAddress, amount, recipientAddress) {
    try {
      const contract = this.icpContracts.get('payment');
      
      const result = await this.callICPMethod(
        contract.canisterId,
        contract.methods.processPayment,
        [tokenAddress, amount, recipientAddress]
      );

      return {
        success: true,
        platform: 'icp',
        result
      };
    } catch (error) {
      console.error('Failed to process ICP payment:', error);
      throw error;
    }
  }

  async callICPMethod(canisterId, method, args) {
    try {
      // محاكاة استدعاء ICP Canister
      // في البيئة الحقيقية، ستستخدم مكتبة @dfinity/agent
      
      const response = await fetch(`https://${canisterId}.ic0.app/api/${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          args: args
        })
      });

      if (!response.ok) {
        throw new Error(`ICP call failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to call ICP method:', error);
      throw error;
    }
  }

  async getContractBalance(accountAddress, platform = 'ethereum') {
    try {
      if (platform === 'ethereum') {
        return await this.getEthereumContractBalance(accountAddress);
      } else if (platform === 'icp') {
        return await this.getICPContractBalance(accountAddress);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error('Failed to get contract balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getEthereumContractBalance(accountAddress) {
    try {
      const contractABI = this.contractABIs.get('payment');
      const contractAddress = this.contractAddresses.get('payment');
      
      const contract = new window.ethers.Contract(contractAddress, contractABI, window.ethereum);
      
      const balance = await contract.getBalance(accountAddress);

      return {
        success: true,
        platform: 'ethereum',
        balance: balance.toString()
      };
    } catch (error) {
      console.error('Failed to get Ethereum contract balance:', error);
      throw error;
    }
  }

  async getICPContractBalance(accountAddress) {
    try {
      const contract = this.icpContracts.get('payment');
      
      const result = await this.callICPMethod(
        contract.canisterId,
        contract.methods.getBalance,
        [accountAddress]
      );

      return {
        success: true,
        platform: 'icp',
        balance: result.balance
      };
    } catch (error) {
      console.error('Failed to get ICP contract balance:', error);
      throw error;
    }
  }

  getSupportedPlatforms() {
    return ['ethereum', 'icp'];
  }

  getContractInfo(platform) {
    if (platform === 'ethereum') {
      return {
        contracts: Array.from(this.contractAddresses.keys()),
        addresses: Object.fromEntries(this.contractAddresses)
      };
    } else if (platform === 'icp') {
      return {
        contracts: Array.from(this.icpContracts.keys()),
        canisters: Object.fromEntries(
          Array.from(this.icpContracts.entries()).map(([key, value]) => [key, value.canisterId])
        )
      };
    }
    return null;
  }
}

export default new SmartContractService();
