#!/usr/bin/env node
/**
 * Script para detener todas las instancias del bot Telegram
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function stopAllBots() {
    console.log('🛑 Deteniendo todas las instancias del bot...\n');
    
    try {
        // 1. Detener PM2
        console.log('📦 Verificando PM2...');
        try {
            const { stdout: pm2List } = await execAsync('pm2 list --no-color');
            if (pm2List.includes('flight-bot') && pm2List.includes('online')) {
                await execAsync('pm2 stop flight-bot');
                console.log('✅ PM2: Bot detenido');
            } else {
                console.log('✅ PM2: No hay bots ejecutándose');
            }
        } catch (error) {
            console.log('✅ PM2: No instalado o sin procesos');
        }
        
        // 2. Buscar y detener procesos de Node.js relacionados con el bot
        console.log('\n🔍 Buscando procesos del bot...');
        try {
            const { stdout } = await execAsync('ps aux | grep -E "(start-bot|flight-bot)" | grep -v grep');
            if (stdout.trim()) {
                const lines = stdout.trim().split('\n');
                const pids = lines.map(line => {
                    const parts = line.trim().split(/\s+/);
                    return parts[1]; // PID está en la segunda columna
                }).filter(pid => pid && !isNaN(pid));
                
                if (pids.length > 0) {
                    await execAsync(`kill -9 ${pids.join(' ')}`);
                    console.log(`✅ Procesos terminados: ${pids.join(', ')}`);
                } else {
                    console.log('✅ No se encontraron procesos del bot');
                }
            } else {
                console.log('✅ No se encontraron procesos del bot');
            }
        } catch (error) {
            console.log('✅ No se encontraron procesos del bot');
        }
        
        console.log('\n🎉 ¡Todas las instancias del bot han sido detenidas!');
        console.log('💡 Ahora puedes iniciar el bot normalmente sin conflictos');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

stopAllBots().catch(console.error);
