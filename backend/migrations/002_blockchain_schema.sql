-- Web3 Shipping Platform - Complete Blockchain Database Schema
-- This migration creates all tables for the blockchain-based shipping platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types for blockchain and crypto
CREATE TYPE crypto_currency AS ENUM (
    'bitcoin', 'ethereum', 'usdt', 'usdc', 'bnb', 'ada', 'sol', 'matic', 'icp', 'worldcoin'
);

CREATE TYPE payment_priority AS ENUM (
    'low', 'medium', 'high', 'urgent'
);

CREATE TYPE blockchain_network AS ENUM (
    'ethereum', 'polygon', 'binance_smart_chain', 'solana', 'cardano', 'icp'
);

CREATE TYPE contract_type AS ENUM (
    'shipment_contract', 'payment_contract', 'insurance_contract', 'rating_contract', 
    'reward_contract', 'escrow_contract', 'multi_sig_contract'
);

CREATE TYPE contract_status AS ENUM (
    'deployed', 'active', 'paused', 'terminated', 'failed'
);

CREATE TYPE defi_protocol AS ENUM (
    'uniswap', 'compound', 'aave', 'maker', 'curve', 'balancer', 
    'sushi_swap', 'pancake_swap', 'icp_protocol'
);

CREATE TYPE defi_status AS ENUM (
    'active', 'matured', 'withdrawn', 'liquidated', 'paused'
);

CREATE TYPE nft_type AS ENUM (
    'shipment', 'document', 'certificate', 'reward', 'insurance', 
    'rating', 'achievement', 'membership'
);

CREATE TYPE document_type AS ENUM (
    'invoice', 'receipt', 'contract', 'certificate', 'license', 
    'passport', 'id_card', 'driver_license'
);

CREATE TYPE certificate_type AS ENUM (
    'delivery', 'quality', 'authenticity', 'origin', 'compliance', 
    'security', 'insurance', 'warranty'
);

CREATE TYPE reward_type AS ENUM (
    'loyalty', 'achievement', 'referral', 'bonus', 'discount', 
    'cashback', 'points', 'badge'
);

-- Users table (updated for blockchain)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    status user_status NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    kyc_verified BOOLEAN DEFAULT FALSE,
    biometric_enabled BOOLEAN DEFAULT FALSE,
    world_id_verified BOOLEAN DEFAULT FALSE,
    internet_identity_principal VARCHAR(255),
    wallet_address VARCHAR(255),
    icp_principal VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Shipments table (updated for blockchain)
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    weight DECIMAL(10,2) NOT NULL,
    dimensions JSONB NOT NULL,
    description TEXT NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    currency crypto_currency NOT NULL DEFAULT 'ethereum',
    status shipment_status NOT NULL DEFAULT 'pending',
    priority shipment_priority NOT NULL DEFAULT 'medium',
    pickup_address JSONB NOT NULL,
    delivery_address JSONB NOT NULL,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    blockchain_tx_hash VARCHAR(255),
    nft_id UUID,
    smart_contract_address VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crypto Payments table (replaces traditional payments)
CREATE TABLE crypto_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    shipment_id UUID REFERENCES shipments(id),
    amount DECIMAL(15,8) NOT NULL,
    currency crypto_currency NOT NULL,
    recipient_address VARCHAR(255) NOT NULL,
    blockchain_tx_hash VARCHAR(255) NOT NULL,
    gas_fee DECIMAL(15,8) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    block_number BIGINT,
    confirmation_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ICP Payments table
CREATE TABLE icp_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    shipment_id UUID REFERENCES shipments(id),
    amount DECIMAL(15,8) NOT NULL,
    recipient_principal VARCHAR(255) NOT NULL,
    icp_tx_hash VARCHAR(255) NOT NULL,
    memo TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- NFT Payments table
CREATE TABLE nft_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    shipment_id UUID REFERENCES shipments(id),
    nft_id UUID NOT NULL,
    nft_metadata JSONB NOT NULL,
    recipient_address VARCHAR(255) NOT NULL,
    blockchain blockchain_network NOT NULL,
    mint_tx_hash VARCHAR(255) NOT NULL,
    transfer_tx_hash VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Smart Contracts table
CREATE TABLE smart_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    contract_name VARCHAR(255) NOT NULL,
    contract_type contract_type NOT NULL,
    blockchain blockchain_network NOT NULL,
    contract_address VARCHAR(255) NOT NULL,
    deployment_tx_hash VARCHAR(255) NOT NULL,
    gas_used BIGINT NOT NULL,
    deployment_cost DECIMAL(15,8) NOT NULL,
    status contract_status NOT NULL DEFAULT 'deployed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract Executions table
CREATE TABLE contract_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    contract_address VARCHAR(255) NOT NULL,
    function_name VARCHAR(255) NOT NULL,
    execution_tx_hash VARCHAR(255) NOT NULL,
    gas_used BIGINT NOT NULL,
    execution_cost DECIMAL(15,8) NOT NULL,
    result JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipment Contracts table
CREATE TABLE shipment_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    contract_address VARCHAR(255) NOT NULL,
    payment_amount DECIMAL(15,8) NOT NULL,
    payment_currency crypto_currency NOT NULL,
    insurance_amount DECIMAL(15,8),
    delivery_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract Events table
CREATE TABLE contract_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_address VARCHAR(255) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_data JSONB NOT NULL,
    block_number BIGINT NOT NULL,
    transaction_hash VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DeFi Staking table
CREATE TABLE defi_staking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(15,8) NOT NULL,
    currency crypto_currency NOT NULL,
    protocol defi_protocol NOT NULL,
    staking_period INTEGER NOT NULL,
    apy DECIMAL(5,2) NOT NULL,
    rewards DECIMAL(15,8) NOT NULL DEFAULT 0,
    auto_compound BOOLEAN DEFAULT FALSE,
    status defi_status NOT NULL DEFAULT 'active',
    tx_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    maturity_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- DeFi Liquidity Pools table
CREATE TABLE defi_liquidity_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_a crypto_currency NOT NULL,
    token_b crypto_currency NOT NULL,
    amount_a DECIMAL(15,8) NOT NULL,
    amount_b DECIMAL(15,8) NOT NULL,
    protocol defi_protocol NOT NULL,
    pool_share DECIMAL(5,2) NOT NULL,
    total_value DECIMAL(15,8) NOT NULL,
    fees_earned DECIMAL(15,8) NOT NULL DEFAULT 0,
    status defi_status NOT NULL DEFAULT 'active',
    pool_address VARCHAR(255) NOT NULL,
    tx_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DeFi Lending table
CREATE TABLE defi_lending (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(15,8) NOT NULL,
    currency crypto_currency NOT NULL,
    lending_period INTEGER NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    collateral_ratio DECIMAL(5,2) NOT NULL,
    total_interest DECIMAL(15,8) NOT NULL,
    status defi_status NOT NULL DEFAULT 'active',
    tx_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    maturity_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- DeFi Yield Farming table
CREATE TABLE defi_yield_farming (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    pool_id VARCHAR(255) NOT NULL,
    amount DECIMAL(15,8) NOT NULL,
    currency crypto_currency NOT NULL,
    farming_period INTEGER NOT NULL,
    apy DECIMAL(5,2) NOT NULL,
    rewards_earned DECIMAL(15,8) NOT NULL DEFAULT 0,
    status defi_status NOT NULL DEFAULT 'active',
    tx_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    maturity_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- DeFi Rewards table
CREATE TABLE defi_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    position_id VARCHAR(255) NOT NULL,
    reward_type VARCHAR(100) NOT NULL,
    amount DECIMAL(15,8) NOT NULL,
    currency crypto_currency NOT NULL,
    protocol defi_protocol NOT NULL,
    claimable BOOLEAN DEFAULT TRUE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipment NFTs table
CREATE TABLE shipment_nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    nft_id UUID NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    contract_address VARCHAR(255) NOT NULL,
    blockchain blockchain_network NOT NULL,
    metadata JSONB NOT NULL,
    owner_address VARCHAR(255) NOT NULL,
    mint_tx_hash VARCHAR(255) NOT NULL,
    transfer_tx_hash VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'minted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transferred_at TIMESTAMP WITH TIME ZONE
);

-- Document NFTs table
CREATE TABLE document_nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL,
    nft_id UUID NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    contract_address VARCHAR(255) NOT NULL,
    blockchain blockchain_network NOT NULL,
    document_type document_type NOT NULL,
    metadata JSONB NOT NULL,
    owner_address VARCHAR(255) NOT NULL,
    mint_tx_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'minted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificate NFTs table
CREATE TABLE certificate_nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID NOT NULL,
    nft_id UUID NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    contract_address VARCHAR(255) NOT NULL,
    blockchain blockchain_network NOT NULL,
    certificate_type certificate_type NOT NULL,
    metadata JSONB NOT NULL,
    owner_address VARCHAR(255) NOT NULL,
    mint_tx_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'minted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward NFTs table
CREATE TABLE reward_nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reward_id UUID NOT NULL,
    nft_id UUID NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    contract_address VARCHAR(255) NOT NULL,
    blockchain blockchain_network NOT NULL,
    reward_type reward_type NOT NULL,
    metadata JSONB NOT NULL,
    owner_address VARCHAR(255) NOT NULL,
    mint_tx_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'minted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT Marketplace Listings table
CREATE TABLE nft_marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nft_id VARCHAR(255) NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    contract_address VARCHAR(255) NOT NULL,
    seller_address VARCHAR(255) NOT NULL,
    price DECIMAL(15,8) NOT NULL,
    currency crypto_currency NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    listing_tx_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sold_at TIMESTAMP WITH TIME ZONE
);

-- Insurance Policies table (updated for blockchain)
CREATE TABLE insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    user_id UUID NOT NULL REFERENCES users(id),
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    coverage_amount DECIMAL(15,2) NOT NULL,
    premium DECIMAL(15,2) NOT NULL,
    currency crypto_currency NOT NULL DEFAULT 'ethereum',
    status policy_status NOT NULL DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    blockchain_tx_hash VARCHAR(255),
    smart_contract_address VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Claims table
CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID NOT NULL REFERENCES insurance_policies(id),
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    claim_amount DECIMAL(15,2) NOT NULL,
    claim_reason TEXT NOT NULL,
    incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    supporting_documents JSONB,
    approved_amount DECIMAL(15,2),
    approved_at TIMESTAMP WITH TIME ZONE,
    blockchain_tx_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table (updated for blockchain)
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rater_id UUID NOT NULL REFERENCES users(id),
    ratee_id UUID NOT NULL REFERENCES users(id),
    shipment_id UUID REFERENCES shipments(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    blockchain_tx_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    assigned_to UUID REFERENCES users(id),
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Suggestions table
CREATE TABLE ai_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    shipment_id UUID REFERENCES shipments(id),
    suggestion_type VARCHAR(100) NOT NULL,
    suggestion_data JSONB NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dual Confirmations table
CREATE TABLE confirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    confirmation_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    participants JSONB NOT NULL,
    verification_methods JSONB NOT NULL,
    digital_signatures JSONB,
    smart_contract_address VARCHAR(255),
    blockchain_tx_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Business Integrations table
CREATE TABLE business_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    platform integration_platform NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255) NOT NULL,
    webhook_url TEXT,
    status integration_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_icp_principal ON users(icp_principal);
CREATE INDEX idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX idx_shipments_blockchain_tx_hash ON shipments(blockchain_tx_hash);
CREATE INDEX idx_shipments_nft_id ON shipments(nft_id);
CREATE INDEX idx_crypto_payments_user_id ON crypto_payments(user_id);
CREATE INDEX idx_crypto_payments_blockchain_tx_hash ON crypto_payments(blockchain_tx_hash);
CREATE INDEX idx_icp_payments_user_id ON icp_payments(user_id);
CREATE INDEX idx_icp_payments_icp_tx_hash ON icp_payments(icp_tx_hash);
CREATE INDEX idx_nft_payments_user_id ON nft_payments(user_id);
CREATE INDEX idx_smart_contracts_contract_address ON smart_contracts(contract_address);
CREATE INDEX idx_contract_executions_contract_address ON contract_executions(contract_address);
CREATE INDEX idx_contract_events_contract_address ON contract_events(contract_address);
CREATE INDEX idx_defi_staking_user_id ON defi_staking(user_id);
CREATE INDEX idx_defi_liquidity_pools_user_id ON defi_liquidity_pools(user_id);
CREATE INDEX idx_defi_lending_user_id ON defi_lending(user_id);
CREATE INDEX idx_defi_yield_farming_user_id ON defi_yield_farming(user_id);
CREATE INDEX idx_defi_rewards_user_id ON defi_rewards(user_id);
CREATE INDEX idx_shipment_nfts_shipment_id ON shipment_nfts(shipment_id);
CREATE INDEX idx_shipment_nfts_owner_address ON shipment_nfts(owner_address);
CREATE INDEX idx_document_nfts_document_id ON document_nfts(document_id);
CREATE INDEX idx_certificate_nfts_certificate_id ON certificate_nfts(certificate_id);
CREATE INDEX idx_reward_nfts_reward_id ON reward_nfts(reward_id);
CREATE INDEX idx_nft_marketplace_listings_seller_address ON nft_marketplace_listings(seller_address);
CREATE INDEX idx_insurance_policies_shipment_id ON insurance_policies(shipment_id);
CREATE INDEX idx_insurance_policies_blockchain_tx_hash ON insurance_policies(blockchain_tx_hash);
CREATE INDEX idx_insurance_claims_policy_id ON insurance_claims(policy_id);
CREATE INDEX idx_ratings_ratee_id ON ratings(ratee_id);
CREATE INDEX idx_ratings_blockchain_tx_hash ON ratings(blockchain_tx_hash);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX idx_confirmations_participants ON confirmations USING GIN(participants);
CREATE INDEX idx_business_integrations_user_id ON business_integrations(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smart_contracts_updated_at BEFORE UPDATE ON smart_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipment_contracts_updated_at BEFORE UPDATE ON shipment_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON insurance_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_integrations_updated_at BEFORE UPDATE ON business_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO users (email, username, password_hash, first_name, last_name, role) VALUES
('admin@web3shipping.com', 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QzQz2', 'Admin', 'User', 'admin'),
('demo@web3shipping.com', 'demo', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QzQz2', 'Demo', 'User', 'customer');

-- Create views for common queries
CREATE VIEW user_wallet_summary AS
SELECT 
    u.id,
    u.email,
    u.wallet_address,
    u.icp_principal,
    COUNT(DISTINCT cp.id) as crypto_payments_count,
    COUNT(DISTINCT ip.id) as icp_payments_count,
    COUNT(DISTINCT np.id) as nft_payments_count,
    COALESCE(SUM(cp.amount), 0) as total_crypto_spent,
    COALESCE(SUM(ip.amount), 0) as total_icp_spent
FROM users u
LEFT JOIN crypto_payments cp ON u.id = cp.user_id
LEFT JOIN icp_payments ip ON u.id = ip.user_id
LEFT JOIN nft_payments np ON u.id = np.user_id
GROUP BY u.id, u.email, u.wallet_address, u.icp_principal;

CREATE VIEW shipment_blockchain_summary AS
SELECT 
    s.id,
    s.tracking_number,
    s.status,
    s.blockchain_tx_hash,
    s.nft_id,
    s.smart_contract_address,
    cp.amount as payment_amount,
    cp.currency as payment_currency,
    cp.blockchain_tx_hash as payment_tx_hash
FROM shipments s
LEFT JOIN crypto_payments cp ON s.id = cp.shipment_id
WHERE s.blockchain_tx_hash IS NOT NULL;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO web3shipping;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO web3shipping;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO web3shipping;
