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
pub struct DashboardService {
    db: Database,
}

impl DashboardService {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
        }
    }
}

#[derive(Debug, Serialize)]
pub struct CustomerDashboardResponse {
    pub user_info: UserInfo,
    pub shipments: ShipmentSummary,
    pub recent_activity: Vec<ActivityItem>,
    pub notifications: Vec<NotificationItem>,
    pub quick_actions: Vec<QuickAction>,
}

#[derive(Debug, Serialize)]
pub struct StoreDashboardResponse {
    pub store_info: StoreInfo,
    pub orders: OrderSummary,
    pub inventory: InventorySummary,
    pub analytics: StoreAnalytics,
    pub integrations: Vec<IntegrationStatus>,
}

#[derive(Debug, Serialize)]
pub struct DriverDashboardResponse {
    pub driver_info: DriverInfo,
    pub assigned_shipments: Vec<ShipmentItem>,
    pub performance: DriverPerformance,
    pub earnings: EarningsSummary,
    pub route_optimization: RouteOptimization,
}

#[derive(Debug, Serialize)]
pub struct AdminDashboardResponse {
    pub system_stats: SystemStats,
    pub user_management: UserManagement,
    pub financial_overview: FinancialOverview,
    pub system_health: SystemHealth,
    pub recent_activities: Vec<AdminActivity>,
}

#[derive(Debug, Serialize)]
pub struct UserInfo {
    pub id: String,
    pub name: String,
    pub email: String,
    pub phone: Option<String>,
    pub avatar_url: Option<String>,
    pub membership_level: String,
    pub total_shipments: i64,
    pub total_spent: f64,
}

#[derive(Debug, Serialize)]
pub struct ShipmentSummary {
    pub total: i64,
    pub pending: i64,
    pub in_transit: i64,
    pub delivered: i64,
    pub recent_shipments: Vec<ShipmentItem>,
}

#[derive(Debug, Serialize)]
pub struct ShipmentItem {
    pub id: String,
    pub tracking_number: String,
    pub status: String,
    pub destination: String,
    pub estimated_delivery: Option<String>,
    pub current_location: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct ActivityItem {
    pub id: String,
    pub type_: String,
    pub description: String,
    pub timestamp: String,
    pub status: String,
}

#[derive(Debug, Serialize)]
pub struct NotificationItem {
    pub id: String,
    pub title: String,
    pub message: String,
    pub type_: String,
    pub is_read: bool,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct QuickAction {
    pub id: String,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub action: String,
}

#[derive(Debug, Serialize)]
pub struct StoreInfo {
    pub id: String,
    pub name: String,
    pub domain: String,
    pub status: String,
    pub plan: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct OrderSummary {
    pub total_orders: i64,
    pub pending_orders: i64,
    pub processing_orders: i64,
    pub completed_orders: i64,
    pub total_revenue: f64,
    pub recent_orders: Vec<OrderItem>,
}

#[derive(Debug, Serialize)]
pub struct OrderItem {
    pub id: String,
    pub order_number: String,
    pub customer_name: String,
    pub total_amount: f64,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct InventorySummary {
    pub total_products: i64,
    pub low_stock: i64,
    pub out_of_stock: i64,
    pub total_value: f64,
    pub top_products: Vec<ProductItem>,
}

#[derive(Debug, Serialize)]
pub struct ProductItem {
    pub id: String,
    pub name: String,
    pub sku: String,
    pub stock: i32,
    pub price: f64,
    pub category: String,
}

#[derive(Debug, Serialize)]
pub struct StoreAnalytics {
    pub visitors: i64,
    pub conversions: f64,
    pub revenue: f64,
    pub top_selling: Vec<String>,
    pub growth_rate: f64,
}

#[derive(Debug, Serialize)]
pub struct IntegrationStatus {
    pub platform: String,
    pub status: String,
    pub last_sync: Option<String>,
    pub connected_at: String,
}

#[derive(Debug, Serialize)]
pub struct DriverInfo {
    pub id: String,
    pub name: String,
    pub phone: String,
    pub vehicle_type: String,
    pub license_number: String,
    pub rating: f64,
    pub total_deliveries: i64,
}

#[derive(Debug, Serialize)]
pub struct DriverPerformance {
    pub delivery_rate: f64,
    pub on_time_rate: f64,
    pub customer_rating: f64,
    pub total_distance: f64,
    pub fuel_efficiency: f64,
}

#[derive(Debug, Serialize)]
pub struct EarningsSummary {
    pub today: f64,
    pub this_week: f64,
    pub this_month: f64,
    pub total: f64,
    pub pending: f64,
}

#[derive(Debug, Serialize)]
pub struct RouteOptimization {
    pub suggested_routes: Vec<RouteSuggestion>,
    pub fuel_savings: f64,
    pub time_savings: f64,
    pub distance_reduction: f64,
}

#[derive(Debug, Serialize)]
pub struct RouteSuggestion {
    pub id: String,
    pub description: String,
    pub estimated_time: f64,
    pub estimated_distance: f64,
    pub fuel_cost: f64,
    pub priority: String,
}

#[derive(Debug, Serialize)]
pub struct SystemStats {
    pub total_users: i64,
    pub total_shipments: i64,
    pub total_revenue: f64,
    pub active_integrations: i64,
    pub system_uptime: f64,
}

#[derive(Debug, Serialize)]
pub struct UserManagement {
    pub new_users_today: i64,
    pub active_users: i64,
    pub pending_verifications: i64,
    pub user_growth_rate: f64,
}

#[derive(Debug, Serialize)]
pub struct FinancialOverview {
    pub total_revenue: f64,
    pub monthly_revenue: f64,
    pub pending_payments: f64,
    pub transaction_fees: f64,
    pub profit_margin: f64,
}

#[derive(Debug, Serialize)]
pub struct SystemHealth {
    pub api_status: String,
    pub database_status: String,
    pub blockchain_status: String,
    pub external_services: Vec<ServiceStatus>,
    pub error_rate: f64,
}

#[derive(Debug, Serialize)]
pub struct ServiceStatus {
    pub name: String,
    pub status: String,
    pub response_time: f64,
    pub last_check: String,
}

#[derive(Debug, Serialize)]
pub struct AdminActivity {
    pub id: String,
    pub user: String,
    pub action: String,
    pub details: String,
    pub timestamp: String,
    pub ip_address: String,
}

pub async fn customer_dashboard(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<CustomerDashboardResponse>, StatusCode> {
    info!("Fetching customer dashboard");

    let user_id = params.get("user_id").and_then(|v| v.as_str()).unwrap_or("default");

    // Mock data for customer dashboard
    let user_info = UserInfo {
        id: user_id.to_string(),
        name: "أحمد محمد".to_string(),
        email: "ahmed@example.com".to_string(),
        phone: Some("+966501234567".to_string()),
        avatar_url: Some("https://example.com/avatar.jpg".to_string()),
        membership_level: "VIP".to_string(),
        total_shipments: 25,
        total_spent: 1250.0,
    };

    let shipments = ShipmentSummary {
        total: 25,
        pending: 2,
        in_transit: 3,
        delivered: 20,
        recent_shipments: vec![
            ShipmentItem {
                id: "ship_1".to_string(),
                tracking_number: "SH123456789".to_string(),
                status: "in_transit".to_string(),
                destination: "الرياض، المملكة العربية السعودية".to_string(),
                estimated_delivery: Some("2024-01-20T14:00:00Z".to_string()),
                current_location: Some("الدمام، المملكة العربية السعودية".to_string()),
                created_at: "2024-01-18T10:00:00Z".to_string(),
            },
        ],
    };

    let recent_activity = vec![
        ActivityItem {
            id: "act_1".to_string(),
            type_: "shipment_update".to_string(),
            description: "تم تحديث حالة الشحنة إلى 'في الطريق'".to_string(),
            timestamp: "2024-01-19T15:30:00Z".to_string(),
            status: "completed".to_string(),
        },
    ];

    let notifications = vec![
        NotificationItem {
            id: "notif_1".to_string(),
            title: "تحديث الشحنة".to_string(),
            message: "شحنتك في طريقها إليك".to_string(),
            type_: "shipment".to_string(),
            is_read: false,
            created_at: "2024-01-19T15:30:00Z".to_string(),
        },
    ];

    let quick_actions = vec![
        QuickAction {
            id: "action_1".to_string(),
            title: "إنشاء شحنة جديدة".to_string(),
            description: "إرسال طرد جديد".to_string(),
            icon: "package".to_string(),
            action: "create_shipment".to_string(),
        },
        QuickAction {
            id: "action_2".to_string(),
            title: "تتبع الشحنة".to_string(),
            description: "البحث عن شحنة".to_string(),
            icon: "search".to_string(),
            action: "track_shipment".to_string(),
        },
    ];

    let response = CustomerDashboardResponse {
        user_info,
        shipments,
        recent_activity,
        notifications,
        quick_actions,
    };

    Ok(Json(response))
}

pub async fn store_dashboard(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<StoreDashboardResponse>, StatusCode> {
    info!("Fetching store dashboard");

    let store_id = params.get("store_id").and_then(|v| v.as_str()).unwrap_or("default");

    // Mock data for store dashboard
    let store_info = StoreInfo {
        id: store_id.to_string(),
        name: "متجر الإلكترونيات".to_string(),
        domain: "electronics-store.com".to_string(),
        status: "active".to_string(),
        plan: "premium".to_string(),
        created_at: "2024-01-01T00:00:00Z".to_string(),
    };

    let orders = OrderSummary {
        total_orders: 150,
        pending_orders: 12,
        processing_orders: 8,
        completed_orders: 130,
        total_revenue: 45000.0,
        recent_orders: vec![
            OrderItem {
                id: "order_1".to_string(),
                order_number: "ORD-2024-001".to_string(),
                customer_name: "سارة أحمد".to_string(),
                total_amount: 250.0,
                status: "processing".to_string(),
                created_at: "2024-01-19T10:00:00Z".to_string(),
            },
        ],
    };

    let inventory = InventorySummary {
        total_products: 500,
        low_stock: 15,
        out_of_stock: 3,
        total_value: 125000.0,
        top_products: vec![
            ProductItem {
                id: "prod_1".to_string(),
                name: "هاتف ذكي".to_string(),
                sku: "PHONE-001".to_string(),
                stock: 25,
                price: 1200.0,
                category: "إلكترونيات".to_string(),
            },
        ],
    };

    let analytics = StoreAnalytics {
        visitors: 2500,
        conversions: 6.5,
        revenue: 45000.0,
        top_selling: vec!["هاتف ذكي".to_string(), "لابتوب".to_string()],
        growth_rate: 15.5,
    };

    let integrations = vec![
        IntegrationStatus {
            platform: "shopify".to_string(),
            status: "active".to_string(),
            last_sync: Some("2024-01-19T14:00:00Z".to_string()),
            connected_at: "2024-01-01T00:00:00Z".to_string(),
        },
    ];

    let response = StoreDashboardResponse {
        store_info,
        orders,
        inventory,
        analytics,
        integrations,
    };

    Ok(Json(response))
}

pub async fn driver_dashboard(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<DriverDashboardResponse>, StatusCode> {
    info!("Fetching driver dashboard");

    let driver_id = params.get("driver_id").and_then(|v| v.as_str()).unwrap_or("default");

    // Mock data for driver dashboard
    let driver_info = DriverInfo {
        id: driver_id.to_string(),
        name: "محمد علي".to_string(),
        phone: "+966501234567".to_string(),
        vehicle_type: "شاحنة صغيرة".to_string(),
        license_number: "DL123456".to_string(),
        rating: 4.8,
        total_deliveries: 150,
    };

    let assigned_shipments = vec![
        ShipmentItem {
            id: "ship_1".to_string(),
            tracking_number: "SH123456789".to_string(),
            status: "assigned".to_string(),
            destination: "الرياض، المملكة العربية السعودية".to_string(),
            estimated_delivery: Some("2024-01-20T14:00:00Z".to_string()),
            current_location: Some("الدمام، المملكة العربية السعودية".to_string()),
            created_at: "2024-01-18T10:00:00Z".to_string(),
        },
    ];

    let performance = DriverPerformance {
        delivery_rate: 98.5,
        on_time_rate: 95.0,
        customer_rating: 4.8,
        total_distance: 2500.0,
        fuel_efficiency: 8.5,
    };

    let earnings = EarningsSummary {
        today: 150.0,
        this_week: 850.0,
        this_month: 3200.0,
        total: 15000.0,
        pending: 200.0,
    };

    let route_optimization = RouteOptimization {
        suggested_routes: vec![
            RouteSuggestion {
                id: "route_1".to_string(),
                description: "مسار محسن عبر الطريق السريع".to_string(),
                estimated_time: 2.5,
                estimated_distance: 120.0,
                fuel_cost: 45.0,
                priority: "high".to_string(),
            },
        ],
        fuel_savings: 15.0,
        time_savings: 30.0,
        distance_reduction: 8.0,
    };

    let response = DriverDashboardResponse {
        driver_info,
        assigned_shipments,
        performance,
        earnings,
        route_optimization,
    };

    Ok(Json(response))
}

pub async fn admin_dashboard(
    State(state): State<crate::AppState>,
    Query(params): Query<serde_json::Value>,
) -> Result<Json<AdminDashboardResponse>, StatusCode> {
    info!("Fetching admin dashboard");

    // Mock data for admin dashboard
    let system_stats = SystemStats {
        total_users: 1500,
        total_shipments: 5000,
        total_revenue: 250000.0,
        active_integrations: 8,
        system_uptime: 99.9,
    };

    let user_management = UserManagement {
        new_users_today: 25,
        active_users: 1200,
        pending_verifications: 15,
        user_growth_rate: 12.5,
    };

    let financial_overview = FinancialOverview {
        total_revenue: 250000.0,
        monthly_revenue: 45000.0,
        pending_payments: 5000.0,
        transaction_fees: 2500.0,
        profit_margin: 85.0,
    };

    let system_health = SystemHealth {
        api_status: "healthy".to_string(),
        database_status: "healthy".to_string(),
        blockchain_status: "healthy".to_string(),
        external_services: vec![
            ServiceStatus {
                name: "Twilio".to_string(),
                status: "healthy".to_string(),
                response_time: 150.0,
                last_check: "2024-01-19T15:00:00Z".to_string(),
            },
        ],
        error_rate: 0.1,
    };

    let recent_activities = vec![
        AdminActivity {
            id: "act_1".to_string(),
            user: "admin@web3shipping.com".to_string(),
            action: "user_verification".to_string(),
            details: "تم التحقق من مستخدم جديد".to_string(),
            timestamp: "2024-01-19T15:30:00Z".to_string(),
            ip_address: "192.168.1.100".to_string(),
        },
    ];

    let response = AdminDashboardResponse {
        system_stats,
        user_management,
        financial_overview,
        system_health,
        recent_activities,
    };

    Ok(Json(response))
}
