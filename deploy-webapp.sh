#!/bin/bash

echo "🚀 Deploying Flight Bot Webapp to Vercel with Custom Domain..."

# Asegurarse de estar en el directorio correcto
cd "$(dirname "$0")"

# Verificar que estamos en el directorio correcto
if [ ! -d "webapp" ]; then
    echo "❌ Error: 'webapp' directory not found. Make sure you're in the project root."
    exit 1
fi

# Verificar que vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔧 Checking current git status..."
git status

echo "📝 Committing changes..."
git add .
git commit -m "feat: Update configuration for production deployment"

echo "🚀 Pushing to repository..."
git push origin main

# Deploy con Vercel
echo "🔧 Starting deployment..."
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your webapp should be available at:"
echo "   - https://flight-bot.com"
echo "   - https://www.flight-bot.com"
echo ""
echo "📝 Next steps:"
echo "1. ✅ Domain configured in Vercel"
echo "2. ✅ DNS records configured in Hostinger"
echo "3. 🔄 Wait for DNS propagation (up to 24 hours)"
echo "4. 🔑 Configure environment variables in Vercel dashboard"
echo "5. 🤖 Deploy your bot to a cloud service"
echo ""
echo "📋 To check domain status:"
echo "   - https://vercel.com/dashboard"
echo "   - https://www.whatsmydns.net/#A/flight-bot.com"
