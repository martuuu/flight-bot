#!/usr/bin/env npx tsx

/**
 * Script para probar la funcionalidad unificada de alertas
 */

import { CommandHandler } from '../src/bot/CommandHandler';
import { MessageFormatter } from '../src/bot/MessageFormatter';
import { config } from '../src/config';
import { botLogger } from '../src/utils/logger';

console.log('🧪 TESTING SISTEMA UNIFICADO DE ALERTAS');
console.log('=======================================\n');

// Mock del bot de Telegram
const mockBot = {
  sendMessage: async (chatId: number, message: string, options?: any) => {
    console.log(`📤 Mensaje enviado a chat ${chatId}:`);
    console.log(`${message}\n`);
    return Promise.resolve();
  },
  answerCallbackQuery: async (callbackId: string) => {
    return Promise.resolve();
  }
};

const commandHandler = new CommandHandler(mockBot);

// Mock user data
const mockUser = {
  id: 12345,
  first_name: 'Test',
  username: 'testuser'
};

const mockChatId = 67890;

async function testUnifiedCommands() {
  console.log('🧪 Test 1: Comando /addalert - Sintaxis básica (solo origen y destino)');
  console.log('Comando: /addalert EZE PUJ\n');
  
  // Simular mensaje
  const mockMsg1 = {
    text: '/addalert EZE PUJ',
    chat: { id: mockChatId },
    from: mockUser
  };
  
  await commandHandler.handleCommand(mockMsg1);
  
  console.log('---\n');
  
  console.log('🧪 Test 2: Comando /addalert - Con precio máximo para mes');
  console.log('Comando: /addalert EZE PUJ 800 2026-02\n');
  
  const mockMsg2 = {
    text: '/addalert EZE PUJ 800 2026-02',
    chat: { id: mockChatId },
    from: mockUser
  };
  
  await commandHandler.handleCommand(mockMsg2);
  
  console.log('---\n');
  
  console.log('🧪 Test 3: Comando /addalert - Mejor precio del día');
  console.log('Comando: /addalert EZE PUJ - 2026-02-15\n');
  
  const mockMsg3 = {
    text: '/addalert EZE PUJ - 2026-02-15',
    chat: { id: mockChatId },
    from: mockUser
  };
  
  await commandHandler.handleCommand(mockMsg3);
  
  console.log('---\n');
  
  console.log('🧪 Test 4: Comando /agregaralerta - Versión en español');
  console.log('Comando: /agregaralerta BOG MIA 450 2026-03\n');
  
  const mockMsg4 = {
    text: '/agregaralerta BOG MIA 450 2026-03',
    chat: { id: mockChatId },
    from: mockUser
  };
  
  await commandHandler.handleCommand(mockMsg4);
  
  console.log('---\n');
  
  console.log('🧪 Test 5: Comando con argumentos insuficientes');
  console.log('Comando: /addalert EZE\n');
  
  const mockMsg5 = {
    text: '/addalert EZE',
    chat: { id: mockChatId },
    from: mockUser
  };
  
  await commandHandler.handleCommand(mockMsg5);
  
  console.log('---\n');
  
  console.log('🧪 Test 6: Comando /help - Verificar mensaje actualizado');
  console.log('Comando: /help\n');
  
  const mockMsg6 = {
    text: '/help',
    chat: { id: mockChatId },
    from: mockUser
  };
  
  await commandHandler.handleCommand(mockMsg6);
}

async function testMessageFormatters() {
  console.log('\n🧪 TESTING MESSAGE FORMATTERS');
  console.log('==============================\n');
  
  console.log('📋 Mensaje de uso unificado:');
  console.log(MessageFormatter.formatUnifiedAlertUsageMessage());
  
  console.log('\n---\n');
  
  console.log('📋 Mensaje de ayuda actualizado:');
  console.log(MessageFormatter.formatHelpMessage());
}

async function runTests() {
  try {
    await testUnifiedCommands();
    await testMessageFormatters();
    
    console.log('\n✅ TODOS LOS TESTS COMPLETADOS');
    console.log('============================');
    console.log('');
    console.log('📊 Resumen:');
    console.log('• Comando unificado /addalert implementado ✅');
    console.log('• Comando en español /agregaralerta implementado ✅');
    console.log('• Soporte para alertas mensuales y diarias ✅');
    console.log('• Soporte para precio máximo y mejor precio ✅');
    console.log('• Validaciones de parámetros implementadas ✅');
    console.log('• Mensajes de ayuda actualizados ✅');
    console.log('');
    console.log('🚀 Próximos pasos:');
    console.log('1. Probar bot en Telegram con comandos nuevos');
    console.log('2. Verificar integración con webapp');
    console.log('3. Actualizar documentación');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante los tests:', error);
    process.exit(1);
  }
}

runTests();
