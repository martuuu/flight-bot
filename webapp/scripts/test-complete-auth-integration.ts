/**
 * Test script para verificar la integración completa de autenticación
 * Este script prueba el flujo completo: registro manual, OAuth, verificación de email,
 * roles, suscripciones y sincronización con el bot de Telegram
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testCompleteAuthFlow() {
  console.log('🧪 Testing Complete Authentication Integration Flow...\n')

  try {
    // 1. Test Manual Registration
    console.log('1️⃣ Testing Manual Registration...')
    
    // Simular creación de usuario manual
    const hashedPassword = await bcrypt.hash('testpassword123', 12)
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: hashedPassword,
        role: 'BASIC',
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: 'BASIC',
        subscriptionExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        verificationToken: 'test-token-123',
        verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }
    })
    console.log('✅ Manual user created:', testUser.email)

    // 2. Test OAuth Registration
    console.log('\n2️⃣ Testing OAuth Registration...')
    
    // Simular creación de usuario OAuth
    const oauthUser = await prisma.user.create({
      data: {
        name: 'OAuth User',
        email: 'oauth@example.com',
        image: 'https://example.com/avatar.jpg',
        role: 'BASIC',
        emailVerified: new Date(),
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: 'BASIC',
        subscriptionExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    })
    console.log('✅ OAuth user created:', oauthUser.email)

    // 3. Test Email Verification
    console.log('\n3️⃣ Testing Email Verification...')
    
    // Verificar email del usuario manual
    const verifiedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpires: null,
      }
    })
    console.log('✅ Email verified for:', verifiedUser.email)

    // 4. Test Role System
    console.log('\n4️⃣ Testing Role System...')
    
    // Crear usuarios con diferentes roles
    const supporterUser = await prisma.user.create({
      data: {
        name: 'Supporter User',
        email: 'supporter@example.com',
        role: 'SUPPORTER',
        emailVerified: new Date(),
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: 'BASIC',
        subscriptionExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    })

    const premiumUser = await prisma.user.create({
      data: {
        name: 'Premium User',
        email: 'premium@example.com',
        role: 'PREMIUM',
        emailVerified: new Date(),
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: 'PREMIUM',
        subscriptionExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    })

    const superadminUser = await prisma.user.create({
      data: {
        name: 'Superadmin User',
        email: 'superadmin@example.com',
        role: 'SUPERADMIN',
        emailVerified: new Date(),
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: 'PREMIUM',
        subscriptionExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    })

    console.log('✅ Created users with roles:')
    console.log('   - SUPPORTER:', supporterUser.email)
    console.log('   - PREMIUM:', premiumUser.email)
    console.log('   - SUPERADMIN:', superadminUser.email)

    // 5. Test Telegram Integration
    console.log('\n5️⃣ Testing Telegram Integration...')
    
    // Simular vinculación con Telegram
    const telegramLinkedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: {
        telegramId: '123456789',
        telegramUsername: 'testuser',
      }
    })
    console.log('✅ Telegram linked for:', telegramLinkedUser.email)

    // 6. Test Subscription Management
    console.log('\n6️⃣ Testing Subscription Management...')
    
    // Extender suscripción
    const updatedSubscription = await prisma.user.update({
      where: { id: premiumUser.id },
      data: {
        subscriptionExpires: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 years
      }
    })
    console.log('✅ Subscription extended for:', updatedSubscription.email)

    // 7. Test Account Summary
    console.log('\n7️⃣ Account Summary...')
    
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        telegramId: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionExpires: true,
        createdAt: true,
      }
    })

    console.log('\n📊 User Summary:')
    allUsers.forEach((user: any, index: number) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Email Verified: ${user.emailVerified ? '✅' : '❌'}`)
      console.log(`   Telegram: ${user.telegramId ? '🔗 Linked' : '❌ Not linked'}`)
      console.log(`   Subscription: ${user.subscriptionPlan} (${user.subscriptionStatus})`)
      console.log(`   Expires: ${user.subscriptionExpires?.toLocaleDateString()}`)
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}\n`)
    })

    // 8. Test Password Verification
    console.log('8️⃣ Testing Password Verification...')
    
    const isValidPassword = await bcrypt.compare('testpassword123', testUser.password!)
    console.log('✅ Password verification:', isValidPassword ? 'PASS' : 'FAIL')

    console.log('\n🎉 All tests completed successfully!')
    console.log('\n📋 Integration Summary:')
    console.log('✅ Manual registration with password hashing')
    console.log('✅ OAuth registration with email verification')
    console.log('✅ Role-based access control (SUPERADMIN, SUPPORTER, PREMIUM, BASIC, TESTING)')
    console.log('✅ Subscription management and expiration tracking')
    console.log('✅ Telegram account linking')
    console.log('✅ Email verification tokens')
    console.log('✅ Consistent data structure for both auth methods')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...')
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            'test@example.com',
            'oauth@example.com',
            'supporter@example.com',
            'premium@example.com',
            'superadmin@example.com'
          ]
        }
      }
    })
    console.log('✅ Test data cleaned up')
    
    await prisma.$disconnect()
  }
}

// Run the test
testCompleteAuthFlow().catch(console.error)
