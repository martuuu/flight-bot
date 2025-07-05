/**
 * Test completo del flujo de vinculación Telegram-Webapp
 * Este script simula el proceso completo de vinculación:
 * 1. Generación de código desde webapp
 * 2. Confirmación desde bot
 * 3. Verificación de sincronización
 * 4. Prueba de desvinculación
 */

const fs = require('fs').promises;
const path = require('path');

// Configuración
const WEBAPP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const TEST_USER_EMAIL = 'test.linking@example.com';
const TEST_TELEGRAM_ID = '999999999';
const TEST_TELEGRAM_USERNAME = 'test_linking_user';

console.log('🚀 Iniciando test completo de vinculación Telegram-Webapp...\n');

async function testLinkingFlow() {
  try {
    console.log('1️⃣ Testing: Generación de código de vinculación...');
    
    // Simular llamada desde webapp autenticada
    const initiateResponse = await fetch(`${WEBAPP_URL}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // En un test real, aquí iría el cookie de sesión
      },
      body: JSON.stringify({
        action: 'initiate'
      })
    });

    if (!initiateResponse.ok) {
      console.log('❌ Error en generación de código:', await initiateResponse.text());
      return false;
    }

    const initiateResult = await initiateResponse.json();
    
    if (!initiateResult.success || !initiateResult.linkingCode) {
      console.log('❌ No se generó código de vinculación:', initiateResult);
      return false;
    }

    console.log(`✅ Código generado: ${initiateResult.linkingCode}`);
    console.log(`⏰ Expira en: ${new Date(initiateResult.expiresAt).toLocaleString()}\n`);

    // 2. Simular confirmación desde bot
    console.log('2️⃣ Testing: Confirmación desde bot...');
    
    const confirmResponse = await fetch(`${WEBAPP_URL}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'confirm_from_bot',
        telegramId: TEST_TELEGRAM_ID,
        telegramUsername: TEST_TELEGRAM_USERNAME,
        telegramFirstName: 'Test',
        telegramLastName: 'User',
        linkingCode: initiateResult.linkingCode
      })
    });

    if (!confirmResponse.ok) {
      console.log('❌ Error en confirmación:', await confirmResponse.text());
      return false;
    }

    const confirmResult = await confirmResponse.json();
    
    if (!confirmResult.success) {
      console.log('❌ Falló confirmación:', confirmResult);
      return false;
    }

    console.log('✅ Vinculación confirmada exitosamente');
    console.log('✅ Usuario sincronizado:', confirmResult.user);
    console.log('💬 Mensaje:', confirmResult.message);

    // 3. Verificar que no se puede usar el mismo código dos veces
    console.log('\n3️⃣ Testing: Reutilización de código (debe fallar)...');
    
    const reuseResponse = await fetch(`${WEBAPP_URL}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'confirm_from_bot',
        telegramId: TEST_TELEGRAM_ID,
        telegramUsername: TEST_TELEGRAM_USERNAME,
        telegramFirstName: 'Test',
        telegramLastName: 'User',
        linkingCode: initiateResult.linkingCode
      })
    });

    const reuseResult = await reuseResponse.json();
    
    if (reuseResult.success) {
      console.log('❌ ERROR: El código se pudo reutilizar (debería fallar)');
      return false;
    }

    console.log('✅ Código correctamente invalidado después del uso');

    // 4. Test de código inválido
    console.log('\n4️⃣ Testing: Código inválido...');
    
    const invalidResponse = await fetch(`${WEBAPP_URL}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'confirm_from_bot',
        telegramId: TEST_TELEGRAM_ID,
        telegramUsername: TEST_TELEGRAM_USERNAME,
        telegramFirstName: 'Test',
        telegramLastName: 'User',
        linkingCode: '999999'
      })
    });

    const invalidResult = await invalidResponse.json();
    
    if (invalidResult.success) {
      console.log('❌ ERROR: Código inválido fue aceptado');
      return false;
    }

    console.log('✅ Código inválido correctamente rechazado');

    return true;

  } catch (error) {
    console.error('❌ Error en test:', error);
    return false;
  }
}

async function testEndpointAvailability() {
  try {
    console.log('🔍 Verificando disponibilidad de endpoints...\n');

    // Test basic connectivity
    const healthResponse = await fetch(`${WEBAPP_URL}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'invalid_action'
      })
    });

    if (healthResponse.status === 400) {
      const result = await healthResponse.json();
      if (result.error === 'Acción no válida') {
        console.log('✅ Endpoint responde correctamente');
        return true;
      }
    }

    console.log('❌ Endpoint no responde como se esperaba');
    return false;

  } catch (error) {
    console.error('❌ Error conectando con endpoint:', error);
    return false;
  }
}

async function runComprehensiveTest() {
  console.log('🧪 INICIANDO TESTS DE VINCULACIÓN TELEGRAM-WEBAPP');
  console.log('='.repeat(60));
  console.log(`🌐 Webapp URL: ${WEBAPP_URL}`);
  console.log(`📱 Test Telegram ID: ${TEST_TELEGRAM_ID}`);
  console.log('='.repeat(60) + '\n');

  // 1. Test de disponibilidad
  const endpointOk = await testEndpointAvailability();
  if (!endpointOk) {
    console.log('\n❌ FALLO: Endpoint no disponible');
    console.log('💡 Solución: Verificar que la webapp esté corriendo en', WEBAPP_URL);
    return;
  }

  // 2. Test del flujo principal
  const flowOk = await testLinkingFlow();
  
  console.log('\n' + '='.repeat(60));
  if (flowOk) {
    console.log('✅ TODOS LOS TESTS PASARON - VINCULACIÓN FUNCIONA CORRECTAMENTE');
    console.log('\n🎉 El sistema de vinculación está listo para usar!');
    
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('1. Integrar TelegramLinkImproved.tsx en la UI principal');
    console.log('2. Testear con usuarios reales');
    console.log('3. Configurar persistencia para códigos (Redis en producción)');
    console.log('4. Actualizar documentación de onboarding');
    
  } else {
    console.log('❌ ALGUNOS TESTS FALLARON - REVISAR IMPLEMENTACIÓN');
    
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Verificar que la webapp esté corriendo');
    console.log('2. Verificar conexión a base de datos');
    console.log('3. Revisar logs de errores en webapp');
    console.log('4. Verificar variables de entorno');
  }
  console.log('='.repeat(60));
}

// Función para generar reporte de estado del sistema
async function generateSystemReport() {
  const report = {
    timestamp: new Date().toISOString(),
    webapp_url: WEBAPP_URL,
    endpoint_status: 'unknown',
    linking_flow_status: 'unknown',
    database_schema_ready: 'unknown',
    bot_command_ready: 'unknown'
  };

  try {
    // Test endpoint
    const endpointOk = await testEndpointAvailability();
    report.endpoint_status = endpointOk ? 'operational' : 'failed';

    // Test linking flow
    const flowOk = await testLinkingFlow();
    report.linking_flow_status = flowOk ? 'operational' : 'failed';

    // Los otros checks requerirían acceso directo a DB y archivos
    report.database_schema_ready = 'assumed_ready'; // Se asume que Prisma está configurado
    report.bot_command_ready = 'assumed_ready'; // Se asume que el comando /link está implementado

    console.log('\n📊 REPORTE DEL SISTEMA:');
    console.log(JSON.stringify(report, null, 2));

    // Guardar reporte
    await fs.writeFile(
      path.join(__dirname, `linking-system-report-${Date.now()}.json`),
      JSON.stringify(report, null, 2)
    );

    console.log('\n💾 Reporte guardado como linking-system-report-*.json');

  } catch (error) {
    console.error('Error generando reporte:', error);
  }
}

// Ejecutar tests
if (require.main === module) {
  runComprehensiveTest()
    .then(() => generateSystemReport())
    .catch(console.error);
}

module.exports = {
  testLinkingFlow,
  testEndpointAvailability,
  runComprehensiveTest
};
