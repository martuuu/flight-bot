#!/bin/bash

echo "🔍 Verificando configuración de dominio flight-bot.com..."
echo ""

echo "📡 Verificando DNS Records:"
echo "Registro A (@):"
dig +short flight-bot.com A
echo ""

echo "Registro CNAME (www):"
dig +short www.flight-bot.com CNAME
echo ""

echo "🌐 Verificando resolución DNS:"
echo "flight-bot.com resuelve a:"
nslookup flight-bot.com
echo ""

echo "www.flight-bot.com resuelve a:"
nslookup www.flight-bot.com
echo ""

echo "🔄 Verificando propagación DNS mundial:"
echo "Usa este link para verificar: https://www.whatsmydns.net/#A/flight-bot.com"
echo ""

echo "📋 Checklist de configuración:"
echo "[ ] DNS A record: flight-bot.com → 76.76.19.61"
echo "[ ] DNS CNAME record: www.flight-bot.com → cname.vercel-dns.com"
echo "[ ] Vercel domain config: flight-bot.com → Connect to Production"
echo "[ ] Vercel domain config: www.flight-bot.com → Connect to Production"
echo "[ ] Variables de entorno configuradas en Vercel"
echo ""

echo "⚠️  Si hay errores:"
echo "1. Verifica que solo tengas UN registro A con IP 76.76.19.61"
echo "2. En Vercel, ambos dominios deben estar en 'Connect to environment → Production'"
echo "3. Espera hasta 24 horas para propagación DNS completa"
