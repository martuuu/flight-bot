#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUserCreation() {
  console.log('🔍 Verificando usuario martin.navarro.dev@gmail.com...\n')

  try {
    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: 'martin.navarro.dev@gmail.com' },
      include: {
        accounts: true, // Incluir cuentas OAuth
      }
    })

    if (!user) {
      console.log('❌ Usuario NO encontrado')
      console.log('   El usuario no se creó correctamente durante el login con Google')
      return
    }

    console.log('✅ Usuario encontrado:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Nombre: ${user.name}`)
    console.log(`   Rol: ${user.role}`)
    console.log(`   Email verificado: ${user.emailVerified ? '✅ Sí' : '❌ No'}`)
    console.log(`   Telegram ID: ${user.telegramId || 'No vinculado'}`)
    console.log(`   Suscripción: ${user.subscriptionStatus}`)
    console.log(`   Plan: ${user.subscriptionPlan}`)
    console.log(`   Expira: ${user.subscriptionExpires?.toISOString() || 'N/A'}`)
    console.log(`   Creado: ${user.createdAt.toISOString()}`)
    console.log(`   Actualizado: ${user.updatedAt.toISOString()}`)

    // Verificar cuentas OAuth
    console.log(`\n🔗 Cuentas vinculadas: ${user.accounts.length}`)
    user.accounts.forEach((account, index) => {
      console.log(`   ${index + 1}. Provider: ${account.provider}`)
      console.log(`      Account ID: ${account.providerAccountId}`)
      console.log(`      Tipo: ${account.type}`)
    })

    // Verificar rol de superadmin
    if (user.role === 'SUPERADMIN') {
      console.log('\n👑 ¡Usuario es SUPERADMIN! ✅')
    } else {
      console.log(`\n⚠️  Usuario tiene rol: ${user.role} (debería ser SUPERADMIN)`)
      
      // Actualizar a SUPERADMIN si es necesario
      console.log('🔧 Actualizando rol a SUPERADMIN...')
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'SUPERADMIN' }
      })
      console.log('✅ Rol actualizado a SUPERADMIN')
    }

    // Contar total de usuarios
    const totalUsers = await prisma.user.count()
    console.log(`\n📊 Total de usuarios en el sistema: ${totalUsers}`)

  } catch (error) {
    console.error('❌ Error verificando usuario:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserCreation()
