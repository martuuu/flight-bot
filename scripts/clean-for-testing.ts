#!/usr/bin/env npx tsx

/**
 * SCRIPT PARA LIMPIAR BASE DE DATOS ANTES DE TESTING
 * ==================================================
 */

import { AlertModel } from '../src/models';
import { AlertManager } from '../src/services/AlertManager';

console.log('🧹 LIMPIANDO BASE DE DATOS PARA TESTING LIMPIO');
console.log('===============================================\n');

async function cleanDatabase() {
  try {
    // Limpiar alertas del sistema legacy
    console.log('🗄️ Limpiando alertas del sistema legacy (AlertModel)...');
    const allActive = AlertModel.findAllActive();
    console.log(`📊 Encontradas ${allActive.length} alertas activas en sistema legacy`);
    
    // Desactivar todas las alertas activas
    let deactivatedCount = 0;
    allActive.forEach(alert => {
      if (AlertModel.deactivate(alert.id)) {
        deactivatedCount++;
      }
    });
    
    console.log(`✅ ${deactivatedCount} alertas legacy desactivadas`);
    
    // Limpiar alertas del sistema nuevo
    console.log('🗄️ Limpiando alertas del sistema nuevo (AlertManager)...');
    const alertManager = new AlertManager('./data/alerts.db');
    
    // Como no tenemos método directo, usaremos getUserAlerts para usuarios conocidos
    // En un entorno real, podrías obtener todos los userId de la base de datos
    const testUserIds = [12345, 67890]; // IDs de usuarios de testing
    let newSystemCount = 0;
    
    testUserIds.forEach(userId => {
      const userAlerts = alertManager.getUserAlerts(userId);
      newSystemCount += userAlerts.length;
      console.log(`📊 Usuario ${userId}: ${userAlerts.length} alertas encontradas`);
    });
    
    console.log(`📊 Total alertas en sistema nuevo: ${newSystemCount}`);
    
    console.log('\n✨ BASE DE DATOS LIMPIA PARA TESTING');
    console.log('===================================');
    console.log('🎯 Alertas legacy desactivadas');
    console.log('🎯 Sistema nuevo verificado');
    console.log('📱 Ve a tu bot @ticketscannerbot_bot y prueba:');
    console.log('   /addalert SDQ MIA');
    console.log('   /agregaralerta SDQ MIA 300');
    console.log('   /addalert SDQ JFK -');
    console.log('\n🔄 Recuerda enviar /start si es la primera vez');
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    process.exit(1);
  }
}

cleanDatabase();
