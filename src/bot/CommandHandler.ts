import { UserModelPrisma } from '@/models';
import { botLogger } from '@/utils/logger';
import { BasicCommandHandler } from './handlers/BasicCommandHandler';
import { AlertCommandHandler } from './handlers/AlertCommandHandler';
import { CallbackHandler } from './handlers/CallbackHandler';
import { ArajetCommandHandler } from './handlers/airlines/ArajetCommandHandler';
import { AerolineasCommandHandler } from './handlers/airlines/AerolineasCommandHandler';
import { AirlineUtils } from './utils/AirlineUtils';

/**
 * Manejador principal de comandos del bot
 * Delega a manejadores específicos según el tipo de comando
 */
export class CommandHandler {
  private bot: any;
  private basicHandler: BasicCommandHandler;
  private alertHandler: AlertCommandHandler;
  private callbackHandler: CallbackHandler;
  private arajetHandler: ArajetCommandHandler;
  private aerolineasHandler: AerolineasCommandHandler;

  constructor(bot: any) {
    this.bot = bot;
    this.basicHandler = new BasicCommandHandler(bot);
    this.alertHandler = new AlertCommandHandler(bot);
    this.callbackHandler = new CallbackHandler(bot);
    this.arajetHandler = new ArajetCommandHandler(bot);
    this.aerolineasHandler = new AerolineasCommandHandler(bot);
  }

  /**
   * Procesar y ejecutar comando
   */
  async handleCommand(msg: any): Promise<void> {
    if (!msg.text) return;

    const chatId = msg.chat.id;
    const command = msg.text.split(' ')[0].toLowerCase();
    const args = msg.text.split(' ').slice(1);

    // Crear usuario para todos los comandos
    if (msg.from) {
      try {
        await UserModelPrisma.findOrCreate(
          msg.from.id,
          msg.from.username,
          msg.from.first_name,
          msg.from.last_name
        );
      } catch (error) {
        botLogger.error('Error creando/actualizando usuario', error as Error);
      }
    }

    try {
      // Detectar aerolínea específica del comando
      const airlineType = AirlineUtils.detectAirlineFromCommand(command);
      
      botLogger.info('Comando recibido', { 
        command, 
        userId: msg.from?.id, 
        chatId,
        detectedAirline: airlineType 
      });

      switch (command) {
        // === COMANDOS BÁSICOS ===
        case '/start':
          await this.basicHandler.handleStart(chatId, msg.from, args);
          break;
        
        case '/help':
          await this.basicHandler.handleHelp(chatId);
          break;

        case '/stats':
          await this.basicHandler.handleStats(chatId);
          break;

        case '/link':
          await this.basicHandler.handleLink(chatId, msg.from, args);
          break;

        case '/search':
        case '/buscar':
          await this.basicHandler.handleSearch(chatId, args);
          break;

        // === COMANDOS DE ALERTAS GENERALES ===
        case '/alert':
        case '/alertas':
          await this.alertHandler.handleCreateAlert(chatId, msg.from?.id, args);
          break;

        case '/addalert':
        case '/agregaralerta':
          await this.alertHandler.handleUnifiedAlert(chatId, msg.from?.id, args);
          break;

        case '/myalerts':
        case '/misalertas':
          await this.alertHandler.handleMyAlerts(chatId, msg.from?.id);
          break;

        case '/stop':
        case '/cancelar':
          await this.alertHandler.handleStopAlert(chatId, msg.from?.id, args);
          break;

        case '/clearall':
          await this.alertHandler.handleClearAll(chatId, msg.from?.id);
          break;

        // === COMANDOS ESPECÍFICOS DE ARAJET ===
        case '/monthlyalert':
          await this.arajetHandler.handleMonthlyAlert(chatId, msg.from?.id, args);
          break;

        // === COMANDOS ESPECÍFICOS DE AEROLÍNEAS ARGENTINAS ===
        case '/millas-ar':
        case '/millasaerolineas':
          await this.aerolineasHandler.handleAerolineasMilesAlert(chatId, msg.from?.id, args);
          break;

        case '/millas-ar-search':
        case '/buscar-millas-ar':
          await this.aerolineasHandler.handleAerolineasMilesSearch(chatId, args);
          break;

        case '/millas-ar-myalerts':
        case '/mis-alertas-millas-ar':
          await this.aerolineasHandler.handleMyAerolineasAlerts(chatId, msg.from?.id);
          break;

        case '/test-aerolineas':
          await this.aerolineasHandler.handleTestAerolineas(chatId);
          break;

        // === COMANDOS DE AYUDA ESPECÍFICOS ===
        case '/commands':
        case '/comandos':
          await this.basicHandler.handleCommandsList(chatId);
          break;

        case '/guide':
        case '/guia':
          await this.basicHandler.handleUserGuide(chatId);
          break;

        default:
          await this.basicHandler.handleUnknownCommand(chatId);
      }
    } catch (error) {
      botLogger.error('Error ejecutando comando', error as Error, { 
        command, 
        chatId, 
        userId: msg.from?.id 
      });
      
      await this.bot.sendMessage(chatId, '❌ Error ejecutando el comando. Inténtalo de nuevo.');
    }
  }

  /**
   * Manejar botones (callback queries)
   */
  async handleCallbackQuery(callbackQuery: any): Promise<void> {
    await this.callbackHandler.handleCallbackQuery(callbackQuery);
  }

  /**
   * Obtener estadísticas del bot
   */
  getHandlerStats() {
    return {
      handlersLoaded: {
        basic: !!this.basicHandler,
        alert: !!this.alertHandler,
        callback: !!this.callbackHandler,
        arajet: !!this.arajetHandler,
        aerolineas: !!this.aerolineasHandler
      },
      activeAirlines: AirlineUtils.getActiveAirlines().length,
      monthlyAlertAirlines: AirlineUtils.getMonthlyAlertAirlines().length,
      milesAlertAirlines: AirlineUtils.getMilesAlertAirlines().length
    };
  }

  /**
   * Obtener información de comandos disponibles
   */
  getAvailableCommands() {
    const activeAirlines = AirlineUtils.getActiveAirlines();
    const monthlyAirlines = AirlineUtils.getMonthlyAlertAirlines();
    const milesAirlines = AirlineUtils.getMilesAlertAirlines();

    return {
      basic: [
        { command: '/start', description: 'Iniciar el bot' },
        { command: '/help', description: 'Ver ayuda' },
        { command: '/stats', description: 'Estadísticas (admin)' },
        { command: '/search', description: 'Buscar vuelos' }
      ],
      alerts: [
        { command: '/addalert', description: 'Crear alerta avanzada' },
        { command: '/alertas', description: 'Crear alerta básica' },
        { command: '/misalertas', description: 'Ver mis alertas' },
        { command: '/cancelar', description: 'Cancelar alerta' },
        { command: '/clearall', description: 'Eliminar todas las alertas' }
      ],
      arajet: monthlyAirlines.length > 0 ? [
        { command: '/monthlyalert', description: 'Crear alerta mensual Arajet' }
      ] : [],
      aerolineas: milesAirlines.length > 0 ? [
        { command: '/millas-ar', description: 'Crear alerta de millas' },
        { command: '/millas-ar-search', description: 'Buscar millas inmediato' },
        { command: '/mis-alertas-millas-ar', description: 'Ver alertas de millas' }
      ] : [],
      airlines: activeAirlines.map(airline => ({
        name: airline.displayName,
        code: airline.code,
        emoji: AirlineUtils.getAirlineEmoji(airline.code),
        features: {
          monthly: airline.supportsMonthlyAlerts,
          miles: airline.supportsMilesAlerts
        }
      }))
    };
  }

  /**
   * Limpiar recursos si es necesario
   */
  cleanup() {
    // Implementar limpieza de recursos si es necesario
    botLogger.info('CommandHandler cleanup completed');
  }
}
