import { FlightResult, PassengerCounts } from '../types/arajet-api';

export class MessageFormatter {
  // Help message for the /help command
  static getHelpMessage(): string {
    return `🛫 *Bot de Vuelos Arajet*

*Comandos disponibles:*

🚀 *Comandos Básicos:*
• \`/start\` - Iniciar el bot y registrarse
• \`/help\` - Mostrar esta ayuda

✈️ *Alertas de Vuelos:*
• \`/alertas\` - Crear alerta normal de precios
• \`/monthlyalert\` - Crear alerta mensual automática
• \`/misalertas\` - Ver todas tus alertas activas
• \`/cancelar <ID>\` - Cancelar alerta específica
• \`/clearall\` - Eliminar todas las alertas

🔍 *Búsqueda:*
• \`/buscar\` - Buscar vuelos (en desarrollo)

💡 *Funciones Especiales:*
• Chequeo inmediato de alertas desde \`/misalertas\`
• Pausar/reactivar alertas individualmente
• Verificación automática cada 5 minutos

*Ejemplos de uso:*

📍 *Alerta Normal:*
\`/alertas EZE MIA 300\`

📅 *Alerta Mensual:*
\`/monthlyalert STI PUJ 210 2026-02\`

*Aeropuertos principales disponibles:*

🇺🇸 *Estados Unidos:* MIA, ORD, BOS, EWR, SFB
🇦🇷 *Argentina:* EZE
🇨🇱 *Chile:* SCL
🇨🇴 *Colombia:* BOG, MDE, CTG
🇩🇴 *Rep. Dominicana:* PUJ, SDQ, STI
🇲🇽 *México:* CUN, NLU
🇨🇦 *Canadá:* YUL, YYZ
🇯🇲 *Jamaica:* KIN
🇵🇷 *Puerto Rico:* SJU
🇬🇹 *Guatemala:* GUA
🇨🇷 *Costa Rica:* SJO
🇸🇻 *El Salvador:* SAL

¡Usa los botones interactivos para navegación rápida!`;
  }

  static formatHelpMessage(): string {
    return this.getHelpMessage();
  }

  // Usage message for alert command
  static formatAlertUsageMessage(): string {
    return `📋 *Comando /alertas*

*Uso:* \`/alertas ORIGEN DESTINO PRECIO\`

*Parámetros:*
• ORIGEN: Código de aeropuerto de salida (ej: STI)
• DESTINO: Código de aeropuerto de llegada (ej: PUJ) 
• PRECIO: Precio máximo en USD (ej: 300)

*Ejemplos:*
• \`/alertas STI PUJ 300\`
• \`/alertas EZE MIA 250\`

Te notificaré cuando encuentre vuelos por debajo del precio especificado.`;
  }

  // Usage message for monthly alert command
  static formatMonthlyAlertUsageMessage(): string {
    return `📅 *Comando /monthlyalert*

*Uso:* \`/monthlyalert ORIGEN DESTINO PRECIO [MES]\`

*Parámetros:*
• ORIGEN: Código de aeropuerto de salida (ej: STI)
• DESTINO: Código de aeropuerto de llegada (ej: PUJ)
• PRECIO: Precio máximo en USD (ej: 300)
• MES: Mes a buscar (opcional)

*Formatos de mes válidos:*
• \`2026-02\` (año-mes)
• \`02/2026\` (mes/año)
• \`febrero\` (nombre del mes)
• \`2\` (número del mes, asume año actual o siguiente)

*Ejemplos:*
• \`/monthlyalert STI PUJ 210 2026-02\`
• \`/monthlyalert EZE MIA 300 marzo\`
• \`/monthlyalert BOG SCL 400\` (mes actual)

El bot buscará ofertas en todo el mes especificado y te notificará cuando encuentre vuelos por debajo del precio.`;
  }

  // Welcome message
  static formatWelcomeMessage(userName: string): string {
    return `¡Hola ${userName}! 👋

🛫 Bienvenido al *Bot de Vuelos Arajet*

Soy tu asistente para encontrar las mejores ofertas de vuelos. Puedo:

✈️ Crear alertas de precios personalizadas
📅 Monitorear precios por meses completos
🔍 Buscar vuelos en tiempo real
📱 Notificarte de ofertas automáticamente

*¿Por dónde empezamos?*
Usa los botones de abajo o escribe \`/help\` para ver todos los comandos.`;
  }

  // Alert created message (compatibility wrapper)
  static formatAlertCreatedMessage(alert: any): string {
    return `✅ *Alerta creada exitosamente*

📍 Ruta: ${alert.origin} → ${alert.destination}
💰 Precio máximo: $${alert.maxPrice} USD
🆔 ID de alerta: ${alert.id}

🔔 Te notificaré cuando encuentre vuelos por debajo de este precio.
📱 Usa \`/misalertas\` para ver todas tus alertas.`;
  }

  // Monthly alert created message
  static formatMonthlyAlertCreatedMessage(alert: any): string {
    return `✅ *Alerta mensual creada exitosamente*

📍 Ruta: ${alert.fromAirport} → ${alert.toAirport}
📅 Mes: ${alert.searchMonth}
💰 Precio máximo: $${alert.maxPrice} USD
🆔 ID de alerta: ${alert.id}

🔔 Buscaré ofertas en todo el mes especificado.
📱 Usa \`/misalertas\` para ver todas tus alertas.
🔍 Puedes hacer un chequeo inmediato desde \`/misalertas\`.`;
  }

  // My alerts message (compatibility wrapper)
  static formatMyAlertsMessage(alerts: any[]): string {
    if (alerts.length === 0) {
      return '📭 No tienes alertas activas.';
    }

    let message = '📋 *Tus Alertas Activas:*\n\n';
    
    alerts.forEach((alert, index) => {
      message += `${index + 1}. ✈️ ${alert.origin} → ${alert.destination}\n`;
      message += `   💰 Máx: $${alert.maxPrice} USD\n`;
      message += `   🆔 ID: ${alert.id}\n\n`;
    });

    message += `💡 Usa \`/cancelar <ID>\` para desactivar una alerta específica.`;
    return message;
  }

  // Error message
  static formatErrorMessage(): string {
    return '❌ Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
  }

  // Stats message for admin
  static formatStatsMessage(userStats: any, alertStats: any): string {
    return `📊 *Estadísticas del Bot*

👥 *Usuarios:*
• Total: ${userStats.total}
• Activos: ${userStats.active}

🔔 *Alertas:*
• Activas: ${alertStats.active}
• Total creadas: ${alertStats.total}

📅 Fecha: ${new Date().toLocaleDateString('es-ES')}`;
  }

  // Format flight search results
  static formatFlightResults(flights: FlightResult[], origin: string, destination: string, date: string, passengers: PassengerCounts): string {
    if (flights.length === 0) {
      return `❌ No se encontraron vuelos de ${origin} a ${destination} para el ${date}.`;
    }

    let message = `✈️ *Vuelos encontrados*\n`;
    message += `📍 ${origin} → ${destination}\n`;
    message += `📅 ${date}\n`;
    message += `👥 ${passengers.adults} adulto(s), ${passengers.children} niño(s), ${passengers.infants} bebé(s)\n\n`;

    flights.forEach((flight, index) => {
      message += `*${index + 1}. Vuelo ${flight.flightNumber}*\n`;
      message += `💰 Precio: $${flight.price} USD\n`;
      message += `🕐 Salida: ${flight.departureTime}\n`;
      message += `🕐 Llegada: ${flight.arrivalTime}\n`;
      if ((flight as any).duration) {
        message += `⏱️ Duración: ${(flight as any).duration}\n`;
      }
      message += `\n`;
    });

    return message;
  }

  // Format single flight alert notification
  static formatFlightAlert(flight: FlightResult, maxPrice: number, origin: string, destination: string): string {
    return `🎉 *¡Oferta encontrada!*

✈️ ${origin} → ${destination}
💰 $${flight.price} USD (límite: $${maxPrice})
🛫 Vuelo: ${flight.flightNumber}
📅 ${(flight as any).date || 'N/A'}
🕐 ${flight.departureTime} → ${flight.arrivalTime}

¡Aprovecha esta oferta!`;
  }

  // Rate limit message
  static formatRateLimitMessage(): string {
    return '⏳ Has realizado demasiadas consultas. Por favor, espera un momento antes de intentar de nuevo.';
  }

  // Alert notification message
  static formatAlertNotification(alertData: any): string {
    return `🎉 *¡Oferta encontrada!*

✈️ ${alertData.origin} → ${alertData.destination}
💰 $${alertData.price} USD
🛫 Vuelo: ${alertData.flightNumber}
📅 ${alertData.date}
🕐 ${alertData.departureTime} → ${alertData.arrivalTime}

¡Aprovecha esta oferta!`;
  }
}
