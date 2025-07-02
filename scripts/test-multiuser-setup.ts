import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDatabase() {
  console.log('🧹 Limpiando base de datos para testing...')

  try {
    // Eliminar datos en el orden correcto debido a las relaciones
    await prisma.alertNotification.deleteMany()
    await prisma.priceHistory.deleteMany()
    await prisma.alert.deleteMany()
    await prisma.notificationSettings.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('✅ Base de datos limpiada correctamente')
    
    // Crear usuarios de prueba
    console.log('👥 Creando usuarios de prueba...')
    
    const testUsers = [
      {
        email: 'admin.flightbot@yopmail.com',
        name: 'Admin FlightBot',
        role: 'SUPERADMIN' as const,
      },
      {
        email: 'premium.tester@yopmail.com',
        name: 'Premium Tester',
        role: 'PREMIUM' as const,
      },
      {
        email: 'basic.user@yopmail.com',
        name: 'Basic User',
        role: 'BASIC' as const,
      },
      {
        email: 'testing.account@yopmail.com',
        name: 'Testing Account',
        role: 'TESTING' as const,
      },
    ]

    for (const userData of testUsers) {
      const user = await prisma.user.create({
        data: {
          ...userData,
          telegramLinked: false,
        }
      })
      console.log(`   ✓ Usuario creado: ${user.email} (${user.role})`)
    }

    console.log('🎉 Setup de testing completado')
    console.log('')
    console.log('📧 Emails de prueba creados:')
    testUsers.forEach(user => {
      console.log(`   • ${user.email} - Rol: ${user.role}`)
    })
    console.log('')
    console.log('🔗 Para testing:')
    console.log('   1. Ve a http://localhost:3000/auth/signin')
    console.log('   2. Usa Google OAuth con emails de Yopmail')
    console.log('   3. Los usuarios ya tienen roles asignados')
    console.log('   4. Vincular cada cuenta con diferentes cuentas de Telegram')

  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function showCurrentUsers() {
  console.log('👥 Usuarios actuales en la base de datos:')
  try {
    const users = await prisma.user.findMany({
      include: {
        alerts: true,
        _count: {
          select: { alerts: true }
        }
      }
    })

    if (users.length === 0) {
      console.log('   No hay usuarios registrados')
      return
    }

    users.forEach(user => {
      console.log(`   📧 ${user.email}`)
      console.log(`      👤 Nombre: ${user.name || 'N/A'}`)
      console.log(`      🏷️  Rol: ${user.role}`)
      console.log(`      📱 Telegram: ${user.telegramLinked ? `Vinculado (ID: ${user.telegramId})` : 'No vinculado'}`)
      console.log(`      🚨 Alertas: ${user._count.alerts}`)
      console.log(`      📅 Creado: ${user.createdAt.toLocaleDateString()}`)
      console.log('')
    })
  } catch (error) {
    console.error('❌ Error mostrando usuarios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Script principal
const command = process.argv[2]

switch (command) {
  case 'clean':
    cleanDatabase()
    break
  case 'show':
    showCurrentUsers()
    break
  default:
    console.log('Uso:')
    console.log('  npm run test:clean     - Limpiar y preparar DB para testing')
    console.log('  npm run test:show      - Mostrar usuarios actuales')
    break
}
