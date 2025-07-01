#!/bin/bash

# 🌐 Travo Webapp Setup Script
# Automated setup for the flight alerts web application

set -e

echo "🚀 Setting up Travo Flight Alerts Webapp..."
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the webapp directory."
    exit 1
fi

# Check Node.js version
print_status "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if ! node -pe "require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION')" 2>/dev/null; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18+."
    exit 1
fi

print_success "Node.js version $NODE_VERSION is compatible"

# Install dependencies
print_status "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Set up environment variables
print_status "Setting up environment variables..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from template"
        print_warning "Please edit .env file with your actual configuration values"
    else
        print_error ".env.example file not found"
        exit 1
    fi
else
    print_warning ".env file already exists, skipping..."
fi

# Generate Prisma client
print_status "Setting up database..."
if npx prisma generate; then
    print_success "Prisma client generated"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Push database schema
print_status "Creating database tables..."
if npx prisma db push; then
    print_success "Database schema created"
else
    print_error "Failed to create database schema"
    exit 1
fi

# Build the application
print_status "Building application..."
if npm run build; then
    print_success "Application built successfully"
else
    print_warning "Build failed, but you can still run in development mode"
fi

# Summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
print_success "Travo webapp is ready to use!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit the .env file with your configuration:"
echo "   - NEXTAUTH_SECRET (generate a random secret)"
echo "   - TWILIO_ACCOUNT_SID (from Twilio dashboard)"
echo "   - TWILIO_AUTH_TOKEN (from Twilio dashboard)"
echo "   - TWILIO_WHATSAPP_NUMBER (your Twilio WhatsApp number)"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - Webapp README: ./README.md"
echo "   - Main project: ../README.md"
echo "   - Twilio setup: https://console.twilio.com"
echo ""
echo "🔧 Available Commands:"
echo "   npm run dev      - Start development server"
echo "   npm run build    - Build for production"
echo "   npm run start    - Start production server"
echo "   npm run lint     - Run code linting"
echo ""
echo "💡 Pro Tips:"
echo "   - Use Twilio WhatsApp Sandbox for testing"
echo "   - Check browser console for any errors"
echo "   - Monitor Twilio logs for WhatsApp delivery"
echo ""

# Check for common issues
echo "🔍 System Check:"
if command -v docker &> /dev/null; then
    print_success "Docker is available for containerization"
else
    print_warning "Docker not found (optional for development)"
fi

if [ -f "../src/services/ArajetAlertService.ts" ]; then
    print_success "Main bot services detected - integration possible"
else
    print_warning "Main bot not found - flight monitoring will use mock data"
fi

echo ""
print_success "Setup completed successfully! Happy coding! 🚀"
