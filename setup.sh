#!/bin/bash

echo "🚀 Setting up Inventory Management System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Build and start containers
echo "📦 Building and starting containers..."
docker compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready (this may take a minute)..."
sleep 30

# Check if containers are running
if docker compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend:    http://localhost:3000"
    echo "   Backend API: http://localhost:8001/api"
    echo "   Health Check: http://localhost:3000/health"
    echo ""
    echo "🛠️  To stop the application, run: docker compose down"
else
    echo ""
    echo "❌ Something went wrong. Check the logs with: docker compose logs"
fi
