#!/bin/bash

# Script para hacer el push inicial del MVP a GitHub
# Uso: ./scripts/git-initial-push.sh

set -e

echo "🚀 Preparando push inicial del MVP Flight Bot..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que tenemos Git
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git no está instalado"
    exit 1
fi

# Inicializar Git si no existe
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositorio Git..."
    git init
fi

# Configurar remote origin
echo "🔗 Configurando remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/martuuu/flight-bot.git

# Verificar que .gitignore existe
if [ ! -f ".gitignore" ]; then
    echo "❌ Error: .gitignore no existe"
    exit 1
fi

# Verificar que .env no se va a subir
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo "⚠️  Advertencia: .env está siendo trackeado por Git"
    echo "   Ejecutando: git rm --cached .env"
    git rm --cached .env
fi

# Verificar que directorios sensibles no se van a subir
for dir in "data" "logs" "backups" "node_modules"; do
    if [ -d "$dir" ] && git ls-files --error-unmatch "$dir" 2>/dev/null; then
        echo "⚠️  Advertencia: $dir está siendo trackeado por Git"
        echo "   Ejecutando: git rm -r --cached $dir"
        git rm -r --cached "$dir"
    fi
done

# Agregar todos los archivos
echo "📝 Agregando archivos al staging..."
git add .

# Verificar el estado
echo "📊 Estado actual del repositorio:"
git status

# Confirmar con el usuario
echo ""
echo "¿Confirmas que quieres hacer el commit inicial del MVP? (y/n)"
read -r confirmation

if [ "$confirmation" != "y" ] && [ "$confirmation" != "Y" ]; then
    echo "❌ Operación cancelada"
    exit 1
fi

# Crear commit inicial
echo "💾 Creando commit inicial..."
git commit -m "🎉 Initial commit - Flight Bot MVP

✅ Funcionalidades completadas:
- Bot de Telegram completamente funcional
- Sistema de alertas mensuales con API real de Arajet  
- Base de datos SQLite optimizada
- Monitoreo automático 24/7
- Scripts de gestión y configuración
- Documentación completa organizada

🚀 Estado: MVP listo para producción

📚 Documentación:
- README.md: Descripción general
- SETUP.md: Instalación paso a paso  
- CONFIG.md: Documentación técnica
- TUTORIAL.md: Guía para usuarios

🛠️ Tecnologías:
- Node.js + TypeScript
- SQLite + better-sqlite3
- node-telegram-bot-api
- Docker + PM2
- Jest + ESLint + Prettier"

# Configurar rama principal
echo "🌿 Configurando rama main..."
git branch -M main

# Hacer push
echo "⬆️  Haciendo push a GitHub..."
git push -u origin main

echo ""
echo "🎉 ¡Push inicial completado exitosamente!"
echo ""
echo "📋 Próximos pasos recomendados:"
echo "   1. Verificar el repositorio en: https://github.com/martuuu/flight-bot"
echo "   2. Crear rama develop para futuros cambios:"
echo "      git checkout -b develop"
echo "      git push -u origin develop"
echo ""
echo "🚀 Tu MVP está ahora disponible en GitHub!"
