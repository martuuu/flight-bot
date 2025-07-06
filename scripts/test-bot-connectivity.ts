#!/usr/bin/env npx tsx

// Test de conectividad específico del bot
import dotenv from 'dotenv';

console.log('🔧 Cargando variables de entorno...');
const result = dotenv.config({ path: '.env.development' });

if (result.error) {
  console.error('❌ Error cargando .env.development:', result.error);
  process.exit(1);
}

console.log('✅ Variables cargadas correctamente');

// Verificar variables críticas
const nextAuthUrl = process.env.NEXTAUTH_URL;
console.log('📍 NEXTAUTH_URL:', nextAuthUrl);

if (!nextAuthUrl) {
  console.error('❌ NEXTAUTH_URL no está definida');
  process.exit(1);
}

// Test de conectividad HTTP
async function testConnectivity() {
  const testUrl = `${nextAuthUrl}/api/telegram/link-simple`;
  
  console.log('\n🌐 Testeando conectividad...');
  console.log('URL objetivo:', testUrl);
  
  try {
    console.log('⏳ Haciendo fetch...');
    
    const response = await fetch(testUrl, {
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
        linkingCode: '999999'
      }),
      signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
    });
    
    console.log('✅ Fetch exitoso');
    console.log('Status:', response.status);
    console.log('StatusText:', response.statusText);
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
  } catch (error) {
    console.error('❌ Error en fetch:', error);
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if ('cause' in error) {
        console.error('Error cause:', error.cause);
      }
    }
    
    // Test adicional con curl
    console.log('\n🔧 Intentando con curl...');
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execPromise = util.promisify(exec);
      
      const curlCommand = `curl -X POST ${testUrl} -H "Content-Type: application/json" -d '{"action":"confirm_from_bot","telegramId":"123456789","linkingCode":"999999"}' --max-time 10`;
      console.log('Comando curl:', curlCommand);
      
      const { stdout, stderr } = await execPromise(curlCommand);
      console.log('✅ Curl exitoso');
      console.log('stdout:', stdout);
      if (stderr) console.log('stderr:', stderr);
      
    } catch (curlError) {
      console.error('❌ Error en curl:', curlError);
    }
  }
}

testConnectivity().catch(console.error);
