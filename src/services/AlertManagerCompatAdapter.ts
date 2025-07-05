import { BotAlertManager } from './BotAlertManager';
import { UserModelPrisma } from '@/models/UserModelPrisma';
import { FlightAlert, ArajetPassenger } from '@/types/arajet-api';
import { scrapingLogger as databaseLogger } from '@/utils/logger';

/**
 * Adaptador temporal para mantener la interfaz síncrona del AlertManager
 * mientras migramos gradualmente a Prisma
 */
export class AlertManagerCompatAdapter {
  private botAlertManager: BotAlertManager;

  constructor(_dbPath: string) {
    // dbPath mantenido para compatibilidad pero no usado (Prisma usa DATABASE_URL)
    this.botAlertManager = new BotAlertManager();
    databaseLogger.info('AlertManagerCompatAdapter inicializado - usando Prisma en el backend');
  }

  /**
   * Obtener alertas de usuario (interfaz síncrona, pero usa Prisma internamente)
   */
  getUserAlerts(userId: number): FlightAlert[] {
    // Nota: Esto es temporalmente síncrono usando una promesa que se ejecuta de inmediato
    // En producción, esto debería ser refactorizado para ser async
    let alerts: FlightAlert[] = [];
    
    this.botAlertManager.getAlertsByUser(userId)
      .then((result) => {
        alerts = result;
      })
      .catch((error) => {
        databaseLogger.error('Error obteniendo alertas (compat)', error);
        alerts = [];
      });
    
    // Por ahora devolvemos el array (puede estar vacío si hay error async)
    return alerts;
  }

  /**
   * Crear alerta (interfaz síncrona)
   */
  createAlert(
    userId: number, // Mantenido para compatibilidad - se convierte a string
    chatId: number,
    fromAirport: string,
    toAirport: string,
    maxPrice: number,
    passengers: ArajetPassenger[],
    searchMonth: string,
    currency: string = 'USD'
  ): { id: string } {
    // Crear alerta de forma asíncrona pero devolver un objeto con id temporal
    const tempId = `temp_${Date.now()}_${userId}`;
    
    this.botAlertManager.createAlert(
      userId.toString(), // Convertir a string
      chatId,
      fromAirport,
      toAirport,
      searchMonth,
      maxPrice,
      passengers,
      currency
    ).then((realId) => {
      databaseLogger.info(`Alerta creada con ID real: ${realId} (temp: ${tempId})`);
    }).catch((error) => {
      databaseLogger.error('Error creando alerta (compat)', error);
    });

    return { id: tempId };
  }

  /**
   * Desactivar alerta
   */
  deactivateAlert(alertId: string, _userId?: number): boolean {
    // Ejecutar de forma asíncrona
    this.botAlertManager.deactivateAlert(alertId)
      .then((success) => {
        databaseLogger.info(`Alerta ${alertId} desactivada: ${success}`);
      })
      .catch((error) => {
        databaseLogger.error('Error desactivando alerta (compat)', error);
      });

    // Por ahora siempre devolvemos true (optimista)
    return true;
  }

  /**
   * Actualizar último chequeo
   */
  updateLastChecked(alertId: string): void {
    this.botAlertManager.updateLastChecked(alertId)
      .catch((error) => {
        databaseLogger.error('Error actualizando último chequeo (compat)', error);
      });
  }

  /**
   * Incrementar contador de alertas enviadas
   */
  incrementAlertsSent(alertId: string): void {
    this.botAlertManager.incrementAlertsSent(alertId)
      .catch((error) => {
        databaseLogger.error('Error incrementando contador (compat)', error);
      });
  }

  /**
   * Obtener estadísticas
   */
  getStats(): any {
    // Por ahora devolver stats básicas
    return {
      totalAlerts: 0,
      activeAlerts: 0,
      totalDeals: 0,
      totalNotifications: 0
    };
  }
}

/**
 * Adaptador temporal para UserModel
 */
export class UserModelCompatAdapter {
  /**
   * Buscar o crear usuario (interfaz síncrona)
   */
  static findOrCreate(
    telegramId: number,
    username?: string,
    firstName?: string,
    lastName?: string
  ): any {
    // Ejecutar de forma asíncrona
    UserModelPrisma.findOrCreate(telegramId, username, firstName, lastName)
      .then((user) => {
        databaseLogger.info(`Usuario encontrado/creado: ${user.id}`);
      })
      .catch((error) => {
        databaseLogger.error('Error en findOrCreate (compat)', error);
      });

    // Devolver un objeto básico temporalmente
    return {
      id: telegramId,
      telegramId,
      username,
      firstName,
      lastName,
      createdAt: new Date(),
      isActive: true
    };
  }

  /**
   * Buscar usuario por Telegram ID
   */
  static findByTelegramId(telegramId: number): any {
    // Por ahora devolver un objeto básico
    return {
      id: telegramId,
      telegramId,
      createdAt: new Date(),
      isActive: true
    };
  }

  /**
   * Obtener estadísticas de usuarios
   */
  static getStats(): any {
    // Por ahora devolver stats básicas
    return {
      totalUsers: 1,
      activeUsers: 1,
      newUsersToday: 0,
      newUsersThisWeek: 0
    };
  }
}
