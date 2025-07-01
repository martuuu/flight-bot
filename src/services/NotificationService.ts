import { FlightBot } from '@/bot';
import { PriceAlert } from '@/types';
import { alertLogger } from '@/utils/logger';

/**
 * Servicio de notificaciones para enviar alertas via Telegram
 */
export class NotificationService {
  private bot: FlightBot;

  constructor(bot: FlightBot) {
    this.bot = bot;
  }

  /**
   * Enviar notificación de alerta de precio
   */
  async sendPriceAlert(priceAlert: PriceAlert): Promise<void> {
    try {
      const chatId = priceAlert.user.telegramId;
      
      // Preparar datos para el formato de mensaje
      const alertData = {
        alertId: priceAlert.alertId,
        origin: priceAlert.flight.origin,
        destination: priceAlert.flight.destination,
        airline: priceAlert.flight.airline,
        flightNumber: priceAlert.flight.flightNumber,
        price: priceAlert.currentPrice,
        maxPrice: priceAlert.alert.maxPrice,
        departureDate: priceAlert.flight.departureDate.toLocaleDateString('es-CO'),
        duration: priceAlert.flight.duration,
        stops: priceAlert.flight.stops,
        availableSeats: priceAlert.flight.availableSeats,
        bookingUrl: priceAlert.flight.bookingUrl,
      };

      // Enviar notificación
      await this.bot.sendAlertNotification(chatId, alertData);

      alertLogger.info('Notificación de alerta enviada exitosamente', {
        userId: priceAlert.user.telegramId,
        alertId: priceAlert.alertId,
      });

    } catch (error) {
      alertLogger.error('Error enviando notificación de alerta', error as Error, {
        userId: priceAlert.user.telegramId,
        alertId: priceAlert.alertId,
      });
      throw error;
    }
  }

  /**
   * Enviar notificación de sistema a admin
   */
  async sendSystemNotification(message: string): Promise<void> {
    try {
      await this.bot.sendAdminMessage(`🔧 *Sistema:* ${message}`);
      alertLogger.info('Notificación de sistema enviada');
    } catch (error) {
      alertLogger.error('Error enviando notificación de sistema', error as Error);
    }
  }

  /**
   * Enviar resumen diario a admin
   */
  async sendDailySummary(stats: any): Promise<void> {
    try {
      const message = `📊 *Resumen Diario del Bot*

📈 *Actividad:*
• Alertas verificadas: ${stats.alertsChecked || 0}
• Notificaciones enviadas: ${stats.notificationsSent || 0}
• Nuevos usuarios: ${stats.newUsers || 0}
• Nuevas alertas: ${stats.newAlerts || 0}

⚡ *Sistema:*
• Estado: ${stats.systemStatus || 'Desconocido'}
• Errores: ${stats.errors || 0}
• Uptime: ${Math.round((stats.uptime || 0) / 3600)} horas

🔝 *Rutas Populares:*
${stats.topRoutes?.map((route: any, i: number) => 
  `${i + 1}. ${route.origin} → ${route.destination} (${route.count})`
).join('\n') || 'Sin datos'}`;

      await this.bot.sendAdminMessage(message);
      alertLogger.info('Resumen diario enviado');
    } catch (error) {
      alertLogger.error('Error enviando resumen diario', error as Error);
    }
  }
}
