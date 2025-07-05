#!/usr/bin/env node

// Script para simular comando /start con parámetros

const { CommandHandler } = require('./dist/bot/CommandHandler');

// Mock del bot
const mockBot = {
  sendMessage: async (chatId, message, options) => {
    console.log(`📤 Bot enviaría mensaje a ${chatId}:`);
    console.log(message);
    if (options) {
      console.log('Opciones:', JSON.stringify(options, null, 2));
    }
    console.log('---');
  }
};

async function simulateStart() {
  console.log('🧪 Simulando comando /start con parámetros de autenticación\n');
  
  const handler = new CommandHandler(mockBot);
  
  // Simular mensaje de Telegram
  const mockMsg = {
    text: '/start auth_eyJ1c2VySWQiOiJjbWNwNGV6bGswMDAwM2V1MzJtcTYyNG9lIiwidXNlclJvbGUiOiJCQVNJQyIsInRpbWVzdGFtcCI6MTc1MTY1Mzk3Nzg2Mn0=',
    chat: { id: 5536948508 },
    from: {
      id: 5536948508,
      username: 'martin_navarro_dev',
      first_name: 'Martin',
      last_name: 'Navarro'
    }
  };
  
  console.log('📨 Mensaje simulado:');
  console.log('  Texto:', mockMsg.text);
  console.log('  Chat ID:', mockMsg.chat.id);
  console.log('  Usuario:', mockMsg.from);
  console.log('');
  
  try {
    await handler.handleCommand(mockMsg);
    console.log('\n✅ Simulación completada');
  } catch (error) {
    console.error('\n❌ Error en simulación:', error);
  }
}

simulateStart().catch(console.error);
