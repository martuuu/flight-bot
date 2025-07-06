#!/bin/bash

# Script para limpiar completamente el sistema y empezar desde cero
# Incluye reset de DB, cache de Next.js, node_modules, etc.

echo "🔥 SCRIPT DE LIMPIEZA COMPLETA DEL SISTEMA"
echo "=========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para confirmar
confirm() {
    read -p "⚠️  $1 (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

echo -e "${RED}¡ADVERTENCIA!${NC}"
echo "Este script va a:"
echo "🗑️  Resetear completamente la base de datos (ELIMINAR TODOS LOS DATOS)"
echo "🧹 Limpiar cache de Next.js"
echo "📦 Reinstalar dependencias"
echo "👑 Crear un usuario SUPERADMIN"
echo ""

if ! confirm "¿Estás seguro de que quieres continuar?"; then
    echo "❌ Operación cancelada"
    exit 1
fi

echo ""
echo -e "${YELLOW}🏁 Iniciando limpieza completa...${NC}"
echo ""

# 1. Limpiar cache de Next.js en webapp
echo "🧹 Limpiando cache de Next.js..."
cd /Users/martinnavarro/Documents/flight-bot/webapp
rm -rf .next
rm -rf node_modules/.cache
echo -e "${GREEN}✅ Cache de Next.js limpiado${NC}"

# 2. Limpiar builds y cache generales
echo "🧹 Limpiando builds y cache generales..."
rm -rf dist
rm -rf build
rm -rf .cache
echo -e "${GREEN}✅ Cache general limpiado${NC}"

# 3. Volver al directorio principal
cd /Users/martinnavarro/Documents/flight-bot

# 4. Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias principales..."
    npm install
fi

# 5. Verificar dependencias de webapp
cd webapp
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias de webapp..."
    npm install
fi

# 6. Generar cliente de Prisma
echo "🔄 Generando cliente de Prisma..."
npx prisma generate
echo -e "${GREEN}✅ Cliente de Prisma generado${NC}"

# Volver al directorio principal
cd ..

# 7. Resetear base de datos
echo ""
echo -e "${RED}🗑️  RESETEANDO BASE DE DATOS...${NC}"
if confirm "¿Confirmas que quieres ELIMINAR TODOS LOS DATOS de la base de datos?"; then
    echo "🔄 Ejecutando reset de base de datos..."
    npx tsx scripts/reset-database.ts
    echo -e "${GREEN}✅ Base de datos reseteada${NC}"
else
    echo "❌ Reset de base de datos cancelado"
    exit 1
fi

# 8. Crear usuario SUPERADMIN
echo ""
echo "👑 Configurando usuario SUPERADMIN..."
echo "📝 Ingresa los datos para el usuario SUPERADMIN:"

read -p "📧 Email (tu Gmail para OAuth): " admin_email
read -p "👤 Nombre (opcional): " admin_name

if [ -z "$admin_name" ]; then
    admin_name="Flight Bot Admin"
fi

echo "🔄 Creando usuario SUPERADMIN..."
npx tsx scripts/create-superadmin-simple.ts "$admin_email" "$admin_name"

echo ""
echo -e "${GREEN}🎉 LIMPIEZA COMPLETA TERMINADA!${NC}"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. 🌐 Ve a tu webapp (https://flight-bot.com)"
echo "2. 🔐 Haz clic en 'Sign in with Google'"
echo "3. 📧 Usa la cuenta: $admin_email"
echo "4. 👤 Ve a tu perfil/configuración"
echo "5. 🤖 Sigue el proceso de vinculación con Telegram"
echo "6. ✅ ¡Listo para usar!"
echo ""
echo -e "${YELLOW}💡 TIP: Guarda este email como tu cuenta principal de SUPERADMIN${NC}"
