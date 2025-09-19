use sqlx::{PgPool, Row};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use anyhow::Result;

#[derive(Debug, Clone)]
pub struct Database {
    pub pool: PgPool,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self> {
        let pool = PgPool::connect(database_url).await?;
        Ok(Database { pool })
    }

    pub async fn migrate(&self) -> Result<()> {
        sqlx::migrate!("./migrations").run(&self.pool).await?;
        Ok(())
    }
}

// User Models
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    pub password_hash: String,
    pub first_name: String,
    pub last_name: String,
    pub phone: Option<String>,
    pub avatar_url: Option<String>,
    pub role: UserRole,
    pub status: UserStatus,
    pub email_verified: bool,
    pub phone_verified: bool,
    pub kyc_verified: bool,
    pub biometric_enabled: bool,
    pub world_id_verified: bool,
    pub internet_identity_principal: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_login: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "user_role", rename_all = "snake_case")]
pub enum UserRole {
    Customer,
    StoreOwner,
    Driver,
    ShippingCompany,
    Admin,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "user_status", rename_all = "snake_case")]
pub enum UserStatus {
    Active,
    Inactive,
    Suspended,
    Banned,
}

// Shipment Models
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Shipment {
    pub id: Uuid,
    pub tracking_number: String,
    pub sender_id: Uuid,
    pub receiver_id: Uuid,
    pub driver_id: Option<Uuid>,
    pub status: ShipmentStatus,
    pub priority: ShipmentPriority,
    pub weight: f64,
    pub dimensions: serde_json::Value,
    pub description: String,
    pub value: f64,
    pub currency: String,
    pub pickup_address: serde_json::Value,
    pub delivery_address: serde_json::Value,
    pub estimated_delivery: Option<DateTime<Utc>>,
    pub actual_delivery: Option<DateTime<Utc>>,
    pub nft_token_id: Option<String>,
    pub blockchain_tx_hash: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "shipment_status", rename_all = "snake_case")]
pub enum ShipmentStatus {
    Pending,
    PickedUp,
    InTransit,
    OutForDelivery,
    Delivered,
    Returned,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "shipment_priority", rename_all = "snake_case")]
pub enum ShipmentPriority {
    Low,
    Medium,
    High,
    Urgent,
}

// Location Tracking
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct LocationUpdate {
    pub id: Uuid,
    pub shipment_id: Uuid,
    pub latitude: f64,
    pub longitude: f64,
    pub address: String,
    pub city: String,
    pub country: String,
    pub accuracy: f64,
    pub timestamp: DateTime<Utc>,
}

// AI Suggestions
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct AISuggestion {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub shipment_id: Option<Uuid>,
    pub suggestion_type: SuggestionType,
    pub title: String,
    pub description: String,
    pub priority: SuggestionPriority,
    pub impact: SuggestionImpact,
    pub estimated_savings: f64,
    pub confidence: f64,
    pub category: String,
    pub details: serde_json::Value,
    pub status: SuggestionStatus,
    pub applied_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "suggestion_type", rename_all = "snake_case")]
pub enum SuggestionType {
    RouteOptimization,
    DemandForecast,
    CustomerRetention,
    InventoryOptimization,
    CostReduction,
    TimeOptimization,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "suggestion_priority", rename_all = "snake_case")]
pub enum SuggestionPriority {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "suggestion_impact", rename_all = "snake_case")]
pub enum SuggestionImpact {
    CostSaving,
    RevenueIncrease,
    CustomerSatisfaction,
    Efficiency,
    Quality,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "suggestion_status", rename_all = "snake_case")]
pub enum SuggestionStatus {
    Pending,
    Applied,
    Rejected,
    Expired,
}

// Support System
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct SupportTicket {
    pub id: Uuid,
    pub user_id: Uuid,
    pub agent_id: Option<Uuid>,
    pub title: String,
    pub description: String,
    pub status: TicketStatus,
    pub priority: TicketPriority,
    pub category: TicketCategory,
    pub rating: Option<i32>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub resolved_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "ticket_status", rename_all = "snake_case")]
pub enum TicketStatus {
    Open,
    InProgress,
    Resolved,
    Closed,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "ticket_priority", rename_all = "snake_case")]
pub enum TicketPriority {
    Low,
    Medium,
    High,
    Urgent,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "ticket_category", rename_all = "snake_case")]
pub enum TicketCategory {
    Tracking,
    Payment,
    Insurance,
    Technical,
    General,
}

// Chat Messages
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct ChatMessage {
    pub id: Uuid,
    pub ticket_id: Option<Uuid>,
    pub chat_session_id: Option<Uuid>,
    pub sender_id: Uuid,
    pub sender_type: SenderType,
    pub message: String,
    pub message_type: MessageType,
    pub attachments: serde_json::Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "sender_type", rename_all = "snake_case")]
pub enum SenderType {
    Customer,
    Agent,
    System,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "message_type", rename_all = "snake_case")]
pub enum MessageType {
    Text,
    Image,
    File,
    Video,
    Audio,
    Location,
}

// Dual Confirmation System
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Confirmation {
    pub id: Uuid,
    pub confirmation_type: ConfirmationType,
    pub title: String,
    pub description: String,
    pub status: ConfirmationStatus,
    pub priority: ConfirmationPriority,
    pub shipment_id: Option<Uuid>,
    pub participants: serde_json::Value,
    pub verification_methods: serde_json::Value,
    pub location: serde_json::Value,
    pub blockchain_tx_hash: Option<String>,
    pub expires_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "confirmation_type", rename_all = "snake_case")]
pub enum ConfirmationType {
    DeliveryConfirmation,
    PaymentConfirmation,
    PickupConfirmation,
    InspectionConfirmation,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "confirmation_status", rename_all = "snake_case")]
pub enum ConfirmationStatus {
    Pending,
    InProgress,
    Completed,
    Expired,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "confirmation_priority", rename_all = "snake_case")]
pub enum ConfirmationPriority {
    Low,
    Medium,
    High,
    Critical,
}

// Insurance
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct InsurancePolicy {
    pub id: Uuid,
    pub shipment_id: Uuid,
    pub user_id: Uuid,
    pub policy_number: String,
    pub coverage_amount: f64,
    pub premium: f64,
    pub currency: String,
    pub status: PolicyStatus,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub blockchain_tx_hash: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "policy_status", rename_all = "snake_case")]
pub enum PolicyStatus {
    Active,
    Expired,
    Claimed,
    Cancelled,
}

// Rating System
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Rating {
    pub id: Uuid,
    pub rater_id: Uuid,
    pub ratee_id: Uuid,
    pub shipment_id: Option<Uuid>,
    pub rating: i32,
    pub comment: Option<String>,
    pub blockchain_tx_hash: Option<String>,
    pub created_at: DateTime<Utc>,
}

// Payment
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Payment {
    pub id: Uuid,
    pub user_id: Uuid,
    pub shipment_id: Option<Uuid>,
    pub amount: f64,
    pub currency: String,
    pub payment_method: PaymentMethod,
    pub status: PaymentStatus,
    pub blockchain_tx_hash: Option<String>,
    pub created_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "payment_method", rename_all = "snake_case")]
pub enum PaymentMethod {
    Bitcoin,
    Ethereum,
    Usdt,
    Usdc,
    Bnb,
    Ada,
    Sol,
    Matic,
    CreditCard,
    BankTransfer,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "payment_status", rename_all = "snake_case")]
pub enum PaymentStatus {
    Pending,
    Processing,
    Completed,
    Failed,
    Refunded,
}

// Business Integration
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct BusinessIntegration {
    pub id: Uuid,
    pub user_id: Uuid,
    pub platform: IntegrationPlatform,
    pub api_key: String,
    pub api_secret: String,
    pub webhook_url: Option<String>,
    pub status: IntegrationStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "integration_platform", rename_all = "snake_case")]
pub enum IntegrationPlatform {
    Shopify,
    WooCommerce,
    Wix,
    EasyOrder,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "integration_status", rename_all = "snake_case")]
pub enum IntegrationStatus {
    Active,
    Inactive,
    Error,
}

// Additional enums for blockchain and crypto
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "crypto_currency", rename_all = "lowercase")]
pub enum CryptoCurrency {
    Bitcoin,
    Ethereum,
    Usdt,
    Usdc,
    Bnb,
    Ada,
    Sol,
    Matic,
    ICP,
    Worldcoin,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "payment_priority", rename_all = "lowercase")]
pub enum PaymentPriority {
    Low,
    Medium,
    High,
    Urgent,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "blockchain_network", rename_all = "lowercase")]
pub enum BlockchainNetwork {
    Ethereum,
    Polygon,
    BinanceSmartChain,
    Solana,
    Cardano,
    ICP,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "contract_type", rename_all = "lowercase")]
pub enum ContractType {
    ShipmentContract,
    PaymentContract,
    InsuranceContract,
    RatingContract,
    RewardContract,
    EscrowContract,
    MultiSigContract,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "contract_status", rename_all = "lowercase")]
pub enum ContractStatus {
    Deployed,
    Active,
    Paused,
    Terminated,
    Failed,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "defi_protocol", rename_all = "lowercase")]
pub enum DeFiProtocol {
    Uniswap,
    Compound,
    Aave,
    Maker,
    Curve,
    Balancer,
    SushiSwap,
    PancakeSwap,
    ICPProtocol,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "defi_status", rename_all = "lowercase")]
pub enum DeFiStatus {
    Active,
    Matured,
    Withdrawn,
    Liquidated,
    Paused,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "nft_type", rename_all = "lowercase")]
pub enum NFTType {
    Shipment,
    Document,
    Certificate,
    Reward,
    Insurance,
    Rating,
    Achievement,
    Membership,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "document_type", rename_all = "lowercase")]
pub enum DocumentType {
    Invoice,
    Receipt,
    Contract,
    Certificate,
    License,
    Passport,
    IdCard,
    DriverLicense,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "certificate_type", rename_all = "lowercase")]
pub enum CertificateType {
    Delivery,
    Quality,
    Authenticity,
    Origin,
    Compliance,
    Security,
    Insurance,
    Warranty,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "reward_type", rename_all = "lowercase")]
pub enum RewardType {
    Loyalty,
    Achievement,
    Referral,
    Bonus,
    Discount,
    Cashback,
    Points,
    Badge,
}
