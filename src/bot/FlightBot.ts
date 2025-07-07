import TelegramBot from 'node-telegram-bot-api';
import { config } from '@/config';
import { CommandHandler } from './CommandHandler';
import { MessageFormatter } from './MessageFormatter';
import { botLogger } from '@/utils/logger';
import { RateLimiterMemory } from 'rate-limiter-flexible';
// import { AutomatedAlertSystem } from '@/services/AutomatedAlertSystem'; // Temporalmente deshabilitado

/**
 * Clase principal del bot de Telegram
 */
export class FlightBot {
  private bot: TelegramBot;
  private commandHandler: CommandHandler;
  private rateLimiter: RateLimiterMemory;
  // private automatedAlertSystem: AutomatedAlertSystem; // Temporalmente deshabilitado
  private isPolling = false;

  constructor() {
    // Inicializar bot
    this.bot = new TelegramBot(config.telegram.token, { polling: false });
    
    // Inicializar componentes
    this.commandHandler = new CommandHandler(this.bot);
    
    // Inicializar sistema de alertas automáticas - MIGRADO A PRISMA
    // this.automatedAlertSystem = new AutomatedAlertSystem('./data/alerts.db', this.bot); // Temporalmente deshabilitado
    
    // Configurar rate limiting (sin keyGenerator para simplificar)
    this.rateLimiter = new RateLimiterMemory({
      points: config.rateLimit.maxRequests,
      duration: config.rateLimit.windowMs / 1000, // en segundos
    });

    this.setupEventHandlers();
    botLogger.info('Bot inicializado correctamente');
  }

  /**
   * Configurar manejadores de eventos
   */
  private setupEventHandlers(): void {
    // Manejar mensajes de texto
    this.bot.on('message', async (msg: any) => {
      await this.handleMessage(msg);
    });

    // Manejar comandos
    this.bot.on('text', async (msg: any) => {
      if (msg.text?.startsWith('/')) {
        await this.handleCommand(msg);
      }
    });

    // Manejar callbacks de botones inline
    this.bot.on('callback_query', async (query: any) => {
      await this.handleCallbackQuery(query);
    });

    // Manejar errores de polling
    this.bot.on('polling_error', (error: any) => {
      botLogger.error('Error en polling', error);
    });

    // Manejar errores del webhook
    this.bot.on('webhook_error', (error: any) => {
      botLogger.error('Error en webhook', error);
    });

    // Logging de mensajes enviados exitosamente
    this.bot.on('sent', (message: any, data: any) => {
      botLogger.debug('Mensaje enviado exitosamente', { 
        chatId: data.chat_id, 
        messageId: message.message_id 
      });
    });
  }

  /**
   * Manejar mensajes entrantes
   */
  private async handleMessage(msg: any): Promise<void> {
    try {
      // Verificar rate limiting
      const userId = msg.from?.id.toString() || 'unknown';
      await this.rateLimiter.consume(userId);

      botLogger.debug('Mensaje recibido', {
        chatId: msg.chat.id,
        userId: msg.from?.id,
        username: msg.from?.username,
        text: msg.text?.substring(0, 100), // Primeros 100 caracteres para logging
      });

      // Si no es un comando, enviar mensaje de ayuda
      if (msg.text && !msg.text.startsWith('/')) {
        await this.sendHelp(msg.chat.id);
      }

    } catch (error) {
      if (error instanceof Error && error.message.includes('Too Many Requests')) {
        await this.sendRateLimitMessage(msg.chat.id);
      } else {
        botLogger.error('Error manejando mensaje', error as Error, { chatId: msg.chat.id });
        await this.sendErrorMessage(msg.chat.id);
      }
    }
  }

  /**
   * Manejar comandos
   */
  private async handleCommand(msg: any): Promise<void> {
    try {
      const userId = msg.from?.id.toString() || 'unknown';
      await this.rateLimiter.consume(userId);

      botLogger.info('Comando recibido', {
        chatId: msg.chat.id,
        userId: msg.from?.id,
        username: msg.from?.username,
        command: msg.text,
      });

      await this.commandHandler.handleCommand(msg);

    } catch (error) {
      if (error instanceof Error && error.message.includes('Too Many Requests')) {
        await this.sendRateLimitMessage(msg.chat.id);
      } else {
        botLogger.error('Error manejando comando', error as Error, { 
          chatId: msg.chat.id, 
          command: msg.text 
        });
        await this.sendErrorMessage(msg.chat.id);
      }
    }
  }

  /**
   * Manejar callbacks de botones inline
   */
  private async handleCallbackQuery(query: any): Promise<void> {
    try {
      const userId = query.from.id.toString();
      await this.rateLimiter.consume(userId);

      botLogger.debug('Callback query recibido', {
        queryId: query.id,
        userId: query.from.id,
        data: query.data,
      });

      await this.commandHandler.handleCallbackQuery(query);

      // Responder al callback para quitar el "loading"
      await this.bot.answerCallbackQuery(query.id);

    } catch (error) {
      if (error instanceof Error && error.message.includes('Too Many Requests')) {
        await this.bot.answerCallbackQuery(query.id, { 
          text: '⚠️ Demasiadas solicitudes. Espera un momento.', 
          show_alert: true 
        });
      } else {
        botLogger.error('Error manejando callback query', error as Error, { 
          queryId: query.id 
        });
        await this.bot.answerCallbackQuery(query.id, { 
          text: '❌ Error procesando solicitud', 
          show_alert: true 
        });
      }
    }
  }

  /**
   * Iniciar polling y sistema de alertas automáticas
   */
  public startPolling(): void {
    if (!this.isPolling) {
      this.bot.startPolling();
      this.isPolling = true;
      
      // Iniciar sistema de alertas automáticas (MIGRADO A PRISMA - usar ScheduleManager)
      // this.automatedAlertSystem.start(config.scraping.intervalMinutes); // Temporalmente deshabilitado
      
      botLogger.info('Bot iniciado: Polling activo (sistema de alertas migrado a ScheduleManager)');
    }
  }

  /**
   * Detener polling y sistema de alertas automáticas
   */
  public stopPolling(): void {
    if (this.isPolling) {
      this.bot.stopPolling();
      // this.automatedAlertSystem.stop(); // Temporalmente deshabilitado - migrado a ScheduleManager
      this.isPolling = false;
      botLogger.info('Bot detenido: Polling detenido (alertas migradas a ScheduleManager)');
    }
  }

  /**
   * Configurar webhook
   */
  public async setWebhook(url: string): Promise<void> {
    try {
      await this.bot.setWebHook(url);
      botLogger.info(`Webhook configurado: ${url}`);
    } catch (error) {
      botLogger.error('Error configurando webhook', error as Error);
      throw error;
    }
  }

  /**
   * Eliminar webhook
   */
  public async deleteWebhook(): Promise<void> {
    try {
      await this.bot.deleteWebHook();
      botLogger.info('Webhook eliminado');
    } catch (error) {
      botLogger.error('Error eliminando webhook', error as Error);
      throw error;
    }
  }

  /**
   * Enviar mensaje de ayuda
   */
  private async sendHelp(chatId: number): Promise<void> {
    const helpMessage = MessageFormatter.formatHelpMessage();
    await this.bot.sendMessage(chatId, helpMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🆘 Comandos', callback_data: 'help_commands' },
            { text: '📖 Guía', callback_data: 'help_guide' },
          ],
        ],
      },
    });
  }

  /**
   * Enviar mensaje de rate limit
   */
  private async sendRateLimitMessage(chatId: number): Promise<void> {
    const message = MessageFormatter.formatRateLimitMessage();
    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  /**
   * Enviar mensaje de error
   */
  private async sendErrorMessage(chatId: number): Promise<void> {
    const message = MessageFormatter.formatErrorMessage();
    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  /**
   * Enviar notificación de alerta
   */
  public async sendAlertNotification(
    chatId: number, 
    alertData: any
  ): Promise<any> {
    try {
      const message = MessageFormatter.formatAlertNotification(alertData);
      
      const sentMessage = await this.bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔗 Ver Vuelo', url: alertData.bookingUrl },
              { text: '⏸️ Pausar Alerta', callback_data: `pause_alert_${alertData.alertId}` },
            ],
          ],
        },
      });

      botLogger.info('Notificación de alerta enviada', {
        chatId,
        alertId: alertData.alertId,
        messageId: sentMessage.message_id,
      });

      return sentMessage;
    } catch (error) {
      botLogger.error('Error enviando notificación de alerta', error as Error, { chatId });
      throw error;
    }
  }

  /**
   * Enviar mensaje a administrador (completamente opcional y silencioso)
   */
  public async sendAdminMessage(message: string): Promise<void> {
    // Solo intentar enviar si adminChatId está configurado y es válido
    if (config.telegram.adminChatId && !isNaN(config.telegram.adminChatId)) {
      try {
        await this.bot.sendMessage(config.telegram.adminChatId, message, {
          parse_mode: 'Markdown',
        });
      } catch (error: any) {
        // Solo loguear errores admin en debug para no llenar los logs
        if (error.message?.includes('chat not found') || 
            error.message?.includes('Bad Request')) {
          botLogger.debug('Admin chat no disponible (configuración opcional)', { 
            adminChatId: config.telegram.adminChatId,
            error: error.message 
          });
        } else {
          botLogger.warn('Error enviando mensaje a administrador', { 
            error: error.message 
          });
        }
      }
    }
  }

  /**
   * Obtener información del bot
   */
  public async getBotInfo(): Promise<any> {
    return await this.bot.getMe();
  }

  /**
   * Obtener instancia del bot para operaciones avanzadas
   */
  public getBotInstance(): any {
    return this.bot;
  }

  /**
   * Cerrar bot
   */
  public close(): void {
    this.stopPolling();
    botLogger.info('Bot cerrado');
  }
}
