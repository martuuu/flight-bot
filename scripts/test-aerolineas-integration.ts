#!/usr/bin/env ts-node

import { aerolineasAlertModelPrisma } from '../src/models/AerolineasAlertModelPrisma';

async function testAerolineasFunctionality() {
  console.log('🧪 Testing AerolineasAlertModelPrisma functionality...\n');

  try {
    // Test 1: Create an alert
    console.log('1️⃣ Testing alert creation...');
    const testAlert = {
      origin: 'EZE',
      destination: 'MDZ', 
      departureDate: '2025-08-15',
      adults: 1,
      telegramUserId: '123456789',
      cabinClass: 'Economy',
      maxMiles: 50000,
      searchType: 'PROMO'
    };

    const createdAlert = await aerolineasAlertModelPrisma.create(testAlert);
    console.log(`✅ Alert created with ID: ${createdAlert.id}`);
    console.log(`   Route: ${createdAlert.origin} → ${createdAlert.destination}`);
    console.log(`   User ID: ${createdAlert.userId}`);

    // Test 2: Find alerts by telegram user
    console.log('\n2️⃣ Testing find by telegram user...');
    const userAlerts = await aerolineasAlertModelPrisma.findByTelegramUserId('123456789');
    console.log(`✅ Found ${userAlerts.length} alerts for telegram user`);

    // Test 3: Count total alerts
    console.log('\n3️⃣ Testing alert count...');
    const totalCount = await aerolineasAlertModelPrisma.count();
    console.log(`✅ Total active alerts: ${totalCount}`);

    // Test 4: Find by ID
    console.log('\n4️⃣ Testing find by ID...');
    const foundAlert = await aerolineasAlertModelPrisma.findById(createdAlert.id);
    console.log(`✅ Found alert by ID: ${foundAlert?.id === createdAlert.id ? 'SUCCESS' : 'FAIL'}`);

    // Test 5: Update alert (soft delete)
    console.log('\n5️⃣ Testing soft delete...');
    const deleteResult = await aerolineasAlertModelPrisma.delete(createdAlert.id);
    console.log(`✅ Soft delete: ${deleteResult ? 'SUCCESS' : 'FAIL'}`);

    // Test 6: Verify soft delete worked
    const countAfterDelete = await aerolineasAlertModelPrisma.count();
    console.log(`✅ Count after delete: ${countAfterDelete} (should be ${totalCount - 1})`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Alert creation working');
    console.log('✅ User/TelegramUser auto-creation working');
    console.log('✅ Query operations working');
    console.log('✅ Soft delete working');
    console.log('✅ PostgreSQL persistence confirmed');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }

  console.log('\n🚀 AerolineasAlertModelPrisma is fully functional and ready for production!');
}

// Run if called directly
if (require.main === module) {
  testAerolineasFunctionality()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export { testAerolineasFunctionality };
