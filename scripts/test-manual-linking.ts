#!/usr/bin/env npx tsx

// Test de vinculación usando la webapp real para generar códigos
import dotenv from 'dotenv';

console.log('🔧 Cargando variables de entorno...');
dotenv.config({ path: '.env.development' });

async function testRealLinking() {
  const webappUrl = process.env.NEXTAUTH_URL || 'https://flight-bot.com';
  
  console.log('\n🧪 Test de Vinculación Real');
  console.log('===========================');
  console.log(`Webapp URL: ${webappUrl}`);
  
  console.log('\n📝 INSTRUCCIONES MANUALES:');
  console.log('1. Abre https://flight-bot.com en tu navegador');
  console.log('2. Loguéate con martin.navarro.dev@gmail.com');
  console.log('3. Ve a la sección de vinculación de Telegram');
  console.log('4. Genera un código de vinculación');
  console.log('5. Copia el código y pégalo cuando se te pida aquí');
  
  // Solicitar código manual
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const askCode = () => {
    return new Promise<string>((resolve) => {
      rl.question('\n🔑 Ingresa el código de 6 dígitos generado en la webapp: ', (code) => {
        resolve(code);
      });
    });
  };
  
  try {
    const linkingCode = await askCode();
    rl.close();
    
    if (!/^\d{6}$/.test(linkingCode)) {
      console.error('❌ Código inválido. Debe ser de 6 dígitos.');
      return;
    }
    
    console.log(`\n🤖 Simulando comando /link ${linkingCode} desde Telegram...`);
    
    const response = await fetch(`${webappUrl}/api/telegram/link-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'confirm_from_bot',
        telegramId: '5536948508', // Tu Telegram ID
        telegramUsername: 'martinnavarro',
        telegramFirstName: 'Martin',
        telegramLastName: 'Navarro',
        linkingCode: linkingCode
      })
    });
    
    console.log(`📊 Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Vinculación exitosa:', result);
      
      // Verificar en la base de datos
      console.log('\n🔍 Verificando en la base de datos...');
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const user = await prisma.user.findFirst({
        where: { email: 'martin.navarro.dev@gmail.com' }
      });
      
      if (user?.telegramId) {
        console.log('✅ Usuario vinculado en la base de datos:');
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🤖 Telegram ID: ${user.telegramId}`);
        console.log(`   ✅ Vinculado: ${user.telegramLinked}`);
      } else {
        console.log('❌ Usuario no encontrado o no vinculado en la base de datos');
      }
      
      await prisma.$disconnect();
      
    } else {
      const errorData = await response.json();
      console.error('❌ Error en vinculación:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error en test:', error);
  }
}

testRealLinking().catch(console.error);
