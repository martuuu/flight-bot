#!/bin/bash

echo "🔐 Generando secrets para tu aplicación..."
echo ""

# Generar NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo ""

# Generar JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

echo "✅ Secrets generados!"
echo "📋 Copia estos valores exactamente como aparecen arriba"
echo "🔒 Mantenlos seguros y no los compartas públicamente"
echo ""
echo "📝 Agrega estos a:"
echo "1. Vercel → Settings → Environment Variables"
echo "2. Tu archivo .env.local (si trabajas localmente)"
