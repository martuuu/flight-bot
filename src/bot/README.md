# Bot Command Handler Refactoring

## Nueva Estructura Modular

El `CommandHandler.ts` original ha sido refactorizado en una estructura modular que facilita el mantenimiento y la escalabilidad para múltiples aerolíneas.

### Estructura de Archivos

```
src/bot/
├── CommandHandler.ts          # Manejador principal (orquestador)
├── CommandHandler.new.ts      # Nueva implementación modular
├── FlightBot.ts              # Bot principal
├── MessageFormatter.ts       # Formateador de mensajes
├── handlers/                 # Manejadores específicos
│   ├── BasicCommandHandler.ts     # Comandos básicos
│   ├── AlertCommandHandler.ts     # Comandos de alertas generales
│   ├── CallbackHandler.ts         # Manejo de botones/callbacks
│   └── airlines/              # Manejadores específicos por aerolínea
│       ├── ArajetCommandHandler.ts       # Comandos de Arajet
│       └── AerolineasCommandHandler.ts   # Comandos de Aerolíneas Argentinas
└── utils/                    # Utilidades
    ├── ValidationUtils.ts         # Validaciones
    └── AirlineUtils.ts           # Gestión de aerolíneas
```

### Responsabilidades

#### CommandHandler.ts (Principal)
- Orquesta todos los manejadores específicos
- Enruta comandos al manejador apropiado
- Detecta automáticamente la aerolínea según el comando
- Maneja el ciclo de vida de los handlers

#### BasicCommandHandler.ts
- `/start` - Inicialización y bienvenida
- `/help` - Ayuda general
- `/stats` - Estadísticas (admin)
- `/search` - Búsqueda de vuelos
- Comandos independientes de aerolínea

#### AlertCommandHandler.ts
- `/alert`, `/alertas` - Alertas básicas (legacy)
- `/addalert` - Alertas con sintaxis unificada
- `/misalertas` - Ver alertas del usuario
- `/cancelar` - Cancelar alerta específica
- `/clearall` - Eliminar todas las alertas
- Lógica genérica de alertas

#### CallbackHandler.ts
- Manejo de todos los callback queries (botones)
- Navegación interactiva
- Confirmaciones y acciones rápidas

#### ArajetCommandHandler.ts
- `/monthlyalert` - Alertas mensuales específicas
- Chequeo inmediato de alertas Arajet
- Lógica específica de Arajet

#### AerolineasCommandHandler.ts
- `/millas-ar` - Alertas de millas
- `/millas-ar-search` - Búsqueda inmediata de millas
- `/test-aerolineas` - Diagnóstico de API
- Lógica específica de Aerolíneas Argentinas

### Utilidades

#### ValidationUtils.ts
- Validación de códigos de aeropuerto
- Validación de precios y fechas
- Validación de parámetros generales

#### AirlineUtils.ts
- Enumeración de aerolíneas disponibles
- Detección automática de aerolínea por comando
- Gestión de características por aerolínea
- Generación de keyboards de selección

### Ventajas de la Nueva Estructura

1. **Mantenibilidad**: Cada handler tiene una responsabilidad específica
2. **Escalabilidad**: Fácil agregar nuevas aerolíneas
3. **Testabilidad**: Cada módulo se puede testear independientemente
4. **Reusabilidad**: Utilidades compartidas entre handlers
5. **Claridad**: Código más organizado y fácil de entender

### Migración

Para migrar al nuevo sistema:

1. **Mantener compatibilidad**: El `CommandHandler.ts` original sigue funcionando
2. **Migración gradual**: Reemplazar `CommandHandler.ts` por `CommandHandler.new.ts`
3. **Testing**: Probar cada handler independientemente
4. **Deployment**: Cambiar la importación en `FlightBot.ts`

### Comandos por Aerolínea

#### Arajet (Activo)
- ✅ Alertas mensuales automáticas
- ✅ Búsqueda en todo el mes
- ❌ Alertas de millas (no aplica)

#### Aerolíneas Argentinas (En desarrollo)
- ❌ Alertas mensuales (no aplica)
- 🚧 Alertas de millas (en desarrollo)
- 🚧 Búsqueda inmediata de millas

#### Futuras Aerolíneas
- Avianca
- LATAM
- Viva Air
- Wingo

### Configuración de Aerolíneas

```typescript
// En AirlineUtils.ts
export enum AirlineType {
  ARAJET = 'ARAJET',
  AEROLINEAS_ARGENTINAS = 'AEROLINEAS_ARGENTINAS',
  // ... más aerolíneas
}

// Configuración por aerolínea
const AIRLINES: Record<AirlineType, AirlineInfo> = {
  [AirlineType.ARAJET]: {
    supportsMonthlyAlerts: true,
    supportsMilesAlerts: false,
    isActive: true
  },
  // ...
}
```

### Próximos Pasos

1. **Testing**: Probar la nueva estructura
2. **Migración**: Reemplazar el handler original
3. **Nuevas Aerolíneas**: Implementar handlers para Avianca, LATAM, etc.
4. **Selección de Aerolínea**: Permitir al usuario elegir aerolínea
5. **Comparación**: Comparar precios entre aerolíneas

### Notas de Desarrollo

- Todos los handlers mantienen la misma interfaz del bot
- Los errores se logean con contexto específico de aerolínea
- Las validaciones son compartidas pero extensibles
- La detección de aerolínea es automática pero configurable
