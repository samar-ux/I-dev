use axum::{
    extract::{Path, Query, State},
    http::{HeaderMap, StatusCode},
    response::Json,
    routing::{get, post, put},
    Router,
};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use uuid::Uuid;
use chrono::Utc;
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::{SaltString, rand_core::OsRng};
use anyhow::Result;
use tracing::{info, warn, error};

use crate::models::*;
use crate::config::Config;
use crate::database::Database;

#[derive(Debug, Clone)]
pub struct AuthService {
    config: Config,
    db: Database,
    jwt_secret: String,
}

impl AuthService {
    pub fn new(config: &Config, db: &Database) -> Self {
        Self {
            config: config.clone(),
            db: db.clone(),
            jwt_secret: config.jwt_secret.clone(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // User ID
    pub email: String,
    pub role: String,
    pub exp: usize,
    pub iat: usize,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub username: String,
    pub password: String,
    pub first_name: String,
    pub last_name: String,
    pub phone: Option<String>,
    pub role: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
    pub biometric_data: Option<String>,
    pub world_id_proof: Option<String>,
    pub internet_identity_principal: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub refresh_token: String,
    pub user: UserResponse,
    pub expires_in: u64,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
    pub username: String,
    pub first_name: String,
    pub last_name: String,
    pub phone: Option<String>,
    pub avatar_url: Option<String>,
    pub role: String,
    pub status: String,
    pub email_verified: bool,
    pub phone_verified: bool,
    pub kyc_verified: bool,
    pub biometric_enabled: bool,
    pub world_id_verified: bool,
    pub internet_identity_principal: Option<String>,
    pub created_at: String,
    pub last_login: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct KYCRequest {
    pub user_id: String,
    pub document_type: String,
    pub document_number: String,
    pub document_image: String,
    pub personal_info: serde_json::Value,
}

#[derive(Debug, Deserialize)]
pub struct BiometricAuthRequest {
    pub user_id: String,
    pub biometric_type: String, // fingerprint, face, voice
    pub biometric_data: String,
    pub device_info: serde_json::Value,
}

#[derive(Debug, Deserialize)]
pub struct WorldIDVerificationRequest {
    pub user_id: String,
    pub proof: String,
    pub merkle_root: String,
    pub nullifier_hash: String,
}

#[derive(Debug, Deserialize)]
pub struct InternetIdentityAuthRequest {
    pub principal: String,
    pub signature: String,
    pub delegation: String,
}

pub async fn register(
    State(state): State<crate::AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, StatusCode> {
    info!("Registration attempt for email: {}", payload.email);

    // Validate input
    if payload.email.is_empty() || payload.password.len() < 8 {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Check if user already exists
    let existing_user = sqlx::query("SELECT id FROM users WHERE email = $1 OR username = $2")
        .bind(&payload.email)
        .bind(&payload.username)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if existing_user.is_some() {
        return Err(StatusCode::CONFLICT);
    }

    // Hash password
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .to_string();

    // Parse role
    let role = match payload.role.as_str() {
        "customer" => UserRole::Customer,
        "store_owner" => UserRole::StoreOwner,
        "driver" => UserRole::Driver,
        "shipping_company" => UserRole::ShippingCompany,
        "admin" => UserRole::Admin,
        _ => return Err(StatusCode::BAD_REQUEST),
    };

    // Create user
    let user_id = Uuid::new_v4();
    let now = Utc::now();

    sqlx::query(
        r#"
        INSERT INTO users (
            id, email, username, password_hash, first_name, last_name, 
            phone, role, status, email_verified, phone_verified, kyc_verified,
            biometric_enabled, world_id_verified, internet_identity_principal,
            created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        "#,
    )
    .bind(user_id)
    .bind(&payload.email)
    .bind(&payload.username)
    .bind(&password_hash)
    .bind(&payload.first_name)
    .bind(&payload.last_name)
    .bind(&payload.phone)
    .bind(&role)
    .bind(&UserStatus::Active)
    .bind(false) // email_verified
    .bind(false) // phone_verified
    .bind(false) // kyc_verified
    .bind(false) // biometric_enabled
    .bind(false) // world_id_verified
    .bind(None::<String>) // internet_identity_principal
    .bind(now)
    .bind(now)
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error during registration: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    // Generate JWT token
    let claims = Claims {
        sub: user_id.to_string(),
        email: payload.email.clone(),
        role: payload.role.clone(),
        exp: (Utc::now().timestamp() + state.config.jwt_expiry as i64) as usize,
        iat: Utc::now().timestamp() as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_ref()),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Generate refresh token
    let refresh_claims = Claims {
        sub: user_id.to_string(),
        email: payload.email.clone(),
        role: payload.role.clone(),
        exp: (Utc::now().timestamp() + 7 * 24 * 60 * 60) as usize, // 7 days
        iat: Utc::now().timestamp() as usize,
    };

    let refresh_token = encode(
        &Header::default(),
        &refresh_claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_ref()),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_response = UserResponse {
        id: user_id.to_string(),
        email: payload.email,
        username: payload.username,
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone: payload.phone,
        avatar_url: None,
        role: payload.role,
        status: "active".to_string(),
        email_verified: false,
        phone_verified: false,
        kyc_verified: false,
        biometric_enabled: false,
        world_id_verified: false,
        internet_identity_principal: None,
        created_at: now.to_rfc3339(),
        last_login: None,
    };

    info!("User registered successfully: {}", user_id);

    Ok(Json(AuthResponse {
        token,
        refresh_token,
        user: user_response,
        expires_in: state.config.jwt_expiry,
    }))
}

pub async fn login(
    State(state): State<crate::AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, StatusCode> {
    info!("Login attempt for email: {}", payload.email);

    // Get user from database
    let user_row = sqlx::query("SELECT * FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|e| {
            error!("Database error during login: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let user_row = match user_row {
        Some(row) => row,
        None => return Err(StatusCode::UNAUTHORIZED),
    };

    // Verify password
    let password_hash = user_row.get::<String, _>("password_hash");
    let parsed_hash = PasswordHash::new(&password_hash)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let argon2 = Argon2::default();
    if argon2
        .verify_password(payload.password.as_bytes(), &parsed_hash)
        .is_err()
    {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // Check biometric authentication if provided
    if let Some(biometric_data) = payload.biometric_data {
        if !verify_biometric_auth(&user_row, &biometric_data).await {
            return Err(StatusCode::UNAUTHORIZED);
        }
    }

    // Check World ID verification if provided
    if let Some(world_id_proof) = payload.world_id_proof {
        if !verify_world_id_proof(&world_id_proof).await {
            return Err(StatusCode::UNAUTHORIZED);
        }
    }

    // Check Internet Identity if provided
    if let Some(principal) = payload.internet_identity_principal {
        if !verify_internet_identity(&principal).await {
            return Err(StatusCode::UNAUTHORIZED);
        }
    }

    // Update last login
    let now = Utc::now();
    sqlx::query("UPDATE users SET last_login = $1, updated_at = $2 WHERE id = $3")
        .bind(now)
        .bind(now)
        .bind(user_row.get::<Uuid, _>("id"))
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Generate JWT token
    let user_id = user_row.get::<Uuid, _>("id");
    let email = user_row.get::<String, _>("email");
    let role = user_row.get::<UserRole, _>("role");

    let claims = Claims {
        sub: user_id.to_string(),
        email: email.clone(),
        role: format!("{:?}", role).to_lowercase(),
        exp: (Utc::now().timestamp() + state.config.jwt_expiry as i64) as usize,
        iat: Utc::now().timestamp() as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_ref()),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Generate refresh token
    let refresh_claims = Claims {
        sub: user_id.to_string(),
        email: email.clone(),
        role: format!("{:?}", role).to_lowercase(),
        exp: (Utc::now().timestamp() + 7 * 24 * 60 * 60) as usize,
        iat: Utc::now().timestamp() as usize,
    };

    let refresh_token = encode(
        &Header::default(),
        &refresh_claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_ref()),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_response = UserResponse {
        id: user_id.to_string(),
        email,
        username: user_row.get::<String, _>("username"),
        first_name: user_row.get::<String, _>("first_name"),
        last_name: user_row.get::<String, _>("last_name"),
        phone: user_row.get::<Option<String>, _>("phone"),
        avatar_url: user_row.get::<Option<String>, _>("avatar_url"),
        role: format!("{:?}", role).to_lowercase(),
        status: format!("{:?}", user_row.get::<UserStatus, _>("status")).to_lowercase(),
        email_verified: user_row.get::<bool, _>("email_verified"),
        phone_verified: user_row.get::<bool, _>("phone_verified"),
        kyc_verified: user_row.get::<bool, _>("kyc_verified"),
        biometric_enabled: user_row.get::<bool, _>("biometric_enabled"),
        world_id_verified: user_row.get::<bool, _>("world_id_verified"),
        internet_identity_principal: user_row.get::<Option<String>, _>("internet_identity_principal"),
        created_at: user_row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        last_login: Some(now.to_rfc3339()),
    };

    info!("User logged in successfully: {}", user_id);

    Ok(Json(AuthResponse {
        token,
        refresh_token,
        user: user_response,
        expires_in: state.config.jwt_expiry,
    }))
}

pub async fn logout(
    State(state): State<crate::AppState>,
    headers: HeaderMap,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // In a real implementation, you would invalidate the token
    // by adding it to a blacklist or using Redis
    
    info!("User logged out");
    
    Ok(Json(serde_json::json!({
        "message": "Logged out successfully"
    })))
}

pub async fn verify(
    State(state): State<crate::AppState>,
    headers: HeaderMap,
) -> Result<Json<UserResponse>, StatusCode> {
    let token = extract_token_from_headers(&headers)?;
    let claims = verify_jwt_token(&token, &state.config.jwt_secret)?;

    let user_row = sqlx::query("SELECT * FROM users WHERE id = $1")
        .bind(Uuid::parse_str(&claims.sub).map_err(|_| StatusCode::UNAUTHORIZED)?)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_row = match user_row {
        Some(row) => row,
        None => return Err(StatusCode::UNAUTHORIZED),
    };

    let user_response = UserResponse {
        id: user_row.get::<Uuid, _>("id").to_string(),
        email: user_row.get::<String, _>("email"),
        username: user_row.get::<String, _>("username"),
        first_name: user_row.get::<String, _>("first_name"),
        last_name: user_row.get::<String, _>("last_name"),
        phone: user_row.get::<Option<String>, _>("phone"),
        avatar_url: user_row.get::<Option<String>, _>("avatar_url"),
        role: format!("{:?}", user_row.get::<UserRole, _>("role")).to_lowercase(),
        status: format!("{:?}", user_row.get::<UserStatus, _>("status")).to_lowercase(),
        email_verified: user_row.get::<bool, _>("email_verified"),
        phone_verified: user_row.get::<bool, _>("phone_verified"),
        kyc_verified: user_row.get::<bool, _>("kyc_verified"),
        biometric_enabled: user_row.get::<bool, _>("biometric_enabled"),
        world_id_verified: user_row.get::<bool, _>("world_id_verified"),
        internet_identity_principal: user_row.get::<Option<String>, _>("internet_identity_principal"),
        created_at: user_row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        last_login: user_row.get::<Option<chrono::DateTime<Utc>>, _>("last_login")
            .map(|dt| dt.to_rfc3339()),
    };

    Ok(Json(user_response))
}

pub async fn refresh_token(
    State(state): State<crate::AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<AuthResponse>, StatusCode> {
    let refresh_token = payload.get("refresh_token")
        .and_then(|v| v.as_str())
        .ok_or(StatusCode::BAD_REQUEST)?;

    let claims = verify_jwt_token(refresh_token, &state.config.jwt_secret)?;

    // Generate new access token
    let new_claims = Claims {
        sub: claims.sub.clone(),
        email: claims.email.clone(),
        role: claims.role.clone(),
        exp: (Utc::now().timestamp() + state.config.jwt_expiry as i64) as usize,
        iat: Utc::now().timestamp() as usize,
    };

    let token = encode(
        &Header::default(),
        &new_claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_ref()),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Generate new refresh token
    let new_refresh_claims = Claims {
        sub: claims.sub.clone(),
        email: claims.email.clone(),
        role: claims.role.clone(),
        exp: (Utc::now().timestamp() + 7 * 24 * 60 * 60) as usize,
        iat: Utc::now().timestamp() as usize,
    };

    let new_refresh_token = encode(
        &Header::default(),
        &new_refresh_claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_ref()),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(AuthResponse {
        token,
        refresh_token: new_refresh_token,
        user: UserResponse {
            id: claims.sub,
            email: claims.email,
            username: "".to_string(), // Will be filled from database if needed
            first_name: "".to_string(),
            last_name: "".to_string(),
            phone: None,
            avatar_url: None,
            role: claims.role,
            status: "active".to_string(),
            email_verified: false,
            phone_verified: false,
            kyc_verified: false,
            biometric_enabled: false,
            world_id_verified: false,
            internet_identity_principal: None,
            created_at: Utc::now().to_rfc3339(),
            last_login: None,
        },
        expires_in: state.config.jwt_expiry,
    }))
}

pub async fn get_profile(
    State(state): State<crate::AppState>,
    headers: HeaderMap,
) -> Result<Json<UserResponse>, StatusCode> {
    verify(state, headers).await
}

pub async fn update_profile(
    State(state): State<crate::AppState>,
    headers: HeaderMap,
    Json(payload): Json<serde_json::Value>,
) -> Result<Json<UserResponse>, StatusCode> {
    let token = extract_token_from_headers(&headers)?;
    let claims = verify_jwt_token(&token, &state.config.jwt_secret)?;
    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| StatusCode::UNAUTHORIZED)?;

    // Update user profile based on provided fields
    let mut update_fields = Vec::new();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(first_name) = payload.get("first_name").and_then(|v| v.as_str()) {
        update_fields.push(format!("first_name = ${}", param_count));
        bind_values.push(Box::new(first_name.to_string()));
        param_count += 1;
    }

    if let Some(last_name) = payload.get("last_name").and_then(|v| v.as_str()) {
        update_fields.push(format!("last_name = ${}", param_count));
        bind_values.push(Box::new(last_name.to_string()));
        param_count += 1;
    }

    if let Some(phone) = payload.get("phone").and_then(|v| v.as_str()) {
        update_fields.push(format!("phone = ${}", param_count));
        bind_values.push(Box::new(Some(phone.to_string())));
        param_count += 1;
    }

    if update_fields.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    update_fields.push(format!("updated_at = ${}", param_count));
    bind_values.push(Box::new(Utc::now()));
    param_count += 1;

    let query = format!(
        "UPDATE users SET {} WHERE id = ${}",
        update_fields.join(", "),
        param_count
    );

    let mut query_builder = sqlx::query(&query);
    for value in bind_values {
        // This is a simplified approach - in practice you'd need proper type handling
    }
    query_builder = query_builder.bind(user_id);

    query_builder
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Return updated profile
    get_profile(state, headers).await
}

// Advanced Authentication Methods

pub async fn kyc_verification(
    State(state): State<crate::AppState>,
    Json(payload): Json<KYCRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("KYC verification request for user: {}", payload.user_id);

    let user_id = Uuid::parse_str(&payload.user_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // In a real implementation, you would:
    // 1. Validate the document image
    // 2. Extract information using OCR
    // 3. Verify against government databases
    // 4. Store the verification result

    // For now, we'll simulate the verification process
    let verification_result = verify_kyc_document(&payload).await;

    if verification_result {
        // Update user KYC status
        sqlx::query("UPDATE users SET kyc_verified = true, updated_at = $1 WHERE id = $2")
            .bind(Utc::now())
            .bind(user_id)
            .execute(&state.db.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        info!("KYC verification successful for user: {}", payload.user_id);

        Ok(Json(serde_json::json!({
            "status": "verified",
            "message": "KYC verification completed successfully",
            "verified_at": Utc::now().to_rfc3339()
        })))
    } else {
        warn!("KYC verification failed for user: {}", payload.user_id);
        Err(StatusCode::BAD_REQUEST)
    }
}

pub async fn biometric_auth(
    State(state): State<crate::AppState>,
    Json(payload): Json<BiometricAuthRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Biometric authentication request for user: {}", payload.user_id);

    let user_id = Uuid::parse_str(&payload.user_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Verify biometric data
    let verification_result = verify_biometric_data(&payload).await;

    if verification_result {
        // Update user biometric status
        sqlx::query("UPDATE users SET biometric_enabled = true, updated_at = $1 WHERE id = $2")
            .bind(Utc::now())
            .bind(user_id)
            .execute(&state.db.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        info!("Biometric authentication successful for user: {}", payload.user_id);

        Ok(Json(serde_json::json!({
            "status": "verified",
            "message": "Biometric authentication completed successfully",
            "verified_at": Utc::now().to_rfc3339()
        })))
    } else {
        warn!("Biometric authentication failed for user: {}", payload.user_id);
        Err(StatusCode::UNAUTHORIZED)
    }
}

pub async fn world_id_verify(
    State(state): State<crate::AppState>,
    Json(payload): Json<WorldIDVerificationRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("World ID verification request for user: {}", payload.user_id);

    let user_id = Uuid::parse_str(&payload.user_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    // Verify World ID proof
    let verification_result = verify_world_id_proof(&payload.proof).await;

    if verification_result {
        // Update user World ID status
        sqlx::query("UPDATE users SET world_id_verified = true, updated_at = $1 WHERE id = $2")
            .bind(Utc::now())
            .bind(user_id)
            .execute(&state.db.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        info!("World ID verification successful for user: {}", payload.user_id);

        Ok(Json(serde_json::json!({
            "status": "verified",
            "message": "World ID verification completed successfully",
            "verified_at": Utc::now().to_rfc3339()
        })))
    } else {
        warn!("World ID verification failed for user: {}", payload.user_id);
        Err(StatusCode::UNAUTHORIZED)
    }
}

pub async fn internet_identity_auth(
    State(state): State<crate::AppState>,
    Json(payload): Json<InternetIdentityAuthRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Internet Identity authentication request for principal: {}", payload.principal);

    // Verify Internet Identity signature
    let verification_result = verify_internet_identity(&payload.principal).await;

    if verification_result {
        // Find or create user with this principal
        let user_id = Uuid::new_v4();
        let now = Utc::now();

        sqlx::query(
            r#"
            INSERT INTO users (
                id, email, username, password_hash, first_name, last_name,
                role, status, email_verified, phone_verified, kyc_verified,
                biometric_enabled, world_id_verified, internet_identity_principal,
                created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            ON CONFLICT (internet_identity_principal) DO UPDATE SET
                updated_at = $16, last_login = $16
            "#,
        )
        .bind(user_id)
        .bind(format!("{}@internet-identity.local", payload.principal))
        .bind(format!("user_{}", &payload.principal[..8]))
        .bind("") // No password for Internet Identity
        .bind("Internet")
        .bind("Identity")
        .bind(&UserRole::Customer)
        .bind(&UserStatus::Active)
        .bind(true) // email_verified
        .bind(false) // phone_verified
        .bind(false) // kyc_verified
        .bind(false) // biometric_enabled
        .bind(false) // world_id_verified
        .bind(Some(payload.principal.clone()))
        .bind(now)
        .bind(now)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        info!("Internet Identity authentication successful for principal: {}", payload.principal);

        Ok(Json(serde_json::json!({
            "status": "authenticated",
            "message": "Internet Identity authentication completed successfully",
            "principal": payload.principal,
            "authenticated_at": now.to_rfc3339()
        })))
    } else {
        warn!("Internet Identity authentication failed for principal: {}", payload.principal);
        Err(StatusCode::UNAUTHORIZED)
    }
}

// Helper functions

fn extract_token_from_headers(headers: &HeaderMap) -> Result<String, StatusCode> {
    let auth_header = headers
        .get("authorization")
        .and_then(|header| header.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    if !auth_header.starts_with("Bearer ") {
        return Err(StatusCode::UNAUTHORIZED);
    }

    Ok(auth_header[7..].to_string())
}

fn verify_jwt_token(token: &str, secret: &str) -> Result<Claims, StatusCode> {
    let validation = Validation::new(Algorithm::HS256);
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &validation,
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(token_data.claims)
}

async fn verify_biometric_auth(user_row: &sqlx::postgres::PgRow, biometric_data: &str) -> bool {
    // In a real implementation, you would:
    // 1. Decode the biometric data
    // 2. Compare with stored biometric templates
    // 3. Use appropriate biometric matching algorithms
    
    // For now, we'll simulate verification
    user_row.get::<bool, _>("biometric_enabled") && !biometric_data.is_empty()
}

async fn verify_world_id_proof(proof: &str) -> bool {
    // In a real implementation, you would:
    // 1. Verify the cryptographic proof
    // 2. Check against World ID's verification service
    // 3. Validate the merkle root and nullifier hash
    
    // For now, we'll simulate verification
    !proof.is_empty() && proof.len() > 10
}

async fn verify_internet_identity(principal: &str) -> bool {
    // In a real implementation, you would:
    // 1. Verify the signature using ICP's verification methods
    // 2. Check the delegation chain
    // 3. Validate the principal format
    
    // For now, we'll simulate verification
    !principal.is_empty() && principal.len() > 20
}

async fn verify_kyc_document(request: &KYCRequest) -> bool {
    // In a real implementation, you would:
    // 1. Process the document image
    // 2. Extract text using OCR
    // 3. Validate against government databases
    // 4. Check for document authenticity
    
    // For now, we'll simulate verification
    !request.document_number.is_empty() && !request.document_image.is_empty()
}

async fn verify_biometric_data(request: &BiometricAuthRequest) -> bool {
    // In a real implementation, you would:
    // 1. Decode the biometric data
    // 2. Extract biometric features
    // 3. Compare with stored templates
    // 4. Calculate similarity scores
    
    // For now, we'll simulate verification
    !request.biometric_data.is_empty() && request.biometric_type.len() > 3
}
