#!/usr/bin/env npx tsx

// Script para verificar la carga de variables de entorno
console.log('🔧 Verificando carga de variables de entorno...');

// Importar la configuración que debería cargar las variables
import { config } from '../src/config';

console.log('DATABASE_URL desde process.env:', process.env.DATABASE_URL);
console.log('NEXTAUTH_URL desde process.env:', process.env.NEXTAUTH_URL);
console.log('TELEGRAM_BOT_TOKEN desde process.env:', process.env.TELEGRAM_BOT_TOKEN);

console.log('\nConfiguración procesada:');
console.log('config.database:', config.database);
console.log('config.telegram:', config.telegram);
