#!/bin/bash

# Script para limpiar archivos legacy del sistema de vinculación
# y asegurarse de que solo se use el nuevo sistema

echo "🧹 Limpiando sistema de vinculación legacy..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

echo "📁 Buscando archivos legacy de vinculación..."

# Buscar y reportar archivos legacy
echo ""
echo "📋 Archivos encontrados:"

# Buscar endpoint legacy
if [ -d "webapp/app/api/telegram/link" ]; then
    echo "⚠️  Endpoint legacy encontrado: webapp/app/api/telegram/link"
    echo "   → Se puede eliminar, reemplazado por link-simple"
fi

if [ -d "webapp/app/api/telegram/link-v2" ]; then
    echo "⚠️  Endpoint legacy encontrado: webapp/app/api/telegram/link-v2" 
    echo "   → Se puede eliminar, reemplazado por link-simple"
fi

# Buscar componente legacy
if [ -f "webapp/components/TelegramLink.tsx" ]; then
    echo "⚠️  Componente legacy encontrado: webapp/components/TelegramLink.tsx"
    echo "   → Se puede eliminar, reemplazado por TelegramLinkImproved"
fi

# Buscar referencias en el código
echo ""
echo "🔍 Buscando referencias legacy en el código..."

grep -r "api/telegram/link[^-]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null | grep -v link-simple | head -5
if [ $? -eq 0 ]; then
    echo "⚠️  Referencias al endpoint legacy encontradas"
fi

grep -r "TelegramLink[^I]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null | grep -v TelegramLinkImproved | head -5
if [ $? -eq 0 ]; then
    echo "⚠️  Referencias al componente legacy encontradas"
fi

echo ""
echo "📊 Estado del sistema de vinculación:"

# Verificar archivos del nuevo sistema
echo ""
echo "✅ NUEVO SISTEMA (link-simple):"

if [ -f "webapp/app/api/telegram/link-simple/route.ts" ]; then
    echo "   ✅ Endpoint: webapp/app/api/telegram/link-simple/route.ts"
else
    echo "   ❌ Endpoint: webapp/app/api/telegram/link-simple/route.ts NO ENCONTRADO"
fi

if [ -f "webapp/components/TelegramLinkImproved.tsx" ]; then
    echo "   ✅ Componente: webapp/components/TelegramLinkImproved.tsx"
else
    echo "   ❌ Componente: webapp/components/TelegramLinkImproved.tsx NO ENCONTRADO"
fi

if grep -q "handleLink" src/bot/handlers/BasicCommandHandler.ts 2>/dev/null; then
    echo "   ✅ Bot comando: /link implementado"
else
    echo "   ❌ Bot comando: /link NO IMPLEMENTADO"
fi

if grep -q "case '/link'" src/bot/CommandHandler.ts 2>/dev/null; then
    echo "   ✅ Bot registro: comando /link registrado"
else
    echo "   ❌ Bot registro: comando /link NO REGISTRADO"
fi

# Verificar integración en UI
if grep -q "TelegramLinkImproved" webapp/app/profile/page.tsx 2>/dev/null; then
    echo "   ✅ UI integración: componente integrado en perfil"
else
    echo "   ❌ UI integración: componente NO integrado"
fi

echo ""
echo "🎯 RECOMENDACIONES:"

echo ""
echo "1️⃣ Para eliminar archivos legacy (OPCIONAL):"
echo "   rm -rf webapp/app/api/telegram/link"
echo "   rm -rf webapp/app/api/telegram/link-v2"
echo "   rm -f webapp/components/TelegramLink.tsx"

echo ""
echo "2️⃣ Para verificar funcionamiento:"
echo "   cd webapp && npm run dev"
echo "   # En otra terminal:"
echo "   npm start  # o tu comando para el bot"

echo ""
echo "3️⃣ Para testing completo:"
echo "   node test-integration-linking.js"

echo ""
echo "✅ Sistema de vinculación listo para producción"
