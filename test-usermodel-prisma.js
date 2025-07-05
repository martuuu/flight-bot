#!/usr/bin/env node
/**
 * Test específico del UserModelPrisma después de la corrección
 */

// Simulamos el entorno de TypeScript
const { PrismaClient } = require('@prisma/client');

// Simulamos el UserModelPrisma
class UserModelPrismaTest {
  static prisma = new PrismaClient();

  static async create(telegramId, username, firstName, lastName) {
    try {
      const telegramUser = await this.prisma.telegramUser.create({
        data: {
          telegramId: telegramId.toString(),
          username: username || null,
          firstName: firstName || null,
          lastName: lastName || null,
        },
      });

      console.log(`✅ Usuario de Telegram creado: ${telegramUser.id}`);
      
      return {
        id: telegramUser.id,
        telegramId: telegramId,
        createdAt: telegramUser.createdAt,
        isActive: true,
        username: telegramUser.username,
        firstName: telegramUser.firstName,
        lastName: telegramUser.lastName,
      };
    } catch (error) {
      console.log(`❌ Error creando usuario: ${error.message}`);
      throw error;
    }
  }

  static async findByTelegramId(telegramId) {
    try {
      const telegramUser = await this.prisma.telegramUser.findUnique({
        where: { telegramId: telegramId.toString() },
        include: {
          flightAlerts: true // Ahora esto debería funcionar
        }
      });

      if (!telegramUser) return null;

      return {
        id: telegramUser.id,
        telegramId: telegramId,
        createdAt: telegramUser.createdAt,
        isActive: true,
        username: telegramUser.username,
        firstName: telegramUser.firstName,
        lastName: telegramUser.lastName,
        flightAlerts: telegramUser.flightAlerts
      };
    } catch (error) {
      console.log(`❌ Error buscando usuario: ${error.message}`);
      return null;
    }
  }

  static async findOrCreate(telegramId, username, firstName, lastName) {
    try {
      let user = await this.findByTelegramId(telegramId);
      
      if (!user) {
        user = await this.create(telegramId, username, firstName, lastName);
      } else {
        console.log(`✅ Usuario encontrado: ${user.id}`);
      }

      return user;
    } catch (error) {
      console.log(`❌ Error en findOrCreate: ${error.message}`);
      throw error;
    }
  }
}

async function testUserModelPrisma() {
  console.log('\n🧪 TESTING USERMODELPRISMA INTEGRATION\n');
  
  try {
    console.log('1️⃣ Testing user creation...');
    const newUser = await UserModelPrismaTest.create(123456789, 'testuser', 'Test', 'User');
    console.log(`   User created with ID: ${newUser.id}`);
    
    console.log('\n2️⃣ Testing findByTelegramId with relationships...');
    const foundUser = await UserModelPrismaTest.findByTelegramId(123456789);
    console.log(`   User found: ${foundUser.username}`);
    console.log(`   Flight alerts: ${foundUser.flightAlerts.length}`);
    
    console.log('\n3️⃣ Testing findOrCreate...');
    const upsertUser = await UserModelPrismaTest.findOrCreate(123456789, 'testuser_updated', 'Test', 'User');
    console.log(`   User ID: ${upsertUser.id}`);
    
    console.log('\n4️⃣ Testing with new user...');
    const newUser2 = await UserModelPrismaTest.findOrCreate(987654321, 'newuser', 'New', 'User');
    console.log(`   New user ID: ${newUser2.id}`);
    
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await UserModelPrismaTest.prisma.telegramUser.deleteMany({
      where: {
        telegramId: {
          in: ['123456789', '987654321']
        }
      }
    });
    console.log('   Test data cleaned up');
    
    console.log('\n✅ ALL USERMODELPRISMA TESTS PASSED');
    
  } catch (error) {
    console.log('\n❌ USERMODELPRISMA TEST FAILED:');
    console.error(error);
  } finally {
    await UserModelPrismaTest.prisma.$disconnect();
  }
}

testUserModelPrisma().catch(console.error);
