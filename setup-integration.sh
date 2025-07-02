#!/bin/bash

# Script de configuración completa para el sistema integrado webapp + bot

echo "🚀 Configurando sistema integrado Flight-Bot..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "webapp/package.json" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

# 1. Configurar webapp
echo "📦 Configurando webapp..."
cd webapp

# Instalar dependencias si no están instaladas
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependencias..."
    npm install
fi

# Generar Prisma client
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# Crear/actualizar base de datos
echo "🗄️ Configurando base de datos..."
npx prisma db push

# Setup de usuarios de prueba
echo "👥 Configurando usuarios de prueba..."
npm run test:clean

cd ..

echo ""
echo "✅ Configuración completada!"
echo ""
echo "🔧 Próximos pasos:"
echo ""
echo "1. Configurar Google OAuth:"
echo "   - Ve a https://console.cloud.google.com/"
echo "   - Crea credenciales OAuth 2.0"
echo "   - Agrega http://localhost:3000/api/auth/callback/google"
echo "   - Actualiza .env.local con GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET"
echo ""
echo "2. Configurar variables de entorno:"
echo "   cp webapp/.env.example webapp/.env.local"
echo "   # Editar webapp/.env.local con tus valores"
echo ""
echo "3. Iniciar webapp:"
echo "   cd webapp && npm run dev"
echo ""
echo "4. Iniciar bot (en otra terminal):"
echo "   npm run dev"
echo ""
echo "📧 Emails de prueba (Yopmail):"
echo "   • admin.flightbot@yopmail.com (SUPERADMIN)"
echo "   • premium.tester@yopmail.com (PREMIUM)"
echo "   • basic.user@yopmail.com (BASIC)"
echo "   • testing.account@yopmail.com (TESTING)"
echo ""
echo "🔗 URLs importantes:"
echo "   • Webapp: http://localhost:3000"
echo "   • Login: http://localhost:3000/auth/signin"
echo "   • Dashboard: http://localhost:3000/dashboard"
echo "   • Perfil: http://localhost:3000/profile"
echo "   • Bot: @ticketscannerbot_bot"
echo ""
echo "🧪 Testing:"
echo "   • Webapp DB: npm run test:show (en carpeta webapp)"
echo "   • Bot comandos: consulta scripts/telegram-live-testing-guide.md"
echo ""
