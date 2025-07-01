# Prompt Completo para Webapp de Alertas de Vuelos

Necesito crear una webapp en Next.js + TypeScript + Tailwind CSS que sea la versión web de mi bot de Telegram de alertas de vuelos. La webapp debe permitir a los usuarios configurar alertas de precios de vuelos y recibir notificaciones por WhatsApp.

## Contexto del Proyecto
- Tengo un bot de Telegram funcionando que monitorea precios de vuelos
- Quiero expandir a una webapp para usuarios que no usan Telegram
- Las notificaciones se enviarán por WhatsApp inicialmente
- El backend ya existe (Node.js + TypeScript + SQLite)

## Tecnologías Requeridas
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Prisma (para base de datos)
- NextAuth.js (autenticación)
- React Hook Form + Zod (formularios)
- Google icons (https://fonts.google.com/icons) o sino los de Material Design/UI.

## Design System
Usa el sistema de diseño "Travo" adjunto en el JSON. Características principales:
- Color primario: Purple gradient (#7C3AED to #A855F7)
- Cards con bordes redondeados (16-24px)
- Sombras suaves
- Tipografía SF Pro Display/Text
- Espaciado consistente (múltiplos de 4px)
- Botones con gradientes y sombras
- Mobile-first responsive

## Estructura de Páginas Necesarias

### 1. Landing Page (/)
- Hero section enfocado a crear una alerta (se que es controversial, pero me gustaria que la opcion sea lo primero que se vea)
- Features principales (aclarar que es un bot que tiene la opcion de Telegram como principal y sino es opcional via whatsapp atraves de la webapp. Tambien puede ser desde la webapp pero conectado a telegram)
- Testimonios/casos de uso (resaltar que con 36 meses que pago el año del bot, se ahorro cientos de dolares en pasajes y tickets)
- Princing (gratuito tiene 2 alertas para seleccionar por dia. 2usd mensuales pagando el año completo o 3usd mensuales, agrega hasta 10 dias de alertas, tiempos reducidos de aviso -el free chequea cada 6 horas, el pago es cada 1hs- y habilita a la opcion mensual de buscar por mes, el mas caro es 32 anuales o 5 mensuales que tiene 20 dias de alertas, 2 meses en buscar por mes y el refresh es cada 20min - ademas acceso a features nuevos con privilegio -alerta de promo en millas de viajero frecuente, alerta de tickts de eventos, alertas personalizados sobre sitios o productos puntuales)
- Eventualmente una seccion IA con recomendaciones de precios a buscar, promedios, fechas, etc analizando datos de alertas, ofertas y busquedas globales para conseguir el mejor precio -REAL- de las fechas solicitadas
- CTA para registro

### 2. Authentication
- `/login` - Login con email/password + OAuth
- `/register` - Registro con validación
- `/forgot-password` - Recuperación de contraseña

### 3. Dashboard (/dashboard)
- Resumen de alertas activas
- Gráficos de precios (opcional para MVP)
- Accesos rápidos

### 4. Alertas
- `/alerts` - Lista de alertas del usuario
- `/alerts/new` - Crear nueva alerta
- `/alerts/[id]` - Ver/editar alerta específica
- `/alerts/[id]/history` - Histórico de precios

### 5. Profile
- `/profile` - Configuración del usuario
- `/profile/notifications` - Preferencias de notificaciones
- `/profile/billing` - Facturación (futuro)

## Componentes Principales Necesarios

### Layout Components
```typescript
- Layout (wrapper principal)
- Header (navegación)
- Sidebar (dashboard)
- Footer
- BottomNavigation (mobile)

UI Components

- Button (primary, secondary, ghost variants)
- Card (multiple variants)
- Input (text, search, date variants)
- Select (dropdown, combobox)
- Badge (status, price variants)
- Modal/Dialog
- Toast/Notifications
- LoadingSpinner
- EmptyState


Feature Components

- AlertCard (mostrar alerta con acciones)
- AlertForm (crear/editar alerta)
- PriceChart (gráfico de precios históricos)
- RouteSelector (origen/destino)
- DatePicker (fechas de viaje)
- PriceThresholdInput (precio máximo)
- NotificationSettings
- AirportSearch (autocompletado de aeropuertos)

Hooks Necesarios
- useAlerts() // CRUD alertas
- useAuth() // autenticación
- useNotifications() // preferencias
- usePriceHistory() // histórico
- useAirports() // búsqueda aeropuertos
- useDebounce() // búsquedas

API Routes Necesarias

Authentication
TypeScript
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/forgot-password

Alerts Management
TypeScript
- GET /api/alerts // listar alertas del usuario
- POST /api/alerts // crear alerta
- PUT /api/alerts/[id] // actualizar alerta
- DELETE /api/alerts/[id] // eliminar alerta
- GET /api/alerts/[id]/history // histórico precios

Data
TypeScript
- GET /api/airports // búsqueda aeropuertos
- GET /api/destinations // destinos populares
- POST /api/notifications/test // probar notificación

Base de Datos (Prisma Schema)

Prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  phone     String?  // Para WhatsApp. Tener en cuenta requerimientos de whatsapp para poder enviar mensajes como notificaciones
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  alerts Alert[]
  notificationSettings NotificationSettings?
}

model Alert {
  id          String   @id @default(cuid())
  userId      String
  origin      String   // Código aeropuerto
  destination String   // Código aeropuerto
  maxPrice    Float
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
  priceHistory PriceHistory[]
  notifications AlertNotification[]
}

model PriceHistory {
  id        String   @id @default(cuid())
  alertId   String
  price     Float
  airline   String?
  flightNumber String?
  date      DateTime
  scrapedAt DateTime @default(now())
  
  alert Alert @relation(fields: [alertId], references: [id])
}

model NotificationSettings {
  id           String  @id @default(cuid())
  userId       String  @unique
  whatsapp     Boolean @default(true)
  email        Boolean @default(false)
  pushWeb      Boolean @default(true)
  frequency    String  @default("immediate") // immediate, daily, weekly
  
  user User @relation(fields: [userId], references: [id])
}