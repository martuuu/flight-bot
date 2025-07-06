#!/usr/bin/env npx tsx

// Test de vinculación end-to-end
import dotenv from 'dotenv';

console.log('🔧 Cargando variables de entorno...');
dotenv.config({ path: '.env.development' });

console.log('✅ Variables cargadas');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

async function testEndToEndLinking() {
  const webappUrl = process.env.NEXTAUTH_URL || 'https://flight-bot.com';
  
  console.log('\n🧪 Test End-to-End de Vinculación');
  console.log('=================================');
  
  // Paso 1: Generar código desde la webapp
  console.log('\n1️⃣ Generando código de vinculación...');
  
  try {
    const generateResponse = await fetch(`${webappUrl}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'initiate'
      })
    });
    
    if (!generateResponse.ok) {
      console.error('❌ Error generando código:', generateResponse.status, generateResponse.statusText);
      const errorText = await generateResponse.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const generateResult = await generateResponse.json();
    console.log('✅ Código generado:', generateResult);
    
    if (!generateResult.linkingCode) {
      console.error('❌ No se recibió código de vinculación');
      return;
    }
    
    const linkingCode = generateResult.linkingCode;
    
    // Paso 2: Simular comando /link desde Telegram
    console.log('\n2️⃣ Simulando vinculación desde Telegram...');
    
    const confirmResponse = await fetch(`${webappUrl}/api/telegram/link-simple`, {
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
        linkingCode: linkingCode
      })
    });
    
    console.log('Confirm status:', confirmResponse.status);
    
    if (!confirmResponse.ok) {
      console.error('❌ Error confirmando vinculación:', confirmResponse.status, confirmResponse.statusText);
      const errorText = await confirmResponse.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const confirmResult = await confirmResponse.json();
    console.log('✅ Vinculación confirmada:', confirmResult);
    
    console.log('\n🎉 Test End-to-End completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en test end-to-end:', error);
  }
}

testEndToEndLinking().catch(console.error);
