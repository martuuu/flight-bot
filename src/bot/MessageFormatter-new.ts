import { Alert } from '@/types';
import { airports } from '@/config';

/**
 * Formateador de mensajes para el bot
 */
export class MessageFormatter {
  /**
   * Mensaje de bienvenida
   */
  formatWelcomeMessage(name?: string): string {
    const greeting = name ? `¡Hola ${name}!` : '¡Hola!';
    
    return `${greeting} 👋

🚁 *Bienvenido al Bot de Monitoreo de Vuelos*

Te ayudo a encontrar las mejores ofertas de vuelos y te notifico cuando los precios bajen.

*¿Qué puedo hacer por ti?*
✈️ Crear alertas de precios
📊 Monitorear precios constantemente  
📱 Notificarte al instante
📈 Mostrar tendencias de precios
🔍 Buscar vuelos disponibles

*Para empezar:*
Usa /alert ORIGEN DESTINO PRECIO

*Ejemplo:*
\`/alert BOG MIA 800000\`
(Alerta para vuelos Bogotá → Miami bajo $800.000 COP)

¡Comencemos a ahorrar en tus viajes! ✈️💰`;
  }

  /**
   * Mensaje de ayuda general
   */
  formatHelpMessage(): string {
    return `🆘 *Ayuda - Bot de Monitoreo de Vuelos*

*Comandos Principales:*

📝 \`/start\` - Iniciar y registrarse
❓ \`/help\` - Ver esta ayuda
✈️ \`/alert ORIGEN DESTINO PRECIO\` - Crear alerta
🗓️ \`/monthlyalert ORIGEN DESTINO PRECIO [MES]\` - Alerta mensual automática (Arajet)
📋 \`/myalerts\` - Ver mis alertas
⏸️ \`/stop ID\` - Pausar alerta específica
🗑️ \`/clearall\` - Eliminar todas las alertas
🔍 \`/search ORIGEN DESTINO\` - Buscar vuelos

*Códigos de Aeropuertos Principales:*
🇨🇴 BOG (Bogotá), MDE (Medellín), CTG (Cartagena)
🇺🇸 MIA (Miami), JFK (Nueva York)
🇪🇸 MAD (Madrid)
🇵🇪 LIM (Lima)

*Ejemplo de Uso:*
\`/alert BOG MIA 850000\`
Te notificaré cuando encuentre vuelos Bogotá→Miami por menos de $850.000 COP

¿Necesitas más ayuda? Usa los botones de abajo 👇`;
  }

  /**
   * Mensaje de uso de comando /monthlyalert
   */
  formatMonthlyAlertUsageMessage(): string {
    return `❌ *Uso incorrecto del comando /monthlyalert*

*Formato correcto:*
\`/monthlyalert ORIGEN DESTINO PRECIO_MÁXIMO [MES]\`

*Ejemplos:*
• \`/monthlyalert SCL PUJ 800\` - Mes actual
• \`/monthlyalert SCL PUJ 800 02/2026\` - Febrero 2026
• \`/monthlyalert BOG MIA 300 marzo\` - Marzo (próximo)
• \`/monthlyalert LIM MAD 500 2026-04\` - Abril 2026

*Formatos de mes acepta:*
📅 **Números**: \`2\`, \`12\` (mes actual/próximo año)
📅 **Nombres**: \`febrero\`, \`mar\`, \`diciembre\`
📅 **MM/YYYY**: \`02/2026\`, \`12/2025\`
📅 **YYYY-MM**: \`2026-02\`, \`2025-12\`

*¿Qué es una alerta mensual?*
📅 Monitorea todo el mes en busca de ofertas
🤖 Análisis automático usando datos de Arajet
💰 Precios en USD (como aparecen en Arajet)
📊 Detecta días más baratos del mes
⏰ Válido hasta 12 meses adelante

*Códigos de aeropuertos soportados:*
🌎 SCL, PUJ, BOG, MIA, LIM, MAD, UIO, PTY y más...

💡 *Tip:* Si no especificas mes, usa el mes actual.`;
  }

  /**
   * Mensaje de alerta mensual creada exitosamente
   */
  formatMonthlyAlertCreatedMessage(alert: any): string {
    const originCode = alert.fromAirport || alert.origin;
    const destinationCode = alert.toAirport || alert.destination;
    const originAirport = airports[originCode as keyof typeof airports];
    const destinationAirport = airports[destinationCode as keyof typeof airports];

    // Formatear el mes para mostrar
    const monthYear = alert.searchMonth;
    const [year, month] = monthYear.split('-');
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthName = monthNames[parseInt(month) - 1];
    const formattedMonth = `${monthName} ${year}`;

    return `✅ *¡Alerta Mensual Creada!* 🗓️

🛫 *Ruta:* ${originAirport?.city || originCode} → ${destinationAirport?.city || destinationCode}
💰 *Precio máximo:* $${alert.maxPrice} USD
📅 *Mes objetivo:* ${formattedMonth}
👥 *Pasajeros:* 1 Adulto
🆔 *ID:* ${alert.id}

🤖 *Sistema Automático Arajet:*
• Analiza precios de todo el mes
• Detecta ofertas en tiempo real
• Identifica días más baratos
• Notificaciones instantáneas

⚡ *El monitoreo inteligente está activo*

Usa /myalerts para ver todas tus alertas activas.`;
  }

  // Métodos básicos requeridos
  formatAlertUsageMessage(): string {
    return `❌ *Uso incorrecto del comando /alert*

*Formato correcto:*
\`/alert ORIGEN DESTINO PRECIO_MÁXIMO\`

*Ejemplos:*
• \`/alert BOG MIA 800000\`
• \`/alert MDE MAD 2500000\`

💡 *Tip:* El precio debe ser en pesos colombianos (COP).`;
  }

  formatAlertCreatedMessage(alert: Alert): string {
    return `✅ *¡Alerta Creada Exitosamente!*

🛫 *Ruta:* ${alert.origin} → ${alert.destination}
💰 *Precio máximo:* $${alert.maxPrice.toLocaleString('es-CO')} COP
🆔 *ID:* ${alert.id}

⚡ *El monitoreo está activo las 24/7*`;
  }

  formatMyAlertsMessage(alerts: Alert[]): string {
    if (alerts.length === 0) {
      return '📭 No tienes alertas activas.';
    }

    let message = `📋 *Mis Alertas Activas* (${alerts.length})\n\n`;
    alerts.forEach((alert, index) => {
      message += `${index + 1}. *${alert.origin} → ${alert.destination}*\n`;
      message += `   💰 Máximo: $${alert.maxPrice.toLocaleString('es-CO')} COP\n`;
      message += `   🆔 ID: ${alert.id}\n\n`;
    });

    return message;
  }

  formatAlertNotification(alertData: any): string {
    return `🎉 *¡OFERTA ENCONTRADA!*

✈️ *Vuelo:* ${alertData.origin} → ${alertData.destination}
💰 *Precio:* $${alertData.price} USD
📅 *Fecha:* ${alertData.departureDate}

🔗 [Reservar ahora](${alertData.bookingUrl})`;
  }

  formatErrorMessage(): string {
    return `❌ *Ocurrió un error inesperado*

Por favor, inténtalo de nuevo en unos momentos.`;
  }

  formatUnknownCommandMessage(): string {
    return `❓ *Comando no reconocido*

Usa /help para ver la lista de comandos disponibles.`;
  }

  formatCommandsListMessage(): string {
    return this.formatHelpMessage();
  }

  formatUserGuideMessage(): string {
    return `📖 *Guía de Usuario - Flight Bot*

🚀 *Cómo empezar:*
1. Usa /start para registrarte
2. Crea alertas con /alert o /monthlyalert
3. Revisa tus alertas con /myalerts

💡 *Consejos:*
• Usa precios realistas
• Las alertas mensuales son automáticas
• Códigos: BOG, MIA, SCL, PUJ, etc.`;
  }

  formatRateLimitMessage(): string {
    return `⚠️ *Demasiadas solicitudes*

Espera un momento antes de enviar el siguiente comando.

¡Gracias por tu paciencia! 😊`;
  }
}
