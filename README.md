# Flight Bot

## Resumen de migración

Ver `MIGRACION_RESUMEN_FINAL.md` para un resumen de la migración y modernización del sistema.

Automated flight price monitoring and alert system with Telegram bot and web application interfaces.

## 🏗️ Architecture & Deployment

### Production Infrastructure

**Webapp (Frontend + API)**
- **Platform**: Netlify (Serverless Functions)
- **Database**: Neon PostgreSQL (Cloud)
- **URL**: https://flight-bot.com
- **Features**: User management, OAuth with Google, alert configuration, dashboard

**Telegram Bot (Backend)**
- **Platform**: Dedicated Linux server / VPS / Home server
- **Requirements**: Node.js 18+, persistent connection
- **Database**: Shared PostgreSQL with webapp
- **Features**: Real-time price monitoring, user interaction, alert processing

### Why Separate Bot Server?

The Telegram bot requires:
- **Persistent connections** for real-time price monitoring
- **Scheduled tasks** for periodic price checks
- **Long-running processes** for airline API polling
- **Background jobs** for alert processing

While the webapp uses serverless functions (Netlify), the bot needs a traditional server environment for continuous operation.

### Deployment Options for Bot

1. **Home Server** (Recommended for personal use)
   - Raspberry Pi or dedicated PC with Linux
   - 24/7 uptime, low cost
   - Direct control over resources

2. **VPS/Cloud Server**
   - Digital Ocean, Linode, AWS EC2
   - Professional uptime guarantees
   - Scalable resources

3. **Railway/Render** (Alternative)
   - Managed platform for Node.js apps
   - Automatic deployments
   - Built-in monitoring

## Overview

Flight Bot is a comprehensive flight price monitoring system that tracks airline prices and sends automated alerts when deals match user-defined criteria. The system consists of a Telegram bot for quick interactions and a web application for detailed management.

## 🚀 Latest Updates

### ✅ Aerolíneas Argentinas Plus (Millas) Integration - PRODUCTION READY
- **Full API integration** with Aerolíneas Argentinas Plus program
- **Promotional offers detection** for millas-based bookings (3000-5000 millas)
- **Flexible date search** for finding the best promo deals across the month
- **Automatic token management** with GitHub Actions monitoring every 12 hours
- **Real-time monitoring** of promotional fares and availability
- **Telegram bot integration** with `/millas` command and alert system

### 🎯 Key Features for Millas Alerts
- **Specific date alerts**: Monitor a specific route and date for promo offers
- **Flexible date alerts**: Find the best promo days within a month
- **Smart promo detection**: Automatically identifies promotional offers based on:
  - Low millas requirements (< 6000 millas)
  - "Economy Award Promo" fare types
  - Best offer flags
- **Token auto-renewal**: Automatic token monitoring and backup system

## Features

- Real-time flight price monitoring via multiple APIs (Arajet, Aerolíneas Argentinas)
- Monthly price analysis and trend detection for both cash and miles
- Automated alert system with configurable thresholds
- Multi-channel notifications (Telegram, WhatsApp via webapp)
- User management with role-based access control
- Comprehensive logging and error handling
- SQLite database with automated backups
- **NEW**: Aerolíneas Argentinas Plus millas monitoring

## Architecture

```
├── src/                    # Telegram bot source code
│   ├── bot/               # Bot handlers and commands
│   ├── services/          # Business logic services
│   ├── models/            # Database models
│   └── utils/             # Utility functions
├── webapp/                # Next.js web application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utility libraries
│   └── prisma/            # Database schema
├── data/                  # SQLite database files
├── logs/                  # Application logs
└── scripts/               # Automation scripts
```

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- SQLite3

### Setup

```bash
# Clone repository
git clone https://github.com/martuuu/flight-bot.git
cd flight-bot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run db:init

# Start development server
npm run dev
```

## Configuration

### Required Environment Variables

```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
ADMIN_CHAT_ID=your_admin_chat_id

# Database
DATABASE_PATH=./data/flights.db

# Arajet API
ARAJET_API_URL=https://arajet-api.ezycommerce.sabre.com
ARAJET_TENANT_ID=your_tenant_id
ARAJET_USER_ID=your_user_id
ARAJET_CLIENT_VERSION=0.5.3476
```

### Optional Configuration

```bash
# Rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Monitoring
SCRAPING_INTERVAL_MINUTES=30
MAX_CONCURRENT_REQUESTS=5
REQUEST_TIMEOUT_MS=10000

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
```

## Usage

### Telegram Bot Commands

- `/start` - Initialize bot and register user
- `/alert` - Create price alert for specific route
- `/monthlyalert` - Create monthly price monitoring alert
- `/misalertas` - View and manage existing alerts
- `/help` - Display available commands

### Web Application

Access the web interface at `http://localhost:3000` (development) or your deployed domain.

## Development

### Bot Development

```bash
# Start bot in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Web Application Development

```bash
# Navigate to webapp directory
cd webapp

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

### Production Deployment

```bash
# Build application
npm run build

# Start with PM2
npm run pm2:start

# Or use Docker
docker-compose up -d
```

### Web Application Deployment

The web application is configured for deployment on Vercel with the included `vercel.json` configuration.

```bash
# Deploy to Vercel
vercel --prod
```

## Database Schema

### Core Tables

- `users` - User accounts and preferences
- `alerts` - Price alert configurations
- `price_history` - Historical price data
- `notifications` - Sent notification log

### Supported Airports

The system supports 70+ airports including major hubs in:
- United States (JFK, LAX, MIA, etc.)
- Latin America (BOG, LIM, SCL, etc.)
- Caribbean (PUJ, CUN, SJU, etc.)
- Europe (MAD, BCN, LHR, etc.)

## API Integration

### Arajet API

The system integrates with Arajet's flight search API for real-time price data:

- Endpoint: `https://arajet-api.ezycommerce.sabre.com`
- Authentication: Tenant ID and User ID headers
- Rate limiting: Implemented to respect API limits

## Monitoring and Logging

- Winston-based logging with file rotation
- Health checks and error tracking
- Performance monitoring with metrics
- Automated backup system for database

## License

MIT License - see LICENSE file for details.
npm run build
npm start

# Con PM2 (recomendado)
npm run pm2:start
```

## 📱 Comandos del Bot

Una vez configurado, el bot responde a estos comandos en Telegram:

### Comandos de Usuario
| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `/start` | Iniciar y registrarse | `/start` |
| `/help` | Ver ayuda completa | `/help` |
| `/monthlyalert` | Crear alerta mensual | `/monthlyalert EZE PUJ 800` |
| `/alert` | Crear alerta específica | `/alert BOG MIA 850000` |
| `/myalerts` | Ver mis alertas activas | `/myalerts` |
| `/stop` | Pausar alerta específica | `/stop 5` |
| `/clearall` | Eliminar todas las alertas | `/clearall` |

### Ejemplos de Uso

```bash
# Alerta mensual - analiza todo el mes para encontrar las mejores ofertas
/monthlyalert SCL PUJ 800

# Alerta específica - monitorea una ruta en tiempo real  
/alert BOG MIA 850000

# Ver mis alertas activas
/myalerts

# Obtener ayuda
/help
```

## 🎯 Aerolíneas Argentinas Plus (Millas) Usage

### Telegram Bot Commands for Millas

```bash
# Monitor specific date for promo millas offers
/millas_alerta AEP SLA 2025-10-10

# Monitor flexible dates for promo millas offers  
/millas_flexible EZE BHI 2025-08-14

# Check current millas alerts
/millas_status

# View millas alert history
/millas_historial
```

### API Usage Examples

```typescript
import { AerolineasAlertService } from './src/services/AerolineasAlertService';

const service = new AerolineasAlertService();

// Search for promo offers on a specific date
const promoOffers = await service.searchPromoOffersForDate(
  'AEP', 'SLA', '2025-10-10', { adults: 1 }
);

// Search for promo offers with flexible dates
const flexibleOffers = await service.searchPromoOffersFlexible(
  'EZE', 'BHI', '2025-08-14', { adults: 1 }
);
```

### Token Management

```bash
# Check token status
npx ts-node scripts/monitor-token.ts status

# Manual token monitoring
npx ts-node scripts/monitor-token.ts

# Set up automatic monitoring (cron job)
# Add to crontab: 0 */12 * * * cd /path/to/flight-bot && npx ts-node scripts/monitor-token.ts
```

### Testing Promo Detection

```bash
# Test promotional offer detection
npx ts-node scripts/test-promo-detection.ts

# Test final service functionality
npx ts-node scripts/test-final-service.ts
```

## 🔧 Scripts and Automation

### Desarrollo
```bash
npm run dev          # Modo desarrollo con hot reload
npm run build        # Compilar TypeScript
npm start           # Iniciar en producción
npm test            # Ejecutar pruebas
npm run lint        # Linter
```

### Gestión del Bot
```bash
npm run start-bot    # Iniciar usando script
npm run pm2:start    # Iniciar con PM2
npm run pm2:stop     # Detener PM2
npm run pm2:restart  # Reiniciar PM2
npm run pm2:status   # Estado PM2
npm run pm2:logs     # Ver logs PM2
```

### Utilidades
```bash
npm run show-airports # Mostrar aeropuertos disponibles
```

## 🛠️ Development Tools

The project includes a comprehensive set of development tools accessible through the `dev-tools.ts` script:

```bash
# Build and test
npx ts-node scripts/dev-tools.ts build      # Compile TypeScript
npx ts-node scripts/dev-tools.ts test       # Run automated tests
npx ts-node scripts/dev-tools.ts clean      # Clean temporary files

# System monitoring
npx ts-node scripts/dev-tools.ts status     # Check system health
npx ts-node scripts/dev-tools.ts token      # Monitor Aerolíneas token

# Help
npx ts-node scripts/dev-tools.ts help       # Show all available commands
```

### Available Scripts

- **`monitor-token.ts`**: Automated token management for Aerolíneas API
- **`test-bot-functionality.ts`**: Comprehensive test suite for bot functionality
- **`stop-bot.sh`**: Safe bot shutdown script
- **`dev-tools.ts`**: Centralized development tools

## 📚 Documentación

- **[SETUP.md](SETUP.md)** - Guía de instalación y configuración
- **[CONFIG.md](CONFIG.md)** - Documentación técnica detallada
- **[scripts/README.md](scripts/README.md)** - Documentación de scripts

## 🐛 Resolución de Problemas

### Problemas Comunes

1. **El bot no responde**
   - Verifica que el token de Telegram sea correcto
   - Revisa los logs en `logs/app.log`
   - Asegúrate de que el bot tenga permisos

2. **Alertas no funcionan**
   - Verifica la conexión a la API de Arajet
   - Revisa que el Schedule Manager esté activo
   - Comprueba los logs de errores

3. **Base de datos corrupta**
   - Hay backups automáticos en `backups/`
   - Usa `npm run db:init` para reinicializar

### Logs
```bash
# Ver logs en tiempo real
tail -f logs/app.log

# Ver logs de PM2
npm run pm2:logs

# Ver logs de errores
tail -f logs/error.log
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork del repositorio
2. Crea una rama para tu feature
3. Commit con mensajes descriptivos
4. Push a tu rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

## 🙏 Agradecimientos

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3)
- [winston](https://github.com/winstonjs/winston)

---

**¡Felices viajes! ✈️**

Para soporte adicional, contacta al equipo de desarrollo o abre un issue en GitHub.

## Deployment Documentation

📖 **[Servidor Dedicado Setup](SERVIDOR_DEDICADO.md)** - Complete guide for bot server setup
📖 **[Migration Summary](MIGRACION_RESUMEN_FINAL.md)** - System migration and modernization summary

### Quick Start for Bot Server

```bash
# 1. Prepare server
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# 2. Clone and setup
git clone https://github.com/martuuu/flight-bot.git
cd flight-bot && npm install

# 3. Configure environment
cp .env.example .env.production
# Edit .env.production with your database URL and bot token

# 4. Start bot
npm run start-bot
# or with PM2 for production:
npm run pm2:start
```
