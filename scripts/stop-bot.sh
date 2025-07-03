#!/bin/bash

# Script para detener todas las instancias del bot de forma segura
# Uso: ./scripts/stop-bot.sh [--force]

set -e

FORCE_MODE=false
if [ "$1" == "--force" ]; then
    FORCE_MODE=true
    echo "⚠️  Modo forzado activado"
fi

echo "🔍 Buscando procesos del bot..."

# Buscar procesos específicos del proyecto
PROCESSES=$(ps aux | grep -E "(flight-bot|ts-node.*index\.ts)" | grep -v grep | awk '{print $2}')

if [ -z "$PROCESSES" ]; then
    echo "✅ No se encontraron procesos del bot ejecutándose"
else
    echo "⚠️  Encontrados procesos del bot:"
    ps aux | grep -E "(flight-bot|ts-node.*index\.ts)" | grep -v grep
    
    echo "🛑 Deteniendo procesos..."
    for PID in $PROCESSES; do
        echo "  - Deteniendo proceso $PID"
        if $FORCE_MODE; then
            kill -9 $PID 2>/dev/null || true
        else
            kill -TERM $PID 2>/dev/null || true
            sleep 2
            # Verificar si el proceso aún existe
            if kill -0 $PID 2>/dev/null; then
                echo "    - Proceso $PID no respondió, forzando terminación"
                kill -9 $PID 2>/dev/null || true
            fi
        fi
    done
    
    echo "✅ Todos los procesos del bot han sido detenidos"
fi

# Manejar PM2 si existe
if command -v pm2 &> /dev/null; then
    echo "🔍 Verificando PM2..."
    if pm2 list 2>/dev/null | grep -q "flight-bot"; then
        pm2 stop flight-bot 2>/dev/null || true
        pm2 delete flight-bot 2>/dev/null || true
        echo "✅ Instancia de PM2 detenida"
    else
        echo "✅ No hay instancias de PM2 activas"
    fi
fi

echo "🎉 Listo! Ahora puedes ejecutar 'npm run dev' sin conflictos"
