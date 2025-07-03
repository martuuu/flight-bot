#!/bin/bash

# Flight Bot - Deployment Script
# This script prepares and deploys the flight-bot application to production

set -e  # Exit on any error

echo "🚀 Starting Flight Bot Deployment Process..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the flight-bot root directory"
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit or stash them first."
    echo "Uncommitted files:"
    git status --porcelain
    read -p "Continue anyway? (y/n): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm install

# Step 2: Build the bot
print_status "Building the bot..."
npm run build

# Step 3: Run tests
print_status "Running tests..."
npm test

# Step 4: Initialize database if needed
print_status "Checking database..."
if [ ! -f "data/flights.db" ]; then
    print_status "Initializing database..."
    npm run db:init
else
    print_status "Database already exists"
fi

# Step 5: Create production environment file
print_status "Creating production environment file..."
cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production
LOG_LEVEL=info

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw
TELEGRAM_BOT_USERNAME=ticketscannerbot_bot
ADMIN_CHAT_ID=123456789

# Database
DATABASE_PATH=./data/flights.db
DATABASE_BACKUP_PATH=./backups/

# Arajet API Configuration
ARAJET_API_URL=https://arajet-api.ezycommerce.sabre.com
ARAJET_TENANT_ID=your_tenant_id
ARAJET_USER_ID=your_user_id
ARAJET_CLIENT_VERSION=0.5.3476

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Monitoring
SCRAPING_INTERVAL_MINUTES=30
MAX_CONCURRENT_REQUESTS=5
REQUEST_TIMEOUT_MS=10000
RETRY_ATTEMPTS=3
RETRY_DELAY_MS=2000

# Logging
LOG_FILE_PATH=./logs/app.log

# Alertas
MAX_ALERTS_PER_USER=10
ALERT_COOLDOWN_MINUTES=60
PRICE_CHANGE_THRESHOLD=0.1

# Cache
CACHE_TTL_MINUTES=5

# Health Check
HEALTH_CHECK_INTERVAL_MINUTES=10
EOF

# Step 6: Commit changes
print_status "Committing changes..."
git add .
git commit -m "Production ready - $(date '+%Y-%m-%d %H:%M:%S')" || print_warning "No changes to commit"

# Step 7: Push to GitHub
print_status "Pushing to GitHub..."
git push origin main

# Step 8: Deploy webapp to Vercel
print_status "Deploying webapp to Vercel..."
cd webapp

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
vercel --prod

cd ..

print_status "Deployment completed successfully!"
echo "================================================="
echo "🎉 Flight Bot has been deployed!"
echo ""
echo "Next steps:"
echo "1. Verify webapp at https://flight-bot.com"
echo "2. Test Telegram bot functionality"
echo "3. Monitor logs for any issues"
echo "4. Configure domain DNS if needed"
echo ""
echo "Useful commands:"
echo "- Check bot status: npm run pm2:status"
echo "- View logs: npm run pm2:logs"
echo "- Restart bot: npm run pm2:restart"
echo ""
print_warning "Don't forget to configure your Gmail app password for email notifications!"
