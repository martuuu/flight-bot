#!/usr/bin/env node

/**
 * Herramientas de Desarrollo para Flight Bot
 * 
 * Centraliza todas las tareas de desarrollo y mantenimiento:
 * - Compilación del proyecto
 * - Pruebas automatizadas
 * - Monitoreo de tokens
 * - Limpieza de archivos
 * - Verificación de estado
 * 
 * Uso:
 * npx ts-node scripts/dev-tools.ts <command> [options]
 * 
 * Comandos disponibles:
 * - build: Compilar proyecto
 * - test: Ejecutar pruebas
 * - clean: Limpiar archivos temporales
 * - status: Verificar estado del sistema
 * - token: Monitorear token de Aerolíneas
 * - help: Mostrar ayuda
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.join(__dirname, '..');

interface Command {
  name: string;
  description: string;
  action: () => Promise<void> | void;
}

const commands: Command[] = [
  {
    name: 'build',
    description: 'Compilar el proyecto TypeScript',
    action: async () => {
      console.log('🔨 Compilando proyecto...');
      try {
        execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit' });
        console.log('✅ Compilación exitosa');
      } catch (error) {
        console.error('❌ Error en compilación:', error);
        process.exit(1);
      }
    }
  },
  {
    name: 'test',
    description: 'Ejecutar pruebas automatizadas',
    action: async () => {
      console.log('🧪 Ejecutando pruebas...');
      try {
        execSync('npx ts-node scripts/test-bot-functionality.ts', { 
          cwd: PROJECT_ROOT, 
          stdio: 'inherit' 
        });
        console.log('✅ Pruebas completadas');
      } catch (error) {
        console.error('❌ Error en pruebas:', error);
        process.exit(1);
      }
    }
  },
  {
    name: 'clean',
    description: 'Limpiar archivos temporales y cache',
    action: () => {
      console.log('🧹 Limpiando archivos temporales...');
      
      const cleanPaths = [
        'dist',
        'node_modules/.cache',
        'logs/pm2-*.log',
        '.DS_Store'
      ];
      
      cleanPaths.forEach(cleanPath => {
        const fullPath = path.join(PROJECT_ROOT, cleanPath);
        try {
          if (fs.existsSync(fullPath)) {
            if (fs.lstatSync(fullPath).isDirectory()) {
              fs.rmSync(fullPath, { recursive: true, force: true });
              console.log(`  🗑️  Eliminado directorio: ${cleanPath}`);
            } else {
              fs.unlinkSync(fullPath);
              console.log(`  🗑️  Eliminado archivo: ${cleanPath}`);
            }
          }
        } catch (error) {
          console.warn(`  ⚠️  No se pudo eliminar: ${cleanPath}`);
        }
      });
      
      console.log('✅ Limpieza completada');
    }
  },
  {
    name: 'status',
    description: 'Verificar estado del sistema',
    action: async () => {
      console.log('📊 Verificando estado del sistema...\n');
      
      // Verificar archivos clave
      const keyFiles = [
        'src/index.ts',
        'src/services/AerolineasAlertService.ts',
        'src/config/aerolineas-airports.ts',
        'package.json'
      ];
      
      console.log('📁 Archivos clave:');
      keyFiles.forEach(file => {
        const exists = fs.existsSync(path.join(PROJECT_ROOT, file));
        console.log(`  ${exists ? '✅' : '❌'} ${file}`);
      });
      
      // Verificar estado de compilación
      console.log('\n🔨 Estado de compilación:');
      try {
        execSync('npx tsc --noEmit', { cwd: PROJECT_ROOT, stdio: 'pipe' });
        console.log('  ✅ Sin errores de TypeScript');
      } catch (error) {
        console.log('  ❌ Hay errores de TypeScript');
      }
      
      // Verificar token
      console.log('\n🔐 Estado del token:');
      try {
        execSync('npx ts-node scripts/monitor-token.ts status', { 
          cwd: PROJECT_ROOT, 
          stdio: 'inherit' 
        });
      } catch (error) {
        console.log('  ❌ Error verificando token');
      }
    }
  },
  {
    name: 'token',
    description: 'Monitorear token de Aerolíneas',
    action: async () => {
      const subCommand = process.argv[3] || 'status';
      console.log(`🔐 Ejecutando monitor de token: ${subCommand}`);
      
      try {
        execSync(`npx ts-node scripts/monitor-token.ts ${subCommand}`, { 
          cwd: PROJECT_ROOT, 
          stdio: 'inherit' 
        });
      } catch (error) {
        console.error('❌ Error en monitor de token:', error);
        process.exit(1);
      }
    }
  },
  {
    name: 'help',
    description: 'Mostrar esta ayuda',
    action: () => {
      console.log('🛠️  Herramientas de Desarrollo - Flight Bot\n');
      console.log('Comandos disponibles:\n');
      
      commands.forEach(cmd => {
        console.log(`  ${cmd.name.padEnd(10)} - ${cmd.description}`);
      });
      
      console.log('\nEjemplos:');
      console.log('  npx ts-node scripts/dev-tools.ts build');
      console.log('  npx ts-node scripts/dev-tools.ts test');
      console.log('  npx ts-node scripts/dev-tools.ts token extract');
      console.log('  npx ts-node scripts/dev-tools.ts status');
    }
  }
];

async function main() {
  const command = process.argv[2];
  
  if (!command) {
    console.log('❌ Comando requerido. Usa "help" para ver opciones.');
    process.exit(1);
  }
  
  const cmd = commands.find(c => c.name === command);
  
  if (!cmd) {
    console.log(`❌ Comando desconocido: ${command}`);
    console.log('Usa "help" para ver comandos disponibles.');
    process.exit(1);
  }
  
  try {
    await cmd.action();
  } catch (error) {
    console.error('❌ Error ejecutando comando:', error);
    process.exit(1);
  }
}

main().catch(console.error);
