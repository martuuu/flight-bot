#!/bin/bash

# Script para configurar variables de entorno en Vercel
# Ejecuta este script desde la carpeta webapp/

echo "🔧 Configurando variables de entorno en Vercel..."
echo "================================================="

# Variables críticas
echo "Configurando variables críticas..."
vercel env add NEXTAUTH_SECRET production <<< "c77f1458e3b587fb4a840ead1242ce87559ad21e713395baa05ad96c8084d1c3"
vercel env add NEXTAUTH_URL production <<< "https://flight-czlhsssry-martuuus-projects.vercel.app"
vercel env add JWT_SECRET production <<< "6652b18e4e19206525163b01c15a481f4ed685fa091ff65be77b68eda8eb8604"
vercel env add DATABASE_URL production <<< "file:./dev.db"

# Google OAuth
echo "Configurando Google OAuth..."
vercel env add GOOGLE_CLIENT_ID production <<< "1079216797376-q65td72utp8d9u12e7d9jm9t12slevgg.apps.googleusercontent.com"
vercel env add GOOGLE_CLIENT_SECRET production <<< "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"

# Telegram Bot
echo "Configurando Telegram Bot..."
vercel env add TELEGRAM_BOT_TOKEN production <<< "7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw"
vercel env add TELEGRAM_BOT_USERNAME production <<< "ticketscannerbot_bot"

# Email (opcional)
echo "Configurando email (opcional)..."
vercel env add SMTP_HOST production <<< "smtp.gmail.com"
vercel env add SMTP_PORT production <<< "587"
vercel env add SMTP_USER production <<< "martin.navarro.dev@gmail.com"
vercel env add ADMIN_EMAIL production <<< "martin.navarro.dev@gmail.com"

echo "✅ Variables de entorno configuradas!"
echo "🚀 Redesplegando para aplicar cambios..."
vercel --prod

echo "================================================="
echo "🎉 Configuración completada!"
echo ""
echo "URLs:"
echo "- Webapp: https://flight-czlhsssry-martuuus-projects.vercel.app"
echo "- Panel: https://vercel.com/martuuus-projects/flight-bot"
echo ""
echo "Próximos pasos:"
echo "1. Configurar contraseña de Gmail si deseas notificaciones por email"
echo "2. Iniciar el bot backend: npm run pm2:start"
echo "3. Probar el sistema completo"
