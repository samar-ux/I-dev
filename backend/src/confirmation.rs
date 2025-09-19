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
pub struct ConfirmationService {
    db: Database,
}

impl ConfirmationService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateConfirmationRequest {
    pub confirmation_type: String,
    pub title: String,
    pub description: String,
    pub priority: String,
    pub shipment_id: Option<String>,
    pub participants: serde_json::Value,
    pub verification_methods: serde_json::Value,
    pub location: Option<serde_json::Value>,
    pub expires_in_hours: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct ConfirmRequest {
    pub participant_id: String,
    pub verification_data: serde_json::Value,
    pub signature: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ConfirmationResponse {
    pub id: String,
    pub confirmation_type: String,
    pub title: String,
    pub description: String,
    pub status: String,
    pub priority: String,
    pub shipment_id: Option<String>,
    pub participants: serde_json::Value,
    pub verification_methods: serde_json::Value,
    pub location: Option<serde_json::Value>,
    pub blockchain_tx_hash: Option<String>,
    pub expires_at: Option<String>,
    pub created_at: String,
    pub completed_at: Option<String>,
}

pub async fn create_confirmation(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateConfirmationRequest>,
) -> Result<Json<ConfirmationResponse>, StatusCode> {
    info!("Creating confirmation: {}", payload.title);

    // Parse confirmation type and priority
    let confirmation_type = match payload.confirmation_type.as_str() {
        "delivery_confirmation" => ConfirmationType::DeliveryConfirmation,
        "payment_confirmation" => ConfirmationType::PaymentConfirmation,
        "pickup_confirmation" => ConfirmationType::PickupConfirmation,
        "inspection_confirmation" => ConfirmationType::InspectionConfirmation,
        _ => return Err(StatusCode::BAD_REQUEST),
    };

    let priority = match payload.priority.as_str() {
        "low" => ConfirmationPriority::Low,
        "medium" => ConfirmationPriority::Medium,
        "high" => ConfirmationPriority::High,
        "critical" => ConfirmationPriority::Critical,
        _ => return Err(StatusCode::BAD_REQUEST),
    };

    let confirmation_id = Uuid::new_v4();
    let now = Utc::now();
    let expires_at = payload.expires_in_hours.map(|hours| {
        now + chrono::Duration::hours(hours as i64)
    });

    // Parse shipment_id if provided
    let shipment_id = if let Some(sid) = payload.shipment_id {
        Some(Uuid::parse_str(&sid).map_err(|_| StatusCode::BAD_REQUEST)?)
    } else {
        None
    };

    sqlx::query(
        r#"
        INSERT INTO confirmations (
            id, confirmation_type, title, description, status, priority,
            shipment_id, participants, verification_methods, location,
            expires_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        "#,
    )
    .bind(confirmation_id)
    .bind(&confirmation_type)
    .bind(&payload.title)
    .bind(&payload.description)
    .bind(&ConfirmationStatus::Pending)
    .bind(&priority)
    .bind(shipment_id)
    .bind(&payload.participants)
    .bind(&payload.verification_methods)
    .bind(&payload.location)
    .bind(expires_at)
    .bind(now)
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating confirmation: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = ConfirmationResponse {
        id: confirmation_id.to_string(),
        confirmation_type: payload.confirmation_type,
        title: payload.title,
        description: payload.description,
        status: "pending".to_string(),
        priority: payload.priority,
        shipment_id: payload.shipment_id,
        participants: payload.participants,
        verification_methods: payload.verification_methods,
        location: payload.location,
        blockchain_tx_hash: None,
        expires_at: expires_at.map(|dt| dt.to_rfc3339()),
        created_at: now.to_rfc3339(),
        completed_at: None,
    };

    info!("Confirmation created successfully: {}", confirmation_id);

    Ok(Json(response))
}

pub async fn get_confirmation(
    State(state): State<crate::AppState>,
    Path(confirmation_id): Path<String>,
) -> Result<Json<ConfirmationResponse>, StatusCode> {
    info!("Fetching confirmation: {}", confirmation_id);

    let id = Uuid::parse_str(&confirmation_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    let row = sqlx::query("SELECT * FROM confirmations WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let row = match row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    let response = ConfirmationResponse {
        id: confirmation_id,
        confirmation_type: format!("{:?}", row.get::<ConfirmationType, _>("confirmation_type")).to_lowercase(),
        title: row.get::<String, _>("title"),
        description: row.get::<String, _>("description"),
        status: format!("{:?}", row.get::<ConfirmationStatus, _>("status")).to_lowercase(),
        priority: format!("{:?}", row.get::<ConfirmationPriority, _>("priority")).to_lowercase(),
        shipment_id: row.get::<Option<Uuid>, _>("shipment_id").map(|id| id.to_string()),
        participants: row.get::<serde_json::Value, _>("participants"),
        verification_methods: row.get::<serde_json::Value, _>("verification_methods"),
        location: row.get::<Option<serde_json::Value>, _>("location"),
        blockchain_tx_hash: row.get::<Option<String>, _>("blockchain_tx_hash"),
        expires_at: row.get::<Option<chrono::DateTime<Utc>>, _>("expires_at")
            .map(|dt| dt.to_rfc3339()),
        created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        completed_at: row.get::<Option<chrono::DateTime<Utc>>, _>("completed_at")
            .map(|dt| dt.to_rfc3339()),
    };

    Ok(Json(response))
}

pub async fn confirm(
    State(state): State<crate::AppState>,
    Path(confirmation_id): Path<String>,
    Json(payload): Json<ConfirmRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Confirming: {} by participant: {}", confirmation_id, payload.participant_id);

    let id = Uuid::parse_str(&confirmation_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Get confirmation
    let confirmation_row = sqlx::query("SELECT * FROM confirmations WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let confirmation_row = match confirmation_row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    // Check if confirmation is still pending
    let status: ConfirmationStatus = confirmation_row.get("status");
    if !matches!(status, ConfirmationStatus::Pending) {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Check if confirmation has expired
    if let Some(expires_at) = confirmation_row.get::<Option<chrono::DateTime<Utc>>, _>("expires_at") {
        if Utc::now() > expires_at {
            // Mark as expired
            sqlx::query("UPDATE confirmations SET status = 'expired' WHERE id = $1")
                .bind(id)
                .execute(&state.db.pool)
                .await
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
            
            return Err(StatusCode::GONE);
        }
    }

    // Verify participant and update confirmation
    let participants: serde_json::Value = confirmation_row.get("participants");
    let mut participants_array = participants.as_array()
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?
        .clone();

    // Find and update participant
    let mut participant_found = false;
    for participant in participants_array.iter_mut() {
        if let Some(participant_obj) = participant.as_object_mut() {
            if participant_obj.get("id").and_then(|v| v.as_str()) == Some(&payload.participant_id) {
                participant_obj.insert("status".to_string(), serde_json::Value::String("confirmed".to_string()));
                participant_obj.insert("confirmed_at".to_string(), serde_json::Value::String(Utc::now().to_rfc3339()));
                participant_obj.insert("verification_data".to_string(), payload.verification_data.clone());
                if let Some(signature) = payload.signature {
                    participant_obj.insert("signature".to_string(), serde_json::Value::String(signature));
                }
                participant_found = true;
                break;
            }
        }
    }

    if !participant_found {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Update participants in database
    sqlx::query("UPDATE confirmations SET participants = $1 WHERE id = $2")
        .bind(&serde_json::Value::Array(participants_array))
        .bind(id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Check if all participants have confirmed
    let all_confirmed = participants_array.iter().all(|p| {
        p.as_object()
            .and_then(|obj| obj.get("status"))
            .and_then(|status| status.as_str())
            .map(|s| s == "confirmed")
            .unwrap_or(false)
    });

    if all_confirmed {
        // Mark confirmation as completed
        let now = Utc::now();
        let blockchain_tx_hash = generate_blockchain_transaction(&confirmation_row, &now).await;

        sqlx::query(
            "UPDATE confirmations SET status = 'completed', completed_at = $1, blockchain_tx_hash = $2 WHERE id = $3"
        )
        .bind(now)
        .bind(blockchain_tx_hash)
        .bind(id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        info!("Confirmation completed: {}", confirmation_id);

        Ok(Json(serde_json::json!({
            "status": "completed",
            "message": "All participants have confirmed",
            "completed_at": now.to_rfc3339(),
            "blockchain_tx_hash": blockchain_tx_hash
        })))
    } else {
        info!("Confirmation partially completed: {}", confirmation_id);

        Ok(Json(serde_json::json!({
            "status": "in_progress",
            "message": "Participant confirmed, waiting for others",
            "confirmed_at": Utc::now().to_rfc3339()
        })))
    }
}

pub async fn cancel(
    State(state): State<crate::AppState>,
    Path(confirmation_id): Path<String>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Cancelling confirmation: {}", confirmation_id);

    let id = Uuid::parse_str(&confirmation_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Update confirmation status to cancelled
    sqlx::query("UPDATE confirmations SET status = 'cancelled' WHERE id = $1")
        .bind(id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    info!("Confirmation cancelled: {}", confirmation_id);

    Ok(Json(serde_json::json!({
        "status": "cancelled",
        "message": "Confirmation cancelled successfully",
        "cancelled_at": Utc::now().to_rfc3339()
    })))
}

pub async fn get_pending(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<ConfirmationResponse>>, StatusCode> {
    info!("Fetching pending confirmations");

    let user_id = params.get("user_id").and_then(|v| v.as_str());
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(50);

    let mut query = "SELECT * FROM confirmations WHERE status = 'pending'".to_string();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(uid) = user_id {
        // This would need to check if the user is a participant in the confirmation
        // For now, we'll fetch all pending confirmations
    }

    query.push_str(&format!(" ORDER BY created_at DESC LIMIT ${}", param_count));
    bind_values.push(Box::new(limit as i64));

    let rows = sqlx::query(&query)
        .fetch_all(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let confirmations = rows
        .into_iter()
        .map(|row| ConfirmationResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            confirmation_type: format!("{:?}", row.get::<ConfirmationType, _>("confirmation_type")).to_lowercase(),
            title: row.get::<String, _>("title"),
            description: row.get::<String, _>("description"),
            status: format!("{:?}", row.get::<ConfirmationStatus, _>("status")).to_lowercase(),
            priority: format!("{:?}", row.get::<ConfirmationPriority, _>("priority")).to_lowercase(),
            shipment_id: row.get::<Option<Uuid>, _>("shipment_id").map(|id| id.to_string()),
            participants: row.get::<serde_json::Value, _>("participants"),
            verification_methods: row.get::<serde_json::Value, _>("verification_methods"),
            location: row.get::<Option<serde_json::Value>, _>("location"),
            blockchain_tx_hash: row.get::<Option<String>, _>("blockchain_tx_hash"),
            expires_at: row.get::<Option<chrono::DateTime<Utc>>, _>("expires_at")
                .map(|dt| dt.to_rfc3339()),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
            completed_at: row.get::<Option<chrono::DateTime<Utc>>, _>("completed_at")
                .map(|dt| dt.to_rfc3339()),
        })
        .collect();

    Ok(Json(confirmations))
}

pub async fn get_completed(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<ConfirmationResponse>>, StatusCode> {
    info!("Fetching completed confirmations");

    let user_id = params.get("user_id").and_then(|v| v.as_str());
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(50);

    let mut query = "SELECT * FROM confirmations WHERE status = 'completed'".to_string();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(uid) = user_id {
        // This would need to check if the user is a participant in the confirmation
        // For now, we'll fetch all completed confirmations
    }

    query.push_str(&format!(" ORDER BY completed_at DESC LIMIT ${}", param_count));
    bind_values.push(Box::new(limit as i64));

    let rows = sqlx::query(&query)
        .fetch_all(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let confirmations = rows
        .into_iter()
        .map(|row| ConfirmationResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            confirmation_type: format!("{:?}", row.get::<ConfirmationType, _>("confirmation_type")).to_lowercase(),
            title: row.get::<String, _>("title"),
            description: row.get::<String, _>("description"),
            status: format!("{:?}", row.get::<ConfirmationStatus, _>("status")).to_lowercase(),
            priority: format!("{:?}", row.get::<ConfirmationPriority, _>("priority")).to_lowercase(),
            shipment_id: row.get::<Option<Uuid>, _>("shipment_id").map(|id| id.to_string()),
            participants: row.get::<serde_json::Value, _>("participants"),
            verification_methods: row.get::<serde_json::Value, _>("verification_methods"),
            location: row.get::<Option<serde_json::Value>, _>("location"),
            blockchain_tx_hash: row.get::<Option<String>, _>("blockchain_tx_hash"),
            expires_at: row.get::<Option<chrono::DateTime<Utc>>, _>("expires_at")
                .map(|dt| dt.to_rfc3339()),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
            completed_at: row.get::<Option<chrono::DateTime<Utc>>, _>("completed_at")
                .map(|dt| dt.to_rfc3339()),
        })
        .collect();

    Ok(Json(confirmations))
}

// Helper functions

async fn generate_blockchain_transaction(
    confirmation_row: &sqlx::postgres::PgRow,
    completed_at: &chrono::DateTime<Utc>,
) -> Option<String> {
    // In a real implementation, this would:
    // 1. Create a blockchain transaction
    // 2. Store the confirmation data on-chain
    // 3. Return the transaction hash
    
    // For now, we'll simulate a transaction hash
    Some(format!("0x{:x}", rand::random::<u64>()))
}
