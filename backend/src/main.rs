use axum::{
    extract::{Path, Query, State},
    http::{HeaderMap, StatusCode},
    response::{Html, Json},
    routing::{get, post, put, delete},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use tracing::{info, warn, error};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod auth;
mod web3;
mod tracking;
mod ai;
mod support;
mod confirmation;
mod database;
mod models;
mod services;
mod utils;
mod config;
mod blockchain_payment;
mod smart_contracts;
mod defi;
mod nft;

use crate::config::Config;
use crate::database::Database;

#[derive(Clone)]
pub struct AppState {
    pub db: Database,
    pub config: Config,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "web3_shipping_platform=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("Starting Web3 Shipping Platform Backend...");

    // Load configuration
    let config = Config::load()?;
    info!("Configuration loaded successfully");

    // Initialize database
    let db = Database::new(&config.database_url).await?;
    info!("Database connection established");

    // Run migrations
    db.migrate().await?;
    info!("Database migrations completed");

    // Initialize services
    let auth_service = auth::AuthService::new(&config, &db);
    let web3_service = web3::Web3Service::new(&config);
    let tracking_service = tracking::TrackingService::new(&db);
    let ai_service = ai::AIService::new(&db);
    let support_service = support::SupportService::new(&db);
    let confirmation_service = confirmation::ConfirmationService::new(&db);

    let app_state = AppState {
        db,
        config: config.clone(),
    };

    // Build application routes
    let app = Router::new()
        // Health check
        .route("/health", get(health_check))
        
        // Authentication routes
        .route("/api/auth/register", post(auth::register))
        .route("/api/auth/login", post(auth::login))
        .route("/api/auth/logout", post(auth::logout))
        .route("/api/auth/verify", post(auth::verify))
        .route("/api/auth/refresh", post(auth::refresh_token))
        .route("/api/auth/profile", get(auth::get_profile))
        .route("/api/auth/profile", put(auth::update_profile))
        
        // Advanced authentication
        .route("/api/auth/kyc", post(auth::kyc_verification))
        .route("/api/auth/biometric", post(auth::biometric_auth))
        .route("/api/auth/world-id", post(auth::world_id_verify))
        .route("/api/auth/internet-identity", post(auth::internet_identity_auth))
        
        // Web3 & Blockchain routes
        .route("/api/web3/connect", post(web3::connect_wallet))
        .route("/api/web3/balance", get(web3::get_balance))
        .route("/api/web3/send", post(web3::send_transaction))
        .route("/api/web3/nft/mint", post(web3::mint_nft))
        .route("/api/web3/nft/:id", get(web3::get_nft))
        
        // ICP Integration
        .route("/api/icp/connect", post(web3::connect_icp))
        .route("/api/icp/canister/:id", get(web3::get_canister))
        .route("/api/icp/call", post(web3::call_canister))
        
        // Tracking routes
        .route("/api/tracking/create", post(tracking::create_shipment))
        .route("/api/tracking/:id", get(tracking::get_shipment))
        .route("/api/tracking/:id/update", put(tracking::update_location))
        .route("/api/tracking/:id/status", put(tracking::update_status))
        .route("/api/tracking/:id/nft", post(tracking::convert_to_nft))
        .route("/api/tracking/search", get(tracking::search_shipments))
        
        // AI Suggestions routes
        .route("/api/ai/suggestions", get(ai::get_suggestions))
        .route("/api/ai/predictions", get(ai::get_predictions))
        .route("/api/ai/risks", get(ai::get_risk_assessment))
        .route("/api/ai/insights", get(ai::get_insights))
        .route("/api/ai/apply-suggestion", post(ai::apply_suggestion))
        
        // Support system routes
        .route("/api/support/tickets", get(support::get_tickets))
        .route("/api/support/tickets", post(support::create_ticket))
        .route("/api/support/tickets/:id", get(support::get_ticket))
        .route("/api/support/tickets/:id", put(support::update_ticket))
        .route("/api/support/chat/start", post(support::start_chat))
        .route("/api/support/chat/:id/messages", get(support::get_messages))
        .route("/api/support/chat/:id/messages", post(support::send_message))
        .route("/api/support/video/start", post(support::start_video_call))
        .route("/api/support/knowledge", get(support::get_knowledge_base))
        
        // Dual confirmation routes
        .route("/api/confirmation/create", post(confirmation::create_confirmation))
        .route("/api/confirmation/:id", get(confirmation::get_confirmation))
        .route("/api/confirmation/:id/confirm", post(confirmation::confirm))
        .route("/api/confirmation/:id/cancel", post(confirmation::cancel))
        .route("/api/confirmation/pending", get(confirmation::get_pending))
        .route("/api/confirmation/completed", get(confirmation::get_completed))
        
        // Business Intelligence routes
        .route("/api/analytics/kpis", get(analytics::get_kpis))
        .route("/api/analytics/revenue", get(analytics::get_revenue_analytics))
        .route("/api/analytics/customers", get(analytics::get_customer_analytics))
        .route("/api/analytics/products", get(analytics::get_product_analytics))
        .route("/api/analytics/campaigns", get(analytics::get_campaign_analytics))
        .route("/api/analytics/export", get(analytics::export_data))
        
        // Insurance routes
        .route("/api/insurance/policies", get(insurance::get_policies))
        .route("/api/insurance/policies", post(insurance::create_policy))
        .route("/api/insurance/claims", post(insurance::create_claim))
        .route("/api/insurance/claims/:id", get(insurance::get_claim))
        
        // Rating system routes
        .route("/api/ratings", post(rating::create_rating))
        .route("/api/ratings/:id", get(rating::get_rating))
        .route("/api/ratings/user/:user_id", get(rating::get_user_ratings))
        .route("/api/ratings/shipment/:shipment_id", get(rating::get_shipment_ratings))
        
        // Blockchain Payment routes (replaces traditional payments)
        .route("/api/blockchain/payments/crypto", post(blockchain_payment::create_crypto_payment))
        .route("/api/blockchain/payments/icp", post(blockchain_payment::create_icp_payment))
        .route("/api/blockchain/payments/nft", post(blockchain_payment::create_nft_payment))
        .route("/api/blockchain/balance/crypto", get(blockchain_payment::get_crypto_balance))
        .route("/api/blockchain/balance/icp", get(blockchain_payment::get_icp_balance))
        .route("/api/blockchain/defi/yields", get(blockchain_payment::get_defi_yields))
        .route("/api/blockchain/smart-contract/execute", post(blockchain_payment::execute_smart_contract))
        
        // Smart Contracts routes
        .route("/api/smart-contracts/deploy", post(smart_contracts::deploy_contract))
        .route("/api/smart-contracts/execute", post(smart_contracts::execute_contract_function))
        .route("/api/smart-contracts/shipment", post(smart_contracts::create_shipment_contract))
        .route("/api/smart-contracts/events", get(smart_contracts::get_contract_events))
        .route("/api/smart-contracts/balance/:address", get(smart_contracts::get_contract_balance))
        .route("/api/smart-contracts/trigger-event", post(smart_contracts::trigger_contract_event))
        
        // DeFi routes
        .route("/api/defi/staking", post(defi::create_staking))
        .route("/api/defi/liquidity-pool", post(defi::create_liquidity_pool))
        .route("/api/defi/lending", post(defi::create_lending))
        .route("/api/defi/yield-farming", post(defi::create_yield_farming))
        .route("/api/defi/portfolio", get(defi::get_defi_portfolio))
        .route("/api/defi/protocols", get(defi::get_defi_protocols))
        .route("/api/defi/rewards/:position_id/claim", post(defi::claim_rewards))
        
        // NFT routes
        .route("/api/nft/shipment", post(nft::create_shipment_nft))
        .route("/api/nft/document", post(nft::create_document_nft))
        .route("/api/nft/certificate", post(nft::create_certificate_nft))
        .route("/api/nft/reward", post(nft::create_reward_nft))
        .route("/api/nft/collections", get(nft::get_nft_collections))
        .route("/api/nft/marketplace/list", post(nft::list_nft_on_marketplace))
        .route("/api/nft/transfer", post(nft::transfer_nft))
        
        // Business integrations
        .route("/api/integrations/shopify", post(integrations::shopify_connect))
        .route("/api/integrations/woocommerce", post(integrations::woocommerce_connect))
        .route("/api/integrations/wix", post(integrations::wix_connect))
        .route("/api/integrations/easyorder", post(integrations::easyorder_connect))
        
        // Dashboard routes
        .route("/api/dashboard/customer", get(dashboard::customer_dashboard))
        .route("/api/dashboard/store", get(dashboard::store_dashboard))
        .route("/api/dashboard/driver", get(dashboard::driver_dashboard))
        .route("/api/dashboard/admin", get(dashboard::admin_dashboard))
        
        // File upload routes
        .route("/api/upload/document", post(upload::upload_document))
        .route("/api/upload/image", post(upload::upload_image))
        .route("/api/upload/avatar", post(upload::upload_avatar))
        
        // Notification routes
        .route("/api/notifications", get(notifications::get_notifications))
        .route("/api/notifications/:id/read", put(notifications::mark_read))
        .route("/api/notifications/settings", get(notifications::get_settings))
        .route("/api/notifications/settings", put(notifications::update_settings))
        
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
        )
        .with_state(app_state);

    // Start server
    let listener = tokio::net::TcpListener::bind(&config.server_address).await?;
    info!("Server listening on {}", config.server_address);
    
    axum::serve(listener, app).await?;
    
    Ok(())
}

async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now(),
        "version": env!("CARGO_PKG_VERSION")
    }))
}

// Include all modules
mod analytics;
mod insurance;
mod rating;
mod payment;
mod integrations;
mod dashboard;
mod upload;
mod notifications;
