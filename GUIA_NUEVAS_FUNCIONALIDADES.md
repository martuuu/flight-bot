# 🚀 GUÍA PARA AGREGAR NUEVAS FUNCIONALIDADES

**El núcleo del sistema está 100% completo y listo para expansión.**

## ✅ Pre-requisitos Verificados

- ✅ **PostgreSQL/Prisma**: Completamente operativo
- ✅ **Build system**: Compila sin errores
- ✅ **Modelos**: Todos migrados y funcionales
- ✅ **Servicios**: Todos actualizados para Prisma
- ✅ **Bot handlers**: Todos operativos
- ✅ **Legacy code**: Completamente removido

## 🎯 Cómo Agregar Nuevas Funcionalidades

### **1. Nuevos Comandos del Bot**

Para agregar un nuevo comando:

```typescript
// 1. Crear handler en src/bot/handlers/
export class NuevoCommandHandler {
  constructor(private bot: TelegramBot) {}
  
  setupCommands() {
    this.bot.onText(/\/nuevo_comando/, this.handleNuevoComando.bind(this));
  }
  
  private async handleNuevoComando(msg: any) {
    // Tu lógica aquí - usa los servicios existentes
    const userModel = new UserModelPrisma();
    const alertManager = new BotAlertManager();
    // ...
  }
}

// 2. Registrar en src/bot/FlightBot.ts
import { NuevoCommandHandler } from './handlers/NuevoCommandHandler';

export class FlightBot {
  private nuevoHandler: NuevoCommandHandler;
  
  constructor() {
    this.nuevoHandler = new NuevoCommandHandler(this.bot);
  }
  
  setupHandlers() {
    this.nuevoHandler.setupCommands();
  }
}
```

### **2. Nuevos Modelos de Base de Datos**

Para agregar nuevas tablas:

```prisma
// 1. Agregar modelo en prisma/schema.prisma
model NuevoModelo {
  id          String   @id @default(cuid())
  userId      String
  data        String
  createdAt   DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  @@map("nuevo_modelo")
}

// 2. Actualizar modelo User si necesario
model User {
  // ...existing fields...
  nuevoModelos NuevoModelo[]
}
```

```bash
# 3. Aplicar migración
npx prisma db push
npx prisma generate
```

```typescript
// 4. Crear servicio en src/models/
export class NuevoModeloPrisma {
  private static prisma = PrismaDatabaseManager.getInstance().getClient();
  
  static async create(data: any): Promise<any> {
    return await this.prisma.nuevoModelo.create({ data });
  }
  
  static async findByUserId(userId: string): Promise<any[]> {
    return await this.prisma.nuevoModelo.findMany({
      where: { userId }
    });
  }
}
```

### **3. Nuevos Servicios**

Para agregar nueva lógica de negocio:

```typescript
// src/services/NuevoService.ts
import { PrismaDatabaseManager } from '../database/prisma-adapter';

export class NuevoService {
  private prisma = PrismaDatabaseManager.getInstance().getClient();
  
  async procesarNuevaFuncionalidad(userId: string, data: any) {
    // Tu lógica aquí
    // Usar servicios existentes si es necesario:
    // - UserModelPrisma para usuarios
    // - BotAlertManager para alertas
    // - AerolineasAlertService para aerolíneas
  }
}
```

### **4. Nuevas APIs de Aerolíneas**

Para integrar nuevas aerolíneas:

```typescript
// src/services/NuevaAerolineaService.ts
export class NuevaAerolineaService {
  private baseUrl = 'https://api.nueva-aerolinea.com';
  
  async searchFlights(params: SearchParams) {
    // Implementar integración
    // Seguir el patrón de AerolineasAlertService.ts
  }
  
  async createAlert(params: AlertParams) {
    // Usar BotAlertManager para crear alertas
    const alertManager = new BotAlertManager();
    return await alertManager.createAlert(/* ... */);
  }
}

// Registrar en AutomatedAlertSystem.ts si es necesario
```

### **5. Nuevas Funcionalidades Web (webapp)**

Para el dashboard web:

```typescript
// webapp/app/api/nueva-funcionalidad/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Tu API aquí
  // Usar la misma base de datos PostgreSQL
}
```

## 🛠️ Buenas Prácticas

### **Desarrollo**
```bash
# Siempre verificar que compila
npm run build

# Regenerar Prisma client después de cambios en schema
npx prisma generate

# Testing
npx ts-node -r tsconfig-paths/register src/scripts/test-migration-final.ts
```

### **Base de Datos**
- ✅ Usar `PrismaDatabaseManager.getInstance().getClient()` para acceder a Prisma
- ✅ Seguir el patrón de modelos existentes (UserModelPrisma, etc.)
- ✅ Usar UUIDs/CUIDs para IDs de nuevas tablas
- ✅ Agregar índices para campos frecuentemente consultados

### **Servicios**
- ✅ Importar servicios existentes en lugar de duplicar lógica
- ✅ Usar `scrapingLogger` para logging consistente
- ✅ Manejar errores adecuadamente con try/catch
- ✅ Usar async/await para operaciones de base de datos

### **Bot Commands**
- ✅ Validar entrada del usuario
- ✅ Mostrar mensajes de error amigables
- ✅ Usar formateo HTML para mensajes bonitos
- ✅ Implementar rate limiting si es necesario

## 📚 Recursos

### **Documentación de Referencia**
- `src/models/UserModelPrisma.ts` - Patrón para modelos
- `src/services/BotAlertManager.ts` - Patrón para servicios
- `src/bot/handlers/BasicCommandHandler.ts` - Patrón para comandos
- `src/services/AerolineasAlertService.ts` - Patrón para APIs externas

### **Schemas y Tipos**
- `prisma/schema.prisma` - Schema de base de datos
- `src/types/` - Definiciones de tipos TypeScript
- `src/database/prisma-adapter.ts` - Adaptador de base de datos

## 🎉 ¡Listo para Desarrollar!

El sistema está **completamente preparado** para que agregues cualquier funcionalidad que necesites. El núcleo es sólido y escalable.

**¡Desarrolla con confianza!** 🚀
