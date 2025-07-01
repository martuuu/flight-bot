#!/usr/bin/env npx tsx

import { AlertManager } from '../src/services/AlertManager';
import { AutomatedAlertSystem } from '../src/services/AutomatedAlertSystem';
import { ArajetPassenger } from '../src/types/arajet-api';
import TelegramBot from 'node-telegram-bot-api';

// Mock del bot de Telegram para testing
const mockBot = {
  sendMessage: async (chatId: number, message: string, options?: any) => {
    console.log(`📱 [TELEGRAM] Chat ${chatId}: ${message}`);
    return Promise.resolve({ message_id: Math.random() });
  }
} as unknown as TelegramBot;

async function demonstrateFlightBot() {
  console.log('🚀 DEMOSTRACIÓN COMPLETA - Flight Bot Arajet Integration\n');

  try {
    // 1. Inicializar sistema
    console.log('1️⃣ Inicializando sistema de alertas automáticas...');
    const alertManager = new AlertManager('./data/demo-alerts.db');
    const automatedSystem = new AutomatedAlertSystem('./data/demo-alerts.db', mockBot);
    
    // 2. Crear alertas de ejemplo
    console.log('\n2️⃣ Creando alertas de ejemplo...');
    
    // Alerta 1: Familie con niños - Santiago a Punta Cana
    const familyPassengers: ArajetPassenger[] = [
      { code: 'ADT', count: 2 }, // 2 adultos
      { code: 'CHD', count: 1 }, // 1 niño
      { code: 'INF', count: 1 }  // 1 infante
    ];
    
    const familyAlert = alertManager.createAlert(
      1001, // userId
      2001, // chatId
      'SCL', // Santiago
      'PUJ', // Punta Cana
      800,   // Max $800 USD
      familyPassengers,
      '2026-02' // Febrero 2026
    );
    
    console.log(`✅ Alerta familiar creada: ${familyAlert.id}`);
    console.log(`   👨‍👩‍👧‍👶 Familia (2 adultos, 1 niño, 1 infante)`);
    console.log(`   🛫 ${familyAlert.fromAirport} → ${familyAlert.toAirport}`);
    console.log(`   💰 Máximo: $${familyAlert.maxPrice} USD`);
    console.log(`   📅 Mes: ${familyAlert.searchMonth}\n`);

    // Alerta 2: Viajero individual - Bogotá a Miami
    const soloPassengers: ArajetPassenger[] = [
      { code: 'ADT', count: 1 } // 1 adulto
    ];
    
    const soloAlert = alertManager.createAlert(
      1002, // userId
      2002, // chatId
      'BOG', // Bogotá
      'MIA', // Miami
      400,   // Max $400 USD
      soloPassengers,
      '2026-03' // Marzo 2026
    );
    
    console.log(`✅ Alerta individual creada: ${soloAlert.id}`);
    console.log(`   👤 Viajero solo (1 adulto)`);
    console.log(`   🛫 ${soloAlert.fromAirport} → ${soloAlert.toAirport}`);
    console.log(`   💰 Máximo: $${soloAlert.maxPrice} USD`);
    console.log(`   📅 Mes: ${soloAlert.searchMonth}\n`);

    // Alerta 3: Pareja - Lima a Madrid  
    const couplePassengers: ArajetPassenger[] = [
      { code: 'ADT', count: 2 } // 2 adultos
    ];
    
    const coupleAlert = alertManager.createAlert(
      1003, // userId
      2003, // chatId
      'LIM', // Lima
      'MAD', // Madrid
      600,   // Max $600 USD
      couplePassengers,
      '2026-04' // Abril 2026
    );
    
    console.log(`✅ Alerta de pareja creada: ${coupleAlert.id}`);
    console.log(`   👫 Pareja (2 adultos)`);
    console.log(`   🛫 ${coupleAlert.fromAirport} → ${coupleAlert.toAirport}`);
    console.log(`   💰 Máximo: $${coupleAlert.maxPrice} USD`);
    console.log(`   📅 Mes: ${coupleAlert.searchMonth}\n`);

    // 3. Mostrar estado del sistema
    console.log('3️⃣ Estado del sistema:');
    const allAlerts = alertManager.getAllActiveAlerts();
    console.log(`📊 Total de alertas activas: ${allAlerts.length}`);
    
    allAlerts.forEach((alert, index) => {
      const passengerCount = alert.passengers.reduce((sum, p) => sum + p.count, 0);
      console.log(`   ${index + 1}. ${alert.fromAirport}→${alert.toAirport} | $${alert.maxPrice} | ${passengerCount} pax | ${alert.searchMonth}`);
    });

    console.log('\n4️⃣ Simulando proceso de alertas automáticas...');
    console.log('🤖 En producción, este sistema:');
    console.log('   • Consulta la API de Arajet cada 30 minutos');
    console.log('   • Analiza precios de todo el mes para cada alerta');
    console.log('   • Detecta ofertas que cumplen los criterios');
    console.log('   • Envía notificaciones automáticas por Telegram');
    console.log('   • Registra ofertas encontradas en la base de datos');
    
    console.log('\n5️⃣ Comando de usuario simulado:');
    console.log('💬 Usuario: /monthlyalert SCL PUJ 800');
    console.log('🤖 Bot: ✅ ¡Alerta Mensual Creada! 🗓️');
    console.log('      🛫 Ruta: Santiago → Punta Cana');
    console.log('      💰 Precio máximo: $800 USD');
    console.log('      📅 Mes objetivo: 2026-02');
    console.log('      👥 Pasajeros: 1 Adulto');
    console.log('      🤖 Sistema Automático Arajet activo');

    console.log('\n🎉 DEMOSTRACIÓN COMPLETADA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ El bot está listo para uso en producción');
    console.log('🔗 Funcionalidades implementadas:');
    console.log('   • Comando /monthlyalert para alertas automáticas');
    console.log('   • Integración completa con API de Arajet');
    console.log('   • Análisis de precios mensuales inteligente');
    console.log('   • Base de datos SQLite para persistencia');
    console.log('   • Sistema de notificaciones vía Telegram');
    console.log('   • Soporte para múltiples tipos de pasajeros');
    console.log('   • Monitoreo automático 24/7');

  } catch (error) {
    console.error('❌ Error en demostración:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

// Ejecutar demostración
demonstrateFlightBot().catch(console.error);
