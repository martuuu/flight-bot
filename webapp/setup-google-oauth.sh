#!/bin/bash

echo "🔧 Configuración de Google OAuth para Flight-Bot"
echo "=============================================="
echo ""

# Verificar si las credenciales están configuradas
if [ -f "webapp/.env" ]; then
    echo "📄 Archivo .env encontrado"
    
    # Verificar si las credenciales están configuradas
    if grep -q "GOOGLE_CLIENT_ID=tu-client-id-real" webapp/.env; then
        echo "⚠️  Las credenciales de Google OAuth NO están configuradas"
        echo ""
        echo "📋 Pasos para configurar Google OAuth:"
        echo "1. Ve a https://console.cloud.google.com/"
        echo "2. Crea o selecciona un proyecto"
        echo "3. Habilita la Google+ API en 'APIs & Services' > 'Library'"
        echo "4. Ve a 'APIs & Services' > 'Credentials'"
        echo "5. Haz clic en 'Create Credentials' > 'OAuth 2.0 Client IDs'"
        echo "6. Selecciona 'Web application'"
        echo "7. Agrega estas URIs de redirección:"
        echo "   - http://localhost:3000/api/auth/callback/google"
        echo "   - http://localhost:3001/api/auth/callback/google"
        echo "8. Copia el Client ID y Client Secret"
        echo "9. Edita webapp/.env y reemplaza:"
        echo "   GOOGLE_CLIENT_ID=tu-client-id-real"
        echo "   GOOGLE_CLIENT_SECRET=tu-client-secret-real"
        echo ""
        echo "🔄 Después de configurar, reinicia el servidor con: npm run dev"
        exit 1
    else
        echo "✅ Credenciales de Google OAuth configuradas"
    fi
else
    echo "❌ Archivo .env no encontrado en webapp/"
    exit 1
fi

echo ""
echo "🧪 Probando endpoints de NextAuth..."

# Cambiar al directorio de la webapp
cd webapp

# Verificar si el servidor está corriendo
if curl -s http://localhost:3000/api/auth/providers > /dev/null; then
    echo "✅ Servidor de desarrollo corriendo en puerto 3000"
    
    # Verificar providers disponibles
    PROVIDERS=$(curl -s http://localhost:3000/api/auth/providers)
    
    if echo "$PROVIDERS" | grep -q "google"; then
        echo "✅ Proveedor de Google OAuth está disponible"
        echo ""
        echo "🎉 ¡Configuración completa! Puedes usar Google OAuth para:"
        echo "   - Registrarse: http://localhost:3000/auth/signup"
        echo "   - Iniciar sesión: http://localhost:3000/auth/signin"
    else
        echo "❌ Proveedor de Google OAuth NO disponible"
        echo "   Verifica que las credenciales sean correctas"
    fi
    
elif curl -s http://localhost:3001/api/auth/providers > /dev/null; then
    echo "✅ Servidor de desarrollo corriendo en puerto 3001"
    
    # Verificar providers disponibles
    PROVIDERS=$(curl -s http://localhost:3001/api/auth/providers)
    
    if echo "$PROVIDERS" | grep -q "google"; then
        echo "✅ Proveedor de Google OAuth está disponible"
        echo ""
        echo "🎉 ¡Configuración completa! Puedes usar Google OAuth para:"
        echo "   - Registrarse: http://localhost:3001/auth/signup"
        echo "   - Iniciar sesión: http://localhost:3001/auth/signin"
    else
        echo "❌ Proveedor de Google OAuth NO disponible"
        echo "   Verifica que las credenciales sean correctas"
    fi
else
    echo "❌ Servidor de desarrollo no está corriendo"
    echo "   Inicia el servidor con: npm run dev"
fi

echo ""
echo "📚 Para más información, consulta:"
echo "   - Google Cloud Console: https://console.cloud.google.com/"
echo "   - NextAuth.js Docs: https://next-auth.js.org/providers/google"
