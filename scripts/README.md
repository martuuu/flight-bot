# Scripts de Testing y Análisis de API Arajet

Este directorio contiene scripts para probar y analizar las respuestas de la API de Arajet.

## 📁 Archivos

### `test-arajet-api.ts`
Script principal para realizar llamadas de prueba a la API de Arajet y loggear las respuestas.

**Características:**
- 🚀 Realiza llamadas HTTP reales a la API
- 📊 Mide tiempo de respuesta
- 💾 Guarda logs detallados en JSON
- 🔍 Analiza estructura de respuestas
- 🔄 Soporte para múltiples endpoints
- ⚡ Rate limiting automático entre tests

**Uso:**
```bash
# Test simple con endpoint por defecto
npm run test-arajet

# Test con endpoint específico
npm run test-arajet single /api/search-flights

# Tests múltiples con diferentes endpoints
npm run test-arajet multiple
```

### `analyze-response.ts`
Analizador de la estructura del response almacenado en `Response.md`.

**Características:**
- 🔍 Analiza estructura JSON completa
- 🏗️ Genera interfaces TypeScript automáticamente
- 📊 Crea resumen estadístico
- 💾 Genera ejemplos de uso
- 📋 Identifica tipos y propiedades

**Uso:**
```bash
# Analizar el response existente
npm run analyze-response
```

## 🗂️ Estructura de Logs

Los scripts generan logs en las siguientes ubicaciones:

```
logs/
└── api-tests/
    ├── arajet-api-test-YYYY-MM-DD-HH-mm-ss.json      # Resultado del test
    ├── arajet-response-YYYY-MM-DD-HH-mm-ss.json      # Response detallado
    └── ...

src/
└── types/
    └── generated/
        ├── arajet-types.ts          # Interfaces TypeScript generadas
        ├── analysis-YYYY-MM-DD.json # Análisis completo
        └── usage-example.ts         # Ejemplos de uso
```

## 📊 Formato de Logs

### Test Result (`arajet-api-test-*.json`)
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "success": true,
  "status": 200,
  "statusText": "OK",
  "responseTime": 1250,
  "error": null
}
```

### Detailed Response (`arajet-response-*.json`)
```json
{
  "metadata": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "status": 200,
    "responseTime": 1250,
    "success": true
  },
  "headers": { ... },
  "payload": { ... },
  "response": { ... }
}
```

## 🔧 Configuración

### Variables de Entorno
Configura estas variables en tu archivo `.env`:

```env
# URL base de la API de Arajet
ARAJET_API_URL=https://api.arajet.com

# Headers adicionales (opcional)
ARAJET_API_KEY=your_api_key_here
ARAJET_USER_AGENT=Mozilla/5.0...
```

### Payload de Test
El payload de prueba se genera automáticamente basado en el formato encontrado en `Payload.md`:

```json
{
  "currency": "USD",
  "languageCode": "es-do",
  "passengers": [
    { "code": "ADT", "count": 1 },
    { "code": "CHD", "count": 0 },
    { "code": "INF", "count": 0 }
  ],
  "routes": [
    {
      "fromAirport": "EZE",
      "toAirport": "PUJ",
      "departureDate": "2026-01-03",
      "startDate": "2025-12-31",
      "endDate": "2026-01-06"
    }
  ]
}
```

## 🎯 Casos de Uso

### 1. **Desarrollo Inicial**
```bash
# Analizar el response de ejemplo
npm run analyze-response

# Probar la API con el endpoint supuesto
npm run test-arajet single /search-flights
```

### 2. **Debugging de API**
```bash
# Test completo con logging detallado
npm run test-arajet single /api/flights

# Revisar los logs generados
cat logs/api-tests/arajet-response-*.json | jq '.'
```

### 3. **Descubrimiento de Endpoints**
```bash
# Probar múltiples endpoints posibles
npm run test-arajet multiple
```

### 4. **Integración Continua**
```bash
# Script automatizado para CI/CD
npm run test-arajet single && echo "API test passed"
```

## 🔍 Análisis de Respuestas

El script de análisis genera automáticamente:

1. **Interfaces TypeScript** - Para tipado fuerte
2. **Documentación** - Estructura detallada
3. **Ejemplos de uso** - Código de ejemplo
4. **Estadísticas** - Métricas de la respuesta

### Ejemplo de Interface Generada
```typescript
export interface ArajetResponse {
  routes?: ArajetRoute[];
}

export interface ArajetRoute {
  from?: ArajetRouteFrom;
  to?: ArajetRouteTo;
}

export interface ArajetRouteFromConnections {
  name?: string;
  code?: string;
  currency?: string;
  countryCode?: string;
  restrictedOnDeparture?: boolean;
  restrictedOnDestination?: boolean;
}
```

## 🚨 Troubleshooting

### Error: "Cannot resolve module"
```bash
# Instalar dependencias de TypeScript
npm install --save-dev ts-node tsconfig-paths
```

### Error: "API endpoint not found"
- Verificar la URL en `ARAJET_API_URL`
- Probar endpoints alternativos con `npm run test-arajet multiple`
- Revisar documentación de la API de Arajet

### Error: "Rate limiting"
- Aumentar la pausa entre requests en el código
- Verificar límites de la API
- Usar diferentes User-Agents

### Response vacío
- Verificar headers requeridos
- Comprobar autenticación (API keys)
- Validar formato del payload

## 📝 Notas de Desarrollo

- Los scripts están diseñados para ser **no destructivos**
- Incluyen **rate limiting** para evitar bloqueos
- Generan **logs detallados** para debugging
- Son **flexibles** y fáciles de modificar
- Incluyen **manejo de errores** robusto

## 🔄 Próximos Pasos

1. **Configurar endpoint real** - Una vez conocido
2. **Ajustar payload** - Según documentación oficial
3. **Implementar autenticación** - Si es requerida
4. **Integrar con scraper** - Actualizar `ArajetScraper.ts`
5. **Tests automatizados** - CI/CD pipeline
