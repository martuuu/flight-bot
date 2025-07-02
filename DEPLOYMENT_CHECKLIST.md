# 🚀 DEPLOYMENT CHECKLIST - flight-bot.com

## ✅ COMPLETADO
- [x] Dominio comprado en Hostinger: flight-bot.com
- [x] Proyecto configurado en Vercel
- [x] Configuración vercel.json actualizada

## 🔄 EN PROCESO

### 1. CONFIGURAR DNS EN HOSTINGER
- [ ] Eliminar registro CNAME existente de "www"
- [ ] Agregar registro A: @ → 76.76.19.61 (TTL: 14400)
- [ ] Agregar registro CNAME: www → cname.vercel-dns.com (TTL: 14400)

### 2. CONFIGURAR DOMINIO EN VERCEL
- [ ] Ir a Settings → Domains
- [ ] Agregar: flight-bot.com
- [ ] Agregar: www.flight-bot.com
- [ ] Verificar que aparezcan como "Valid Configuration"

### 3. VARIABLES DE ENTORNO EN VERCEL
Ir a Settings → Environment Variables y agregar:

**CRÍTICAS (obligatorias):**
- [ ] NEXTAUTH_SECRET=tu-secret-super-secreto-aqui-2024
- [ ] NEXTAUTH_URL=https://flight-bot.com
- [ ] JWT_SECRET=jwt-secret-super-secreto-2024
- [ ] NEXT_PUBLIC_WEBAPP_URL=https://flight-bot.com
- [ ] DATABASE_URL=file:./dev.db

**TELEGRAM BOT:**
- [ ] TELEGRAM_BOT_TOKEN=7726760770:AAEhEDu0oEGj5unLTeNxXbyJXQX4fdCVTHw
- [ ] TELEGRAM_BOT_USERNAME=tu_bot_username

**GOOGLE OAUTH (para login):**
- [ ] GOOGLE_CLIENT_ID=tu-google-client-id
- [ ] GOOGLE_CLIENT_SECRET=tu-google-client-secret

**OPCIONALES:**
- [ ] SMTP_HOST=smtp.gmail.com
- [ ] SMTP_PORT=587
- [ ] SMTP_USER=tu-email@gmail.com
- [ ] SMTP_PASS=tu-app-password
- [ ] ADMIN_EMAIL=tu-email@gmail.com

### 4. CONFIGURAR GOOGLE OAUTH
- [ ] Ir a Google Cloud Console
- [ ] Crear/configurar proyecto
- [ ] Habilitar Google+ API
- [ ] Crear credenciales OAuth 2.0
- [ ] Agregar URI de redirección: https://flight-bot.com/api/auth/callback/google

### 5. DEPLOYMENT
- [ ] Ejecutar: ./deploy-webapp.sh
- [ ] Verificar build exitoso en Vercel
- [ ] Probar acceso a https://flight-bot.com

### 6. VERIFICACIÓN FINAL
- [ ] Comprobar DNS propagation: https://www.whatsmydns.net/#A/flight-bot.com
- [ ] Probar login con Google
- [ ] Verificar conexión con bot de Telegram
- [ ] Probar funcionalidades principales

## 🚨 PROBLEMAS COMUNES

### Si el dominio no resuelve:
1. Verificar registros DNS en Hostinger
2. Esperar propagación DNS (hasta 24 horas)
3. Usar herramientas como whatsmydns.net

### Si hay errores de build:
1. Verificar que Root Directory = "webapp" en Vercel
2. Comprobar variables de entorno
3. Revisar logs de build en Vercel

### Si Google OAuth no funciona:
1. Verificar NEXTAUTH_URL = https://flight-bot.com
2. Comprobar redirect URI en Google Console
3. Verificar GOOGLE_CLIENT_ID y SECRET

## 📞 SOPORTE
- Vercel: https://vercel.com/support
- Hostinger: Panel de control DNS
- Google OAuth: https://console.cloud.google.com
