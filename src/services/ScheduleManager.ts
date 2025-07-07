import cron from 'node-cron';
import { PriceMonitor } from './PriceMonitor';
import { NotificationService } from './NotificationService';
import { FlightBot } from '@/bot';
import { config } from '@/config';
import { alertLogger } from '@/utils/logger';
import { db } from '@/database';

/**
 * Manejador de tareas programadas (cron jobs)
 */
export class ScheduleManager {
  private priceMonitor: PriceMonitor;
  private notificationService: NotificationService;
  private bot: FlightBot;
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(bot: FlightBot) {
    this.bot = bot;
    this.priceMonitor = new PriceMonitor();
    this.notificationService = new NotificationService(bot);
  }

  /**
   * Inicializar todas las tareas programadas
   */
  start(): void {
    this.setupPriceMonitoringJob();
    this.setupDatabaseCleanupJob();
    this.setupHealthCheckJob();
    this.setupDailySummaryJob();
    this.setupDatabaseBackupJob();

    alertLogger.info('Schedule Manager iniciado con todas las tareas programadas');
  }

  /**
   * Detener todas las tareas programadas
   */
  stop(): void {
    for (const [name, job] of this.jobs) {
      job.stop();
      alertLogger.info(`Tarea detenida: ${name}`);
    }
    this.jobs.clear();
    alertLogger.info('Schedule Manager detenido');
  }

  /**
   * Configurar job de monitoreo de precios
   */
  private setupPriceMonitoringJob(): void {
    const intervalMinutes = config.scraping.intervalMinutes;
    const cronExpression = `*/${intervalMinutes} * * * *`; // Cada X minutos

    const job = cron.schedule(cronExpression, async () => {
      try {
        alertLogger.info('Iniciando verificación programada de precios');
        await this.priceMonitor.checkAllAlerts();
      } catch (error) {
        alertLogger.error('Error en verificación programada de precios', error as Error);
        await this.notificationService.sendSystemNotification(
          `Error en monitoreo de precios: ${(error as Error).message}`
        );
      }
    }, {
      scheduled: false, // No iniciar automáticamente
      timezone: 'America/Bogota',
    });

    this.jobs.set('price-monitoring', job);
    job.start();
    
    alertLogger.info(`Job de monitoreo de precios configurado: cada ${intervalMinutes} minutos`);
  }

  /**
   * Configurar job de limpieza de base de datos
   */
  private setupDatabaseCleanupJob(): void {
    // Ejecutar diariamente a las 2:00 AM
    const job = cron.schedule('0 2 * * *', async () => {
      try {
        alertLogger.info('Iniciando limpieza programada de base de datos');
        db.cleanOldData();
        alertLogger.info('Limpieza de base de datos completada');
      } catch (error) {
        alertLogger.error('Error en limpieza de base de datos', error as Error);
        await this.notificationService.sendSystemNotification(
          `Error en limpieza de DB: ${(error as Error).message}`
        );
      }
    }, {
      scheduled: false,
      timezone: 'America/Bogota',
    });

    this.jobs.set('database-cleanup', job);
    job.start();
    
    alertLogger.info('Job de limpieza de base de datos configurado: diario a las 2:00 AM');
  }

  /**
   * Configurar job de verificación de salud del sistema
   */
  private setupHealthCheckJob(): void {
    // Ejecutar cada 10 minutos
    const job = cron.schedule('*/10 * * * *', async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        alertLogger.error('Error en verificación de salud', error as Error);
      }
    }, {
      scheduled: false,
      timezone: 'America/Bogota',
    });

    this.jobs.set('health-check', job);
    job.start();
    
    alertLogger.info('Job de verificación de salud configurado: cada 10 minutos');
  }

  /**
   * Configurar job de resumen diario
   */
  private setupDailySummaryJob(): void {
    // Ejecutar diariamente a las 8:00 AM
    const job = cron.schedule('0 8 * * *', async () => {
      try {
        alertLogger.info('Generando resumen diario');
        
        const stats = {
          alertsChecked: 0, // TODO: Implementar contadores reales
          notificationsSent: 0,
          newUsers: 0,
          newAlerts: 0,
          systemStatus: 'Operativo',
          errors: 0,
          uptime: process.uptime(),
          topRoutes: [], // TODO: Obtener de base de datos
        };

        await this.notificationService.sendDailySummary(stats);
        alertLogger.info('Resumen diario enviado');
      } catch (error) {
        alertLogger.error('Error generando resumen diario', error as Error);
      }
    }, {
      scheduled: false,
      timezone: 'America/Bogota',
    });

    this.jobs.set('daily-summary', job);
    job.start();
    
    alertLogger.info('Job de resumen diario configurado: diario a las 8:00 AM');
  }

  /**
   * Configurar job de backup de base de datos
   */
  private setupDatabaseBackupJob(): void {
    // Ejecutar diariamente a las 3:00 AM
    const job = cron.schedule('0 3 * * *', async () => {
      try {
        alertLogger.info('Iniciando backup programado de base de datos');
        const backupPath = await db.createBackup();
        alertLogger.info(`Backup creado exitosamente: ${backupPath}`);
        
        await this.notificationService.sendSystemNotification(
          `Backup diario completado: ${backupPath}`
        );
      } catch (error) {
        alertLogger.error('Error en backup de base de datos', error as Error);
        await this.notificationService.sendSystemNotification(
          `Error en backup: ${(error as Error).message}`
        );
      }
    }, {
      scheduled: false,
      timezone: 'America/Bogota',
    });

    this.jobs.set('database-backup', job);
    job.start();
    
    alertLogger.info('Job de backup de base de datos configurado: diario a las 3:00 AM');
  }

  /**
   * Verificar salud del sistema
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const healthStatus = {
        database: true,
        telegram: true,
        scraping: true,
      };

      // Verificar base de datos
      try {
        healthStatus.database = await db.checkIntegrity();
      } catch (error) {
        healthStatus.database = false;
        alertLogger.error('Health check: Error en base de datos', error as Error);
      }

      // Verificar bot de Telegram
      try {
        await this.bot.getBotInfo();
        healthStatus.telegram = true;
      } catch (error) {
        healthStatus.telegram = false;
        alertLogger.error('Health check: Error en bot de Telegram', error as Error);
      }

      // Verificar sistema de scraping
      try {
        const monitorStats = this.priceMonitor.getStats();
        healthStatus.scraping = monitorStats.scrapersCount > 0;
      } catch (error) {
        healthStatus.scraping = false;
        alertLogger.error('Health check: Error en sistema de scraping', error as Error);
      }

      // Log del estado de salud
      const overallHealth = Object.values(healthStatus).every(status => status);
      
      if (overallHealth) {
        alertLogger.debug('Health check: Sistema saludable', healthStatus);
      } else {
        alertLogger.warn('Health check: Problemas detectados', healthStatus);
        
        // Notificar al admin si hay problemas críticos
        if (!healthStatus.database || !healthStatus.telegram) {
          await this.notificationService.sendSystemNotification(
            `⚠️ Problemas críticos detectados: ${JSON.stringify(healthStatus)}`
          );
        }
      }

    } catch (error) {
      alertLogger.error('Error en health check general', error as Error);
    }
  }

  /**
   * Ejecutar tarea específica manualmente
   */
  async runJob(jobName: string): Promise<void> {
    const job = this.jobs.get(jobName);
    if (!job) {
      throw new Error(`Job no encontrado: ${jobName}`);
    }

    alertLogger.info(`Ejecutando job manual: ${jobName}`);
    
    try {
      switch (jobName) {
        case 'price-monitoring':
          await this.priceMonitor.checkAllAlerts();
          break;
        case 'database-cleanup':
          db.cleanOldData();
          break;
        case 'health-check':
          await this.performHealthCheck();
          break;
        case 'database-backup':
          await db.createBackup();
          break;
        default:
          throw new Error(`Ejecución manual no implementada para: ${jobName}`);
      }
      
      alertLogger.info(`Job manual completado: ${jobName}`);
    } catch (error) {
      alertLogger.error(`Error en job manual ${jobName}`, error as Error);
      throw error;
    }
  }

  /**
   * Obtener estado de todos los jobs
   */
  getJobsStatus(): any {
    const status: any = {};
    
    for (const [name] of this.jobs) {
      status[name] = {
        scheduled: true,
        lastRun: new Date().toISOString(),
      };
    }
    
    return status;
  }

  /**
   * Reiniciar job específico
   */
  restartJob(jobName: string): void {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      job.start();
      alertLogger.info(`Job reiniciado: ${jobName}`);
    } else {
      throw new Error(`Job no encontrado: ${jobName}`);
    }
  }
}
