#!/bin/bash

# 🚀 Script de Inicio Rápido - Flight Bot
# Este script te ayuda a configurar y probar el bot en minutos

echo "🛫 Configuración Rápida del Bot de Vuelos"
echo "========================================"

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado desde template"
else
    echo "📁 Archivo .env ya existe"
fi

# Verificar token de Telegram
TOKEN=$(grep "TELEGRAM_BOT_TOKEN=" .env | cut -d'=' -f2)
if [ "$TOKEN" = "your_telegram_bot_token_here" ] || [ -z "$TOKEN" ]; then
    echo ""
    echo "🤖 PASO 1: Configurar Token de Telegram"
    echo "----------------------------------------"
    echo "1. Ve a @BotFather en Telegram"
    echo "2. Envía /newbot"
    echo "3. Sigue las instrucciones"
    echo "4. Copia el token que te da"
    echo ""
    read -p "Pega tu token de Telegram aquí: " USER_TOKEN
    
    # Reemplazar token en .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/TELEGRAM_BOT_TOKEN=.*/TELEGRAM_BOT_TOKEN=$USER_TOKEN/" .env
    else
        # Linux
        sed -i "s/TELEGRAM_BOT_TOKEN=.*/TELEGRAM_BOT_TOKEN=$USER_TOKEN/" .env
    fi
    
    echo "✅ Token configurado en .env"
else
    echo "✅ Token de Telegram ya configurado"
fi

# Configurar Chat ID (opcional)
CHAT_ID=$(grep "ADMIN_CHAT_ID=" .env | cut -d'=' -f2)
if [ "$CHAT_ID" = "your_admin_chat_id" ] || [ -z "$CHAT_ID" ]; then
    echo ""
    echo "👤 PASO 2: Configurar Chat ID (Opcional)"
    echo "----------------------------------------"
    echo "Para recibir notificaciones de admin:"
    echo "1. Envía cualquier mensaje a tu bot"
    echo "2. Visita: https://api.telegram.org/bot$USER_TOKEN/getUpdates"
    echo "3. Busca tu 'chat':{'id': NÚMERO}"
    echo ""
    read -p "Chat ID (o Enter para omitir): " USER_CHAT_ID
    
    if [ ! -z "$USER_CHAT_ID" ]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/ADMIN_CHAT_ID=.*/ADMIN_CHAT_ID=$USER_CHAT_ID/" .env
        else
            sed -i "s/ADMIN_CHAT_ID=.*/ADMIN_CHAT_ID=$USER_CHAT_ID/" .env
        fi
        echo "✅ Chat ID configurado"
    else
        echo "⏭️ Chat ID omitido (puedes configurarlo después)"
    fi
fi

echo ""
echo "📦 PASO 3: Instalar Dependencias"
echo "--------------------------------"
npm install

echo ""
echo "🗄️ PASO 4: Inicializar Base de Datos"
echo "------------------------------------"
npm run db:init

echo ""
echo "🎉 ¡CONFIGURACIÓN COMPLETA!"
echo "=========================="
echo ""
echo "🚀 Para iniciar el bot:"
echo "   npm run dev"
echo ""
echo "📱 Para probar en Telegram:"
echo "   1. Busca tu bot: @tu_bot_username"
echo "   2. Envía: /start"
echo "   3. Prueba: /alert BOG MIA 800000"
echo ""
echo "📚 Comandos disponibles:"
echo "   /start     - Iniciar el bot"
echo "   /help      - Mostrar ayuda"
echo "   /alert     - Crear alerta de precio"
echo "   /myalerts  - Ver mis alertas"
echo "   /stop      - Pausar alerta"
echo "   /delete    - Eliminar alerta"
echo ""
echo "⚠️ NOTA: El bot usará datos simulados hasta que"
echo "   configures APIs reales de aerolíneas (opcional)"
echo ""
echo "📖 Más información:"
echo "   - TELEGRAM_SETUP.md"
echo "   - API_KEYS_GUIDE.md"
echo "   - DEPLOYMENT.md"
