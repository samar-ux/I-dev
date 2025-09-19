-- Migration: 001_initial_schema.sql
-- Description: Create initial database schema for Web3 Shipping Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'store_owner', 'driver', 'shipping_company', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'banned');
CREATE TYPE shipment_status AS ENUM ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'cancelled');
CREATE TYPE shipment_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE suggestion_type AS ENUM ('route_optimization', 'demand_forecast', 'customer_retention', 'inventory_optimization', 'cost_reduction', 'time_optimization');
CREATE TYPE suggestion_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE suggestion_impact AS ENUM ('cost_saving', 'revenue_increase', 'customer_satisfaction', 'efficiency', 'quality');
CREATE TYPE suggestion_status AS ENUM ('pending', 'applied', 'rejected', 'expired');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_category AS ENUM ('tracking', 'payment', 'insurance', 'technical', 'general');
CREATE TYPE sender_type AS ENUM ('customer', 'agent', 'system');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'video', 'audio', 'location');
CREATE TYPE confirmation_type AS ENUM ('delivery_confirmation', 'payment_confirmation', 'pickup_confirmation', 'inspection_confirmation');
CREATE TYPE confirmation_status AS ENUM ('pending', 'in_progress', 'completed', 'expired', 'cancelled');
CREATE TYPE confirmation_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE policy_status AS ENUM ('active', 'expired', 'claimed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('bitcoin', 'ethereum', 'usdt', 'usdc', 'bnb', 'ada', 'sol', 'matic', 'credit_card', 'bank_transfer');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE integration_platform AS ENUM ('shopify', 'woocommerce', 'wix', 'easyorder');
CREATE TYPE integration_status AS ENUM ('active', 'inactive', 'error');

-- Users table
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
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    kyc_verified BOOLEAN NOT NULL DEFAULT FALSE,
    biometric_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    world_id_verified BOOLEAN NOT NULL DEFAULT FALSE,
    internet_identity_principal VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Shipments table
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    status shipment_status NOT NULL DEFAULT 'pending',
    priority shipment_priority NOT NULL DEFAULT 'medium',
    weight DECIMAL(10,3) NOT NULL,
    dimensions JSONB NOT NULL,
    description TEXT NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    pickup_address JSONB NOT NULL,
    delivery_address JSONB NOT NULL,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    nft_token_id VARCHAR(100),
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Location updates table
CREATE TABLE location_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    accuracy DECIMAL(5,2),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- AI Suggestions table
CREATE TABLE ai_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    shipment_id UUID REFERENCES shipments(id),
    suggestion_type suggestion_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority suggestion_priority NOT NULL,
    impact suggestion_impact NOT NULL,
    estimated_savings DECIMAL(15,2) NOT NULL DEFAULT 0,
    confidence DECIMAL(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    category VARCHAR(100) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    status suggestion_status NOT NULL DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'open',
    priority ticket_priority NOT NULL DEFAULT 'medium',
    category ticket_category NOT NULL DEFAULT 'general',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    chat_session_id UUID,
    sender_id UUID NOT NULL REFERENCES users(id),
    sender_type sender_type NOT NULL,
    message TEXT NOT NULL,
    message_type message_type NOT NULL DEFAULT 'text',
    attachments JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Dual confirmations table
CREATE TABLE confirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    confirmation_type confirmation_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status confirmation_status NOT NULL DEFAULT 'pending',
    priority confirmation_priority NOT NULL DEFAULT 'medium',
    shipment_id UUID REFERENCES shipments(id),
    participants JSONB NOT NULL,
    verification_methods JSONB NOT NULL DEFAULT '{}',
    location JSONB,
    blockchain_tx_hash VARCHAR(66),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Insurance policies table
CREATE TABLE insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    user_id UUID NOT NULL REFERENCES users(id),
    policy_number VARCHAR(100) UNIQUE NOT NULL,
    coverage_amount DECIMAL(15,2) NOT NULL,
    premium DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status policy_status NOT NULL DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rater_id UUID NOT NULL REFERENCES users(id),
    ratee_id UUID NOT NULL REFERENCES users(id),
    shipment_id UUID REFERENCES shipments(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    shipment_id UUID REFERENCES shipments(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Business integrations table
CREATE TABLE business_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    platform integration_platform NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255) NOT NULL,
    webhook_url TEXT,
    status integration_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX idx_shipments_sender_id ON shipments(sender_id);
CREATE INDEX idx_shipments_receiver_id ON shipments(receiver_id);
CREATE INDEX idx_shipments_driver_id ON shipments(driver_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created_at ON shipments(created_at);

CREATE INDEX idx_location_updates_shipment_id ON location_updates(shipment_id);
CREATE INDEX idx_location_updates_timestamp ON location_updates(timestamp);

CREATE INDEX idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX idx_ai_suggestions_shipment_id ON ai_suggestions(shipment_id);
CREATE INDEX idx_ai_suggestions_status ON ai_suggestions(status);
CREATE INDEX idx_ai_suggestions_created_at ON ai_suggestions(created_at);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_agent_id ON support_tickets(agent_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at);

CREATE INDEX idx_chat_messages_ticket_id ON chat_messages(ticket_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX idx_confirmations_shipment_id ON confirmations(shipment_id);
CREATE INDEX idx_confirmations_status ON confirmations(status);
CREATE INDEX idx_confirmations_created_at ON confirmations(created_at);

CREATE INDEX idx_insurance_policies_shipment_id ON insurance_policies(shipment_id);
CREATE INDEX idx_insurance_policies_user_id ON insurance_policies(user_id);
CREATE INDEX idx_insurance_policies_status ON insurance_policies(status);

CREATE INDEX idx_ratings_rater_id ON ratings(rater_id);
CREATE INDEX idx_ratings_ratee_id ON ratings(ratee_id);
CREATE INDEX idx_ratings_shipment_id ON ratings(shipment_id);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_shipment_id ON payments(shipment_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_business_integrations_user_id ON business_integrations(user_id);
CREATE INDEX idx_business_integrations_platform ON business_integrations(platform);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_integrations_updated_at BEFORE UPDATE ON business_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial admin user
INSERT INTO users (
    email, username, password_hash, first_name, last_name, role, status, email_verified
) VALUES (
    'admin@web3shipping.com',
    'admin',
    '$argon2id$v=19$m=65536,t=3,p=4$example$example', -- This should be properly hashed
    'Admin',
    'User',
    'admin',
    'active',
    true
) ON CONFLICT (email) DO NOTHING;
