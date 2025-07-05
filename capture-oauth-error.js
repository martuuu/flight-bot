#!/usr/bin/env node

// Capturar error específico de OAuth
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'webapp', '.env') });

async function captureOAuthError() {
  console.log('🔍 Capturando error específico de OAuth...\n');
  
  try {
    const fetch = require('node-fetch').default;
    
    // Hacer petición sin seguir redirecciones
    const response = await fetch('http://localhost:3000/api/auth/signin/google', {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    
    const location = response.headers.get('location');
    console.log('\nLocation header:', location);
    
    if (location && location.includes('error=')) {
      const url = new URL(location, 'http://localhost:3000');
      const error = url.searchParams.get('error');
      const errorDescription = url.searchParams.get('error_description');
      
      console.log('\n🚨 ERROR ENCONTRADO:');
      console.log('Error:', error);
      console.log('Description:', errorDescription);
      
      // Verificar logs de NextAuth
      console.log('\n📝 Para más detalles, verificar:');
      console.log('1. Logs de webapp en la terminal');
      console.log('2. Variable NEXTAUTH_DEBUG=true en .env');
      console.log('3. Console del navegador en DevTools');
    }
    
    // Intentar obtener más detalles del error
    if (location && location.includes('signin')) {
      console.log('\n🔍 Obteniendo página de error...');
      const errorPage = await fetch(`http://localhost:3000${location}`);
      const errorText = await errorPage.text();
      
      // Buscar mensajes de error específicos
      const errorMatches = errorText.match(/error[^>]*>([^<]+)</gi);
      if (errorMatches) {
        console.log('Mensajes de error encontrados:');
        errorMatches.forEach(match => {
          console.log('  -', match.replace(/<[^>]+>/g, ''));
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error capturando details:', error);
  }
}

captureOAuthError();
