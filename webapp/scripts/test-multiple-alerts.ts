#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testMultipleAlerts() {
  console.log('🧪 Creando 5 alertas de prueba para martin.navarro.dev@gmail.com...\n')

  try {
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: 'martin.navarro.dev@gmail.com' }
    })

    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }

    console.log(`👤 Usuario: ${user.email} (${user.role})`)
    console.log(`📊 Alertas actuales: ${await prisma.alert.count({ where: { userId: user.id } })}`)

    // Definir 5 rutas de prueba diferentes
    const testAlerts = [
      {
        name: "Santo Domingo → Miami (Monthly)",
        origin: 'SDQ',
        destination: 'MIA',
        maxPrice: 450,
        alertType: 'MONTHLY',
        adults: 1,
        children: 0,
        infants: 0,
        isFlexible: true,
        currency: 'USD'
      },
      {
        name: "Punta Cana → Nueva York (Specific)",
        origin: 'PUJ',
        destination: 'JFK',
        maxPrice: 650,
        alertType: 'SPECIFIC',
        departureDate: '2025-08-15',
        adults: 2,
        children: 1,
        infants: 0,
        isFlexible: false,
        currency: 'USD'
      },
      {
        name: "Bogotá → Madrid (Monthly)",
        origin: 'BOG',
        destination: 'MAD',
        maxPrice: 800,
        alertType: 'MONTHLY',
        adults: 1,
        children: 0,
        infants: 0,
        isFlexible: true,
        currency: 'USD'
      },
      {
        name: "Miami → Santiago Chile (Specific)",
        origin: 'MIA',
        destination: 'SCL',
        maxPrice: 750,
        alertType: 'SPECIFIC',
        departureDate: '2025-09-20',
        adults: 2,
        children: 0,
        infants: 1,
        isFlexible: false,
        currency: 'USD'
      },
      {
        name: "Lima → Barcelona (Monthly)",
        origin: 'LIM',
        destination: 'BCN',
        maxPrice: 900,
        alertType: 'MONTHLY',
        adults: 1,
        children: 1,
        infants: 0,
        isFlexible: true,
        currency: 'USD'
      }
    ]

    console.log(`\n🚀 Creando ${testAlerts.length} alertas de prueba...\n`)

    const createdAlerts = []

    for (let i = 0; i < testAlerts.length; i++) {
      const alertData = testAlerts[i]
      
      try {
        console.log(`${i + 1}️⃣ Creando: ${alertData.name}`)
        
        // Verificar si ya existe una alerta similar
        const existingAlert = await prisma.alert.findFirst({
          where: {
            userId: user.id,
            origin: alertData.origin,
            destination: alertData.destination,
            alertType: alertData.alertType as 'MONTHLY' | 'SPECIFIC',
            isActive: true
          }
        })

        if (existingAlert) {
          console.log(`   ⚠️  Ya existe una alerta similar (ID: ${existingAlert.id})`)
          continue
        }

        // Crear nueva alerta
        const newAlert = await prisma.alert.create({
          data: {
            userId: user.id,
            origin: alertData.origin,
            destination: alertData.destination,
            maxPrice: alertData.maxPrice,
            currency: alertData.currency,
            departureDate: alertData.departureDate,
            isFlexible: alertData.isFlexible,
            adults: alertData.adults,
            children: alertData.children,
            infants: alertData.infants,
            alertType: alertData.alertType as 'MONTHLY' | 'SPECIFIC',
            isActive: true,
            isPaused: false,
          }
        })

        createdAlerts.push(newAlert)
        console.log(`   ✅ Creada exitosamente (ID: ${newAlert.id})`)
        console.log(`      Ruta: ${alertData.origin} → ${alertData.destination}`)
        console.log(`      Precio máximo: $${alertData.maxPrice}`)
        console.log(`      Pasajeros: ${alertData.adults}A ${alertData.children}C ${alertData.infants}I`)
        console.log(`      Tipo: ${alertData.alertType}`)
        if (alertData.departureDate) {
          console.log(`      Fecha: ${alertData.departureDate}`)
        }

      } catch (alertError) {
        console.log(`   ❌ Error creando alerta: ${alertError}`)
      }
      
      console.log('') // Espacio en blanco
    }

    // Resumen final
    console.log('📊 Resumen de prueba:')
    console.log(`   ✅ Alertas creadas exitosamente: ${createdAlerts.length}`)
    console.log(`   ⚠️  Alertas ya existentes: ${testAlerts.length - createdAlerts.length}`)
    
    // Verificar el total actual de alertas del usuario
    const totalAlerts = await prisma.alert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`\n📋 Total de alertas del usuario: ${totalAlerts.length}`)
    totalAlerts.forEach((alert, index) => {
      console.log(`   ${index + 1}. ${alert.origin} → ${alert.destination} ($${alert.maxPrice}) - ${alert.alertType}`)
    })

    console.log('\n🎯 Para verificar en la webapp:')
    console.log('   1. Ve a: http://localhost:3000/dashboard')
    console.log('   2. Deberías ver las nuevas alertas en las estadísticas')
    console.log('   3. Ve a: http://localhost:3000/alerts')
    console.log('   4. Deberías ver todas las alertas listadas')

    console.log('\n🧪 Pruebas adicionales recomendadas:')
    console.log('   - Intentar crear una alerta duplicada (debería fallar)')
    console.log('   - Filtrar alertas por tipo en /alerts')
    console.log('   - Verificar que las estadísticas se actualicen')

  } catch (error) {
    console.error('❌ Error en la prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testMultipleAlerts()
