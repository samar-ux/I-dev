use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub server_address: String,
    pub database_url: String,
    pub redis_url: String,
    pub jwt_secret: String,
    pub jwt_expiry: u64,
    pub cors_origins: Vec<String>,
    
    // Web3 Configuration
    pub ethereum_rpc_url: String,
    pub ethereum_chain_id: u64,
    pub ethereum_private_key: String,
    pub ethereum_contract_address: String,
    
    // ICP Configuration
    pub icp_canister_id: String,
    pub icp_network_url: String,
    pub icp_identity_provider: String,
    
    // External Services
    pub twilio_account_sid: String,
    pub twilio_auth_token: String,
    pub twilio_phone_number: String,
    pub sendgrid_api_key: String,
    pub sendgrid_from_email: String,
    
    // AI Services
    pub openai_api_key: String,
    pub anthropic_api_key: String,
    
    // Business Integrations
    pub shopify_api_key: String,
    pub shopify_api_secret: String,
    pub woocommerce_consumer_key: String,
    pub woocommerce_consumer_secret: String,
    
    // Security
    pub encryption_key: String,
    pub rate_limit_requests: u32,
    pub rate_limit_window: u64,
    
    // File Storage
    pub aws_access_key_id: String,
    pub aws_secret_access_key: String,
    pub aws_region: String,
    pub aws_bucket_name: String,
    
    // Monitoring
    pub prometheus_port: u16,
    pub log_level: String,
}

impl Config {
    pub fn load() -> Result<Self, Box<dyn std::error::Error>> {
        dotenvy::dotenv()?;
        
        Ok(Config {
            server_address: env::var("SERVER_ADDRESS")
                .unwrap_or_else(|_| "0.0.0.0:3000".to_string()),
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "postgresql://user:password@localhost/web3_shipping".to_string()),
            redis_url: env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://localhost:6379".to_string()),
            jwt_secret: env::var("JWT_SECRET")
                .unwrap_or_else(|_| "your-secret-key".to_string()),
            jwt_expiry: env::var("JWT_EXPIRY")
                .unwrap_or_else(|_| "3600".to_string())
                .parse()
                .unwrap_or(3600),
            cors_origins: env::var("CORS_ORIGINS")
                .unwrap_or_else(|_| "http://localhost:3000,http://localhost:5173".to_string())
                .split(',')
                .map(|s| s.trim().to_string())
                .collect(),
            
            // Web3 Configuration
            ethereum_rpc_url: env::var("ETHEREUM_RPC_URL")
                .unwrap_or_else(|_| "https://mainnet.infura.io/v3/your-project-id".to_string()),
            ethereum_chain_id: env::var("ETHEREUM_CHAIN_ID")
                .unwrap_or_else(|_| "1".to_string())
                .parse()
                .unwrap_or(1),
            ethereum_private_key: env::var("ETHEREUM_PRIVATE_KEY")
                .unwrap_or_else(|_| "".to_string()),
            ethereum_contract_address: env::var("ETHEREUM_CONTRACT_ADDRESS")
                .unwrap_or_else(|_| "".to_string()),
            
            // ICP Configuration
            icp_canister_id: env::var("ICP_CANISTER_ID")
                .unwrap_or_else(|_| "".to_string()),
            icp_network_url: env::var("ICP_NETWORK_URL")
                .unwrap_or_else(|_| "https://ic0.app".to_string()),
            icp_identity_provider: env::var("ICP_IDENTITY_PROVIDER")
                .unwrap_or_else(|_| "https://identity.ic0.app".to_string()),
            
            // External Services
            twilio_account_sid: env::var("TWILIO_ACCOUNT_SID")
                .unwrap_or_else(|_| "".to_string()),
            twilio_auth_token: env::var("TWILIO_AUTH_TOKEN")
                .unwrap_or_else(|_| "".to_string()),
            twilio_phone_number: env::var("TWILIO_PHONE_NUMBER")
                .unwrap_or_else(|_| "".to_string()),
            sendgrid_api_key: env::var("SENDGRID_API_KEY")
                .unwrap_or_else(|_| "".to_string()),
            sendgrid_from_email: env::var("SENDGRID_FROM_EMAIL")
                .unwrap_or_else(|_| "noreply@web3shipping.com".to_string()),
            
            // AI Services
            openai_api_key: env::var("OPENAI_API_KEY")
                .unwrap_or_else(|_| "".to_string()),
            anthropic_api_key: env::var("ANTHROPIC_API_KEY")
                .unwrap_or_else(|_| "".to_string()),
            
            // Business Integrations
            shopify_api_key: env::var("SHOPIFY_API_KEY")
                .unwrap_or_else(|_| "".to_string()),
            shopify_api_secret: env::var("SHOPIFY_API_SECRET")
                .unwrap_or_else(|_| "".to_string()),
            woocommerce_consumer_key: env::var("WOCOMMERCE_CONSUMER_KEY")
                .unwrap_or_else(|_| "".to_string()),
            woocommerce_consumer_secret: env::var("WOCOMMERCE_CONSUMER_SECRET")
                .unwrap_or_else(|_| "".to_string()),
            
            // Security
            encryption_key: env::var("ENCRYPTION_KEY")
                .unwrap_or_else(|_| "your-encryption-key".to_string()),
            rate_limit_requests: env::var("RATE_LIMIT_REQUESTS")
                .unwrap_or_else(|_| "100".to_string())
                .parse()
                .unwrap_or(100),
            rate_limit_window: env::var("RATE_LIMIT_WINDOW")
                .unwrap_or_else(|_| "60".to_string())
                .parse()
                .unwrap_or(60),
            
            // File Storage
            aws_access_key_id: env::var("AWS_ACCESS_KEY_ID")
                .unwrap_or_else(|_| "".to_string()),
            aws_secret_access_key: env::var("AWS_SECRET_ACCESS_KEY")
                .unwrap_or_else(|_| "".to_string()),
            aws_region: env::var("AWS_REGION")
                .unwrap_or_else(|_| "us-east-1".to_string()),
            aws_bucket_name: env::var("AWS_BUCKET_NAME")
                .unwrap_or_else(|_| "".to_string()),
            
            // Monitoring
            prometheus_port: env::var("PROMETHEUS_PORT")
                .unwrap_or_else(|_| "9090".to_string())
                .parse()
                .unwrap_or(9090),
            log_level: env::var("LOG_LEVEL")
                .unwrap_or_else(|_| "info".to_string()),
        })
    }
}
