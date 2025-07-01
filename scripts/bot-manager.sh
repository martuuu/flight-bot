#!/usr/bin/env bash

# Script para gestionar el Flight Bot de manera segura
# Evita múltiples instancias y problemas de duplicación

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_DIR="/Users/martinnavarro/Documents/flight-bot"

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}Flight Bot Manager - Gestor de instancias del bot${NC}"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo -e "  ${GREEN}start${NC}     - Iniciar el bot (detiene otras instancias primero)"
    echo -e "  ${GREEN}stop${NC}      - Detener todas las instancias del bot"
    echo -e "  ${GREEN}restart${NC}   - Reiniciar el bot"
    echo -e "  ${GREEN}status${NC}    - Mostrar estado de las instancias"
    echo -e "  ${GREEN}pm2${NC}       - Iniciar con PM2 para producción"
    echo -e "  ${GREEN}dev${NC}       - Iniciar en modo desarrollo"
    echo -e "  ${GREEN}logs${NC}      - Mostrar logs del bot"
    echo -e "  ${GREEN}help${NC}      - Mostrar esta ayuda"
}

# Función para detener todas las instancias
stop_all() {
    echo -e "${YELLOW}🛑 Deteniendo todas las instancias del bot...${NC}"
    
    # Detener PM2
    pm2 stop flight-bot 2>/dev/null || true
    
    # Detener procesos por nombre
    pkill -f "tsx.*start-bot" 2>/dev/null || true
    pkill -f "ts-node.*index" 2>/dev/null || true
    pkill -f "npm.*dev" 2>/dev/null || true
    
    # Esperar un momento
    sleep 2
    
    # Verificar si quedan procesos
    local remaining=$(ps aux | grep -E "(tsx|ts-node|flight)" | grep -v grep | wc -l)
    if [ $remaining -eq 0 ]; then
        echo -e "${GREEN}✅ Todas las instancias detenidas correctamente${NC}"
        return 0
    else
        echo -e "${RED}❌ Aún hay $remaining instancias corriendo${NC}"
        return 1
    fi
}

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}📊 Estado de las instancias del bot:${NC}"
    echo ""
    
    # Verificar PM2
    echo -e "${YELLOW}PM2 Status:${NC}"
    pm2 list | grep flight-bot || echo "No hay procesos PM2"
    echo ""
    
    # Verificar procesos del sistema
    echo -e "${YELLOW}Procesos del sistema:${NC}"
    local processes=$(ps aux | grep -E "(tsx|ts-node|flight)" | grep -v grep)
    if [ -z "$processes" ]; then
        echo "No hay procesos corriendo"
    else
        echo "$processes"
    fi
    echo ""
    
    # Contar instancias
    local count=$(ps aux | grep -E "(tsx|ts-node|flight)" | grep -v grep | wc -l)
    if [ $count -eq 0 ]; then
        echo -e "${GREEN}✅ No hay instancias corriendo${NC}"
    elif [ $count -eq 2 ]; then
        echo -e "${GREEN}✅ Una instancia normal corriendo (2 procesos padre/hijo)${NC}"
    else
        echo -e "${RED}⚠️  $count procesos detectados - posible duplicación${NC}"
    fi
}

# Función para iniciar en modo desarrollo
start_dev() {
    echo -e "${BLUE}🚀 Iniciando bot en modo desarrollo...${NC}"
    
    # Cambiar al directorio del proyecto
    cd "$PROJECT_DIR" || exit 1
    
    # Detener otras instancias primero
    stop_all
    
    # Iniciar en modo desarrollo
    echo -e "${GREEN}Iniciando npm run dev...${NC}"
    npm run dev
}

# Función para iniciar con PM2
start_pm2() {
    echo -e "${BLUE}🚀 Iniciando bot con PM2 (producción)...${NC}"
    
    # Cambiar al directorio del proyecto
    cd "$PROJECT_DIR" || exit 1
    
    # Detener otras instancias primero
    stop_all
    
    # Iniciar con PM2
    echo -e "${GREEN}Iniciando con PM2...${NC}"
    pm2 start scripts/start-bot.ts --name flight-bot --interpreter npx --interpreter-args "tsx"
    pm2 save
}

# Función para mostrar logs
show_logs() {
    echo -e "${BLUE}📋 Logs del bot:${NC}"
    
    # Intentar mostrar logs de PM2 primero
    if pm2 list | grep -q flight-bot; then
        echo -e "${YELLOW}Logs de PM2:${NC}"
        pm2 logs flight-bot --lines 50
    else
        echo -e "${YELLOW}No hay procesos PM2. Mostrando logs del sistema...${NC}"
        # Aquí podrías agregar logs del sistema si los tienes
        echo "No hay logs disponibles del sistema"
    fi
}

# Función principal
main() {
    case "${1:-help}" in
        "start")
            start_dev
            ;;
        "stop")
            stop_all
            ;;
        "restart")
            echo -e "${YELLOW}🔄 Reiniciando bot...${NC}"
            stop_all
            sleep 1
            start_dev
            ;;
        "status")
            show_status
            ;;
        "pm2")
            start_pm2
            ;;
        "dev")
            start_dev
            ;;
        "logs")
            show_logs
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Comando no reconocido: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal con argumentos
main "$@"
