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
pub struct PaymentService {
    db: Database,
}

impl PaymentService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreatePaymentRequest {
    pub shipment_id: Option<String>,
    pub amount: f64,
    pub currency: String,
    pub payment_method: String,
    pub recipient_address: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateInvoiceRequest {
    pub customer_id: String,
    pub items: Vec<InvoiceItem>,
    pub due_date: String,
    pub notes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct InvoiceItem {
    pub description: String,
    pub quantity: i32,
    pub unit_price: f64,
    pub total: f64,
}

#[derive(Debug, Serialize)]
pub struct PaymentResponse {
    pub id: String,
    pub user_id: String,
    pub shipment_id: Option<String>,
    pub amount: f64,
    pub currency: String,
    pub payment_method: String,
    pub status: String,
    pub blockchain_tx_hash: Option<String>,
    pub created_at: String,
    pub completed_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct InvoiceResponse {
    pub id: String,
    pub invoice_number: String,
    pub customer_id: String,
    pub items: Vec<InvoiceItem>,
    pub subtotal: f64,
    pub tax: f64,
    pub total: f64,
    pub status: String,
    pub due_date: String,
    pub notes: Option<String>,
    pub created_at: String,
    pub paid_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct CryptoBalanceResponse {
    pub address: String,
    pub currency: String,
    pub balance: f64,
    pub usd_value: f64,
    pub last_updated: String,
}

pub async fn create_payment(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreatePaymentRequest>,
) -> Result<Json<PaymentResponse>, StatusCode> {
    info!("Creating payment: {} {}", payload.amount, payload.currency);

    // Validate amount
    if payload.amount <= 0.0 {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Parse payment method
    let payment_method = match payload.payment_method.as_str() {
        "bitcoin" => PaymentMethod::Bitcoin,
        "ethereum" => PaymentMethod::Ethereum,
        "usdt" => PaymentMethod::Usdt,
        "usdc" => PaymentMethod::Usdc,
        "bnb" => PaymentMethod::Bnb,
        "ada" => PaymentMethod::Ada,
        "sol" => PaymentMethod::Sol,
        "matic" => PaymentMethod::Matic,
        "credit_card" => PaymentMethod::CreditCard,
        "bank_transfer" => PaymentMethod::BankTransfer,
        _ => return Err(StatusCode::BAD_REQUEST),
    };

    let payment_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // In real implementation, get from authenticated user

    // Parse shipment_id if provided
    let shipment_id = if let Some(sid) = payload.shipment_id {
        Some(Uuid::parse_str(&sid).map_err(|_| StatusCode::BAD_REQUEST)?)
    } else {
        None
    };

    // Verify shipment exists if provided
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

    // Create payment
    sqlx::query(
        r#"
        INSERT INTO payments (
            id, user_id, shipment_id, amount, currency, payment_method, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        "#,
    )
    .bind(payment_id)
    .bind(user_id)
    .bind(shipment_id)
    .bind(payload.amount)
    .bind(&payload.currency)
    .bind(&payment_method)
    .bind(&PaymentStatus::Pending)
    .bind(Utc::now())
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating payment: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    // Process payment based on method
    let payment_result = process_payment(&payload, &payment_id).await;

    let (status, blockchain_tx_hash, completed_at) = match payment_result {
        Ok(result) => {
            // Update payment status
            sqlx::query("UPDATE payments SET status = 'completed', blockchain_tx_hash = $1, completed_at = $2 WHERE id = $3")
                .bind(&result.tx_hash)
                .bind(Utc::now())
                .bind(payment_id)
                .execute(&state.db.pool)
                .await
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            (PaymentStatus::Completed, Some(result.tx_hash), Some(Utc::now()))
        },
        Err(_) => {
            // Update payment status to failed
            sqlx::query("UPDATE payments SET status = 'failed' WHERE id = $1")
                .bind(payment_id)
                .execute(&state.db.pool)
                .await
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            (PaymentStatus::Failed, None, None)
        }
    };

    let response = PaymentResponse {
        id: payment_id.to_string(),
        user_id: user_id.to_string(),
        shipment_id: payload.shipment_id,
        amount: payload.amount,
        currency: payload.currency,
        payment_method: payload.payment_method,
        status: format!("{:?}", status).to_lowercase(),
        blockchain_tx_hash,
        created_at: Utc::now().to_rfc3339(),
        completed_at: completed_at.map(|dt| dt.to_rfc3339()),
    };

    info!("Payment created successfully: {}", payment_id);

    Ok(Json(response))
}

pub async fn get_payment(
    State(state): State<crate::AppState>,
    Path(payment_id): Path<String>,
) -> Result<Json<PaymentResponse>, StatusCode> {
    info!("Fetching payment: {}", payment_id);

    let id = Uuid::parse_str(&payment_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    let row = sqlx::query("SELECT * FROM payments WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let row = match row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    let response = PaymentResponse {
        id: payment_id,
        user_id: row.get::<Uuid, _>("user_id").to_string(),
        shipment_id: row.get::<Option<Uuid>, _>("shipment_id").map(|id| id.to_string()),
        amount: row.get::<f64, _>("amount"),
        currency: row.get::<String, _>("currency"),
        payment_method: format!("{:?}", row.get::<PaymentMethod, _>("payment_method")).to_lowercase(),
        status: format!("{:?}", row.get::<PaymentStatus, _>("status")).to_lowercase(),
        blockchain_tx_hash: row.get::<Option<String>, _>("blockchain_tx_hash"),
        created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        completed_at: row.get::<Option<chrono::DateTime<Utc>>, _>("completed_at")
            .map(|dt| dt.to_rfc3339()),
    };

    Ok(Json(response))
}

pub async fn confirm_payment(
    State(state): State<crate::AppState>,
    Path(payment_id): Path<String>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Confirming payment: {}", payment_id);

    let id = Uuid::parse_str(&payment_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Get payment
    let payment_row = sqlx::query("SELECT * FROM payments WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let payment_row = match payment_row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    let status: PaymentStatus = payment_row.get("status");
    if !matches!(status, PaymentStatus::Pending) {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Confirm payment (in real implementation, this would verify blockchain transaction)
    let confirmation_result = confirm_blockchain_transaction(&payment_row).await;

    if confirmation_result {
        // Update payment status
        sqlx::query("UPDATE payments SET status = 'completed', completed_at = $1 WHERE id = $2")
            .bind(Utc::now())
            .bind(id)
            .execute(&state.db.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        info!("Payment confirmed successfully: {}", payment_id);

        Ok(Json(serde_json::json!({
            "status": "confirmed",
            "message": "Payment confirmed successfully",
            "confirmed_at": Utc::now().to_rfc3339()
        })))
    } else {
        // Update payment status to failed
        sqlx::query("UPDATE payments SET status = 'failed' WHERE id = $1")
            .bind(id)
            .execute(&state.db.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        Err(StatusCode::BAD_REQUEST)
    }
}

pub async fn get_crypto_balance(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<CryptoBalanceResponse>, StatusCode> {
    info!("Fetching crypto balance");

    let address = params.get("address").and_then(|v| v.as_str()).unwrap_or("");
    let currency = params.get("currency").and_then(|v| v.as_str()).unwrap_or("ETH");

    // In a real implementation, this would query the blockchain
    // For now, we'll return mock data
    let balance = get_blockchain_balance(address, currency).await;

    let response = CryptoBalanceResponse {
        address: address.to_string(),
        currency: currency.to_string(),
        balance,
        usd_value: balance * get_crypto_price(currency).await,
        last_updated: Utc::now().to_rfc3339(),
    };

    Ok(Json(response))
}

pub async fn get_invoices(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<InvoiceResponse>>, StatusCode> {
    info!("Fetching invoices");

    let customer_id = params.get("customer_id").and_then(|v| v.as_str());
    let status = params.get("status").and_then(|v| v.as_str());
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(50);

    // Mock data for invoices
    let invoices = vec![
        InvoiceResponse {
            id: Uuid::new_v4().to_string(),
            invoice_number: "INV-2024-001".to_string(),
            customer_id: "customer_1".to_string(),
            items: vec![
                InvoiceItem {
                    description: "خدمة الشحن".to_string(),
                    quantity: 1,
                    unit_price: 50.0,
                    total: 50.0,
                },
                InvoiceItem {
                    description: "التأمين".to_string(),
                    quantity: 1,
                    unit_price: 10.0,
                    total: 10.0,
                },
            ],
            subtotal: 60.0,
            tax: 9.0,
            total: 69.0,
            status: "paid".to_string(),
            due_date: (Utc::now() + chrono::Duration::days(30)).to_rfc3339(),
            notes: Some("شكراً لاستخدام خدماتنا".to_string()),
            created_at: Utc::now().to_rfc3339(),
            paid_at: Some(Utc::now().to_rfc3339()),
        },
    ];

    Ok(Json(invoices))
}

pub async fn create_invoice(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateInvoiceRequest>,
) -> Result<Json<InvoiceResponse>, StatusCode> {
    info!("Creating invoice for customer: {}", payload.customer_id);

    let invoice_id = Uuid::new_v4();
    let invoice_number = generate_invoice_number();

    // Parse due date
    let due_date = chrono::DateTime::parse_from_rfc3339(&payload.due_date)
        .map_err(|_| StatusCode::BAD_REQUEST)?
        .with_timezone(&Utc);

    // Calculate totals
    let subtotal: f64 = payload.items.iter().map(|item| item.total).sum();
    let tax = subtotal * 0.15; // 15% tax
    let total = subtotal + tax;

    let response = InvoiceResponse {
        id: invoice_id.to_string(),
        invoice_number,
        customer_id: payload.customer_id,
        items: payload.items,
        subtotal,
        tax,
        total,
        status: "pending".to_string(),
        due_date: payload.due_date,
        notes: payload.notes,
        created_at: Utc::now().to_rfc3339(),
        paid_at: None,
    };

    info!("Invoice created successfully: {}", invoice_id);

    Ok(Json(response))
}

// Helper functions

#[derive(Debug)]
struct PaymentResult {
    tx_hash: String,
}

async fn process_payment(
    request: &CreatePaymentRequest,
    payment_id: &Uuid,
) -> Result<PaymentResult> {
    // In a real implementation, this would:
    // 1. Create blockchain transaction
    // 2. Wait for confirmation
    // 3. Return transaction hash
    
    // For now, we'll simulate payment processing
    Ok(PaymentResult {
        tx_hash: format!("0x{:x}", rand::random::<u64>()),
    })
}

async fn confirm_blockchain_transaction(payment_row: &sqlx::postgres::PgRow) -> bool {
    // In a real implementation, this would verify the blockchain transaction
    // For now, we'll simulate confirmation
    true
}

async fn get_blockchain_balance(address: &str, currency: &str) -> f64 {
    // In a real implementation, this would query the blockchain
    // For now, we'll return mock data
    match currency {
        "ETH" => 1.5,
        "BTC" => 0.05,
        "USDT" => 1000.0,
        "USDC" => 500.0,
        _ => 0.0,
    }
}

async fn get_crypto_price(currency: &str) -> f64 {
    // In a real implementation, this would fetch from a price API
    // For now, we'll return mock prices
    match currency {
        "ETH" => 2000.0,
        "BTC" => 45000.0,
        "USDT" => 1.0,
        "USDC" => 1.0,
        _ => 0.0,
    }
}

fn generate_invoice_number() -> String {
    format!("INV-{}-{:03}", Utc::now().format("%Y"), rand::random::<u32>() % 1000)
}
