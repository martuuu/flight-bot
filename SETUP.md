# 🛠️ SETUP - Instalación y Configuración

Guía completa para instalar y configurar el Flight Bot desde cero.

## 📋 Prerrequisitos

### 1. Software Requerido

**Node.js 18+**
```bash
# Verificar instalación
node --version  # Debe mostrar v18.0.0 o superior
npm --version   # Debe mostrar 8.0.0 o superior

# Instalar en macOS
brew install node

# Instalar en Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar en Windows
# Descargar desde: https://nodejs.org/
```

**Git** (para clonar el repositorio)
```bash
# Verificar instalación
git --version

# Instalar en macOS
brew install git

# Instalar en Ubuntu/Debian
sudo apt-get install git

# Instalar en Windows
# Descargar desde: https://git-scm.com/download/win
```

### 2. Bot de Telegram

1. **Abrir Telegram** y buscar `@BotFather`
2. **Enviar comando**: `/newbot`
3. **Seguir instrucciones**: 
   - Elegir nombre del bot
   - Elegir username (debe terminar en 'bot')
4. **Guardar el token**: Formato `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### 3. Obtener Chat ID (para notificaciones admin)

```bash
# Envía un mensaje a tu bot y luego ejecuta:
curl https://api.telegram.org/bot<TU_TOKEN>/getUpdates

# Busca "chat":{"id": TU_CHAT_ID en la respuesta
```

## 🚀 Instalación

### Opción 1: Configuración Automática (Recomendado)

```bash
# 1. Clonar repositorio
git clone https://github.com/martuuu/flight-bot.git
cd flight-bot

# 2. Ejecutar configuración automática
chmod +x scripts/setup.sh
./scripts/setup.sh
```

El script `setup.sh` hará automáticamente:
- ✅ Verificar prerrequisitos
- ✅ Instalar dependencias npm
- ✅ Configurar variables de entorno
- ✅ Inicializar base de datos
- ✅ Compilar proyecto
- ✅ Verificar funcionamiento

### Opción 2: Configuración Manual

```bash
# 1. Clonar repositorio
git clone https://github.com/martuuu/flight-bot.git
cd flight-bot

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
nano .env  # o cualquier editor de texto

# 4. Configurar .env con tus datos
TELEGRAM_BOT_TOKEN=tu_token_aqui
ADMIN_CHAT_ID=tu_chat_id

# 5. Inicializar base de datos
npm run db:init

# 6. Compilar proyecto
npm run build

# 7. Verificar funcionamiento
npm run test
```

## ⚙️ Configuración de Variables de Entorno

### Variables Obligatorias

```bash
# Bot de Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_CHAT_ID=123456789

# Base de datos (rutas por defecto)
DATABASE_PATH=./data/flights.db
DATABASE_BACKUP_PATH=./backups/
```

### Variables Opcionales

```bash
# Entorno
NODE_ENV=production

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# Monitoreo de precios
SCRAPING_INTERVAL_MINUTES=30
MAX_CONCURRENT_REQUESTS=5
REQUEST_TIMEOUT_MS=10000

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Alertas
MAX_ALERTS_PER_USER=20
ALERT_COOLDOWN_MINUTES=5

# APIs externas (dejar vacío para usar mock data)
AVIANCA_API_KEY=
LATAM_API_KEY=
ARAJET_API_KEY=
```

## 🗄️ Configuración de Base de Datos

### Inicialización

```bash
# Crear base de datos y tablas
npm run db:init

# Verificar que se creó correctamente
ls -la data/
# Deberías ver: flights.db
```

### Ubicaciones de Base de Datos

```bash
# Desarrollo
./data/flights.db

# Producción (recomendado)
/var/lib/flight-bot/flights.db

# Backups automáticos
./backups/flights_backup_YYYY-MM-DD.db
```

### Restaurar desde Backup

```bash
# Si necesitas restaurar
cp backups/flights_backup_2025-01-01.db data/flights.db
```

## 🚀 Ejecución

### Modo Desarrollo

```bash
# Ejecutar con hot reload
npm run dev

# Con logs detallados
LOG_LEVEL=debug npm run dev
```

### Modo Producción

#### Opción 1: PM2 (Recomendado para VPS)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Compilar proyecto
npm run build

# Iniciar con PM2
pm2 start ecosystem.config.js

# Ver estado
pm2 status

# Ver logs
pm2 logs flight-bot

# Reiniciar
pm2 restart flight-bot
```

#### Opción 2: Docker (Recomendado para contenedores)

```bash
# Construir imagen
docker build -t flight-bot .

# Ejecutar contenedor
docker run -d \
  --name flight-bot \
  --env-file .env \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  flight-bot

# Ver logs
docker logs -f flight-bot
```

#### Opción 3: Docker Compose (Más fácil)

```bash
# Ejecutar todo el stack
docker-compose up -d

# Ver logs
docker-compose logs -f flight-bot

# Detener
docker-compose down
```

#### Opción 4: Directamente con Node.js

```bash
# Compilar y ejecutar
npm run build
npm start

# O en una sola línea
npm run build && npm start
```

## 🎛️ Gestión del Bot

### Scripts de Gestión Incluidos

```bash
# Script principal de gestión
./scripts/bot-manager.sh status    # Ver estado del bot
./scripts/bot-manager.sh start     # Iniciar bot
./scripts/bot-manager.sh stop      # Detener bot
./scripts/bot-manager.sh restart   # Reiniciar bot
./scripts/bot-manager.sh logs      # Ver logs en tiempo real
./scripts/bot-manager.sh pm2       # Gestión con PM2
```

### Verificación del Sistema

```bash
# Verificar que todo funciona
npx tsx scripts/verify-bot-functionality.ts

# Probar comandos específicos
npx tsx scripts/test-alert-creation.ts

# Demo completo del sistema
npx tsx scripts/demo-complete-system.ts
```

## 📊 Monitoreo y Logs

### Ubicación de Logs

```bash
logs/
├── app.log           # Log principal
├── error.log         # Solo errores
├── pm2-out-0.log     # Salida estándar PM2
├── pm2-error-0.log   # Errores PM2
└── api-tests/        # Tests de APIs
```

### Ver Logs en Tiempo Real

```bash
# Logs de aplicación
tail -f logs/app.log

# Solo errores
tail -f logs/error.log

# Con PM2
pm2 logs flight-bot

# Con Docker
docker logs -f flight-bot
```

### Métricas del Sistema

```bash
# Ver estadísticas desde el bot
# Envía /stats a tu bot (solo admins)

# O ejecutar script
npx tsx scripts/show-stats.ts
```

## 🔧 Solución de Problemas Comunes

### Bot no inicia

```bash
# 1. Verificar token de Telegram
echo $TELEGRAM_BOT_TOKEN

# 2. Verificar conectividad
curl -X GET "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"

# 3. Verificar base de datos
ls -la data/flights.db

# 4. Reinicializar si es necesario
npm run db:init
```

### Bot no responde

```bash
# 1. Verificar que está ejecutándose
./scripts/bot-manager.sh status

# 2. Reiniciar
./scripts/bot-manager.sh restart

# 3. Ver logs para errores
./scripts/bot-manager.sh logs
```

### Mensajes duplicados

```bash
# Detener todas las instancias
./scripts/bot-manager.sh stop
pkill -f "flight-bot"

# Esperar 10 segundos y reiniciar
./scripts/bot-manager.sh start
```

### Base de datos corrupta

```bash
# Respaldar BD actual
cp data/flights.db data/flights.db.backup

# Reinicializar
npm run db:init

# Si tenías alertas importantes, contacta soporte
```

### Dependencias desactualizadas

```bash
# Actualizar dependencias
npm update

# Reinstalar desde cero si hay problemas
rm -rf node_modules package-lock.json
npm install
```

## 🔒 Configuración de Seguridad

### Permisos de Archivos

```bash
# Configurar permisos correctos
chmod 600 .env                    # Solo propietario puede leer
chmod 755 scripts/*.sh            # Scripts ejecutables
chmod 644 data/flights.db          # Base de datos legible
chmod 755 logs/                   # Directorio de logs
```

### Firewall (para VPS)

```bash
# Permitir solo SSH y HTTP/HTTPS
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# El bot no necesita puertos externos adicionales
```

### Variables Sensibles

```bash
# Nunca commitear .env al repositorio
echo ".env" >> .gitignore

# Usar variables de entorno del sistema en producción
export TELEGRAM_BOT_TOKEN="tu_token"
export ADMIN_CHAT_ID="tu_chat_id"
```

## 📈 Configuración de Producción

### Para VPS/Cloud

```bash
# 1. Crear usuario específico
sudo useradd -m -s /bin/bash flight-bot
sudo su - flight-bot

# 2. Clonar en directorio específico
git clone https://github.com/tu-usuario/flight-bot.git /opt/flight-bot
cd /opt/flight-bot

# 3. Configurar directorios del sistema
sudo mkdir -p /var/lib/flight-bot
sudo mkdir -p /var/log/flight-bot
sudo chown flight-bot:flight-bot /var/lib/flight-bot /var/log/flight-bot

# 4. Configurar variables para producción
export DATABASE_PATH=/var/lib/flight-bot/flights.db
export LOG_FILE_PATH=/var/log/flight-bot/app.log

# 5. Instalar y ejecutar
npm install --production
npm run build
pm2 start ecosystem.config.js
```

### Para Docker en Producción

```bash
# docker-compose.prod.yml
version: '3.8'
services:
  flight-bot:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - ADMIN_CHAT_ID=${ADMIN_CHAT_ID}
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./backups:/app/backups
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## ✅ Verificación Final

### Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] Bot de Telegram creado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Base de datos inicializada (`npm run db:init`)
- [ ] Proyecto compilado (`npm run build`)
- [ ] Tests pasando (`npm test`)
- [ ] Bot respondiendo en Telegram (`/start`)

### Comandos de Verificación

```bash
# Verificar instalación completa
./scripts/verify-installation.sh

# Test básico del bot
echo "Envía /start a tu bot en Telegram"

# Crear primera alerta de prueba
echo "Envía: /monthlyalert EZE PUJ 800"
```

## 📞 Soporte

Si tienes problemas durante la instalación:

1. **Revisa los logs**: `tail -f logs/app.log`
2. **Verifica prerrequisitos**: Node.js, tokens, permisos
3. **Ejecuta diagnósticos**: `./scripts/bot-manager.sh status`
4. **Consulta documentación**: [CONFIG.md](CONFIG.md) para detalles técnicos

---

**¡Una vez configurado, tu bot estará monitoreando vuelos 24/7! ✈️**
