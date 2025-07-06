#!/usr/bin/env npx tsx

// Script para testear un comando específico del bot
import dotenv from 'dotenv';

console.log('🔧 Cargando variables de entorno...');
dotenv.config({ path: '.env.development' });

async function testBotCommand() {
  const webappUrl = process.env.NEXTAUTH_URL || 'https://flight-bot.com';
  
  console.log('\n🤖 Test de comando del bot');
  console.log('==========================');
  
  // Probemos el endpoint de confirmación con un código inválido
  // para verificar que el bot puede hacer requests a la webapp
  console.log('\n1️⃣ Probando conectividad bot -> webapp...');
  
  try {
    const response = await fetch(`${webappUrl}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'confirm_from_bot',
        telegramId: '123456789',
        telegramUsername: 'testuser',
        telegramFirstName: 'Test',
        telegramLastName: 'User',
        linkingCode: '999999' // Código que no existe
      })
    });
    
    console.log('✅ Request enviado exitosamente');
    console.log('Status:', response.status);
    console.log('StatusText:', response.statusText);
    
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
    if (response.status === 400 && responseData.error?.includes('inválido')) {
      console.log('✅ Bot puede comunicarse con webapp correctamente');
      console.log('✅ Webapp responde con el error esperado para código inválido');
    }
    
  } catch (error) {
    console.error('❌ Error en conectividad:', error);
  }
}

testBotCommand().catch(console.error);
