import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para comparar la respuesta real de la API con el análisis previo
 */

interface ComparisonResult {
  realResponse: {
    size: number;
    properties: number;
    structure: any;
  };
  mockResponse: {
    size: number;
    properties: number;
    structure: any;
  };
  differences: string[];
  similarities: string[];
  accuracy: number;
}

class ResponseComparison {
  private readonly logDir: string;
  private readonly mockResponsePath: string;

  constructor() {
    this.logDir = path.join(__dirname, '..', 'logs', 'api-tests');
    this.mockResponsePath = path.join(__dirname, '..', 'response.md');
  }

  /**
   * Encuentra el archivo de respuesta más reciente
   */
  private getLatestResponseFile(): string | null {
    try {
      const files = fs.readdirSync(this.logDir)
        .filter(file => file.startsWith('arajet-response-') && file.endsWith('.json'))
        .sort()
        .reverse();

      return files.length > 0 ? path.join(this.logDir, files[0]) : null;
    } catch (error) {
      console.error('Error leyendo directorio de logs:', error);
      return null;
    }
  }

  /**
   * Lee la respuesta real de la API
   */
  private loadRealResponse(): any {
    const latestFile = this.getLatestResponseFile();
    
    if (!latestFile) {
      throw new Error('No se encontró archivo de respuesta de API');
    }

    try {
      const content = fs.readFileSync(latestFile, 'utf-8');
      const data = JSON.parse(content);
      return data.response;
    } catch (error) {
      console.error('Error leyendo respuesta real:', error);
      throw error;
    }
  }

  /**
   * Lee la respuesta mock del archivo Response.md
   */
  private loadMockResponse(): any {
    try {
      const content = fs.readFileSync(this.mockResponsePath, 'utf-8');
      
      // Limpiar contenido markdown
      const cleanContent = content.replace(/^#.*$/gm, '').trim();
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error leyendo respuesta mock:', error);
      throw error;
    }
  }

  /**
   * Cuenta propiedades recursivamente
   */
  private countProperties(obj: any, visited = new Set()): number {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return 0;
    }

    // Evitar bucles infinitos
    if (visited.has(obj)) {
      return 0;
    }
    visited.add(obj);

    let count = 0;

    if (Array.isArray(obj)) {
      if (obj.length > 0) {
        count += this.countProperties(obj[0], visited);
      }
    } else {
      const keys = Object.keys(obj);
      count += keys.length;
      
      for (const key of keys) {
        count += this.countProperties(obj[key], visited);
      }
    }

    return count;
  }

  /**
   * Obtiene las rutas de propiedades de un objeto
   */
  private getPropertyPaths(obj: any, prefix = '', paths: string[] = []): string[] {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return paths;
    }

    if (Array.isArray(obj)) {
      const arrayPath = prefix + '[]';
      paths.push(arrayPath);
      
      if (obj.length > 0) {
        this.getPropertyPaths(obj[0], arrayPath + '.', paths);
      }
    } else {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = prefix + key;
        paths.push(currentPath);
        
        if (typeof value === 'object' && value !== null) {
          this.getPropertyPaths(value, currentPath + '.', paths);
        }
      }
    }

    return paths;
  }

  /**
   * Compara las estructuras de respuesta
   */
  public compareResponses(): ComparisonResult {
    console.log('🔍 === COMPARACIÓN DE RESPUESTAS ===\\n');
    
    console.log('📖 Cargando respuesta real de la API...');
    const realResponse = this.loadRealResponse();
    
    console.log('📖 Cargando respuesta mock...');
    const mockResponse = this.loadMockResponse();
    
    console.log('📊 Analizando estructuras...');
    
    // Analizar respuesta real
    const realSize = JSON.stringify(realResponse).length;
    const realProperties = this.countProperties(realResponse);
    const realPaths = this.getPropertyPaths(realResponse);
    
    // Analizar respuesta mock
    const mockSize = JSON.stringify(mockResponse).length;
    const mockProperties = this.countProperties(mockResponse);
    const mockPaths = this.getPropertyPaths(mockResponse);
    
    console.log('🔍 Comparando estructuras...');
    
    // Encontrar similitudes y diferencias
    const similarities: string[] = [];
    const differences: string[] = [];
    
    // Propiedades en común
    const commonPaths = realPaths.filter(path => mockPaths.includes(path));
    similarities.push(...commonPaths);
    
    // Propiedades solo en real
    const realOnlyPaths = realPaths.filter(path => !mockPaths.includes(path));
    differences.push(...realOnlyPaths.map(path => `Real: +${path}`));
    
    // Propiedades solo en mock
    const mockOnlyPaths = mockPaths.filter(path => !realPaths.includes(path));
    differences.push(...mockOnlyPaths.map(path => `Mock: +${path}`));
    
    // Calcular precisión
    const accuracy = (similarities.length / Math.max(realPaths.length, mockPaths.length)) * 100;
    
    const result: ComparisonResult = {
      realResponse: {
        size: realSize,
        properties: realProperties,
        structure: this.getStructureSummary(realResponse)
      },
      mockResponse: {
        size: mockSize,
        properties: mockProperties,
        structure: this.getStructureSummary(mockResponse)
      },
      differences,
      similarities,
      accuracy
    };
    
    this.displayComparison(result);
    this.saveComparison(result);
    
    return result;
  }

  /**
   * Obtiene un resumen de la estructura
   */
  private getStructureSummary(obj: any): any {
    if (obj === null || obj === undefined) return null;
    
    if (Array.isArray(obj)) {
      return {
        type: 'array',
        length: obj.length,
        sample: obj.length > 0 ? this.getStructureSummary(obj[0]) : null
      };
    }
    
    if (typeof obj === 'object') {
      const summary: any = { type: 'object', properties: {} };
      const keys = Object.keys(obj).slice(0, 10); // Solo primeras 10 propiedades
      
      for (const key of keys) {
        summary.properties[key] = this.getStructureSummary(obj[key]);
      }
      
      if (Object.keys(obj).length > 10) {
        summary.properties['...'] = `${Object.keys(obj).length - 10} more properties`;
      }
      
      return summary;
    }
    
    return typeof obj;
  }

  /**
   * Muestra la comparación
   */
  private displayComparison(result: ComparisonResult): void {
    console.log('\\n📋 === RESULTADO DE LA COMPARACIÓN ===');
    
    console.log('\\n📦 RESPUESTA REAL:');
    console.log(`  📊 Tamaño: ${result.realResponse.size.toLocaleString()} bytes`);
    console.log(`  🏗️  Propiedades: ${result.realResponse.properties.toLocaleString()}`);
    
    console.log('\\n📦 RESPUESTA MOCK:');
    console.log(`  📊 Tamaño: ${result.mockResponse.size.toLocaleString()} bytes`);
    console.log(`  🏗️  Propiedades: ${result.mockResponse.properties.toLocaleString()}`);
    
    console.log('\\n📈 MÉTRICAS:');
    console.log(`  🎯 Precisión: ${result.accuracy.toFixed(1)}%`);
    console.log(`  ✅ Similitudes: ${result.similarities.length}`);
    console.log(`  ❌ Diferencias: ${result.differences.length}`);
    
    console.log('\\n✅ PRINCIPALES SIMILITUDES:');
    result.similarities.slice(0, 10).forEach(similarity => {
      console.log(`  ✓ ${similarity}`);
    });
    
    if (result.similarities.length > 10) {
      console.log(`  ... y ${result.similarities.length - 10} más`);
    }
    
    if (result.differences.length > 0) {
      console.log('\\n❌ PRINCIPALES DIFERENCIAS:');
      result.differences.slice(0, 10).forEach(difference => {
        console.log(`  • ${difference}`);
      });
      
      if (result.differences.length > 10) {
        console.log(`  ... y ${result.differences.length - 10} más`);
      }
    }
    
    console.log('\\n🎯 CONCLUSIÓN:');
    if (result.accuracy >= 90) {
      console.log('🏆 Excelente! El mock es muy preciso');
    } else if (result.accuracy >= 70) {
      console.log('👍 Bueno! El mock es bastante preciso');
    } else if (result.accuracy >= 50) {
      console.log('⚠️  Regular. El mock tiene diferencias significativas');
    } else {
      console.log('🚨 El mock es muy diferente de la respuesta real');
    }
  }

  /**
   * Guarda el resultado de la comparación
   */
  private saveComparison(result: ComparisonResult): void {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const outputFile = path.join(this.logDir, `comparison-${timestamp}.json`);
    
    const output = {
      timestamp: new Date().toISOString(),
      comparison: result,
      metadata: {
        realResponseFile: this.getLatestResponseFile(),
        mockResponseFile: this.mockResponsePath
      }
    };
    
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`\\n💾 Comparación guardada en: ${outputFile}`);
  }
}

// Función principal
async function main() {
  try {
    const comparison = new ResponseComparison();
    await comparison.compareResponses();
  } catch (error) {
    console.error('❌ Error durante la comparación:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

export { ResponseComparison };
