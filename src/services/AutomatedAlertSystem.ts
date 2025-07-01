import { AlertManager } from './AlertManager';
import { ArajetAlertService } from './ArajetAlertService';
import { FlightAlert, FlightDeal, AlertNotification } from '../types/arajet-api';
import { scrapingLogger } from '../utils/logger';
import TelegramBot from 'node-telegram-bot-api';

export class AutomatedAlertSystem {
  private alertManager: AlertManager;
  private arajetService: ArajetAlertService;
  private bot: TelegramBot;
  private isRunning: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(
    dbPath: string,
    bot: TelegramBot
  ) {
    this.alertManager = new AlertManager(dbPath);
    this.arajetService = new ArajetAlertService();
    this.bot = bot;
  }

  /**
   * Inicia el sistema de alertas automáticas
   */
  start(intervalMinutes: number = 30): void {
    if (this.isRunning) {
      scrapingLogger.warn('Sistema de alertas ya está ejecutándose');
      return;
    }

    this.isRunning = true;
    scrapingLogger.info(`Iniciando sistema de alertas automáticas (intervalo: ${intervalMinutes} minutos)`);

    // Ejecutar inmediatamente
    this.processAllAlerts();

    // Programar ejecuciones periódicas
    this.checkInterval = setInterval(() => {
      this.processAllAlerts();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Detiene el sistema de alertas automáticas
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    scrapingLogger.info('Sistema de alertas automáticas detenido');
  }

  /**
   * Procesa todas las alertas activas
   */
  private async processAllAlerts(): Promise<void> {
    try {
      scrapingLogger.info('🔍 Iniciando verificación de alertas automáticas...');

      const activeAlerts = this.alertManager.getAllActiveAlerts();
      
      if (activeAlerts.length === 0) {
        scrapingLogger.info('No hay alertas activas para procesar');
        return;
      }

      scrapingLogger.info(`Procesando ${activeAlerts.length} alertas activas`);

      const results = {
        processed: 0,
        withDeals: 0,
        notificationsSent: 0,
        errors: 0
      };

      for (const alert of activeAlerts) {
        try {
          await this.processAlert(alert);
          results.processed++;
          
          // Pausa entre alertas para evitar sobrecargar la API
          await this.delay(2000);
        } catch (error) {
          scrapingLogger.error(`Error procesando alerta ${alert.id}: ${error}`);
          results.errors++;
        }
      }

      scrapingLogger.info(
        `✅ Verificación completada: ${results.processed} procesadas, ` +
        `${results.withDeals} con ofertas, ${results.notificationsSent} notificaciones enviadas, ` +
        `${results.errors} errores`
      );

      // Limpieza de datos antiguos cada 24 horas
      if (this.shouldRunCleanup()) {
        this.alertManager.cleanupOldData();
      }

    } catch (error) {
      scrapingLogger.error('Error en verificación masiva de alertas:', error as Error);
    }
  }

  /**
   * Procesa una alerta individual
   */
  private async processAlert(alert: FlightAlert): Promise<void> {
    try {
      scrapingLogger.debug(`Procesando alerta ${alert.id}: ${alert.fromAirport} → ${alert.toAirport}`);

      // Buscar ofertas
      const deals = await this.arajetService.findDealsForAlert(alert);

      // Actualizar fecha de última verificación
      this.alertManager.updateLastChecked(alert.id);

      if (deals.length > 0) {
        scrapingLogger.info(`📢 Encontradas ${deals.length} ofertas para alerta ${alert.id}`);

        // Guardar ofertas en la base de datos
        this.alertManager.saveDeals(deals);

        // Enviar notificación
        await this.sendNotification(alert, deals);

        // Incrementar contador de alertas enviadas
        this.alertManager.incrementAlertsSent(alert.id);
      } else {
        scrapingLogger.debug(`No se encontraron ofertas para alerta ${alert.id}`);
      }

    } catch (error) {
      scrapingLogger.error(`Error procesando alerta ${alert.id}: ${error}`);
      throw error;
    }
  }

  /**
   * Envía notificación por Telegram
   */
  private async sendNotification(alert: FlightAlert, deals: FlightDeal[]): Promise<void> {
    try {
      const message = this.arajetService.formatAlertMessage(alert, deals);
      
      await this.bot.sendMessage(alert.chatId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });

      // Guardar notificación en la base de datos
      const notification: AlertNotification = {
        alertId: alert.id,
        userId: alert.userId,
        chatId: alert.chatId,
        deals,
        message,
        sentAt: new Date()
      };

      this.alertManager.saveNotification(notification);

      scrapingLogger.info(`📨 Notificación enviada para alerta ${alert.id} a chat ${alert.chatId}`);

    } catch (error) {
      scrapingLogger.error(`Error enviando notificación para alerta ${alert.id}: ${error}`);
      throw error;
    }
  }

  /**
   * Crea una nueva alerta
   */
  async createAlert(
    userId: number,
    chatId: number,
    fromAirport: string,
    toAirport: string,
    maxPrice: number,
    passengers: any[],
    searchMonth: string
  ): Promise<{ success: boolean; alert?: FlightAlert; error?: string }> {
    try {
      // Validaciones
      if (!this.arajetService.isValidAirportCode(fromAirport)) {
        return { success: false, error: `Código de aeropuerto inválido: ${fromAirport}` };
      }

      if (!this.arajetService.isValidAirportCode(toAirport)) {
        return { success: false, error: `Código de aeropuerto inválido: ${toAirport}` };
      }

      if (!this.arajetService.isValidMonth(searchMonth)) {
        return { success: false, error: `Mes inválido: ${searchMonth}. Use formato YYYY-MM` };
      }

      if (maxPrice <= 0) {
        return { success: false, error: 'El precio máximo debe ser mayor a 0' };
      }

      // Verificar límite de alertas por usuario
      const userAlerts = this.alertManager.getUserAlerts(userId);
      const maxAlertsPerUser = 10; // Configurable

      if (userAlerts.length >= maxAlertsPerUser) {
        return { 
          success: false, 
          error: `Límite de alertas alcanzado (${maxAlertsPerUser}). Elimine algunas alertas antes de crear nuevas.` 
        };
      }

      // Crear alerta
      const alert = this.alertManager.createAlert(
        userId,
        chatId,
        fromAirport,
        toAirport,
        maxPrice,
        passengers,
        searchMonth
      );

      scrapingLogger.info(`Nueva alerta creada: ${alert.id} por usuario ${userId}`);

      return { success: true, alert };

    } catch (error) {
      scrapingLogger.error('Error creando alerta:', error as Error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene alertas de un usuario
   */
  getUserAlerts(userId: number): FlightAlert[] {
    return this.alertManager.getUserAlerts(userId);
  }

  /**
   * Desactiva una alerta
   */
  deactivateAlert(alertId: string, userId: number): boolean {
    return this.alertManager.deactivateAlert(alertId, userId);
  }

  /**
   * Elimina una alerta
   */
  deleteAlert(alertId: string, userId: number): boolean {
    return this.alertManager.deleteAlert(alertId, userId);
  }

  /**
   * Obtiene estadísticas de un usuario
   */
  getUserStats(userId: number) {
    return this.alertManager.getUserStats(userId);
  }

  /**
   * Test manual de una alerta específica
   */
  async testAlert(alertId: string, userId: number): Promise<{ success: boolean; message: string; deals?: FlightDeal[] }> {
    try {
      const userAlerts = this.alertManager.getUserAlerts(userId);
      const alert = userAlerts.find(a => a.id === alertId);

      if (!alert) {
        return { success: false, message: 'Alerta no encontrada' };
      }

      scrapingLogger.info(`Test manual de alerta ${alertId} iniciado por usuario ${userId}`);

      const deals = await this.arajetService.findDealsForAlert(alert);
      const message = this.arajetService.formatAlertMessage(alert, deals);

      return { 
        success: true, 
        message: `Test completado. ${message}`,
        deals 
      };

    } catch (error) {
      scrapingLogger.error(`Error en test de alerta ${alertId}: ${error}`);
      return { success: false, message: 'Error ejecutando test' };
    }
  }

  /**
   * Verifica conectividad con la API
   */
  async checkApiHealth(): Promise<boolean> {
    return await this.arajetService.testApiConnection();
  }

  /**
   * Obtiene información de aeropuerto
   */
  getAirportInfo(code: string) {
    return this.arajetService.getAirportInfo(code);
  }

  /**
   * Pausa la ejecución por un tiempo determinado
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Determina si debe ejecutar la limpieza de datos
   */
  private shouldRunCleanup(): boolean {
    const hour = new Date().getHours();
    return hour === 3; // Ejecutar a las 3 AM
  }

  /**
   * Obtiene el estado del sistema
   */
  getSystemStatus(): {
    isRunning: boolean;
    totalActiveAlerts: number;
    lastCheck?: Date | undefined;
  } {
    const activeAlerts = this.alertManager.getAllActiveAlerts();
    
    return {
      isRunning: this.isRunning,
      totalActiveAlerts: activeAlerts.length,
      lastCheck: activeAlerts.length > 0 ? 
        activeAlerts.reduce((latest, alert) => 
          !latest || (alert.lastChecked && alert.lastChecked > latest) ? 
            alert.lastChecked : latest, undefined as Date | undefined) || undefined : undefined
    };
  }

  /**
   * Cierra el sistema y libera recursos
   */
  close(): void {
    this.stop();
    this.alertManager.close();
  }
}
