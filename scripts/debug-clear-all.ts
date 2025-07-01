#!/usr/bin/env npx tsx

/**
 * Script para debuggear el problema del botón "Eliminar Todas"
 */

import path from 'path';
import dotenv from 'dotenv';

// Configurar paths y environment
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function debugClearAllButton() {
  console.log('🔍 Debuggeando botón "Eliminar Todas"...\n');

  try {
    // Importar las clases necesarias
    const { AlertManager } = await import('../src/services/AlertManager');
    const { UserModel, AlertModel } = await import('../src/models');
    
    const alertManager = new AlertManager('./data/alerts.db');
    
    // Simular datos del usuario
    const telegramUserId = 5536948508; // El ID que vimos en la BD
    const user = UserModel.findByTelegramId(telegramUserId);
    
    console.log('👤 Usuario encontrado:', {
      id: user?.id,
      telegramId: user?.telegram_id,
      firstName: user?.first_name
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado en la BD');
      return;
    }
    
    // Verificar alertas legacy
    console.log('\n📋 Verificando alertas legacy...');
    const legacyAlerts = AlertModel.findActiveByUserId(user.id);
    console.log(`   Legacy alerts activas: ${legacyAlerts.length}`);
    for (const alert of legacyAlerts) {
      console.log(`   - Alert ID: ${alert.id}, Origen: ${alert.origin}, Destino: ${alert.destination}, Activa: ${alert.active}`);
    }
    
    // Verificar alertas mensuales
    console.log('\n🗓️ Verificando alertas mensuales...');
    const monthlyAlerts = alertManager.getUserAlerts(user.id);
    console.log(`   Monthly alerts activas: ${monthlyAlerts.length}`);
    for (const alert of monthlyAlerts) {
      console.log(`   - Alert ID: ${alert.id}, Origen: ${alert.fromAirport}, Destino: ${alert.toAirport}, Activa: ${alert.isActive}`);
    }
    
    // Simulación de desactivación
    console.log('\n🔧 Simulando desactivación...');
    
    // Simular desactivación legacy
    const legacyDeactivatedCount = AlertModel.deactivateAllByUserId(user.id);
    console.log(`   Legacy alerts desactivadas: ${legacyDeactivatedCount}`);
    
    // Simular desactivación mensual
    let monthlyDeactivatedCount = 0;
    for (const alert of monthlyAlerts) {
      if (alert.isActive) {
        const success = alertManager.deactivateAlert(alert.id, user.id);
        console.log(`   Desactivando alert ${alert.id}: ${success ? 'ÉXITO' : 'FALLO'}`);
        if (success) {
          monthlyDeactivatedCount++;
        }
      }
    }
    
    const totalDeactivated = legacyDeactivatedCount + monthlyDeactivatedCount;
    console.log(`\n📊 Resultado total:`);
    console.log(`   - Legacy desactivadas: ${legacyDeactivatedCount}`);
    console.log(`   - Mensual desactivadas: ${monthlyDeactivatedCount}`);
    console.log(`   - Total desactivadas: ${totalDeactivated}`);
    
    if (totalDeactivated === 0) {
      console.log('\n❌ PROBLEMA ENCONTRADO: No se desactivaron alertas pero deberían haber algunas activas');
    } else {
      console.log('\n✅ Las alertas se desactivaron correctamente');
    }
    
  } catch (error) {
    console.error('❌ Error durante el debugging:', error);
  }
}

// Ejecutar debugging
debugClearAllButton().catch(console.error);
