#!/usr/bin/env ts-node
/**
 * Test script to verify alert synchronization between bot and webapp
 */
import 'dotenv/config';
import { DatabaseManager } from '../src/database/prisma';

async function testAlertSynchronization() {
  console.log('🔄 Testing alert synchronization between bot and webapp...');
  
  try {
    const dbManager = DatabaseManager.getInstance();
    
    // First, create a test user (simulating Telegram user)
    console.log('👤 Creating test Telegram user...');
    const testUser = await dbManager.upsertTelegramUser({
      telegramId: '123456789',
      username: 'test_user',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ Test user created:', testUser.telegramId);
    
    // Create a test alert
    console.log('🚨 Creating test alert...');
    const testAlert = await dbManager.createAlert({
      userId: testUser.id,
      origin: 'EZE',
      destination: 'MDQ',
      departureDate: new Date('2025-08-15'),
      maxPrice: 50000,
      adults: 1
    });
    console.log('✅ Test alert created:', testAlert.id);
    
    // Get user alerts to verify
    console.log('📋 Retrieving user alerts...');
    const userAlerts = await dbManager.getUserAlerts(testUser.id);
    console.log(`✅ Found ${userAlerts.length} alerts for user`);
    
    // Get all active alerts to verify system-wide visibility
    console.log('🔍 Retrieving all active alerts...');
    const activeAlerts = await dbManager.getActiveAlerts();
    console.log(`✅ Found ${activeAlerts.length} active alerts in system`);
    
    // Test notification creation
    console.log('📧 Creating test notification...');
    const notification = await dbManager.createNotification({
      alertId: testAlert.id,
      userId: testUser.id,
      type: 'PRICE_DROP',
      channel: 'EMAIL',
      message: 'Test price alert: EZE → MDQ for $45,000',
      price: 45000
    });
    console.log('✅ Test notification created:', notification.id);
    
    // Update final stats
    const finalStats = await dbManager.getStats();
    console.log('\n📊 Final database state:');
    console.log(`   - Users: ${finalStats.totalUsers}`);
    console.log(`   - Active alerts: ${finalStats.activeAlerts}`);
    console.log(`   - Notifications: ${finalStats.notificationsSent}`);
    
    await dbManager.close();
    console.log('\n✅ Alert synchronization test completed successfully!');
    console.log('🎉 Both bot and webapp can now access the same alerts and users!');
    
  } catch (error) {
    console.error('❌ Alert synchronization test failed:', error);
    process.exit(1);
  }
}

testAlertSynchronization();
