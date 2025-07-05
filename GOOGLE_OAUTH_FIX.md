# 🔧 GOOGLE OAUTH FIX - COMPLETE GUIDE

**Fecha**: 5 de Julio, 2025  
**Problema**: Google OAuth login falla con `error=google`  
**Causa**: Credenciales de Google OAuth inválidas/placeholder  

## 🚨 PROBLEMA IDENTIFICADO

El error `error=google` en el flujo de login indica que las credenciales de Google OAuth configuradas en `.env` son placeholders o inválidas. Las credenciales actuales no están asociadas a un proyecto real de Google Cloud.

### ❌ Credenciales actuales (no funcionan):
```env
GOOGLE_CLIENT_ID=1079216797376-j49rd41nialvufovcpl202mtuhcojtq0.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## ✅ SOLUCIÓN COMPLETA

### **Paso 1: Crear proyecto en Google Cloud Console**

1. **Ir a Google Cloud Console**:
   ```
   https://console.cloud.google.com/
   ```

2. **Crear nuevo proyecto**:
   - Clic en el dropdown del proyecto (arriba izquierda)
   - Clic en "New Project"
   - Nombre: `flight-bot-webapp` (o el que prefieras)
   - Clic en "Create"

3. **Seleccionar el nuevo proyecto**:
   - Asegúrate de que el proyecto recién creado esté seleccionado

### **Paso 2: Habilitar APIs necesarias**

1. **Ir a APIs & Services**:
   ```
   APIs & Services > Library
   ```

2. **Habilitar Google+ API** (o People API):
   - Buscar "Google+ API" o "People API"
   - Clic en el resultado
   - Clic en "Enable"

### **Paso 3: Configurar OAuth Consent Screen**

1. **Ir a OAuth consent screen**:
   ```
   APIs & Services > OAuth consent screen
   ```

2. **Configurar consent screen**:
   - User Type: **External** (para desarrollo)
   - App name: `Flight Bot Webapp`
   - User support email: tu email
   - Developer contact info: tu email
   - Clic en "Save and Continue"

3. **Scopes** (siguiente pantalla):
   - Clic en "Save and Continue" (usar scopes por defecto)

4. **Test users** (siguiente pantalla):
   - Agregar tu email como test user
   - Clic en "Save and Continue"

### **Paso 4: Crear credenciales OAuth 2.0**

1. **Ir a Credentials**:
   ```
   APIs & Services > Credentials
   ```

2. **Crear credenciales**:
   - Clic en "+ CREATE CREDENTIALS"
   - Seleccionar "OAuth 2.0 Client IDs"

3. **Configurar aplicación web**:
   - Application type: **Web application**
   - Name: `Flight Bot Local Dev`

4. **Configurar URIs autorizadas**:
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     ```

5. **Crear credenciales**:
   - Clic en "Create"
   - **GUARDAR** el Client ID y Client Secret que aparecen

### **Paso 5: Actualizar archivo .env**

1. **Editar `/webapp/.env`**:
   ```env
   # Reemplazar con las credenciales REALES de Google Cloud Console
   GOOGLE_CLIENT_ID=TU_CLIENT_ID_REAL.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-TU_CLIENT_SECRET_REAL
   ```

2. **Verificar otras variables**:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=85VgFd5txhnYwxcX6Lvtmoz/V/qXRj3z+Q+UUbxN6PQ=
   NEXTAUTH_DEBUG=true
   ```

### **Paso 6: Reiniciar y probar**

1. **Reiniciar servidor**:
   ```bash
   cd /Users/martinnavarro/Documents/flight-bot/webapp
   npm run dev
   ```

2. **Probar login**:
   - Ir a `http://localhost:3000`
   - Clic en "Sign in with Google"
   - Debería redirigir a Google OAuth sin errores

## 🧪 TESTING Y VALIDACIÓN

### **Test automático de credenciales**:
```bash
cd /Users/martinnavarro/Documents/flight-bot
node manual-oauth-test.js
```

### **Validar configuración**:
```bash
node test-google-oauth-comprehensive.js
```

### **Test manual**:
1. Abrir `http://localhost:3000`
2. Clic en login con Google
3. Debería ver página de autorización de Google
4. Completar login
5. Debería redirigir de vuelta a la webapp autenticado

## 🚨 PROBLEMAS COMUNES

### **Error: "unauthorized_client"**
- **Causa**: URI de redirección no autorizada
- **Solución**: Verificar que `http://localhost:3000/api/auth/callback/google` esté en la lista de URIs autorizadas

### **Error: "access_denied"**
- **Causa**: Usuario no está en la lista de test users
- **Solución**: Agregar email a test users en OAuth consent screen

### **Error: "invalid_client"**
- **Causa**: Client ID o Client Secret incorrectos
- **Solución**: Verificar que las credenciales en `.env` coincidan con Google Cloud Console

---

## 🚨 **TROUBLESHOOTING - SI AÚN HAY ERROR "error=google"**

Si después de configurar las credenciales reales sigues viendo `error=google`, verifica estos puntos específicos:

### **🔍 Verificación paso a paso**:

1. **En Google Cloud Console** (`https://console.cloud.google.com/`):
   - Ve a **APIs & Services > Credentials**
   - Haz clic en **editar** tu OAuth 2.0 Client ID
   - Verifica que las URIs sean **EXACTAMENTE**:
     - **JavaScript origins**: `http://localhost:3000` (sin barra final)
     - **Redirect URIs**: `http://localhost:3000/api/auth/callback/google`

2. **APIs habilitadas** (`APIs & Services > Library`):
   - ✅ **Google+ API** (o **People API**)
   - ✅ **Google OAuth2 API**

3. **OAuth Consent Screen** (`APIs & Services > OAuth consent screen`):
   - ✅ User Type: **External**
   - ✅ Tu email en **Test users**
   - ✅ Status: **Testing** (no necesita publicación)

### **⏰ Tiempo de propagación**:
- Los cambios en Google Cloud Console pueden tomar **5-10 minutos** en propagarse
- Si acabas de hacer cambios, espera unos minutos y vuelve a probar

### **🔄 Si nada funciona**:
1. **Crear nuevas credenciales**:
   - Elimina el OAuth Client ID actual
   - Crea uno nuevo desde cero
   - Usa exactamente las mismas URIs

2. **Verificar proyecto**:
   - Asegúrate de estar en el proyecto correcto
   - El proyecto debe tener facturación habilitada (gratis está bien)

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] ✅ Proyecto creado en Google Cloud Console
- [ ] ✅ Google+ API habilitada
- [ ] ✅ OAuth consent screen configurado
- [ ] ✅ Credenciales OAuth 2.0 creadas
- [ ] ✅ URIs de redirección configuradas correctamente
- [ ] ✅ Credenciales reales copiadas a `.env`
- [ ] ✅ Servidor reiniciado
- [ ] ✅ Login con Google probado exitosamente

## 🎯 RESULTADO ESPERADO

Después de seguir esta guía:
1. ✅ Login con Google funcionará sin errores
2. ✅ Usuarios podrán autenticarse correctamente
3. ✅ Sesiones se almacenarán en PostgreSQL
4. ✅ El flujo completo de vinculación con Telegram funcionará

---

**📝 NOTA IMPORTANTE**: Las credenciales de Google OAuth son específicas para cada dominio/URL. Si cambias el puerto o dominio, deberás actualizar las URIs autorizadas en Google Cloud Console.

**🔒 SEGURIDAD**: Nunca commits las credenciales reales de Google OAuth al repositorio. Mantén el archivo `.env` en `.gitignore`.

---

**✅ SIGUE ESTA GUÍA PASO A PASO PARA RESOLVER EL PROBLEMA DE GOOGLE OAUTH** 🎉
