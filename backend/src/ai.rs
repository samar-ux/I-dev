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
pub struct AIService {
    db: Database,
}

impl AIService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct ApplySuggestionRequest {
    pub suggestion_id: String,
    pub action: String,
    pub parameters: serde_json::Value,
}

#[derive(Debug, Serialize)]
pub struct SuggestionResponse {
    pub id: String,
    pub suggestion_type: String,
    pub title: String,
    pub description: String,
    pub priority: String,
    pub impact: String,
    pub estimated_savings: f64,
    pub confidence: f64,
    pub category: String,
    pub details: serde_json::Value,
    pub status: String,
    pub applied_at: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct PredictionResponse {
    pub id: String,
    pub prediction_type: String,
    pub title: String,
    pub accuracy: f64,
    pub predictions: Vec<serde_json::Value>,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct RiskAssessmentResponse {
    pub id: String,
    pub risk_type: String,
    pub title: String,
    pub risk_level: String,
    pub score: f64,
    pub factors: Vec<RiskFactor>,
    pub recommendations: Vec<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct RiskFactor {
    pub factor: String,
    pub impact: String,
    pub probability: f64,
}

#[derive(Debug, Serialize)]
pub struct InsightResponse {
    pub id: String,
    pub insight_type: String,
    pub title: String,
    pub insight: String,
    pub confidence: f64,
    pub data: serde_json::Value,
    pub recommendation: String,
    pub created_at: String,
}

pub async fn get_suggestions(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<SuggestionResponse>>, StatusCode> {
    info!("Fetching AI suggestions");

    let user_id = params.get("user_id").and_then(|v| v.as_str());
    let shipment_id = params.get("shipment_id").and_then(|v| v.as_str());
    let status = params.get("status").and_then(|v| v.as_str());
    let limit = params.get("limit").and_then(|v| v.as_u64()).unwrap_or(20);

    let mut query = "SELECT * FROM ai_suggestions WHERE 1=1".to_string();
    let mut bind_values: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> = Vec::new();
    let mut param_count = 1;

    if let Some(uid) = user_id {
        query.push_str(&format!(" AND user_id = ${}", param_count));
        bind_values.push(Box::new(Uuid::parse_str(uid).map_err(|_| StatusCode::BAD_REQUEST)?));
        param_count += 1;
    }

    if let Some(sid) = shipment_id {
        query.push_str(&format!(" AND shipment_id = ${}", param_count));
        bind_values.push(Box::new(Uuid::parse_str(sid).map_err(|_| StatusCode::BAD_REQUEST)?));
        param_count += 1;
    }

    if let Some(st) = status {
        query.push_str(&format!(" AND status = ${}", param_count));
        bind_values.push(Box::new(st.to_string()));
        param_count += 1;
    }

    query.push_str(&format!(" ORDER BY priority DESC, confidence DESC LIMIT ${}", param_count));
    bind_values.push(Box::new(limit as i64));

    let rows = sqlx::query(&query)
        .fetch_all(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let suggestions = rows
        .into_iter()
        .map(|row| SuggestionResponse {
            id: row.get::<Uuid, _>("id").to_string(),
            suggestion_type: format!("{:?}", row.get::<SuggestionType, _>("suggestion_type")).to_lowercase(),
            title: row.get::<String, _>("title"),
            description: row.get::<String, _>("description"),
            priority: format!("{:?}", row.get::<SuggestionPriority, _>("priority")).to_lowercase(),
            impact: format!("{:?}", row.get::<SuggestionImpact, _>("impact")).to_lowercase(),
            estimated_savings: row.get::<f64, _>("estimated_savings"),
            confidence: row.get::<f64, _>("confidence"),
            category: row.get::<String, _>("category"),
            details: row.get::<serde_json::Value, _>("details"),
            status: format!("{:?}", row.get::<SuggestionStatus, _>("status")).to_lowercase(),
            applied_at: row.get::<Option<chrono::DateTime<Utc>>, _>("applied_at")
                .map(|dt| dt.to_rfc3339()),
            created_at: row.get::<chrono::DateTime<Utc>, _>("created_at").to_rfc3339(),
        })
        .collect();

    Ok(Json(suggestions))
}

pub async fn get_predictions(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<PredictionResponse>>, StatusCode> {
    info!("Fetching AI predictions");

    // In a real implementation, this would fetch predictions from the AI service
    // For now, we'll return mock data

    let predictions = vec![
        PredictionResponse {
            id: Uuid::new_v4().to_string(),
            prediction_type: "delivery_time".to_string(),
            title: "توقع أوقات التسليم".to_string(),
            accuracy: 94.0,
            predictions: vec![
                serde_json::json!({
                    "route": "الرياض → الدمام",
                    "predicted_time": "4.2 ساعة",
                    "confidence": 96
                }),
                serde_json::json!({
                    "route": "جدة → مكة",
                    "predicted_time": "1.8 ساعة",
                    "confidence": 92
                }),
                serde_json::json!({
                    "route": "الدمام → الخبر",
                    "predicted_time": "0.5 ساعة",
                    "confidence": 98
                })
            ],
            created_at: Utc::now().to_rfc3339(),
        },
        PredictionResponse {
            id: Uuid::new_v4().to_string(),
            prediction_type: "demand_pattern".to_string(),
            title: "أنماط الطلب".to_string(),
            accuracy: 89.0,
            predictions: vec![
                serde_json::json!({
                    "period": "صباح اليوم",
                    "demand": "مرتفع",
                    "confidence": 91
                }),
                serde_json::json!({
                    "period": "بعد الظهر",
                    "demand": "متوسط",
                    "confidence": 87
                }),
                serde_json::json!({
                    "period": "المساء",
                    "demand": "منخفض",
                    "confidence": 93
                })
            ],
            created_at: Utc::now().to_rfc3339(),
        }
    ];

    Ok(Json(predictions))
}

pub async fn get_risk_assessment(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<RiskAssessmentResponse>>, StatusCode> {
    info!("Fetching risk assessments");

    // In a real implementation, this would fetch risk assessments from the AI service
    // For now, we'll return mock data

    let assessments = vec![
        RiskAssessmentResponse {
            id: Uuid::new_v4().to_string(),
            risk_type: "delivery_risk".to_string(),
            title: "مخاطر التسليم".to_string(),
            risk_level: "medium".to_string(),
            score: 65.0,
            factors: vec![
                RiskFactor {
                    factor: "الطقس".to_string(),
                    impact: "منخفض".to_string(),
                    probability: 30.0,
                },
                RiskFactor {
                    factor: "الازدحام المروري".to_string(),
                    impact: "متوسط".to_string(),
                    probability: 60.0,
                },
                RiskFactor {
                    factor: "حالة الطريق".to_string(),
                    impact: "منخفض".to_string(),
                    probability: 25.0,
                }
            ],
            recommendations: vec![
                "استخدام طرق بديلة".to_string(),
                "تحديث العملاء بالتأخير المحتمل".to_string(),
                "زيادة وقت التسليم المتوقع".to_string()
            ],
            created_at: Utc::now().to_rfc3339(),
        },
        RiskAssessmentResponse {
            id: Uuid::new_v4().to_string(),
            risk_type: "payment_risk".to_string(),
            title: "مخاطر الدفع".to_string(),
            risk_level: "low".to_string(),
            score: 25.0,
            factors: vec![
                RiskFactor {
                    factor: "صحة العملة الرقمية".to_string(),
                    impact: "منخفض".to_string(),
                    probability: 15.0,
                },
                RiskFactor {
                    factor: "استقرار الشبكة".to_string(),
                    impact: "منخفض".to_string(),
                    probability: 20.0,
                },
                RiskFactor {
                    factor: "أمان المعاملة".to_string(),
                    impact: "منخفض".to_string(),
                    probability: 10.0,
                }
            ],
            recommendations: vec![
                "استخدام شبكات متعددة".to_string(),
                "تشفير إضافي للمعاملات".to_string(),
                "مراقبة مستمرة للأمان".to_string()
            ],
            created_at: Utc::now().to_rfc3339(),
        }
    ];

    Ok(Json(assessments))
}

pub async fn get_insights(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<Vec<InsightResponse>>, StatusCode> {
    info!("Fetching AI insights");

    // In a real implementation, this would fetch insights from the AI service
    // For now, we'll return mock data

    let insights = vec![
        InsightResponse {
            id: Uuid::new_v4().to_string(),
            insight_type: "customer_behavior".to_string(),
            title: "تحليل سلوك العملاء".to_string(),
            insight: "العملاء يفضلون التسليم في الصباح الباكر".to_string(),
            confidence: 91.0,
            data: serde_json::json!({
                "morningDelivery": "68%",
                "afternoonDelivery": "22%",
                "eveningDelivery": "10%"
            }),
            recommendation: "زيادة ساعات التسليم الصباحية".to_string(),
            created_at: Utc::now().to_rfc3339(),
        },
        InsightResponse {
            id: Uuid::new_v4().to_string(),
            insight_type: "seasonal_patterns".to_string(),
            title: "الأنماط الموسمية".to_string(),
            insight: "زيادة الطلب بنسبة 40% خلال شهر رمضان".to_string(),
            confidence: 88.0,
            data: serde_json::json!({
                "ramadanIncrease": "40%",
                "eidIncrease": "60%",
                "normalPeriod": "100%"
            }),
            recommendation: "زيادة المخزون قبل المواسم الدينية".to_string(),
            created_at: Utc::now().to_rfc3339(),
        },
        InsightResponse {
            id: Uuid::new_v4().to_string(),
            insight_type: "geographic_analysis".to_string(),
            title: "التحليل الجغرافي".to_string(),
            insight: "المنطقة الشرقية تحتاج إلى مستودع إضافي".to_string(),
            confidence: 85.0,
            data: serde_json::json!({
                "easternRegion": "35% من الطلب",
                "currentCapacity": "60%",
                "neededCapacity": "85%"
            }),
            recommendation: "إنشاء مستودع في المنطقة الشرقية".to_string(),
            created_at: Utc::now().to_rfc3339(),
        }
    ];

    Ok(Json(insights))
}

pub async fn apply_suggestion(
    State(state): State<crate::AppState>,
    Json(payload): Json<ApplySuggestionRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Applying suggestion: {}", payload.suggestion_id);

    let suggestion_id = Uuid::parse_str(&payload.suggestion_id)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    // Verify suggestion exists and is pending
    let suggestion_row = sqlx::query("SELECT * FROM ai_suggestions WHERE id = $1 AND status = 'pending'")
        .bind(suggestion_id)
        .fetch_optional(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let suggestion_row = match suggestion_row {
        Some(row) => row,
        None => return Err(StatusCode::NOT_FOUND),
    };

    // Apply the suggestion based on type
    let application_result = apply_suggestion_logic(
        &suggestion_row,
        &payload.action,
        &payload.parameters,
        &state.db
    ).await;

    if application_result.is_err() {
        error!("Failed to apply suggestion: {}", payload.suggestion_id);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    // Update suggestion status
    sqlx::query("UPDATE ai_suggestions SET status = 'applied', applied_at = $1 WHERE id = $2")
        .bind(Utc::now())
        .bind(suggestion_id)
        .execute(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    info!("Suggestion applied successfully: {}", payload.suggestion_id);

    Ok(Json(serde_json::json!({
        "status": "applied",
        "message": "Suggestion applied successfully",
        "applied_at": Utc::now().to_rfc3339()
    })))
}

// Helper functions

async fn apply_suggestion_logic(
    suggestion_row: &sqlx::postgres::PgRow,
    action: &str,
    parameters: &serde_json::Value,
    db: &Database,
) -> Result<()> {
    let suggestion_type: SuggestionType = suggestion_row.get("suggestion_type");
    
    match suggestion_type {
        SuggestionType::RouteOptimization => {
            apply_route_optimization(parameters, db).await
        },
        SuggestionType::DemandForecast => {
            apply_demand_forecast(parameters, db).await
        },
        SuggestionType::CustomerRetention => {
            apply_customer_retention(parameters, db).await
        },
        SuggestionType::InventoryOptimization => {
            apply_inventory_optimization(parameters, db).await
        },
        SuggestionType::CostReduction => {
            apply_cost_reduction(parameters, db).await
        },
        SuggestionType::TimeOptimization => {
            apply_time_optimization(parameters, db).await
        }
    }
}

async fn apply_route_optimization(
    parameters: &serde_json::Value,
    db: &Database,
) -> Result<()> {
    // In a real implementation, this would:
    // 1. Update shipment routes
    // 2. Notify drivers of new routes
    // 3. Update estimated delivery times
    
    info!("Applying route optimization with parameters: {:?}", parameters);
    Ok(())
}

async fn apply_demand_forecast(
    parameters: &serde_json::Value,
    db: &Database,
) -> Result<()> {
    // In a real implementation, this would:
    // 1. Update inventory levels
    // 2. Adjust staffing schedules
    // 3. Update pricing strategies
    
    info!("Applying demand forecast with parameters: {:?}", parameters);
    Ok(())
}

async fn apply_customer_retention(
    parameters: &serde_json::Value,
    db: &Database,
) -> Result<()> {
    // In a real implementation, this would:
    // 1. Update customer communication preferences
    // 2. Adjust service levels
    // 3. Implement retention campaigns
    
    info!("Applying customer retention with parameters: {:?}", parameters);
    Ok(())
}

async fn apply_inventory_optimization(
    parameters: &serde_json::Value,
    db: &Database,
) -> Result<()> {
    // In a real implementation, this would:
    // 1. Update warehouse inventory levels
    // 2. Adjust reorder points
    // 3. Optimize storage locations
    
    info!("Applying inventory optimization with parameters: {:?}", parameters);
    Ok(())
}

async fn apply_cost_reduction(
    parameters: &serde_json::Value,
    db: &Database,
) -> Result<()> {
    // In a real implementation, this would:
    // 1. Optimize fuel consumption
    // 2. Reduce operational costs
    // 3. Implement cost-saving measures
    
    info!("Applying cost reduction with parameters: {:?}", parameters);
    Ok(())
}

async fn apply_time_optimization(
    parameters: &serde_json::Value,
    db: &Database,
) -> Result<()> {
    // In a real implementation, this would:
    // 1. Optimize delivery schedules
    // 2. Reduce transit times
    // 3. Improve operational efficiency
    
    info!("Applying time optimization with parameters: {:?}", parameters);
    Ok(())
}
