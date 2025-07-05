#!/usr/bin/env node

// Guía para resolver problema OAuth de Google
console.log(`
🔧 SOLUCIÓN PARA ERROR OAUTH DE GOOGLE
=====================================

El error "error=google" indica que Google está rechazando la autenticación.
Esto es MUY COMÚN en desarrollo local. Aquí están las soluciones:

📋 PASOS PARA CREAR CREDENCIALES CORRECTAS:

1. 🌐 Ve a Google Cloud Console:
   https://console.cloud.google.com/

2. 📁 Crear/Seleccionar Proyecto:
   - Crear nuevo proyecto o seleccionar existente
   - Nombre sugerido: "flight-bot-dev"

3. 🔧 Habilitar APIs:
   - Ve a "APIs & Services" > "Library" 
   - Buscar y habilitar "Google+ API" o "People API"

4. 🔑 Crear Credenciales OAuth:
   - Ve a "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "Flight Bot Development"

5. ⚙️ Configurar URLs:
   - Authorized JavaScript origins:
     * http://localhost:3000
     * http://127.0.0.1:3000
   
   - Authorized redirect URIs:
     * http://localhost:3000/api/auth/callback/google
     * http://127.0.0.1:3000/api/auth/callback/google

6. 💾 Copiar Credenciales:
   - Copiar Client ID (formato: xxxxxx.apps.googleusercontent.com)
   - Copiar Client Secret (formato: GOCSPX-xxxxx)

7. 📝 Actualizar .env:
   GOOGLE_CLIENT_ID="tu-nuevo-client-id"
   GOOGLE_CLIENT_SECRET="tu-nuevo-client-secret"

🚨 PROBLEMAS COMUNES:

❌ Error "redirect_uri_mismatch":
   - Verificar que las URLs en Google Console sean exactas
   - Usar http:// (no https://) para desarrollo local

❌ Error "invalid_client":
   - Client ID o Secret incorrectos
   - Proyecto de Google Cloud incorrecto

❌ Error "access_blocked":
   - Agregar tu email como "Test User" en OAuth consent screen
   - Configurar OAuth consent screen como "External" si es necesario

🔧 CONFIGURACIÓN OAUTH CONSENT SCREEN:

1. Ve a "APIs & Services" > "OAuth consent screen"
2. User Type: "External" (para desarrollo)
3. Rellenar información básica:
   - App name: "Flight Bot Dev"
   - User support email: tu-email@gmail.com
   - Developer contact: tu-email@gmail.com

4. En "Test users", agregar tu email de prueba

📞 SI SIGUE FALLANDO:

1. Probar con estas credenciales de desarrollo público:
   GOOGLE_CLIENT_ID="1079216797376-example.apps.googleusercontent.com"
   (Nota: Estas son ejemplos, necesitas crear las tuyas)

2. Verificar en la consola del navegador (F12) si hay errores específicos

3. Probar el flujo OAuth manualmente:
   http://localhost:3000/api/auth/signin/google

🎯 CREDENCIALES ACTUALES:
Client ID: ${process.env.GOOGLE_CLIENT_ID || 'NO CONFIGURADO'}
Secret: ${process.env.GOOGLE_CLIENT_SECRET ? 'CONFIGURADO' : 'NO CONFIGURADO'}

Una vez configuradas las credenciales correctas, el login debería funcionar.
`);

// Verificar si podemos conectar con Google
console.log('\n🔍 VERIFICACIÓN RÁPIDA:');
console.log('1. Ve a: http://localhost:3000/auth/signin');
console.log('2. Click en "Sign in with Google"');
console.log('3. Si redirige a Google correctamente = ✅');
console.log('4. Si muestra error = verificar credenciales');
