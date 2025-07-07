#!/usr/bin/env node

import { aerolineasAlertModelPrisma } from './src/models/AerolineasAlertModelPrisma.js';

// Test creating an Aerolineas alert
async function testAerolineasAlert() {
  try {
    console.log('Testing AerolineasAlertModelPrisma...');
    
    const testData = {
      origin: 'EZE',
      destination: 'MDZ',
      departureDate: '2025-08-15',
      adults: 1,
      telegramUserId: '123456789',
      cabinClass: 'Economy',
      searchType: 'PROMO'
    };
    
    console.log('Creating alert with data:', testData);
    
    const alert = await aerolineasAlertModelPrisma.create(testData);
    console.log('Alert created successfully:', {
      id: alert.id,
      origin: alert.origin,
      destination: alert.destination,
      userId: alert.userId
    });
    
    // Test finding alerts by telegram user
    console.log('\nFinding alerts by telegram user...');
    const alerts = await aerolineasAlertModelPrisma.findByTelegramUserId('123456789');
    console.log('Found alerts:', alerts.length);
    
    // Test count
    const count = await aerolineasAlertModelPrisma.count();
    console.log('Total active alerts:', count);
    
    console.log('\n✅ AerolineasAlertModelPrisma test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAerolineasAlert();
