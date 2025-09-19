use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    routing::{get, post, put},
    Router,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::Utc;
use anyhow::Result;
use tracing::{info, warn, error};

use crate::models::*;
use crate::config::Config;
use crate::database::Database;

#[derive(Debug, Clone)]
pub struct NFTService {
    db: Database,
}

impl NFTService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateShipmentNFTRequest {
    pub shipment_id: String,
    pub metadata: ShipmentNFTMetadata,
    pub blockchain: BlockchainNetwork,
    pub recipient_address: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateDocumentNFTRequest {
    pub document_type: DocumentType,
    pub document_data: serde_json::Value,
    pub blockchain: BlockchainNetwork,
    pub recipient_address: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateCertificateNFTRequest {
    pub certificate_type: CertificateType,
    pub certificate_data: serde_json::Value,
    pub blockchain: BlockchainNetwork,
    pub recipient_address: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateRewardNFTRequest {
    pub reward_type: RewardType,
    pub reward_data: serde_json::Value,
    pub blockchain: BlockchainNetwork,
    pub recipient_address: String,
}

#[derive(Debug, Deserialize)]
pub struct ShipmentNFTMetadata {
    pub shipment_number: String,
    pub sender_name: String,
    pub receiver_name: String,
    pub pickup_address: String,
    pub delivery_address: String,
    pub weight: f64,
    pub dimensions: String,
    pub description: String,
    pub value: f64,
    pub currency: String,
    pub status: String,
    pub created_at: String,
    pub delivery_date: Option<String>,
    pub tracking_history: Vec<TrackingEvent>,
}

#[derive(Debug, Deserialize)]
pub struct TrackingEvent {
    pub timestamp: String,
    pub location: String,
    pub status: String,
    pub description: String,
}

#[derive(Debug, Serialize)]
pub struct NFTResponse {
    pub id: String,
    pub nft_id: String,
    pub token_id: String,
    pub contract_address: String,
    pub blockchain: String,
    pub nft_type: String,
    pub metadata: serde_json::Value,
    pub owner_address: String,
    pub mint_tx_hash: String,
    pub transfer_tx_hash: Option<String>,
    pub status: String,
    pub created_at: String,
    pub transferred_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ShipmentNFTResponse {
    pub id: String,
    pub shipment_id: String,
    pub nft_id: String,
    pub token_id: String,
    pub contract_address: String,
    pub blockchain: String,
    pub metadata: ShipmentNFTMetadata,
    pub owner_address: String,
    pub mint_tx_hash: String,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct DocumentNFTResponse {
    pub id: String,
    pub document_id: String,
    pub nft_id: String,
    pub token_id: String,
    pub contract_address: String,
    pub blockchain: String,
    pub document_type: String,
    pub metadata: serde_json::Value,
    pub owner_address: String,
    pub mint_tx_hash: String,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct CertificateNFTResponse {
    pub id: String,
    pub certificate_id: String,
    pub nft_id: String,
    pub token_id: String,
    pub contract_address: String,
    pub blockchain: String,
    pub certificate_type: String,
    pub metadata: serde_json::Value,
    pub owner_address: String,
    pub mint_tx_hash: String,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct RewardNFTResponse {
    pub id: String,
    pub reward_id: String,
    pub nft_id: String,
    pub token_id: String,
    pub contract_address: String,
    pub blockchain: String,
    pub reward_type: String,
    pub metadata: serde_json::Value,
    pub owner_address: String,
    pub mint_tx_hash: String,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct NFTCollectionResponse {
    pub collection_id: String,
    pub collection_name: String,
    pub collection_symbol: String,
    pub contract_address: String,
    pub blockchain: String,
    pub total_supply: u64,
    pub total_minted: u64,
    pub owner_address: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct NFTMarketplaceResponse {
    pub listing_id: String,
    pub nft_id: String,
    pub token_id: String,
    pub contract_address: String,
    pub seller_address: String,
    pub price: f64,
    pub currency: String,
    pub status: String,
    pub created_at: String,
}

// Enum for NFT types
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
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

// Enum for document types
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
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

// Enum for certificate types
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
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

// Enum for reward types
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
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

pub async fn create_shipment_nft(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateShipmentNFTRequest>,
) -> Result<Json<ShipmentNFTResponse>, StatusCode> {
    info!("Creating shipment NFT for shipment: {}", payload.shipment_id);

    let nft_id = Uuid::new_v4();
    let shipment_id = Uuid::parse_str(&payload.shipment_id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Generate token ID
    let token_id = generate_token_id().await;

    // Mint NFT on blockchain
    let mint_result = mint_shipment_nft(
        &payload.metadata,
        &payload.blockchain,
        &token_id,
        &payload.recipient_address,
    ).await;

    let (contract_address, mint_tx_hash) = match mint_result {
        Ok(result) => (result.contract_address, result.tx_hash),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Save NFT record
    sqlx::query(
        r#"
        INSERT INTO shipment_nfts (
            id, shipment_id, nft_id, token_id, contract_address,
            blockchain, metadata, owner_address, mint_tx_hash, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        "#,
    )
    .bind(nft_id)
    .bind(shipment_id)
    .bind(nft_id)
    .bind(&token_id)
    .bind(&contract_address)
    .bind(&payload.blockchain)
    .bind(&serde_json::to_value(&payload.metadata).unwrap())
    .bind(&payload.recipient_address)
    .bind(&mint_tx_hash)
    .bind("minted")
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating shipment NFT: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = ShipmentNFTResponse {
        id: nft_id.to_string(),
        shipment_id: payload.shipment_id,
        nft_id: nft_id.to_string(),
        token_id,
        contract_address,
        blockchain: format!("{:?}", payload.blockchain).to_lowercase(),
        metadata: payload.metadata,
        owner_address: payload.recipient_address,
        mint_tx_hash,
        status: "minted".to_string(),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Shipment NFT created successfully: {}", nft_id);

    Ok(Json(response))
}

pub async fn create_document_nft(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateDocumentNFTRequest>,
) -> Result<Json<DocumentNFTResponse>, StatusCode> {
    info!("Creating document NFT: {:?}", payload.document_type);

    let nft_id = Uuid::new_v4();
    let document_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Generate token ID
    let token_id = generate_token_id().await;

    // Mint document NFT on blockchain
    let mint_result = mint_document_nft(
        &payload.document_type,
        &payload.document_data,
        &payload.blockchain,
        &token_id,
        &payload.recipient_address,
    ).await;

    let (contract_address, mint_tx_hash) = match mint_result {
        Ok(result) => (result.contract_address, result.tx_hash),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Save NFT record
    sqlx::query(
        r#"
        INSERT INTO document_nfts (
            id, document_id, nft_id, token_id, contract_address,
            blockchain, document_type, metadata, owner_address, mint_tx_hash, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        "#,
    )
    .bind(nft_id)
    .bind(document_id)
    .bind(nft_id)
    .bind(&token_id)
    .bind(&contract_address)
    .bind(&payload.blockchain)
    .bind(&payload.document_type)
    .bind(&payload.document_data)
    .bind(&payload.recipient_address)
    .bind(&mint_tx_hash)
    .bind("minted")
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating document NFT: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = DocumentNFTResponse {
        id: nft_id.to_string(),
        document_id: document_id.to_string(),
        nft_id: nft_id.to_string(),
        token_id,
        contract_address,
        blockchain: format!("{:?}", payload.blockchain).to_lowercase(),
        document_type: format!("{:?}", payload.document_type).to_lowercase(),
        metadata: payload.document_data,
        owner_address: payload.recipient_address,
        mint_tx_hash,
        status: "minted".to_string(),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Document NFT created successfully: {}", nft_id);

    Ok(Json(response))
}

pub async fn create_certificate_nft(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateCertificateNFTRequest>,
) -> Result<Json<CertificateNFTResponse>, StatusCode> {
    info!("Creating certificate NFT: {:?}", payload.certificate_type);

    let nft_id = Uuid::new_v4();
    let certificate_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Generate token ID
    let token_id = generate_token_id().await;

    // Mint certificate NFT on blockchain
    let mint_result = mint_certificate_nft(
        &payload.certificate_type,
        &payload.certificate_data,
        &payload.blockchain,
        &token_id,
        &payload.recipient_address,
    ).await;

    let (contract_address, mint_tx_hash) = match mint_result {
        Ok(result) => (result.contract_address, result.tx_hash),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Save NFT record
    sqlx::query(
        r#"
        INSERT INTO certificate_nfts (
            id, certificate_id, nft_id, token_id, contract_address,
            blockchain, certificate_type, metadata, owner_address, mint_tx_hash, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        "#,
    )
    .bind(nft_id)
    .bind(certificate_id)
    .bind(nft_id)
    .bind(&token_id)
    .bind(&contract_address)
    .bind(&payload.blockchain)
    .bind(&payload.certificate_type)
    .bind(&payload.certificate_data)
    .bind(&payload.recipient_address)
    .bind(&mint_tx_hash)
    .bind("minted")
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating certificate NFT: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = CertificateNFTResponse {
        id: nft_id.to_string(),
        certificate_id: certificate_id.to_string(),
        nft_id: nft_id.to_string(),
        token_id,
        contract_address,
        blockchain: format!("{:?}", payload.blockchain).to_lowercase(),
        certificate_type: format!("{:?}", payload.certificate_type).to_lowercase(),
        metadata: payload.certificate_data,
        owner_address: payload.recipient_address,
        mint_tx_hash,
        status: "minted".to_string(),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Certificate NFT created successfully: {}", nft_id);

    Ok(Json(response))
}

pub async fn create_reward_nft(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateRewardNFTRequest>,
) -> Result<Json<RewardNFTResponse>, StatusCode> {
    info!("Creating reward NFT: {:?}", payload.reward_type);

    let nft_id = Uuid::new_v4();
    let reward_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Generate token ID
    let token_id = generate_token_id().await;

    // Mint reward NFT on blockchain
    let mint_result = mint_reward_nft(
        &payload.reward_type,
        &payload.reward_data,
        &payload.blockchain,
        &token_id,
        &payload.recipient_address,
    ).await;

    let (contract_address, mint_tx_hash) = match mint_result {
        Ok(result) => (result.contract_address, result.tx_hash),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Save NFT record
    sqlx::query(
        r#"
        INSERT INTO reward_nfts (
            id, reward_id, nft_id, token_id, contract_address,
            blockchain, reward_type, metadata, owner_address, mint_tx_hash, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        "#,
    )
    .bind(nft_id)
    .bind(reward_id)
    .bind(nft_id)
    .bind(&token_id)
    .bind(&contract_address)
    .bind(&payload.blockchain)
    .bind(&payload.reward_type)
    .bind(&payload.reward_data)
    .bind(&payload.recipient_address)
    .bind(&mint_tx_hash)
    .bind("minted")
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating reward NFT: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = RewardNFTResponse {
        id: nft_id.to_string(),
        reward_id: reward_id.to_string(),
        nft_id: nft_id.to_string(),
        token_id,
        contract_address,
        blockchain: format!("{:?}", payload.blockchain).to_lowercase(),
        reward_type: format!("{:?}", payload.reward_type).to_lowercase(),
        metadata: payload.reward_data,
        owner_address: payload.recipient_address,
        mint_tx_hash,
        status: "minted".to_string(),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Reward NFT created successfully: {}", nft_id);

    Ok(Json(response))
}

pub async fn get_nft_collections(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<NFTCollectionResponse>>, StatusCode> {
    info!("Fetching NFT collections");

    let blockchain = params.get("blockchain").and_then(|v| v.as_str());
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(50);

    // Mock NFT collections
    let collections = vec![
        NFTCollectionResponse {
            collection_id: "collection_1".to_string(),
            collection_name: "Web3 Shipping Shipments".to_string(),
            collection_symbol: "W3SS".to_string(),
            contract_address: "0x1234567890123456789012345678901234567890".to_string(),
            blockchain: "ethereum".to_string(),
            total_supply: 10000,
            total_minted: 1500,
            owner_address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd".to_string(),
            created_at: Utc::now().to_rfc3339(),
        },
        NFTCollectionResponse {
            collection_id: "collection_2".to_string(),
            collection_name: "Delivery Certificates".to_string(),
            collection_symbol: "DELC".to_string(),
            contract_address: "0x2345678901234567890123456789012345678901".to_string(),
            blockchain: "polygon".to_string(),
            total_supply: 5000,
            total_minted: 800,
            owner_address: "0xbcdefabcdefabcdefabcdefabcdefabcdefabcde".to_string(),
            created_at: Utc::now().to_rfc3339(),
        },
    ];

    Ok(Json(collections))
}

pub async fn list_nft_on_marketplace(
    State(state): State<crate::AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<NFTMarketplaceResponse>, StatusCode> {
    info!("Listing NFT on marketplace");

    let listing_id = Uuid::new_v4();
    let nft_id = payload.get("nft_id").and_then(|v| v.as_str()).unwrap_or("");
    let token_id = payload.get("token_id").and_then(|v| v.as_str()).unwrap_or("");
    let contract_address = payload.get("contract_address").and_then(|v| v.as_str()).unwrap_or("");
    let seller_address = payload.get("seller_address").and_then(|v| v.as_str()).unwrap_or("");
    let price = payload.get("price").and_then(|v| v.as_f64()).unwrap_or(0.0);
    let currency = payload.get("currency").and_then(|v| v.as_str()).unwrap_or("ETH");

    // List NFT on marketplace
    let listing_result = list_nft_on_blockchain_marketplace(
        nft_id,
        token_id,
        contract_address,
        seller_address,
        price,
        currency,
    ).await;

    let listing_tx_hash = match listing_result {
        Ok(tx_hash) => tx_hash,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Save marketplace listing
    sqlx::query(
        r#"
        INSERT INTO nft_marketplace_listings (
            id, nft_id, token_id, contract_address, seller_address,
            price, currency, status, listing_tx_hash, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        "#,
    )
    .bind(listing_id)
    .bind(nft_id)
    .bind(token_id)
    .bind(contract_address)
    .bind(seller_address)
    .bind(price)
    .bind(currency)
    .bind("active")
    .bind(listing_tx_hash)
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error listing NFT: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = NFTMarketplaceResponse {
        listing_id: listing_id.to_string(),
        nft_id: nft_id.to_string(),
        token_id: token_id.to_string(),
        contract_address: contract_address.to_string(),
        seller_address: seller_address.to_string(),
        price,
        currency: currency.to_string(),
        status: "active".to_string(),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("NFT listed on marketplace successfully: {}", listing_id);

    Ok(Json(response))
}

pub async fn transfer_nft(
    State(state): State<crate::AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Transferring NFT");

    let nft_id = payload.get("nft_id").and_then(|v| v.as_str()).unwrap_or("");
    let token_id = payload.get("token_id").and_then(|v| v.as_str()).unwrap_or("");
    let contract_address = payload.get("contract_address").and_then(|v| v.as_str()).unwrap_or("");
    let from_address = payload.get("from_address").and_then(|v| v.as_str()).unwrap_or("");
    let to_address = payload.get("to_address").and_then(|v| v.as_str()).unwrap_or("");

    // Transfer NFT on blockchain
    let transfer_result = transfer_nft_on_blockchain(
        nft_id,
        token_id,
        contract_address,
        from_address,
        to_address,
    ).await;

    let transfer_tx_hash = match transfer_result {
        Ok(tx_hash) => tx_hash,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Update NFT ownership
    sqlx::query(
        "UPDATE shipment_nfts SET owner_address = $1, transfer_tx_hash = $2, transferred_at = $3 WHERE nft_id = $4"
    )
    .bind(to_address)
    .bind(&transfer_tx_hash)
    .bind(Utc::now())
    .bind(nft_id)
    .execute(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    info!("NFT transferred successfully: {}", nft_id);

    Ok(Json(serde_json::json!({
        "status": "success",
        "message": "NFT transferred successfully",
        "transfer_tx_hash": transfer_tx_hash
    })))
}

// Helper functions

async fn generate_token_id() -> String {
    format!("{}", rand::random::<u64>())
}

async fn mint_shipment_nft(
    metadata: &ShipmentNFTMetadata,
    blockchain: &BlockchainNetwork,
    token_id: &str,
    recipient: &str,
) -> Result<NFTMintResult> {
    Ok(NFTMintResult {
        contract_address: format!("0x{:x}", rand::random::<u64>()),
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
    })
}

async fn mint_document_nft(
    document_type: &DocumentType,
    document_data: &serde_json::Value,
    blockchain: &BlockchainNetwork,
    token_id: &str,
    recipient: &str,
) -> Result<NFTMintResult> {
    Ok(NFTMintResult {
        contract_address: format!("0x{:x}", rand::random::<u64>()),
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
    })
}

async fn mint_certificate_nft(
    certificate_type: &CertificateType,
    certificate_data: &serde_json::Value,
    blockchain: &BlockchainNetwork,
    token_id: &str,
    recipient: &str,
) -> Result<NFTMintResult> {
    Ok(NFTMintResult {
        contract_address: format!("0x{:x}", rand::random::<u64>()),
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
    })
}

async fn mint_reward_nft(
    reward_type: &RewardType,
    reward_data: &serde_json::Value,
    blockchain: &BlockchainNetwork,
    token_id: &str,
    recipient: &str,
) -> Result<NFTMintResult> {
    Ok(NFTMintResult {
        contract_address: format!("0x{:x}", rand::random::<u64>()),
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
    })
}

async fn list_nft_on_blockchain_marketplace(
    nft_id: &str,
    token_id: &str,
    contract_address: &str,
    seller_address: &str,
    price: f64,
    currency: &str,
) -> Result<String> {
    Ok(format!("0x{:x}", rand::random::<u64>()))
}

async fn transfer_nft_on_blockchain(
    nft_id: &str,
    token_id: &str,
    contract_address: &str,
    from_address: &str,
    to_address: &str,
) -> Result<String> {
    Ok(format!("0x{:x}", rand::random::<u64>()))
}

#[derive(Debug)]
struct NFTMintResult {
    contract_address: String,
    tx_hash: String,
}
