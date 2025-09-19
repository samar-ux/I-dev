#!/bin/bash

# Web3 Shipping Platform Backend Startup Script
# This script sets up and runs the Rust backend server

echo "🚀 Starting Web3 Shipping Platform Backend..."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust/Cargo is not installed. Please install Rust first."
    echo "Visit: https://rustup.rs/"
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Check if Redis is running
if ! command -v redis-cli &> /dev/null; then
    echo "❌ Redis is not installed. Please install Redis first."
    exit 1
fi

# Set environment variables
export RUST_LOG=debug
export RUST_BACKTRACE=1

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration before running again."
    exit 1
fi

# Load environment variables
source .env

# Check if database exists
echo "🔍 Checking database connection..."
if ! psql -h localhost -U web3shipping -d web3_shipping_platform -c "SELECT 1;" &> /dev/null; then
    echo "📊 Creating database..."
    createdb -h localhost -U postgres web3_shipping_platform
    echo "✅ Database created successfully"
fi

# Check if Redis is running
echo "🔍 Checking Redis connection..."
if ! redis-cli ping &> /dev/null; then
    echo "❌ Redis is not running. Please start Redis server."
    exit 1
fi

# Build the project
echo "🔨 Building the project..."
cargo build --release

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build completed successfully"

# Run database migrations
echo "📊 Running database migrations..."
cargo run --bin migrate

if [ $? -ne 0 ]; then
    echo "❌ Migration failed. Please check the errors above."
    exit 1
fi

echo "✅ Migrations completed successfully"

# Start the server
echo "🌐 Starting the server..."
echo "📍 Server will be available at: http://localhost:3000"
echo "📊 Health check: http://localhost:3000/health"
echo "📚 API Documentation: http://localhost:3000/api/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cargo run --release
