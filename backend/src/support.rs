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
pub struct SupportService {
    db: Database,
}

impl SupportService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateTicketRequest {
    pub title: String,
    pub description: String,
    pub category: String,
    pub priority: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTicketRequest {
    pub status: Option<String>,
    pub priority: Option<String>,
    pub agent_id: Option<String>,
    pub rating: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct StartChatRequest {
    pub user_id: String,
    pub initial_message: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct SendMessageRequest {
    pub message: String,
    pub message_type: Option<String>,
    pub attachments: Option<serde_json::Value>,
}

#[derive(Debug, Deserialize)]
pub struct StartVideoCallRequest {
    pub user_id: String,
    pub agent_id: String,
    pub call_type: String, // audio, video, screen_share
}

#[derive(Debug, Serialize)]
pub struct TicketResponse {
    pub id: String,
    pub user_id: String,
    pub agent_id: Option<String>,
    pub title: String,
    pub description: String,
    pub status: String,
    pub priority: String,
    pub category: String,
    pub rating: Option<i32>,
    pub created_at: String,
    pub updated_at: String,
    pub resolved_at: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ChatSessionResponse {
    pub id: String,
    pub user_id: String,
    pub agent_id: Option<String>,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct MessageResponse {
    pub id: String,
    pub sender_id: String,
    pub sender_type: String,
    pub message: String,
    pub message_type: String,
    pub attachments: serde_json::Value,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct VideoCallResponse {
    pub id: String,
    pub user_id: String,
    pub agent_id: String,
    pub call_type: String,
    pub status: String,
    pub room_url: String,
    pub created_at: String,
}

pub async fn get_tickets(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<TicketResponse>>, StatusCode> {
    info!("Fetching support tickets");

    let user_id = params.get("user_id").and_then(|v| v.as_str());
    let agent_id = params.get("agent_id").and_then(|v| v.as_str());
    let status = params.get("status").and_then(|v| v.as_str());
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(50);

    let mut query = "SELECT * FROM support_tickets WHERE 1=1".to_string();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(uid) = user_id {
        query.push_str(&format!(" AND user_id = ${}", param_count));
        bind_values.push(Box::new(Uuid::parse_str(uid).map_err(|_| StatusCode::BAD_REQUEST)?));
        param_count += 1;
    }

    if let Some(aid) = agent_id {
        query.push_str(&format!(" AND agent_id = ${}", param_count));
        bind_values.push(Box::new(Uuid::parse_str(aid).map_err(|_| StatusCode::BAD_REQUEST)?));
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

    let tickets = rows
        .into_iter()
        .map(|row| TicketResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            user_id: row.get::<Uuid, _>("user_id").to_string(),
            agent_id: row.get::<Option<Uuid>, _>("agent_id").map(|id| id.to_string()),
            title: row.get::<String, _>("title"),
            description: row.get::<String, _>("description"),
            status: format!("{:?}", row.get::<TicketStatus, _>("status")).to_lowercase(),
            priority: format!("{:?}", row.get::<TicketPriority, _>("priority")).to_lowercase(),
            category: format!("{:?}", row.get::<TicketCategory, _>("category")).to_lowercase(),
            rating: row.get::<Option<i32>, _>("rating"),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
            updated_at: row.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
            resolved_at: row.get::<Option<chrono::DateTime<Utc>>, _>("resolved_at")
                .map(|dt| dt.to_rfc3339()),
        })
        .collect();

    Ok(Json(tickets))
}

pub async fn create_ticket(
    State(state): State<crate::AppState>,
    Json(payload): Json<CreateTicketRequest>,
) -> Result<Json<TicketResponse>, StatusCode> {
    info!("Creating support ticket: {}", payload.title);

    // Parse category and priority
    let category = match payload.category.as_str() {
        "tracking" => TicketCategory::Tracking,
        "payment" => TicketCategory::Payment,
        "insurance" => TicketCategory::Insurance,
        "technical" => TicketCategory::Technical,
        "general" => TicketCategory::General,
        _ => return Err(StatusCode::BAD_REQUEST),
    };

    let priority = match payload.priority.as_str() {
        "low" => TicketPriority::Low,
        "medium" => TicketPriority::Medium,
        "high" => TicketPriority::High,
        "urgent" => TicketPriority::Urgent,
        _ => return Err(StatusCode::BAD_REQUEST),
    };

    let ticket_id = Uuid::new_v4();
    let now = Utc::now();

    // For demo purposes, we'll use a hardcoded user_id
    // In a real implementation, this would come from the authenticated user
    let user_id = Uuid::new_v4();

    sqlx::query(
        r#"
        INSERT INTO support_tickets (
            id, user_id, title, description, status, priority, category, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#,
    )
    .bind(ticket_id)
    .bind(user_id)
    .bind(&payload.title)
    .bind(&payload.description)
    .bind(&TicketStatus::Open)
    .bind(&priority)
    .bind(&category)
    .bind(now)
    .bind(now)
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error creating ticket: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = TicketResponse {
        id: ticket_id.to_string(),
        user_id: user_id.to_string(),
        agent_id: None,
        title: payload.title,
        description: payload.description,
        status: "open".to_string(),
        priority: payload.priority,
        category: payload.category,
        rating: None,
        created_at: now.to_rfc3339(),
        updated_at: now.to_rfc3339(),
        resolved_at: None,
    };

    info!("Support ticket created successfully: {}", ticket_id);

    Ok(Json(response))
}

pub async fn get_ticket(
    State(state): State<crate::AppState>,
    Path(ticket_id): Path<String>,
) -> Result<Json<TicketResponse>, StatusCode> {
    info!("Fetching ticket: {}", ticket_id);

    let id = Uuid::parse_str(&ticket_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    let row = sqlx::query("SELECT * FROM support_tickets WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let row = match row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    let response = TicketResponse {
        id: ticket_id,
        user_id: row.get::<Uuid, _>("user_id").to_string(),
        agent_id: row.get::<Option<Uuid>, _>("agent_id").map(|id| id.to_string()),
        title: row.get::<String, _>("title"),
        description: row.get::<String, _>("description"),
        status: format!("{:?}", row.get::<TicketStatus, _>("status")).to_lowercase(),
        priority: format!("{:?}", row.get::<TicketPriority, _>("priority")).to_lowercase(),
        category: format!("{:?}", row.get::<TicketCategory, _>("category")).to_lowercase(),
        rating: row.get::<Option<i32>, _>("rating"),
        created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        updated_at: row.get::<chrono::DateTime<Utc>, _>("updated_at").to_rfc3339(),
        resolved_at: row.get::<Option<chrono::DateTime<Utc>>, _>("resolved_at")
            .map(|dt| dt.to_rfc3339()),
    };

    Ok(Json(response))
}

pub async fn update_ticket(
    State(state): State<crate::AppState>,
    Path(ticket_id): Path<String>,
    Json(payload): Json<UpdateTicketRequest>,
) -> Result<Json<TicketResponse>, StatusCode> {
    info!("Updating ticket: {}", ticket_id);

    let id = Uuid::parse_str(&ticket_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    let mut update_fields = Vec::new();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(status) = payload.status {
        let parsed_status = match status.as_str() {
            "open" => TicketStatus::Open,
            "in_progress" => TicketStatus::InProgress,
            "resolved" => TicketStatus::Resolved,
            "closed" => TicketStatus::Closed,
            _ => return Err(StatusCode::BAD_REQUEST),
        };
        update_fields.push(format!("status = ${}", param_count));
        bind_values.push(Box::new(parsed_status));
        param_count += 1;
    }

    if let Some(priority) = payload.priority {
        let parsed_priority = match priority.as_str() {
            "low" => TicketPriority::Low,
            "medium" => TicketPriority::Medium,
            "high" => TicketPriority::High,
            "urgent" => TicketPriority::Urgent,
            _ => return Err(StatusCode::BAD_REQUEST),
        };
        update_fields.push(format!("priority = ${}", param_count));
        bind_values.push(Box::new(parsed_priority));
        param_count += 1;
    }

    if let Some(agent_id) = payload.agent_id {
        update_fields.push(format!("agent_id = ${}", param_count));
        bind_values.push(Box::new(Uuid::parse_str(&agent_id).map_err(|_| StatusCode::BAD_REQUEST)?));
        param_count += 1;
    }

    if let Some(rating) = payload.rating {
        update_fields.push(format!("rating = ${}", param_count));
        bind_values.push(Box::new(rating));
        param_count += 1;
    }

    if update_fields.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    update_fields.push(format!("updated_at = ${}", param_count));
    bind_values.push(Box::new(Utc::now()));
    param_count += 1;

    let query = format!(
        "UPDATE support_tickets SET {} WHERE id = ${}",
        update_fields.join(", "),
        param_count
    );

    let mut query_builder = sqlx::query(&query);
    for value in bind_values {
        // This is a simplified approach - in practice you'd need proper type handling
    }
    query_builder = query_builder.bind(id);

    query_builder
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Return updated ticket
    get_ticket(state, Path(ticket_id)).await
}

pub async fn start_chat(
    State(state): State<crate::AppState>,
    Json(payload): Json<StartChatRequest>,
) -> Result<Json<ChatSessionResponse>, StatusCode> {
    info!("Starting chat session for user: {}", payload.user_id);

    let user_id = Uuid::parse_str(&payload.user_id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let session_id = Uuid::new_v4();
    let now = Utc::now();

    // Create chat session
    // In a real implementation, you would create a chat session record
    // For now, we'll simulate it

    let response = ChatSessionResponse {
        id: session_id.to_string(),
        user_id: payload.user_id,
        agent_id: None,
        status: "active".to_string(),
        created_at: now.to_rfc3339(),
    };

    // Send initial message if provided
    if let Some(initial_message) = payload.initial_message {
        let message_id = Uuid::new_v4();
        sqlx::query(
            r#"
            INSERT INTO chat_messages (
                id, chat_session_id, sender_id, sender_type, message, message_type, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            "#,
        )
        .bind(message_id)
        .bind(session_id)
        .bind(user_id)
        .bind(&SenderType::Customer)
        .bind(&initial_message)
        .bind(&MessageType::Text)
        .bind(now)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }

    info!("Chat session started: {}", session_id);

    Ok(Json(response))
}

pub async fn get_messages(
    State(state): State<crate::AppState>,
    Path(session_id): Path<String>,
) -> Result<Json<Vec<MessageResponse>>, StatusCode> {
    info!("Fetching messages for session: {}", session_id);

    let id = Uuid::parse_str(&session_id).map_err(|_| StatusCode::BAD_REQUEST)?;

    let rows = sqlx::query(
        "SELECT * FROM chat_messages WHERE chat_session_id = $1 ORDER BY created_at ASC"
    )
    .bind(id)
    .fetch_all(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let messages = rows
        .into_iter()
        .map(|row| MessageResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            sender_id: row.get::<Uuid, _>("sender_id").to_string(),
            sender_type: format!("{:?}", row.get::<SenderType, _>("sender_type")).to_lowercase(),
            message: row.get::<String, _>("message"),
            message_type: format!("{:?}", row.get::<MessageType, _>("message_type")).to_lowercase(),
            attachments: row.get::<serde_json::Value, _>("attachments"),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        })
        .collect();

    Ok(Json(messages))
}

pub async fn send_message(
    State(state): State<crate::AppState>,
    Path(session_id): Path<String>,
    Json(payload): Json<SendMessageRequest>,
) -> Result<Json<MessageResponse>, StatusCode> {
    info!("Sending message to session: {}", session_id);

    let id = Uuid::parse_str(&session_id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let message_id = Uuid::new_v4();
    let now = Utc::now();

    // For demo purposes, we'll use a hardcoded sender_id
    // In a real implementation, this would come from the authenticated user
    let sender_id = Uuid::new_v4();

    let message_type = match payload.message_type.as_deref().unwrap_or("text") {
        "text" => MessageType::Text,
        "image" => MessageType::Image,
        "file" => MessageType::File,
        "video" => MessageType::Video,
        "audio" => MessageType::Audio,
        "location" => MessageType::Location,
        _ => MessageType::Text,
    };

    sqlx::query(
        r#"
        INSERT INTO chat_messages (
            id, chat_session_id, sender_id, sender_type, message, message_type, attachments, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        "#,
    )
    .bind(message_id)
    .bind(id)
    .bind(sender_id)
    .bind(&SenderType::Customer)
    .bind(&payload.message)
    .bind(&message_type)
    .bind(&payload.attachments.unwrap_or(serde_json::json!([])))
    .bind(now)
    .execute(&state.db.pool)
    .await
    .map_err(|e| {
        error!("Database error sending message: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = MessageResponse {
        id: message_id.to_string(),
        sender_id: sender_id.to_string(),
        sender_type: "customer".to_string(),
        message: payload.message,
        message_type: format!("{:?}", message_type).to_lowercase(),
        attachments: payload.attachments.unwrap_or(serde_json::json!([])),
        created_at: now.to_rfc3339(),
    };

    info!("Message sent successfully: {}", message_id);

    Ok(Json(response))
}

pub async fn start_video_call(
    State(state): State<crate::AppState>,
    Json(payload): Json<StartVideoCallRequest>,
) -> Result<Json<VideoCallResponse>, StatusCode> {
    info!("Starting video call between user: {} and agent: {}", payload.user_id, payload.agent_id);

    let user_id = Uuid::parse_str(&payload.user_id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let agent_id = Uuid::parse_str(&payload.agent_id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let call_id = Uuid::new_v4();
    let now = Utc::now();

    // In a real implementation, this would:
    // 1. Create a video call room using a service like Twilio or Agora
    // 2. Generate room URLs and access tokens
    // 3. Store call information in the database

    let room_url = format!("https://video-call.web3shipping.com/room/{}", call_id);

    let response = VideoCallResponse {
        id: call_id.to_string(),
        user_id: payload.user_id,
        agent_id: payload.agent_id,
        call_type: payload.call_type,
        status: "active".to_string(),
        room_url,
        created_at: now.to_rfc3339(),
    };

    info!("Video call started: {}", call_id);

    Ok(Json(response))
}

pub async fn get_knowledge_base(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Fetching knowledge base");

    let search_query = params.get("q").and_then(|v| v.as_str());

    // In a real implementation, this would search through a knowledge base
    // For now, we'll return mock data

    let knowledge_base = serde_json::json!({
        "articles": [
            {
                "id": "1",
                "title": "كيفية تتبع الشحنة",
                "description": "دليل شامل لتتبع الشحنات والاستعلام عن حالة التسليم",
                "category": "tracking",
                "content": "يمكنك تتبع شحنتك باستخدام رقم التتبع...",
                "tags": ["تتبع", "شحنة", "تسليم"]
            },
            {
                "id": "2",
                "title": "نظام الدفع",
                "description": "شرح طرق الدفع المتاحة والعملات الرقمية المدعومة",
                "category": "payment",
                "content": "نحن ندعم عدة طرق دفع...",
                "tags": ["دفع", "عملة رقمية", "بتكوين"]
            },
            {
                "id": "3",
                "title": "التأمين على الشحنات",
                "description": "معلومات عن بوليصة التأمين والتغطية المتاحة",
                "category": "insurance",
                "content": "جميع الشحنات مؤمنة تلقائياً...",
                "tags": ["تأمين", "بوليصة", "تغطية"]
            },
            {
                "id": "4",
                "title": "حل المشاكل الشائعة",
                "description": "حلول للمشاكل الأكثر شيوعاً في النظام",
                "category": "technical",
                "content": "إذا واجهت مشكلة في النظام...",
                "tags": ["مشكلة", "حل", "مساعدة"]
            }
        ],
        "categories": [
            {
                "id": "tracking",
                "name": "تتبع الشحنات",
                "count": 15
            },
            {
                "id": "payment",
                "name": "الدفع والفوترة",
                "count": 8
            },
            {
                "id": "insurance",
                "name": "التأمين",
                "count": 5
            },
            {
                "id": "technical",
                "name": "المساعدة التقنية",
                "count": 12
            }
        ]
    });

    Ok(Json(knowledge_base))
}
