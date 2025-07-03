#!/usr/bin/env node

/**
 * Monitor de Token de Aerolíneas Argentinas
 * 
 * Funcionalidades:
 * - Extrae tokens de autenticación desde el frontend de Aerolíneas
 * - Valida tokens contra la API oficial
 * - Actualiza automáticamente el token en el servicio
 * - Guarda backup del token para recuperación
 * 
 * Comandos:
 * - status: Verificar estado del token actual
 * - extract: Extraer y guardar un nuevo token manualmente
 * - monitor: Monitoreo automático (default)
 * 
 * Uso:
 * npx ts-node scripts/monitor-token.ts [status|extract|monitor]
 * 
 * Cron job recomendado: 0 star-slash-6 star star star (cada 6 horas)
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { scrapingLogger } from '../src/utils/logger';

interface TokenInfo {
  token: string;
  extractedAt: string;
  expiresAt?: string;
  isValid: boolean;
}

const TOKEN_STORAGE_PATH = path.join(__dirname, '..', 'data', 'token-backup.json');
const SERVICE_PATH = path.join(__dirname, '..', 'src', 'services', 'AerolineasAlertService.ts');

/**
 * Intentar extraer un nuevo token desde el frontend de Aerolíneas
 */
async function extractTokenFromFrontend(): Promise<TokenInfo | null> {
  try {
    scrapingLogger.info('[TOKEN_MONITOR] Attempting to extract token from frontend...');

    // Simular navegador para acceder al sitio
    const response = await axios.get('https://aerolineas.com.ar/es/oportunidades/millas', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 30000
    });

    const html = response.data;
    
    // Buscar tokens en el HTML
    const tokenPatterns = [
      /token["']?\s*:\s*["']([^"']+)["']/gi,
      /Bearer\s+([A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+)/gi,
      /eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/gi
    ];

    for (const pattern of tokenPatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          const tokenMatch = match.match(/eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/);
          if (tokenMatch) {
            const token = tokenMatch[0];
            const tokenInfo = await validateToken(token);
            if (tokenInfo) {
              scrapingLogger.info('[TOKEN_MONITOR] Token extracted successfully from frontend');
              return tokenInfo;
            }
          }
        }
      }
    }

    scrapingLogger.warn('[TOKEN_MONITOR] No valid token found in frontend HTML');
    return null;

  } catch (error) {
    scrapingLogger.error('[TOKEN_MONITOR] Error extracting token from frontend:', error as Error);
    return null;
  }
}

/**
 * Validar un token haciendo una llamada a la API
 */
async function validateToken(token: string): Promise<TokenInfo | null> {
  try {
    const response = await axios.get('https://api.aerolineas.com.ar/v1/catalog/channels/WEB_AR', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'X-Channel-Id': 'WEB_AR'
      },
      timeout: 15000
    });

    if (response.status === 200) {
      // Decodificar el token para obtener la fecha de expiración
      const expiresAt = decodeTokenExpiration(token);
      
      const tokenInfo: TokenInfo = {
        token,
        extractedAt: new Date().toISOString(),
        isValid: true
      };
      
      if (expiresAt) {
        tokenInfo.expiresAt = expiresAt;
      }
      
      return tokenInfo;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Decodificar la fecha de expiración del JWT
 */
function decodeTokenExpiration(token: string): string | undefined {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    if (decoded.exp) {
      return new Date(decoded.exp * 1000).toISOString();
    }
  } catch (error) {
    // Ignore decode errors
  }
  
  return undefined;
}

/**
 * Cargar información del token almacenado
 */
function loadStoredTokenInfo(): TokenInfo | null {
  try {
    if (fs.existsSync(TOKEN_STORAGE_PATH)) {
      const data = fs.readFileSync(TOKEN_STORAGE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    scrapingLogger.error('[TOKEN_MONITOR] Error loading stored token info:', error as Error);
  }
  
  return null;
}

/**
 * Guardar información del token
 */
function saveTokenInfo(tokenInfo: TokenInfo): void {
  try {
    const dir = path.dirname(TOKEN_STORAGE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(TOKEN_STORAGE_PATH, JSON.stringify(tokenInfo, null, 2));
    scrapingLogger.info('[TOKEN_MONITOR] Token info saved to storage');
  } catch (error) {
    scrapingLogger.error('[TOKEN_MONITOR] Error saving token info:', error as Error);
  }
}

/**
 * Actualizar el token en el servicio
 */
function updateTokenInService(newToken: string): boolean {
  try {
    if (!fs.existsSync(SERVICE_PATH)) {
      scrapingLogger.error('[TOKEN_MONITOR] Service file not found:', new Error(SERVICE_PATH));
      return false;
    }

    let serviceContent = fs.readFileSync(SERVICE_PATH, 'utf8');
    
    // Buscar y reemplazar el token fallback
    const tokenRegex = /private fallbackToken: string = '[^']+';/;
    const newTokenLine = `private fallbackToken: string = '${newToken}';`;
    
    if (tokenRegex.test(serviceContent)) {
      serviceContent = serviceContent.replace(tokenRegex, newTokenLine);
      fs.writeFileSync(SERVICE_PATH, serviceContent);
      scrapingLogger.info('[TOKEN_MONITOR] Token updated in service file');
      return true;
    } else {
      scrapingLogger.error('[TOKEN_MONITOR] Could not find token pattern in service file');
      return false;
    }
  } catch (error) {
    scrapingLogger.error('[TOKEN_MONITOR] Error updating token in service:', error as Error);
    return false;
  }
}

/**
 * Enviar notificación de cambio de token (placeholder)
 */
function sendTokenChangeNotification(oldToken: string, newToken: string): void {
  // Aquí se puede implementar notificación por email, Slack, etc.
  scrapingLogger.info('[TOKEN_MONITOR] Token change notification sent', {
    oldTokenPrefix: oldToken.substring(0, 20) + '...',
    newTokenPrefix: newToken.substring(0, 20) + '...',
    timestamp: new Date().toISOString()
  });
}

/**
 * Función principal de monitoreo
 */
async function monitorToken(): Promise<void> {
  try {
    scrapingLogger.info('[TOKEN_MONITOR] Starting token monitoring...');
    
    // Cargar información del token almacenado
    const storedTokenInfo = loadStoredTokenInfo();
    
    // Intentar extraer un nuevo token
    const newTokenInfo = await extractTokenFromFrontend();
    
    if (!newTokenInfo) {
      scrapingLogger.warn('[TOKEN_MONITOR] Could not extract new token, keeping current one');
      return;
    }

    // Comparar con el token almacenado
    if (storedTokenInfo && storedTokenInfo.token === newTokenInfo.token) {
      scrapingLogger.info('[TOKEN_MONITOR] Token unchanged, no action needed');
      return;
    }

    // El token ha cambiado, actualizar
    scrapingLogger.info('[TOKEN_MONITOR] Token changed, updating service...');
    
    const updated = updateTokenInService(newTokenInfo.token);
    
    if (updated) {
      // Guardar nueva información del token
      saveTokenInfo(newTokenInfo);
      
      // Enviar notificación
      if (storedTokenInfo) {
        sendTokenChangeNotification(storedTokenInfo.token, newTokenInfo.token);
      }
      
      scrapingLogger.info('[TOKEN_MONITOR] Token monitoring completed successfully');
    } else {
      scrapingLogger.error('[TOKEN_MONITOR] Failed to update token in service');
    }

  } catch (error) {
    scrapingLogger.error('[TOKEN_MONITOR] Error in token monitoring:', error as Error);
  }
}

/**
 * Función para verificar el estado actual del token
 */
async function checkTokenStatus(): Promise<void> {
  try {
    const storedTokenInfo = loadStoredTokenInfo();
    
    if (!storedTokenInfo) {
      console.log('❌ No stored token information found');
      return;
    }

    console.log('📊 Current Token Status:');
    console.log(`- Extracted at: ${storedTokenInfo.extractedAt}`);
    console.log(`- Expires at: ${storedTokenInfo.expiresAt || 'Unknown'}`);
    console.log(`- Is valid: ${storedTokenInfo.isValid ? '✅' : '❌'}`);
    console.log(`- Token prefix: ${storedTokenInfo.token.substring(0, 20)}...`);

    if (storedTokenInfo.expiresAt) {
      const expirationDate = new Date(storedTokenInfo.expiresAt);
      const now = new Date();
      const hoursUntilExpiration = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilExpiration > 0) {
        console.log(`- Time until expiration: ${Math.round(hoursUntilExpiration)} hours`);
      } else {
        console.log(`- ⚠️ Token expired ${Math.round(Math.abs(hoursUntilExpiration))} hours ago`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking token status:', error);
  }
}

// Ejecutar según argumentos de línea de comandos
const command = process.argv[2];

async function main() {
  switch (command) {
    case 'status':
      await checkTokenStatus();
      break;
    case 'extract':
      await extractAndSaveToken();
      break;
    case 'monitor':
    default:
      await monitorToken();
      break;
  }
}

/**
 * Extraer y guardar un nuevo token manualmente
 */
async function extractAndSaveToken(): Promise<void> {
  try {
    console.log('🔍 Extrayendo nuevo token...');
    
    const newTokenInfo = await extractTokenFromFrontend();
    
    if (!newTokenInfo) {
      console.log('❌ No se pudo extraer un token válido');
      return;
    }

    console.log('✅ Token extraído exitosamente');
    console.log(`📅 Extraído: ${new Date(newTokenInfo.extractedAt).toLocaleString()}`);
    console.log(`⏰ Expira: ${newTokenInfo.expiresAt ? new Date(newTokenInfo.expiresAt).toLocaleString() : 'Desconocido'}`);
    
    // Actualizar servicio
    const updated = updateTokenInService(newTokenInfo.token);
    
    if (updated) {
      saveTokenInfo(newTokenInfo);
      console.log('🔄 Token actualizado en el servicio');
      console.log('💾 Backup guardado');
    } else {
      console.log('❌ Error actualizando el servicio');
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Error desconocido');
  }
}

main().catch(console.error);
