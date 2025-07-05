#!/usr/bin/env node
/**
 * Script seguro para iniciar el bot - verifica que no haya instancias corriendo
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function startBotSafely() {
    console.log('🚀 Iniciando bot de forma segura...\n');
    
    try {
        // 1. Verificar si hay instancias ejecutándose
        console.log('🔍 Verificando instancias existentes...');
        
        let hasRunningInstances = false;
        
        // Verificar PM2
        try {
            const { stdout: pm2List } = await execAsync('pm2 list --no-color');
            if (pm2List.includes('flight-bot') && pm2List.includes('online')) {
                console.log('❌ PM2 tiene una instancia del bot ejecutándose');
                hasRunningInstances = true;
            }
        } catch (error) {
            // PM2 no instalado o sin procesos
        }
        
        // Verificar procesos de Node.js
        try {
            const { stdout } = await execAsync('ps aux | grep -E "(start-bot|flight-bot)" | grep -v grep');
            if (stdout.trim()) {
                console.log('❌ Hay procesos del bot ejecutándose');
                hasRunningInstances = true;
            }
        } catch (error) {
            // No hay procesos
        }
        
        if (hasRunningInstances) {
            console.log('\n⚠️  Se detectaron instancias del bot ejecutándose');
            console.log('💡 Ejecuta primero: node stop-all-bots.js');
            console.log('   Luego vuelve a ejecutar este script');
            return;
        }
        
        console.log('✅ No hay instancias ejecutándose\n');
        
        // 2. Iniciar el bot
        console.log('🔄 Iniciando bot...');
        console.log('📱 Presiona Ctrl+C para detener el bot\n');
        
        // Usar spawn en lugar de exec para mantener la salida en tiempo real
        const { spawn } = require('child_process');
        const bot = spawn('npm', ['run', 'dev:bot'], {
            stdio: 'inherit',
            cwd: process.cwd()
        });
        
        bot.on('close', (code) => {
            console.log(`\n🛑 Bot detenido con código ${code}`);
        });
        
        // Manejar Ctrl+C
        process.on('SIGINT', () => {
            console.log('\n🛑 Deteniendo bot...');
            bot.kill('SIGINT');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

startBotSafely().catch(console.error);
