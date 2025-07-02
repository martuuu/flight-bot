# Guía de Testing Multiusuario
# Sistema de autenticación integrada Webapp ↔ Telegram Bot

## Configuración Inicial

### 1. Preparar variables de entorno
```bash
# Copiar y configurar variables
cd /Users/martinnavarro/Documents/flight-bot/webapp
cp .env.example .env.local

# Variables críticas a configurar:
# GOOGLE_CLIENT_ID=tu-google-client-id
# GOOGLE_CLIENT_SECRET=tu-google-client-secret
# NEXTAUTH_SECRET=tu-secret-aleatorio
# NEXTAUTH_URL=http://localhost:3000
# DATABASE_URL="file:./dev.db"
```

### 2. Configurar Google OAuth
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto o seleccionar existente
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Agregar dominios autorizados:
   - `http://localhost:3000`
   - `http://localhost:3000/api/auth/callback/google`

### 3. Inicializar base de datos
```bash
cd /Users/martinnavarro/Documents/flight-bot/webapp
npx prisma generate
npx prisma db push
```

## Plan de Testing Multiusuario

### Cuentas de Prueba (Yopmail)

#### Usuario 1 - Administrador
- **Email**: `admin.flightbot@yopmail.com`
- **Rol Esperado**: `SUPERADMIN` (asignar manualmente)
- **Telegram**: Tu cuenta personal de Telegram
- **Propósito**: Testing de funciones administrativas

#### Usuario 2 - Premium
- **Email**: `premium.tester@yopmail.com`
- **Rol Esperado**: `PREMIUM` (asignar manualmente)
- **Telegram**: Cuenta de Telegram secundaria
- **Propósito**: Testing de funciones premium

#### Usuario 3 - Básico
- **Email**: `basic.user@yopmail.com`
- **Rol Esperado**: `BASIC` (automático)
- **Telegram**: Cuenta de Telegram adicional
- **Propósito**: Testing de limitaciones de plan básico

#### Usuario 4 - Testing
- **Email**: `testing.account@yopmail.com`
- **Rol Esperado**: `TESTING` (asignar manualmente)
- **Telegram**: Cuenta de Telegram de pruebas
- **Propósito**: Testing de funciones en desarrollo

## Flujo de Testing

### Fase 1: Registro y Autenticación Webapp

1. **Limpiar datos existentes**
   ```bash
   npm run test:clean-database
   ```

2. **Para cada usuario de prueba:**
   ```bash
   # Abrir http://localhost:3000/auth/signin
   # Login con Google usando email de Yopmail
   # Verificar creación en base de datos
   # Verificar rol asignado (BASIC por defecto)
   ```

3. **Asignar roles manualmente** (para admin, premium, testing)
   ```sql
   UPDATE User SET role = 'SUPERADMIN' WHERE email = 'admin.flightbot@yopmail.com';
   UPDATE User SET role = 'PREMIUM' WHERE email = 'premium.tester@yopmail.com';
   UPDATE User SET role = 'TESTING' WHERE email = 'testing.account@yopmail.com';
   ```

### Fase 2: Vinculación con Telegram

1. **Para cada usuario autenticado:**
   - Ir a `/profile`
   - Click en "Vincular con Telegram"
   - Se abre deep link: `https://t.me/ticketscannerbot_bot?start=auth_...`
   - Usar cuenta de Telegram correspondiente
   - Bot debe responder con confirmación de vinculación
   - Verificar en webapp que aparece como "Vinculado"

2. **Verificar datos en base de datos:**
   ```sql
   SELECT email, role, telegramId, telegramLinked FROM User;
   ```

### Fase 3: Testing de Comandos Unificados

1. **Para cada usuario vinculado, probar en Telegram:**
   ```
   /start
   /addalert SDQ MIA 300
   /agregaralerta BOG MIA - 2025-08-15
   /misalertas
   /help
   ```

2. **Verificar en webapp:**
   - Dashboard muestra las mismas alertas
   - Consistencia de datos entre plataformas
   - Permisos según rol (BASIC vs PREMIUM vs SUPERADMIN)

### Fase 4: Consistencia de Datos

1. **Crear alerta en webapp → verificar en bot**
   - Crear alerta en webapp (/alerts/new)
   - Verificar con `/misalertas` en bot
   - Datos deben coincidir exactamente

2. **Crear alerta en bot → verificar en webapp**
   - `/addalert SDQ MIA 350` en bot
   - Refresh dashboard en webapp
   - Alerta debe aparecer inmediatamente

3. **Modificar/eliminar en ambas plataformas**
   - Editar desde webapp → verificar en bot
   - Pausar desde bot → verificar en webapp

## Scripts de Automatización

### Testing de Comandos
```bash
npm run test:telegram-commands
```

### Limpieza de datos
```bash
npm run test:clean-database
```

### Verificación de consistencia
```bash
npm run test:data-consistency
```

## Checklist de Pruebas

### ✅ Autenticación
- [ ] Login con Google funciona
- [ ] Roles se asignan correctamente
- [ ] Sesiones persisten correctamente
- [ ] Logout funciona correctamente

### ✅ Vinculación Telegram
- [ ] Deep link genera datos correctos
- [ ] Bot procesa autenticación correctamente
- [ ] Un usuario solo puede vincular una cuenta de Telegram
- [ ] Desvinculación funciona correctamente

### ✅ Comandos Unificados
- [ ] `/addalert` funciona con todas las variaciones
- [ ] `/agregaralerta` funciona con todas las variaciones
- [ ] Parsing de fechas y precios correcto
- [ ] Mensajes de error informativos

### ✅ Consistencia de Datos
- [ ] Alertas creadas en webapp aparecen en bot
- [ ] Alertas creadas en bot aparecen en webapp
- [ ] Modificaciones se sincronizan en tiempo real
- [ ] Eliminaciones se reflejan en ambas plataformas

### ✅ Roles y Permisos
- [ ] BASIC: limitaciones aplicadas
- [ ] PREMIUM: acceso completo
- [ ] TESTING: funciones de prueba
- [ ] SUPERADMIN: acceso administrativo

## Herramientas de Debugging

### Ver logs del bot
```bash
tail -f logs/app.log
```

### Ver sesiones activas
```sql
SELECT * FROM Session WHERE expires > datetime('now');
```

### Ver alertas por usuario
```sql
SELECT u.email, u.role, u.telegramId, COUNT(a.id) as alert_count 
FROM User u 
LEFT JOIN Alert a ON u.id = a.userId 
GROUP BY u.id;
```

## Problemas Comunes

1. **Deep link no funciona**
   - Verificar NEXTAUTH_URL en .env
   - Verificar bot token
   - Revisar logs del bot

2. **Roles no se asignan**
   - Verificar evento createUser en NextAuth
   - Verificar conexión a base de datos

3. **Alertas no se sincronizan**
   - Verificar que ambas apps usen la misma DB
   - Verificar campos de telegramId

4. **Sesión no persiste**
   - Verificar NEXTAUTH_SECRET
   - Verificar configuración de cookies
