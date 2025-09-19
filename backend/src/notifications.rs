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
pub struct NotificationsService {
    db: Database,
}

impl NotificationsService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct UpdateNotificationSettingsRequest {
    pub email_notifications: bool,
    pub sms_notifications: bool,
    pub push_notifications: bool,
    pub shipment_updates: bool,
    pub payment_notifications: bool,
    pub marketing_emails: bool,
}

#[derive(Debug, Serialize)]
pub struct NotificationResponse {
    pub id: String,
    pub user_id: String,
    pub title: String,
    pub message: String,
    pub notification_type: String,
    pub is_read: bool,
    pub data: serde_json::Value,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct NotificationSettingsResponse {
    pub user_id: String,
    pub email_notifications: bool,
    pub sms_notifications: bool,
    pub push_notifications: bool,
    pub shipment_updates: bool,
    pub payment_notifications: bool,
    pub marketing_emails: bool,
    pub updated_at: String,
}

pub async fn get_notifications(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<NotificationResponse>>, StatusCode> {
    info!("Fetching notifications");

    let user_id = params.get("user_id").and_then(|v| v.as_str()).unwrap_or("default");
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(50);
    let unread_only = params.get("unread_only").and_then(|v| v.as_bool()).unwrap_or(false);

    let mut query = "SELECT * FROM notifications WHERE user_id = $1".to_string();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 2;

    if unread_only {
        query.push_str(&format!(" AND is_read = ${}", param_count));
        bind_values.push(Box::new(false));
        param_count += 1;
    }

    query.push_str(&format!(" ORDER BY created_at DESC LIMIT ${}", param_count));
    bind_values.push(Box::new(limit as i64));

    let rows = sqlx::query(&query)
        .bind(Uuid::parse_str(user_id).map_err(|_| StatusCode::BAD_REQUEST)?)
        .fetch_all(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let notifications = rows
        .into_iter()
        .map(|row| NotificationResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            user_id: row.get::<Uuid, _>("user_id").to_string(),
            title: row.get::<String, _>("title"),
            message: row.get::<String, _>("message"),
            notification_type: row.get::<String, _>("notification_type"),
            is_read: row.get::<bool, _>("is_read"),
            data: row.get::<serde_json::Value, _>("data"),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        })
        .collect();

    Ok(Json(notifications))
}

pub async fn mark_read(
    State(state): State<crate::AppState>,
    Path(notification_id): Path<String>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Marking notification as read: {}", notification_id);

    let id = Uuid::parse_str(&notification_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    sqlx::query("UPDATE notifications SET is_read = true WHERE id = $1")
        .bind(id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(serde_json::json!({
        "status": "success",
        "message": "Notification marked as read"
    })))
}

pub async fn get_settings(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<NotificationSettingsResponse>, StatusCode> {
    info!("Fetching notification settings");

    let user_id = params.get("user_id").and_then(|v| v.as_str()).unwrap_or("default");

    // Mock notification settings
    let response = NotificationSettingsResponse {
        user_id: user_id.to_string(),
        email_notifications: true,
        sms_notifications: true,
        push_notifications: true,
        shipment_updates: true,
        payment_notifications: true,
        marketing_emails: false,
        updated_at: Utc::now().to_rfc3339(),
    };

    Ok(Json(response))
}

pub async fn update_settings(
    State(state): State<crate::AppState>,
    Json(payload): Json<UpdateNotificationSettingsRequest>,
) -> Result<Json<NotificationSettingsResponse>, StatusCode> {
    info!("Updating notification settings");

    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // In a real implementation, this would update the user's notification settings in the database
    // For now, we'll return the updated settings

    let response = NotificationSettingsResponse {
        user_id: user_id.to_string(),
        email_notifications: payload.email_notifications,
        sms_notifications: payload.sms_notifications,
        push_notifications: payload.push_notifications,
        shipment_updates: payload.shipment_updates,
        payment_notifications: payload.payment_notifications,
        marketing_emails: payload.marketing_emails,
        updated_at: Utc::now().to_rfc3339(),
    };

    Ok(Json(response))
}
