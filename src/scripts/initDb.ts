#!/usr/bin/env ts-node

import { db } from '../database';
import { botLogger } from '../utils/logger';
import path from 'path';

/**
 * Script para inicializar la base de datos
 */
async function initializeDatabase(): Promise<void> {
  try {
    botLogger.info('🔧 Inicializando base de datos...');

    // La inicialización se hace automáticamente en el constructor de DatabaseManager
    // Solo necesitamos obtener la instancia
    const stats = db.getStats();
    
    botLogger.info('✅ Base de datos inicializada exitosamente', {
      path: path.resolve(process.cwd(), 'data/flights.db'),
      stats,
    });

    // Verificar integridad
    const isHealthy = await db.checkIntegrity();
    if (isHealthy) {
      botLogger.info('✅ Verificación de integridad: OK');
    } else {
      botLogger.error('❌ Problemas de integridad detectados');
      process.exit(1);
    }

    botLogger.info('🎉 Base de datos lista para usar');

  } catch (error) {
    botLogger.error('❌ Error inicializando base de datos', error as Error);
    process.exit(1);
  }
}

// Ejecutar script si es llamado directamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}
