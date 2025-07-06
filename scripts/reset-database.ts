#!/usr/bin/env tsx

/**
 * Script para resetear completamente la base de datos
 * Elimina todos los datos de todas las tablas en orden correcto
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDatabase() {
  console.log('🔥 Iniciando reset completo de la base de datos...')
  
  try {
    // Eliminar en orden correcto para evitar errores de foreign key
    console.log('Eliminando datos de tablas dependientes...')
    
    // Eliminar historial de precios
    await prisma.priceHistory.deleteMany()
    console.log('✅ PriceHistory eliminado')
    
    // Eliminar alertas de vuelos
    await prisma.flightAlert.deleteMany()
    console.log('✅ FlightAlert eliminado')
    
    // Eliminar alertas
    await prisma.alert.deleteMany()
    console.log('✅ Alert eliminado')
    
    // Eliminar configuraciones de notificaciones
    await prisma.notificationSettings.deleteMany()
    console.log('✅ NotificationSettings eliminado')
    
    // Eliminar sesiones de NextAuth
    await prisma.session.deleteMany()
    console.log('✅ Session eliminado')
    
    // Eliminar cuentas de NextAuth
    await prisma.account.deleteMany()
    console.log('✅ Account eliminado')
    
    // Eliminar tokens de verificación
    await prisma.verificationToken.deleteMany()
    console.log('✅ VerificationToken eliminado')
    
    // Eliminar usuarios (al final para evitar FK constraints)
    await prisma.user.deleteMany()
    console.log('✅ User eliminado')
    
    console.log('\n🎉 Base de datos reseteada completamente!')
    console.log('📊 Verificando que todas las tablas estén vacías...')
    
    // Verificar que todo esté vacío
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()
    const alertCount = await prisma.alert.count()
    
    console.log(`Users: ${userCount}`)
    console.log(`Accounts: ${accountCount}`)
    console.log(`Sessions: ${sessionCount}`)
    console.log(`Alerts: ${alertCount}`)
    
    if (userCount === 0 && accountCount === 0 && sessionCount === 0 && alertCount === 0) {
      console.log('\n✅ Todas las tablas están vacías. Reset exitoso!')
    } else {
      console.log('\n⚠️  Algunas tablas aún contienen datos.')
    }
    
  } catch (error) {
    console.error('❌ Error durante el reset:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('\n🚀 Reset completado exitosamente!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}

export { resetDatabase }
