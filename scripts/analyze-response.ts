import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para analizar la estructura del response de Arajet
 * y crear interfaces TypeScript basadas en el ejemplo
 */

interface ResponseAnalysis {
  structure: any;
  types: string[];
  interfaces: string;
  summary: {
    totalProperties: number;
    maxDepth: number;
    arrayProperties: string[];
    objectProperties: string[];
    primitiveProperties: string[];
  };
}

class ResponseAnalyzer {
  private readonly responseFilePath: string;
  private readonly outputDir: string;

  constructor() {
    this.responseFilePath = path.join(__dirname, '..', 'response.md');
    this.outputDir = path.join(__dirname, '..', 'src', 'types', 'generated');
    
    // Crear directorio de salida si no existe
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Lee y parsea el archivo Response.md
   */
  private loadResponseData(): any {
    try {
      const content = fs.readFileSync(this.responseFilePath, 'utf-8');
      
      // Extraer el JSON del archivo markdown
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/^\s*(\{[\s\S]*\})\s*$/m);
      
      if (!jsonMatch) {
        // Intentar parsear todo el contenido como JSON
        const cleanContent = content.replace(/^#.*$/gm, '').trim();
        if (cleanContent.startsWith('{')) {
          return JSON.parse(cleanContent);
        }
        throw new Error('No se encontró JSON válido en el archivo');
      }
      
      return JSON.parse(jsonMatch[1]);
    } catch (error) {
      console.error('❌ Error al leer el archivo Response.md:', error);
      
      // Retornar un objeto de ejemplo basado en la estructura que vimos
      return this.getExampleResponse();
    }
  }

  /**
   * Objeto de ejemplo basado en la estructura vista
   */
  private getExampleResponse(): any {
    return {
      routes: [
        {
          from: {
            connections: [
              {
                name: "¡Nuevo! 🎢 Orlando Sanford, Estados Unidos",
                code: "SFB",
                currency: "USD",
                countryCode: "USA",
                restrictedOnDeparture: false,
                restrictedOnDestination: false
              }
            ]
          },
          to: {
            connections: []
          }
        }
      ]
    };
  }

  /**
   * Analiza la estructura de un objeto recursivamente
   */
  private analyzeStructure(obj: any, depth: number = 0, maxDepth: number = 10): any {
    if (depth > maxDepth || obj === null || obj === undefined) {
      return typeof obj;
    }

    if (Array.isArray(obj)) {
      return {
        type: 'array',
        length: obj.length,
        itemType: obj.length > 0 ? this.analyzeStructure(obj[0], depth + 1, maxDepth) : 'unknown'
      };
    }

    if (typeof obj === 'object') {
      const structure: any = { type: 'object', properties: {} };
      
      for (const [key, value] of Object.entries(obj)) {
        structure.properties[key] = this.analyzeStructure(value, depth + 1, maxDepth);
      }
      
      return structure;
    }

    return typeof obj;
  }

  /**
   * Genera interfaces TypeScript basadas en la estructura
   */
  private generateTypeScriptInterfaces(obj: any, interfaceName: string = 'ArajetResponse'): string {
    let interfaces = '';
    const processedTypes = new Set<string>();

    const generateInterface = (data: any, name: string): string => {
      if (processedTypes.has(name)) return '';
      processedTypes.add(name);

      let interfaceStr = `export interface ${name} {\n`;
      
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        for (const [key, value] of Object.entries(data)) {
          const propertyType = this.getTypeScriptType(value, `${name}${this.capitalize(key)}`);
          const isOptional = this.shouldBeOptional(value) ? '?' : '';
          interfaceStr += `  ${key}${isOptional}: ${propertyType};\n`;
        }
      }
      
      interfaceStr += '}\n\n';
      return interfaceStr;
    };

    const generateNestedInterfaces = (data: any, baseName: string): void => {
      if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
          if (data.length > 0) {
            generateNestedInterfaces(data[0], baseName);
          }
        } else {
          for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
              const nestedName = `${baseName}${this.capitalize(key)}`;
              interfaces += generateInterface(value, nestedName);
              generateNestedInterfaces(value, nestedName);
            }
          }
        }
      }
    };

    // Generar interface principal
    interfaces = generateInterface(obj, interfaceName);
    
    // Generar interfaces anidadas
    generateNestedInterfaces(obj, interfaceName.replace('Response', ''));

    return interfaces;
  }

  /**
   * Obtiene el tipo TypeScript correspondiente
   */
  private getTypeScriptType(value: any, nestedTypeName: string): string {
    if (value === null || value === undefined) {
      return 'any';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'any[]';
      }
      
      const itemType = typeof value[0] === 'object' && value[0] !== null 
        ? nestedTypeName 
        : typeof value[0];
        
      return `${itemType}[]`;
    }

    if (typeof value === 'object') {
      return nestedTypeName;
    }

    switch (typeof value) {
      case 'string': return 'string';
      case 'number': return 'number';
      case 'boolean': return 'boolean';
      default: return 'any';
    }
  }

  /**
   * Determina si una propiedad debería ser opcional
   */
  private shouldBeOptional(value: any): boolean {
    return value === null || value === undefined || 
           (Array.isArray(value) && value.length === 0);
  }

  /**
   * Capitaliza la primera letra de una cadena
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Genera un resumen del análisis
   */
  private generateSummary(obj: any): ResponseAnalysis['summary'] {
    const summary = {
      totalProperties: 0,
      maxDepth: 0,
      arrayProperties: [] as string[],
      objectProperties: [] as string[],
      primitiveProperties: [] as string[]
    };

    const analyze = (data: any, path: string = '', depth: number = 0): void => {
      summary.maxDepth = Math.max(summary.maxDepth, depth);

      if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
          summary.arrayProperties.push(path || 'root');
          if (data.length > 0) {
            analyze(data[0], `${path}[0]`, depth + 1);
          }
        } else {
          if (path) summary.objectProperties.push(path);
          
          for (const [key, value] of Object.entries(data)) {
            summary.totalProperties++;
            const newPath = path ? `${path}.${key}` : key;
            analyze(value, newPath, depth + 1);
          }
        }
      } else {
        summary.primitiveProperties.push(path || 'root');
      }
    };

    analyze(obj);
    return summary;
  }

  /**
   * Ejecuta el análisis completo
   */
  public async analyzeResponse(): Promise<ResponseAnalysis> {
    console.log('🔍 === ANÁLISIS DE RESPONSE ARAJET ===\n');
    
    // Cargar datos
    console.log('📖 Cargando datos del response...');
    const responseData = this.loadResponseData();
    
    if (!responseData) {
      throw new Error('No se pudieron cargar los datos del response');
    }
    
    console.log('✅ Datos cargados correctamente\n');
    
    // Analizar estructura
    console.log('🏗️  Analizando estructura...');
    const structure = this.analyzeStructure(responseData);
    
    // Generar interfaces
    console.log('🔧 Generando interfaces TypeScript...');
    const interfaces = this.generateTypeScriptInterfaces(responseData);
    
    // Generar resumen
    console.log('📊 Generando resumen...');
    const summary = this.generateSummary(responseData);
    
    const analysis: ResponseAnalysis = {
      structure,
      types: Object.keys(responseData),
      interfaces,
      summary
    };
    
    // Guardar resultados
    await this.saveAnalysis(analysis, responseData);
    
    // Mostrar resumen
    this.displaySummary(analysis);
    
    return analysis;
  }

  /**
   * Guarda el análisis en archivos
   */
  private async saveAnalysis(analysis: ResponseAnalysis, originalData: any): Promise<void> {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    // Guardar interfaces TypeScript
    const interfacesFile = path.join(this.outputDir, 'arajet-types.ts');
    const interfacesContent = `// Interfaces generadas automáticamente desde Response.md
// Generado el: ${new Date().toISOString()}

${analysis.interfaces}

// Tipo principal para el response completo
export type ArajetApiResponse = ArajetResponse;
`;
    
    fs.writeFileSync(interfacesFile, interfacesContent);
    console.log(`💾 Interfaces guardadas en: ${interfacesFile}`);
    
    // Guardar análisis completo
    const analysisFile = path.join(this.outputDir, `analysis-${timestamp}.json`);
    const analysisContent = {
      timestamp: new Date().toISOString(),
      originalData,
      analysis
    };
    
    fs.writeFileSync(analysisFile, JSON.stringify(analysisContent, null, 2));
    console.log(`💾 Análisis completo guardado en: ${analysisFile}`);
    
    // Guardar ejemplo de uso
    const exampleFile = path.join(this.outputDir, 'usage-example.ts');
    const exampleContent = `// Ejemplo de uso de las interfaces generadas
import { ArajetApiResponse } from './arajet-types';

// Función de ejemplo para procesar el response
export function processArajetResponse(response: ArajetApiResponse): void {
  console.log('Procesando response de Arajet...');
  
  // Acceder a las rutas
  if (response.routes && response.routes.length > 0) {
    response.routes.forEach((route, index) => {
      console.log(\`Ruta \${index + 1}:\`);
      
      // Procesar conexiones de origen
      if (route.from?.connections) {
        console.log(\`  Desde: \${route.from.connections.length} conexiones disponibles\`);
        route.from.connections.forEach(connection => {
          console.log(\`    - \${connection.name} (\${connection.code})\`);
        });
      }
      
      // Procesar conexiones de destino  
      if (route.to?.connections) {
        console.log(\`  Hacia: \${route.to.connections.length} conexiones disponibles\`);
        route.to.connections.forEach(connection => {
          console.log(\`    - \${connection.name} (\${connection.code})\`);
        });
      }
    });
  }
}

// Ejemplo de validación de response
export function validateArajetResponse(data: any): data is ArajetApiResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.routes)
  );
}
`;
    
    fs.writeFileSync(exampleFile, exampleContent);
    console.log(`💾 Ejemplo de uso guardado en: ${exampleFile}`);
  }

  /**
   * Muestra un resumen del análisis
   */
  private displaySummary(analysis: ResponseAnalysis): void {
    console.log('\n📋 === RESUMEN DEL ANÁLISIS ===');
    console.log(`📊 Total de propiedades: ${analysis.summary.totalProperties}`);
    console.log(`📏 Profundidad máxima: ${analysis.summary.maxDepth}`);
    console.log(`📦 Propiedades tipo array: ${analysis.summary.arrayProperties.length}`);
    console.log(`🏗️  Propiedades tipo objeto: ${analysis.summary.objectProperties.length}`);
    console.log(`🔤 Propiedades primitivas: ${analysis.summary.primitiveProperties.length}`);
    
    console.log('\n🗂️  Propiedades principales:');
    analysis.types.forEach(type => {
      console.log(`  • ${type}`);
    });
    
    if (analysis.summary.arrayProperties.length > 0) {
      console.log('\n📋 Arrays encontrados:');
      analysis.summary.arrayProperties.slice(0, 5).forEach(prop => {
        console.log(`  • ${prop}`);
      });
      if (analysis.summary.arrayProperties.length > 5) {
        console.log(`  ... y ${analysis.summary.arrayProperties.length - 5} más`);
      }
    }
    
    console.log('\n✅ Análisis completado');
  }
}

// Función principal
async function main() {
  try {
    const analyzer = new ResponseAnalyzer();
    await analyzer.analyzeResponse();
  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

export { ResponseAnalyzer };
