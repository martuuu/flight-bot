# Alertas de Millas Aerolíneas Argentinas Plus

Este módulo implementa la funcionalidad para buscar y crear alertas de vuelos con millas del programa Aerolíneas Plus de Aerolíneas Argentinas.

## Características

### 🎫 Sistema de Alertas de Millas
- Búsqueda automática de ofertas promocionales
- Alertas por máximo de millas
- Filtros por clase de cabina
- Monitoreo de disponibilidad
- Análisis de precios y tendencias

### 🔍 Tipos de Búsqueda
1. **Promocionales (PROMO)**: Ofertas especiales con descuentos en millas
2. **Regulares (REGULAR)**: Tarifas estándar con millas
3. **Award (AWARD)**: Vuelos premio con millas
4. **Todas (ALL)**: Cualquier tipo de tarifa

### ✈️ Comandos Disponibles

#### `/millas-ar` - Crear Alerta
```
Uso: /millas-ar ORIGEN DESTINO [FECHA] [MAX_MILLAS] [ADULTOS]

Ejemplos:
• /millas-ar EZE MIA                    # Búsqueda flexible
• /millas-ar EZE MIA 2025-03-15         # Fecha específica
• /millas-ar EZE MIA 2025-03-15 60000   # Con límite de millas
• /millas-ar EZE MIA - 60000 2          # 2 adultos, sin fecha
```

#### `/millas-ar-search` - Búsqueda Inmediata
```
Uso: /millas-ar-search ORIGEN DESTINO FECHA [MAX_MILLAS]

Ejemplos:
• /millas-ar-search EZE MIA 2025-03-15
• /millas-ar-search EZE MIA 2025-03-15 60000
```

#### `/millas-ar-myalerts` - Ver Mis Alertas
```
Muestra todas las alertas activas de millas de Aerolíneas Argentinas
```

## API de Aerolíneas Argentinas

### Endpoints Utilizados

1. **Búsqueda de Calendario**
   ```
   GET /v1/flights/offers?flexDates=true&awardBooking=true
   ```

2. **Búsqueda Específica**
   ```
   GET /v1/flights/offers?flexDates=false&awardBooking=true
   ```

3. **Bundle de Idiomas**
   ```
   GET /v1/localization/languageBundles/es-AR_flightOffers
   ```

### Parámetros de Búsqueda

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `adt` | Adultos | `1` |
| `chd` | Niños | `0` |
| `inf` | Infantes | `0` |
| `flexDates` | Fechas flexibles | `true/false` |
| `cabinClass` | Clase de cabina | `Economy` |
| `flightType` | Tipo de vuelo | `ONE_WAY` |
| `awardBooking` | Búsqueda de millas | `true` |
| `leg` | Tramo | `EZE-MIA-20250315` |

## Estructura de Datos

### AerolineasAlert
```typescript
interface AerolineasAlert {
  id: string;
  userId: number;
  origin: string;
  destination: string;
  departureDate?: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass?: AerolineasCabinClass;
  flightType: AerolineasFlightType;
  searchType: AerolineasSearchType;
  maxMiles?: number;
  maxPrice?: number;
  minAvailableSeats?: number;
  preferredTimes?: string[];
  excludeStops?: boolean;
  isActive: boolean;
  lastChecked?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### AerolineasDeal
```typescript
interface AerolineasDeal {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price?: number;
  miles?: number;
  currency: string;
  cabinClass: AerolineasCabinClass;
  flightType: AerolineasFlightType;
  fareFamily: string;
  availableSeats: number;
  segments: AerolineasSegment[];
  restrictions: string[];
  bookingUrl?: string;
  validUntil?: Date;
  isPromo: boolean;
  foundAt: Date;
}
```

## Aeropuertos Soportados

### Argentina
- **EZE**: Buenos Aires (Ezeiza)
- **AEP**: Buenos Aires (Jorge Newbery)
- **COR**: Córdoba
- **MDZ**: Mendoza
- **IGU**: Iguazú
- **BRC**: Bariloche
- **USH**: Ushuaia
- **FTE**: El Calafate

### Internacionales Principales
- **MIA**: Miami
- **JFK**: Nueva York
- **MAD**: Madrid
- **GRU**: São Paulo
- **SCL**: Santiago
- **MVD**: Montevideo
- **LIM**: Lima
- **BOG**: Bogotá

## Configuración

### Variables de Entorno
```env
AEROLINEAS_API_URL=https://api.aerolineas.com.ar
```

### Rate Limiting
- **Requests por minuto**: 30
- **Delay entre requests**: 2000ms
- **Reintentos**: 3 intentos
- **Delay de reintentos**: 1000ms

## Funcionalidades Avanzadas

### 🔄 Monitoreo Automático
- Verificación periódica de alertas activas
- Detección de cambios en disponibilidad
- Notificaciones automáticas de ofertas

### 📊 Análisis de Precios
- Seguimiento histórico de precios en millas
- Identificación de ofertas promocionales
- Calendario de disponibilidad
- Estadísticas de rutas populares

### 🎯 Filtros Inteligentes
- Detección automática de ofertas "Promo"
- Filtrado por familia tarifaria
- Exclusión de vuelos con escalas
- Preferencias de horarios

### 💾 Persistencia
- Base de datos SQLite para alertas
- Historial de búsquedas
- Cache de resultados frecuentes
- Logs detallados de actividad

## Ejemplos de Uso

### Crear Alerta Simple
```bash
/millas-ar EZE MIA
```
Crea una alerta flexible para encontrar cualquier oferta de Buenos Aires a Miami.

### Alerta con Límite de Millas
```bash
/millas-ar EZE MIA 2025-03-15 60000
```
Alerta para el 15 de marzo con máximo 60,000 millas.

### Búsqueda Inmediata
```bash
/millas-ar-search EZE MIA 2025-03-15
```
Busca ofertas inmediatamente para la fecha especificada.

## Estructura de Archivos

```
src/
├── types/
│   └── aerolineas-api.ts         # Tipos TypeScript
├── services/
│   └── AerolineasAlertService.ts # Servicio principal
├── models/
│   └── AerolineasAlertModel.ts   # Modelo de datos
├── config/
│   └── aerolineas-airports.ts    # Configuración de aeropuertos
└── bot/
    └── CommandHandler.ts         # Manejo de comandos (métodos agregados)
```

## Logging

El sistema utiliza logging estructurado para todas las operaciones:

```typescript
scrapingLogger.info('[AEROLINEAS] Searching flexible calendar', {
  origin: 'EZE',
  destination: 'MIA',
  params: searchParams
});
```

Los logs incluyen:
- Requests a la API
- Resultados de búsquedas
- Errores y reintentos
- Creación/modificación de alertas
- Detección de ofertas

## Consideraciones

### Rate Limiting
La API de Aerolíneas Argentinas tiene límites de velocidad. El servicio implementa:
- Delays automáticos entre requests
- Retry con backoff exponencial
- Monitoreo de límites

### Disponibilidad
- Las ofertas de millas pueden cambiar rápidamente
- Verificación periódica recomendada cada 30-60 minutos
- Cache de resultados para evitar requests innecesarios

### Precisión
- Los precios en millas pueden variar según disponibilidad
- Las ofertas promocionales son limitadas en tiempo
- Recomendación de verificar en la web oficial antes de comprar
