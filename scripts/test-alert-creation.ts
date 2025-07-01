#!/usr/bin/env npx tsx

import { AlertManager } from '../src/services/AlertManager';
import { ArajetPassenger } from '../src/types/arajet-api';

async function testAlertCreation() {
  console.log('🧪 Testing Monthly Alert Creation...\n');

  try {
    const alertManager = new AlertManager('./data/test-alerts.db');
    
    // Datos similares a la consulta de Arajet
    const passengers: ArajetPassenger[] = [
      { code: 'ADT', count: 2 },
      { code: 'CHD', count: 1 },
      { code: 'INF', count: 1 }
    ];

    console.log('📅 Creating monthly alert:');
    console.log(`👥 Passengers: ${JSON.stringify(passengers)}`);
    console.log('🛫 Route: SCL → PUJ');
    console.log('💰 Max price: $800 USD');
    console.log('📅 Month: 2026-02\n');

    const alert = alertManager.createAlert(
      12345, // userId
      67890, // chatId  
      'SCL',
      'PUJ',
      800,
      passengers,
      '2026-02'
    );

    console.log('✅ Alert created successfully!');
    console.log('🆔 Alert ID:', alert.id);
    console.log('📍 Route:', `${alert.fromAirport} → ${alert.toAirport}`);
    console.log('💰 Max Price:', `$${alert.maxPrice} ${alert.currency}`);
    console.log('👥 Passengers:', JSON.stringify(alert.passengers));
    console.log('📅 Search Month:', alert.searchMonth);
    console.log('⏰ Created At:', alert.createdAt.toISOString());

    // Test getting user alerts
    console.log('\n📋 Getting user alerts...');
    const userAlerts = alertManager.getUserAlerts(12345);
    console.log(`Found ${userAlerts.length} alerts for user`);
    
    userAlerts.forEach((userAlert, index) => {
      console.log(`   ${index + 1}. ${userAlert.fromAirport} → ${userAlert.toAirport} (Max: $${userAlert.maxPrice})`);
    });

    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Error in test:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

// Ejecutar test
testAlertCreation().catch(console.error);
