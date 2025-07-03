import { FlightResult, PassengerCounts } from '../types/arajet-api';

export class MessageFormatter {
  // Help message for the /help command
  static getHelpMessage(): string {
    return `🛫 *Bot de Vuelos Arajet*

*Comandos disponibles:*

🚀 *Comandos Básicos:*
• \`/start\` - Iniciar el bot y registrarse
• \`/help\` - Mostrar esta ayuda

✈️ *Alertas de Vuelos (UNIFICADO):*
• \`/addalert\` - Crear alerta de vuelos (sistema unificado)
• \`/agregaralerta\` - Crear alerta de vuelos (español)
• \`/misalertas\` - Ver todas tus alertas activas
• \`/cancelar <ID>\` - Cancelar alerta específica
• \`/clearall\` - Eliminar todas las alertas

🔍 *Búsqueda:*
• \`/buscar\` - Buscar vuelos (en desarrollo)

🎫 *Millas Aerolíneas Argentinas:*
• \`/millas-ar\` - Crear alerta para millas promocionales
• \`/millas-ar-search\` - Buscar ofertas de millas ahora
• \`/millas-ar-myalerts\` - Ver alertas de millas AR

💡 *Funciones Especiales:*
• Chequeo inmediato de alertas desde \`/misalertas\`
• Pausar/reactivar alertas individualmente
• Verificación automática cada hora

*📋 Ejemplos de Alertas:*

🏷️ *Precio máximo específico:*
\`/addalert EZE PUJ 800 2026-02-15\` (día)
\`/addalert EZE PUJ 800 2026-02\` (mes)

🏆 *Mejor precio disponible:*
\`/addalert EZE PUJ - 2026-02-15\` (día)
\`/addalert EZE PUJ - 2026-02\` (mes)

🎫 *Millas Aerolíneas AR:*
\`/millas-ar EZE MIA\` (búsqueda flexible)
\`/millas-ar EZE MIA 2025-03-15 60000\` (fecha y máximo)

*Aeropuertos disponibles:*

🇺🇸 *Estados Unidos:* MIA, ORD, BOS, EWR, SFB, LAX, JFK, ATL, DFW, LAS, SEA, SFO
��🇦 *Canadá:* YYZ, YVR, YUL
�🇽 *México:* MEX, CUN, GDL

🇩🇴 *Rep. Dominicana:* PUJ, SDQ, STI
�� *Puerto Rico:* SJU
🇯🇲 *Jamaica:* KIN
🇨🇺 *Cuba:* HAV
�🇼 *Aruba:* AUA
�🇨� *Curaçao:* CUR

🇨�🇴 *Colombia:* BOG, MDE, CTG, CLO, BAQ, SMR
�� *Argentina:* EZE, AEP, COR, MDZ
🇧🇷 *Brasil:* GRU, GIG, BSB, SDU, CGH
🇨🇱 *Chile:* SCL
🇵🇪 *Perú:* LIM, CUZ
�� *Ecuador:* UIO, GYE
�� *Venezuela:* CCS
🇺🇾 *Uruguay:* MVD
�� *Paraguay:* ASU

🇵🇦 *Panamá:* PTY
🇨🇷 *Costa Rica:* SJO
🇬🇹 *Guatemala:* GUA

🇪🇸 *España:* MAD, BCN
�🇷 *Francia:* CDG, ORY
🇬🇧 *Reino Unido:* LHR, LGW
🇩🇪 *Alemania:* FRA, MUC
🇮🇹 *Italia:* FCO, MXP
🇳🇱 *Países Bajos:* AMS

🇯🇵 *Japón:* NRT, HND
🇨🇳 *China:* PEK, PVG
🇸🇬 *Singapur:* SIN
🇦� *UAE:* DXB
🇦🇺 *Australia:* SYD, MEL

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

  // Usage message for unified alert command
  static formatUnifiedAlertUsageMessage(): string {
    return `📋 *Comando /addalert y /agregaralerta* - Sistema Unificado de Alertas

*🎯 Tipos de Alerta:*

*1️⃣ Día Específico con Precio Máximo:*
\`/addalert ORIGEN DESTINO PRECIO FECHA\`
Ejemplo: \`/addalert EZE PUJ 800 2026-02-15\`

*2️⃣ Día Específico - Mejor Precio:*
\`/addalert ORIGEN DESTINO - FECHA\`
Ejemplo: \`/addalert EZE PUJ - 2026-02-15\`
Te notificará del mejor precio disponible ese día.

*3️⃣ Mes Completo con Precio Máximo:*
\`/addalert ORIGEN DESTINO PRECIO MES\`
Ejemplo: \`/addalert EZE PUJ 800 2026-02\`

*4️⃣ Mes Completo - Mejores Ofertas:*
\`/addalert ORIGEN DESTINO - MES\`
Ejemplo: \`/addalert EZE PUJ - 2026-02\`
Te enviará las 5 mejores ofertas del mes.

*📅 Formatos de Fecha:*
• Día específico: \`YYYY-MM-DD\` (ej: 2026-02-15)
• Mes completo: \`YYYY-MM\` (ej: 2026-02)
• Sin fecha: Busca en el mes actual

*✨ Características:*
🔔 Notificaciones automáticas cada hora
📊 Análisis inteligente de precios
⚡ Chequeo inmediato disponible
🛑 Fácil gestión desde /misalertas`;
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

  // Daily alert created message
  static formatDailyAlertCreatedMessage(alert: any, trackBestOnly: boolean, searchDate?: string): string {
    const alertType = trackBestOnly ? '🏆 Mejor Precio' : '💰 Precio Máximo';
    const priceInfo = trackBestOnly ? 'cualquier precio' : `máx $${alert.maxPrice} USD`;
    
    return `✅ *Alerta Diaria Creada*

📍 Ruta: ${alert.origin} → ${alert.destination}
📅 Fecha: ${searchDate || 'Próximas fechas'}
${alertType}: ${priceInfo}
🆔 ID: ${alert.id}

${trackBestOnly 
  ? '🔔 Te notificaré del mejor precio disponible para esa fecha.'
  : '🔔 Te notificaré si encuentro vuelos por debajo del precio máximo.'
}

📱 Gestiona esta alerta desde /misalertas`;
  }

  // Enhanced monthly alert created message
  static formatMonthlyAlertCreatedMessage(alert: any, trackBestOnly: boolean): string {
    const alertType = trackBestOnly ? '🏆 Mejores Ofertas' : '💰 Precio Máximo';
    const priceInfo = trackBestOnly ? 'Top 5 ofertas' : `máx $${alert.maxPrice} USD`;
    
    return `✅ *Alerta Mensual Creada*

📍 Ruta: ${alert.fromAirport} → ${alert.toAirport}
📅 Mes: ${alert.searchMonth}
${alertType}: ${priceInfo}
🆔 ID: ${alert.id}

${trackBestOnly 
  ? '🔔 Te enviaré las 5 mejores ofertas encontradas en todo el mes.'
  : '🔔 Te notificaré de todas las ofertas por debajo del precio máximo.'
}

📱 Gestiona esta alerta desde /misalertas
🔍 Haz un chequeo inmediato desde /misalertas`;
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

  /**
   * Formatea información detallada de un vuelo con todos los datos de la API
   */
  static formatDetailedFlightInfo(flight: any, alert: any): string {
    let message = `✈️ *INFORMACIÓN DETALLADA DEL VUELO*\n\n`;
    
    // Información básica del vuelo
    message += `🛫 *Ruta:* ${alert.fromAirport} → ${alert.toAirport}\n`;
    message += `📅 *Fecha:* ${this.formatDetailedDate(flight.date)}\n`;
    message += `🆔 *Vuelo:* ${flight.legs?.[0]?.flightNumber || 'N/A'}\n`;
    message += `✈️ *Aerolínea:* ${flight.legs?.[0]?.carrierCode || 'Arajet'}\n\n`;
    
    // Información de horarios
    message += `🕐 *HORARIOS:*\n`;
    if (flight.legs?.[0]) {
      const leg = flight.legs[0];
      message += `  🛫 Salida: ${this.formatDetailedTime(leg.departureDate)}\n`;
      message += `  🛬 Llegada: ${this.formatDetailedTime(leg.arrivalDate)}\n`;
      message += `  ⏱️ Duración: ${this.formatFlightDuration(leg.flightTime)}\n`;
    }
    message += `\n`;
    
    // Información de precios
    message += `💰 *PRECIOS:*\n`;
    message += `  💵 Precio por pasajero: $${flight.pricePerPassenger} USD\n`;
    message += `  💸 Precio sin impuestos: $${flight.pricePerPassengerWithoutTax} USD\n`;
    message += `  📊 Impuestos: $${(flight.pricePerPassenger - flight.pricePerPassengerWithoutTax).toFixed(2)} USD\n`;
    
    if (flight.isCheapestOfMonth) {
      message += `  🥇 *¡Precio más bajo del mes!*\n`;
    }
    message += `\n`;
    
    // Información de la clase de servicio
    message += `🎫 *CLASE DE SERVICIO:*\n`;
    message += `  📋 Clase: ${flight.fareClass || 'Economy'}\n`;
    message += `  🔤 Código tarifario: ${flight.fareBasisCode || 'N/A'}\n\n`;
    
    // Información del equipo
    if (flight.legs?.[0]?.equipmentType) {
      message += `✈️ *AERONAVE:*\n`;
      message += `  🛩️ Tipo: ${flight.legs[0].equipmentType}\n\n`;
    }
    
    // Estado de disponibilidad
    message += `📊 *DISPONIBILIDAD:*\n`;
    message += `  ${flight.isSoldOut ? '❌ Agotado' : '✅ Disponible'}\n`;
    
    // Información adicional si está disponible
    if (flight.legs?.[0]?.throughCheckinAllowed !== undefined) {
      message += `  🧳 Check-in directo: ${flight.legs[0].throughCheckinAllowed ? 'Sí' : 'No'}\n`;
    }
    
    if (flight.legs?.[0]?.stopoverTime && flight.legs[0].stopoverTime > 0) {
      message += `  ⏳ Tiempo de escala: ${this.formatStopoverTime(flight.legs[0].stopoverTime)}\n`;
    }
    
    message += `\n📱 Usa los botones de abajo para gestionar esta alerta.`;
    
    return message;
  }

  /**
   * Formatea duración de vuelo en minutos a horas y minutos
   */
  private static formatFlightDuration(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Formatea tiempo de escala
   */
  private static formatStopoverTime(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  /**
   * Formatea fecha con más detalle
   */
  private static formatDetailedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatea hora con más detalle
   */
  private static formatDetailedTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }

  /**
   * Formatea una fecha para mostrar
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  /**
   * Formatea una hora para mostrar
   */
  static formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formatea mensaje de alerta con detalles completos del vuelo
   */
  static formatEnhancedAlertNotification(alert: any, deals: any[]): string {
    if (deals.length === 0) {
      return `🔍 No se encontraron ofertas para ${alert.fromAirport} → ${alert.toAirport} en ${alert.searchMonth} por debajo de $${alert.maxPrice}`;
    }

    // Ordenar por precio
    const sortedDeals = deals.sort((a: any, b: any) => a.price - b.price);
    const cheapest = sortedDeals[0];

    let message = `🎉 *¡${deals.length} OFERTAS ENCONTRADAS!*\n\n`;
    
    // Información de la ruta y búsqueda
    message += `✈️ *RUTA:* ${alert.fromAirport} → ${alert.toAirport}\n`;
    message += `📅 *Período:* ${alert.searchMonth}\n`;
    message += `💰 *Presupuesto máximo:* $${alert.maxPrice} USD\n`;
    message += `👥 *Pasajeros:* ${this.formatPassengerInfo(alert.passengers)}\n\n`;

    // Mejor oferta destacada
    message += `🏆 *MEJOR OFERTA:*\n`;
    message += `📅 ${this.formatDetailedDate(cheapest.date)}\n`;
    message += `💵 $${cheapest.price} USD ${cheapest.isCheapestOfMonth ? '🥇' : ''}\n`;
    message += `💸 Sin impuestos: $${cheapest.priceWithoutTax} USD\n`;
    message += `✈️ Vuelo ${cheapest.flightNumber}\n`;
    message += `🕐 ${this.formatDetailedTime(cheapest.departureTime)} → ${this.formatDetailedTime(cheapest.arrivalTime)}\n`;
    message += `🎫 Clase: ${cheapest.fareClass}\n\n`;

    // Top ofertas
    if (deals.length > 1) {
      const nextDeals = sortedDeals.slice(1, 4); // Próximas 3 ofertas
      message += `📋 *TOP OFERTAS ADICIONALES:*\n`;
      
      nextDeals.forEach((deal: any, index: number) => {
        message += `${index + 2}. 📅 ${this.formatDate(deal.date)} - 💵 $${deal.price}${deal.isCheapestOfMonth ? ' 🥇' : ''}\n`;
        message += `   ✈️ ${deal.flightNumber} | 🕐 ${this.formatTime(deal.departureTime)} → ${this.formatTime(deal.arrivalTime)}\n`;
        message += `   🎫 ${deal.fareClass} | 💸 $${deal.priceWithoutTax} s/imp.\n\n`;
      });

      if (deals.length > 4) {
        message += `... y ${deals.length - 4} ofertas más disponibles\n\n`;
      }
    }

    // Información adicional
    message += `📊 *RESUMEN DEL MES:*\n`;
    const prices = deals.map((d: any) => d.price);
    const avgPrice = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    message += `💰 Precio promedio: $${avgPrice}\n`;
    message += `📉 Precio mínimo: $${minPrice}\n`;
    message += `📈 Precio máximo: $${maxPrice}\n`;
    message += `📅 Mejor día: ${this.formatDate(cheapest.date)}\n\n`;

    message += `🔄 Actualizado: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Santiago' })}`;
    message += `\n💡 Toca cualquier oferta para ver detalles completos`;

    return message;
  }

  /**
   * Formatea información de pasajeros
   */
  private static formatPassengerInfo(passengers: any[]): string {
    if (!passengers || passengers.length === 0) return '1 adulto';
    
    const adults = passengers.find(p => p.code === 'ADT')?.count || 0;
    const children = passengers.find(p => p.code === 'CHD')?.count || 0;
    const infants = passengers.find(p => p.code === 'INF')?.count || 0;
    
    const parts = [];
    if (adults > 0) parts.push(`${adults} adulto${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} niño${children > 1 ? 's' : ''}`);
    if (infants > 0) parts.push(`${infants} bebé${infants > 1 ? 's' : ''}`);
    
    return parts.join(', ');
  }
}
