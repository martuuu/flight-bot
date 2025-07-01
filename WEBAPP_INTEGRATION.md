# 🌐 WEBAPP INTEGRATION GUIDE

## Integración entre Bot de Telegram y Webapp

Esta guía explica cómo la webapp se integra con tu bot de Telegram existente para crear un sistema completo de alertas de vuelos.

### 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRAVO ECOSYSTEM                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │  Telegram Bot   │    │    Web App       │                   │
│  │  (Existing)     │    │   (New)          │                   │
│  └─────────────────┘    └──────────────────┘                   │
│           │                       │                            │
│           ▼                       ▼                            │
│  ┌─────────────────────────────────────────────────────────────┤
│  │              SHARED COMPONENTS                              │
│  ├─────────────────────────────────────────────────────────────│
│  │                                                             │
│  │  ┌─────────────────┐    ┌──────────────────┐               │
│  │  │ SQLite Database │    │  Arajet Service  │               │
│  │  │  (Shared)       │    │    (Shared)      │               │
│  │  └─────────────────┘    └──────────────────┘               │
│  │                                                             │
│  │  ┌─────────────────┐    ┌──────────────────┐               │
│  │  │  Alert Manager  │    │ Price Monitor    │               │
│  │  │   (Shared)      │    │   (Shared)       │               │
│  │  └─────────────────┘    └──────────────────┘               │
│  │                                                             │
│  └─────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┤
│  │                NOTIFICATION SERVICES                        │
│  ├─────────────────────────────────────────────────────────────│
│  │                                                             │
│  │  ┌─────────────────┐    ┌──────────────────┐               │
│  │  │    Telegram     │    │     WhatsApp     │               │
│  │  │ Notifications   │    │  (Twilio API)    │               │
│  │  └─────────────────┘    └──────────────────┘               │
│  │                                                             │
│  └─────────────────────────────────────────────────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 🔗 Puntos de Integración

#### 1. Base de Datos Compartida
La webapp puede usar la misma base de datos SQLite que tu bot:

```typescript
// En webapp/lib/database.ts
import Database from 'better-sqlite3'

const dbPath = process.env.DATABASE_PATH || '../data/flights.db'
const db = new Database(dbPath)

// Reutiliza las mismas tablas que tu bot
export { db }
```

#### 2. Servicios Compartidos
```typescript
// En webapp/lib/flight-services.ts
import { ArajetAlertService } from '../../src/services/ArajetAlertService'
import { AlertManager } from '../../src/services/AlertManager'
import { PriceMonitor } from '../../src/services/PriceMonitor'

// Reutiliza la lógica existente del bot
export { ArajetAlertService, AlertManager, PriceMonitor }
```

#### 3. Notificaciones Duales
Los usuarios pueden elegir recibir notificaciones por:
- **Telegram** (usando tu bot existente)
- **WhatsApp** (usando la webapp con Twilio)
- **Ambos** (máxima cobertura)

### 📊 Flujo de Datos

```
1. Usuario crea alerta en webapp
        ↓
2. Se guarda en base de datos compartida
        ↓
3. Sistema de monitoreo automático (tu bot existente) 
   detecta cambios en precios
        ↓
4. Se verifica el canal de notificación preferido del usuario
        ↓
5a. Si prefiere Telegram → Envía via bot
5b. Si prefiere WhatsApp → Envía via webapp
5c. Si prefiere ambos → Envía por ambos canales
```

### 🛠️ Implementación Paso a Paso

#### Paso 1: Configurar Base de Datos Compartida

```bash
# En tu proyecto principal
cd /path/to/flight-bot

# Crear symlink para que la webapp use la misma BD
ln -s "$(pwd)/data/flights.db" webapp/prisma/dev.db
```

#### Paso 2: Configurar Variables de Entorno
```bash
# En webapp/.env
DATABASE_URL="file:../data/flights.db"
TELEGRAM_BOT_TOKEN=tu_token_del_bot_existente
TWILIO_ACCOUNT_SID=tu_twilio_sid
TWILIO_AUTH_TOKEN=tu_twilio_token
```

#### Paso 3: Modificar el Schema de Prisma
```prisma
// En webapp/prisma/schema.prisma
model User {
  // ... campos existentes
  telegramUserId   String?  // Para vincular con usuarios del bot
  preferredChannel String   @default("WHATSAPP") // TELEGRAM, WHATSAPP, BOTH
}
```

#### Paso 4: Crear API de Sincronización
```typescript
// En webapp/app/api/sync/route.ts
export async function POST() {
  // Sincronizar usuarios entre Telegram bot y webapp
  // Migrar alertas existentes
  // Actualizar preferencias de notificación
}
```

### 🔄 Migración de Usuarios Existentes

Si ya tienes usuarios en tu bot de Telegram, puedes migrarlos:

```typescript
// Script de migración: webapp/scripts/migrate-telegram-users.ts
import { PrismaClient } from '@prisma/client'
import Database from 'better-sqlite3'

const prisma = new PrismaClient()
const telegramDb = new Database('../data/flights.db')

async function migrateUsers() {
  // 1. Leer usuarios del bot de Telegram
  const telegramUsers = telegramDb.prepare('SELECT * FROM users').all()
  
  // 2. Crear usuarios en la webapp
  for (const user of telegramUsers) {
    await prisma.user.create({
      data: {
        telegramUserId: user.telegram_user_id,
        name: user.name || 'Usuario Telegram',
        preferredChannel: 'TELEGRAM', // Mantener preferencia actual
        // ... otros campos
      }
    })
  }
  
  // 3. Migrar alertas existentes
  // 4. Notificar a usuarios sobre webapp disponible
}
```

### 📱 Experiencia del Usuario

#### Usuarios Nuevos (Webapp)
1. Se registran en webapp
2. Configuran alertas
3. Reciben notificaciones por WhatsApp
4. Opcional: pueden también usar el bot de Telegram

#### Usuarios Existentes (Bot)
1. Reciben notificación sobre webapp disponible
2. Pueden vincular su cuenta existente
3. Elegir canal de notificación preferido
4. Mantener alertas existentes

### 🎛️ Panel de Administración

Crear un dashboard admin que muestre:
- Usuarios totales (bot + webapp)
- Alertas activas por canal
- Estadísticas de notificaciones
- Costos de WhatsApp vs Telegram

```typescript
// En webapp/app/admin/dashboard/page.tsx
export default function AdminDashboard() {
  const stats = {
    totalUsers: telegramUsers + webappUsers,
    totalAlerts: activeAlerts,
    notificationStats: {
      telegram: telegramNotifications,
      whatsapp: whatsappNotifications,
    },
    costs: {
      telegram: 0, // Gratis
      whatsapp: whatsappNotifications * 0.005,
    }
  }
  
  return <DashboardUI stats={stats} />
}
```

### 🚀 Despliegue Conjunto

#### Opción 1: Monorepo
```bash
flight-bot/
├── src/              # Bot de Telegram
├── webapp/           # Aplicación web
├── shared/           # Servicios compartidos
└── docker-compose.yml # Deploy conjunto
```

#### Opción 2: Microservicios
```yaml
# docker-compose.yml
services:
  telegram-bot:
    build: ./bot
    depends_on: [database]
  
  webapp:
    build: ./webapp
    ports: ["3000:3000"]
    depends_on: [database]
  
  database:
    image: postgres:15
```

### 💰 Análisis de Costos

#### Bot de Telegram (Actual)
- Hosting: $5-20/mes
- Notificaciones: Gratis
- Total: $5-20/mes

#### Webapp + WhatsApp
- Hosting webapp: $0-20/mes (Vercel)
- WhatsApp (Twilio): $0.005 por mensaje
- Para 1000 usuarios con 5 alertas/mes: $25/mes
- Total: $25-45/mes

#### Beneficios
- Interfaz visual más amigable
- Acceso sin Telegram
- Mejor retención de usuarios
- Posibilidad de monetización futura

### 🔧 Comandos Útiles

```bash
# Instalar ambos proyectos
npm install              # Bot principal
cd webapp && npm install # Webapp

# Desarrollo conjunto
npm run dev:bot          # Terminal 1: Bot de Telegram
npm run dev:webapp       # Terminal 2: Webapp en localhost:3000

# Deploy conjunto
docker-compose up -d     # Ambos servicios en producción
```

### 📋 Checklist de Integración

- [ ] Base de datos compartida configurada
- [ ] Servicios de vuelos reutilizados
- [ ] API de sincronización creada
- [ ] Script de migración de usuarios
- [ ] Configuración de Twilio WhatsApp
- [ ] Panel de administración
- [ ] Testing de notificaciones duales
- [ ] Documentación actualizada
- [ ] Deploy en producción

### 🆘 Solución de Problemas

#### Base de Datos
```bash
# Si hay conflictos de schema
npx prisma db push --force-reset
```

#### Notificaciones
```bash
# Test Telegram
node scripts/test-telegram-notifications.js

# Test WhatsApp
curl -X POST localhost:3000/api/notifications/test
```

#### Sincronización
```bash
# Verificar usuarios duplicados
npx tsx scripts/check-duplicate-users.ts
```

---

**¡Tu ecosistema completo de alertas de vuelos está listo! 🚀✈️**

Los usuarios ahora pueden elegir entre Telegram, WhatsApp, o ambos canales para recibir sus alertas de vuelos.
