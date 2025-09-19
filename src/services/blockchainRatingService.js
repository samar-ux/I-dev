import { ethers } from 'ethers';

class BlockchainRatingService {
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

      // عناوين العقود الذكية للتقييم
      this.contractAddresses = {
        ethereum: {
          ratingContract: '0x1234567890123456789012345678901234567890',
          reputationContract: '0x2345678901234567890123456789012345678901',
          verificationContract: '0x3456789012345678901234567890123456789012'
        },
        icp: {
          ratingContract: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
          reputationContract: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
          verificationContract: 'rdmx6-jaaaa-aaaah-qcaiq-cai'
        }
      };

      // ABI للعقود الذكية
      this.contractABIs = {
        ratingContract: [
          "function submitRating(address target, uint8 targetType, uint8 rating, string memory comment, string memory category) public returns (uint256)",
          "function getRating(uint256 ratingId) public view returns (tuple(address target, address rater, uint8 rating, string comment, string category, uint256 timestamp, bool verified, uint256 helpful, bool reported))",
          "function getRatingsByTarget(address target) public view returns (uint256[])",
          "function getRatingsByRater(address rater) public view returns (uint256[])",
          "function markHelpful(uint256 ratingId) public",
          "function reportRating(uint256 ratingId, string memory reason) public",
          "function verifyRating(uint256 ratingId) public",
          "event RatingSubmitted(uint256 indexed ratingId, address indexed target, address indexed rater)",
          "event RatingVerified(uint256 indexed ratingId)",
          "event RatingReported(uint256 indexed ratingId, address indexed reporter)"
        ],
        reputationContract: [
          "function calculateReputationScore(address target) public view returns (uint256)",
          "function getReputationData(address target) public view returns (tuple(uint256 totalRatings, uint256 averageRating, uint256 reputationScore, bool verified, string[] badges))",
          "function updateReputationScore(address target) public",
          "function addBadge(address target, string memory badge) public",
          "function removeBadge(address target, string memory badge) public",
          "event ReputationUpdated(address indexed target, uint256 newScore)",
          "event BadgeAdded(address indexed target, string badge)",
          "event BadgeRemoved(address indexed target, string badge)"
        ],
        verificationContract: [
          "function verifyUser(address user) public",
          "function revokeVerification(address user) public",
          "function isVerified(address user) public view returns (bool)",
          "function getVerificationData(address user) public view returns (tuple(bool verified, uint256 verifiedAt, string verificationMethod))",
          "event UserVerified(address indexed user, string verificationMethod)",
          "event VerificationRevoked(address indexed user)"
        ]
      };

      this.isInitialized = true;
      console.log('Blockchain Rating Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Blockchain Rating Service:', error);
      throw error;
    }
  }

  // إدارة التقييمات
  async submitRating(ratingData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const ratingContract = new ethers.Contract(
        this.contractAddresses.ethereum.ratingContract,
        this.contractABIs.ratingContract,
        this.signer
      );

      const { target, targetType, rating, comment, category } = ratingData;
      
      const tx = await ratingContract.submitRating(
        target,
        targetType,
        rating,
        comment,
        category
      );

      const receipt = await tx.wait();
      
      // استخراج معرف التقييم من الحدث
      const event = receipt.logs.find(log => {
        try {
          const parsed = ratingContract.interface.parseLog(log);
          return parsed.name === 'RatingSubmitted';
        } catch {
          return false;
        }
      });

      const ratingId = event ? event.args.ratingId.toString() : null;

      return {
        success: true,
        ratingId,
        transactionHash: tx.hash,
        message: 'تم إرسال التقييم بنجاح إلى البلوكشين'
      };
    } catch (error) {
      console.error('Failed to submit rating:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getRating(ratingId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const ratingContract = new ethers.Contract(
        this.contractAddresses.ethereum.ratingContract,
        this.contractABIs.ratingContract,
        this.signer
      );

      const rating = await ratingContract.getRating(ratingId);
      
      return {
        id: ratingId,
        target: rating.target,
        rater: rating.rater,
        rating: rating.rating,
        comment: rating.comment,
        category: rating.category,
        timestamp: new Date(Number(rating.timestamp) * 1000).toISOString(),
        verified: rating.verified,
        helpful: Number(rating.helpful),
        reported: rating.reported
      };
    } catch (error) {
      console.error('Failed to get rating:', error);
      throw error;
    }
  }

  async getRatingsByTarget(targetAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const ratingContract = new ethers.Contract(
        this.contractAddresses.ethereum.ratingContract,
        this.contractABIs.ratingContract,
        this.signer
      );

      const ratingIds = await ratingContract.getRatingsByTarget(targetAddress);
      
      const ratings = await Promise.all(
        ratingIds.map(id => this.getRating(id.toString()))
      );

      return ratings;
    } catch (error) {
      console.error('Failed to get ratings by target:', error);
      throw error;
    }
  }

  async getRatingsByRater(raterAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const ratingContract = new ethers.Contract(
        this.contractAddresses.ethereum.ratingContract,
        this.contractABIs.ratingContract,
        this.signer
      );

      const ratingIds = await ratingContract.getRatingsByRater(raterAddress);
      
      const ratings = await Promise.all(
        ratingIds.map(id => this.getRating(id.toString()))
      );

      return ratings;
    } catch (error) {
      console.error('Failed to get ratings by rater:', error);
      throw error;
    }
  }

  async markRatingHelpful(ratingId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const ratingContract = new ethers.Contract(
        this.contractAddresses.ethereum.ratingContract,
        this.contractABIs.ratingContract,
        this.signer
      );

      const tx = await ratingContract.markHelpful(ratingId);
      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم تسجيل التقييم كمفيد'
      };
    } catch (error) {
      console.error('Failed to mark rating helpful:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async reportRating(ratingId, reason) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const ratingContract = new ethers.Contract(
        this.contractAddresses.ethereum.ratingContract,
        this.contractABIs.ratingContract,
        this.signer
      );

      const tx = await ratingContract.reportRating(ratingId, reason);
      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم الإبلاغ عن التقييم'
      };
    } catch (error) {
      console.error('Failed to report rating:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // إدارة السمعة
  async getReputationData(targetAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const reputationContract = new ethers.Contract(
        this.contractAddresses.ethereum.reputationContract,
        this.contractABIs.reputationContract,
        this.signer
      );

      const reputation = await reputationContract.getReputationData(targetAddress);
      
      return {
        target: targetAddress,
        totalRatings: Number(reputation.totalRatings),
        averageRating: Number(reputation.averageRating) / 10, // تحويل من basis points
        reputationScore: Number(reputation.reputationScore),
        verified: reputation.verified,
        badges: reputation.badges
      };
    } catch (error) {
      console.error('Failed to get reputation data:', error);
      throw error;
    }
  }

  async calculateReputationScore(targetAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const reputationContract = new ethers.Contract(
        this.contractAddresses.ethereum.reputationContract,
        this.contractABIs.reputationContract,
        this.signer
      );

      const score = await reputationContract.calculateReputationScore(targetAddress);
      
      return {
        success: true,
        score: Number(score),
        message: 'تم حساب نقاط السمعة بنجاح'
      };
    } catch (error) {
      console.error('Failed to calculate reputation score:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateReputationScore(targetAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const reputationContract = new ethers.Contract(
        this.contractAddresses.ethereum.reputationContract,
        this.contractABIs.reputationContract,
        this.signer
      );

      const tx = await reputationContract.updateReputationScore(targetAddress);
      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم تحديث نقاط السمعة'
      };
    } catch (error) {
      console.error('Failed to update reputation score:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async addBadge(targetAddress, badge) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const reputationContract = new ethers.Contract(
        this.contractAddresses.ethereum.reputationContract,
        this.contractABIs.reputationContract,
        this.signer
      );

      const tx = await reputationContract.addBadge(targetAddress, badge);
      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم إضافة الشارة بنجاح'
      };
    } catch (error) {
      console.error('Failed to add badge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // إدارة التحقق
  async verifyUser(userAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const verificationContract = new ethers.Contract(
        this.contractAddresses.ethereum.verificationContract,
        this.contractABIs.verificationContract,
        this.signer
      );

      const tx = await verificationContract.verifyUser(userAddress);
      await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        message: 'تم التحقق من المستخدم بنجاح'
      };
    } catch (error) {
      console.error('Failed to verify user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async isUserVerified(userAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const verificationContract = new ethers.Contract(
        this.contractAddresses.ethereum.verificationContract,
        this.contractABIs.verificationContract,
        this.signer
      );

      const verified = await verificationContract.isVerified(userAddress);
      
      return {
        success: true,
        verified: verified,
        message: verified ? 'المستخدم موثق' : 'المستخدم غير موثق'
      };
    } catch (error) {
      console.error('Failed to check user verification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getVerificationData(userAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }

      const verificationContract = new ethers.Contract(
        this.contractAddresses.ethereum.verificationContract,
        this.contractABIs.verificationContract,
        this.signer
      );

      const verification = await verificationContract.getVerificationData(userAddress);
      
      return {
        user: userAddress,
        verified: verification.verified,
        verifiedAt: verification.verifiedAt ? new Date(Number(verification.verifiedAt) * 1000).toISOString() : null,
        verificationMethod: verification.verificationMethod
      };
    } catch (error) {
      console.error('Failed to get verification data:', error);
      throw error;
    }
  }

  // إحصائيات النظام
  async getSystemStats() {
    try {
      const [userAddress] = await Promise.all([
        this.signer.getAddress()
      ]);

      const [userRatings, userReputation, userVerification] = await Promise.all([
        this.getRatingsByRater(userAddress),
        this.getReputationData(userAddress),
        this.getVerificationData(userAddress)
      ]);

      return {
        userStats: {
          totalRatingsGiven: userRatings.length,
          averageRatingGiven: userRatings.length > 0 ? 
            userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length : 0,
          reputationScore: userReputation.reputationScore,
          verified: userVerification.verified
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

      const ratingContract = new ethers.Contract(
        this.contractAddresses.ethereum.ratingContract,
        this.contractABIs.ratingContract,
        this.provider
      );

      // محاولة قراءة حالة العقد
      const contractCode = await this.provider.getCode(this.contractAddresses.ethereum.ratingContract);
      
      return {
        isValid: contractCode !== '0x',
        contractAddress: this.contractAddresses.ethereum.ratingContract,
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

  // وظائف مساعدة
  getTargetTypeName(type) {
    const typeMap = {
      0: 'سائق',
      1: 'شركة شحن',
      2: 'شحنة',
      3: 'خدمة'
    };
    return typeMap[type] || 'غير محدد';
  }

  getCategoryName(category) {
    const categoryMap = {
      'delivery': 'التوصيل',
      'service': 'الخدمة',
      'condition': 'حالة البضاعة',
      'communication': 'التواصل',
      'timing': 'التوقيت'
    };
    return categoryMap[category] || category;
  }

  calculateReputationLevel(score) {
    if (score >= 90) return { level: 'ممتاز', color: 'green' };
    if (score >= 70) return { level: 'جيد', color: 'blue' };
    if (score >= 50) return { level: 'مقبول', color: 'yellow' };
    return { level: 'ضعيف', color: 'red' };
  }
}

// إنشاء مثيل واحد من الخدمة
const blockchainRatingService = new BlockchainRatingService();

export default blockchainRatingService;
