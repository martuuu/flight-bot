# 🔧 Configuración de Google OAuth para Flight-Bot

## ✅ Estado Actual
- ✅ **Registro manual con email/password**: Funcionando
- ✅ **Login con credenciales**: Funcionando  
- ✅ **Verificación de email**: Funcionando
- ✅ **Sistema de roles**: Funcionando
- ⏳ **Google OAuth**: Requiere configuración de credenciales

## 🎯 Para habilitar Google OAuth

### 1. **Ir a Google Cloud Console**
Ve a [Google Cloud Console](https://console.cloud.google.com/)

### 2. **Crear o seleccionar proyecto**
- Si no tienes un proyecto, haz clic en "New Project"
- Dale un nombre como "Flight-Bot" o similar
- Selecciona el proyecto

### 3. **Habilitar APIs necesarias**
- Ve a "APIs & Services" > "Library"
- Busca y habilita:
  - **Google+ API** (para información básica del perfil)
  - **People API** (para acceso a datos del usuario)

### 4. **Configurar pantalla de consentimiento OAuth**
- Ve a "APIs & Services" > "OAuth consent screen"
- Selecciona "External" (a menos que tengas Google Workspace)
- Rellena la información requerida:
  - App name: `Flight-Bot`
  - User support email: tu email
  - Developer contact: tu email
- Guarda y continúa

### 5. **Crear credenciales OAuth 2.0**
- Ve a "APIs & Services" > "Credentials"
- Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
- Selecciona "Web application"
- Configura:
  - **Name**: `Flight-Bot Web Client`
  - **Authorized JavaScript origins**:
    - `http://localhost:3000`
    - `http://localhost:3001`
  - **Authorized redirect URIs**:
    - `http://localhost:3000/api/auth/callback/google`
    - `http://localhost:3001/api/auth/callback/google`

### 6. **Obtener las credenciales**
- Después de crear, aparecerá un modal con:
  - **Client ID**: algo como `123456789-abc123.apps.googleusercontent.com`
  - **Client Secret**: algo como `GOCSPX-abc123def456`
- **¡Importante!** Guarda estas credenciales de forma segura

### 7. **Configurar en la aplicación**
Edita el archivo `webapp/.env`:

```bash
# Reemplaza estos valores con tus credenciales reales:
GOOGLE_CLIENT_ID=tu-client-id-real.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret-real
```

### 8. **Reiniciar el servidor**
```bash
cd webapp
npm run dev
```

### 9. **Verificar configuración**
Ejecuta el script de verificación:
```bash
./setup-google-oauth.sh
```

## 🧪 **Probar la funcionalidad**

Una vez configurado, verás:

**Página de Registro (signup):**
- ✅ Formulario manual de registro
- ✅ Botón "Continue with Google" (solo si OAuth está configurado)
- ✅ Validación y verificación de email

**Página de Login (signin):**
- ✅ Login con email/password
- ✅ Botón "Continue with Google" (solo si OAuth está configurado)
- ✅ Manejo de errores y redirecciones

## 🔄 **Flujo de Google OAuth**

1. **Usuario hace clic en "Continue with Google"**
2. **Redirección a Google** para autorización
3. **Usuario autoriza la aplicación** en Google
4. **Google redirige de vuelta** a `/api/auth/callback/google`
5. **NextAuth procesa** la respuesta de Google
6. **Se crea/actualiza** el usuario en la base de datos
7. **Redirección** al dashboard (`/dashboard`)

## 🛡️ **Seguridad**

- ✅ **Variables de entorno**: Credenciales nunca en el código
- ✅ **Validación condicional**: Google OAuth solo aparece si está configurado
- ✅ **Callbacks seguros**: URLs de redirección validadas
- ✅ **Sesiones JWT**: Tokens seguros con NextAuth

## 📋 **Checklist de configuración**

- [ ] Proyecto creado en Google Cloud Console
- [ ] APIs habilitadas (Google+ API, People API)
- [ ] Pantalla de consentimiento OAuth configurada
- [ ] Cliente OAuth 2.0 creado
- [ ] URIs de redirección configuradas
- [ ] Client ID y Secret copiados
- [ ] Variables de entorno actualizadas en `.env`
- [ ] Servidor reiniciado
- [ ] Verificación con `./setup-google-oauth.sh`
- [ ] Prueba manual en `/auth/signup` y `/auth/signin`

## 🚀 **Para producción**

Cuando despliegues a producción, agrega también estas URIs:
- `https://tu-dominio.com/api/auth/callback/google`
- `https://tu-dominio.com` (como origen autorizado)

## 🆘 **Solución de problemas**

**Error: "redirect_uri_mismatch"**
- Verifica que las URIs de redirección en Google Cloud coincidan exactamente
- Asegúrate de incluir tanto `localhost:3000` como `localhost:3001`

**Error: "invalid_client"**
- Verifica que el Client ID y Secret sean correctos
- Asegúrate de que no haya espacios en blanco en el archivo `.env`

**Botón de Google no aparece**
- Ejecuta `./setup-google-oauth.sh` para verificar la configuración
- Revisa que las variables de entorno no sean los valores placeholder

## 📞 **Soporte**

Si necesitas ayuda con la configuración, verifica:
1. Los logs del servidor de desarrollo
2. La consola del navegador para errores
3. El estado de los providers en `/api/auth/providers`
