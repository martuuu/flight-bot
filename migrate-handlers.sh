#!/bin/bash

# Script de migración para el nuevo sistema de handlers modulares

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BOT_DIR="/Users/martinnavarro/Documents/flight-bot/src/bot"

echo -e "${GREEN}🚀 Flight Bot - Migración de Handlers${NC}"
echo "=================================="

# Función para hacer backup
backup_original() {
    echo -e "${YELLOW}📦 Creando backup del CommandHandler original...${NC}"
    
    if [ -f "$BOT_DIR/CommandHandler.ts" ]; then
        cp "$BOT_DIR/CommandHandler.ts" "$BOT_DIR/CommandHandler.original.ts"
        echo -e "${GREEN}✅ Backup creado: CommandHandler.original.ts${NC}"
    else
        echo -e "${RED}❌ No se encontró CommandHandler.ts original${NC}"
        exit 1
    fi
}

# Función para aplicar el nuevo sistema
apply_new_system() {
    echo -e "${YELLOW}🔄 Aplicando nuevo sistema modular...${NC}"
    
    if [ -f "$BOT_DIR/CommandHandler.new.ts" ]; then
        mv "$BOT_DIR/CommandHandler.ts" "$BOT_DIR/CommandHandler.legacy.ts"
        mv "$BOT_DIR/CommandHandler.new.ts" "$BOT_DIR/CommandHandler.ts"
        echo -e "${GREEN}✅ Nuevo sistema aplicado${NC}"
        echo -e "${GREEN}📁 Archivo legacy disponible en: CommandHandler.legacy.ts${NC}"
    else
        echo -e "${RED}❌ No se encontró CommandHandler.new.ts${NC}"
        exit 1
    fi
}

# Función para revertir al sistema original
revert_to_original() {
    echo -e "${YELLOW}⏪ Revirtiendo al sistema original...${NC}"
    
    if [ -f "$BOT_DIR/CommandHandler.original.ts" ]; then
        mv "$BOT_DIR/CommandHandler.ts" "$BOT_DIR/CommandHandler.modular.ts"
        mv "$BOT_DIR/CommandHandler.original.ts" "$BOT_DIR/CommandHandler.ts"
        echo -e "${GREEN}✅ Sistema original restaurado${NC}"
        echo -e "${GREEN}📁 Sistema modular disponible en: CommandHandler.modular.ts${NC}"
    else
        echo -e "${RED}❌ No se encontró backup original${NC}"
        exit 1
    fi
}

# Función para verificar la estructura
check_structure() {
    echo -e "${YELLOW}🔍 Verificando estructura de archivos...${NC}"
    
    local missing_files=()
    
    # Verificar handlers
    [ ! -f "$BOT_DIR/handlers/BasicCommandHandler.ts" ] && missing_files+=("handlers/BasicCommandHandler.ts")
    [ ! -f "$BOT_DIR/handlers/AlertCommandHandler.ts" ] && missing_files+=("handlers/AlertCommandHandler.ts")
    [ ! -f "$BOT_DIR/handlers/CallbackHandler.ts" ] && missing_files+=("handlers/CallbackHandler.ts")
    
    # Verificar handlers de aerolíneas
    [ ! -f "$BOT_DIR/handlers/airlines/ArajetCommandHandler.ts" ] && missing_files+=("handlers/airlines/ArajetCommandHandler.ts")
    [ ! -f "$BOT_DIR/handlers/airlines/AerolineasCommandHandler.ts" ] && missing_files+=("handlers/airlines/AerolineasCommandHandler.ts")
    
    # Verificar utilidades
    [ ! -f "$BOT_DIR/utils/ValidationUtils.ts" ] && missing_files+=("utils/ValidationUtils.ts")
    [ ! -f "$BOT_DIR/utils/AirlineUtils.ts" ] && missing_files+=("utils/AirlineUtils.ts")
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ Todos los archivos están presentes${NC}"
        return 0
    else
        echo -e "${RED}❌ Archivos faltantes:${NC}"
        for file in "${missing_files[@]}"; do
            echo -e "${RED}  - $file${NC}"
        done
        return 1
    fi
}

# Función para mostrar estado actual
show_status() {
    echo -e "${YELLOW}📊 Estado actual del sistema:${NC}"
    echo "================================"
    
    if [ -f "$BOT_DIR/CommandHandler.ts" ]; then
        local line_count=$(wc -l < "$BOT_DIR/CommandHandler.ts")
        echo -e "📄 CommandHandler.ts: ${GREEN}$line_count líneas${NC}"
        
        if [ $line_count -gt 1000 ]; then
            echo -e "   ${YELLOW}⚠️  Sistema monolítico (>1000 líneas)${NC}"
        else
            echo -e "   ${GREEN}✅ Sistema modular${NC}"
        fi
    fi
    
    if [ -f "$BOT_DIR/CommandHandler.original.ts" ]; then
        echo -e "📦 Backup original: ${GREEN}Disponible${NC}"
    fi
    
    if [ -f "$BOT_DIR/CommandHandler.new.ts" ]; then
        echo -e "🆕 Sistema nuevo: ${GREEN}Disponible${NC}"
    fi
    
    echo ""
    check_structure
}

# Función para compilar y verificar
compile_check() {
    echo -e "${YELLOW}🔨 Verificando compilación...${NC}"
    
    cd "$(dirname "$BOT_DIR")"
    
    if npm run build --silent > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Compilación exitosa${NC}"
        return 0
    else
        echo -e "${RED}❌ Errores de compilación detectados${NC}"
        echo -e "${YELLOW}💡 Ejecuta 'npm run build' para ver los errores${NC}"
        return 1
    fi
}

# Función principal
main() {
    case "${1:-status}" in
        "migrate")
            echo -e "${GREEN}🚀 Iniciando migración al sistema modular...${NC}"
            backup_original
            apply_new_system
            if compile_check; then
                echo -e "${GREEN}🎉 ¡Migración completada exitosamente!${NC}"
            else
                echo -e "${RED}⚠️  Migración aplicada pero hay errores de compilación${NC}"
            fi
            ;;
        "revert")
            echo -e "${YELLOW}⏪ Revirtiendo al sistema original...${NC}"
            revert_to_original
            if compile_check; then
                echo -e "${GREEN}✅ Reversión completada${NC}"
            else
                echo -e "${RED}⚠️  Reversión aplicada pero hay errores de compilación${NC}"
            fi
            ;;
        "status")
            show_status
            ;;
        "check")
            if check_structure && compile_check; then
                echo -e "${GREEN}🎉 Todo está funcionando correctamente${NC}"
            else
                echo -e "${RED}❌ Se encontraron problemas${NC}"
                exit 1
            fi
            ;;
        "help")
            echo "Uso: $0 [comando]"
            echo ""
            echo "Comandos disponibles:"
            echo "  migrate  - Migrar al nuevo sistema modular"
            echo "  revert   - Revertir al sistema original"
            echo "  status   - Mostrar estado actual"
            echo "  check    - Verificar estructura y compilación"
            echo "  help     - Mostrar esta ayuda"
            ;;
        *)
            echo -e "${RED}❌ Comando desconocido: $1${NC}"
            echo "Usa '$0 help' para ver los comandos disponibles"
            exit 1
            ;;
    esac
}

# Verificar que estamos en el directorio correcto
if [ ! -d "$BOT_DIR" ]; then
    echo -e "${RED}❌ No se encontró el directorio del bot: $BOT_DIR${NC}"
    exit 1
fi

main "$@"
