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
pub struct RatingService {
    db: Database,
}

impl RatingService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateRatingRequest {
    pub ratee_id: String,
    pub shipment_id: Option<String>,
    pub rating: i32,
    pub comment: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct RatingResponse {
    pub id: String,
    pub rater_id: String,
    pub ratee_id: String,
    pub shipment_id: Option<String>,
    pub rating: i32,
    pub comment: Option<String>,
    pub blockchain_tx_hash: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct UserRatingSummary {
    pub user_id: String,
    pub average_rating: f64,
    pub total_ratings: i64,
    pub rating_breakdown: Vec<RatingBreakdown>,
    pub recent_ratings: Vec<RatingResponse>,
}

#[derive(Debug, Serialize)]
pub struct RatingBreakdown {
    pub rating: i32,
    pub count: i64,
    pub percentage: f64,
}

pub async fn create_rating(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateRatingRequest>,
) -> Result<Json<RatingResponse>, StatusCode> {
    info!("Creating rating for user: {}", payload.ratee_id);

    // Validate rating
    if payload.rating < 1 || payload.rating > 5 {
        return Err(StatusCode::BAD_REQUEST);
    }

    let ratee_id = Uuid::parse_str(&payload.ratee_id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let rater_id = Uuid::new_v4(); // In real implementation, get from authenticated user
    let rating_id = Uuid::new_v4();

    // Parse shipment_id if provided
    let shipment_id = if let Some(sid) = payload.shipment_id {
        Some(Uuid::parse_str(&sid).map_err(|_| StatusCode::BAD_REQUEST)?)
    } else {
        None
    };

    // Verify ratee exists
    let ratee_exists = sqlx::query("SELECT id FROM users WHERE id = $1")
        .bind(ratee_id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .is_some();

    if !ratee_exists {
        return Err(StatusCode::NOT_FOUND);
    }

    // Check if shipment exists if provided
    if let Some(sid) = shipment_id {
        let shipment_exists = sqlx::query("SELECT id FROM shipments WHERE id = $1")
            .bind(sid)
            .fetch_optional(&state.db.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
            .is_some();

        if !shipment_exists {
            return Err(StatusCode::NOT_FOUND);
        }
    }

    // Create rating
    sqlx::query(
        r#"
        INSERT INTO ratings (
            id, rater_id, ratee_id, shipment_id, rating, comment, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        "#,
    )
    .bind(rating_id)
    .bind(rater_id)
    .bind(ratee_id)
    .bind(shipment_id)
    .bind(payload.rating)
    .bind(&payload.comment)
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating rating: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    // Generate blockchain transaction
    let blockchain_tx_hash = generate_blockchain_transaction(&rating_id).await;

    // Update rating with blockchain hash
    sqlx::query("UPDATE ratings SET blockchain_tx_hash = $1 WHERE id = $2")
        .bind(&blockchain_tx_hash)
        .bind(rating_id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = RatingResponse {
        id: rating_id.to_string(),
        rater_id: rater_id.to_string(),
        ratee_id: payload.ratee_id,
        shipment_id: payload.shipment_id,
        rating: payload.rating,
        comment: payload.comment,
        blockchain_tx_hash: Some(blockchain_tx_hash),
        created_at: Utc::now().to_rfc3339(),
    };

    info!("Rating created successfully: {}", rating_id);

    Ok(Json(response))
}

pub async fn get_rating(
    State(state): State<crate::AppState>,
    Path(rating_id): Path<String>,
) -> Result<Json<RatingResponse>, StatusCode> {
    info!("Fetching rating: {}", rating_id);

    let id = Uuid::parse_str(&rating_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    let row = sqlx::query("SELECT * FROM ratings WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let row = match row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    let response = RatingResponse {
        id: rating_id,
        rater_id: row.get::<Uuid, _>("rater_id").to_string(),
        ratee_id: row.get::<Uuid, _>("ratee_id").to_string(),
        shipment_id: row.get::<Option<Uuid>, _>("shipment_id").map(|id| id.to_string()),
        rating: row.get::<i32, _>("rating"),
        comment: row.get::<Option<String>, _>("comment"),
        blockchain_tx_hash: row.get::<Option<String>, _>("blockchain_tx_hash"),
        created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
    };

    Ok(Json(response))
}

pub async fn get_user_ratings(
    State(state): State<crate::AppState>,
    Path(user_id): Path<String>,
) -> Result<Json<UserRatingSummary>, StatusCode> {
    info!("Fetching ratings for user: {}", user_id);

    let id = Uuid::parse_str(&user_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Get average rating and total count
    let avg_rating_row = sqlx::query(
        "SELECT AVG(rating) as avg_rating, COUNT(*) as total_count FROM ratings WHERE ratee_id = $1"
    )
    .bind(id)
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let average_rating: f64 = avg_rating_row.get("avg_rating").unwrap_or(0.0);
    let total_ratings: i64 = avg_rating_row.get("total_count");

    // Get rating breakdown
    let breakdown_rows = sqlx::query(
        "SELECT rating, COUNT(*) as count FROM ratings WHERE ratee_id = $1 GROUP BY rating ORDER BY rating"
    )
    .bind(id)
    .fetch_all(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let rating_breakdown = breakdown_rows
        .into_iter()
        .map(|row| {
            let rating: i32 = row.get("rating");
            let count: i64 = row.get("count");
            let percentage = if total_ratings > 0 {
                (count as f64 / total_ratings as f64) * 100.0
            } else {
                0.0
            };

            RatingBreakdown {
                rating,
                count,
                percentage,
            }
        })
        .collect();

    // Get recent ratings
    let recent_rows = sqlx::query(
        "SELECT * FROM ratings WHERE ratee_id = $1 ORDER BY created_at DESC LIMIT 10"
    )
    .bind(id)
    .fetch_all(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let recent_ratings = recent_rows
        .into_iter()
        .map(|row| RatingResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            rater_id: row.get::<Uuid, _>("rater_id").to_string(),
            ratee_id: row.get::<Uuid, _>("ratee_id").to_string(),
            shipment_id: row.get::<Option<Uuid>, _>("shipment_id").map(|id| id.to_string()),
            rating: row.get::<i32, _>("rating"),
            comment: row.get::<Option<String>, _>("comment"),
            blockchain_tx_hash: row.get::<Option<String>, _>("blockchain_tx_hash"),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        })
        .collect();

    let response = UserRatingSummary {
        user_id,
        average_rating,
        total_ratings,
        rating_breakdown,
        recent_ratings,
    };

    Ok(Json(response))
}

pub async fn get_shipment_ratings(
    State(state): State<crate::AppState>,
    Path(shipment_id): Path<String>,
) -> Result<Json<Vec<RatingResponse>>, StatusCode> {
    info!("Fetching ratings for shipment: {}", shipment_id);

    let id = Uuid::parse_str(&shipment_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    let rows = sqlx::query(
        "SELECT * FROM ratings WHERE shipment_id = $1 ORDER BY created_at DESC"
    )
    .bind(id)
    .fetch_all(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let ratings = rows
        .into_iter()
        .map(|row| RatingResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            rater_id: row.get::<Uuid, _>("rater_id").to_string(),
            ratee_id: row.get::<Uuid, _>("ratee_id").to_string(),
            shipment_id: row.get::<Option<Uuid>, _>("shipment_id").map(|id| id.to_string()),
            rating: row.get::<i32, _>("rating"),
            comment: row.get::<Option<String>, _>("comment"),
            blockchain_tx_hash: row.get::<Option<String>, _>("blockchain_tx_hash"),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        })
        .collect();

    Ok(Json(ratings))
}

// Helper functions

async fn generate_blockchain_transaction(rating_id: &Uuid) -> String {
    // In a real implementation, this would create a blockchain transaction
    // For now, we'll simulate a transaction hash
    format!("0x{:x}", rand::random::<u64>())
}
