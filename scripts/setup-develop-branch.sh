#!/bin/bash

# Script para crear y configurar rama develop
# Uso: ./scripts/setup-develop-branch.sh

set -e

echo "🌿 Configurando rama develop para desarrollo futuro..."

# Verificar que estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    echo "   Ejecuta primero: ./scripts/git-initial-push.sh"
    exit 1
fi

# Verificar que estamos en main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "📍 Cambiando a rama main..."
    git checkout main
fi

# Crear rama develop
echo "🌱 Creando rama develop..."
git checkout -b develop

# Agregar mensaje de desarrollo en develop
echo "🔧 Agregando configuración para desarrollo..."

# Crear archivo de configuración para develop
cat > .env.development << 'EOF'
# Configuración para desarrollo
# Copia este archivo a .env y configura con tus valores reales

NODE_ENV=development
LOG_LEVEL=debug

# Bot de Telegram
TELEGRAM_BOT_TOKEN=tu_token_aqui
ADMIN_CHAT_ID=tu_chat_id

# Base de datos (desarrollo)
DATABASE_PATH=./data/flights-dev.db
DATABASE_BACKUP_PATH=./backups/

# Configuración de desarrollo
SCRAPING_INTERVAL_MINUTES=60
MAX_CONCURRENT_REQUESTS=3
REQUEST_TIMEOUT_MS=15000

# Rate limiting más permisivo para desarrollo
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20

# Logs más detallados
LOG_FILE_PATH=./logs/app-dev.log

# APIs (dejar vacío para usar mock data en desarrollo)
AVIANCA_API_KEY=
LATAM_API_KEY=
ARAJET_API_KEY=

# Alertas de desarrollo
MAX_ALERTS_PER_USER=50
ALERT_COOLDOWN_MINUTES=1
EOF

# Actualizar gitignore para archivos de desarrollo
cat >> .gitignore << 'EOF'

# Archivos de desarrollo
*-dev.db
*-dev.log
.env.development.local
.env.test.local
temp/
EOF

# Crear archivo README para develop
cat > DEVELOP.md << 'EOF'
# 🔧 Development Branch

Esta es la rama de desarrollo para el Flight Bot.

## 🚀 Configuración Rápida para Desarrollo

```bash
# Cambiar a rama develop
git checkout develop

# Configurar entorno de desarrollo
cp .env.development .env
# Editar .env con tus tokens reales

# Instalar dependencias
npm install

# Inicializar base de datos de desarrollo
npm run db:init

# Ejecutar en modo desarrollo
npm run dev
```

## 🛠️ Flujo de Desarrollo

### Para nuevas funcionalidades:
1. `git checkout develop`
2. `git pull origin develop`
3. `git checkout -b feature/nueva-funcionalidad`
4. Desarrollar funcionalidad
5. `git push origin feature/nueva-funcionalidad`
6. Crear Pull Request hacia `develop`

### Para releases:
1. Merge `develop` → `main`
2. Tag con versión
3. Deploy a producción

## 📊 Scripts de Desarrollo

```bash
# Desarrollo con hot reload
npm run dev

# Tests en modo watch
npm run test:watch

# Linting y formato
npm run lint:fix
npm run format

# Testing específico
npm run test-arajet
npm run demo-complete
```

## 🔍 Debugging

```bash
# Logs en tiempo real
tail -f logs/app-dev.log

# Verificar funcionamiento
npx tsx scripts/verify-bot-functionality.ts

# Limpiar base de datos de desarrollo
rm data/flights-dev.db && npm run db:init
```

## 📝 Notas de Desarrollo

- Use `flights-dev.db` para no afectar datos de producción
- `LOG_LEVEL=debug` para logs detallados
- Rate limiting más permisivo
- Intervalos de scraping más largos

---

**Happy coding! 🚀**
EOF

# Hacer commit de configuración de develop
git add .
git commit -m "🔧 Setup develop branch

✅ Configuración agregada:
- .env.development template
- DEVELOP.md con guías de desarrollo
- .gitignore actualizado para archivos de dev
- Configuración específica para desarrollo

🌿 Rama develop lista para nuevas funcionalidades"

# Push de develop
echo "⬆️  Haciendo push de rama develop..."
git push -u origin develop

echo ""
echo "🎉 ¡Rama develop configurada exitosamente!"
echo ""
echo "📋 Información de ramas:"
echo "   • main: MVP estable para producción"
echo "   • develop: Desarrollo de nuevas funcionalidades"
echo ""
echo "🔧 Para desarrollar:"
echo "   1. git checkout develop"
echo "   2. cp .env.development .env"
echo "   3. Configurar tokens en .env"
echo "   4. npm run dev"
echo ""
echo "🚀 ¡Happy coding!"
