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
pub struct SmartContractService {
    db: Database,
}

impl SmartContractService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct DeployContractRequest {
    pub contract_name: String,
    pub contract_type: ContractType,
    pub blockchain: BlockchainNetwork,
    pub constructor_params: serde_json::Value,
    pub gas_limit: Option<u64>,
}

#[derive(Debug, Deserialize)]
pub struct ExecuteContractRequest {
    pub contract_address: String,
    pub function_name: String,
    pub parameters: serde_json::Value,
    pub gas_limit: Option<u64>,
    pub value: Option<f64>,
}

#[derive(Debug, Deserialize)]
pub struct CreateShipmentContractRequest {
    pub sender_id: String,
    pub receiver_id: String,
    pub shipment_details: ShipmentDetails,
    pub payment_amount: f64,
    pub payment_currency: CryptoCurrency,
    pub insurance_amount: Option<f64>,
    pub delivery_deadline: String,
}

#[derive(Debug, Deserialize)]
pub struct ShipmentDetails {
    pub weight: f64,
    pub dimensions: Dimensions,
    pub description: String,
    pub value: f64,
    pub pickup_address: Address,
    pub delivery_address: Address,
    pub priority: String,
}

#[derive(Debug, Deserialize)]
pub struct Dimensions {
    pub length: f64,
    pub width: f64,
    pub height: f64,
}

#[derive(Debug, Deserialize)]
pub struct Address {
    pub street: String,
    pub city: String,
    pub state: String,
    pub country: String,
    pub postal_code: String,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
}

#[derive(Debug, Serialize)]
pub struct ContractDeploymentResponse {
    pub id: String,
    pub contract_name: String,
    pub contract_type: String,
    pub blockchain: String,
    pub contract_address: String,
    pub deployment_tx_hash: String,
    pub gas_used: u64,
    pub deployment_cost: f64,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct ContractExecutionResponse {
    pub id: String,
    pub contract_address: String,
    pub function_name: String,
    pub execution_tx_hash: String,
    pub gas_used: u64,
    pub execution_cost: f64,
    pub result: serde_json::Value,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct ShipmentContractResponse {
    pub contract_id: String,
    pub shipment_id: String,
    pub sender_id: String,
    pub receiver_id: String,
    pub contract_address: String,
    pub payment_amount: f64,
    pub payment_currency: String,
    pub insurance_amount: Option<f64>,
    pub delivery_deadline: String,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct ContractEventResponse {
    pub event_id: String,
    pub contract_address: String,
    pub event_name: String,
    pub event_data: serde_json::Value,
    pub block_number: u64,
    pub transaction_hash: String,
    pub timestamp: String,
}

#[derive(Debug, Serialize)]
pub struct ContractBalanceResponse {
    pub contract_address: String,
    pub balance: f64,
    pub currency: String,
    pub usd_value: f64,
    pub last_updated: String,
}

// Enum for contract types
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
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

// Enum for contract status
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "contract_status", rename_all = "lowercase")]
pub enum ContractStatus {
    Deployed,
    Active,
    Paused,
    Terminated,
    Failed,
}

pub async fn deploy_contract(
    State(state): State<crate::AppState>,
    Json(payload): Json<DeployContractRequest>,
) -> Result<Json<ContractDeploymentResponse>, StatusCode> {
    info!("Deploying smart contract: {}", payload.contract_name);

    let contract_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Deploy contract to blockchain
    let deployment_result = deploy_to_blockchain(
        &payload.contract_name,
        &payload.contract_type,
        &payload.blockchain,
        &payload.constructor_params,
        payload.gas_limit,
    ).await;

    let (contract_address, deployment_tx_hash, gas_used, deployment_cost) = match deployment_result {
        Ok(result) => (result.address, result.tx_hash, result.gas_used, result.cost),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Save contract deployment record
    sqlx::query(
        r#"
        INSERT INTO smart_contracts (
            id, user_id, contract_name, contract_type, blockchain,
            contract_address, deployment_tx_hash, gas_used, deployment_cost,
            status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        "#,
    )
    .bind(contract_id)
    .bind(user_id)
    .bind(&payload.contract_name)
    .bind(&payload.contract_type)
    .bind(&payload.blockchain)
    .bind(&contract_address)
    .bind(&deployment_tx_hash)
    .bind(gas_used)
    .bind(deployment_cost)
    .bind(&ContractStatus::Deployed)
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error deploying contract: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = ContractDeploymentResponse {
        id: contract_id.to_string(),
        contract_name: payload.contract_name,
        contract_type: format!("{:?}", payload.contract_type).to_lowercase(),
        blockchain: format!("{:?}", payload.blockchain).to_lowercase(),
        contract_address,
        deployment_tx_hash,
        gas_used,
        deployment_cost,
        status: "deployed".to_string(),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Smart contract deployed successfully: {}", contract_id);

    Ok(Json(response))
}

pub async fn execute_contract_function(
    State(state): State<crate::AppState>,
    Json(payload): Json<ExecuteContractRequest>,
) -> Result<Json<ContractExecutionResponse>, StatusCode> {
    info!("Executing contract function: {} on {}", payload.function_name, payload.contract_address);

    let execution_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Execute contract function
    let execution_result = execute_contract_function_on_blockchain(
        &payload.contract_address,
        &payload.function_name,
        &payload.parameters,
        payload.gas_limit,
        payload.value,
    ).await;

    let (execution_tx_hash, gas_used, execution_cost, result) = match execution_result {
        Ok(result) => (result.tx_hash, result.gas_used, result.cost, result.result),
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Save execution record
    sqlx::query(
        r#"
        INSERT INTO contract_executions (
            id, user_id, contract_address, function_name, execution_tx_hash,
            gas_used, execution_cost, result, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        "#,
    )
    .bind(execution_id)
    .bind(user_id)
    .bind(&payload.contract_address)
    .bind(&payload.function_name)
    .bind(&execution_tx_hash)
    .bind(gas_used)
    .bind(execution_cost)
    .bind(&result)
    .bind("completed")
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error executing contract: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = ContractExecutionResponse {
        id: execution_id.to_string(),
        contract_address: payload.contract_address,
        function_name: payload.function_name,
        execution_tx_hash,
        gas_used,
        execution_cost,
        result,
        status: "completed".to_string(),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Contract function executed successfully: {}", execution_id);

    Ok(Json(response))
}

pub async fn create_shipment_contract(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateShipmentContractRequest>,
) -> Result<Json<ShipmentContractResponse>, StatusCode> {
    info!("Creating shipment smart contract");

    let contract_id = Uuid::new_v4();
    let shipment_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Parse delivery deadline
    let delivery_deadline = chrono::DateTime::parse_from_rfc3339(&payload.delivery_deadline)
        .map_err(|_| StatusCode::BAD_REQUEST)?
        .with_timezone(&Utc);

    // Deploy shipment contract
    let contract_result = deploy_shipment_contract(&payload).await;
    let contract_address = match contract_result {
        Ok(address) => address,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    // Save shipment contract record
    sqlx::query(
        r#"
        INSERT INTO shipment_contracts (
            id, shipment_id, sender_id, receiver_id, contract_address,
            payment_amount, payment_currency, insurance_amount, delivery_deadline,
            status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        "#,
    )
    .bind(contract_id)
    .bind(shipment_id)
    .bind(&payload.sender_id)
    .bind(&payload.receiver_id)
    .bind(&contract_address)
    .bind(payload.payment_amount)
    .bind(&payload.payment_currency)
    .bind(payload.insurance_amount)
    .bind(delivery_deadline)
    .bind("active")
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating shipment contract: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = ShipmentContractResponse {
        contract_id: contract_id.to_string(),
        shipment_id: shipment_id.to_string(),
        sender_id: payload.sender_id,
        receiver_id: payload.receiver_id,
        contract_address,
        payment_amount: payload.payment_amount,
        payment_currency: format!("{:?}", payload.payment_currency).to_lowercase(),
        insurance_amount: payload.insurance_amount,
        delivery_deadline: payload.delivery_deadline,
        status: "active".to_string(),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Shipment contract created successfully: {}", contract_id);

    Ok(Json(response))
}

pub async fn get_contract_events(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<ContractEventResponse>>, StatusCode> {
    info!("Fetching contract events");

    let contract_address = params.get("contract_address").and_then(|v| v.as_str());
    let event_name = params.get("event_name").and_then(|v| v.as_str());
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(50);

    let mut query = "SELECT * FROM contract_events WHERE 1=1".to_string();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(addr) = contract_address {
        query.push_str(&format!(" AND contract_address = ${}", param_count));
        bind_values.push(Box::new(addr.to_string()));
        param_count += 1;
    }

    if let Some(event) = event_name {
        query.push_str(&format!(" AND event_name = ${}", param_count));
        bind_values.push(Box::new(event.to_string()));
        param_count += 1;
    }

    query.push_str(&format!(" ORDER BY block_number DESC LIMIT ${}", param_count));
    bind_values.push(Box::new(limit as i64));

    let rows = sqlx::query(&query)
        .fetch_all(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let events = rows
        .into_iter()
        .map(|row| ContractEventResponse {
            event_id: row.get::<Uuid, _>("id").to_string(),
            contract_address: row.get::<String, _>("contract_address"),
            event_name: row.get::<String, _>("event_name"),
            event_data: row.get::<serde_json::Value, _>("event_data"),
            block_number: row.get::<i64, _>("block_number") as u64,
            transaction_hash: row.get::<String, _>("transaction_hash"),
            timestamp: row.get::<chrono::DateTime<Utc>, _>("timestamp").to_rfc3339(),
        })
        .collect();

    Ok(Json(events))
}

pub async fn get_contract_balance(
    State(state): State<crate::AppState>,
    Path(contract_address): Path<String>,
) -> Result<Json<ContractBalanceResponse>, StatusCode> {
    info!("Fetching contract balance: {}", contract_address);

    // Get contract balance from blockchain
    let balance = get_contract_balance_from_blockchain(&contract_address).await;
    let currency = "ETH"; // Default currency
    let usd_value = balance * get_crypto_price(currency).await;

    let response = ContractBalanceResponse {
        contract_address,
        balance,
        currency: currency.to_string(),
        usd_value,
        last_updated: Utc::now().to_rfc3339(),
    };

    Ok(Json(response))
}

pub async fn trigger_contract_event(
    State(state): State<crate::AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Triggering contract event");

    let contract_address = payload.get("contract_address").and_then(|v| v.as_str()).unwrap_or("");
    let event_name = payload.get("event_name").and_then(|v| v.as_str()).unwrap_or("");
    let event_data = payload.get("event_data").unwrap_or(&serde_json::Value::Null);

    // Trigger contract event
    let result = trigger_contract_event_on_blockchain(contract_address, event_name, event_data).await;

    match result {
        Ok(_) => {
            info!("Contract event triggered successfully");
            Ok(Json(serde_json::json!({
                "status": "success",
                "message": "Contract event triggered successfully"
            })))
        },
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

// Helper functions

async fn deploy_to_blockchain(
    contract_name: &str,
    contract_type: &ContractType,
    blockchain: &BlockchainNetwork,
    constructor_params: &serde_json::Value,
    gas_limit: Option<u64>,
) -> Result<ContractDeploymentResult> {
    // In a real implementation, this would deploy contracts to blockchain
    Ok(ContractDeploymentResult {
        address: format!("0x{:x}", rand::random::<u64>()),
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
        gas_used: gas_limit.unwrap_or(1000000),
        cost: 0.1,
    })
}

async fn execute_contract_function_on_blockchain(
    contract_address: &str,
    function_name: &str,
    parameters: &serde_json::Value,
    gas_limit: Option<u64>,
    value: Option<f64>,
) -> Result<ContractExecutionResult> {
    // In a real implementation, this would execute contract functions
    Ok(ContractExecutionResult {
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
        gas_used: gas_limit.unwrap_or(100000),
        cost: value.unwrap_or(0.0),
        result: serde_json::json!({"success": true, "data": "execution_result"}),
    })
}

async fn deploy_shipment_contract(payload: &CreateShipmentContractRequest) -> Result<String> {
    // In a real implementation, this would deploy shipment contracts
    Ok(format!("0x{:x}", rand::random::<u64>()))
}

async fn get_contract_balance_from_blockchain(contract_address: &str) -> f64 {
    // In a real implementation, this would query contract balance
    1.5
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

async fn trigger_contract_event_on_blockchain(
    contract_address: &str,
    event_name: &str,
    event_data: &serde_json::Value,
) -> Result<()> {
    // In a real implementation, this would trigger contract events
    info!("Triggering event {} on contract {}", event_name, contract_address);
    Ok(())
}

#[derive(Debug)]
struct ContractDeploymentResult {
    address: String,
    tx_hash: String,
    gas_used: u64,
    cost: f64,
}

#[derive(Debug)]
struct ContractExecutionResult {
    tx_hash: String,
    gas_used: u64,
    cost: f64,
    result: serde_json::Value,
}
