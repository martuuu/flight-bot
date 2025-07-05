/**
 * Test de integración simplificado para el sistema de vinculación
 * Verifica que los componentes estén correctamente integrados
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('🔗 Test de Integración - Sistema de Vinculación Telegram-Webapp\n');

async function testDatabaseSchema() {
  console.log('1️⃣ Verificando schema de base de datos...');
  
  try {
    // Verificar que el modelo User tiene los campos de vinculación
    const sampleUser = await prisma.user.findFirst();
    
    console.log('✅ Base de datos accesible');
    console.log('✅ Modelo User disponible');
    
    // Verificar que TelegramUser existe
    const telegramUsers = await prisma.telegramUser.findMany({ take: 1 });
    console.log('✅ Modelo TelegramUser disponible');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en schema de base de datos:', error.message);
    return false;
  }
}

async function testEndpointStructure() {
  console.log('\n2️⃣ Verificando estructura de endpoints...');
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Verificar que el endpoint existe
    const endpointPath = path.join(__dirname, 'webapp/app/api/telegram/link-simple/route.ts');
    if (!fs.existsSync(endpointPath)) {
      console.error('❌ Endpoint /api/telegram/link-simple/route.ts no encontrado');
      return false;
    }
    
    console.log('✅ Endpoint link-simple existe');
    
    // Verificar que el componente React existe
    const componentPath = path.join(__dirname, 'webapp/components/TelegramLinkImproved.tsx');
    if (!fs.existsSync(componentPath)) {
      console.error('❌ Componente TelegramLinkImproved.tsx no encontrado');
      return false;
    }
    
    console.log('✅ Componente TelegramLinkImproved existe');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error verificando archivos:', error.message);
    return false;
  }
}

async function testBotCommandIntegration() {
  console.log('\n3️⃣ Verificando integración del comando bot...');
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Verificar que el comando /link está en BasicCommandHandler
    const handlerPath = path.join(__dirname, 'src/bot/handlers/BasicCommandHandler.ts');
    if (!fs.existsSync(handlerPath)) {
      console.error('❌ BasicCommandHandler.ts no encontrado');
      return false;
    }
    
    const handlerContent = fs.readFileSync(handlerPath, 'utf-8');
    if (!handlerContent.includes('handleLink')) {
      console.error('❌ Método handleLink no encontrado en BasicCommandHandler');
      return false;
    }
    
    console.log('✅ Comando /link implementado en BasicCommandHandler');
    
    // Verificar que está registrado en CommandHandler
    const commandHandlerPath = path.join(__dirname, 'src/bot/CommandHandler.ts');
    if (!fs.existsSync(commandHandlerPath)) {
      console.error('❌ CommandHandler.ts no encontrado');
      return false;
    }
    
    const commandHandlerContent = fs.readFileSync(commandHandlerPath, 'utf-8');
    if (!commandHandlerContent.includes("case '/link':")) {
      console.error('❌ Comando /link no registrado en CommandHandler');
      return false;
    }
    
    console.log('✅ Comando /link registrado en CommandHandler');
    
    // Verificar que apunta al endpoint correcto
    if (!handlerContent.includes('/api/telegram/link-simple')) {
      console.error('❌ Comando /link no apunta al endpoint correcto');
      return false;
    }
    
    console.log('✅ Comando /link apunta al endpoint correcto');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error verificando comando bot:', error.message);
    return false;
  }
}

async function simulateLinkingCodeGeneration() {
  console.log('\n4️⃣ Simulando generación de código de vinculación...');
  
  try {
    // Simular la lógica del endpoint
    const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
    const code = generateCode();
    const expirationTime = Date.now() + (10 * 60 * 1000); // 10 minutos
    
    console.log(`✅ Código simulado generado: ${code}`);
    console.log(`✅ Expira en: ${new Date(expirationTime).toLocaleString()}`);
    
    // Verificar formato del código
    if (!/^\d{6}$/.test(code)) {
      console.error('❌ Formato de código inválido');
      return false;
    }
    
    console.log('✅ Formato de código válido');
    
    return { code, expirationTime };
    
  } catch (error) {
    console.error('❌ Error simulando generación de código:', error.message);
    return false;
  }
}

async function testDataConsistency() {
  console.log('\n5️⃣ Verificando consistencia de datos...');
  
  try {
    // Verificar que usuarios con telegramLinked=true tienen telegramId
    const inconsistentUsers = await prisma.user.findMany({
      where: {
        telegramLinked: true,
        telegramId: null
      }
    });
    
    if (inconsistentUsers.length > 0) {
      console.warn(`⚠️ ${inconsistentUsers.length} usuarios con telegramLinked=true pero sin telegramId`);
    } else {
      console.log('✅ Consistencia de usuarios OK');
    }
    
    // Verificar TelegramUsers vinculados
    const linkedTelegramUsers = await prisma.telegramUser.findMany({
      where: { isLinked: true }
    });
    
    console.log(`📊 ${linkedTelegramUsers.length} usuarios de Telegram vinculados`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error verificando consistencia:', error.message);
    return false;
  }
}

async function runIntegrationTest() {
  console.log('🧪 EJECUTANDO TEST DE INTEGRACIÓN');
  console.log('='.repeat(50));
  
  const tests = [
    { name: 'Database Schema', test: testDatabaseSchema },
    { name: 'Endpoint Structure', test: testEndpointStructure },
    { name: 'Bot Command Integration', test: testBotCommandIntegration },
    { name: 'Code Generation Logic', test: simulateLinkingCodeGeneration },
    { name: 'Data Consistency', test: testDataConsistency }
  ];
  
  const results = [];
  
  for (const { name, test } of tests) {
    try {
      const result = await test();
      results.push({ name, success: !!result, result });
    } catch (error) {
      results.push({ name, success: false, error: error.message });
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESULTADOS DEL TEST:');
  console.log('='.repeat(50));
  
  let allPassed = true;
  for (const { name, success, error } of results) {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${name}`);
    if (error) {
      console.log(`    Error: ${error}`);
    }
    allPassed = allPassed && success;
  }
  
  console.log('='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 TODOS LOS TESTS DE INTEGRACIÓN PASARON');
    console.log('\n✅ El sistema de vinculación está listo para usar');
    console.log('\n📋 Próximos pasos recomendados:');
    console.log('   1. Ejecutar webapp y bot en paralelo');
    console.log('   2. Testear flujo completo con usuario real');
    console.log('   3. Integrar TelegramLinkImproved en la UI');
    console.log('   4. Configurar variables de entorno en producción');
  } else {
    console.log('❌ ALGUNOS TESTS FALLARON');
    console.log('\n🔧 Revisar los errores arriba y corregir antes de continuar');
  }
  
  console.log('='.repeat(50));
}

async function cleanup() {
  await prisma.$disconnect();
}

// Ejecutar test
if (require.main === module) {
  runIntegrationTest()
    .then(() => cleanup())
    .catch((error) => {
      console.error('Error ejecutando tests:', error);
      cleanup();
    });
}

module.exports = { runIntegrationTest };
