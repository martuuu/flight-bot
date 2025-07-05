#!/usr/bin/env node
/**
 * Test completo de conectividad PostgreSQL + Prisma
 */

const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

async function testPostgreSQLConnection() {
    console.log('\n🔍 TESTING POSTGRESQL + PRISMA CONNECTIVITY\n');
    
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
    
    try {
        console.log('1️⃣ Testing basic Prisma connection...');
        await prisma.$connect();
        console.log('✅ Prisma connected successfully');
        
        console.log('\n2️⃣ Testing database accessibility...');
        const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
        console.log('✅ Database query successful:', result);
        
        console.log('\n3️⃣ Testing schema tables...');
        
        // Test TelegramUser table
        console.log('   📋 Testing TelegramUser table...');
        const userCount = await prisma.telegramUser.count();
        console.log(`   ✅ TelegramUser table accessible (${userCount} records)`);
        
        // Test FlightAlert table  
        console.log('   📋 Testing FlightAlert table...');
        const alertCount = await prisma.flightAlert.count();
        console.log(`   ✅ FlightAlert table accessible (${alertCount} records)`);
        
        // Test User table (webapp)
        console.log('   📋 Testing User table (webapp)...');
        const webappUserCount = await prisma.user.count();
        console.log(`   ✅ User table accessible (${webappUserCount} records)`);
        
        console.log('\n4️⃣ Testing CRUD operations...');
        
        // Test create operation
        console.log('   📝 Testing CREATE...');
        const testUser = await prisma.telegramUser.create({
            data: {
                telegramId: '999999999',
                username: 'test_user',
                firstName: 'Test',
                lastName: 'User'
            }
        });
        console.log('   ✅ CREATE successful:', testUser.id);
        
        // Test read operation
        console.log('   📖 Testing READ...');
        const foundUser = await prisma.telegramUser.findUnique({
            where: { telegramId: '999999999' }
        });
        console.log('   ✅ READ successful:', foundUser?.username);
        
        // Test update operation
        console.log('   ✏️ Testing UPDATE...');
        const updatedUser = await prisma.telegramUser.update({
            where: { telegramId: '999999999' },
            data: { username: 'updated_test_user' }
        });
        console.log('   ✅ UPDATE successful:', updatedUser.username);
        
        // Test delete operation
        console.log('   🗑️ Testing DELETE...');
        await prisma.telegramUser.delete({
            where: { telegramId: '999999999' }
        });
        console.log('   ✅ DELETE successful');
        
        console.log('\n5️⃣ Testing relationships...');
        
        // Test user with alerts relationship
        const usersWithAlerts = await prisma.telegramUser.findMany({
            include: {
                flightAlerts: true
            },
            take: 1
        });
        console.log(`   ✅ Relationships working (found ${usersWithAlerts.length} users)`);
        
        console.log('\n✅ ALL POSTGRESQL + PRISMA TESTS PASSED');
        
    } catch (error) {
        console.log('\n❌ POSTGRESQL + PRISMA ERROR:');
        console.error(error);
        console.log('\n🔧 Possible issues:');
        console.log('   • PostgreSQL server not running');
        console.log('   • Database "flight_alerts" doesn\'t exist');
        console.log('   • Connection credentials incorrect');
        console.log('   • Schema not synchronized');
        
    } finally {
        await prisma.$disconnect();
    }
}

testPostgreSQLConnection().catch(console.error);
