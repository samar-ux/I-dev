import { ethers } from 'ethers';

class InsuranceSmartContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {
      ethereum: null,
      icp: null
    };
    this.isInitialized = false;
  }

  async init() {
    try {
      // تهيئة مزود Ethereum
      if (window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
      }

      // عناوين العقود الذكية للتأمين
      this.contractAddresses = {
        ethereum: {
          insuranceFund: '0x1234567890123456789012345678901234567890',
          policyManager: '0x2345678901234567890123456789012345678901',
          claimsProcessor: '0x3456789012345678901234567890123456789012'
        },
        icp: {
          insuranceFund: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
          policyManager: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
          claimsProcessor: 'rdmx6-jaaaa-aaaah-qcaiq-cai'
        }
      };

      // ABI للعقود الذكية
      this.contractABIs = {
        insuranceFund: [
          "function getTotalFund() public view returns (uint256)",
          "function getAvailableFund() public view returns (uint256)",
          "function depositFund(uint256 amount) public payable",
          "function withdrawFund(uint256 amount) public",
          "function getFundBalance(address user) public view returns (uint256)",
          "event FundDeposited(address indexed user, uint256 amount)",
          "event FundWithdrawn(address indexed user, uint256 amount)"
        ],
        policyManager: [
          "function createPolicy(string memory shipmentId, uint256 value, string memory destination, uint8 riskLevel) public returns (uint256)",
          "function getPolicy(uint256 policyId) public view returns (tuple(string shipmentId, uint256 value, uint256 premium, uint8 coverage, uint8 status, uint256 createdAt, uint256 expiresAt, string destination, uint8 riskLevel))",
          "function renewPolicy(uint256 policyId) public payable",
          "function cancelPolicy(uint256 policyId) public",
          "function getPoliciesByUser(address user) public view returns (uint256[])",
          "event PolicyCreated(uint256 indexed policyId, address indexed user, string shipmentId)",
          "event PolicyRenewed(uint256 indexed policyId, address indexed user)",
          "event PolicyCancelled(uint256 indexed policyId, address indexed user)"
        ],
        claimsProcessor: [
          "function submitClaim(uint256 policyId, uint256 amount, string memory reason) public returns (uint256)",
          "function processClaim(uint256 claimId, bool approved) public",
          "function getClaim(uint256 claimId) public view returns (tuple(uint256 policyId, uint256 amount, uint8 status, uint256 submittedAt, uint256 processedAt, string reason))",
          "function getClaimsByUser(address user) public view returns (uint256[])",
          "function getClaimsByPolicy(uint256 policyId) public view returns (uint256[])",
          "event ClaimSubmitted(uint256 indexed claimId, address indexed user, uint256 policyId)",
          "event ClaimProcessed(uint256 indexed claimId, bool approved)"
        ]
      };

      this.isInitialized = true;
      console.log('Insurance Smart Contract Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Insurance Smart Contract Service:', error);
      throw error;
    }
  }

  // إدارة صندوق التأمين
  async getInsuranceFundInfo() {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const fundContract = new ethers.Contract(
        this.contractAddresses.ethereum.insuranceFund,
        this.contractABIs.insuranceFund,
        this.signer
      );

      const [totalFund, availableFund] = await Promise.all([
        fundContract.getTotalFund(),
        fundContract.getAvailableFund()
      ]);

      return {
        totalFund: ethers.formatEther(totalFund),
        availableFund: ethers.formatEther(availableFund),
        utilizationRate: ((totalFund - availableFund) / totalFund * 100).toFixed(2)
      };
    } catch (error) {
      console.error('Failed to get insurance fund info:', error);
      throw error;
    }
  }

  async depositToInsuranceFund(amount) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const fundContract = new ethers.Contract(
        this.contractAddresses.ethereum.insuranceFund,
        this.contractABIs.insuranceFund,
        this.signer
      );

      const tx = await fundContract.depositFund(ethers.parseEther(amount.toString()));
      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم إيداع الأموال في صندوق التأمين بنجاح'
      };
    } catch (error) {
      console.error('Failed to deposit to insurance fund:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // إدارة السياسات
  async createInsurancePolicy(policyData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const policyContract = new ethers.Contract(
        this.contractAddresses.ethereum.policyManager,
        this.contractABIs.policyManager,
        this.signer
      );

      const { shipmentId, value, destination, riskLevel } = policyData;
      
      const tx = await policyContract.createPolicy(
        shipmentId,
        ethers.parseEther(value.toString()),
        destination,
        riskLevel
      );

      const receipt = await tx.wait();
      
      // استخراج معرف السياسة من الحدث
      const event = receipt.logs.find(log => {
        try {
          const parsed = policyContract.interface.parseLog(log);
          return parsed.name === 'PolicyCreated';
        } catch {
          return false;
        }
      });

      const policyId = event ? event.args.policyId.toString() : null;

      return {
        success: true,
        policyId,
        transactionHash: tx.hash,
        message: 'تم إنشاء بوليصة التأمين بنجاح'
      };
    } catch (error) {
      console.error('Failed to create insurance policy:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getInsurancePolicy(policyId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const policyContract = new ethers.Contract(
        this.contractAddresses.ethereum.policyManager,
        this.contractABIs.policyManager,
        this.signer
      );

      const policy = await policyContract.getPolicy(policyId);
      
      return {
        id: policyId,
        shipmentId: policy.shipmentId,
        value: ethers.formatEther(policy.value),
        premium: ethers.formatEther(policy.premium),
        coverage: policy.coverage,
        status: this.getPolicyStatus(policy.status),
        createdAt: new Date(Number(policy.createdAt) * 1000).toISOString(),
        expiresAt: new Date(Number(policy.expiresAt) * 1000).toISOString(),
        destination: policy.destination,
        riskLevel: this.getRiskLevel(policy.riskLevel)
      };
    } catch (error) {
      console.error('Failed to get insurance policy:', error);
      throw error;
    }
  }

  async getUserPolicies(userAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const policyContract = new ethers.Contract(
        this.contractAddresses.ethereum.policyManager,
        this.contractABIs.policyManager,
        this.signer
      );

      const policyIds = await policyContract.getPoliciesByUser(userAddress);
      
      const policies = await Promise.all(
        policyIds.map(id => this.getInsurancePolicy(id.toString()))
      );

      return policies;
    } catch (error) {
      console.error('Failed to get user policies:', error);
      throw error;
    }
  }

  // إدارة المطالبات
  async submitClaim(claimData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const claimsContract = new ethers.Contract(
        this.contractAddresses.ethereum.claimsProcessor,
        this.contractABIs.claimsProcessor,
        this.signer
      );

      const { policyId, amount, reason } = claimData;
      
      const tx = await claimsContract.submitClaim(
        policyId,
        ethers.parseEther(amount.toString()),
        reason
      );

      const receipt = await tx.wait();
      
      // استخراج معرف المطالبة من الحدث
      const event = receipt.logs.find(log => {
        try {
          const parsed = claimsContract.interface.parseLog(log);
          return parsed.name === 'ClaimSubmitted';
        } catch {
          return false;
        }
      });

      const claimId = event ? event.args.claimId.toString() : null;

      return {
        success: true,
        claimId,
        transactionHash: tx.hash,
        message: 'تم تقديم المطالبة بنجاح'
      };
    } catch (error) {
      console.error('Failed to submit claim:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processClaim(claimId, approved) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const claimsContract = new ethers.Contract(
        this.contractAddresses.ethereum.claimsProcessor,
        this.contractABIs.claimsProcessor,
        this.signer
      );

      const tx = await claimsContract.processClaim(claimId, approved);
      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: approved ? 'تم الموافقة على المطالبة' : 'تم رفض المطالبة'
      };
    } catch (error) {
      console.error('Failed to process claim:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getClaim(claimId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const claimsContract = new ethers.Contract(
        this.contractAddresses.ethereum.claimsProcessor,
        this.contractABIs.claimsProcessor,
        this.signer
      );

      const claim = await claimsContract.getClaim(claimId);
      
      return {
        id: claimId,
        policyId: claim.policyId.toString(),
        amount: ethers.formatEther(claim.amount),
        status: this.getClaimStatus(claim.status),
        submittedAt: new Date(Number(claim.submittedAt) * 1000).toISOString(),
        processedAt: claim.processedAt ? new Date(Number(claim.processedAt) * 1000).toISOString() : null,
        reason: claim.reason
      };
    } catch (error) {
      console.error('Failed to get claim:', error);
      throw error;
    }
  }

  async getUserClaims(userAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const claimsContract = new ethers.Contract(
        this.contractAddresses.ethereum.claimsProcessor,
        this.contractABIs.claimsProcessor,
        this.signer
      );

      const claimIds = await claimsContract.getClaimsByUser(userAddress);
      
      const claims = await Promise.all(
        claimIds.map(id => this.getClaim(id.toString()))
      );

      return claims;
    } catch (error) {
      console.error('Failed to get user claims:', error);
      throw error;
    }
  }

  // وظائف مساعدة
  getPolicyStatus(status) {
    const statusMap = {
      0: 'pending',
      1: 'active',
      2: 'expired',
      3: 'cancelled'
    };
    return statusMap[status] || 'unknown';
  }

  getClaimStatus(status) {
    const statusMap = {
      0: 'pending',
      1: 'approved',
      2: 'rejected',
      3: 'processing'
    };
    return statusMap[status] || 'unknown';
  }

  getRiskLevel(level) {
    const levelMap = {
      0: 'منخفض',
      1: 'متوسط',
      2: 'عالي'
    };
    return levelMap[level] || 'غير محدد';
  }

  // إحصائيات النظام
  async getSystemStats() {
    try {
      const [fundInfo, userAddress] = await Promise.all([
        this.getInsuranceFundInfo(),
        this.signer.getAddress()
      ]);

      const [userPolicies, userClaims] = await Promise.all([
        this.getUserPolicies(userAddress),
        this.getUserClaims(userAddress)
      ]);

      return {
        fund: fundInfo,
        userStats: {
          totalPolicies: userPolicies.length,
          activePolicies: userPolicies.filter(p => p.status === 'active').length,
          totalClaims: userClaims.length,
          pendingClaims: userClaims.filter(c => c.status === 'pending').length,
          approvedClaims: userClaims.filter(c => c.status === 'approved').length
        }
      };
    } catch (error) {
      console.error('Failed to get system stats:', error);
      throw error;
    }
  }

  // التحقق من صحة العقد
  async validateContract() {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const fundContract = new ethers.Contract(
        this.contractAddresses.ethereum.insuranceFund,
        this.contractABIs.insuranceFund,
        this.provider
      );

      const totalFund = await fundContract.getTotalFund();
      
      return {
        isValid: true,
        totalFund: ethers.formatEther(totalFund),
        message: 'العقد الذكي صالح ويعمل بشكل صحيح'
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
const insuranceSmartContractService = new InsuranceSmartContractService();

export default insuranceSmartContractService;
