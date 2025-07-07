#!/bin/bash

# 🤖 SCRIPT PARA MANEJAR EL BOT DE TELEGRAM
# =========================================
# Comandos simples para manejar PM2 del bot

echo "🤖 GESTOR DEL BOT DE TELEGRAM"
echo "============================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 no está instalado${NC}"
    echo "Instálalo con: npm install -g pm2"
    exit 1
fi

cd /Users/martinnavarro/Documents/flight-bot

case "$1" in
    "start"|"iniciar")
        echo -e "${BLUE}🚀 Iniciando el bot...${NC}"
        pm2 start ecosystem.config.json
        echo ""
        pm2 status
        ;;
    
    "stop"|"parar")
        echo -e "${YELLOW}🛑 Parando el bot...${NC}"
        pm2 stop flight-bot
        echo ""
        pm2 status
        ;;
    
    "restart"|"reiniciar")
        echo -e "${YELLOW}🔄 Reiniciando el bot...${NC}"
        pm2 restart flight-bot
        echo ""
        pm2 status
        ;;
    
    "status"|"estado")
        echo -e "${BLUE}📊 Estado del bot:${NC}"
        pm2 status
        ;;
    
    "logs"|"log")
        echo -e "${BLUE}📜 Logs del bot:${NC}"
        pm2 logs flight-bot --lines 50
        ;;
    
    "kill"|"eliminar")
        echo -e "${RED}💀 Eliminando todas las instancias...${NC}"
        pm2 kill
        ;;
    
    "monitor"|"monitorear")
        echo -e "${BLUE}📊 Abriendo monitor de PM2...${NC}"
        pm2 monit
        ;;
    
    *)
        echo -e "${GREEN}🤖 Comandos disponibles:${NC}"
        echo ""
        echo "   $0 start      - Iniciar el bot"
        echo "   $0 stop       - Parar el bot"
        echo "   $0 restart    - Reiniciar el bot"
        echo "   $0 status     - Ver estado del bot"
        echo "   $0 logs       - Ver logs del bot"
        echo "   $0 kill       - Eliminar todas las instancias"
        echo "   $0 monitor    - Abrir monitor visual"
        echo ""
        echo -e "${YELLOW}💡 Ejemplos:${NC}"
        echo "   ./scripts/bot-manager.sh start"
        echo "   ./scripts/bot-manager.sh logs"
        echo "   ./scripts/bot-manager.sh status"
        ;;
esac
