#!/bin/bash

# 🔥 SCRIPT DEFINITIVO DE RESET COMPLETO DEL SISTEMA
# ====================================================
# Este script hace un reset TOTAL del sistema incluyendo:
# - Para las instancias del bot (PM2)
# - Resetea completamente la base de datos PostgreSQL
# - Limpia cache de Next.js y builds
# - Desvincula todos los usuarios de Telegram
# - Deja el sistema limpio para empezar desde cero

echo "🔥 ULTIMATE RESET - LIMPIEZA TOTAL DEL SISTEMA"
echo "=============================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Función para verificar si PM2 está instalado
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}⚠️  PM2 no está instalado. Instalando...${NC}"
        npm install -g pm2
    fi
}

echo -e "${RED}¡PELIGRO MÁXIMO!${NC}"
echo "Este script va a hacer un RESET TOTAL:"
echo ""
echo -e "${RED}🤖 PARAR todas las instancias del bot de Telegram${NC}"
echo -e "${RED}🗑️  ELIMINAR TODOS LOS DATOS de PostgreSQL${NC}"
echo -e "${RED}👤 DESVINCULAR todos los usuarios de Telegram${NC}"
echo -e "${RED}🧹 LIMPIAR cache de Next.js, builds, logs${NC}"
echo -e "${RED}📦 REINSTALAR dependencias si es necesario${NC}"
echo -e "${RED}🔄 REGENERAR cliente de Prisma${NC}"
echo ""
echo -e "${YELLOW}⚡ Esto es IRREVERSIBLE y eliminará TODOS los datos${NC}"
echo ""

if ! confirm "¿Estás ABSOLUTAMENTE seguro de que quieres hacer el RESET TOTAL?"; then
    echo "❌ Operación cancelada por el usuario"
    exit 1
fi

if ! confirm "¿Confirmas que entiendes que se perderán TODOS los datos?"; then
    echo "❌ Operación cancelada por seguridad"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Iniciando ULTIMATE RESET...${NC}"
echo ""

# Verificar PM2
check_pm2

# 1. PARAR Y ELIMINAR INSTANCIAS DEL BOT
echo -e "${YELLOW}🤖 FASE 1: Parando instancias del bot...${NC}"
echo "🔄 Verificando instancias de PM2..."

# Mostrar estado actual
pm2 status 2>/dev/null || echo "No hay procesos PM2 activos"

# Parar y eliminar flight-bot si existe
if pm2 describe flight-bot &>/dev/null; then
    echo "🛑 Parando flight-bot..."
    pm2 stop flight-bot
    echo "🗑️  Eliminando flight-bot..."
    pm2 delete flight-bot
    echo -e "${GREEN}✅ Bot parado y eliminado${NC}"
else
    echo -e "${YELLOW}ℹ️  No hay instancia flight-bot ejecutándose${NC}"
fi

# Parar todos los procesos PM2 relacionados
echo "🧹 Limpiando todos los procesos PM2..."
pm2 kill 2>/dev/null || echo "No hay procesos PM2 para limpiar"

echo -e "${GREEN}✅ FASE 1 COMPLETADA: Bot completamente parado${NC}"
echo ""

# 2. LIMPIAR CACHE Y BUILDS
echo -e "${YELLOW}🧹 FASE 2: Limpiando cache y builds...${NC}"

# Ir al directorio principal
cd /Users/martinnavarro/Documents/flight-bot

# Limpiar cache de Next.js en webapp
echo "🧹 Limpiando cache de Next.js..."
cd webapp
rm -rf .next
rm -rf node_modules/.cache
rm -rf .next/cache
echo -e "${GREEN}✅ Cache de Next.js limpiado${NC}"

# Volver al directorio principal
cd ..

# Limpiar builds y cache generales
echo "🧹 Limpiando builds generales..."
rm -rf dist
rm -rf build
rm -rf .cache
rm -rf tmp
echo -e "${GREEN}✅ Builds limpiados${NC}"

# Limpiar logs
echo "🧹 Limpiando logs..."
rm -rf logs/*.log
rm -rf logs/api-tests/*.log
echo -e "${GREEN}✅ Logs limpiados${NC}"

echo -e "${GREEN}✅ FASE 2 COMPLETADA: Cache y builds limpiados${NC}"
echo ""

# 3. VERIFICAR E INSTALAR DEPENDENCIAS
echo -e "${YELLOW}📦 FASE 3: Verificando dependencias...${NC}"

# Dependencias principales
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "📦 Instalando dependencias principales..."
    npm install
    echo -e "${GREEN}✅ Dependencias principales instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependencias principales OK${NC}"
fi

# Dependencias de webapp
cd webapp
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "📦 Instalando dependencias de webapp..."
    npm install
    echo -e "${GREEN}✅ Dependencias de webapp instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependencias de webapp OK${NC}"
fi

# Volver al directorio principal
cd ..

# Generar cliente de Prisma
echo "🔄 Regenerando cliente de Prisma..."
npx prisma generate
echo -e "${GREEN}✅ Cliente de Prisma regenerado${NC}"

echo -e "${GREEN}✅ FASE 3 COMPLETADA: Dependencias verificadas${NC}"
echo ""

# 4. RESET COMPLETO DE BASE DE DATOS
echo -e "${RED}🗑️  FASE 4: RESET TOTAL DE BASE DE DATOS...${NC}"
echo ""
echo -e "${RED}¡ÚLTIMA OPORTUNIDAD!${NC}"
echo "Esto eliminará:"
echo "- 👤 Todos los usuarios"
echo "- 🔗 Todas las vinculaciones de Telegram"
echo "- 🚨 Todas las alertas"
echo "- 📊 Todo el historial"
echo "- 🔑 Todas las sesiones"
echo ""

if ! confirm "¿CONFIRMAS que quieres ELIMINAR TODOS LOS DATOS de PostgreSQL?"; then
    echo "❌ Reset de base de datos cancelado"
    echo "🔄 Las otras limpiezas se completaron, pero la DB no se modificó"
    exit 1
fi

echo ""
echo -e "${RED}🔥 EJECUTANDO RESET TOTAL DE BASE DE DATOS...${NC}"
npx tsx scripts/reset-database.ts

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ FASE 4 COMPLETADA: Base de datos completamente reseteada${NC}"
else
    echo -e "${RED}❌ ERROR en el reset de base de datos${NC}"
    exit 1
fi

echo ""

# 5. CONFIGURACIÓN POST-RESET
echo -e "${YELLOW}👑 FASE 5: Configuración post-reset...${NC}"

echo "📝 ¿Quieres crear un usuario SUPERADMIN ahora?"
if confirm "¿Crear usuario SUPERADMIN?"; then
    echo ""
    read -p "📧 Email para SUPERADMIN (tu Gmail para OAuth): " admin_email
    read -p "👤 Nombre (opcional): " admin_name
    
    if [ -z "$admin_name" ]; then
        admin_name="Flight Bot Admin"
    fi
    
    echo "🔄 Creando usuario SUPERADMIN..."
    npx tsx scripts/create-superadmin-simple.ts "$admin_email" "$admin_name"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Usuario SUPERADMIN creado${NC}"
        ADMIN_CREATED=true
        ADMIN_EMAIL="$admin_email"
    else
        echo -e "${YELLOW}⚠️  Error creando SUPERADMIN (puedes hacerlo después)${NC}"
        ADMIN_CREATED=false
    fi
else
    echo -e "${YELLOW}ℹ️  SUPERADMIN no creado (puedes hacerlo después)${NC}"
    ADMIN_CREATED=false
fi

echo -e "${GREEN}✅ FASE 5 COMPLETADA: Configuración post-reset${NC}"
echo ""

# 6. RESUMEN FINAL
echo ""
echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
echo -e "${GREEN}✅ ULTIMATE RESET COMPLETADO EXITOSAMENTE${NC}"
echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
echo ""

echo -e "${BLUE}📋 RESUMEN DE LO QUE SE HIZO:${NC}"
echo "✅ Bot de Telegram parado y eliminado de PM2"
echo "✅ Cache de Next.js limpiado completamente"
echo "✅ Builds y logs eliminados"
echo "✅ Cliente de Prisma regenerado"
echo "✅ Base de datos PostgreSQL completamente reseteada"
echo "✅ Todos los usuarios y vinculaciones de Telegram eliminados"

if [ "$ADMIN_CREATED" = true ]; then
    echo "✅ Usuario SUPERADMIN creado: $ADMIN_EMAIL"
fi

echo ""
echo -e "${YELLOW}📋 COMANDOS ÚTILES PARA DESPUÉS:${NC}"
echo ""
echo -e "${BLUE}🤖 Para iniciar el bot:${NC}"
echo "   pm2 start ecosystem.config.json"
echo ""
echo -e "${BLUE}🔍 Para ver estado del bot:${NC}"
echo "   pm2 status"
echo "   pm2 logs flight-bot"
echo ""
echo -e "${BLUE}🛑 Para parar el bot:${NC}"
echo "   pm2 stop flight-bot"
echo ""
echo -e "${BLUE}🌐 Para desarrollo de webapp:${NC}"
echo "   cd webapp && npm run dev"
echo ""

if [ "$ADMIN_CREATED" = true ]; then
    echo -e "${GREEN}📋 PRÓXIMOS PASOS RECOMENDADOS:${NC}"
    echo "1. 🤖 Iniciar el bot: pm2 start ecosystem.config.json"
    echo "2. 🌐 Ir a tu webapp y hacer login con: $ADMIN_EMAIL"
    echo "3. 🔗 Vincular tu cuenta con Telegram desde el bot"
    echo "4. ✅ ¡Listo para usar!"
else
    echo -e "${YELLOW}📋 PRÓXIMOS PASOS:${NC}"
    echo "1. 🤖 Iniciar el bot: pm2 start ecosystem.config.json"
    echo "2. 👑 Crear SUPERADMIN: npx tsx scripts/create-superadmin-simple.ts"
    echo "3. 🌐 Configurar webapp y vinculación"
fi

echo ""
echo -e "${GREEN}🚀 ¡El sistema está completamente limpio y listo!${NC}"
echo ""
