# 🚀 FLIGHT BOT - RESUMEN SENIOR PARA PRÓXIMA ITERACIÓN

**Fecha**: Julio 7, 2025  
**Estado**: MVP en desarrollo - Migración PostgreSQL completada  
**Próxima fase**: Finalización MVP con fixes críticos

---

## 📋 CONTEXTO DEL PROYECTO

### **Arquitectura Actual**
- **Backend Bot**: Node.js + TypeScript + Prisma + PostgreSQL
- **Frontend Webapp**: Next.js 14 + TypeScript + Prisma + PostgreSQL  
- **Base de Datos**: PostgreSQL Neon (unificada, schema compartido)
- **Autenticación**: NextAuth.js + Google OAuth + vinculación Telegram
- **Deployment**: Bot en servidor dedicado, Webapp en Netlify

### **Stack Tecnológico**
```typescript
Bot: Node.js + TypeScript + Prisma + node-telegram-bot-api
Webapp: Next.js 14 + React + TypeScript + Prisma + NextAuth.js
Database: PostgreSQL (Neon Cloud) - Schema unificado
APIs: Arajet, Aerolíneas Argentinas Plus (millas)
Deployment: PM2 (bot), Netlify (webapp)
```

---

## ✅ LO QUE ESTÁ FUNCIONANDO

### **Sistema Unificado (COMPLETADO)**
- ✅ **Migración PostgreSQL**: De SQLite dual a PostgreSQL unificado
- ✅ **Schema compartido**: Bot y webapp usan el mismo Prisma schema
- ✅ **Compilación limpia**: Ambos proyectos compilan sin errores
- ✅ **Base de datos unificada**: Una sola fuente de verdad

### **Autenticación y Vinculación (COMPLETADO)**
- ✅ **Google OAuth**: Funcionando en webapp
- ✅ **Vinculación Telegram**: Bot se vincula perfectamente con webapp
- ✅ **Gestión usuarios**: Creación y gestión desde webapp
- ✅ **Roles básicos**: SUPERADMIN, PREMIUM, BASIC, TESTING

### **Funcionalidades Operativas**
- ✅ **Webapp dashboard**: Gestión de alertas y usuarios
- ✅ **APIs integradas**: Arajet y Aerolíneas Argentinas
- ✅ **Sistema de logs**: Winston + structured logging
- ✅ **Monitoreo**: Health checks y error tracking

---

## 🚨 FIXES CRÍTICOS PENDIENTES

### **1. BOT ALERT SYSTEM (ALTA PRIORIDAD)**
**Problema identificado:**
```
- Bot no carga alertas existentes - retorna undefined en campos
- Comandos /addalert, /monthlyalert no funcionan
- Probable desconexión entre handlers y Prisma
```

**Archivos a revisar:**
- `src/bot/handlers/AlertCommandHandler.ts`
- `src/services/BotAlertManager.ts`
- `src/services/AlertManagerCompatAdapter.ts`

### **2. SISTEMA DE ROLES Y AUTORIZACIONES**
**Faltante:**
```
- Middleware de autorización por roles
- Bloqueos según suscripción en webapp
- Redirecciones automáticas según privilegios
- Control de acceso diferenciado bot vs webapp
```

**Archivos a crear/modificar:**
- `webapp/middleware/auth.ts`
- `src/bot/middleware/roleCheck.ts`
- `webapp/lib/role-manager.ts`

### **3. TABLA DE PRIVILEGIOS Y SUBSCRIPCIONES**
**Faltante:**
```
- Esquema de privilegios por rol
- Features diferenciadas según suscripción
- Límites por tipo de cliente (alertas, APIs, etc.)
- Sistema de monetización
```

**Nuevo schema necesario:**
```typescript
model RolePermissions {
  id           String @id @default(cuid())
  role         String @unique
  maxAlerts    Int
  canUsePremiumAPIs Boolean
  canAccessAdmin    Boolean
  features     Json  // Array de features permitidas
}
```

---

## 🏗️ ARQUITECTURA TÉCNICA

### **Estructura del Proyecto**
```
flight-bot/
├── src/                     # Bot backend
│   ├── bot/handlers/       # Telegram command handlers
│   ├── services/           # Business logic services
│   ├── models/             # Prisma models
│   └── config/             # Configuration
├── webapp/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utility libraries
│   └── prisma/            # Schema (symlink to ../prisma/)
└── prisma/                # Shared database schema
```

### **Flujo de Datos**
```
Telegram Bot ─┐
              ├─► PostgreSQL Neon ◄─── Next.js Webapp
APIs Externas ─┘
```

### **Modelos Clave**
- `User`: Usuarios con roles y suscripciones
- `Alert/FlightAlert`: Sistema de alertas dual
- `TelegramUser`: Vinculación con webapp
- `AerolineasAlert`: Alertas específicas millas

---

## 🔧 CONFIGURACIÓN ACTUAL

### **Variables de Entorno Clave**
```bash
# Compartidas (Bot + Webapp)
DATABASE_URL="postgresql://neondb_owner:...@neon.tech/neondb"
TELEGRAM_BOT_TOKEN="7726760770:..."

# Bot específicas
ARAJET_API_URL, ARAJET_TENANT_ID, ARAJET_USER_ID
AEROLINEAS_API_URL

# Webapp específicas  
NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

### **Scripts Disponibles**
```bash
# Bot
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar TypeScript
npm run pm2:start    # Producción con PM2

# Webapp
npm run dev          # Desarrollo Next.js
npm run build        # Build para producción
```

---

## 🎯 SIGUIENTE ITERACIÓN - OBJETIVOS

### **Entregables Esperados:**

1. **Bot Alert System Fix**
   - Comandos de alertas funcionando end-to-end
   - Integración completa con Prisma
   - Testing exhaustivo de flujos

2. **Sistema de Autorización Completo**
   - Middleware de roles implementado
   - Controles de acceso funcionales
   - Redirecciones automáticas

3. **Monetización Funcional**
   - Tabla de privilegios operativa
   - Features diferenciadas por suscripción
   - Límites enforced en tiempo real

### **Definition of Done:**
```
✅ Bot crea y gestiona alertas correctamente
✅ Roles controlan acceso en webapp y bot  
✅ Suscripciones limitan funcionalidades
✅ MVP comercializable funcionando
```

---

## 📚 DOCUMENTACIÓN TÉCNICA

**Archivos de referencia clave:**
- `MIGRACION_ESTADO_FINAL_VERIFICADO.md` - Estado de migración
- `prisma/schema.prisma` - Database schema
- `src/config/index.ts` - Configuración del bot
- `webapp/lib/auth.ts` - Autenticación webapp

**URLs importantes:**
- Webapp: https://flight-bot.com
- DB: Neon PostgreSQL Cloud
- Bot: @ticketscannerbot_bot

---

*Documentación preparada para continuidad de desarrollo senior-level*
