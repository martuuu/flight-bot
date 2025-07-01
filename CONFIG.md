# ⚙️ CONFIG - Documentación Técnica

Documentación técnica detallada de componentes, configuración y arquitectura del Flight Bot.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FLIGHT BOT SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌──────────────────┐               │
│  │   Telegram Bot  │────│  Command Handler │               │
│  │   (FlightBot)   │    │   (Commands)     │               │
│  └─────────────────┘    └──────────────────┘               │
│           │                       │                        │
│           ▼                       ▼                        │
│  ┌─────────────────┐    ┌──────────────────┐               │
│  │ Message Format  │    │   Alert Manager  │               │
│  │   (Responses)   │    │   (Database)     │               │
│  └─────────────────┘    └──────────────────┘               │
│           │                       │                        │
│           ▼                       ▼                        │
│  ┌─────────────────┐    ┌──────────────────┐               │
│  │   Price Monitor │────│ Schedule Manager │               │
│  │   (Arajet API)  │    │   (Cron Jobs)    │               │
│  └─────────────────┘    └──────────────────┘               │
│           │                       │                        │
│           ▼                       ▼                        │
│  ┌─────────────────┐    ┌──────────────────┐               │
│  │ Notification    │    │ SQLite Database  │               │
│  │ Service         │    │ (Data Storage)   │               │
│  └─────────────────┘    └──────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

### Directorio Raíz

```
flight-bot/
├── src/                    # Código fuente TypeScript
├── scripts/                # Scripts de utilidades
├── data/                   # Base de datos SQLite
├── logs/                   # Archivos de log
├── backups/                # Backups automáticos
├── docs/                   # Documentación adicional
├── .env                    # Variables de entorno
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración TypeScript
├── ecosystem.config.js     # Configuración PM2
├── docker-compose.yml      # Configuración Docker
└── Dockerfile              # Imagen Docker
```

### Estructura del Código Fuente (`src/`)

```
src/
├── index.ts                # Punto de entrada principal
├── bot/                    # Componentes del bot de Telegram
│   ├── FlightBot.ts       # Clase principal del bot
│   ├── CommandHandler.ts  # Manejador de comandos
│   └── MessageFormatter.ts # Formateador de mensajes
├── config/                 # Configuración
│   └── index.ts           # Variables y configuraciones
├── database/               # Gestión de base de datos
│   ├── index.ts           # Manager de base de datos
│   └── schema.sql         # Schema SQL
├── models/                 # Modelos de datos
│   ├── AlertModel.ts      # CRUD de alertas
│   ├── UserModel.ts       # CRUD de usuarios
│   └── PriceHistoryModel.ts # CRUD historial precios
├── services/               # Servicios principales
│   ├── ArajetAlertService.ts # Servicio de alertas Arajet
│   ├── AlertManager.ts     # Gestión de alertas
│   ├── AutomatedAlertSystem.ts # Sistema automático
│   ├── PriceMonitor.ts     # Monitor de precios
│   ├── NotificationService.ts # Servicio notificaciones
│   ├── ScheduleManager.ts  # Gestor de tareas programadas
│   └── scrapers/           # Scrapers de aerolíneas
│       ├── BaseScraper.ts  # Clase base abstracta
│       ├── AviancaScraper.ts # Scraper Avianca (mock)
│       ├── LatamScraper.ts   # Scraper LATAM (mock)
│       └── ScraperFactory.ts # Factory de scrapers
├── types/                  # Definiciones TypeScript
│   ├── index.ts           # Tipos principales
│   └── generated/         # Tipos generados automáticamente
├── utils/                  # Utilidades
│   ├── logger.ts          # Sistema de logging
│   ├── helpers.ts         # Funciones auxiliares
│   └── validation.ts      # Validaciones
└── scripts/                # Scripts de migración/setup
    ├── initDb.ts          # Inicialización de BD
    └── migrate.ts         # Migraciones
```

## 🔧 Componentes Principales

### 1. FlightBot (`src/bot/FlightBot.ts`)

**Responsabilidad**: Clase principal que maneja la conexión con Telegram.

```typescript
export class FlightBot {
  private bot: TelegramBot;
  private commandHandler: CommandHandler;
  private rateLimiter: RateLimiterMemory;
  
  // Métodos principales:
  // - start(): Iniciar bot
  // - stop(): Detener bot
  // - getBotInfo(): Información del bot
  // - sendMessage(): Enviar mensajes
}
```

**Características**:
- ✅ Rate limiting automático
- ✅ Manejo de errores robusto
- ✅ Logging detallado
- ✅ Reconexión automática

### 2. CommandHandler (`src/bot/CommandHandler.ts`)

**Responsabilidad**: Procesar y ejecutar comandos de Telegram.

**Comandos Implementados**:
- `/start` - Registro de usuario
- `/help` - Ayuda
- `/monthlyalert` - Crear alerta mensual (PRINCIPAL)
- `/alert` - Crear alerta específica
- `/myalerts` - Ver alertas activas
- `/stop` - Pausar alerta
- `/clearall` - Eliminar todas las alertas
- `/stats` - Estadísticas (admin)

**Flujo de un Comando**:
```
Usuario envía /monthlyalert SCL PUJ 800
      ↓
CommandHandler.handleMonthlyAlert()
      ↓
Validar parámetros (origen, destino, precio)
      ↓
AlertManager.createMonthlyAlert()
      ↓
Guardar en base de datos
      ↓
Respuesta confirmación a usuario
```

### 3. ArajetAlertService (`src/services/ArajetAlertService.ts`)

**Responsabilidad**: Integración con la API oficial de Arajet.

```typescript
export class ArajetAlertService {
  // Configuración API real de Arajet
  private readonly baseUrl = 'https://arajet-api.ezycommerce.sabre.com';
  private readonly headers = {
    'Accept': 'text/plain',
    'Content-Type': 'application/json',
    'LanguageCode': 'es-do',
    'AppContext': 'ibe',
    'Tenant-Identifier': 'caTRCudVPKmnHNnNeTgD3jDHwtsVvNtTmVHnRhYQzEqVboamwZp6fDEextRR8DAB',
    // ... más headers
  };
  
  // Métodos principales:
  // - searchFlights(): Buscar vuelos
  // - searchLowestFare(): Buscar tarifas más bajas
  // - processMonthlyAlert(): Procesar alerta mensual
}
```

**Endpoints Utilizados**:
- `POST /api/v1/Availability/SearchShop` - Búsqueda general
- `POST /api/v1/Availability/SearchLowestFare` - Tarifas más bajas

### 4. AlertManager (`src/services/AlertManager.ts`)

**Responsabilidad**: Gestión completa de alertas en base de datos.

```typescript
export class AlertManager {
  // Métodos CRUD:
  // - createAlert(): Crear alerta
  // - getActiveAlerts(): Obtener alertas activas
  // - updateAlert(): Actualizar alerta
  // - deleteAlert(): Eliminar alerta
  // - getAlertsByUser(): Alertas por usuario
}
```

### 5. AutomatedAlertSystem (`src/services/AutomatedAlertSystem.ts`)

**Responsabilidad**: Sistema automático que ejecuta cada 30 minutos.

```typescript
export class AutomatedAlertSystem {
  private cronJob: cron.ScheduledTask;
  
  // Flujo automático:
  // 1. Obtener alertas activas
  // 2. Para cada alerta, consultar API Arajet
  // 3. Analizar precios encontrados
  // 4. Detectar ofertas (precio < precio_máximo)
  // 5. Enviar notificaciones automáticas
  // 6. Registrar resultados en logs
}
```

### 6. MessageFormatter (`src/bot/MessageFormatter.ts`)

**Responsabilidad**: Formatear mensajes para Telegram con emojis y estructura.

**Tipos de Mensajes**:
- Confirmación de alertas creadas
- Notificaciones de ofertas encontradas
- Respuestas de ayuda
- Mensajes de error
- Estadísticas del sistema

## 🗄️ Base de Datos

### Schema Principal

```sql
-- Usuarios registrados
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

-- Alertas de precios
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'manual', -- 'manual' o 'monthly'
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    max_price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    target_month TEXT, -- Para alertas mensuales
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_checked DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Historial de precios encontrados
CREATE TABLE price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id INTEGER,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    flight_date DATE,
    airline TEXT,
    flight_number TEXT,
    found_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES alerts(id)
);

-- Notificaciones enviadas
CREATE TABLE notifications_sent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    flight_date DATE,
    message_text TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES alerts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Índices de Performance

```sql
-- Índices para optimizar consultas frecuentes
CREATE INDEX idx_alerts_user_active ON alerts(user_id, is_active);
CREATE INDEX idx_alerts_route ON alerts(origin, destination);
CREATE INDEX idx_price_history_alert ON price_history(alert_id);
CREATE INDEX idx_price_history_date ON price_history(flight_date);
CREATE INDEX idx_notifications_user ON notifications_sent(user_id);
```

### Triggers de Integridad

```sql
-- Trigger para limpiar historial al eliminar alerta
CREATE TRIGGER cleanup_price_history 
AFTER DELETE ON alerts 
BEGIN
    DELETE FROM price_history WHERE alert_id = OLD.id;
    DELETE FROM notifications_sent WHERE alert_id = OLD.id;
END;
```

## 📊 Scripts Disponibles

### Scripts de NPM

```json
{
  "scripts": {
    // Desarrollo
    "dev": "ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    
    // Testing
    "test": "jest",
    "test:watch": "jest --watch",
    "typecheck": "tsc --noEmit",
    
    // Base de datos
    "db:init": "ts-node -r tsconfig-paths/register src/scripts/initDb.ts",
    "db:migrate": "ts-node -r tsconfig-paths/register src/scripts/migrate.ts",
    
    // Calidad de código
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    
    // Testing de APIs
    "test-arajet": "ts-node -r tsconfig-paths/register scripts/test-arajet-api.ts",
    "analyze-response": "ts-node -r tsconfig-paths/register scripts/analyze-response.ts",
    
    // Utilidades
    "test-multiple-passengers": "npx tsx scripts/test-multiple-passengers.ts",
    "test-alert-creation": "npx tsx scripts/test-alert-creation.ts",
    "demo-complete": "npx tsx scripts/demo-complete-system.ts",
    "start-bot": "npx tsx scripts/start-bot.ts",
    "show-airports": "npx tsx scripts/show-airports.ts",
    
    // PM2
    "pm2:start": "pm2 start ecosystem.config.json",
    "pm2:stop": "pm2 stop flight-bot",
    "pm2:restart": "pm2 restart flight-bot",
    "pm2:status": "pm2 status",
    "pm2:logs": "pm2 logs flight-bot"
  }
}
```

### Scripts de Gestión (`scripts/`)

#### `bot-manager.sh` - Gestor Principal

```bash
# Uso: ./scripts/bot-manager.sh [comando]

# Comandos disponibles:
status    # Ver estado del bot
start     # Iniciar bot
stop      # Detener bot
restart   # Reiniciar bot
logs      # Ver logs en tiempo real
pm2       # Gestión con PM2
help      # Mostrar ayuda
```

#### Scripts de Testing

```bash
# Funcionalidad completa
scripts/verify-bot-functionality.ts

# Testing de alertas
scripts/test-alert-creation.ts

# Demo del sistema completo
scripts/demo-complete-system.ts

# Testing de API Arajet
scripts/test-arajet-api.ts

# Análisis de respuestas
scripts/analyze-response.ts
```

#### Scripts de Configuración

```bash
# Configuración inicial automática
scripts/setup.sh

# Configuración específica de Arajet
scripts/configure-arajet.ts

# Script de inicio del bot
scripts/start-bot.ts
```

## ⚙️ Configuración de Variables

### Variables de Entorno Completas

```bash
# === OBLIGATORIAS ===
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_CHAT_ID=123456789

# === BASE DE DATOS ===
DATABASE_PATH=./data/flights.db
DATABASE_BACKUP_PATH=./backups/

# === ENTORNO ===
NODE_ENV=production
PORT=3000

# === LOGGING ===
LOG_LEVEL=info                     # debug, info, warn, error
LOG_FILE_PATH=./logs/app.log
LOG_MAX_SIZE=20m
LOG_MAX_FILES=5

# === MONITOREO DE PRECIOS ===
SCRAPING_INTERVAL_MINUTES=30       # Frecuencia de verificación
MAX_CONCURRENT_REQUESTS=5          # Requests simultáneos
REQUEST_TIMEOUT_MS=10000           # Timeout por request

# === RATE LIMITING ===
RATE_LIMIT_WINDOW_MS=60000         # Ventana de tiempo (1 minuto)
RATE_LIMIT_MAX_REQUESTS=10         # Máximo requests por ventana

# === ALERTAS ===
MAX_ALERTS_PER_USER=20             # Límite de alertas por usuario
ALERT_COOLDOWN_MINUTES=5           # Cooldown entre alertas duplicadas

# === APIs EXTERNAS (Opcional) ===
AVIANCA_API_KEY=                   # Dejar vacío para mock
LATAM_API_KEY=                     # Dejar vacío para mock
ARAJET_API_KEY=                    # API automática, no requiere key

# === NOTIFICACIONES ===
NOTIFICATION_RETRY_ATTEMPTS=3      # Reintentos para notificaciones
NOTIFICATION_RETRY_DELAY_MS=1000   # Delay entre reintentos

# === TELEGRAM ===
TELEGRAM_API_URL=https://api.telegram.org  # URL base API Telegram
TELEGRAM_PARSE_MODE=Markdown               # Modo de parseo mensajes
```

### Configuración por Entorno

#### Desarrollo (`.env.development`)

```bash
NODE_ENV=development
LOG_LEVEL=debug
SCRAPING_INTERVAL_MINUTES=60
DATABASE_PATH=./data/flights-dev.db
```

#### Testing (`.env.test`)

```bash
NODE_ENV=test
LOG_LEVEL=error
DATABASE_PATH=:memory:
SCRAPING_INTERVAL_MINUTES=999999
```

#### Producción (`.env.production`)

```bash
NODE_ENV=production
LOG_LEVEL=info
DATABASE_PATH=/var/lib/flight-bot/flights.db
LOG_FILE_PATH=/var/log/flight-bot/app.log
SCRAPING_INTERVAL_MINUTES=30
```

## 🔄 Configuración de PM2

### `ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name: 'flight-bot',
    script: 'dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    
    // Variables de entorno
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // Logging
    log_file: './logs/pm2-combined.log',
    out_file: './logs/pm2-out.log',
    error_file: './logs/pm2-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Configuración de restart
    max_memory_restart: '500M',
    restart_delay: 4000,
    max_restarts: 3,
    min_uptime: '10s',
    
    // Configuración de monitoreo
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'data'],
    
    // Configuración avanzada
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 3000
  }]
};
```

## 🐳 Configuración Docker

### `Dockerfile`

```dockerfile
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache sqlite

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript
RUN npm run build

# Crear directorios de datos
RUN mkdir -p data logs backups

# Exponer puerto (si es necesario en el futuro)
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV DATABASE_PATH=./data/flights.db

# Comando de inicio
CMD ["npm", "start"]
```

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  flight-bot:
    build: .
    container_name: flight-bot
    restart: unless-stopped
    
    environment:
      - NODE_ENV=production
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - ADMIN_CHAT_ID=${ADMIN_CHAT_ID}
      - LOG_LEVEL=info
    
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./backups:/app/backups
    
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    
    healthcheck:
      test: ["CMD", "node", "-e", "require('./dist/index.js')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 📈 Sistema de Logging

### Configuración de Winston

```typescript
// src/utils/logger.ts
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'flight-bot' },
  transports: [
    new winston.transports.File({ 
      filename: './logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: './logs/app.log' 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Tipos de Logs

**Info Logs** (`app.log`):
- Inicio/parada del bot
- Comandos ejecutados
- Alertas creadas/modificadas
- Resultados de monitoreo

**Error Logs** (`error.log`):
- Errores de conexión
- Fallos en APIs
- Errores de base de datos
- Excepciones no controladas

**Debug Logs** (solo en desarrollo):
- Requests/responses detallados
- Estados internos de componentes
- Flujo de datos completo

## 🔒 Configuración de Seguridad

### Rate Limiting

```typescript
// Configuración de rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.from.id.toString(),
  points: 10,        // Número de requests
  duration: 60,      // Por 60 segundos
  blockDuration: 60, // Bloquear por 60 segundos si se excede
});
```

### Validación de Inputs

```typescript
// Validaciones implementadas
export const validateFlightAlert = (params: {
  origin: string;
  destination: string;
  maxPrice: number;
}): ValidationResult => {
  // Validar códigos de aeropuerto (IATA)
  // Validar rangos de precios
  // Validar caracteres especiales
  // Validar longitudes
};
```

### Manejo de Errores

```typescript
// Estrategia de manejo de errores
class ErrorHandler {
  // Log automático de errores
  // Notificación a administradores
  // Respuestas seguras a usuarios
  // Reintentos automáticos
}
```

## 🧪 Testing

### Configuración de Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Tipos de Tests

**Unit Tests**:
- Validaciones (`utils/validation.test.ts`)
- Helpers (`utils/helpers.test.ts`)
- Models (`models/*.test.ts`)

**Integration Tests**:
- API Arajet (`services/ArajetAlertService.test.ts`)
- Base de datos (`database/index.test.ts`)

**E2E Tests**:
- Flujo completo de alertas
- Comandos de bot end-to-end

## 📊 Monitoreo y Métricas

### Métricas Recolectadas

```typescript
interface SystemMetrics {
  uptime: number;
  totalUsers: number;
  activeAlerts: number;
  totalFlightsMonitored: number;
  notificationsSent: number;
  averageResponseTime: number;
  errorRate: number;
  memoryUsage: NodeJS.MemoryUsage;
}
```

### Health Checks

```typescript
// Verificaciones de salud del sistema
export const healthCheck = async (): Promise<HealthStatus> => {
  return {
    database: await checkDatabaseConnection(),
    telegram: await checkTelegramAPI(),
    arajetAPI: await checkArajetAPI(),
    diskSpace: await checkDiskSpace(),
    memory: process.memoryUsage()
  };
};
```

## 🔧 Troubleshooting Avanzado

### Logs de Debugging

```bash
# Activar logs debug
export LOG_LEVEL=debug
npm run dev

# Logs específicos de componente
grep "FlightBot" logs/app.log
grep "ArajetAPI" logs/app.log
grep "Alert" logs/app.log
```

### Comandos de Diagnóstico

```bash
# Verificar estado completo
npx tsx scripts/verify-bot-functionality.ts

# Test de conectividad API
npx tsx scripts/test-arajet-api.ts single

# Verificar base de datos
sqlite3 data/flights.db ".schema"
sqlite3 data/flights.db "SELECT COUNT(*) FROM alerts;"

# Verificar permisos
ls -la data/ logs/ backups/
```

### Problemas Comunes y Soluciones

**Bot no responde**:
```bash
# 1. Verificar proceso
ps aux | grep node
# 2. Verificar logs
tail -f logs/error.log
# 3. Reiniciar
./scripts/bot-manager.sh restart
```

**Base de datos bloqueada**:
```bash
# 1. Verificar procesos que usan la BD
lsof data/flights.db
# 2. Terminar procesos conflictivos
# 3. Reiniciar aplicación
```

**API Arajet no responde**:
```bash
# 1. Test manual
npx tsx scripts/test-arajet-api.ts
# 2. Verificar headers y configuración
# 3. Revisar rate limiting
```

---

**Esta documentación técnica cubre todos los aspectos de configuración y arquitectura del Flight Bot. Para instalación paso a paso, consulta [SETUP.md](SETUP.md).**
