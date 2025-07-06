import { FlightBot } from '@/bot';
import { ScheduleManager } from '@/services';
import { validateConfig } from '@/config';
import { db } from '@/database';
import logger, { botLogger } from '@/utils/logger';

/**
 * Clase principal de la aplicación
 */
class FlightBotApp {
  private bot: FlightBot | null = null;
  private scheduleManager: ScheduleManager | null = null;
  private isShuttingDown = false;

  /**
   * Inicializar la aplicación
   */
  async initialize(): Promise<void> {
    try {
      botLogger.info('🚀 Iniciando Flight Bot...');

      // Validar configuración
      validateConfig();
      botLogger.info('✅ Configuración validada');

      // Inicializar base de datos
      const dbStats = db.getStats();
      botLogger.info('✅ Base de datos conectada', dbStats);

      // Inicializar bot de Telegram
      this.bot = new FlightBot();
      const botInfo = await this.bot.getBotInfo();
      botLogger.info(`✅ Bot de Telegram inicializado: @${botInfo.username}`);

      // Inicializar schedule manager
      this.scheduleManager = new ScheduleManager(this.bot);
      this.scheduleManager.start();
      botLogger.info('✅ Schedule Manager iniciado');

      // Configurar manejo de señales para cierre graceful
      this.setupGracefulShutdown();

      botLogger.info('🎉 Flight Bot iniciado exitosamente');

    } catch (error) {
      botLogger.error('❌ Error inicializando aplicación', error as Error);
      process.exit(1);
    }
  }

  /**
   * Iniciar el bot
   */
  async start(): Promise<void> {
    if (!this.bot) {
      throw new Error('Bot no inicializado');
    }

    try {
      // Iniciar polling del bot
      this.bot.startPolling();
      botLogger.info('📡 Bot polling iniciado');

      // Enviar notificación de inicio al admin
      await this.bot.sendAdminMessage('🚀 *Flight Bot iniciado*\n\nEl sistema está operativo y monitoreando precios.');

      // Mostrar información de estado
      this.logStatus();

    } catch (error) {
      botLogger.error('❌ Error iniciando bot', error as Error);
      throw error;
    }
  }

  /**
   * Detener la aplicación gracefully
   */
  async stop(): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    botLogger.info('🛑 Iniciando cierre de aplicación...');

    try {
      // Detener schedule manager
      if (this.scheduleManager) {
        this.scheduleManager.stop();
        botLogger.info('✅ Schedule Manager detenido');
      }

      // Detener bot
      if (this.bot) {
        this.bot.stopPolling();
        await this.bot.sendAdminMessage('⏹️ *Flight Bot detenido*\n\nEl sistema se ha desconectado.');
        this.bot.close();
        botLogger.info('✅ Bot detenido');
      }

      // Cerrar base de datos
      db.close();
      botLogger.info('✅ Base de datos cerrada');

      botLogger.info('✅ Aplicación cerrada exitosamente');

    } catch (error) {
      botLogger.error('❌ Error cerrando aplicación', error as Error);
    }
  }

  /**
   * Configurar cierre graceful
   */
  private setupGracefulShutdown(): void {
    const shutdownHandler = async (signal: string): Promise<void> => {
      botLogger.info(`📨 Señal recibida: ${signal}`);
      await this.stop();
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
    process.on('SIGINT', () => shutdownHandler('SIGINT'));

    process.on('uncaughtException', (error) => {
      botLogger.error('💥 Excepción no capturada', error);
      this.stop().then(() => process.exit(1));
    });

    process.on('unhandledRejection', (reason, promise) => {
      // Loguear pero no terminar la aplicación por promesas rechazadas
      // especialmente para errores de Telegram que son comunes
      const errorMessage = (reason as any)?.message || reason;
      
      if (typeof errorMessage === 'string' && 
          (errorMessage.includes('query is too old') || 
           errorMessage.includes('chat not found') ||
           errorMessage.includes('Bad Request'))) {
        // Errores de Telegram comunes - solo debug
        botLogger.debug('Promise rechazada (error común de Telegram)', { 
          reason: errorMessage, 
          promise 
        });
      } else {
        // Otros errores - warning pero sin terminar aplicación
        botLogger.warn('Promise rechazada no manejada', { 
          reason: errorMessage, 
          promise 
        });
      }
    });
  }

  /**
   * Log del estado actual
   */
  private logStatus(): void {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();

    botLogger.info('📊 Estado de la aplicación', {
      uptime: `${Math.floor(uptime / 60)} minutos`,
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      },
      node: process.version,
      env: process.env['NODE_ENV'] || 'development',
    });
  }

  /**
   * Obtener instancia del bot
   */
  getBot(): FlightBot | null {
    return this.bot;
  }

  /**
   * Obtener schedule manager
   */
  getScheduleManager(): ScheduleManager | null {
    return this.scheduleManager;
  }
}

/**
 * Función principal
 */
async function main(): Promise<void> {
  const app = new FlightBotApp();

  try {
    await app.initialize();
    await app.start();

    // Mantener el proceso activo
    botLogger.info('🔄 Aplicación en ejecución...');

  } catch (error) {
    logger.error('💥 Error fatal en aplicación', error as Error);
    process.exit(1);
  }
}

// Ejecutar solo si es el archivo principal
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

export { FlightBotApp };
export default main;
