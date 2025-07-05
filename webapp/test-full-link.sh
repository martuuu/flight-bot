#!/bin/bash

echo "🔍 Verificando estado de vinculación de Telegram..."
echo ""

# Obtener estadísticas
echo "📊 Estadísticas de la base de datos:"
curl -s -X POST http://localhost:3000/api/reset-db \
  -H "Content-Type: application/json" \
  -d '{"action": "stats"}' | jq '.'

echo ""
echo "👥 Listando todos los usuarios para debug:"

# Crear endpoint temporal para listar usuarios sin autenticación
echo "Verificando usuarios..."

# Verificar si el usuario de Google está vinculado
echo ""
echo "🔗 Verificando vinculación para usuario: cmcp7g2kd000014ilxgjs9wri"
curl -s -X POST http://localhost:3000/api/debug/link-manual \
  -H "Content-Type: application/json" \
  -d '{
    "webappUserId": "cmcp7g2kd000014ilxgjs9wri",
    "telegramId": "TELEGRAM_USER_ID_PLACEHOLDER",
    "telegramUsername": "martinnavarro"
  }' | jq '.'

echo ""
echo "✅ Script de verificación completado"
