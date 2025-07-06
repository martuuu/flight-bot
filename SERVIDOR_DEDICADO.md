# 🖥️ Configuración del Servidor Dedicado para Flight Bot

## Resumen

El Flight Bot requiere un servidor dedicado para funcionar 24/7, ya que necesita:
- Monitoreo continuo de precios
- Conexión persistente con APIs de aerolíneas
- Procesamiento de alertas en tiempo real
- Polling continuo de mensajes de Telegram

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Webapp        │    │   Bot Server    │    │   Database      │
│   (Netlify)     │◄──►│   (Dedicated)   │◄──►│   (Neon)        │
│                 │    │                 │    │                 │
│ • Frontend      │    │ • Telegram Bot  │    │ • PostgreSQL    │
│ • Auth (Google) │    │ • Price Monitor │    │ • Shared Data   │
│ • User Mgmt     │    │ • Alert Engine  │    │ • User Sync     │
│ • API Endpoints │    │ • Cron Jobs     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Instalación

### 1. Preparar Servidor (Ubuntu/Debian)

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar dependencias adicionales
sudo apt-get install -y git build-essential python3

# Verificar instalación
node --version  # debe ser v18+
npm --version
```

### 2. Clonar y Configurar Repositorio

```bash
# Clonar repositorio
git clone https://github.com/martuuu/flight-bot.git
cd flight-bot

# Instalar dependencias
npm install

# Copiar configuración de ejemplo
cp .env.example .env.production
```

### 3. Configurar Variables de Entorno

Editar `.env.production`:

```bash
nano .env.production
```

Variables críticas:

```bash
# Base de datos (usar la misma que la webapp)
DATABASE_URL="postgresql://neondb_owner:npg_dItXPOJQE59e@ep-floral-wave-aeydvv2j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Bot de Telegram
TELEGRAM_BOT_TOKEN="7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw"
ADMIN_CHAT_ID="5536948508"

# Webapp (para sincronización)
NEXTAUTH_URL="https://flight-bot.com"

# APIs de vuelos
ARAJET_API_URL="https://arajet-api.ezycommerce.sabre.com"
ARAJET_TENANT_ID="caTRCudVPKmnHNnNeTgD3jDHwtsVvNtTmVHnRhYQzEqVboamwZp6fDEextRR8DAB"
ARAJET_USER_ID="kKEBDZhkH9m6TPYLFjqgUGiohOmMqE"
ARAJET_CLIENT_VERSION="0.5.3476"

# Entorno
NODE_ENV="production"
```

### 4. Ejecutar Bot

#### Modo Desarrollo (para pruebas)
```bash
npm run dev
```

#### Modo Producción
```bash
npm run start-bot
```

#### Modo Persistente con PM2
```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar bot con PM2
npm run pm2:start

# Verificar estado
npm run pm2:status

# Ver logs
npm run pm2:logs

# Reiniciar
npm run pm2:restart

# Auto-inicio al reiniciar servidor
pm2 startup
pm2 save
```

## 🔧 Comandos Útiles

### Gestión del Bot
```bash
# Iniciar bot
npm run start-bot

# Parar bot
npm run stop-bot

# Reiniciar bot
npm run restart-bot

# Ver logs
tail -f logs/app.log
```

### Base de Datos
```bash
# Verificar conexión
npm run db:generate

# Ver datos
npm run db:studio

# Migrar esquema
npm run db:push
```

### Monitoreo
```bash
# Estado de PM2
pm2 status

# Logs en tiempo real
pm2 logs flight-bot --lines 100

# Monitoreo web
pm2 monit
```

## 📊 Verificación

Una vez iniciado el bot, verifica que funcione:

1. **Telegram**: Envía `/start` al bot
2. **Logs**: Revisa `logs/app.log` para errores
3. **Base de datos**: Verifica conectividad
4. **Webapp**: Prueba la vinculación desde https://flight-bot.com

## 🔒 Seguridad

### Firewall
```bash
# Configurar UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 22
# El bot no necesita puertos externos abiertos
```

### Updates Automáticos
```bash
# Instalar unattended-upgrades
sudo apt install unattended-upgrades

# Configurar actualizaciones automáticas
sudo dpkg-reconfigure unattended-upgrades
```

### Backup del Bot
```bash
# Crear script de backup
crontab -e

# Agregar backup diario a las 2 AM
0 2 * * * /path/to/backup-script.sh
```

## 🚨 Troubleshooting

### Bot no inicia
```bash
# Verificar logs
cat logs/error.log

# Verificar variables de entorno
node -e "console.log(process.env.TELEGRAM_BOT_TOKEN)"

# Verificar conectividad DB
npm run db:generate
```

### Bot pierde conexión
```bash
# Reiniciar bot
pm2 restart flight-bot

# Verificar red
ping 8.8.8.8

# Verificar memoria
free -h
```

### Errores de base de datos
```bash
# Regenerar cliente Prisma
npm run db:generate

# Verificar URL de conexión
echo $DATABASE_URL
```

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `logs/app.log` y `logs/error.log`
2. Verifica las variables de entorno
3. Confirma que la webapp funcione en https://flight-bot.com
4. Verifica conectividad de red y base de datos

## 🔄 Updates

Para actualizar el bot:

```bash
# Parar bot
pm2 stop flight-bot

# Actualizar código
git pull origin main
npm install

# Migrar DB si es necesario
npm run db:push

# Reiniciar bot
pm2 start flight-bot
```
