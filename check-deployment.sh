#!/bin/bash

echo "🔍 Verificando status del deployment..."
echo ""

echo "📡 Verificando que el dominio resuelva:"
curl -I https://flight-bot.com 2>/dev/null | head -n 1

echo ""
echo "🌐 Links para verificar:"
echo "• Vercel Dashboard: https://vercel.com/dashboard"
echo "• Tu webapp: https://flight-bot.com"
echo "• Status alternativo: https://www.flight-bot.com"
echo ""

echo "⏱️  El deployment puede tomar 2-5 minutos"
echo "🔄 Si ves errores 404/502, espera un poco más"
echo ""

echo "📋 Próximos pasos:"
echo "1. ✅ Verificar variables de entorno en Vercel"
echo "2. 🧪 Probar la webapp en https://flight-bot.com" 
echo "3. 🤖 Correr tu bot localmente para testing"
