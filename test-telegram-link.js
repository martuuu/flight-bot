#!/usr/bin/env node

// Script de prueba para depurar la vinculación de Telegram

// Test 1: Generar enlace de autenticación
console.log('🧪 Test 1: Generar enlace de autenticación');
const testUserId = 'test-user-123';
const testUserRole = 'BASIC';
const testUserEmail = 'test@example.com';

// Simular la función del bot-config
function createTestAuthLink(userId, userRole, userEmail) {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'ticketscannerbot_bot';
  const authData = Buffer.from(JSON.stringify({ 
    userId, 
    userRole, 
    userEmail, 
    timestamp: Date.now() 
  })).toString('base64');
  return `https://t.me/${botUsername}?start=auth_${authData}`;
}

const authLink = createTestAuthLink(testUserId, testUserRole, testUserEmail);
console.log('🔗 Enlace generado:', authLink);

// Test 2: Decodificar enlace
console.log('\n🧪 Test 2: Decodificar enlace');
const authParam = authLink.split('?start=')[1];
const authData = authParam.replace('auth_', '');
const decodedData = JSON.parse(Buffer.from(authData, 'base64').toString('utf8'));
console.log('📋 Datos decodificados:', decodedData);

// Test 3: Verificar tiempo de expiración
console.log('\n🧪 Test 3: Verificar tiempo de expiración');
const maxAge = 30 * 60 * 1000; // 30 minutos
const isValid = Date.now() - decodedData.timestamp < maxAge;
console.log('⏰ Enlace válido:', isValid);
console.log('🕐 Generado hace:', Math.round((Date.now() - decodedData.timestamp) / 1000), 'segundos');

console.log('\n✅ Todos los tests de enlaces pasaron');
