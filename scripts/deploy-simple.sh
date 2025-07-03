#!/bin/bash

# Flight Bot - Simplified Deployment Script
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

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm install

# Step 2: Build the bot
print_status "Building the bot..."
npm run build

# Step 3: Check database
print_status "Checking database..."
if [ ! -f "data/flights.db" ]; then
    print_status "Initializing database..."
    npm run db:init
else
    print_status "Database already exists"
fi

# Step 4: Create necessary directories
print_status "Creating necessary directories..."
mkdir -p data
mkdir -p logs
mkdir -p backups

# Step 5: Commit and push changes
print_status "Committing and pushing changes..."
git add .
git commit -m "Production deployment - $(date '+%Y-%m-%d %H:%M:%S')" || print_warning "No changes to commit"
git push origin main || print_warning "Could not push to GitHub"

# Step 6: Deploy webapp to Vercel
print_status "Deploying webapp to Vercel..."
cd webapp

# Install webapp dependencies
print_status "Installing webapp dependencies..."
npm install

# Build webapp
print_status "Building webapp..."
npm run build

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

cd ..

print_status "Deployment completed successfully!"
echo "================================================="
echo "🎉 Flight Bot has been deployed!"
echo ""
echo "Next steps:"
echo "1. Verify webapp at https://flight-bot.com"
echo "2. Configure environment variables in Vercel Dashboard:"
echo "   - NEXTAUTH_SECRET=c77f1458e3b587fb4a840ead1242ce87559ad21e713395baa05ad96c8084d1c3"
echo "   - NEXTAUTH_URL=https://flight-bot.com"
echo "   - JWT_SECRET=6652b18e4e19206525163b01c15a481f4ed685fa091ff65be77b68eda8eb8604"
echo "   - DATABASE_URL=file:./dev.db"
echo "   - GOOGLE_CLIENT_ID=1079216797376-q65td72utp8d9u12e7d9jm9t12slevgg.apps.googleusercontent.com"
echo "   - GOOGLE_CLIENT_SECRET=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"
echo "   - TELEGRAM_BOT_TOKEN=7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw"
echo "   - TELEGRAM_BOT_USERNAME=ticketscannerbot_bot"
echo "3. Test Telegram bot functionality"
echo "4. Configure Gmail SMTP (optional): ./scripts/setup-gmail.sh"
echo ""
echo "Bot Management Commands:"
echo "- Start bot: npm run start"
echo "- Start with PM2: npm run pm2:start"
echo "- Check PM2 status: npm run pm2:status"
echo "- View logs: npm run pm2:logs"
echo "- Restart bot: npm run pm2:restart"
echo ""
print_warning "Remember to fix the test suite later!"
