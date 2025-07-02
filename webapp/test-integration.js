#!/usr/bin/env node

const fetch = require('node-fetch');

async function testWebappIntegration() {
    console.log('🧪 Iniciando tests de integración Webapp-Bot...\n');

    const baseUrl = 'http://localhost:3000';
    const telegramId = 123456789;

    try {
        // Test 1: Verificar que la API de alertas responde
        console.log('📡 Test 1: Verificando endpoint de API...');
        const response = await fetch(`${baseUrl}/api/bot-alerts?telegramId=${telegramId}`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ API responde correctamente');
            console.log(`📊 Alertas encontradas: ${data.alerts ? data.alerts.length : 0}`);
        } else {
            console.log('❌ Error en API:', data.error);
        }

        // Test 2: Crear una alerta de prueba
        console.log('\n🎯 Test 2: Creando alerta de prueba...');
        const testAlert = {
            telegramId: telegramId,
            origin: 'MIA',
            destination: 'PUJ',
            maxPrice: 350,
            currency: 'USD',
            adults: 1,
            children: 0,
            infants: 0,
            alertType: 'MONTHLY',
            isActive: true,
            isPaused: false
        };

        const createResponse = await fetch(`${baseUrl}/api/bot-alerts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testAlert),
        });

        const createData = await createResponse.json();
        
        if (createResponse.ok) {
            console.log('✅ Alerta creada exitosamente');
            console.log(`🆔 ID de alerta: ${createData.alert?.id}`);
        } else {
            console.log('❌ Error creando alerta:', createData.error);
        }

        // Test 3: Verificar que la alerta se guarda en la DB
        console.log('\n🔍 Test 3: Verificando alerta en base de datos...');
        const verifyResponse = await fetch(`${baseUrl}/api/bot-alerts?telegramId=${telegramId}`);
        const verifyData = await verifyResponse.json();
        
        if (verifyResponse.ok && verifyData.alerts.length > 0) {
            console.log('✅ Alerta encontrada en la base de datos');
            console.log(`📈 Total de alertas: ${verifyData.alerts.length}`);
            
            // Mostrar detalles de la última alerta
            const lastAlert = verifyData.alerts[verifyData.alerts.length - 1];
            console.log(`📋 Última alerta: ${lastAlert.origin} → ${lastAlert.destination} ($${lastAlert.maxPrice})`);
        } else {
            console.log('❌ No se encontraron alertas o error en verificación');
        }

        console.log('\n🎉 Tests de integración completados!');
        
    } catch (error) {
        console.error('❌ Error durante los tests:', error.message);
    }
}

// Ejecutar tests
testWebappIntegration();
