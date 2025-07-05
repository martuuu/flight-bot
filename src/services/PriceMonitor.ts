import { AlertModel, PriceHistoryModel } from '@/models';
import { UserModelCompatAdapter } from '@/services/AlertManagerCompatAdapter';
import { ScraperFactory } from '@/services/scrapers';
import { FlightSearchParams, Alert, PriceAlert, FlightResult } from '@/types';
import { alertLogger } from '@/utils/logger';
import { config } from '@/config';

/**
 * Monitor de precios que verifica alertas y detecta cambios
 */
export class PriceMonitor {
  private scrapers: Map<string, any> = new Map();
  private isRunning = false;

  constructor() {
    this.initializeScrapers();
  }

  /**
   * Inicializar scrapers disponibles
   */
  private initializeScrapers(): void {
    try {
      const supportedAirlines = ScraperFactory.getSupportedAirlines();
      
      for (const airline of supportedAirlines) {
        const scraper = ScraperFactory.createScraper(airline);
        this.scrapers.set(airline, scraper);
        alertLogger.info(`Scraper inicializado: ${airline}`);
      }
    } catch (error) {
      alertLogger.error('Error inicializando scrapers', error as Error);
    }
  }

  /**
   * Verificar todas las alertas pendientes
   */
  async checkAllAlerts(): Promise<void> {
    if (this.isRunning) {
      alertLogger.warn('Monitor de precios ya está ejecutándose');
      return;
    }

    this.isRunning = true;
    alertLogger.info('Iniciando verificación de alertas');

    try {
      const pendingAlerts = AlertModel.findPendingCheck(config.scraping.intervalMinutes);
      alertLogger.info(`Verificando ${pendingAlerts.length} alertas pendientes`);

      // Procesar alertas en batches para evitar sobrecarga
      const batchSize = config.scraping.maxConcurrentRequests;
      
      for (let i = 0; i < pendingAlerts.length; i += batchSize) {
        const batch = pendingAlerts.slice(i, i + batchSize);
        await this.processBatch(batch);
        
        // Pequeña pausa entre batches
        if (i + batchSize < pendingAlerts.length) {
          await this.sleep(2000);
        }
      }

      alertLogger.info('Verificación de alertas completada');
    } catch (error) {
      alertLogger.error('Error en verificación de alertas', error as Error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Procesar un lote de alertas
   */
  private async processBatch(alerts: Alert[]): Promise<void> {
    const promises = alerts.map(alert => this.checkSingleAlert(alert));
    await Promise.allSettled(promises);
  }

  /**
   * Verificar una alerta específica
   */
  private async checkSingleAlert(alert: Alert): Promise<void> {
    try {
      alertLogger.debug(`Verificando alerta ${alert.id}: ${alert.origin} → ${alert.destination}`);

      // Crear parámetros de búsqueda
      const searchParams: FlightSearchParams = {
        origin: alert.origin,
        destination: alert.destination,
        departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde hoy
        passengers: 1,
        cabinClass: 'economy',
      };

      // Buscar en todas las aerolíneas
      const allFlights: FlightResult[] = [];
      
      for (const [airline, scraper] of this.scrapers) {
        try {
          const result = await scraper.searchFlights(searchParams);
          
          if (result.success && result.flights.length > 0) {
            allFlights.push(...result.flights);
            
            // Guardar en historial
            for (const flight of result.flights) {
              PriceHistoryModel.create(flight);
            }
          }
        } catch (error) {
          alertLogger.error(`Error buscando en ${airline}`, error as Error);
        }
      }

      // Actualizar última verificación
      AlertModel.updateLastChecked(alert.id);

      // Verificar si hay precios que activen la alerta
      await this.evaluateFlights(alert, allFlights);

    } catch (error) {
      alertLogger.error(`Error verificando alerta ${alert.id}`, error as Error);
    }
  }

  /**
   * Evaluar vuelos encontrados contra la alerta
   */
  private async evaluateFlights(alert: Alert, flights: FlightResult[]): Promise<void> {
    if (flights.length === 0) {
      alertLogger.debug(`No se encontraron vuelos para alerta ${alert.id}`);
      return;
    }

    // Filtrar vuelos que cumplan con el precio máximo
    const triggeredFlights = flights.filter(flight => 
      flight.price <= alert.maxPrice && 
      flight.availableSeats > 0
    );

    if (triggeredFlights.length === 0) {
      alertLogger.debug(`No hay vuelos que activen alerta ${alert.id}`);
      return;
    }

    // Ordenar por precio (el más barato primero)
    triggeredFlights.sort((a, b) => a.price - b.price);
    const bestFlight = triggeredFlights[0];

    // Verificar cooldown (evitar spam de notificaciones)
    const lastNotification = await this.getLastNotificationTime(alert.id);
    const cooldownMs = config.alerts.cooldownMinutes * 60 * 1000;
    
    if (lastNotification && (Date.now() - lastNotification.getTime()) < cooldownMs) {
      alertLogger.debug(`Alerta ${alert.id} en cooldown`);
      return;
    }

    // Crear objeto de alerta de precio
    const user = UserModelCompatAdapter.findByTelegramId(alert.userId);
    if (!user) {
      alertLogger.error(`Usuario no encontrado para alerta ${alert.id}`);
      return;
    }

    const priceAlert: PriceAlert = {
      alertId: alert.id,
      currentPrice: bestFlight.price,
      priceChange: 0, // TODO: Calcular basado en historial
      priceChangePercent: 0,
      flight: bestFlight,
      alert,
      user,
    };

    // Disparar notificación
    await this.triggerPriceAlert(priceAlert);

    alertLogger.info(`Alerta activada para usuario ${user.telegramId}`, {
      alertId: alert.id,
      route: `${alert.origin}-${alert.destination}`,
      price: bestFlight.price,
      maxPrice: alert.maxPrice,
    });
  }

  /**
   * Disparar alerta de precio
   */
  private async triggerPriceAlert(priceAlert: PriceAlert): Promise<void> {
    try {
      // Aquí se debería integrar con el sistema de notificaciones
      // Por ahora solo registramos en log
      alertLogger.info('Alerta de precio disparada', {
        userId: priceAlert.user.telegramId,
        alertId: priceAlert.alertId,
        price: priceAlert.currentPrice,
        airline: priceAlert.flight.airline,
        route: `${priceAlert.flight.origin}-${priceAlert.flight.destination}`,
      });

      // TODO: Enviar notificación via Telegram
      // await this.notificationService.sendPriceAlert(priceAlert);

      // Registrar notificación enviada (simulado)
      // NotificationModel.create(priceAlert);

    } catch (error) {
      alertLogger.error('Error enviando alerta de precio', error as Error);
    }
  }

  /**
   * Obtener tiempo de última notificación para una alerta
   */
  private async getLastNotificationTime(_alertId: number): Promise<Date | null> {
    try {
      // TODO: Implementar consulta a tabla notifications_sent
      return null;
    } catch (error) {
      alertLogger.error('Error obteniendo última notificación', error as Error);
      return null;
    }
  }

  /**
   * Verificar una ruta específica en tiempo real
   */
  async checkRoute(
    origin: string,
    destination: string,
    departureDate?: Date
  ): Promise<FlightResult[]> {
    try {
      const searchParams: FlightSearchParams = {
        origin,
        destination,
        departureDate: departureDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        passengers: 1,
        cabinClass: 'economy',
      };

      const allFlights: FlightResult[] = [];

      for (const [airline, scraper] of this.scrapers) {
        try {
          const result = await scraper.searchFlights(searchParams);
          
          if (result.success && result.flights.length > 0) {
            allFlights.push(...result.flights);
          }
        } catch (error) {
          alertLogger.error(`Error buscando en ${airline}`, error as Error);
        }
      }

      // Guardar en historial
      for (const flight of allFlights) {
        PriceHistoryModel.create(flight);
      }

      return allFlights.sort((a, b) => a.price - b.price);

    } catch (error) {
      alertLogger.error('Error verificando ruta', error as Error, { origin, destination });
      return [];
    }
  }

  /**
   * Obtener estadísticas del monitor
   */
  getStats(): any {
    return {
      isRunning: this.isRunning,
      scrapersCount: this.scrapers.size,
      supportedAirlines: Array.from(this.scrapers.keys()),
      lastRun: new Date(), // TODO: Implementar tracking real
    };
  }

  /**
   * Utility para sleep
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
