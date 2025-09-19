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
pub struct AnalyticsService {
    db: Database,
}

impl AnalyticsService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Serialize)]
pub struct KPIsResponse {
    pub total_revenue: f64,
    pub revenue_growth: f64,
    pub total_customers: i64,
    pub customer_growth: f64,
    pub total_shipments: i64,
    pub shipment_growth: f64,
    pub conversion_rate: f64,
    pub conversion_growth: f64,
    pub average_delivery_time: f64,
    pub customer_satisfaction: f64,
}

#[derive(Debug, Serialize)]
pub struct RevenueAnalyticsResponse {
    pub period: String,
    pub revenue_data: Vec<RevenueData>,
    pub growth_rate: f64,
    pub total_revenue: f64,
}

#[derive(Debug, Serialize)]
pub struct RevenueData {
    pub date: String,
    pub revenue: f64,
    pub shipments: i64,
    pub customers: i64,
}

#[derive(Debug, Serialize)]
pub struct CustomerAnalyticsResponse {
    pub total_customers: i64,
    pub new_customers: i64,
    pub returning_customers: i64,
    pub customer_segments: Vec<CustomerSegment>,
    pub satisfaction_score: f64,
}

#[derive(Debug, Serialize)]
pub struct CustomerSegment {
    pub segment: String,
    pub count: i64,
    pub percentage: f64,
    pub average_value: f64,
}

#[derive(Debug, Serialize)]
pub struct ProductAnalyticsResponse {
    pub total_products: i64,
    pub top_products: Vec<ProductData>,
    pub category_breakdown: Vec<CategoryData>,
    pub inventory_status: InventoryStatus,
}

#[derive(Debug, Serialize)]
pub struct ProductData {
    pub product_id: String,
    pub name: String,
    pub shipments: i64,
    pub revenue: f64,
    pub rating: f64,
}

#[derive(Debug, Serialize)]
pub struct CategoryData {
    pub category: String,
    pub count: i64,
    pub revenue: f64,
    pub percentage: f64,
}

#[derive(Debug, Serialize)]
pub struct InventoryStatus {
    pub total_items: i64,
    pub low_stock: i64,
    pub out_of_stock: i64,
    pub overstock: i64,
}

#[derive(Debug, Serialize)]
pub struct CampaignAnalyticsResponse {
    pub total_campaigns: i64,
    pub active_campaigns: i64,
    pub campaign_performance: Vec<CampaignData>,
    pub roi_summary: ROISummary,
}

#[derive(Debug, Serialize)]
pub struct CampaignData {
    pub campaign_id: String,
    pub name: String,
    pub status: String,
    pub budget: f64,
    pub spent: f64,
    pub conversions: i64,
    pub roi: f64,
    pub ctr: f64,
}

#[derive(Debug, Serialize)]
pub struct ROISummary {
    pub total_investment: f64,
    pub total_return: f64,
    pub average_roi: f64,
    pub best_performing_campaign: String,
}

pub async fn get_kpis(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<KPIsResponse>, StatusCode> {
    info!("Fetching KPIs");

    let period = params.get("period").and_then(|v| v.as_str()).unwrap_or("30d");

    // Get total revenue
    let total_revenue_row = sqlx::query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'")
        .fetch_one(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let total_revenue: f64 = total_revenue_row.get("total");

    // Get revenue growth
    let previous_period_revenue_row = sqlx::query(
        "SELECT COALESCE(SUM(amount), 0) as total FROM payments 
         WHERE status = 'completed' AND created_at < NOW() - INTERVAL '60 days'"
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let previous_period_revenue: f64 = previous_period_revenue_row.get("total");
    let revenue_growth = if previous_period_revenue > 0.0 {
        ((total_revenue - previous_period_revenue) / previous_period_revenue) * 100.0
    } else {
        0.0
    };

    // Get total customers
    let total_customers_row = sqlx::query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'")
        .fetch_one(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let total_customers: i64 = total_customers_row.get("count");

    // Get customer growth
    let previous_customers_row = sqlx::query(
        "SELECT COUNT(*) as count FROM users 
         WHERE role = 'customer' AND created_at < NOW() - INTERVAL '30 days'"
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let previous_customers: i64 = previous_customers_row.get("count");
    let customer_growth = if previous_customers > 0 {
        ((total_customers - previous_customers) as f64 / previous_customers as f64) * 100.0
    } else {
        0.0
    };

    // Get total shipments
    let total_shipments_row = sqlx::query("SELECT COUNT(*) as count FROM shipments")
        .fetch_one(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let total_shipments: i64 = total_shipments_row.get("count");

    // Get shipment growth
    let previous_shipments_row = sqlx::query(
        "SELECT COUNT(*) as count FROM shipments 
         WHERE created_at < NOW() - INTERVAL '30 days'"
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let previous_shipments: i64 = previous_shipments_row.get("count");
    let shipment_growth = if previous_shipments > 0 {
        ((total_shipments - previous_shipments) as f64 / previous_shipments as f64) * 100.0
    } else {
        0.0
    };

    // Get conversion rate
    let conversions_row = sqlx::query(
        "SELECT COUNT(*) as count FROM shipments WHERE status = 'delivered'"
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let conversions: i64 = conversions_row.get("count");
    let conversion_rate = if total_shipments > 0 {
        (conversions as f64 / total_shipments as f64) * 100.0
    } else {
        0.0
    };

    // Get average delivery time
    let avg_delivery_row = sqlx::query(
        "SELECT AVG(EXTRACT(EPOCH FROM (actual_delivery - created_at))/3600) as avg_hours 
         FROM shipments WHERE actual_delivery IS NOT NULL"
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let average_delivery_time: f64 = avg_delivery_row.get("avg_hours").unwrap_or(0.0);

    // Get customer satisfaction
    let satisfaction_row = sqlx::query(
        "SELECT AVG(rating) as avg_rating FROM ratings"
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let customer_satisfaction: f64 = satisfaction_row.get("avg_rating").unwrap_or(0.0);

    let response = KPIsResponse {
        total_revenue,
        revenue_growth,
        total_customers,
        customer_growth,
        total_shipments,
        shipment_growth,
        conversion_rate,
        conversion_growth: 0.0, // Would need historical data
        average_delivery_time,
        customer_satisfaction,
    };

    Ok(Json(response))
}

pub async fn get_revenue_analytics(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<RevenueAnalyticsResponse>, StatusCode> {
    info!("Fetching revenue analytics");

    let period = params.get("period").and_then(|v| v.as_str()).unwrap_or("30d");
    let start_date = params.get("start_date").and_then(|v| v.as_str());
    let end_date = params.get("end_date").and_then(|v| v.as_str());

    // Get revenue data by period
    let revenue_data_rows = sqlx::query(
        r#"
        SELECT 
            DATE(created_at) as date,
            SUM(amount) as revenue,
            COUNT(DISTINCT shipment_id) as shipments,
            COUNT(DISTINCT user_id) as customers
        FROM payments 
        WHERE status = 'completed'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
        "#
    )
    .fetch_all(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let revenue_data = revenue_data_rows
        .into_iter()
        .map(|row| RevenueData {
            date: row.get::<chrono::NaiveDate, _>("date").to_string(),
            revenue: row.get::<f64, _>("revenue"),
            shipments: row.get::<i64, _>("shipments"),
            customers: row.get::<i64, _>("customers"),
        })
        .collect();

    // Calculate total revenue
    let total_revenue: f64 = revenue_data.iter().map(|d| d.revenue).sum();

    // Calculate growth rate
    let first_revenue = revenue_data.last().map(|d| d.revenue).unwrap_or(0.0);
    let last_revenue = revenue_data.first().map(|d| d.revenue).unwrap_or(0.0);
    let growth_rate = if first_revenue > 0.0 {
        ((last_revenue - first_revenue) / first_revenue) * 100.0
    } else {
        0.0
    };

    let response = RevenueAnalyticsResponse {
        period: period.to_string(),
        revenue_data,
        growth_rate,
        total_revenue,
    };

    Ok(Json(response))
}

pub async fn get_customer_analytics(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<CustomerAnalyticsResponse>, StatusCode> {
    info!("Fetching customer analytics");

    // Get total customers
    let total_customers_row = sqlx::query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'")
        .fetch_one(&state.db.pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let total_customers: i64 = total_customers_row.get("count");

    // Get new customers (last 30 days)
    let new_customers_row = sqlx::query(
        "SELECT COUNT(*) as count FROM users 
         WHERE role = 'customer' AND created_at >= NOW() - INTERVAL '30 days'"
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let new_customers: i64 = new_customers_row.get("count");

    // Get returning customers
    let returning_customers_row = sqlx::query(
        "SELECT COUNT(DISTINCT u.id) as count 
         FROM users u 
         JOIN shipments s ON u.id = s.sender_id OR u.id = s.receiver_id
         WHERE u.role = 'customer' AND s.created_at >= NOW() - INTERVAL '30 days'"
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let returning_customers: i64 = returning_customers_row.get("count");

    // Get customer segments (mock data for now)
    let customer_segments = vec![
        CustomerSegment {
            segment: "VIP".to_string(),
            count: (total_customers as f64 * 0.1) as i64,
            percentage: 10.0,
            average_value: 1500.0,
        },
        CustomerSegment {
            segment: "Regular".to_string(),
            count: (total_customers as f64 * 0.7) as i64,
            percentage: 70.0,
            average_value: 500.0,
        },
        CustomerSegment {
            segment: "New".to_string(),
            count: new_customers,
            percentage: (new_customers as f64 / total_customers as f64) * 100.0,
            average_value: 200.0,
        },
        CustomerSegment {
            segment: "Dormant".to_string(),
            count: (total_customers as f64 * 0.2) as i64,
            percentage: 20.0,
            average_value: 0.0,
        },
    ];

    // Get satisfaction score
    let satisfaction_row = sqlx::query(
        "SELECT AVG(rating) as avg_rating FROM ratings"
    )
    .fetch_one(&state.db.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let satisfaction_score: f64 = satisfaction_row.get("avg_rating").unwrap_or(0.0);

    let response = CustomerAnalyticsResponse {
        total_customers,
        new_customers,
        returning_customers,
        customer_segments,
        satisfaction_score,
    };

    Ok(Json(response))
}

pub async fn get_product_analytics(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<ProductAnalyticsResponse>, StatusCode> {
    info!("Fetching product analytics");

    // Get total products (mock data for now)
    let total_products = 150;

    // Get top products (mock data)
    let top_products = vec![
        ProductData {
            product_id: "prod_1".to_string(),
            name: "إلكترونيات".to_string(),
            shipments: 45,
            revenue: 12500.0,
            rating: 4.8,
        },
        ProductData {
            product_id: "prod_2".to_string(),
            name: "ملابس".to_string(),
            shipments: 38,
            revenue: 8900.0,
            rating: 4.6,
        },
        ProductData {
            product_id: "prod_3".to_string(),
            name: "كتب".to_string(),
            shipments: 32,
            revenue: 5600.0,
            rating: 4.7,
        },
        ProductData {
            product_id: "prod_4".to_string(),
            name: "منزلية".to_string(),
            shipments: 28,
            revenue: 4200.0,
            rating: 4.5,
        },
        ProductData {
            product_id: "prod_5".to_string(),
            name: "رياضية".to_string(),
            shipments: 25,
            revenue: 3800.0,
            rating: 4.4,
        },
    ];

    // Get category breakdown
    let category_breakdown = vec![
        CategoryData {
            category: "إلكترونيات".to_string(),
            count: 45,
            revenue: 12500.0,
            percentage: 30.0,
        },
        CategoryData {
            category: "ملابس".to_string(),
            count: 38,
            revenue: 8900.0,
            percentage: 25.0,
        },
        CategoryData {
            category: "كتب".to_string(),
            count: 32,
            revenue: 5600.0,
            percentage: 20.0,
        },
        CategoryData {
            category: "منزلية".to_string(),
            count: 28,
            revenue: 4200.0,
            percentage: 15.0,
        },
        CategoryData {
            category: "رياضية".to_string(),
            count: 25,
            revenue: 3800.0,
            percentage: 10.0,
        },
    ];

    // Get inventory status
    let inventory_status = InventoryStatus {
        total_items: 150,
        low_stock: 12,
        out_of_stock: 3,
        overstock: 8,
    };

    let response = ProductAnalyticsResponse {
        total_products,
        top_products,
        category_breakdown,
        inventory_status,
    };

    Ok(Json(response))
}

pub async fn get_campaign_analytics(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<CampaignAnalyticsResponse>, StatusCode> {
    info!("Fetching campaign analytics");

    // Mock data for campaigns
    let total_campaigns = 8;
    let active_campaigns = 3;

    let campaign_performance = vec![
        CampaignData {
            campaign_id: "camp_1".to_string(),
            name: "حملة الصيف".to_string(),
            status: "active".to_string(),
            budget: 5000.0,
            spent: 3200.0,
            conversions: 45,
            roi: 180.0,
            ctr: 3.2,
        },
        CampaignData {
            campaign_id: "camp_2".to_string(),
            name: "عرض الخريف".to_string(),
            status: "completed".to_string(),
            budget: 3000.0,
            spent: 3000.0,
            conversions: 38,
            roi: 150.0,
            ctr: 2.8,
        },
        CampaignData {
            campaign_id: "camp_3".to_string(),
            name: "موسم الأعياد".to_string(),
            status: "active".to_string(),
            budget: 8000.0,
            spent: 4500.0,
            conversions: 62,
            roi: 220.0,
            ctr: 4.1,
        },
    ];

    let roi_summary = ROISummary {
        total_investment: 16000.0,
        total_return: 35200.0,
        average_roi: 220.0,
        best_performing_campaign: "موسم الأعياد".to_string(),
    };

    let response = CampaignAnalyticsResponse {
        total_campaigns,
        active_campaigns,
        campaign_performance,
        roi_summary,
    };

    Ok(Json(response))
}

pub async fn export_data(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Exporting analytics data");

    let export_type = params.get("type").and_then(|v| v.as_str()).unwrap_or("all");
    let format = params.get("format").and_then(|v| v.as_str()).unwrap_or("json");

    // In a real implementation, this would generate and return the requested data
    // For now, we'll return a mock response

    let export_data = serde_json::json!({
        "export_type": export_type,
        "format": format,
        "file_url": "https://exports.web3shipping.com/analytics_export_2024.json",
        "file_size": "2.5MB",
        "created_at": Utc::now().to_rfc3339(),
        "expires_at": (Utc::now() + chrono::Duration::hours(24)).to_rfc3339()
    });

    Ok(Json(export_data))
}
