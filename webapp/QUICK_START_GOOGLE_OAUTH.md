# 🚀 Guía de Inicio Rápido: Google OAuth

## ✅ Lo Que Ya Tienes Funcionando

Tu webapp YA está preparada para Google OAuth. Solo necesitas las credenciales reales.

## 🎯 Configuración en 5 Minutos

### 1. Ejecuta el Script de Setup
```bash
cd webapp
./setup-google-oauth-production.sh
```

### 2. Ve a Google Cloud Console
Ve a: https://console.cloud.google.com/

### 3. Configuración Rápida en Google
1. **Crear proyecto** (si no tienes uno)
2. **Habilitar API**: Busca "Google+ API" y habilita
3. **OAuth consent screen**: 
   - Tipo: External
   - App name: Flight-Bot
   - Tu email en todos los campos
4. **Crear credenciales**:
   - Tipo: OAuth client ID
   - Application type: Web application
   - JavaScript origins: `http://localhost:3000`
   - Redirect URIs: `http://localhost:3000/api/auth/callback/google`

### 4. Copia las Credenciales
- **Client ID**: Algo como `123456-abc.apps.googleusercontent.com`
- **Client Secret**: Algo como `GOCSPX-abc123def456`

### 5. Configura y Prueba
```bash
# Configurar credenciales en .env
./setup-google-oauth-production.sh

# Reiniciar servidor
npm run dev

# Verificar que funciona
npm run test:google

# Probar manualmente
# Ve a: http://localhost:3000/auth/signin
```

## 🧪 ¿Cómo Saber que Funciona?

### Test Automático:
```bash
npm run test:google
```

### Test Manual:
1. Ve a `http://localhost:3000/auth/signin`
2. Deberías ver el botón **"Continue with Google"**
3. Haz clic y usa tu cuenta de Google real
4. Deberías ser redirigido al dashboard

## 🔧 Solución de Problemas

### "No aparece el botón de Google"
```bash
# Verificar configuración
npm run test:google

# Si no está configurado
./setup-google-oauth-production.sh
```

### "redirect_uri_mismatch"
- Verifica que en Google Console tengas exactamente:
  - `http://localhost:3000/api/auth/callback/google`

### "invalid_client"
- Verifica que las credenciales en `.env` sean correctas
- Reinicia el servidor después de cambiar `.env`

## 🎉 ¿Qué Obtienes?

Una vez configurado, tendrás:

✅ **Registro con Google**: Los usuarios pueden crear cuentas con un click
✅ **Login con Google**: Sin passwords, usando su cuenta de Google
✅ **ID de Google automático**: Cada usuario tendrá su Google ID para el bot de Telegram
✅ **Registro tradicional**: También funciona email/password si prefieren

## 🔄 Flujo Completo del Usuario

1. **Usuario va a webapp** → `http://localhost:3000`
2. **Hace clic en "Sign Up"** → `/auth/signup`
3. **Elige "Continue with Google"** → Popup de Google
4. **Autoriza la app** → Google devuelve datos
5. **Se crea cuenta automáticamente** → Con Google ID incluido
6. **Redirigido al dashboard** → `http://localhost:3000/dashboard`
7. **Puede conectar Telegram** → Usando su Google ID

¡Eso es todo! 🚀

## 💰 ¿Es Gratis?

**¡SÍ! Google OAuth es 100% GRATUITO** 🎉

- ✅ **No necesitas billing** en Google Cloud
- ✅ **No necesitas tarjeta de crédito**
- ✅ **100 usuarios gratis** en modo desarrollo
- ✅ **Usuarios ilimitados** después de verificar app (también gratis)
- ✅ **Sin límites de logins**

El mensaje de "3 meses gratis" es para **otros servicios** de Google Cloud (servidores, storage, etc.), **NO para OAuth**.
