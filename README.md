# Flight Bot

Automated flight price monitoring and alert system with Telegram bot and web application interfaces.

## Overview

Flight Bot is a comprehensive flight price monitoring system that tracks airline prices and sends automated alerts when deals match user-defined criteria. The system consists of a Telegram bot for quick interactions and a web application for detailed management.

## Features

- Real-time flight price monitoring via Arajet API integration
- Monthly price analysis and trend detection
- Automated alert system with configurable thresholds
- Multi-channel notifications (Telegram, WhatsApp via webapp)
- User management with role-based access control
- Comprehensive logging and error handling
- SQLite database with automated backups

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

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Telegram Bot  │────│  Command Handler │────│ Message Formatter│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Models   │────│   Alert Manager  │────│  Price Monitor  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ SQLite Database │────│ Schedule Manager │────│ Notification Srv│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 📁 Estructura del Proyecto

```
flight-bot/
├── src/                      # Código fuente
│   ├── bot/                  # Lógica del bot de Telegram
│   │   ├── FlightBot.ts      # Bot principal
│   │   ├── CommandHandler.ts # Manejador de comandos
│   │   └── MessageFormatter.ts # Formateo de mensajes
│   ├── services/             # Servicios del sistema
│   │   ├── AlertManager.ts   # Gestión de alertas
│   │   ├── PriceMonitor.ts   # Monitoreo de precios
│   │   └── ScheduleManager.ts# Programación de tareas
│   ├── models/               # Modelos de datos
│   │   ├── Airport.ts        # Modelo de aeropuertos
│   │   ├── AlertModel.ts     # Modelo de alertas
│   │   └── UserModel.ts      # Modelo de usuarios
│   ├── database/             # Base de datos
│   │   ├── index.ts          # Conexión DB
│   │   └── schema.sql        # Schema de la DB
│   └── utils/                # Utilidades
├── scripts/                  # Scripts de gestión
│   ├── setup.sh              # Configuración inicial
│   ├── start-bot.ts          # Inicio alternativo
│   └── bot-manager.sh        # Gestión con PM2
├── webapp/                   # Interfaz web (opcional)
├── data/                     # Archivos de datos
└── logs/                     # Logs del sistema
```

## 🔧 Tecnologías Utilizadas

- **Runtime**: Node.js 18+ con TypeScript
- **Bot Framework**: node-telegram-bot-api
- **Base de Datos**: SQLite con better-sqlite3
- **Scheduling**: node-cron para tareas automáticas
- **HTTP Client**: axios para llamadas a APIs
- **Logging**: winston para logs estructurados
- **Rate Limiting**: rate-limiter-flexible
- **Testing**: Jest para pruebas unitarias

## 📊 Estado del Proyecto

### ✅ Funcionalidades Completadas
- [x] Bot de Telegram completamente funcional
- [x] Sistema de alertas mensuales con API real de Arajet
- [x] Base de datos SQLite con schema optimizado
- [x] Sistema de monitoreo de precios 24/7
- [x] Logging y manejo de errores robusto
- [x] Rate limiting y protección contra spam
- [x] Scripts de gestión y configuración automática
- [x] Documentación completa

### 🚀 Listo para Producción
El bot está completamente funcional y listo para usar en producción con:
- Análisis automático de precios
- Notificaciones inteligentes
- Gestión de múltiples usuarios
- Monitoreo continuo
- Configuración flexible

## 📚 Scripts Disponibles

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
