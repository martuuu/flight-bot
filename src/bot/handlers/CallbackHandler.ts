import { UserModel } from '@/models';
import { botLogger } from '@/utils/logger';
import { MessageFormatter } from '../MessageFormatter';
import { AirlineUtils } from '../utils/AirlineUtils';

/**
 * Manejador de callback queries (botones interactivos)
 */
export class CallbackHandler {
  private bot: any;

  constructor(bot: any) {
    this.bot = bot;
  }

  /**
   * Manejar todos los callback queries
   */
  async handleCallbackQuery(callbackQuery: any): Promise<void> {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const userId = callbackQuery.from.id;

    try {
      // Intentar responder al callback query de manera silenciosa
      try {
        await this.bot.answerCallbackQuery(callbackQuery.id);
      } catch (callbackError: any) {
        botLogger.warn('Error respondiendo callback query', callbackError);
      }

      // Manejar callbacks de alertas específicas
      if (data.startsWith('pause_alert_')) {
        const alertId = data.replace('pause_alert_', '');
        await this.handlePauseAlert(chatId, userId, alertId);
        return;
      }

      if (data.startsWith('check_alert_')) {
        const alertId = data.replace('check_alert_', '');
        await this.handleCheckAlertNow(chatId, userId, alertId);
        return;
      }

      if (data.startsWith('select_airline_')) {
        const airlineName = data.replace('select_airline_', '');
        await this.handleAirlineSelection(chatId, userId, airlineName);
        return;
      }

      // Callbacks generales
      switch (data) {
        case 'help_commands':
          await this.handleCommandsList(chatId);
          break;
        case 'help_guide':
          await this.handleUserGuide(chatId);
          break;
        case 'help_alert':
          await this.handleAlertHelp(chatId);
          break;
        case 'help_search':
          await this.handleSearchHelp(chatId);
          break;
        case 'my_alerts':
          await this.handleMyAlertsCallback(chatId, userId);
          break;
        case 'clear_all_alerts':
          await this.handleClearAllAlertsCallback(chatId, userId);
          break;
        case 'show_airlines':
          await this.handleShowAirlines(chatId);
          break;
        default:
          await this.handleUnknownCallback(chatId, data);
      }
    } catch (error) {
      botLogger.error('Error procesando callback query', error as Error, { data, userId });
      await this.bot.sendMessage(chatId, MessageFormatter.formatErrorMessage());
    }
  }

  // === HANDLERS ESPECÍFICOS ===

  /**
   * Mostrar lista de comandos
   */
  private async handleCommandsList(chatId: number): Promise<void> {
    const activeAirlines = AirlineUtils.getActiveAirlines();
    const monthlyAirlines = AirlineUtils.getMonthlyAlertAirlines();
    const milesAirlines = AirlineUtils.getMilesAlertAirlines();

    let commandsMessage = `📖 *Lista Completa de Comandos*

🚀 *Comandos Básicos:*
• \`/start\` - Iniciar el bot y registrarse
• \`/help\` - Mostrar ayuda general

✈️ *Alertas de Vuelos:*
• \`/addalert\` - Crear alerta con sintaxis flexible
• \`/alertas\` - Crear alerta básica
• \`/misalertas\` - Ver todas tus alertas activas
• \`/cancelar <ID>\` - Cancelar alerta específica
• \`/clearall\` - Eliminar todas las alertas

🔍 *Búsqueda:*
• \`/buscar\` - Buscar vuelos (en desarrollo)`;

    // Comandos específicos por aerolínea
    if (monthlyAirlines.length > 0) {
      commandsMessage += `\n\n📅 *Alertas Mensuales:*
• \`/monthlyalert\` - Crear alerta mensual automática
• Aerolíneas: ${monthlyAirlines.map(a => AirlineUtils.getAirlineEmoji(a.code) + ' ' + a.displayName).join(', ')}`;
    }

    if (milesAirlines.length > 0) {
      commandsMessage += `\n\n🏆 *Alertas de Millas:*
• \`/millas-ar\` - Crear alerta de millas
• \`/millas-ar-search\` - Buscar millas inmediatamente
• \`/mis-alertas-millas-ar\` - Ver alertas de millas
• Aerolíneas: ${milesAirlines.map(a => AirlineUtils.getAirlineEmoji(a.code) + ' ' + a.displayName).join(', ')}`;
    }

    commandsMessage += `\n\n🛩️ *Aerolíneas Disponibles:*`;
    activeAirlines.forEach(airline => {
      const emoji = AirlineUtils.getAirlineEmoji(airline.code);
      commandsMessage += `\n• ${emoji} ${airline.displayName}`;
    });

    await this.bot.sendMessage(chatId, commandsMessage, { parse_mode: 'Markdown' });
  }

  /**
   * Mostrar guía de usuario
   */
  private async handleUserGuide(chatId: number): Promise<void> {
    const guideMessage = `📚 *Guía de Usuario - Flight Bot*

🎯 *¿Qué hace este bot?*
Te ayuda a encontrar vuelos baratos monitoreando precios automáticamente.

🚀 *Primeros pasos:*
1️⃣ Usa \`/start\` para registrarte
2️⃣ Crea tu primera alerta con \`/addalert\`
3️⃣ ¡Recibe notificaciones cuando encontremos ofertas!

✈️ *Tipos de Alertas:*

🔸 *Alerta Básica* (\`/alertas\`)
• Formato: \`/alertas ORIGEN DESTINO PRECIO_MAX\`
• Ejemplo: \`/alertas STI PUJ 300\`

🔸 *Alerta Avanzada* (\`/addalert\`)
• Sintaxis flexible
• Ejemplo: \`/addalert STI PUJ 210 2026-02\`
• Ejemplo: \`/addalert BOG MIA - 2026-03\` (solo mejores precios)

🌎 *Aeropuertos Disponibles:*
STI, PUJ, SDQ, MIA, BOG, EZE, SCL, CUN, SJU, YYZ, etc.

⚡ *Funciones Avanzadas:*
• Chequeo inmediato desde \`/misalertas\`
• Pausar/reactivar alertas individualmente
• Múltiples aerolíneas disponibles

❓ *¿Dudas?* Usa \`/help\` en cualquier momento.`;

    await this.bot.sendMessage(chatId, guideMessage, { parse_mode: 'Markdown' });
  }

  /**
   * Ayuda para crear alertas
   */
  private async handleAlertHelp(chatId: number): Promise<void> {
    let helpMessage = `✈️ *Crear Alertas de Vuelos*

📝 *Comando Recomendado:*
\`/addalert ORIGEN DESTINO [PRECIO] [FECHA]\`

*Ejemplos:*
• \`/addalert STI PUJ\` - Alerta básica
• \`/addalert STI PUJ 210\` - Con precio máximo
• \`/addalert STI PUJ 210 2026-02\` - Para un mes específico
• \`/addalert STI PUJ - 2026-02\` - Solo mejores precios

🌎 *Aeropuertos Populares:*
• **República Dominicana**: STI, PUJ, SDQ
• **Estados Unidos**: MIA, JFK, ORD
• **Suramérica**: BOG, EZE, SCL, LIM
• **Centroamérica**: CUN, SJU, PTY

💡 *Consejos:*
• El bot busca automáticamente cada 5 minutos
• Usa códigos IATA de 3 letras
• Las alertas mensuales buscan en todo el mes
• Precio en USD

🛩️ *Aerolíneas:*`;

    const activeAirlines = AirlineUtils.getActiveAirlines();
    activeAirlines.forEach(airline => {
      const emoji = AirlineUtils.getAirlineEmoji(airline.code);
      helpMessage += `\n• ${emoji} ${airline.displayName}`;
    });

    await this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
  }

  /**
   * Ayuda para búsqueda
   */
  private async handleSearchHelp(chatId: number): Promise<void> {
    const searchMessage = `🔍 *Búsqueda de Vuelos*

🚧 *En Desarrollo*
La funcionalidad de búsqueda directa está en desarrollo.

💡 *Alternativa Actual:*
Usa \`/addalert\` para crear alertas y recibir notificaciones automáticas cuando encontremos buenos precios.

🎯 *Próximas Funciones:*
• Búsqueda en tiempo real
• Comparación de precios
• Filtros avanzados
• Múltiples aerolíneas

✈️ *Mientras tanto:*
Las alertas automáticas son la mejor forma de no perderte ninguna oferta. ¡Créala ahora con \`/addalert\`!`;

    await this.bot.sendMessage(chatId, searchMessage, { 
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✈️ Crear Alerta', callback_data: 'help_alert' }],
        ],
      },
    });
  }

  /**
   * Ver alertas (callback)
   */
  private async handleMyAlertsCallback(chatId: number, userId: number): Promise<void> {
    // Reutilizar la lógica del comando /misalertas
    // Esto requiere acceso al AlertCommandHandler, por lo que podemos usar un patrón de eventos
    // o simplemente duplicar la lógica aquí (menos ideal pero funcional)
    
    const user = UserModel.findByTelegramId(userId);
    if (!user) {
      await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
      return;
    }

    // Implementación simplificada - en producción, usar el handler completo
    await this.bot.sendMessage(chatId, '📋 Usa el comando /misalertas para ver tus alertas activas.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔄 Refrescar', callback_data: 'my_alerts' }],
        ],
      },
    });
  }

  /**
   * Limpiar todas las alertas (callback)
   */
  private async handleClearAllAlertsCallback(chatId: number, _userId: number): Promise<void> {
    await this.bot.sendMessage(chatId, '⚠️ ¿Estás seguro de que quieres eliminar TODAS tus alertas?', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Sí, eliminar todas', callback_data: 'confirm_clear_all' },
            { text: '❌ Cancelar', callback_data: 'cancel_clear_all' },
          ],
        ],
      },
    });
  }

  /**
   * Mostrar aerolíneas disponibles
   */
  private async handleShowAirlines(chatId: number): Promise<void> {
    const activeAirlines = AirlineUtils.getActiveAirlines();
    
    let airlinesMessage = `🛩️ *Aerolíneas Disponibles*

Actualmente el bot soporta las siguientes aerolíneas:

`;

    activeAirlines.forEach(airline => {
      const emoji = AirlineUtils.getAirlineEmoji(airline.code);
      const features = [];
      if (airline.supportsMonthlyAlerts) features.push('Alertas Mensuales');
      if (airline.supportsMilesAlerts) features.push('Alertas de Millas');
      
      airlinesMessage += `${emoji} *${airline.displayName}*\n`;
      if (features.length > 0) {
        airlinesMessage += `   📋 Funciones: ${features.join(', ')}\n`;
      }
      airlinesMessage += `   ✅ Activa\n\n`;
    });

    airlinesMessage += `🔜 *Próximamente:*
• Más aerolíneas
• Comparación de precios
• Búsqueda multi-aerolínea`;

    await this.bot.sendMessage(chatId, airlinesMessage, { parse_mode: 'Markdown' });
  }

  /**
   * Selección de aerolínea
   */
  private async handleAirlineSelection(chatId: number, _userId: number, airlineName: string): Promise<void> {
    // Esta funcionalidad será implementada más adelante
    await this.bot.sendMessage(chatId, `Has seleccionado: ${airlineName}. Esta función estará disponible próximamente.`);
  }

  /**
   * Pausar/reactivar una alerta específica
   */
  private async handlePauseAlert(chatId: number, userId: number, alertId: string): Promise<void> {
    try {
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      // Lógica para pausar/reactivar alerta
      // Esta es una implementación simplificada
      await this.bot.sendMessage(chatId, `⏸️ Función de pausa para alerta ${alertId} en desarrollo.`);

    } catch (error) {
      botLogger.error('Error pausando alerta', error as Error, { userId, alertId });
      await this.bot.sendMessage(chatId, '❌ Error pausando la alerta.');
    }
  }

  /**
   * Chequear una alerta ahora mismo
   */
  private async handleCheckAlertNow(chatId: number, userId: number, alertId: string): Promise<void> {
    try {
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      await this.bot.sendMessage(chatId, '🔍 Buscando ofertas ahora...');

      // Lógica para chequear alerta inmediatamente
      // Esta es una implementación simplificada
      await this.bot.sendMessage(chatId, `🔍 Chequeo inmediato para alerta ${alertId} en desarrollo.`);

    } catch (error) {
      botLogger.error('Error chequeando alerta', error as Error, { userId, alertId });
      await this.bot.sendMessage(chatId, '❌ Error chequeando la alerta.');
    }
  }

  /**
   * Callback desconocido
   */
  private async handleUnknownCallback(chatId: number, data: string): Promise<void> {
    botLogger.warn('Callback query desconocido', { data });
    await this.bot.sendMessage(chatId, '❓ Acción no reconocida. Usa /help para ver las opciones disponibles.');
  }
}
