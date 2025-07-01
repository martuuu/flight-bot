#!/usr/bin/env npx tsx

import { FlightBot } from '../src/bot/FlightBot';
import { config, validateConfig } from '../src/config';
import { botLogger } from '../src/utils/logger';

async function startBot() {
  console.log('🚀 Iniciando Flight Bot con Sistema de Alertas Mensuales Arajet...\n');

  try {
    // Validar configuración
    validateConfig();
    console.log('✅ Configuración validada');

    // Crear directorio de datos si no existe
    const fs = require('fs');
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data', { recursive: true });
      console.log('📁 Directorio de datos creado');
    }

    // Inicializar bot
    const bot = new FlightBot();
    console.log('🤖 Bot inicializado');

    // Iniciar polling y sistema de alertas
    bot.startPolling();
    console.log('📡 Sistema iniciado exitosamente\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 FLIGHT BOT ACTIVO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Funcionalidades disponibles:');
    console.log('   • /start - Registrarse en el bot');
    console.log('   • /alert ORIGEN DESTINO PRECIO - Alertas normales');
    console.log('   • /monthlyalert ORIGEN DESTINO PRECIO - Alertas mensuales Arajet');
    console.log('   • /myalerts - Ver alertas activas');
    console.log('   • /help - Ver todos los comandos');
    console.log('');
    console.log('🔥 NUEVO: Sistema de Alertas Mensuales');
    console.log('   • Análisis automático de precios de Arajet');
    console.log('   • Monitoreo de calendario completo mensual');
    console.log('   • Notificaciones automáticas 24/7');
    console.log('   • Soporte para múltiples tipos de pasajeros');
    console.log('');
    console.log('📊 Estado del sistema:');
    console.log(`   • Bot Token: ${config.telegram.token ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   • Base de datos: ✅ SQLite`);
    console.log(`   • API Arajet: ✅ Integrada`);
    console.log(`   • Alertas automáticas: ✅ Activas (cada 30 min)`);
    console.log('');
    console.log('🌟 Ejemplo de uso:');
    console.log('   /monthlyalert SCL PUJ 800');
    console.log('   → Crea alerta para Santiago-Punta Cana bajo $800 USD');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('👀 Monitoreando mensajes...');
    console.log('🔄 Sistema de alertas ejecutándose...');
    console.log('');
    console.log('💡 Para detener el bot: Ctrl+C');

    // Manejo de señales para cierre limpio
    process.on('SIGINT', () => {
      console.log('\n🛑 Deteniendo bot...');
      bot.stopPolling();
      console.log('✅ Bot detenido correctamente');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Deteniendo bot...');
      bot.stopPolling();
      console.log('✅ Bot detenido correctamente');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error iniciando el bot:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

// Iniciar bot
startBot().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
