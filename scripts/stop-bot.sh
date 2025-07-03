#!/bin/bash

# Script para detener todas las instancias del bot

echo "🔍 Buscando procesos del bot..."

# Buscar procesos de node que contengan 'flight-bot' o 'ts-node-dev'
PROCESSES=$(ps aux | grep -E "(flight-bot|ts-node-dev)" | grep -v grep | awk '{print $2}')

if [ -z "$PROCESSES" ]; then
    echo "✅ No se encontraron procesos del bot ejecutándose"
else
    echo "⚠️  Encontrados procesos del bot:"
    ps aux | grep -E "(flight-bot|ts-node-dev)" | grep -v grep
    
    echo "🛑 Deteniendo procesos..."
    for PID in $PROCESSES; do
        echo "  - Deteniendo proceso $PID"
        kill -9 $PID 2>/dev/null
    done
    
    echo "✅ Todos los procesos del bot han sido detenidos"
fi

# También detener procesos de PM2 si existen
if command -v pm2 &> /dev/null; then
    echo "🔍 Verificando PM2..."
    pm2 stop all 2>/dev/null
    pm2 delete all 2>/dev/null
    echo "✅ PM2 limpiado"
fi

echo "🎉 Listo! Ahora puedes ejecutar 'npm run dev' sin conflictos"
