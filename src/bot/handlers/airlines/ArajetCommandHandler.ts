import { config } from '@/config';
import { botLogger } from '@/utils/logger';
import { MessageFormatter } from '../../MessageFormatter';
import { ValidationUtils } from '../../utils/ValidationUtils';
import { AirlineUtils, AirlineType } from '../../utils/AirlineUtils';
import { AlertManagerCompatAdapter, UserModelCompatAdapter } from '@/services/AlertManagerCompatAdapter';
import { ArajetPassenger } from '@/types/arajet-api';

/**
 * Manejador de comandos específicos de Arajet
 */
export class ArajetCommandHandler {
  private bot: any;
  private alertManager: AlertManagerCompatAdapter;

  constructor(bot: any) {
    this.bot = bot;
    this.alertManager = new AlertManagerCompatAdapter(process.env['DATABASE_PATH'] || './data/flights.db');
  }

  /**
   * Comando /monthlyalert - Crear alerta mensual automática
   */
  async handleMonthlyAlert(chatId: number, userId: number, args: string[]): Promise<void> {
    if (args.length < 3) {
      const usageMessage = MessageFormatter.formatMonthlyAlertUsageMessage();
      await this.bot.sendMessage(chatId, usageMessage, { parse_mode: 'Markdown' });
      return;
    }

    const [origin, destination, maxPriceStr, monthYear] = args;
    
    // Validar precio
    const priceValidation = ValidationUtils.isValidPrice(maxPriceStr);
    if (!priceValidation.isValid) {
      await this.bot.sendMessage(chatId, `❌ ${priceValidation.error}`);
      return;
    }

    // Validar y procesar mes/año
    let searchMonth: string;
    if (monthYear) {
      const monthValidation = ValidationUtils.validateAndFormatMonth(monthYear);
      if (!monthValidation.isValid) {
        await this.bot.sendMessage(chatId, `❌ ${monthValidation.error}`);
        return;
      }
      searchMonth = monthValidation.formattedMonth!;
    } else {
      // Usar mes actual por defecto
      const now = new Date();
      searchMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    // Validar códigos de aeropuerto
    const originCode = origin.toUpperCase();
    const destinationCode = destination.toUpperCase();

    if (!ValidationUtils.isValidAirport(originCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de origen inválido: ${originCode}`);
      return;
    }

    if (!ValidationUtils.isValidAirport(destinationCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de destino inválido: ${destinationCode}`);
      return;
    }

    if (!ValidationUtils.areAirportsDifferent(originCode, destinationCode)) {
      await this.bot.sendMessage(chatId, '❌ El origen y destino no pueden ser iguales');
      return;
    }

    try {
      const user = UserModelCompatAdapter.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      // Verificar límite de alertas
      const alertCount = this.alertManager.getUserAlerts(user.id).length;
      if (alertCount >= config.alerts.maxAlertsPerUser) {
        await this.bot.sendMessage(
          chatId,
          `❌ Has alcanzado el límite de ${config.alerts.maxAlertsPerUser} alertas activas.`
        );
        return;
      }

      // Crear alerta mensual automática con pasajeros por defecto
      const defaultPassengers: ArajetPassenger[] = [
        { code: 'ADT', count: 1 }
      ];

      const alert = this.alertManager.createAlert(
        user.id,
        chatId,
        originCode,
        destinationCode,
        priceValidation.price!,
        defaultPassengers,
        searchMonth
      );

      const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.ARAJET);
      const successMessage = `${airlineEmoji} *Alerta Mensual Arajet Creada*

✈️ **Ruta**: ${originCode} → ${destinationCode}
💰 **Precio máximo**: $${priceValidation.price}
📅 **Mes**: ${searchMonth}
🆔 **ID**: \`${alert.id}\`

🔍 El bot buscará automáticamente ofertas durante todo el mes especificado y te notificará cuando encuentre precios por debajo de tu límite.

💡 Usa \`/misalertas\` para ver todas tus alertas activas.`;
      
      await this.bot.sendMessage(chatId, successMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📋 Mis Alertas', callback_data: 'my_alerts' },
              { text: '✈️ Nueva Alerta', callback_data: 'help_alert' },
            ],
          ],
        },
      });

      botLogger.info('Alerta mensual Arajet creada', { 
        userId, 
        alertId: alert.id, 
        route: `${originCode}-${destinationCode}`,
        searchMonth,
        airline: 'ARAJET'
      });

    } catch (error) {
      botLogger.error('Error creando alerta mensual Arajet', error as Error, { 
        userId, 
        origin: originCode, 
        destination: destinationCode,
        airline: 'ARAJET'
      });
      await this.bot.sendMessage(chatId, '❌ Error creando la alerta mensual. Inténtalo de nuevo.');
    }
  }

  /**
   * Chequear una alerta de Arajet ahora mismo
   */
  async handleCheckAlertNow(chatId: number, userId: number, alertId: string): Promise<void> {
    try {
      const user = UserModelCompatAdapter.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      await this.bot.sendMessage(chatId, '🔍 Buscando ofertas de Arajet ahora...');

      // Obtener la alerta
      const alerts = this.alertManager.getUserAlerts(user.id);
      const alert = alerts.find(a => a.id === alertId);
      
      if (!alert) {
        await this.bot.sendMessage(chatId, '❌ Alerta no encontrada.');
        return;
      }

      // Importar el servicio de Arajet
      const { ArajetAlertService } = await import('@/services/ArajetAlertService');
      const arajetService = new ArajetAlertService();

      // Buscar ofertas
      const deals = await arajetService.findDealsForAlert(alert);
      
      if (deals.length > 0) {
        const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.ARAJET);
        let message = `${airlineEmoji} *Ofertas Encontradas (Arajet)*\n\n`;
        
        deals.forEach((deal, index) => {
          message += `${index + 1}. **Vuelo ${deal.flightNumber}**\n`;
          message += `   💰 Precio: $${deal.price}\n`;
          message += `   📅 Fecha: ${deal.date}\n`;
          message += `   🕐 Salida: ${deal.departureTime}\n`;
          message += `   🕐 Llegada: ${deal.arrivalTime}\n\n`;
        });

        await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      } else {
        await this.bot.sendMessage(
          chatId,
          '😔 No se encontraron ofertas que cumplan con tus criterios en este momento.',
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '🔄 Intentar de nuevo', callback_data: `check_alert_${alertId}` }],
              ],
            },
          }
        );
      }

    } catch (error) {
      botLogger.error('Error chequeando alerta Arajet', error as Error, { 
        userId, 
        alertId,
        airline: 'ARAJET'
      });
      await this.bot.sendMessage(chatId, '❌ Error buscando ofertas. Inténtalo de nuevo más tarde.');
    }
  }

  /**
   * Obtener información específica de Arajet
   */
  getAirlineInfo(): string {
    const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.ARAJET);
    return `${airlineEmoji} *Arajet*

🎯 **Especialidad**: Vuelos low-cost en el Caribe
🌎 **Destinos**: República Dominicana, Estados Unidos, Sudamérica
📅 **Alertas mensuales**: ✅ Disponible
🏆 **Alertas de millas**: ❌ No disponible

💡 **Consejo**: Las alertas mensuales son ideales para encontrar las mejores ofertas de Arajet, ya que sus precios varían frecuentemente.`;
  }

  /**
   * Validar si un aeropuerto es válido para Arajet
   */
  isValidArajetAirport(code: string): boolean {
    // Por ahora, usar la validación general
    // En el futuro, se puede implementar validación específica para rutas de Arajet
    return ValidationUtils.isValidAirport(code);
  }

  /**
   * Obtener rutas populares de Arajet
   */
  getPopularRoutes(): string[] {
    return [
      'STI-MIA', 'PUJ-MIA', 'SDQ-MIA',
      'STI-JFK', 'PUJ-JFK', 'SDQ-JFK',
      'STI-BOG', 'PUJ-BOG', 'SDQ-BOG',
      'STI-SCL', 'PUJ-SCL', 'SDQ-SCL'
    ];
  }
}
