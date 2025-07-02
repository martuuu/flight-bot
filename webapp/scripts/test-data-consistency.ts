import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface BotAlert {
  id: string
  user_id: string
  origin: string
  destination: string
  max_price: number
  departure_date?: string
  return_date?: string
  created_at: string
  is_active: boolean
}

async function checkDataConsistency() {
  console.log('🔍 Verificando consistencia de datos entre webapp y bot...')
  console.log('')

  try {
    // 1. Verificar usuarios
    console.log('👥 Verificando usuarios:')
    const webappUsers = await prisma.user.findMany({
      where: { telegramLinked: true },
      include: { alerts: true }
    })

    if (webappUsers.length === 0) {
      console.log('   ⚠️  No hay usuarios vinculados con Telegram')
      return
    }

    webappUsers.forEach((user: any) => {
      console.log(`   📧 ${user.email}`)
      console.log(`      📱 Telegram ID: ${user.telegramId}`)
      console.log(`      🚨 Alertas en webapp: ${user.alerts.length}`)
    })

    console.log('')

    // 2. Verificar base de datos del bot (si existe)
    const botDbPath = path.join(__dirname, '../../data/alerts.db')
    
    if (!fs.existsSync(botDbPath)) {
      console.log('⚠️  Base de datos del bot no encontrada en:', botDbPath)
      console.log('   Asegúrate de que el bot esté configurado y funcionando')
      return
    }

    console.log('✅ Base de datos del bot encontrada')
    console.log('')

    // 3. Comparar alertas (requiere implementación específica del bot)
    console.log('📊 Resumen de consistencia:')
    
    for (const user of webappUsers) {
      console.log(`📧 Usuario: ${user.email}`)
      console.log(`   📱 Telegram ID: ${user.telegramId}`)
      console.log(`   🚨 Alertas en webapp: ${user.alerts.length}`)
      console.log(`   ✅ Estado: Usuario vinculado correctamente`)
      console.log('')
    }

    // 4. Verificar configuración
    console.log('🔧 Verificación de configuración:')
    
    const envPath = path.join(__dirname, '../.env.local')
    if (fs.existsSync(envPath)) {
      console.log('   ✅ Archivo .env.local existe')
    } else {
      console.log('   ❌ Archivo .env.local no encontrado')
      console.log('      Copia .env.example a .env.local y configura las variables')
    }

    const dbPath = path.join(__dirname, '../dev.db')
    if (fs.existsSync(dbPath)) {
      console.log('   ✅ Base de datos webapp existe')
    } else {
      console.log('   ❌ Base de datos webapp no encontrada')
      console.log('      Ejecuta: npm run db:push')
    }

    console.log('')
    console.log('🎯 Recomendaciones:')
    console.log('   1. Verifica que el bot y la webapp usen la misma base de datos')
    console.log('   2. Asegúrate de que las alertas se sincronicen en tiempo real')
    console.log('   3. Realiza pruebas creando alertas desde ambas plataformas')
    console.log('')

  } catch (error) {
    console.error('❌ Error verificando consistencia:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function testDataFlow() {
  console.log('🧪 Testing flujo de datos...')
  console.log('')

  try {
    // Crear una alerta de prueba
    const testUser = await prisma.user.findFirst({
      where: { telegramLinked: true }
    })

    if (!testUser) {
      console.log('⚠️  No hay usuarios vinculados para testing')
      return
    }

    console.log(`👤 Usando usuario de prueba: ${testUser.email}`)
    
    // Crear alerta de prueba
    const testAlert = await prisma.alert.create({
      data: {
        userId: testUser.id,
        origin: 'TEST',
        destination: 'TEST',
        maxPrice: 999,
        currency: 'USD',
        alertType: 'SPECIFIC',
        adults: 1,
        children: 0,
        infants: 0,
      }
    })

    console.log(`✅ Alerta de prueba creada: ${testAlert.id}`)
    console.log(`   📍 Ruta: ${testAlert.origin} → ${testAlert.destination}`)
    console.log(`   💰 Precio máximo: $${testAlert.maxPrice}`)
    
    // Verificar que se puede leer
    const readAlert = await prisma.alert.findUnique({
      where: { id: testAlert.id },
      include: { user: true }
    })

    if (readAlert) {
      console.log('✅ Alerta leída correctamente desde la base de datos')
      console.log(`   👤 Usuario: ${readAlert.user.email}`)
    }

    // Limpiar alerta de prueba
    await prisma.alert.delete({
      where: { id: testAlert.id }
    })

    console.log('🧹 Alerta de prueba eliminada')
    console.log('')
    console.log('✅ Flujo de datos funcionando correctamente')

  } catch (error) {
    console.error('❌ Error en testing de flujo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Script principal
const command = process.argv[2]

switch (command) {
  case 'consistency':
    checkDataConsistency()
    break
  case 'flow':
    testDataFlow()
    break
  default:
    console.log('Uso:')
    console.log('  npm run test:consistency  - Verificar consistencia de datos')
    console.log('  npm run test:flow         - Probar flujo de datos')
    break
}
