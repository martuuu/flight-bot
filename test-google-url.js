#!/usr/bin/env node

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'webapp', '.env') });

const clientId = process.env.GOOGLE_CLIENT_ID;
const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;

const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('openid email profile')}&` +
    `state=test`;

console.log('\n🔗 URL de prueba de Google OAuth:');
console.log(googleOAuthUrl);
console.log('\n📝 Copia esta URL en el navegador para probar directamente');
console.log('Si funciona = credenciales válidas');
console.log('Si da error = revisar configuración en Google Cloud Console');
