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
pub struct TrackingService {
    db: Database,
}

impl TrackingService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateShipmentRequest {
    pub sender_id: String,
    pub receiver_id: String,
    pub weight: f64,
    pub dimensions: serde_json::Value,
    pub description: String,
    pub value: f64,
    pub currency: String,
    pub pickup_address: serde_json::Value,
    pub delivery_address: serde_json::Value,
    pub priority: String,
    pub estimated_delivery: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateLocationRequest {
    pub latitude: f64,
    pub longitude: f64,
    pub address: String,
    pub city: String,
    pub country: String,
    pub accuracy: f64,
}

#[derive(Debug, Deserialize)]
pub struct UpdateStatusRequest {
    pub status: String,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ConvertToNFTRequest {
    pub metadata: serde_json::Value,
    pub recipient: String,
}

#[derive(Debug, Serialize)]
pub struct ShipmentResponse {
    pub id: String,
    pub tracking_number: String,
    pub sender_id: String,
    pub receiver_id: String,
    pub driver_id: Option<String>,
    pub status: String,
    pub priority: String,
    pub weight: f64,
    pub dimensions: serde_json::Value,
    pub description: String,
    pub value: f64,
    pub currency: String,
    pub pickup_address: serde_json::Value,
    pub delivery_address: serde_json::Value,
    pub estimated_delivery: Option<String>,
    pub actual_delivery: Option<String>,
    pub nft_token_id: Option<String>,
    pub blockchain_tx_hash: Option<String>,
    pub current_location: Option<LocationResponse>,
    pub location_history: Vec<LocationResponse>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize)]
pub struct LocationResponse {
    pub id: String,
    pub latitude: f64,
    pub longitude: f64,
    pub address: String,
    pub city: String,
    pub country: String,
    pub accuracy: f64,
    pub timestamp: String,
}

#[derive(Debug, Serialize)]
pub struct NFTConversionResponse {
    pub token_id: String,
    pub contract_address: String,
    pub tx_hash: String,
    pub metadata: serde_json::Value,
    pub created_at: String,
}

pub async fn create_shipment(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateShipmentRequest>,
) -> Result<Json<ShipmentResponse>, StatusCode> {
    info!("Creating shipment for sender: {}", payload.sender_id);

    // Validate input
    if payload.weight <= 0.0 || payload.value < 0.0 {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Parse priority
    let priority = match payload.priority.as_str() {
        "low" => ShipmentPriority::Low,
        "medium" => ShipmentPriority::Medium,
        "high" => ShipmentPriority::High,
        "urgent" => ShipmentPriority::Urgent,
        _ => return Err(StatusCode::BAD_REQUEST),
    };

    // Parse estimated delivery
    let estimated_delivery = if let Some(date_str) = payload.estimated_delivery {
        Some(chrono::DateTime::parse_from_rfc3339(&date_str)
            .map_err(|_| StatusCode::BAD_REQUEST)?
            .with_timezone(&Utc))
    } else {
        None
    };

    let shipment_id = Uuid::new_v4();
    let tracking_number = generate_tracking_number();
    let now = Utc::now();

    // Create shipment
    sqlx::query(
        r#"
        INSERT INTO shipments (
            id, tracking_number, sender_id, receiver_id, status, priority,
            weight, dimensions, description, value, currency, pickup_address,
            delivery_address, estimated_delivery, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        "#,
    )
    .bind(shipment_id)
    .bind(&tracking_number)
    .bind(Uuid::parse_str(&payload.sender_id).map_err(|_| StatusCode::BAD_REQUEST)?)
    .bind(Uuid::parse_str(&payload.receiver_id).map_err(|_| StatusCode::BAD_REQUEST)?)
    .bind(&ShipmentStatus::Pending)
    .bind(&priority)
    .bind(payload.weight)
    .bind(&payload.dimensions)
    .bind(&payload.description)
    .bind(payload.value)
    .bind(&payload.currency)
    .bind(&payload.pickup_address)
    .bind(&payload.delivery_address)
    .bind(estimated_delivery)
    .bind(now)
    .bind(now)
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating shipment: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    info!("Shipment created successfully: {}", shipment_id);

    // Return shipment response
    Ok(Json(ShipmentResponse {
        id: shipment_id.to_string(),
        tracking_number,
        sender_id: payload.sender_id,
        receiver_id: payload.receiver_id,
        driver_id: None,
        status: "pending".to_string(),
        priority: payload.priority,
        weight: payload.weight,
        dimensions: payload.dimensions,
        description: payload.description,
        value: payload.value,
        currency: payload.currency,
        pickup_address: payload.pickup_address,
        delivery_address: payload.delivery_address,
        estimated_delivery: payload.estimated_delivery,
        actual_delivery: None,
        nft_token_id: None,
        blockchain_tx_hash: None,
        current_location: None,
        location_history: Vec::new(),
        created_at: now.to_rfc3339(),
        updated_at: now.to_rfc3339(),
    }))
}

pub async fn get_shipment(
    State(state): State<crate::AppState>,
    Path(shipment_id): Path<String>,
) -> Result<Json<ShipmentResponse>, StatusCode> {
    info!("Fetching shipment: {}", shipment_id);

    let id = Uuid::parse_str(&shipment_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Get shipment
    let shipment_row = sqlx::query("SELECT * FROM shipments WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let shipment_row = match shipment_row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    // Get current location
    let current_location = sqlx::query(
        "SELECT * FROM location_updates WHERE shipment_id = $1 ORDER BY timestamp DESC LIMIT 1"
    )
    .bind(id)
    .fetch_optional(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .map(|row| LocationResponse {
        id: row.get::<Uuid, _>("id").to_string(),
        latitude: row.get::<f64, _>("latitude"),
        longitude: row.get::<f64, _>("longitude"),
        address: row.get::<String, _>("address"),
        city: row.get::<String, _>("city"),
        country: row.get::<String, _>("country"),
        accuracy: row.get::<f64, _>("accuracy"),
        timestamp: row.get::<chrono::DateTime<Utc>, _>("timestamp").to_rfc3339(),
    });

    // Get location history
    let location_rows = sqlx::query(
        "SELECT * FROM location_updates WHERE shipment_id = $1 ORDER BY timestamp DESC LIMIT 10"
    )
    .bind(id)
    .fetch_all(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let location_history = location_rows
        .into_iter()
        .map(|row| LocationResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            latitude: row.get::<f64, _>("latitude"),
            longitude: row.get::<f64, _>("longitude"),
            address: row.get::<String, _>("address"),
            city: row.get::<String, _>("city"),
            country: row.get::<String, _>("country"),
            accuracy: row.get::<f64, _>("accuracy"),
            timestamp: row.get::<chrono::DateTime<Utc>, _>("timestamp").to_rfc3339(),
        })
        .collect();

    let response = ShipmentResponse {
        id: shipment_id,
        tracking_number: shipment_row.get::<String, _>("tracking_number"),
        sender_id: shipment_row.get::<Uuid, _>("sender_id").to_string(),
        receiver_id: shipment_row.get::<Uuid, _>("receiver_id").to_string(),
        driver_id: shipment_row.get::<Option<Uuid>, _>("driver_id").map(|id| id.to_string()),
        status: format!("{:?}", shipment_row.get::<ShipmentStatus, _>("status")).to_lowercase(),
        priority: format!("{:?}", shipment_row.get::<ShipmentPriority, _>("priority")).to_lowercase(),
        weight: shipment_row.get::<f64, _>("weight"),
        dimensions: shipment_row.get::<serde_json::Value, _>("dimensions"),
        description: shipment_row.get::<String, _>("description"),
        value: shipment_row.get::<f64, _>("value"),
        currency: shipment_row.get::<String, _>("currency"),
        pickup_address: shipment_row.get::<serde_json::Value, _>("pickup_address"),
        delivery_address: shipment_row.get::<serde_json::Value, _>("delivery_address"),
        estimated_delivery: shipment_row.get::<Option<chrono::DateTime<Utc>>, _>("estimated_delivery")
            .map(|dt| dt.to_rfc3339()),
        actual_delivery: shipment_row.get::<Option<chrono::DateTime<Utc>>, _>("actual_delivery")
            .map(|dt| dt.to_rfc3339()),
        nft_token_id: shipment_row.get::<Option<String>, _>("nft_token_id"),
        blockchain_tx_hash: shipment_row.get::<Option<String>, _>("blockchain_tx_hash"),
        current_location,
        location_history,
        created_at: shipment_row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        updated_at: shipment_row.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
    };

    Ok(Json(response))
}

pub async fn update_location(
    State(state): State<crate::AppState>,
    Path(shipment_id): Path<String>,
    Json(payload): Json<UpdateLocationRequest>,
) -> Result<Json<LocationResponse>, StatusCode> {
    info!("Updating location for shipment: {}", shipment_id);

    let id = Uuid::parse_str(&shipment_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Verify shipment exists
    let shipment_exists = sqlx::query("SELECT id FROM shipments WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .is_some();

    if !shipment_exists {
        return Err(StatusCode::NOT_FOUND);
    }

    // Create location update
    let location_id = Uuid::new_v4();
    let now = Utc::now();

    sqlx::query(
        r#"
        INSERT INTO location_updates (
            id, shipment_id, latitude, longitude, address, city, country, accuracy, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#,
    )
    .bind(location_id)
    .bind(id)
    .bind(payload.latitude)
    .bind(payload.longitude)
    .bind(&payload.address)
    .bind(&payload.city)
    .bind(&payload.country)
    .bind(payload.accuracy)
    .bind(now)
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error updating location: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    // Update shipment timestamp
    sqlx::query("UPDATE shipments SET updated_at = $1 WHERE id = $2")
        .bind(now)
        .bind(id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = LocationResponse {
        id: location_id.to_string(),
        latitude: payload.latitude,
        longitude: payload.longitude,
        address: payload.address,
        city: payload.city,
        country: payload.country,
        accuracy: payload.accuracy,
        timestamp: now.to_rfc3339(),
    };

    info!("Location updated successfully for shipment: {}", shipment_id);

    Ok(Json(response))
}

pub async fn update_status(
    State(state): State<crate::AppState>,
    Path(shipment_id): Path<String>,
    Json(payload): Json<UpdateStatusRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Updating status for shipment: {}", shipment_id);

    let id = Uuid::parse_str(&shipment_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Parse status
    let status = match payload.status.as_str() {
        "pending" => ShipmentStatus::Pending,
        "picked_up" => ShipmentStatus::PickedUp,
        "in_transit" => ShipmentStatus::InTransit,
        "out_for_delivery" => ShipmentStatus::OutForDelivery,
        "delivered" => ShipmentStatus::Delivered,
        "returned" => ShipmentStatus::Returned,
        "cancelled" => ShipmentStatus::Cancelled,
        _ => return Err(StatusCode::BAD_REQUEST),
    };

    let now = Utc::now();
    let mut actual_delivery = None;

    // Set actual delivery time if status is delivered
    if matches!(status, ShipmentStatus::Delivered) {
        actual_delivery = Some(now);
    }

    // Update shipment status
    sqlx::query(
        "UPDATE shipments SET status = $1, actual_delivery = $2, updated_at = $3 WHERE id = $4"
    )
    .bind(&status)
    .bind(actual_delivery)
    .bind(now)
    .bind(id)
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error updating status: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    info!("Status updated successfully for shipment: {}", shipment_id);

    Ok(Json(serde_json::json!({
        "status": payload.status,
        "updated_at": now.to_rfc3339(),
        "notes": payload.notes
    })))
}

pub async fn convert_to_nft(
    State(state): State<crate::AppState>,
    Path(shipment_id): Path<String>,
    Json(payload): Json<ConvertToNFTRequest>,
) -> Result<Json<NFTConversionResponse>, StatusCode> {
    info!("Converting shipment to NFT: {}", shipment_id);

    let id = Uuid::parse_str(&shipment_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Verify shipment exists and is delivered
    let shipment_row = sqlx::query("SELECT * FROM shipments WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let shipment_row = match shipment_row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    let status: ShipmentStatus = shipment_row.get("status");
    if !matches!(status, ShipmentStatus::Delivered) {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Check if already converted to NFT
    if shipment_row.get::<Option<String>, _>("nft_token_id").is_some() {
        return Err(StatusCode::CONFLICT);
    }

    // Mint NFT (this would integrate with the Web3 service)
    let nft_result = mint_shipment_nft(&payload, &shipment_row).await
        .map_err(|e| {
            error!("NFT minting failed: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    // Update shipment with NFT information
    sqlx::query("UPDATE shipments SET nft_token_id = $1, blockchain_tx_hash = $2, updated_at = $3 WHERE id = $4")
        .bind(&nft_result.token_id)
        .bind(&nft_result.tx_hash)
        .bind(Utc::now())
        .bind(id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = NFTConversionResponse {
        token_id: nft_result.token_id,
        contract_address: nft_result.contract_address,
        tx_hash: nft_result.tx_hash,
        metadata: payload.metadata,
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Shipment converted to NFT successfully: {}", shipment_id);

    Ok(Json(response))
}

pub async fn search_shipments(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<ShipmentResponse>>, StatusCode> {
    info!("Searching shipments");

    let tracking_number = params.get("tracking_number").and_then(|v| v.as_str());
    let sender_id = params.get("sender_id").and_then(|v| v.as_str());
    let receiver_id = params.get("receiver_id").and_then(|v| v.as_str());
    let status = params.get("status").and_then(|v| v.as_str());
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(50);

    let mut query = "SELECT * FROM shipments WHERE 1=1".to_string();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(tn) = tracking_number {
        query.push_str(&format!(" AND tracking_number = ${}", param_count));
        bind_values.push(Box::new(tn.to_string()));
        param_count += 1;
    }

    if let Some(sid) = sender_id {
        query.push_str(&format!(" AND sender_id = ${}", param_count));
        bind_values.push(Box::new(Uuid::parse_str(sid).map_err(|_| StatusCode::BAD_REQUEST)?));
        param_count += 1;
    }

    if let Some(rid) = receiver_id {
        query.push_str(&format!(" AND receiver_id = ${}", param_count));
        bind_values.push(Box::new(Uuid::parse_str(rid).map_err(|_| StatusCode::BAD_REQUEST)?));
        param_count += 1;
    }

    if let Some(st) = status {
        query.push_str(&format!(" AND status = ${}", param_count));
        bind_values.push(Box::new(st.to_string()));
        param_count += 1;
    }

    query.push_str(&format!(" ORDER BY created_at DESC LIMIT ${}", param_count));
    bind_values.push(Box::new(limit as i64));

    let rows = sqlx::query(&query)
        .fetch_all(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut shipments = Vec::new();
    for row in rows {
        let shipment_id = row.get::<Uuid, _>("id");
        
        // Get current location
        let current_location = sqlx::query(
            "SELECT * FROM location_updates WHERE shipment_id = $1 ORDER BY timestamp DESC LIMIT 1"
        )
        .bind(shipment_id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .map(|row| LocationResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            latitude: row.get::<f64, _>("latitude"),
            longitude: row.get::<f64, _>("longitude"),
            address: row.get::<String, _>("address"),
            city: row.get::<String, _>("city"),
            country: row.get::<String, _>("country"),
            accuracy: row.get::<f64, _>("accuracy"),
            timestamp: row.get::<chrono::DateTime<Utc>, _>("timestamp").to_rfc3339(),
        });

        shipments.push(ShipmentResponse {
            id: shipment_id.to_string(),
            tracking_number: row.get::<String, _>("tracking_number"),
            sender_id: row.get::<Uuid, _>("sender_id").to_string(),
            receiver_id: row.get::<Uuid, _>("receiver_id").to_string(),
            driver_id: row.get::<Option<Uuid>, _>("driver_id").map(|id| id.to_string()),
            status: format!("{:?}", row.get::<ShipmentStatus, _>("status")).to_lowercase(),
            priority: format!("{:?}", row.get::<ShipmentPriority, _>("priority")).to_lowercase(),
            weight: row.get::<f64, _>("weight"),
            dimensions: row.get::<serde_json::Value, _>("dimensions"),
            description: row.get::<String, _>("description"),
            value: row.get::<f64, _>("value"),
            currency: row.get::<String, _>("currency"),
            pickup_address: row.get::<serde_json::Value, _>("pickup_address"),
            delivery_address: row.get::<serde_json::Value, _>("delivery_address"),
            estimated_delivery: row.get::<Option<chrono::DateTime<Utc>>, _>("estimated_delivery")
                .map(|dt| dt.to_rfc3339()),
            actual_delivery: row.get::<Option<chrono::DateTime<Utc>>, _>("actual_delivery")
                .map(|dt| dt.to_rfc3339()),
            nft_token_id: row.get::<Option<String>, _>("nft_token_id"),
            blockchain_tx_hash: row.get::<Option<String>, _>("blockchain_tx_hash"),
            current_location,
            location_history: Vec::new(), // Simplified for search results
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
            updated_at: row.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
        });
    }

    Ok(Json(shipments))
}

// Helper functions

fn generate_tracking_number() -> String {
    // Generate a unique tracking number
    format!("SH{:08}", rand::random::<u32>())
}

#[derive(Debug)]
struct NFTMintResult {
    token_id: String,
    contract_address: String,
    tx_hash: String,
}

async fn mint_shipment_nft(
    request: &ConvertToNFTRequest,
    shipment_row: &sqlx::postgres::PgRow,
) -> Result<NFTMintResult> {
    // In a real implementation, this would integrate with the Web3 service
    // to mint an NFT representing the shipment
    
    // For now, we'll simulate NFT minting
    Ok(NFTMintResult {
        token_id: format!("{}", rand::random::<u64>()),
        contract_address: "0x1234567890123456789012345678901234567890".to_string(),
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
    })
}
