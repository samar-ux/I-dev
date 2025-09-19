use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use anyhow::Result;
use tracing::{info, warn, error};

// Common utility functions and types

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub message: Option<String>,
    pub error: Option<String>,
    pub timestamp: String,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: None,
            error: None,
            timestamp: Utc::now().to_rfc3339(),
        }
    }

    pub fn error(message: String) -> Self {
        Self {
            success: false,
            data: None,
            message: None,
            error: Some(message),
            timestamp: Utc::now().to_rfc3339(),
        }
    }

    pub fn message(message: String) -> Self {
        Self {
            success: true,
            data: None,
            message: Some(message),
            error: None,
            timestamp: Utc::now().to_rfc3339(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginationParams {
    pub page: Option<u32>,
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

impl Default for PaginationParams {
    fn default() -> Self {
        Self {
            page: Some(1),
            limit: Some(50),
            offset: Some(0),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginatedResponse<T> {
    pub data: Vec<T>,
    pub pagination: PaginationInfo,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginationInfo {
    pub page: u32,
    pub limit: u32,
    pub total: u64,
    pub pages: u32,
    pub has_next: bool,
    pub has_prev: bool,
}

impl PaginationInfo {
    pub fn new(page: u32, limit: u32, total: u64) -> Self {
        let pages = ((total as f64) / (limit as f64)).ceil() as u32;
        let has_next = page < pages;
        let has_prev = page > 1;

        Self {
            page,
            limit,
            total,
            pages,
            has_next,
            has_prev,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchParams {
    pub query: Option<String>,
    pub filters: Option<serde_json::Value>,
    pub sort_by: Option<String>,
    pub sort_order: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DateRange {
    pub start_date: Option<DateTime<Utc>>,
    pub end_date: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Location {
    pub latitude: f64,
    pub longitude: f64,
    pub address: Option<String>,
    pub city: Option<String>,
    pub country: Option<String>,
    pub postal_code: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ContactInfo {
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub address: Option<Location>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileInfo {
    pub id: String,
    pub filename: String,
    pub file_size: u64,
    pub file_type: String,
    pub url: String,
    pub uploaded_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NotificationData {
    pub title: String,
    pub message: String,
    pub notification_type: String,
    pub data: Option<serde_json::Value>,
    pub priority: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WebhookPayload {
    pub event: String,
    pub data: serde_json::Value,
    pub timestamp: DateTime<Utc>,
    pub signature: Option<String>,
}

// Validation functions
pub fn validate_email(email: &str) -> bool {
    let email_regex = regex::Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
    email_regex.is_match(email)
}

pub fn validate_phone(phone: &str) -> bool {
    let phone_regex = regex::Regex::new(r"^\+?[1-9]\d{1,14}$").unwrap();
    phone_regex.is_match(phone)
}

pub fn validate_password(password: &str) -> Result<()> {
    if password.len() < 8 {
        return Err(anyhow::anyhow!("Password must be at least 8 characters long"));
    }
    
    if !password.chars().any(|c| c.is_uppercase()) {
        return Err(anyhow::anyhow!("Password must contain at least one uppercase letter"));
    }
    
    if !password.chars().any(|c| c.is_lowercase()) {
        return Err(anyhow::anyhow!("Password must contain at least one lowercase letter"));
    }
    
    if !password.chars().any(|c| c.is_numeric()) {
        return Err(anyhow::anyhow!("Password must contain at least one number"));
    }
    
    Ok(())
}

pub fn validate_uuid(uuid_str: &str) -> Result<Uuid> {
    Uuid::parse_str(uuid_str).map_err(|e| anyhow::anyhow!("Invalid UUID: {}", e))
}

pub fn validate_currency(currency: &str) -> bool {
    let valid_currencies = ["USD", "SAR", "EUR", "GBP", "BTC", "ETH", "USDT", "USDC"];
    valid_currencies.contains(&currency)
}

pub fn validate_crypto_address(address: &str, currency: &str) -> bool {
    match currency {
        "bitcoin" | "BTC" => address.starts_with("1") || address.starts_with("3") || address.starts_with("bc1"),
        "ethereum" | "ETH" | "USDT" | "USDC" => address.starts_with("0x") && address.len() == 42,
        _ => false,
    }
}

// Formatting functions
pub fn format_currency(amount: f64, currency: &str) -> String {
    match currency {
        "USD" => format!("${:.2}", amount),
        "SAR" => format!("{:.2} ر.س", amount),
        "EUR" => format!("€{:.2}", amount),
        "GBP" => format!("£{:.2}", amount),
        _ => format!("{:.2} {}", amount, currency),
    }
}

pub fn format_date(date: DateTime<Utc>) -> String {
    date.format("%Y-%m-%d %H:%M:%S UTC").to_string()
}

pub fn format_duration(seconds: u64) -> String {
    let hours = seconds / 3600;
    let minutes = (seconds % 3600) / 60;
    let secs = seconds % 60;
    
    if hours > 0 {
        format!("{}:{}:{:02}", hours, minutes, secs)
    } else {
        format!("{}:{:02}", minutes, secs)
    }
}

pub fn format_file_size(bytes: u64) -> String {
    const UNITS: &[&str] = &["B", "KB", "MB", "GB", "TB"];
    let mut size = bytes as f64;
    let mut unit_index = 0;
    
    while size >= 1024.0 && unit_index < UNITS.len() - 1 {
        size /= 1024.0;
        unit_index += 1;
    }
    
    format!("{:.1} {}", size, UNITS[unit_index])
}

// Encryption/Decryption functions
pub fn encrypt_data(data: &str, key: &str) -> Result<String> {
    // In a real implementation, use proper encryption
    Ok(format!("encrypted_{}", data))
}

pub fn decrypt_data(encrypted_data: &str, key: &str) -> Result<String> {
    // In a real implementation, use proper decryption
    Ok(encrypted_data.replace("encrypted_", ""))
}

// Hash functions
pub fn hash_data(data: &str) -> String {
    use sha2::{Sha256, Digest};
    let mut hasher = Sha256::new();
    hasher.update(data.as_bytes());
    format!("{:x}", hasher.finalize())
}

// Random functions
pub fn generate_random_string(length: usize) -> String {
    use rand::Rng;
    const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let mut rng = rand::thread_rng();
    
    (0..length)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

pub fn generate_random_number(min: u32, max: u32) -> u32 {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    rng.gen_range(min..=max)
}

// Time functions
pub fn get_current_timestamp() -> i64 {
    Utc::now().timestamp()
}

pub fn get_timestamp_from_datetime(dt: DateTime<Utc>) -> i64 {
    dt.timestamp()
}

pub fn get_datetime_from_timestamp(ts: i64) -> DateTime<Utc> {
    DateTime::from_timestamp(ts, 0).unwrap_or_else(|| Utc::now())
}

// Distance calculation
pub fn calculate_distance(lat1: f64, lon1: f64, lat2: f64, lon2: f64) -> f64 {
    const EARTH_RADIUS: f64 = 6371.0; // Earth's radius in kilometers
    
    let dlat = (lat2 - lat1).to_radians();
    let dlon = (lon2 - lon1).to_radians();
    
    let a = (dlat / 2.0).sin().powi(2) + 
            lat1.to_radians().cos() * lat2.to_radians().cos() * 
            (dlon / 2.0).sin().powi(2);
    
    let c = 2.0 * a.sqrt().asin();
    
    EARTH_RADIUS * c
}

// Rate limiting
pub struct RateLimiter {
    pub requests_per_minute: u32,
    pub requests_per_hour: u32,
    pub requests_per_day: u32,
}

impl Default for RateLimiter {
    fn default() -> Self {
        Self {
            requests_per_minute: 60,
            requests_per_hour: 1000,
            requests_per_day: 10000,
        }
    }
}

// Error handling
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    
    #[error("Validation error: {0}")]
    Validation(String),
    
    #[error("Authentication error: {0}")]
    Authentication(String),
    
    #[error("Authorization error: {0}")]
    Authorization(String),
    
    #[error("Not found: {0}")]
    NotFound(String),
    
    #[error("Internal server error: {0}")]
    Internal(String),
    
    #[error("External service error: {0}")]
    ExternalService(String),
    
    #[error("Rate limit exceeded")]
    RateLimitExceeded,
    
    #[error("Invalid input: {0}")]
    InvalidInput(String),
}

impl From<AppError> for axum::http::StatusCode {
    fn from(err: AppError) -> Self {
        match err {
            AppError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::Validation(_) => StatusCode::BAD_REQUEST,
            AppError::Authentication(_) => StatusCode::UNAUTHORIZED,
            AppError::Authorization(_) => StatusCode::FORBIDDEN,
            AppError::NotFound(_) => StatusCode::NOT_FOUND,
            AppError::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::ExternalService(_) => StatusCode::BAD_GATEWAY,
            AppError::RateLimitExceeded => StatusCode::TOO_MANY_REQUESTS,
            AppError::InvalidInput(_) => StatusCode::BAD_REQUEST,
        }
    }
}

// Logging utilities
pub fn log_request(method: &str, path: &str, user_id: Option<&str>) {
    if let Some(uid) = user_id {
        info!("Request: {} {} by user {}", method, path, uid);
    } else {
        info!("Request: {} {}", method, path);
    }
}

pub fn log_error(error: &str, context: Option<&str>) {
    if let Some(ctx) = context {
        error!("Error in {}: {}", ctx, error);
    } else {
        error!("Error: {}", error);
    }
}

pub fn log_success(action: &str, details: Option<&str>) {
    if let Some(details) = details {
        info!("Success: {} - {}", action, details);
    } else {
        info!("Success: {}", action);
    }
}
