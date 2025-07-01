import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface ArajetLowestFarePayload {
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

interface ArajetSearchShopPayload {
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
  endpoint: string;
  timestamp: string;
  success: boolean;
  status?: number;
  statusText?: string;
  data?: any;
  error?: string;
  responseTime: number;
  dataSize: number;
}

class ArajetAdvancedTester {
  private readonly baseUrl: string;
  private readonly logDir: string;

  constructor() {
    this.baseUrl = process.env['ARAJET_API_URL'] || 'https://arajet-api.ezycommerce.sabre.com';
    this.logDir = path.join(__dirname, '..', 'logs', 'api-tests');
    
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Crea payload para SearchLowestFare (calendario del mes)
   */
  private createLowestFarePayload(): ArajetLowestFarePayload {
    return {
      currency: "USD",
      fareTypeCategories: null,
      isManageBooking: false,
      languageCode: "es-do",
      passengers: [
        { code: "ADT", count: 2 },
        { code: "CHD", count: 1 },
        { code: "INF", count: 1 }
      ],
      routes: [
        {
          fromAirport: "SCL",
          toAirport: "PUJ",
          departureDate: "2026-02-06",
          startDate: "2026-02-01",
          endDate: "2026-02-28"
        }
      ]
    };
  }

  /**
   * Crea payload para SearchShop (fecha específica)
   */
  private createSearchShopPayload(): ArajetSearchShopPayload {
    return {
      currency: "USD",
      fareTypeCategories: null,
      isManageBooking: false,
      languageCode: "es-do",
      passengers: [
        { code: "ADT", count: 2 },
        { code: "CHD", count: 1 },
        { code: "INF", count: 1 }
      ],
      routes: [
        {
          fromAirport: "SCL",
          toAirport: "PUJ",
          departureDate: "2026-02-25",
          startDate: "2026-02-22",
          endDate: "2026-02-28"
        }
      ]
    };
  }

  /**
   * Headers comunes para ambos endpoints
   */
  private getHeaders() {
    return {
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
    };
  }

  /**
   * Test del endpoint SearchLowestFare
   */
  async testLowestFare(): Promise<TestResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const endpoint = '/api/v1/Availability/SearchLowestFare';
    
    console.log(`🗓️  === TEST SEARCH LOWEST FARE ===`);
    console.log(`📍 Endpoint: ${this.baseUrl}${endpoint}`);
    console.log(`🎯 Propósito: Obtener calendario completo del mes con precios más bajos`);
    
    try {
      const payload = this.createLowestFarePayload();
      
      console.log(`📤 Payload (Calendario mes completo):`);
      console.log(JSON.stringify(payload, null, 2));
      
      const response: AxiosResponse = await axios.post(`${this.baseUrl}${endpoint}`, payload, {
        headers: this.getHeaders(),
        timeout: 30000,
        validateStatus: () => true
      });

      const responseTime = Date.now() - startTime;
      const dataSize = JSON.stringify(response.data).length;
      
      console.log(`✅ Respuesta recibida:`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log(`⏱️  Tiempo: ${responseTime}ms`);
      console.log(`📦 Tamaño: ${dataSize.toLocaleString()} bytes`);
      
      return {
        endpoint,
        timestamp,
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        responseTime,
        dataSize
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      console.log(`❌ Error en SearchLowestFare:`);
      console.log(`🚨 Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return {
        endpoint,
        timestamp,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
        dataSize: 0
      };
    }
  }

  /**
   * Test del endpoint SearchShop
   */
  async testSearchShop(): Promise<TestResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const endpoint = '/api/v1/Availability/SearchShop';
    
    console.log(`\\n🛒 === TEST SEARCH SHOP ===`);
    console.log(`📍 Endpoint: ${this.baseUrl}${endpoint}`);
    console.log(`🎯 Propósito: Obtener detalles de vuelos para fecha específica`);
    
    try {
      const payload = this.createSearchShopPayload();
      
      console.log(`📤 Payload (Fecha específica):`);
      console.log(JSON.stringify(payload, null, 2));
      
      const response: AxiosResponse = await axios.post(`${this.baseUrl}${endpoint}`, payload, {
        headers: this.getHeaders(),
        timeout: 30000,
        validateStatus: () => true
      });

      const responseTime = Date.now() - startTime;
      const dataSize = JSON.stringify(response.data).length;
      
      console.log(`✅ Respuesta recibida:`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log(`⏱️  Tiempo: ${responseTime}ms`);
      console.log(`📦 Tamaño: ${dataSize.toLocaleString()} bytes`);
      
      return {
        endpoint,
        timestamp,
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        responseTime,
        dataSize
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      console.log(`❌ Error en SearchShop:`);
      console.log(`🚨 Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return {
        endpoint,
        timestamp,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
        dataSize: 0
      };
    }
  }

  /**
   * Ejecuta ambos tests y compara resultados
   */
  async runBothTests(): Promise<void> {
    console.log(`🔬 === TESTING AVANZADO DE ENDPOINTS ARAJET ===\\n`);
    
    // Test 1: SearchLowestFare
    const lowestFareResult = await this.testLowestFare();
    
    // Pausa entre tests
    console.log(`\\n⏳ Esperando 3 segundos...\\n`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 2: SearchShop
    const searchShopResult = await this.testSearchShop();
    
    // Guardar resultados
    await this.saveResults([lowestFareResult, searchShopResult]);
    
    // Resumen comparativo
    this.displayComparison(lowestFareResult, searchShopResult);
  }

  /**
   * Guarda los resultados de ambos tests
   */
  private async saveResults(results: TestResult[]): Promise<void> {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    for (const result of results) {
      if (result.data) {
        const filename = `arajet-${result.endpoint.split('/').pop()}-${timestamp}.json`;
        const filepath = path.join(this.logDir, filename);
        
        const detailedData = {
          metadata: {
            endpoint: result.endpoint,
            timestamp: result.timestamp,
            status: result.status,
            responseTime: result.responseTime,
            dataSize: result.dataSize,
            success: result.success
          },
          response: result.data
        };
        
        fs.writeFileSync(filepath, JSON.stringify(detailedData, null, 2));
        console.log(`💾 ${result.endpoint} guardado en: ${filename}`);
      }
    }
  }

  /**
   * Muestra comparación entre ambos endpoints
   */
  private displayComparison(lowestFare: TestResult, searchShop: TestResult): void {
    console.log(`\\n📊 === COMPARACIÓN DE ENDPOINTS ===`);
    
    console.log(`\\n🗓️  SEARCH LOWEST FARE (Calendario):`);
    console.log(`  ✅ Éxito: ${lowestFare.success ? 'SÍ' : 'NO'}`);
    console.log(`  📊 Status: ${lowestFare.status || 'N/A'}`);
    console.log(`  ⏱️  Tiempo: ${lowestFare.responseTime}ms`);
    console.log(`  📦 Tamaño: ${lowestFare.dataSize.toLocaleString()} bytes`);
    
    console.log(`\\n🛒 SEARCH SHOP (Fecha específica):`);
    console.log(`  ✅ Éxito: ${searchShop.success ? 'SÍ' : 'NO'}`);
    console.log(`  📊 Status: ${searchShop.status || 'N/A'}`);
    console.log(`  ⏱️  Tiempo: ${searchShop.responseTime}ms`);
    console.log(`  📦 Tamaño: ${searchShop.dataSize.toLocaleString()} bytes`);
    
    if (lowestFare.success && searchShop.success) {
      console.log(`\\n🎯 ANÁLISIS:`);
      console.log(`  📈 Diferencia de tamaño: ${Math.abs(lowestFare.dataSize - searchShop.dataSize).toLocaleString()} bytes`);
      console.log(`  ⚡ Diferencia de tiempo: ${Math.abs(lowestFare.responseTime - searchShop.responseTime)}ms`);
      
      if (lowestFare.dataSize > searchShop.dataSize) {
        console.log(`  🗓️  SearchLowestFare devuelve más datos (calendario completo)`);
      } else {
        console.log(`  🛒 SearchShop devuelve más datos (detalles específicos)`);
      }
    }
    
    console.log(`\\n🏁 Tests completados. Datos listos para análisis.`);
  }

  /**
   * Analiza la estructura de respuesta de SearchLowestFare
   */
  analyzeLowestFareStructure(data: any): void {
    console.log(`\\n🔍 === ANÁLISIS SEARCH LOWEST FARE ===`);
    
    if (data && typeof data === 'object') {
      const keys = Object.keys(data);
      console.log(`📋 Propiedades principales: ${keys.join(', ')}`);
      
      // Buscar datos del calendario
      if (data.dayRoutes && Array.isArray(data.dayRoutes)) {
        console.log(`📅 DayRoutes encontradas: ${data.dayRoutes.length}`);
        
        if (data.dayRoutes.length > 0) {
          const firstDay = data.dayRoutes[0];
          console.log(`📊 Estructura de día:`, Object.keys(firstDay));
        }
      }
      
      if (data.routes && Array.isArray(data.routes)) {
        console.log(`✈️  Routes encontradas: ${data.routes.length}`);
      }
    }
  }
}

// Función principal para ejecutar desde la línea de comandos
async function main() {
  const tester = new ArajetAdvancedTester();
  
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'lowest-fare':
      const lowestFareResult = await tester.testLowestFare();
      if (lowestFareResult.data) {
        tester.analyzeLowestFareStructure(lowestFareResult.data);
      }
      break;
    case 'search-shop':
      await tester.testSearchShop();
      break;
    case 'both':
    default:
      await tester.runBothTests();
      break;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

export { ArajetAdvancedTester };
