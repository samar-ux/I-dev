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
pub struct BlockchainPaymentService {
    db: Database,
}

impl BlockchainPaymentService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateCryptoPaymentRequest {
    pub shipment_id: Option<String>,
    pub amount: f64,
    pub currency: CryptoCurrency,
    pub recipient_address: String,
    pub gas_fee: Option<f64>,
    pub priority: PaymentPriority,
}

#[derive(Debug, Deserialize)]
pub struct CreateICPPaymentRequest {
    pub shipment_id: Option<String>,
    pub amount: f64,
    pub recipient_principal: String,
    pub memo: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateNFTPaymentRequest {
    pub shipment_id: Option<String>,
    pub nft_metadata: serde_json::Value,
    pub recipient_address: String,
    pub blockchain: BlockchainNetwork,
}

#[derive(Debug, Serialize)]
pub struct CryptoPaymentResponse {
    pub id: String,
    pub user_id: String,
    pub shipment_id: Option<String>,
    pub amount: f64,
    pub currency: String,
    pub recipient_address: String,
    pub blockchain_tx_hash: String,
    pub gas_fee: f64,
    pub status: String,
    pub block_number: Option<u64>,
    pub confirmation_count: u32,
    pub created_at: String,
    pub completed_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ICPPaymentResponse {
    pub id: String,
    pub user_id: String,
    pub shipment_id: Option<String>,
    pub amount: f64,
    pub recipient_principal: String,
    pub icp_tx_hash: String,
    pub memo: Option<String>,
    pub status: String,
    pub created_at: String,
    pub completed_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct NFTPaymentResponse {
    pub id: String,
    pub user_id: String,
    pub shipment_id: Option<String>,
    pub nft_id: String,
    pub nft_metadata: serde_json::Value,
    pub recipient_address: String,
    pub blockchain: String,
    pub mint_tx_hash: String,
    pub transfer_tx_hash: String,
    pub status: String,
    pub created_at: String,
    pub completed_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct CryptoBalanceResponse {
    pub address: String,
    pub currency: String,
    pub balance: f64,
    pub usd_value: f64,
    pub last_updated: String,
}

#[derive(Debug, Serialize)]
pub struct ICPBalanceResponse {
    pub principal: String,
    pub balance: f64,
    pub cycles: u64,
    pub usd_value: f64,
    pub last_updated: String,
}

#[derive(Debug, Serialize)]
pub struct DeFiYieldResponse {
    pub protocol: String,
    pub apy: f64,
    pub total_value_locked: f64,
    pub rewards: f64,
    pub staking_period: u32,
}

#[derive(Debug, Serialize)]
pub struct SmartContractResponse {
    pub contract_address: String,
    pub function_name: String,
    pub parameters: serde_json::Value,
    pub gas_estimate: u64,
    pub execution_result: serde_json::Value,
}

// Enum for supported cryptocurrencies
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
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

// Enum for payment priority
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "payment_priority", rename_all = "lowercase")]
pub enum PaymentPriority {
    Low,
    Medium,
    High,
    Urgent,
}

// Enum for blockchain networks
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "blockchain_network", rename_all = "lowercase")]
pub enum BlockchainNetwork {
    Ethereum,
    Polygon,
    BinanceSmartChain,
    Solana,
    Cardano,
    ICP,
}

pub async fn create_crypto_payment(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateCryptoPaymentRequest>,
) -> Result<Json<CryptoPaymentResponse>, StatusCode> {
    info!("Creating crypto payment: {} {}", payload.amount, format!("{:?}", payload.currency));

    // Validate amount
    if payload.amount <= 0.0 {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Validate recipient address
    if !validate_crypto_address(&payload.recipient_address, &payload.currency).await {
        return Err(StatusCode::BAD_REQUEST);
    }

    let payment_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Parse shipment_id if provided
    let shipment_id = if let Some(sid) = payload.shipment_id {
        Some(Uuid::parse_str(&sid).map_err(|_| StatusCode::BAD_REQUEST)?)
    } else {
        None
    };

    // Calculate gas fee based on priority
    let gas_fee = calculate_gas_fee(&payload.currency, &payload.priority).await;

    // Create blockchain transaction
    let tx_result = create_blockchain_transaction(
        &payload.currency,
        &payload.recipient_address,
        payload.amount,
        gas_fee,
    ).await;

    let (tx_hash, block_number) = match tx_result {
        Ok(result) => (result.tx_hash, Some(result.block_number)),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Create payment record
    sqlx::query(
        r#"
        INSERT INTO crypto_payments (
            id, user_id, shipment_id, amount, currency, recipient_address,
            blockchain_tx_hash, gas_fee, status, block_number, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        "#,
    )
    .bind(payment_id)
    .bind(user_id)
    .bind(shipment_id)
    .bind(payload.amount)
    .bind(&payload.currency)
    .bind(&payload.recipient_address)
    .bind(&tx_hash)
    .bind(gas_fee)
    .bind("pending")
    .bind(block_number)
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating crypto payment: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    // Monitor transaction confirmation
    tokio::spawn(monitor_transaction_confirmation(payment_id, tx_hash.clone()));

    let response = CryptoPaymentResponse {
        id: payment_id.to_string(),
        user_id: user_id.to_string(),
        shipment_id: payload.shipment_id,
        amount: payload.amount,
        currency: format!("{:?}", payload.currency).to_lowercase(),
        recipient_address: payload.recipient_address,
        blockchain_tx_hash: tx_hash,
        gas_fee,
        status: "pending".to_string(),
        block_number,
        confirmation_count: 0,
        created_at: Utc::now().to_rfc3339(),
        completed_at: None,
    };

    info!("Crypto payment created successfully: {}", payment_id);

    Ok(Json(response))
}

pub async fn create_icp_payment(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateICPPaymentRequest>,
) -> Result<Json<ICPPaymentResponse>, StatusCode> {
    info!("Creating ICP payment: {} ICP to {}", payload.amount, payload.recipient_principal);

    // Validate amount
    if payload.amount <= 0.0 {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Validate ICP principal
    if !validate_icp_principal(&payload.recipient_principal).await {
        return Err(StatusCode::BAD_REQUEST);
    }

    let payment_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Parse shipment_id if provided
    let shipment_id = if let Some(sid) = payload.shipment_id {
        Some(Uuid::parse_str(&sid).map_err(|_| StatusCode::BAD_REQUEST)?)
    } else {
        None
    };

    // Create ICP transaction
    let icp_result = create_icp_transaction(
        &payload.recipient_principal,
        payload.amount,
        payload.memo.as_deref(),
    ).await;

    let icp_tx_hash = match icp_result {
        Ok(hash) => hash,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Create payment record
    sqlx::query(
        r#"
        INSERT INTO icp_payments (
            id, user_id, shipment_id, amount, recipient_principal,
            icp_tx_hash, memo, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#,
    )
    .bind(payment_id)
    .bind(user_id)
    .bind(shipment_id)
    .bind(payload.amount)
    .bind(&payload.recipient_principal)
    .bind(&icp_tx_hash)
    .bind(&payload.memo)
    .bind("pending")
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating ICP payment: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    // Monitor ICP transaction
    tokio::spawn(monitor_icp_transaction(payment_id, icp_tx_hash.clone()));

    let response = ICPPaymentResponse {
        id: payment_id.to_string(),
        user_id: user_id.to_string(),
        shipment_id: payload.shipment_id,
        amount: payload.amount,
        recipient_principal: payload.recipient_principal,
        icp_tx_hash,
        memo: payload.memo,
        status: "pending".to_string(),
        created_at: Utc::now().to_rfc3339(),
        completed_at: None,
    };

    info!("ICP payment created successfully: {}", payment_id);

    Ok(Json(response))
}

pub async fn create_nft_payment(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateNFTPaymentRequest>,
) -> Result<Json<NFTPaymentResponse>, StatusCode> {
    info!("Creating NFT payment for shipment: {:?}", payload.shipment_id);

    let payment_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user
    let nft_id = Uuid::new_v4();

    // Parse shipment_id if provided
    let shipment_id = if let Some(sid) = payload.shipment_id {
        Some(Uuid::parse_str(&sid).map_err(|_| StatusCode::BAD_REQUEST)?)
    } else {
        None
    };

    // Mint NFT
    let mint_result = mint_nft(&payload.nft_metadata, &payload.blockchain).await;
    let mint_tx_hash = match mint_result {
        Ok(hash) => hash,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Transfer NFT to recipient
    let transfer_result = transfer_nft(&nft_id, &payload.recipient_address, &payload.blockchain).await;
    let transfer_tx_hash = match transfer_result {
        Ok(hash) => hash,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Create payment record
    sqlx::query(
        r#"
        INSERT INTO nft_payments (
            id, user_id, shipment_id, nft_id, nft_metadata,
            recipient_address, blockchain, mint_tx_hash, transfer_tx_hash, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        "#,
    )
    .bind(payment_id)
    .bind(user_id)
    .bind(shipment_id)
    .bind(nft_id)
    .bind(&payload.nft_metadata)
    .bind(&payload.recipient_address)
    .bind(&payload.blockchain)
    .bind(&mint_tx_hash)
    .bind(&transfer_tx_hash)
    .bind("completed")
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating NFT payment: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = NFTPaymentResponse {
        id: payment_id.to_string(),
        user_id: user_id.to_string(),
        shipment_id: payload.shipment_id,
        nft_id: nft_id.to_string(),
        nft_metadata: payload.nft_metadata,
        recipient_address: payload.recipient_address,
        blockchain: format!("{:?}", payload.blockchain).to_lowercase(),
        mint_tx_hash,
        transfer_tx_hash,
        status: "completed".to_string(),
        created_at: Utc::now().to_rfc3339(),
        completed_at: Some(Utc::now().to_rfc3339()),
    };

    info!("NFT payment created successfully: {}", payment_id);

    Ok(Json(response))
}

pub async fn get_crypto_balance(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<CryptoBalanceResponse>, StatusCode> {
    info!("Fetching crypto balance");

    let address = params.get("address").and_then(|v| v.as_str()).unwrap_or("");
    let currency = params.get("currency").and_then(|v| v.as_str()).unwrap_or("ETH");

    // Get balance from blockchain
    let balance = get_blockchain_balance(address, currency).await;
    let usd_value = balance * get_crypto_price(currency).await;

    let response = CryptoBalanceResponse {
        address: address.to_string(),
        currency: currency.to_string(),
        balance,
        usd_value,
        last_updated: Utc::now().to_rfc3339(),
    };

    Ok(Json(response))
}

pub async fn get_icp_balance(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<ICPBalanceResponse>, StatusCode> {
    info!("Fetching ICP balance");

    let principal = params.get("principal").and_then(|v| v.as_str()).unwrap_or("");

    // Get ICP balance and cycles
    let (balance, cycles) = get_icp_account_balance(principal).await;
    let usd_value = balance * get_crypto_price("ICP").await;

    let response = ICPBalanceResponse {
        principal: principal.to_string(),
        balance,
        cycles,
        usd_value,
        last_updated: Utc::now().to_rfc3339(),
    };

    Ok(Json(response))
}

pub async fn get_defi_yields(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<DeFiYieldResponse>>, StatusCode> {
    info!("Fetching DeFi yields");

    let protocol = params.get("protocol").and_then(|v| v.as_str()).unwrap_or("all");

    // Mock DeFi yield data
    let yields = vec![
        DeFiYieldResponse {
            protocol: "Uniswap V3".to_string(),
            apy: 12.5,
            total_value_locked: 2500000.0,
            rewards: 150.0,
            staking_period: 30,
        },
        DeFiYieldResponse {
            protocol: "Compound".to_string(),
            apy: 8.7,
            total_value_locked: 1800000.0,
            rewards: 95.0,
            staking_period: 14,
        },
        DeFiYieldResponse {
            protocol: "Aave".to_string(),
            apy: 15.2,
            total_value_locked: 3200000.0,
            rewards: 200.0,
            staking_period: 7,
        },
    ];

    Ok(Json(yields))
}

pub async fn execute_smart_contract(
    State(state): State<crate::AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<SmartContractResponse>, StatusCode> {
    info!("Executing smart contract");

    let contract_address = payload.get("contract_address").and_then(|v| v.as_str()).unwrap_or("");
    let function_name = payload.get("function_name").and_then(|v| v.as_str()).unwrap_or("");
    let parameters = payload.get("parameters").unwrap_or(&serde_json::Value::Null);

    // Execute smart contract function
    let result = execute_contract_function(contract_address, function_name, parameters).await;

    let (gas_estimate, execution_result) = match result {
        Ok(res) => (res.gas_estimate, res.result),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let response = SmartContractResponse {
        contract_address: contract_address.to_string(),
        function_name: function_name.to_string(),
        parameters: parameters.clone(),
        gas_estimate,
        execution_result,
    };

    Ok(Json(response))
}

// Helper functions

async fn validate_crypto_address(address: &str, currency: &CryptoCurrency) -> bool {
    match currency {
        CryptoCurrency::Bitcoin => address.starts_with("1") || address.starts_with("3") || address.starts_with("bc1"),
        CryptoCurrency::Ethereum => address.starts_with("0x") && address.len() == 42,
        CryptoCurrency::Usdt | CryptoCurrency::Usdc => address.starts_with("0x") && address.len() == 42,
        CryptoCurrency::Bnb => address.starts_with("0x") && address.len() == 42,
        CryptoCurrency::Ada => address.starts_with("addr1"),
        CryptoCurrency::Sol => address.len() == 44,
        CryptoCurrency::Matic => address.starts_with("0x") && address.len() == 42,
        CryptoCurrency::ICP => address.len() > 20,
        CryptoCurrency::Worldcoin => address.starts_with("0x") && address.len() == 42,
    }
}

async fn validate_icp_principal(principal: &str) -> bool {
    principal.len() > 20 && principal.chars().all(|c| c.is_alphanumeric())
}

async fn calculate_gas_fee(currency: &CryptoCurrency, priority: &PaymentPriority) -> f64 {
    let base_fee = match currency {
        CryptoCurrency::Ethereum => 0.02,
        CryptoCurrency::Usdt | CryptoCurrency::Usdc => 0.01,
        CryptoCurrency::Bnb => 0.005,
        CryptoCurrency::Matic => 0.001,
        _ => 0.01,
    };

    let multiplier = match priority {
        PaymentPriority::Low => 1.0,
        PaymentPriority::Medium => 1.5,
        PaymentPriority::High => 2.0,
        PaymentPriority::Urgent => 3.0,
    };

    base_fee * multiplier
}

async fn create_blockchain_transaction(
    currency: &CryptoCurrency,
    recipient: &str,
    amount: f64,
    gas_fee: f64,
) -> Result<TransactionResult> {
    // In a real implementation, this would create actual blockchain transactions
    Ok(TransactionResult {
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
        block_number: rand::random::<u64>() % 1000000,
    })
}

async fn create_icp_transaction(
    recipient: &str,
    amount: f64,
    memo: Option<&str>,
) -> Result<String> {
    // In a real implementation, this would create ICP transactions
    Ok(format!("icp_tx_{}", rand::random::<u64>()))
}

async fn mint_nft(metadata: &serde_json::Value, blockchain: &BlockchainNetwork) -> Result<String> {
    // In a real implementation, this would mint NFTs
    Ok(format!("nft_mint_{}", rand::random::<u64>()))
}

async fn transfer_nft(nft_id: &Uuid, recipient: &str, blockchain: &BlockchainNetwork) -> Result<String> {
    // In a real implementation, this would transfer NFTs
    Ok(format!("nft_transfer_{}", rand::random::<u64>()))
}

async fn get_blockchain_balance(address: &str, currency: &str) -> f64 {
    // In a real implementation, this would query blockchain
    match currency {
        "ETH" => 1.5,
        "BTC" => 0.05,
        "USDT" => 1000.0,
        "USDC" => 500.0,
        "ICP" => 100.0,
        _ => 0.0,
    }
}

async fn get_crypto_price(currency: &str) -> f64 {
    // In a real implementation, this would fetch from price API
    match currency {
        "ETH" => 2000.0,
        "BTC" => 45000.0,
        "USDT" => 1.0,
        "USDC" => 1.0,
        "ICP" => 5.0,
        _ => 0.0,
    }
}

async fn get_icp_account_balance(principal: &str) -> (f64, u64) {
    // In a real implementation, this would query ICP
    (100.0, 1000000)
}

async fn execute_contract_function(
    contract_address: &str,
    function_name: &str,
    parameters: &serde_json::Value,
) -> Result<ContractExecutionResult> {
    // In a real implementation, this would execute smart contracts
    Ok(ContractExecutionResult {
        gas_estimate: 100000,
        result: serde_json::json!({"success": true, "data": "execution_result"}),
    })
}

async fn monitor_transaction_confirmation(payment_id: Uuid, tx_hash: String) {
    // Monitor transaction confirmation
    tokio::time::sleep(tokio::time::Duration::from_secs(30)).await;
    info!("Transaction {} confirmed", tx_hash);
}

async fn monitor_icp_transaction(payment_id: Uuid, tx_hash: String) {
    // Monitor ICP transaction
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
    info!("ICP transaction {} confirmed", tx_hash);
}

#[derive(Debug)]
struct TransactionResult {
    tx_hash: String,
    block_number: u64,
}

#[derive(Debug)]
struct ContractExecutionResult {
    gas_estimate: u64,
    result: serde_json::Value,
}
