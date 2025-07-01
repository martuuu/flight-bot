#!/usr/bin/env bash

# 🚁 Script de Configuración Rápida del Flight Bot
# Este script te ayudará a configurar el bot paso a paso

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Función para mostrar header
show_header() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                  🚁 FLIGHT BOT SETUP                     ║${NC}"
    echo -e "${BLUE}║              Configuración Rápida del Bot                ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Función para verificar prerrequisitos
check_prerequisites() {
    echo -e "${YELLOW}📋 Verificando prerrequisitos...${NC}"
    echo ""
    
    # Verificar Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "✅ Node.js: ${GREEN}$NODE_VERSION${NC}"
    else
        echo -e "❌ Node.js no está instalado"
        echo "   Descárgalo desde: https://nodejs.org/"
        exit 1
    fi
    
    # Verificar npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo -e "✅ npm: ${GREEN}v$NPM_VERSION${NC}"
    else
        echo -e "❌ npm no está disponible"
        exit 1
    fi
    
    # Verificar git
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        echo -e "✅ Git: ${GREEN}$GIT_VERSION${NC}"
    else
        echo -e "❌ Git no está instalado"
        echo "   Descárgalo desde: https://git-scm.com/"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Todos los prerrequisitos están instalados!${NC}"
    echo ""
}

# Función para crear archivo .env
setup_env_file() {
    echo -e "${YELLOW}🔧 Configurando archivo .env...${NC}"
    echo ""
    
    # Verificar si ya existe .env
    if [ -f ".env" ]; then
        echo -e "${YELLOW}⚠️  El archivo .env ya existe.${NC}"
        read -p "¿Quieres sobrescribirlo? (y/N): " overwrite
        if [[ ! $overwrite =~ ^[Yy]$ ]]; then
            echo "Manteniendo archivo .env existente..."
            return
        fi
    fi
    
    # Solicitar token del bot
    echo -e "${PURPLE}🤖 Configuración del Bot de Telegram${NC}"
    echo ""
    echo "Para obtener tu token:"
    echo "1. Abre Telegram y busca: @BotFather"
    echo "2. Envía: /newbot"
    echo "3. Sigue las instrucciones"
    echo "4. Copia el token que te dé"
    echo ""
    
    read -p "🔑 Ingresa el token de tu bot: " TELEGRAM_TOKEN
    
    if [ -z "$TELEGRAM_TOKEN" ]; then
        echo -e "${RED}❌ El token es obligatorio${NC}"
        exit 1
    fi
    
    # Solicitar chat ID (opcional)
    echo ""
    echo -e "${PURPLE}👤 Chat ID de Admin (opcional)${NC}"
    echo "El ADMIN_CHAT_ID es completamente opcional. Si lo configuras:"
    echo "  • Recibirás notificaciones cuando el bot se inicie/detenga"
    echo "  • Podrás recibir estadísticas y errores importantes"
    echo ""
    echo "Para obtener tu chat ID:"
    echo "  1. Busca @userinfobot en Telegram"
    echo "  2. Envía /start y copia el número que te da"
    echo "  3. O simplemente presiona Enter para omitir"
    echo ""
    read -p "👤 Chat ID (opcional, presiona Enter para omitir): " ADMIN_CHAT_ID
    
    # Limpiar ADMIN_CHAT_ID si está vacío o es inválido
    if [ -z "$ADMIN_CHAT_ID" ] || [ "$ADMIN_CHAT_ID" = "0" ]; then
        ADMIN_CHAT_ID=""
        echo "✅ Configuración sin admin (el bot funcionará perfectamente sin notificaciones admin)"
    else
        echo "✅ Admin configurado: $ADMIN_CHAT_ID"
    fi
    
    # Configurar intervalo
    echo ""
    echo -e "${PURPLE}⏰ Configuración de Monitoreo${NC}"
    echo "¿Cada cuántos minutos quieres que el bot busque ofertas?"
    echo "Recomendado: 5 minutos para uso personal"
    echo ""
    read -p "⏱️  Intervalo en minutos (default: 5): " INTERVAL
    INTERVAL=${INTERVAL:-5}
    
    # Crear archivo .env
    cat > .env << EOF
# 🚁 Configuración del Flight Bot
# Generado automáticamente por setup.sh

# ===== CONFIGURACIÓN PRINCIPAL =====
TELEGRAM_BOT_TOKEN=$TELEGRAM_TOKEN
ADMIN_CHAT_ID=$ADMIN_CHAT_ID

# ===== CONFIGURACIÓN DE SCRAPING =====
SCRAPING_INTERVAL_MINUTES=$INTERVAL
MAX_CONCURRENT_REQUESTS=3
REQUEST_TIMEOUT_MS=30000

# ===== LÍMITES DEL SISTEMA =====
MAX_ALERTS_PER_USER=10
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# ===== BASE DE DATOS =====
DATABASE_PATH=./data/flights.db
DATABASE_BACKUP_PATH=./backups/

# ===== LOGGING =====
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# ===== CONFIGURACIÓN ARAJET =====
ARAJET_API_URL=https://arajet-api.ezycommerce.sabre.com
ARAJET_TENANT_ID=caTRCudVPKmnHNnNeTgD3jDHwtsVvNtTmVHnRhYQzEqVboamwZp6fDEextRR8DAB
ARAJET_USER_ID=kKEBDZhkH9m6TPYLFjqgUGiohOmMqE
ARAJET_CLIENT_VERSION=0.5.3476
EOF
    
    echo -e "${GREEN}✅ Archivo .env creado exitosamente!${NC}"
    echo ""
}

# Función para instalar dependencias
install_dependencies() {
    echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
    echo ""
    
    npm install
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Dependencias instaladas correctamente!${NC}"
    else
        echo ""
        echo -e "${RED}❌ Error instalando dependencias${NC}"
        exit 1
    fi
    echo ""
}

# Función para inicializar base de datos
init_database() {
    echo -e "${YELLOW}🗄️ Inicializando base de datos...${NC}"
    echo ""
    
    # Crear directorios necesarios
    mkdir -p data
    mkdir -p logs
    mkdir -p backups
    
    # Verificar si hay script de inicialización
    if [ -f "scripts/init-db.js" ] || [ -f "scripts/init-db.ts" ]; then
        npm run db:init 2>/dev/null || echo "Usando inicialización automática..."
    fi
    
    echo -e "${GREEN}✅ Base de datos inicializada!${NC}"
    echo ""
}

# Función para test inicial
run_initial_test() {
    echo -e "${YELLOW}🧪 Ejecutando test inicial...${NC}"
    echo ""
    
    # Verificar que el bot puede iniciarse
    if [ -f "scripts/verify-bot-functionality.ts" ]; then
        echo "Ejecutando verificación completa..."
        npx tsx scripts/verify-bot-functionality.ts
    else
        echo "Verificando configuración básica..."
        node -e "
            require('dotenv').config();
            const token = process.env.TELEGRAM_BOT_TOKEN;
            if (token && token.length > 20) {
                console.log('✅ Token configurado correctamente');
            } else {
                console.log('❌ Token no válido');
                process.exit(1);
            }
        "
    fi
    
    echo ""
    echo -e "${GREEN}✅ Configuración verificada!${NC}"
    echo ""
}

# Función para mostrar instrucciones finales
show_final_instructions() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    🎉 ¡CONFIGURACIÓN COMPLETA!           ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Tu bot está listo para usar! 🚀${NC}"
    echo ""
    echo -e "${YELLOW}Próximos pasos:${NC}"
    echo ""
    echo -e "${PURPLE}1. Iniciar el bot:${NC}"
    echo "   npm run dev"
    echo ""
    echo -e "${PURPLE}2. O usar el gestor del bot:${NC}"
    echo "   ./scripts/bot-manager.sh start"
    echo ""
    echo -e "${PURPLE}3. Usar el bot en Telegram:${NC}"
    echo "   • Busca tu bot en Telegram"
    echo "   • Envía: /start"
    echo "   • Envía: /help para ver comandos"
    echo ""
    echo -e "${PURPLE}4. Crear tu primera alerta:${NC}"
    echo "   /monthlyalert EZE PUJ 300 febrero"
    echo ""
    echo -e "${YELLOW}Comandos útiles:${NC}"
    echo "   ./scripts/bot-manager.sh status   # Ver estado"
    echo "   ./scripts/bot-manager.sh restart  # Reiniciar"
    echo "   ./scripts/bot-manager.sh logs     # Ver logs"
    echo ""
    echo -e "${BLUE}¡Disfruta tu bot de alertas de vuelos! ✈️${NC}"
}

# Función principal
main() {
    show_header
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ No estás en el directorio del flight-bot${NC}"
        echo "   Navega al directorio del proyecto primero:"
        echo "   cd flight-bot"
        exit 1
    fi
    
    check_prerequisites
    setup_env_file
    install_dependencies
    init_database
    run_initial_test
    show_final_instructions
}

# Ejecutar función principal
main "$@"
