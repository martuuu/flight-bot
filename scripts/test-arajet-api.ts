import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface ArajetApiPayload {
  currency: string;
  fareTypeCategories: null;
  isManageBooking: boolean;
  languageCode: string;
  passengers: Array<{
    code: string;
    count: number;
  }>;
  routes: Array<{
    fromAirport: string;
    toAirport: string;
    departureDate: string;
    startDate: string;
    endDate: string;
  }>;
}

interface TestResult {
  timestamp: string;
  success: boolean;
  status?: number;
  statusText?: string;
  data?: any;
  error?: string;
  responseTime: number;
  headers?: any;
}

class ArajetApiTester {
  private readonly apiUrl: string;
  private readonly logDir: string;

  constructor() {
    // URL real de la API de Arajet (descubierta via network inspector)
    this.apiUrl = process.env['ARAJET_API_URL'] || 'https://arajet-api.ezycommerce.sabre.com';
    this.logDir = path.join(__dirname, '..', 'logs', 'api-tests');
    
    // Crear directorio de logs si no existe
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Crea el payload basado en el formato del archivo Payload.md
   */
  private createTestPayload(): ArajetApiPayload {
    return {
      currency: "USD",
      fareTypeCategories: null,
      isManageBooking: false,
      languageCode: "es-do",
      passengers: [
        { code: "ADT", count: 1 },
        { code: "CHD", count: 0 },
        { code: "INF", count: 0 }
      ],
      routes: [
        {
          fromAirport: "EZE",
          toAirport: "PUJ",
          departureDate: "2026-01-03",
          startDate: "2025-12-31",
          endDate: "2026-01-06"
        },
        {
          fromAirport: "PUJ",
          toAirport: "EZE",
          departureDate: "2026-01-17",
          startDate: "2026-01-14",
          endDate: "2026-01-20"
        }
      ]
    };
  }

  /**
   * Realiza una llamada de prueba a la API
   */
  async testApiCall(endpoint: string = '/api/v1/Availability/SearchShop'): Promise<TestResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    console.log(`🚀 Iniciando test de API Arajet...`);
    console.log(`📍 Endpoint: ${this.apiUrl}${endpoint}`);
    console.log(`⏰ Timestamp: ${timestamp}`);
    
    try {
      const payload = this.createTestPayload();
      
      console.log(`📤 Payload enviado:`);
      console.log(JSON.stringify(payload, null, 2));
      
      const response: AxiosResponse = await axios.post(`${this.apiUrl}${endpoint}`, payload, {
        headers: {
          'Accept': 'text/plain',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.8',
          'Access-Control-Allow-Origin': '*',
          'AppContext': 'ibe',
          'Content-Type': 'application/json',
          'LanguageCode': 'es-do',
          'Origin': 'https://www.arajet.com',
          'Referer': 'https://www.arajet.com/',
          'Sec-CH-UA': '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          'Sec-CH-UA-Mobile': '?0',
          'Sec-CH-UA-Platform': '"macOS"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-GPC': '1',
          'Tenant-Identifier': 'caTRCudVPKmnHNnNeTgD3jDHwtsVvNtTmVHnRhYQzEqVboamwZp6fDEextRR8DAB',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
          'X-ClientVersion': '0.5.3476',
          'X-UserIdentifier': 'kKEBDZhkH9m6TPYLFjqgUGiohOmMqE'
        },
        timeout: 30000,
        validateStatus: () => true // No lanzar error por códigos de estado
      });

      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        timestamp,
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        responseTime,
        headers: response.headers
      };

      console.log(`✅ Respuesta recibida:`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log(`⏱️  Tiempo de respuesta: ${responseTime}ms`);
      console.log(`📦 Tamaño de respuesta: ${JSON.stringify(response.data).length} bytes`);
      
      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        timestamp,
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        responseTime
      };

      console.log(`❌ Error en la llamada:`);
      console.log(`🚨 Error: ${result.error}`);
      console.log(`⏱️  Tiempo transcurrido: ${responseTime}ms`);
      
      return result;
    }
  }

  /**
   * Guarda el resultado del test en un archivo de log
   */
  private saveTestResult(result: TestResult): string {
    const filename = `arajet-api-test-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    const filepath = path.join(this.logDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
    
    return filepath;
  }

  /**
   * Guarda la respuesta detallada en un archivo separado para análisis
   */
  private saveDetailedResponse(result: TestResult): string | null {
    if (!result.data) return null;
    
    const filename = `arajet-response-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    const filepath = path.join(this.logDir, filename);
    
    const detailedData = {
      metadata: {
        timestamp: result.timestamp,
        status: result.status,
        statusText: result.statusText,
        responseTime: result.responseTime,
        success: result.success
      },
      headers: result.headers,
      payload: this.createTestPayload(),
      response: result.data
    };
    
    fs.writeFileSync(filepath, JSON.stringify(detailedData, null, 2));
    
    return filepath;
  }

  /**
   * Ejecuta el test completo y guarda los resultados
   */
  async runFullTest(endpoint?: string): Promise<void> {
    console.log(`\n🔬 === TEST DE API ARAJET ===\n`);
    
    const result = await this.testApiCall(endpoint);
    
    // Guardar resultado del test
    const testLogPath = this.saveTestResult(result);
    console.log(`\n📄 Log del test guardado en: ${testLogPath}`);
    
    // Guardar respuesta detallada si hay datos
    if (result.data) {
      const detailedLogPath = this.saveDetailedResponse(result);
      if (detailedLogPath) {
        console.log(`📄 Respuesta detallada guardada en: ${detailedLogPath}`);
      }
    }

    // Resumen del test
    console.log(`\n📋 === RESUMEN DEL TEST ===`);
    console.log(`✅ Éxito: ${result.success ? 'SÍ' : 'NO'}`);
    console.log(`📊 Status Code: ${result.status || 'N/A'}`);
    console.log(`⏱️  Tiempo de respuesta: ${result.responseTime}ms`);
    
    if (result.error) {
      console.log(`🚨 Error: ${result.error}`);
    }
    
    if (result.data) {
      console.log(`📦 Datos recibidos: ${Object.keys(result.data).length} propiedades principales`);
      
      // Mostrar estructura básica de la respuesta
      console.log(`\n🏗️  Estructura de la respuesta:`);
      this.logObjectStructure(result.data, 2);
    }
    
    console.log(`\n🏁 Test completado\n`);
  }

  /**
   * Muestra la estructura de un objeto de forma legible
   */
  private logObjectStructure(obj: any, maxDepth: number, currentDepth: number = 0, prefix: string = ''): void {
    if (currentDepth >= maxDepth || obj === null || obj === undefined) {
      return;
    }

    if (Array.isArray(obj)) {
      console.log(`${prefix}Array[${obj.length}]`);
      if (obj.length > 0 && currentDepth < maxDepth - 1) {
        this.logObjectStructure(obj[0], maxDepth, currentDepth + 1, prefix + '  [0]: ');
      }
    } else if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      keys.slice(0, 10).forEach(key => { // Mostrar solo las primeras 10 propiedades
        const value = obj[key];
        const type = Array.isArray(value) ? `Array[${value.length}]` : typeof value;
        console.log(`${prefix}${key}: ${type}`);
        
        if (currentDepth < maxDepth - 1 && typeof value === 'object' && value !== null) {
          this.logObjectStructure(value, maxDepth, currentDepth + 1, prefix + '  ');
        }
      });
      
      if (keys.length > 10) {
        console.log(`${prefix}... y ${keys.length - 10} propiedades más`);
      }
    }
  }

  /**
   * Test con diferentes endpoints o configuraciones
   */
  async runMultipleTests(): Promise<void> {
    const endpoints = [
      '/api/v1/Availability/SearchShop',
      '/api/v1/Availability/Search',
      '/api/v1/SearchShop',
      '/api/v1/flights/search'
    ];

    console.log(`\n🔬 === TESTS MÚLTIPLES DE API ARAJET ===\n`);
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      console.log(`\n--- Test ${i + 1}/${endpoints.length}: ${endpoint} ---`);
      
      try {
        await this.runFullTest(endpoint);
      } catch (error) {
        console.log(`❌ Error en test para ${endpoint}: ${error}`);
      }
      
      // Pausa entre tests para evitar rate limiting
      if (i < endpoints.length - 1) {
        console.log(`⏳ Esperando 3 segundos antes del siguiente test...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
}

// Función principal para ejecutar desde la línea de comandos
async function main() {
  const tester = new ArajetApiTester();
  
  const args = process.argv.slice(2);
  const command = args[0];
  const endpoint = args[1];

  switch (command) {
    case 'single':
      await tester.runFullTest(endpoint);
      break;
    case 'multiple':
      await tester.runMultipleTests();
      break;
    default:
      console.log(`
🔬 Script de Test de API Arajet

Uso:
  npm run test-arajet single [endpoint]     - Ejecuta un test simple
  npm run test-arajet multiple             - Ejecuta tests con múltiples endpoints

Ejemplos:
  npm run test-arajet single /api/v1/Availability/SearchShop
  npm run test-arajet multiple

Si no se especifica un endpoint, se usará /api/v1/Availability/SearchShop por defecto.
      `);
      
      // Ejecutar test simple por defecto
      await tester.runFullTest();
      break;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

export { ArajetApiTester };
