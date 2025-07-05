#!/usr/bin/env node

// Script para generar y verificar enlace de autenticación

function createUserAuthLink(userId, userRole, userEmail) {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'ticketscannerbot_bot';
  // Usar solo datos esenciales para mantener el enlace corto
  const authData = Buffer.from(JSON.stringify({ 
    userId, 
    userRole, 
    timestamp: Date.now() 
  })).toString('base64');
  return `https://t.me/${botUsername}?start=auth_${authData}`;
}

async function main() {
  const userId = 'cmcp4ezlk00003eu32mq624oe';
  const userRole = 'BASIC';
  const userEmail = 'test-fresh@telegramlink.com';
  
  console.log('🔗 Generando enlace de autenticación...');
  console.log('📋 Datos:');
  console.log('  Usuario ID:', userId);
  console.log('  Rol:', userRole);
  console.log('  Email:', userEmail);
  console.log('  Bot Username:', process.env.TELEGRAM_BOT_USERNAME || 'ticketscannerbot_bot');
  console.log('');
  
  const link = createUserAuthLink(userId, userRole, userEmail);
  console.log('🔗 Enlace generado:');
  console.log(link);
  console.log('');
  
  // Verificar el parámetro
  const startParam = link.split('?start=')[1];
  console.log('📋 Análisis del parámetro:');
  console.log('  Parámetro start:', startParam);
  console.log('  Longitud:', startParam.length);
  
  if (startParam && startParam.startsWith('auth_')) {
    try {
      const authData = startParam.replace('auth_', '');
      const decoded = JSON.parse(Buffer.from(authData, 'base64').toString());
      console.log('  Datos decodificados:', decoded);
      console.log('  Timestamp legible:', new Date(decoded.timestamp).toISOString());
    } catch (e) {
      console.log('  ❌ Error decodificando:', e.message);
    }
  }
}

main().catch(console.error);
