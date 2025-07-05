# PASOS PARA RESOLVER GOOGLE OAUTH ERROR

## 1. Verificar OAuth Consent Screen
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a "APIs & Services" > "OAuth consent screen"
4. Asegúrate de que esté configurado como **"External"**
5. Si está en "Testing", agrega tu email a "Test users"

## 2. Habilitar APIs necesarias
1. Ve a "APIs & Services" > "Library"
2. Busca y habilita:
   - **Google+ API** (o People API)
   - **Google OAuth2 API**

## 3. Verificar configuración OAuth Client
1. Ve a "APIs & Services" > "Credentials"
2. Edita tu OAuth 2.0 Client ID
3. Verifica que los URIs sean exactamente:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

## 4. Probar manualmente
Abre esta URL en tu navegador:

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=1079216797376-j49rd41nialvufovcpl202mtuhcojtq0.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fgoogle&response_type=code&scope=openid+email+profile&access_type=offline&prompt=consent
```

## 5. Si el error persiste
- Espera 10-15 minutos para que los cambios se propaguen
- Considera crear un nuevo OAuth Client ID desde cero
- Verifica que el proyecto de Google Cloud tenga el billing habilitado (si es necesario)

## Estado actual
✅ Backend migrado a PostgreSQL
✅ Bot funcionando con PostgreSQL  
✅ Webapp funcionando con PostgreSQL
✅ NextAuth configurado correctamente
✅ Variables de entorno configuradas
⏳ Google OAuth pendiente de configuración final
