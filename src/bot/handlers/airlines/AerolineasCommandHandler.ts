import { UserModel } from '@/models';
import { botLogger } from '@/utils/logger';
import { ValidationUtils } from '../../utils/ValidationUtils';
import { AirlineUtils, AirlineType } from '../../utils/AirlineUtils';

/**
 * Manejador de comandos específicos de Aerolíneas Argentinas
 */
export class AerolineasCommandHandler {
  private bot: any;

  constructor(bot: any) {
    this.bot = bot;
  }

  /**
   * Comando /millas-ar - Crear alerta para millas de Aerolíneas Argentinas
   */
  async handleAerolineasMilesAlert(chatId: number, userId: number, args: string[]): Promise<void> {
    if (args.length < 3) {
      const usageMessage = this.formatAerolineasMilesUsage();
      await this.bot.sendMessage(chatId, usageMessage, { parse_mode: 'Markdown' });
      return;
    }

    const [origin, destination, dateStr, maxMilesStr, adultsStr] = args;

    // Validar códigos de aeropuerto
    const originCode = origin.toUpperCase();
    const destinationCode = destination.toUpperCase();

    if (!this.isValidAerolineasAirport(originCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de origen inválido para Aerolíneas Argentinas: ${originCode}`);
      return;
    }

    if (!this.isValidAerolineasAirport(destinationCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de destino inválido para Aerolíneas Argentinas: ${destinationCode}`);
      return;
    }

    if (!ValidationUtils.areAirportsDifferent(originCode, destinationCode)) {
      await this.bot.sendMessage(chatId, '❌ El origen y destino no pueden ser iguales');
      return;
    }

    // Validar fecha
    const dateValidation = ValidationUtils.isValidDate(dateStr);
    if (!dateValidation.isValid) {
      await this.bot.sendMessage(chatId, `❌ ${dateValidation.error}`);
      return;
    }

    // Parsear parámetros opcionales
    let maxMiles: number | undefined;
    let adults = 1;

    if (maxMilesStr && maxMilesStr !== '-') {
      const milesNum = parseInt(maxMilesStr);
      if (isNaN(milesNum) || milesNum <= 0) {
        await this.bot.sendMessage(chatId, '❌ El número de millas debe ser un número válido mayor a 0');
        return;
      }
      maxMiles = milesNum;
    }

    if (adultsStr) {
      const adultsValidation = ValidationUtils.isValidAdultCount(adultsStr);
      if (!adultsValidation.isValid) {
        await this.bot.sendMessage(chatId, `❌ ${adultsValidation.error}`);
        return;
      }
      adults = adultsValidation.adults!;
    }

    try {
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      // TODO: Implementar creación de alerta cuando el modelo esté listo
      const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
      const successMessage = `${airlineEmoji} *Alerta de Millas en Desarrollo*

✈️ **Ruta**: ${originCode} → ${destinationCode}
📅 **Fecha**: ${dateStr}
👥 **Adultos**: ${adults}
${maxMiles ? `🏆 **Millas máximas**: ${maxMiles.toLocaleString()}` : '🏆 **Millas**: Sin límite'}

🚧 La funcionalidad de alertas de millas está en desarrollo. Pronto podrás crear alertas automáticas para ofertas de millas de Aerolíneas Argentinas.

💡 Por ahora, usa \`/millas-ar-search\` para buscar ofertas inmediatas.`;

      await this.bot.sendMessage(chatId, successMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔍 Buscar Ahora', callback_data: 'search_miles_now' },
              { text: '📋 Ayuda', callback_data: 'help_miles_alert' },
            ],
          ],
        },
      });

      botLogger.info('Solicitud de alerta de millas Aerolíneas registrada', {
        userId,
        route: `${originCode}-${destinationCode}`,
        date: dateStr,
        maxMiles,
        adults,
        airline: 'AEROLINEAS_ARGENTINAS'
      });

    } catch (error) {
      botLogger.error('Error procesando alerta de millas Aerolíneas', error as Error, {
        userId,
        origin: originCode,
        destination: destinationCode,
        airline: 'AEROLINEAS_ARGENTINAS'
      });
      await this.bot.sendMessage(chatId, '❌ Error procesando la solicitud. Inténtalo de nuevo.');
    }
  }

  /**
   * Comando /millas-ar-search - Buscar ofertas de millas inmediatamente
   */
  async handleAerolineasMilesSearch(chatId: number, args: string[]): Promise<void> {
    if (args.length < 3) {
      const usageMessage = this.formatAerolineasSearchUsage();
      await this.bot.sendMessage(chatId, usageMessage, { parse_mode: 'Markdown' });
      return;
    }

    const [origin, destination, dateStr] = args;

    // Validar códigos de aeropuerto
    const originCode = origin.toUpperCase();
    const destinationCode = destination.toUpperCase();

    if (!this.isValidAerolineasAirport(originCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de origen inválido para Aerolíneas Argentinas: ${originCode}`);
      return;
    }

    if (!this.isValidAerolineasAirport(destinationCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de destino inválido para Aerolíneas Argentinas: ${destinationCode}`);
      return;
    }

    // Validar fecha
    const dateValidation = ValidationUtils.isValidDate(dateStr);
    if (!dateValidation.isValid) {
      await this.bot.sendMessage(chatId, `❌ ${dateValidation.error}`);
      return;
    }

    try {
      const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
      await this.bot.sendMessage(chatId, `${airlineEmoji} 🔍 Función de búsqueda de millas en desarrollo...`);

      // TODO: Implementar búsqueda cuando el servicio esté listo
      await this.bot.sendMessage(
        chatId,
        `🚧 La búsqueda inmediata de millas de Aerolíneas Argentinas está en desarrollo.

📋 **Búsqueda solicitada:**
• Ruta: ${originCode} → ${destinationCode}
• Fecha: ${dateStr}

� Próximamente podrás buscar ofertas de millas en tiempo real.`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🏆 Crear Alerta', callback_data: 'help_miles_alert' },
                { text: '� Ver Ayuda', callback_data: 'help_commands' },
              ],
            ],
          },
        }
      );

    } catch (error) {
      botLogger.error('Error en búsqueda de millas Aerolíneas', error as Error, {
        origin: originCode,
        destination: destinationCode,
        date: dateStr,
        airline: 'AEROLINEAS_ARGENTINAS'
      });
      await this.bot.sendMessage(chatId, '❌ Error procesando la búsqueda. Inténtalo de nuevo más tarde.');
    }
  }

  /**
   * Comando /mis-alertas-millas-ar - Ver alertas de millas de Aerolíneas
   */
  async handleMyAerolineasAlerts(chatId: number, userId: number): Promise<void> {
    try {
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
      
      // TODO: Implementar cuando el modelo esté listo
      await this.bot.sendMessage(
        chatId,
        `${airlineEmoji} 🏆 **Alertas de Millas - Aerolíneas Argentinas**

🚧 La funcionalidad de alertas de millas está en desarrollo.

💡 Próximamente podrás:
• Ver todas tus alertas de millas activas
• Pausar/reactivar alertas individualmente
• Recibir notificaciones automáticas

📋 Usa \`/millas-ar\` para crear tu primera alerta cuando esté disponible.`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🏆 Crear Alerta', callback_data: 'help_miles_alert' },
                { text: '� Ver Ayuda', callback_data: 'help_commands' },
              ],
            ],
          },
        }
      );

    } catch (error) {
      botLogger.error('Error obteniendo alertas de millas', error as Error, { userId });
      await this.bot.sendMessage(chatId, '❌ Error obteniendo tus alertas de millas.');
    }
  }

  /**
   * Comando /test-aerolineas - Diagnosticar API de Aerolíneas
   */
  async handleTestAerolineas(chatId: number): Promise<void> {
    try {
      const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
      
      await this.bot.sendMessage(chatId, `${airlineEmoji} 🔧 **Diagnóstico de API - Aerolíneas Argentinas**

🚧 Función de diagnóstico en desarrollo.

💡 Próximamente podrás verificar:
• Estado de conexión con la API
• Tiempo de respuesta
• Disponibilidad de rutas
• Calidad del servicio

🔍 El equipo está trabajando en la integración completa.`, {
        parse_mode: 'Markdown'
      });

    } catch (error) {
      botLogger.error('Error ejecutando diagnóstico Aerolíneas', error as Error);
      await this.bot.sendMessage(chatId, '❌ Error ejecutando diagnóstico de API.');
    }
  }

  // === MÉTODOS PRIVADOS ===

  /**
   * Validar aeropuerto de Aerolíneas Argentinas
   */
  private isValidAerolineasAirport(code: string): boolean {
    // Importar la función de validación de aeropuertos de Aerolíneas
    try {
      const { isValidAerolineasAirport } = require('../../../config/aerolineas-airports');
      return isValidAerolineasAirport(code);
    } catch (error) {
      // Fallback a validación general si el módulo no existe
      return ValidationUtils.isValidAirport(code);
    }
  }

  /**
   * Formatear mensaje de uso para alertas de millas
   */
  private formatAerolineasMilesUsage(): string {
    const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
    return `${airlineEmoji} *Uso del comando /millas-ar:*

*Sintaxis:*
\`/millas-ar ORIGEN DESTINO FECHA [MAX_MILLAS] [ADULTOS]\`

*Ejemplos:*
• \`/millas-ar EZE MIA 2026-03-15\` - Alerta básica
• \`/millas-ar EZE MIA 2026-03-15 50000\` - Con límite de millas
• \`/millas-ar EZE MIA 2026-03-15 50000 2\` - Para 2 adultos

*Parámetros:*
• **ORIGEN/DESTINO**: Códigos de aeropuerto (ej: EZE, MIA, SCL)
• **FECHA**: Formato YYYY-MM-DD
• **MAX_MILLAS**: Máximo de millas aceptable (opcional)
• **ADULTOS**: Número de adultos (1-9, defecto: 1)

*Aeropuertos principales:*
• Argentina: EZE (Buenos Aires), COR (Córdoba), MDZ (Mendoza)
• Internacional: MIA, SCL, LIM, BOG, NYC`;
  }

  /**
   * Formatear mensaje de uso para búsqueda de millas
   */
  private formatAerolineasSearchUsage(): string {
    const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
    return `${airlineEmoji} *Uso del comando /millas-ar-search:*

*Sintaxis:*
\`/millas-ar-search ORIGEN DESTINO FECHA [MAX_MILLAS]\`

*Ejemplos:*
• \`/millas-ar-search EZE MIA 2026-03-15\` - Búsqueda básica
• \`/millas-ar-search EZE MIA 2026-03-15 50000\` - Con límite de millas

*Parámetros:*
• **ORIGEN/DESTINO**: Códigos de aeropuerto
• **FECHA**: Formato YYYY-MM-DD
• **MAX_MILLAS**: Filtrar por millas máximas (opcional)

💡 Esta búsqueda es inmediata y no crea alertas automáticas.`;
  }
}
