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
pub struct Web3Service {
    config: Config,
}

impl Web3Service {
    pub fn new(config: &Config) -> Self {
        Self {
            config: config.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct WalletConnectRequest {
    pub wallet_address: String,
    pub signature: String,
    pub message: String,
    pub chain_id: u64,
}

#[derive(Debug, Deserialize)]
pub struct TransactionRequest {
    pub to: String,
    pub amount: String,
    pub currency: String,
    pub gas_price: Option<String>,
    pub gas_limit: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct NFTMintRequest {
    pub shipment_id: String,
    pub metadata: serde_json::Value,
    pub recipient: String,
}

#[derive(Debug, Serialize)]
pub struct WalletResponse {
    pub address: String,
    pub balance: String,
    pub currency: String,
    pub chain_id: u64,
    pub connected_at: String,
}

#[derive(Debug, Serialize)]
pub struct TransactionResponse {
    pub tx_hash: String,
    pub status: String,
    pub gas_used: String,
    pub block_number: Option<u64>,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct NFTResponse {
    pub token_id: String,
    pub contract_address: String,
    pub metadata: serde_json::Value,
    pub owner: String,
    pub tx_hash: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct ICPConnectRequest {
    pub principal: String,
    pub signature: String,
    pub delegation: String,
}

#[derive(Debug, Deserialize)]
pub struct ICPCallRequest {
    pub canister_id: String,
    pub method: String,
    pub args: serde_json::Value,
}

pub async fn connect_wallet(
    State(state): State<crate::AppState>,
    Json(payload): Json<WalletConnectRequest>,
) -> Result<Json<WalletResponse>, StatusCode> {
    info!("Wallet connection request for address: {}", payload.wallet_address);

    // Verify signature
    if !verify_wallet_signature(&payload).await {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // Get wallet balance
    let balance = get_wallet_balance(&payload.wallet_address, &payload.chain_id).await
        .unwrap_or_else(|_| "0".to_string());

    let response = WalletResponse {
        address: payload.wallet_address,
        balance,
        currency: "ETH".to_string(), // Default to ETH
        chain_id: payload.chain_id,
        connected_at: Utc::now().to_rfc3339(),
    };

    info!("Wallet connected successfully: {}", payload.wallet_address);

    Ok(Json(response))
}

pub async fn get_balance(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let address = params.get("address")
        .and_then(|v| v.as_str())
        .ok_or(StatusCode::BAD_REQUEST)?;

    let chain_id = params.get("chain_id")
        .and_then(|v| v.as_u64())
        .unwrap_or(1);

    let balance = get_wallet_balance(address, &chain_id).await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(serde_json::json!({
        "address": address,
        "balance": balance,
        "chain_id": chain_id,
        "currency": "ETH"
    })))
}

pub async fn send_transaction(
    State(state): State<crate::AppState>,
    Json(payload): Json<TransactionRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    info!("Transaction request: {} -> {} ({})", 
          payload.to, payload.amount, payload.currency);

    // Validate transaction
    if payload.to.is_empty() || payload.amount.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Send transaction to blockchain
    let tx_result = send_blockchain_transaction(&payload).await
        .map_err(|e| {
            error!("Transaction failed: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let response = TransactionResponse {
        tx_hash: tx_result.hash,
        status: "pending".to_string(),
        gas_used: tx_result.gas_used,
        block_number: tx_result.block_number,
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Transaction sent successfully: {}", tx_result.hash);

    Ok(Json(response))
}

pub async fn mint_nft(
    State(state): State<crate::AppState>,
    Json(payload): Json<NFTMintRequest>,
) -> Result<Json<NFTResponse>, StatusCode> {
    info!("NFT mint request for shipment: {}", payload.shipment_id);

    let shipment_id = Uuid::parse_str(&payload.shipment_id)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    // Verify shipment exists
    let shipment_exists = sqlx::query("SELECT id FROM shipments WHERE id = $1")
        .bind(shipment_id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .is_some();

    if !shipment_exists {
        return Err(StatusCode::NOT_FOUND);
    }

    // Mint NFT
    let nft_result = mint_shipment_nft(&payload).await
        .map_err(|e| {
            error!("NFT minting failed: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    // Update shipment with NFT token ID
    sqlx::query("UPDATE shipments SET nft_token_id = $1, blockchain_tx_hash = $2 WHERE id = $3")
        .bind(&nft_result.token_id)
        .bind(&nft_result.tx_hash)
        .bind(shipment_id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = NFTResponse {
        token_id: nft_result.token_id,
        contract_address: nft_result.contract_address,
        metadata: payload.metadata,
        owner: payload.recipient,
        tx_hash: nft_result.tx_hash,
        created_at: Utc::now().to_rfc3339(),
    };

    info!("NFT minted successfully: {}", nft_result.token_id);

    Ok(Json(response))
}

pub async fn get_nft(
    State(state): State<crate::AppState>,
    Path(token_id): Path<String>,
) -> Result<Json<NFTResponse>, StatusCode> {
    info!("NFT fetch request for token: {}", token_id);

    // Get NFT data from blockchain
    let nft_data = get_nft_from_blockchain(&token_id).await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    let response = NFTResponse {
        token_id,
        contract_address: nft_data.contract_address,
        metadata: nft_data.metadata,
        owner: nft_data.owner,
        tx_hash: nft_data.tx_hash,
        created_at: nft_data.created_at,
    };

    Ok(Json(response))
}

// ICP Integration

pub async fn connect_icp(
    State(state): State<crate::AppState>,
    Json(payload): Json<ICPConnectRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("ICP connection request for principal: {}", payload.principal);

    // Verify ICP signature
    if !verify_icp_signature(&payload).await {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // Get ICP account info
    let account_info = get_icp_account_info(&payload.principal).await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(serde_json::json!({
        "principal": payload.principal,
        "account_id": account_info.account_id,
        "balance": account_info.balance,
        "connected_at": Utc::now().to_rfc3339()
    })))
}

pub async fn get_canister(
    State(state): State<crate::AppState>,
    Path(canister_id): Path<String>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Canister fetch request: {}", canister_id);

    let canister_info = get_icp_canister_info(&canister_id).await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(serde_json::json!({
        "canister_id": canister_id,
        "status": canister_info.status,
        "memory_size": canister_info.memory_size,
        "cycles": canister_info.cycles,
        "controllers": canister_info.controllers
    })))
}

pub async fn call_canister(
    State(state): State<crate::AppState>,
    Json(payload): Json<ICPCallRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("ICP canister call: {} -> {}", payload.canister_id, payload.method);

    let call_result = call_icp_canister_method(&payload).await
        .map_err(|e| {
            error!("ICP canister call failed: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(Json(serde_json::json!({
        "canister_id": payload.canister_id,
        "method": payload.method,
        "result": call_result.result,
        "tx_id": call_result.tx_id,
        "called_at": Utc::now().to_rfc3339()
    })))
}

// Helper structures and functions

#[derive(Debug)]
struct TransactionResult {
    hash: String,
    gas_used: String,
    block_number: Option<u64>,
}

#[derive(Debug)]
struct NFTMintResult {
    token_id: String,
    contract_address: String,
    tx_hash: String,
}

#[derive(Debug)]
struct NFTData {
    contract_address: String,
    metadata: serde_json::Value,
    owner: String,
    tx_hash: String,
    created_at: String,
}

#[derive(Debug)]
struct ICPAccountInfo {
    account_id: String,
    balance: String,
}

#[derive(Debug)]
struct ICPCanisterInfo {
    status: String,
    memory_size: u64,
    cycles: u64,
    controllers: Vec<String>,
}

#[derive(Debug)]
struct ICPCallResult {
    result: serde_json::Value,
    tx_id: String,
}

async fn verify_wallet_signature(request: &WalletConnectRequest) -> bool {
    // In a real implementation, you would:
    // 1. Recover the signer from the signature
    // 2. Verify it matches the wallet address
    // 3. Verify the message hash
    
    // For now, we'll simulate verification
    !request.signature.is_empty() && !request.wallet_address.is_empty()
}

async fn get_wallet_balance(address: &str, chain_id: &u64) -> Result<String> {
    // In a real implementation, you would:
    // 1. Connect to the appropriate blockchain RPC
    // 2. Query the balance for the address
    // 3. Convert from wei to ether
    
    // For now, we'll simulate a balance
    Ok("1.5".to_string())
}

async fn send_blockchain_transaction(request: &TransactionRequest) -> Result<TransactionResult> {
    // In a real implementation, you would:
    // 1. Create a transaction object
    // 2. Sign it with the private key
    // 3. Send it to the blockchain
    // 4. Wait for confirmation
    
    // For now, we'll simulate a transaction
    Ok(TransactionResult {
        hash: format!("0x{:x}", rand::random::<u64>()),
        gas_used: "21000".to_string(),
        block_number: Some(12345678),
    })
}

async fn mint_shipment_nft(request: &NFTMintRequest) -> Result<NFTMintResult> {
    // In a real implementation, you would:
    // 1. Deploy or use existing NFT contract
    // 2. Call the mint function
    // 3. Wait for transaction confirmation
    // 4. Return the token ID and transaction hash
    
    // For now, we'll simulate NFT minting
    Ok(NFTMintResult {
        token_id: format!("{}", rand::random::<u64>()),
        contract_address: "0x1234567890123456789012345678901234567890".to_string(),
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
    })
}

async fn get_nft_from_blockchain(token_id: &str) -> Result<NFTData> {
    // In a real implementation, you would:
    // 1. Query the NFT contract
    // 2. Get token metadata
    // 3. Get owner information
    
    // For now, we'll simulate NFT data
    Ok(NFTData {
        contract_address: "0x1234567890123456789012345678901234567890".to_string(),
        metadata: serde_json::json!({
            "name": "Shipment NFT",
            "description": "NFT representing a shipped package",
            "image": "https://example.com/shipment-image.png"
        }),
        owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd".to_string(),
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
        created_at: Utc::now().to_rfc3339(),
    })
}

async fn verify_icp_signature(request: &ICPConnectRequest) -> bool {
    // In a real implementation, you would:
    // 1. Verify the ICP signature
    // 2. Check the delegation chain
    // 3. Validate the principal format
    
    // For now, we'll simulate verification
    !request.signature.is_empty() && !request.principal.is_empty()
}

async fn get_icp_account_info(principal: &str) -> Result<ICPAccountInfo> {
    // In a real implementation, you would:
    // 1. Connect to ICP network
    // 2. Query account information
    // 3. Get balance and account details
    
    // For now, we'll simulate account info
    Ok(ICPAccountInfo {
        account_id: format!("account_{}", &principal[..8]),
        balance: "100.0".to_string(),
    })
}

async fn get_icp_canister_info(canister_id: &str) -> Result<ICPCanisterInfo> {
    // In a real implementation, you would:
    // 1. Query canister information
    // 2. Get status and metadata
    // 3. Check controllers and cycles
    
    // For now, we'll simulate canister info
    Ok(ICPCanisterInfo {
        status: "running".to_string(),
        memory_size: 1024 * 1024, // 1MB
        cycles: 1000000000,
        controllers: vec!["principal-1".to_string()],
    })
}

async fn call_icp_canister_method(request: &ICPCallRequest) -> Result<ICPCallResult> {
    // In a real implementation, you would:
    // 1. Create ICP agent
    // 2. Call the canister method
    // 3. Wait for response
    // 4. Return the result
    
    // For now, we'll simulate a call result
    Ok(ICPCallResult {
        result: serde_json::json!({
            "success": true,
            "data": "Method executed successfully"
        }),
        tx_id: format!("tx_{}", rand::random::<u64>()),
    })
}
