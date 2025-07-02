# Google OAuth Setup for Production

## 🎯 Objetivo
Configurar Google OAuth para que los usuarios puedan registrarse e iniciar sesión con sus cuentas de Google reales.

## 📋 Pasos para Configurar Google OAuth

### 1. Acceder a Google Cloud Console (SIN Billing)
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. **Crea nuevo proyecto**:
   - Nombre: Flight-Bot
   - **NO selecciones** "Enable billing" 
   - **NO agregues** tarjeta de crédito
4. ⚠️ **Si te pide billing**: Ignóralo, OAuth funciona sin billing

### 1.1. Crear Proyecto SIN Billing
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. **Crea nuevo proyecto**:
   - Nombre: Flight-Bot
   - **NO selecciones** "Enable billing" 
   - **NO agregues** tarjeta de crédito
4. ⚠️ **Si te pide billing**: Simplemente ignóralo, OAuth funciona sin billing

### 2. Habilitar Google+ API
1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google+ API" o "Google OAuth2 API"
3. Haz clic en **Enable**

### 3. Configurar OAuth Consent Screen
1. Ve a **APIs & Services** > **OAuth consent screen**
2. Selecciona **External** (para usuarios con cualquier cuenta de Google)
3. Completa la información requerida:
   - **App name**: Flight-Bot
   - **User support email**: tu email
   - **Developer contact email**: tu email
   - **App domain**: tu dominio (si tienes uno)
   - **Authorized domains**: 
     - `localhost` (para desarrollo)
     - tu dominio de producción (si tienes uno)

### 4. Crear Credenciales OAuth
1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Selecciona **Web application**
4. Configura:
   - **Name**: Flight-Bot Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.com` (producción, si tienes)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (desarrollo)
     - `https://tu-dominio.com/api/auth/callback/google` (producción)

### 5. Obtener las Credenciales
Después de crear el cliente OAuth, obtendrás:
- **Client ID**: Algo como `123456789-abc123.apps.googleusercontent.com`
- **Client Secret**: Una cadena aleatoria como `GOCSPX-abc123`

### 6. Configurar Variables de Entorno
Copia estas credenciales a tu archivo `.env`:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=tu-client-id-aquí
GOOGLE_CLIENT_SECRET=tu-client-secret-aquí
```

## 🔧 URLs Importantes para tu Configuración

### Para Desarrollo (localhost:3000):
- **JavaScript Origin**: `http://localhost:3000`
- **Redirect URI**: `http://localhost:3000/api/auth/callback/google`

### Para Producción (si tienes dominio):
- **JavaScript Origin**: `https://tu-dominio.com`
- **Redirect URI**: `https://tu-dominio.com/api/auth/callback/google`

## ⚠️ Notas Importantes

1. **🆓 Google OAuth es GRATIS**: No consume créditos de Google Cloud
2. **💵 Billing**: Solo necesitas billing si vas a usar otros servicios (Compute, Storage, etc)
3. **👥 Límites gratuitos**:
   - **100 usuarios en modo desarrollo** (sin verificación)
   - **Usuarios ilimitados** una vez verificada la app (también gratis)
4. **🔐 Para testing**: Puedes probar con cualquier cuenta de Google inmediatamente
5. **📈 Escalabilidad**: Para más de 100 usuarios, solo necesitas verificar tu app (proceso gratuito)
6. **🔒 HTTPS en producción**: Google OAuth requiere HTTPS en producción

## 💰 Costos y Límites (TODO GRATIS)

### ✅ Lo que es COMPLETAMENTE GRATIS:
- **Google OAuth**: Sin límites, sin costos
- **Hasta 100 usuarios**: En modo desarrollo
- **Usuarios ilimitados**: Después de verificar tu app (verificación gratuita)
- **Logins ilimitados**: Sin restricciones por usuario
- **APIs básicas**: Google Sign-In API es gratuita

### 🚫 Lo que NO necesitas pagar:
- **Google Cloud billing**: No es necesario para OAuth
- **Créditos de $300**: Esos son para otros servicios
- **Compute Engine**: No lo necesitas para OAuth
- **Storage**: No lo necesitas para OAuth

### 📊 Límites Reales:
- **Desarrollo**: 100 usuarios únicos (más que suficiente para testing)
- **Producción**: Ilimitado (después de verificar app)
- **Requests**: Sin límites para OAuth

### 🔄 Proceso de Verificación (GRATIS):
Si llegas a 100+ usuarios:
1. Google te pedirá verificar tu app
2. Subes políticas de privacidad y términos
3. Google revisa (proceso gratuito)
4. Una vez aprobado: usuarios ilimitados

## 🧪 Cómo Probar

1. Completa la configuración anterior
2. Reinicia tu servidor de desarrollo: `npm run dev`
3. Ve a `http://localhost:3000/auth/signin`
4. Deberías ver el botón "Continue with Google"
5. Haz clic y prueba con tu cuenta de Google real

## 🚨 Solución de Problemas

### ⚠️ Error: "redirect_uri_mismatch" (MÁS COMÚN)
**Síntoma**: "Error 400: redirect_uri_mismatch" al hacer clic en "Continue with Google"

**Solución**:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** > **Credentials**
3. Edita tu OAuth client ID
4. En **"Authorized redirect URIs"** debe tener **EXACTAMENTE**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. **Guarda** los cambios
6. **Espera 1-2 minutos** para que se propague
7. Prueba de nuevo

**⚠️ Importante**: 
- NO uses `https` en localhost
- NO olvides `/api/auth/callback/google` al final
- NO agregues barras extras `/`

### Error: "invalid_client"
- Verifica que GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET estén correctos
- Reinicia el servidor después de cambiar las variables

### No aparece el botón de Google
- Verifica que las variables de entorno estén configuradas
- Revisa la consola del navegador por errores
