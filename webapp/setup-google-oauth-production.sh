#!/bin/bash

# Google OAuth Setup Script for Flight-Bot
echo "🔐 Configurando Google OAuth para Flight-Bot..."

# Verificar que estamos en el directorio webapp
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio webapp"
    exit 1
fi

# Crear .env si no existe
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
fi

echo ""
echo "🎯 Para configurar Google OAuth necesitas:"
echo "1. Ir a Google Cloud Console: https://console.cloud.google.com/"
echo "2. Crear/seleccionar un proyecto"
echo "3. Habilitar Google OAuth2 API"
echo "4. Configurar OAuth consent screen"
echo "5. Crear credenciales OAuth 2.0"
echo ""
echo "📋 URLs que necesitas agregar en Google Console:"
echo "   JavaScript Origins: http://localhost:3000"
echo "   Redirect URIs: http://localhost:3000/api/auth/callback/google"
echo ""

# Solicitar credenciales
read -p "🔑 Ingresa tu Google Client ID: " GOOGLE_CLIENT_ID
read -p "🔐 Ingresa tu Google Client Secret: " GOOGLE_CLIENT_SECRET

# Actualizar .env
if [ ! -z "$GOOGLE_CLIENT_ID" ] && [ ! -z "$GOOGLE_CLIENT_SECRET" ]; then
    # Reemplazar o agregar las variables
    if grep -q "GOOGLE_CLIENT_ID=" .env; then
        sed -i.bak "s/GOOGLE_CLIENT_ID=.*/GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID/" .env
    else
        echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env
    fi
    
    if grep -q "GOOGLE_CLIENT_SECRET=" .env; then
        sed -i.bak "s/GOOGLE_CLIENT_SECRET=.*/GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET/" .env
    else
        echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env
    fi
    
    # Limpiar archivos backup
    rm -f .env.bak
    
    echo "✅ Credenciales guardadas en .env"
else
    echo "⚠️ No se ingresaron credenciales. Puedes editarlas manualmente en .env"
fi

# Generar NEXTAUTH_SECRET si no existe
if ! grep -q "NEXTAUTH_SECRET=" .env || grep -q "NEXTAUTH_SECRET=your-secret-here" .env; then
    echo "🔒 Generando NEXTAUTH_SECRET..."
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    if grep -q "NEXTAUTH_SECRET=" .env; then
        sed -i.bak "s/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$NEXTAUTH_SECRET/" .env
    else
        echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env
    fi
    rm -f .env.bak
    echo "✅ NEXTAUTH_SECRET generado"
fi

echo ""
echo "🚀 Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Reinicia el servidor: npm run dev"
echo "2. Ve a http://localhost:3000/auth/signin"
echo "3. Deberías ver el botón 'Continue with Google'"
echo "4. Prueba con tu cuenta de Google real"
echo ""
echo "🧪 Para probar la configuración:"
echo "   npm run test:auth"
echo ""
echo "📖 Para más ayuda, consulta:"
echo "   - GOOGLE_OAUTH_PRODUCTION_SETUP.md"
echo "   - GOOGLE_OAUTH_SETUP.md"
