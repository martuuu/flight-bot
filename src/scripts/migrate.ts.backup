#!/usr/bin/env ts-node

import { db } from '../database';
import { botLogger } from '../utils/logger';

/**
 * Script para ejecutar migraciones de base de datos
 */
async function runMigrations(): Promise<void> {
  try {
    botLogger.info('🔄 Ejecutando migraciones de base de datos...');

    // Por ahora, las migraciones son básicas
    // En el futuro se pueden agregar scripts de migración más complejos
    
    // Verificar que todas las tablas existan
    const connection = db.getConnection();
    
    const tables = [
      'users',
      'alerts', 
      'price_history',
      'notifications_sent',
      'system_config',
      'error_logs'
    ];

    for (const table of tables) {
      const result = connection.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name=?
      `).get(table);

      if (result) {
        botLogger.info(`✅ Tabla verificada: ${table}`);
      } else {
        botLogger.error(`❌ Tabla faltante: ${table}`);
        throw new Error(`Tabla requerida no encontrada: ${table}`);
      }
    }

    // Verificar configuración del sistema
    const configCount = connection.prepare(`
      SELECT COUNT(*) as count FROM system_config
    `).get() as { count: number };

    if (configCount.count === 0) {
      botLogger.warn('⚠️ No hay configuración del sistema, ejecutando inicialización...');
      // La inicialización se hace automáticamente con el schema SQL
    }

    botLogger.info('✅ Migraciones completadas exitosamente');

  } catch (error) {
    botLogger.error('❌ Error ejecutando migraciones', error as Error);
    process.exit(1);
  }
}

// Ejecutar script si es llamado directamente
if (require.main === module) {
  runMigrations()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}
