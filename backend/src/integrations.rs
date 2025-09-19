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
pub struct IntegrationsService {
    db: Database,
}

impl IntegrationsService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct ShopifyConnectRequest {
    pub shop_domain: String,
    pub access_token: String,
    pub webhook_url: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct WooCommerceConnectRequest {
    pub store_url: String,
    pub consumer_key: String,
    pub consumer_secret: String,
    pub webhook_url: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct WixConnectRequest {
    pub site_id: String,
    pub api_key: String,
    pub webhook_url: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct EasyOrderConnectRequest {
    pub store_id: String,
    pub api_key: String,
    pub webhook_url: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct IntegrationResponse {
    pub id: String,
    pub user_id: String,
    pub platform: String,
    pub status: String,
    pub connected_at: String,
    pub last_sync: Option<String>,
    pub webhook_url: Option<String>,
}

pub async fn shopify_connect(
    State(state): State<crate::AppState>,
    Json(payload): Json<ShopifyConnectRequest>,
) -> Result<Json<IntegrationResponse>, StatusCode> {
    info!("Connecting Shopify store: {}", payload.shop_domain);

    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user
    let integration_id = Uuid::new_v4();

    // Verify Shopify connection
    let connection_valid = verify_shopify_connection(&payload).await;
    if !connection_valid {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Create integration
    sqlx::query(
        r#"
        INSERT INTO business_integrations (
            id, user_id, platform, api_key, api_secret, webhook_url, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#,
    )
    .bind(integration_id)
    .bind(user_id)
    .bind(&IntegrationPlatform::Shopify)
    .bind(&payload.access_token)
    .bind(&payload.shop_domain)
    .bind(&payload.webhook_url)
    .bind(&IntegrationStatus::Active)
    .bind(Utc::now())
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating Shopify integration: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = IntegrationResponse {
        id: integration_id.to_string(),
        user_id: user_id.to_string(),
        platform: "shopify".to_string(),
        status: "active".to_string(),
        connected_at: Utc::now().to_rfc3339(),
        last_sync: None,
        webhook_url: payload.webhook_url,
    };

    info!("Shopify integration created successfully: {}", integration_id);

    Ok(Json(response))
}

pub async fn woocommerce_connect(
    State(state): State<crate::AppState>,
    Json(payload): Json<WooCommerceConnectRequest>,
) -> Result<Json<IntegrationResponse>, StatusCode> {
    info!("Connecting WooCommerce store: {}", payload.store_url);

    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user
    let integration_id = Uuid::new_v4();

    // Verify WooCommerce connection
    let connection_valid = verify_woocommerce_connection(&payload).await;
    if !connection_valid {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Create integration
    sqlx::query(
        r#"
        INSERT INTO business_integrations (
            id, user_id, platform, api_key, api_secret, webhook_url, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#,
    )
    .bind(integration_id)
    .bind(user_id)
    .bind(&IntegrationPlatform::WooCommerce)
    .bind(&payload.consumer_key)
    .bind(&payload.consumer_secret)
    .bind(&payload.webhook_url)
    .bind(&IntegrationStatus::Active)
    .bind(Utc::now())
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating WooCommerce integration: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = IntegrationResponse {
        id: integration_id.to_string(),
        user_id: user_id.to_string(),
        platform: "woocommerce".to_string(),
        status: "active".to_string(),
        connected_at: Utc::now().to_rfc3339(),
        last_sync: None,
        webhook_url: payload.webhook_url,
    };

    info!("WooCommerce integration created successfully: {}", integration_id);

    Ok(Json(response))
}

pub async fn wix_connect(
    State(state): State<crate::AppState>,
    Json(payload): Json<WixConnectRequest>,
) -> Result<Json<IntegrationResponse>, StatusCode> {
    info!("Connecting Wix site: {}", payload.site_id);

    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user
    let integration_id = Uuid::new_v4();

    // Verify Wix connection
    let connection_valid = verify_wix_connection(&payload).await;
    if !connection_valid {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Create integration
    sqlx::query(
        r#"
        INSERT INTO business_integrations (
            id, user_id, platform, api_key, api_secret, webhook_url, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#,
    )
    .bind(integration_id)
    .bind(user_id)
    .bind(&IntegrationPlatform::Wix)
    .bind(&payload.api_key)
    .bind(&payload.site_id)
    .bind(&payload.webhook_url)
    .bind(&IntegrationStatus::Active)
    .bind(Utc::now())
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating Wix integration: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = IntegrationResponse {
        id: integration_id.to_string(),
        user_id: user_id.to_string(),
        platform: "wix".to_string(),
        status: "active".to_string(),
        connected_at: Utc::now().to_rfc3339(),
        last_sync: None,
        webhook_url: payload.webhook_url,
    };

    info!("Wix integration created successfully: {}", integration_id);

    Ok(Json(response))
}

pub async fn easyorder_connect(
    State(state): State<crate::AppState>,
    Json(payload): Json<EasyOrderConnectRequest>,
) -> Result<Json<IntegrationResponse>, StatusCode> {
    info!("Connecting EasyOrder store: {}", payload.store_id);

    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user
    let integration_id = Uuid::new_v4();

    // Verify EasyOrder connection
    let connection_valid = verify_easyorder_connection(&payload).await;
    if !connection_valid {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Create integration
    sqlx::query(
        r#"
        INSERT INTO business_integrations (
            id, user_id, platform, api_key, api_secret, webhook_url, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#,
    )
    .bind(integration_id)
    .bind(user_id)
    .bind(&IntegrationPlatform::EasyOrder)
    .bind(&payload.api_key)
    .bind(&payload.store_id)
    .bind(&payload.webhook_url)
    .bind(&IntegrationStatus::Active)
    .bind(Utc::now())
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating EasyOrder integration: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = IntegrationResponse {
        id: integration_id.to_string(),
        user_id: user_id.to_string(),
        platform: "easyorder".to_string(),
        status: "active".to_string(),
        connected_at: Utc::now().to_rfc3339(),
        last_sync: None,
        webhook_url: payload.webhook_url,
    };

    info!("EasyOrder integration created successfully: {}", integration_id);

    Ok(Json(response))
}

// Helper functions

async fn verify_shopify_connection(request: &ShopifyConnectRequest) -> bool {
    // In a real implementation, this would verify the Shopify connection
    // by making an API call to the Shopify store
    !request.shop_domain.is_empty() && !request.access_token.is_empty()
}

async fn verify_woocommerce_connection(request: &WooCommerceConnectRequest) -> bool {
    // In a real implementation, this would verify the WooCommerce connection
    // by making an API call to the WooCommerce store
    !request.store_url.is_empty() && !request.consumer_key.is_empty() && !request.consumer_secret.is_empty()
}

async fn verify_wix_connection(request: &WixConnectRequest) -> bool {
    // In a real implementation, this would verify the Wix connection
    // by making an API call to the Wix site
    !request.site_id.is_empty() && !request.api_key.is_empty()
}

async fn verify_easyorder_connection(request: &EasyOrderConnectRequest) -> bool {
    // In a real implementation, this would verify the EasyOrder connection
    // by making an API call to the EasyOrder store
    !request.store_id.is_empty() && !request.api_key.is_empty()
}
