#!/usr/bin/env ts-node
/**
 * Test script to verify PostgreSQL database connection and unified system
 */
import 'dotenv/config';
import { DatabaseManager } from '../src/database/prisma';

async function testDatabaseConnection() {
  console.log('🔍 Testing unified PostgreSQL database connection...');
  
  try {
    const dbManager = DatabaseManager.getInstance();
    
    // Test connection by getting stats
    const stats = await dbManager.getStats();
    console.log('✅ Database connection successful!');
    console.log('📊 Database statistics:');
    console.log(`   - Users: ${stats.totalUsers}`);
    console.log(`   - Active alerts: ${stats.activeAlerts}`);
    console.log(`   - Price records: ${stats.totalPriceRecords}`);
    console.log(`   - Notifications sent: ${stats.notificationsSent}`);
    
    // Test health check
    const isHealthy = await dbManager.healthCheck();
    console.log(`🏥 Database health: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    
    await dbManager.close();
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabaseConnection();
