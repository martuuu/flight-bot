#!/bin/bash

# Script para actualizar gradualmente el código del bot a Prisma
# Uso: chmod +x update-bot-to-prisma.sh && ./update-bot-to-prisma.sh

echo "🔄 Actualizando bot para usar Prisma..."

# Crear backup de los archivos originales
echo "📁 Creando backup de archivos originales..."
mkdir -p backups/sqlite-original/$(date +%Y%m%d_%H%M%S)
cp -r src/bot/handlers backups/sqlite-original/$(date +%Y%m%d_%H%M%S)/

echo "✅ Backup creado en backups/sqlite-original/"

# 1. Actualizar ArajetCommandHandler
echo "🔄 Actualizando ArajetCommandHandler..."

# 2. Verificar que las tablas de Prisma existen
echo "🔍 Verificando tablas de PostgreSQL..."
psql -d flight_alerts -c "\dt" | grep -E "(telegram_users|flight_alerts|flight_deals)"

if [ $? -eq 0 ]; then
    echo "✅ Tablas de PostgreSQL encontradas"
else
    echo "❌ Error: Tablas de PostgreSQL no encontradas. Ejecutar 'npx prisma db push' primero."
    exit 1
fi

echo "🎯 Script de actualización preparado. Revisar archivos manualmente."
echo "📚 Siguiente paso: Actualizar handlers uno por uno para ser async/await"
