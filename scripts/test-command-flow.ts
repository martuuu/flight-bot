#!/usr/bin/env node

/**
 * Script de prueba para verificar el flujo de comandos simplificado
 */

import { UserModel, AerolineasAlertModel } from '../src/models';
import { CommandHandler } from '../src/bot/CommandHandler';

// Mock del bot de Telegram
const mockBot = {
  sendMessage: async (chatId: number, text: string, options?: any) => {
    console.log(`[BOT] Enviando mensaje a ${chatId}:`);
    console.log(text);
    if (options?.reply_markup) {
      console.log('Botones:', JSON.stringify(options.reply_markup, null, 2));
    }
    console.log('---');
  }
};

async function testCommandFlow() {
  console.log('🧪 Probando flujo de comandos simplificado...\n');

  const handler = new CommandHandler(mockBot);
  const aerolineasAlertModel = new AerolineasAlertModel('./data/alerts.db');

  // Test 1: Comando normal (debe crear usuario)
  console.log('📋 Test 1: Comando /help (debe crear usuario)');
  const helpMsg = {
    text: '/help',
    chat: { id: 123456 },
    from: { id: 987654, username: 'testuser', first_name: 'Test', last_name: 'User' }
  };
  
  await handler.handleCommand(helpMsg);
  
  const userAfterHelp = UserModel.findByTelegramId(987654);
  console.log('Usuario creado por /help:', userAfterHelp ? '✅' : '❌');
  
  // Test 2: Comando de millas (debe usar su propia lógica)
  console.log('\n📋 Test 2: Comando /millas-ar (debe usar su propia lógica)');
  const millasMsg = {
    text: '/millas-ar EZE MIA 2025-12-15 60000',
    chat: { id: 123456 },
    from: { id: 987655, username: 'testuser2', first_name: 'Test2', last_name: 'User2' }
  };

  // Limpiar usuario anterior si existe
  const existingUser = UserModel.findByTelegramId(987655);
  if (existingUser) {
    console.log('Limpiando usuario existente...');
  }

  await handler.handleCommand(millasMsg);

  // Verificar que el usuario se creó solo cuando se creó la alerta
  // El usuario se crea dentro del método ensureUserExists() del modelo de alertas
  const userAfterMillas = UserModel.findByTelegramId(987655);
  console.log('Usuario creado por /millas-ar:', userAfterMillas ? '✅' : '❌');

  // Verificar que se creó la alerta
  if (userAfterMillas) {
    const alerts = aerolineasAlertModel.findByUserId(userAfterMillas.id);
    console.log('Alerta creada:', alerts.length > 0 ? '✅' : '❌');

    if (alerts.length > 0) {
      console.log('Detalles de la alerta:', {
        origin: alerts[0].origin,
        destination: alerts[0].destination,
        departureDate: alerts[0].departureDate,
        maxMiles: alerts[0].maxMiles,
        isActive: alerts[0].isActive
      });
    }
  } else {
    console.log('❌ No se pudo verificar la alerta porque no se encontró el usuario');
  }

  // Test 3: Comando /myalerts después de /millas-ar
  console.log('\n📋 Test 3: Comando /myalerts después de /millas-ar');
  const myAlertsMsg = {
    text: '/myalerts',
    chat: { id: 123456 },
    from: { id: 987655, username: 'testuser2', first_name: 'Test2', last_name: 'User2' }
  };

  await handler.handleCommand(myAlertsMsg);

  console.log('\n✅ Pruebas completadas. Verifica la salida arriba.');
}

async function cleanupTest() {
  console.log('\n🧹 Limpiando datos de prueba...');
  
  // En un entorno real, podrías limpiar los datos de prueba aquí
  // Por ahora, solo mostraremos un mensaje
  console.log('Los datos de prueba permanecen en la base de datos para inspección manual.');
}

// Ejecutar pruebas
testCommandFlow()
  .then(() => cleanupTest())
  .catch(error => {
    console.error('❌ Error en las pruebas:', error);
    process.exit(1);
  });
