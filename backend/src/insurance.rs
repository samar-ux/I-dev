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
pub struct InsuranceService {
    db: Database,
}

impl InsuranceService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreatePolicyRequest {
    pub shipment_id: String,
    pub coverage_amount: f64,
    pub premium: f64,
    pub currency: String,
    pub start_date: String,
    pub end_date: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateClaimRequest {
    pub policy_id: String,
    pub claim_amount: f64,
    pub claim_reason: String,
    pub incident_date: String,
    pub description: String,
    pub supporting_documents: serde_json::Value,
}

#[derive(Debug, Serialize)]
pub struct PolicyResponse {
    pub id: String,
    pub shipment_id: String,
    pub user_id: String,
    pub policy_number: String,
    pub coverage_amount: f64,
    pub premium: f64,
    pub currency: String,
    pub status: String,
    pub start_date: String,
    pub end_date: String,
    pub blockchain_tx_hash: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct ClaimResponse {
    pub id: String,
    pub policy_id: String,
    pub claim_number: String,
    pub claim_amount: f64,
    pub claim_reason: String,
    pub incident_date: String,
    pub description: String,
    pub status: String,
    pub supporting_documents: serde_json::Value,
    pub approved_amount: Option<f64>,
    pub approved_at: Option<String>,
    pub created_at: String,
}

pub async fn get_policies(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<PolicyResponse>>, StatusCode> {
    info!("Fetching insurance policies");

    let user_id = params.get("user_id").and_then(|v| v.as_str());
    let status = params.get("status").and_then(|v| v.as_str());
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(50);

    let mut query = "SELECT * FROM insurance_policies WHERE 1=1".to_string();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(uid) = user_id {
        query.push_str(&format!(" AND user_id = ${}", param_count));
        bind_values.push(Box::new(Uuid::parse_str(uid).map_err(|_| StatusCode::BAD_REQUEST)?));
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

    let policies = rows
        .into_iter()
        .map(|row| PolicyResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            shipment_id: row.get::<Uuid, _>("shipment_id").to_string(),
            user_id: row.get::<Uuid, _>("user_id").to_string(),
            policy_number: row.get::<String, _>("policy_number"),
            coverage_amount: row.get::<f64, _>("coverage_amount"),
            premium: row.get::<f64, _>("premium"),
            currency: row.get::<String, _>("currency"),
            status: format!("{:?}", row.get::<PolicyStatus, _>("status")).to_lowercase(),
            start_date: row.get::<chrono::DateTime<Utc>, _>("start_date").to_rfc3339(),
            end_date: row.get::<chrono::DateTime<Utc>, _>("end_date").to_rfc3339(),
            blockchain_tx_hash: row.get::<Option<String>, _>("blockchain_tx_hash"),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        })
        .collect();

    Ok(Json(policies))
}

pub async fn create_policy(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreatePolicyRequest>,
) -> Result<Json<PolicyResponse>, StatusCode> {
    info!("Creating insurance policy for shipment: {}", payload.shipment_id);

    let shipment_id = Uuid::parse_str(&payload.shipment_id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user
    let policy_id = Uuid::new_v4();
    let policy_number = generate_policy_number();

    // Parse dates
    let start_date = chrono::DateTime::parse_from_rfc3339(&payload.start_date)
        .map_err(|_| StatusCode::BAD_REQUEST)?
        .with_timezone(&Utc);
    let end_date = chrono::DateTime::parse_from_rfc3339(&payload.end_date)
        .map_err(|_| StatusCode::BAD_REQUEST)?
        .with_timezone(&Utc);

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

    // Create policy
    sqlx::query(
        r#"
        INSERT INTO insurance_policies (
            id, shipment_id, user_id, policy_number, coverage_amount,
            premium, currency, status, start_date, end_date, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        "#,
    )
    .bind(policy_id)
    .bind(shipment_id)
    .bind(user_id)
    .bind(&policy_number)
    .bind(payload.coverage_amount)
    .bind(payload.premium)
    .bind(&payload.currency)
    .bind(&PolicyStatus::Active)
    .bind(start_date)
    .bind(end_date)
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating policy: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    // Generate blockchain transaction
    let blockchain_tx_hash = generate_blockchain_transaction(&policy_id, &policy_number).await;

    // Update policy with blockchain hash
    sqlx::query("UPDATE insurance_policies SET blockchain_tx_hash = $1 WHERE id = $2")
        .bind(&blockchain_tx_hash)
        .bind(policy_id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = PolicyResponse {
        id: policy_id.to_string(),
        shipment_id: payload.shipment_id,
        user_id: user_id.to_string(),
        policy_number,
        coverage_amount: payload.coverage_amount,
        premium: payload.premium,
        currency: payload.currency,
        status: "active".to_string(),
        start_date: payload.start_date,
        end_date: payload.end_date,
        blockchain_tx_hash: Some(blockchain_tx_hash),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Insurance policy created successfully: {}", policy_id);

    Ok(Json(response))
}

pub async fn create_claim(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateClaimRequest>,
) -> Result<Json<ClaimResponse>, StatusCode> {
    info!("Creating insurance claim for policy: {}", payload.policy_id);

    let policy_id = Uuid::parse_str(&payload.policy_id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let claim_id = Uuid::new_v4();
    let claim_number = generate_claim_number();

    // Parse incident date
    let incident_date = chrono::DateTime::parse_from_rfc3339(&payload.incident_date)
        .map_err(|_| StatusCode::BAD_REQUEST)?
        .with_timezone(&Utc);

    // Verify policy exists and is active
    let policy_row = sqlx::query("SELECT * FROM insurance_policies WHERE id = $1")
        .bind(policy_id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let policy_row = match policy_row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    let policy_status: PolicyStatus = policy_row.get("status");
    if !matches!(policy_status, PolicyStatus::Active) {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Create claim
    sqlx::query(
        r#"
        INSERT INTO insurance_claims (
            id, policy_id, claim_number, claim_amount, claim_reason,
            incident_date, description, status, supporting_documents, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        "#,
    )
    .bind(claim_id)
    .bind(policy_id)
    .bind(&claim_number)
    .bind(payload.claim_amount)
    .bind(&payload.claim_reason)
    .bind(incident_date)
    .bind(&payload.description)
    .bind("pending") // Status would be an enum in real implementation
    .bind(&payload.supporting_documents)
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating claim: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = ClaimResponse {
        id: claim_id.to_string(),
        policy_id: payload.policy_id,
        claim_number,
        claim_amount: payload.claim_amount,
        claim_reason: payload.claim_reason,
        incident_date: payload.incident_date,
        description: payload.description,
        status: "pending".to_string(),
        supporting_documents: payload.supporting_documents,
        approved_amount: None,
        approved_at: None,
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Insurance claim created successfully: {}", claim_id);

    Ok(Json(response))
}

pub async fn get_claim(
    State(state): State<crate::AppState>,
    Path(claim_id): Path<String>,
) -> Result<Json<ClaimResponse>, StatusCode> {
    info!("Fetching insurance claim: {}", claim_id);

    let id = Uuid::parse_str(&claim_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    let row = sqlx::query("SELECT * FROM insurance_claims WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let row = match row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    let response = ClaimResponse {
        id: claim_id,
        policy_id: row.get::<Uuid, _>("policy_id").to_string(),
        claim_number: row.get::<String, _>("claim_number"),
        claim_amount: row.get::<f64, _>("claim_amount"),
        claim_reason: row.get::<String, _>("claim_reason"),
        incident_date: row.get::<chrono::DateTime<Utc>, _>("incident_date").to_rfc3339(),
        description: row.get::<String, _>("description"),
        status: row.get::<String, _>("status"),
        supporting_documents: row.get::<serde_json::Value, _>("supporting_documents"),
        approved_amount: row.get::<Option<f64>, _>("approved_amount"),
        approved_at: row.get::<Option<chrono::DateTime<Utc>>, _>("approved_at")
            .map(|dt| dt.to_rfc3339()),
        created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
    };

    Ok(Json(response))
}

// Helper functions

fn generate_policy_number() -> String {
    format!("POL{:08}", rand::random::<u32>())
}

fn generate_claim_number() -> String {
    format!("CLM{:08}", rand::random::<u32>())
}

async fn generate_blockchain_transaction(policy_id: &Uuid, policy_number: &str) -> String {
    // In a real implementation, this would create a blockchain transaction
    // For now, we'll simulate a transaction hash
    format!("0x{:x}", rand::random::<u64>())
}
