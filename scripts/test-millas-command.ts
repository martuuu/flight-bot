import { CommandHandler } from '../src/bot/CommandHandler';
import { botLogger } from '../src/utils/logger';

// Mock del bot de Telegram
const mockBot = {
  sendMessage: async (chatId: number, text: string, options?: any) => {
    console.log(`\n🤖 Bot response to chat ${chatId}:`);
    console.log(text);
    if (options?.reply_markup) {
      console.log('Inline keyboard:', JSON.stringify(options.reply_markup, null, 2));
    }
    return { message_id: 123 };
  }
};

// Mock del mensaje
const mockMessage = {
  chat: { id: 123456 },
  from: { id: 123456, username: 'testuser', first_name: 'Test', last_name: 'User' },
  text: ''
};

async function testCommand(command: string) {
  console.log(`\n🧪 Testing command: ${command}`);
  console.log('=' .repeat(50));
  
  const handler = new CommandHandler(mockBot as any);
  const msg = { ...mockMessage, text: command };
  
  try {
    await handler.handleCommand(msg);
  } catch (error) {
    console.error('❌ Error:', error);
    botLogger.error('Error en prueba de comando', error as Error);
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas de comandos de millas...\n');
  
  // Pruebas básicas
  await testCommand('/millas-ar');
  await testCommand('/millas-ar EZE');
  await testCommand('/millas-ar EZE MIA');
  await testCommand('/millas-ar EZE MIA 2025-08-15');
  await testCommand('/millas-ar EZE MIA 2025-08-15 60000');
  await testCommand('/millas-ar EZE MIA - 60000 2');
  
  // Pruebas con errores
  await testCommand('/millas-ar XYZ MIA');
  await testCommand('/millas-ar EZE XYZ');
  await testCommand('/millas-ar EZE EZE');
  await testCommand('/millas-ar EZE MIA 2020-01-01');
  await testCommand('/millas-ar EZE MIA 2025-08-15 -1000');
  await testCommand('/millas-ar EZE MIA 2025-08-15 60000 0');
  
  console.log('\n✅ Pruebas completadas');
}

main().catch(console.error);
