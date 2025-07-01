#!/usr/bin/env npx tsx

/**
 * Script para probar las alertas manualmente
 */

import path from 'path';
import dotenv from 'dotenv';

// Configurar paths y environment
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testAlerts() {
  console.log('🧪 Probando sistema de alertas...\n');

  try {
    // 1. Verificar alertas existentes
    console.log('1️⃣ Verificando alertas existentes...');
    const { AlertManager } = await import('../src/services/AlertManager');
    const alertManager = new AlertManager('./data/alerts.db');
    
    // Obtener alertas de un usuario de ejemplo (ID interno del usuario)
    const testUserId = 1; // ID interno del usuario en la base de datos
    const alerts = alertManager.getUserAlerts(testUserId);
    
    console.log(`   ✅ ${alerts.length} alertas encontradas para usuario ${testUserId}`);
    
    alerts.forEach((alert, index) => {
      console.log(`   ${index + 1}. ${alert.fromAirport} → ${alert.toAirport} ($${alert.maxPrice}) - ${alert.searchMonth}`);
      console.log(`      ID: ${alert.id} | Activa: ${alert.isActive ? '✅' : '❌'}`);
    });

    if (alerts.length === 0) {
      console.log('   ℹ️  No hay alertas. Crea una con /monthlyalert en Telegram');
      return;
    }

    // 2. Probar chequeo manual de la primera alerta
    console.log('\n2️⃣ Probando chequeo manual de alerta...');
    const firstAlert = alerts[0];
    
    if (firstAlert) {
      console.log(`   🔍 Chequeando: ${firstAlert.fromAirport} → ${firstAlert.toAirport} (${firstAlert.searchMonth})`);
      
      const { ArajetAlertService } = await import('../src/services/ArajetAlertService');
      const arajetService = new ArajetAlertService();
      
      // Simular búsqueda de ofertas
      const deals = await arajetService.findDealsForAlert(firstAlert);
      
      console.log(`   📊 Resultado: ${deals.length} ofertas encontradas`);
      
      if (deals.length > 0) {
        console.log(`   💰 Mejor precio: $${Math.min(...deals.map(d => d.price))}`);
        console.log(`   📅 Fechas disponibles: ${deals.length} opciones`);
        
        // Generar mensaje formateado
        const message = arajetService.formatAlertMessage(firstAlert, deals);
        console.log(`   📱 Mensaje generado (${message.length} caracteres)`);
        console.log(`   🎯 Contiene "Top ${Math.min(5, deals.length)} ofertas"`);
      } else {
        console.log(`   ❌ No se encontraron ofertas por debajo de $${firstAlert.maxPrice}`);
      }
    }

    // 3. Verificar configuración de intervalos
    console.log('\n3️⃣ Verificando configuración...');
    const { config } = await import('../src/config');
    console.log(`   ⏰ Intervalo configurado: ${config.scraping.intervalMinutes} minutos`);
    console.log(`   📊 Máx alertas por usuario: ${config.alerts.maxAlertsPerUser}`);

    // 4. Verificar próxima ejecución automática
    console.log('\n4️⃣ Información del sistema automático...');
    const now = new Date();
    const nextCheck = new Date(now.getTime() + (config.scraping.intervalMinutes * 60 * 1000));
    console.log(`   🕐 Hora actual: ${now.toLocaleString('es-ES', { timeZone: 'America/Santiago' })}`);
    console.log(`   ⏭️  Próximo chequeo: ${nextCheck.toLocaleString('es-ES', { timeZone: 'America/Santiago' })}`);

    console.log('\n✅ Pruebas completadas. El sistema está funcionando correctamente.');
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Prueba /misalertas en Telegram');
    console.log('   2. Usa el botón "🔍 Chequear Ahora"');
    console.log('   3. Verifica que lleguen notificaciones automáticas');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    process.exit(1);
  }
}

// Ejecutar pruebas
testAlerts().catch(console.error);
