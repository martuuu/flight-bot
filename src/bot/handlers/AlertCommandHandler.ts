import { AlertModel } from '@/models';
import { config } from '@/config';
import { botLogger } from '@/utils/logger';
import { MessageFormatter } from '../MessageFormatter';
import { ValidationUtils } from '../utils/ValidationUtils';
import { AirlineUtils, AirlineType } from '../utils/AirlineUtils';
import { AlertManagerCompatAdapter, UserModelCompatAdapter } from '@/services/AlertManagerCompatAdapter';
import { ArajetPassenger } from '@/types/arajet-api';

/**
 * Manejador de comandos de alertas generales
 * Delega a manejadores específicos según la aerolínea
 */
export class AlertCommandHandler {
  private bot: any;
  private alertManager: AlertManagerCompatAdapter;

  constructor(bot: any) {
    this.bot = bot;
    this.alertManager = new AlertManagerCompatAdapter(process.env['DATABASE_PATH'] || './data/flights.db');
  }

  /**
   * Comando /alert y /alertas - Crear nueva alerta básica (legacy)
   */
  async handleCreateAlert(chatId: number, userId: number, args: string[]): Promise<void> {
    if (args.length < 3) {
      const usageMessage = MessageFormatter.formatAlertUsageMessage();
      await this.bot.sendMessage(chatId, usageMessage, { parse_mode: 'Markdown' });
      return;
    }

    const [origin, destination, maxPriceStr] = args;
    
    // Validaciones básicas
    const validationResult = this.validateBasicAlertArgs(origin, destination, maxPriceStr);
    if (!validationResult.isValid) {
      await this.bot.sendMessage(chatId, `❌ ${validationResult.error}`);
      return;
    }

    try {
      const user = UserModelCompatAdapter.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      // Verificar límite de alertas
      const alertCount = AlertModel.countActiveByUserId(user.id);
      if (alertCount >= config.alerts.maxAlertsPerUser) {
        await this.bot.sendMessage(
          chatId,
          `❌ Has alcanzado el límite de ${config.alerts.maxAlertsPerUser} alertas activas.`
        );
        return;
      }

      // Verificar alerta duplicada
      const duplicate = AlertModel.findDuplicate(user.id, validationResult.origin!, validationResult.destination!);
      if (duplicate) {
        await this.bot.sendMessage(
          chatId,
          `❌ Ya tienes una alerta activa para la ruta ${validationResult.origin}-${validationResult.destination}.`
        );
        return;
      }

      // Crear alerta legacy (Arajet por defecto)
      const alert = AlertModel.create(user.id, validationResult.origin!, validationResult.destination!, validationResult.maxPrice!);

      const successMessage = MessageFormatter.formatAlertCreatedMessage(alert);
      
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

      botLogger.info('Alerta legacy creada', { 
        userId, 
        alertId: alert.id, 
        route: `${validationResult.origin}-${validationResult.destination}` 
      });

    } catch (error) {
      botLogger.error('Error creando alerta legacy', error as Error, { 
        userId, 
        origin: validationResult.origin, 
        destination: validationResult.destination 
      });
      await this.bot.sendMessage(chatId, '❌ Error creando la alerta. Inténtalo de nuevo.');
    }
  }

  /**
   * Comando /addalert y /agregaralerta - Crear nueva alerta con sintaxis unificada
   */
  async handleUnifiedAlert(chatId: number, userId: number, args: string[]): Promise<void> {
    if (args.length < 2) {
      const usageMessage = this.formatUnifiedAlertUsage();
      await this.bot.sendMessage(chatId, usageMessage, { parse_mode: 'Markdown' });
      return;
    }

    try {
      const parsedArgs = this.parseUnifiedAlertArgs(args);
      
      if (!parsedArgs.isValid) {
        await this.bot.sendMessage(chatId, `❌ ${parsedArgs.error}`);
        return;
      }

      // Validaciones básicas
      const validationResult = this.validateBasicAlertArgs(
        parsedArgs.origin, 
        parsedArgs.destination, 
        parsedArgs.maxPrice?.toString() || ''
      );
      
      if (!validationResult.isValid) {
        await this.bot.sendMessage(chatId, `❌ ${validationResult.error}`);
        return;
      }

      // Determinar si es alerta mensual o diaria
      if (parsedArgs.isMonthly) {
        await this.createMonthlyAlert(
          chatId, 
          userId, 
          parsedArgs.origin, 
          parsedArgs.destination, 
          parsedArgs.maxPrice, 
          parsedArgs.date, 
          parsedArgs.trackBestOnly
        );
      } else {
        await this.createDailyAlert(
          chatId, 
          userId, 
          parsedArgs.origin, 
          parsedArgs.destination, 
          parsedArgs.maxPrice, 
          parsedArgs.date, 
          parsedArgs.trackBestOnly
        );
      }

    } catch (error) {
      botLogger.error('Error creando alerta unificada', error as Error, { userId, args });
      await this.bot.sendMessage(chatId, '❌ Error creando la alerta. Inténtalo de nuevo.');
    }
  }

  /**
   * Comando /myalerts y /misalertas
   */
  async handleMyAlerts(chatId: number, userId: number): Promise<void> {
    try {
      const user = UserModelCompatAdapter.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      // Obtener alertas del sistema viejo (AlertModel)
      const legacyAlerts = AlertModel.findActiveByUserId(user.id);
      
      // Obtener alertas del sistema nuevo (AlertManager)
      const newAlerts = this.alertManager.getUserAlerts(user.id);

      // Crear un array combinado con formato uniforme para mostrar
      const displayAlerts = [
        ...legacyAlerts.map(alert => ({
          id: alert.id,
          originalId: alert.id.toString(),
          origin: alert.origin,
          destination: alert.destination,
          maxPrice: alert.maxPrice,
          type: 'legacy' as const,
          searchMonth: null as string | null,
          airline: AirlineType.ARAJET
        })),
        ...newAlerts.map(alert => ({
          id: parseInt(alert.id),
          originalId: alert.id,
          origin: alert.fromAirport,
          destination: alert.toAirport,
          maxPrice: alert.maxPrice,
          type: 'monthly' as const,
          searchMonth: alert.searchMonth,
          airline: AirlineType.ARAJET
        }))
      ];

      if (displayAlerts.length === 0) {
        await this.bot.sendMessage(
          chatId,
          '📋 No tienes alertas activas.\n\nUsa /addalert para crear tu primera alerta.',
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '✈️ Crear Alerta', callback_data: 'help_alert' }],
              ],
            },
          }
        );
        return;
      }

      // Formatear mensaje de alertas
      let alertsMessage = '📋 *Tus Alertas Activas:*\n\n';
      
      displayAlerts.forEach((alert, index) => {
        const airlineEmoji = AirlineUtils.getAirlineEmoji(alert.airline);
        const airlineInfo = AirlineUtils.getAirlineInfo(alert.airline);
        
        alertsMessage += `${index + 1}. ${airlineEmoji} *${alert.origin} → ${alert.destination}*\n`;
        alertsMessage += `   💰 Precio máximo: $${alert.maxPrice}\n`;
        alertsMessage += `   🛩️ Aerolínea: ${airlineInfo.displayName}\n`;
        
        if (alert.searchMonth) {
          alertsMessage += `   📅 Mes: ${alert.searchMonth}\n`;
        }
        
        alertsMessage += `   🆔 ID: \`${alert.originalId}\`\n\n`;
      });

      alertsMessage += `💡 Usa \`/cancelar <ID>\` para desactivar una alerta específica.`;
      
      // Crear botones para cada alerta
      const keyboard = displayAlerts.map(alert => [
        { 
          text: `⏸️ ${alert.origin}-${alert.destination}`, 
          callback_data: `pause_alert_${alert.originalId}` 
        },
        { 
          text: '🔍 Chequear', 
          callback_data: `check_alert_${alert.originalId}` 
        }
      ]);

      keyboard.push([{ text: '🗑️ Eliminar Todas', callback_data: 'clear_all_alerts' }]);

      await this.bot.sendMessage(chatId, alertsMessage, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: keyboard },
      });

    } catch (error) {
      botLogger.error('Error obteniendo alertas de usuario', error as Error, { userId });
      await this.bot.sendMessage(chatId, '❌ Error obteniendo tus alertas.');
    }
  }

  /**
   * Comando /stop y /cancelar
   */
  async handleStopAlert(chatId: number, userId: number, args: string[]): Promise<void> {
    if (args.length === 0) {
      await this.bot.sendMessage(
        chatId,
        '❌ Debes especificar el ID de la alerta.\n\nUsa /misalertas para ver tus alertas activas.'
      );
      return;
    }

    const alertIdStr = args[0];
    const alertIdNum = parseInt(alertIdStr);

    try {
      const user = UserModelCompatAdapter.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      let alertFound = false;
      let alertInfo = '';

      // Intentar primero con alertas legacy (ID numérico)
      if (!isNaN(alertIdNum)) {
        const alert = AlertModel.findById(alertIdNum);
        if (alert && alert.userId === user.id && alert.active) {
          AlertModel.deactivate(alertIdNum);
          alertInfo = `${alert.origin}-${alert.destination}`;
          alertFound = true;
        }
      }

      // Si no se encontró, intentar con alertas mensuales (ID string/UUID)
      if (!alertFound) {
        const success = this.alertManager.deactivateAlert(alertIdStr, user.id);
        if (success) {
          alertInfo = alertIdStr;
          alertFound = true;
        }
      }

      if (alertFound) {
        await this.bot.sendMessage(
          chatId,
          `✅ Alerta ${alertInfo} desactivada correctamente.`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '📋 Ver Mis Alertas', callback_data: 'my_alerts' }],
              ],
            },
          }
        );
      } else {
        await this.bot.sendMessage(
          chatId,
          '❌ Alerta no encontrada o no tienes permisos para desactivarla.'
        );
      }

    } catch (error) {
      botLogger.error('Error desactivando alerta', error as Error, { userId, alertId: alertIdStr });
      await this.bot.sendMessage(chatId, '❌ Error desactivando la alerta.');
    }
  }

  /**
   * Comando /clearall
   */
  async handleClearAll(chatId: number, userId: number): Promise<void> {
    try {
      const user = UserModelCompatAdapter.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      // Desactivar alertas del sistema legacy
      const legacyDeactivatedCount = AlertModel.deactivateAllByUserId(user.id);
      
      // Desactivar alertas del nuevo sistema (mensuales)
      const newAlerts = this.alertManager.getUserAlerts(user.id);
      let monthlyDeactivatedCount = 0;
      
      for (const alert of newAlerts) {
        const success = this.alertManager.deactivateAlert(alert.id, user.id);
        if (success) monthlyDeactivatedCount++;
      }
      
      const totalDeactivated = legacyDeactivatedCount + monthlyDeactivatedCount;
      
      if (totalDeactivated > 0) {
        await this.bot.sendMessage(
          chatId,
          `✅ Se desactivaron ${totalDeactivated} alertas correctamente.`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '✈️ Crear Nueva Alerta', callback_data: 'help_alert' }],
              ],
            },
          }
        );
      } else {
        await this.bot.sendMessage(chatId, '📋 No tienes alertas activas para desactivar.');
      }

    } catch (error) {
      botLogger.error('Error desactivando todas las alertas', error as Error, { userId });
      await this.bot.sendMessage(chatId, '❌ Error desactivando las alertas.');
    }
  }

  // === MÉTODOS PRIVADOS ===

  /**
   * Validar argumentos básicos de alerta
   */
  private validateBasicAlertArgs(origin: string, destination: string, maxPriceStr: string) {
    const originCode = origin.toUpperCase();
    const destinationCode = destination.toUpperCase();

    if (!ValidationUtils.isValidAirport(originCode)) {
      return { isValid: false, error: `Código de aeropuerto de origen inválido: ${originCode}` };
    }

    if (!ValidationUtils.isValidAirport(destinationCode)) {
      return { isValid: false, error: `Código de aeropuerto de destino inválido: ${destinationCode}` };
    }

    if (!ValidationUtils.areAirportsDifferent(originCode, destinationCode)) {
      return { isValid: false, error: 'El origen y destino no pueden ser iguales' };
    }

    const priceValidation = ValidationUtils.isValidPrice(maxPriceStr);
    if (!priceValidation.isValid) {
      return { isValid: false, error: priceValidation.error };
    }

    return {
      isValid: true,
      origin: originCode,
      destination: destinationCode,
      maxPrice: priceValidation.price
    };
  }

  /**
   * Parsear argumentos de comando unificado
   */
  private parseUnifiedAlertArgs(args: string[]): {
    isValid: boolean;
    error?: string;
    origin: string;
    destination: string;
    maxPrice: number | null;
    date: string | null;
    isMonthly: boolean;
    trackBestOnly: boolean;
  } {
    const result = {
      isValid: false,
      origin: '',
      destination: '',
      maxPrice: null as number | null,
      date: null as string | null,
      isMonthly: false,
      trackBestOnly: false,
      error: ''
    };

    if (args.length < 2) {
      result.error = 'Se requieren al menos origen y destino';
      return result;
    }

    // Extraer origen y destino
    result.origin = args[0].toUpperCase();
    result.destination = args[1].toUpperCase();

    // Procesar argumentos opcionales
    for (let i = 2; i < args.length; i++) {
      const arg = args[i];
      
      if (arg === '-') {
        // Indicador de "solo mejores precios"
        result.trackBestOnly = true;
      } else if (ValidationUtils.isDateFormat(arg)) {
        result.date = arg;
        result.isMonthly = ValidationUtils.isMonthlyDate(arg);
      } else if (!isNaN(parseFloat(arg))) {
        result.maxPrice = parseFloat(arg);
      }
    }

    // Si no se especificó precio ni "-", establecer precio por defecto
    if (result.maxPrice === null && !result.trackBestOnly) {
      result.maxPrice = 500; // Precio por defecto
    }

    result.isValid = true;
    return result;
  }

  /**
   * Crear alerta diaria
   */
  private async createDailyAlert(
    chatId: number, 
    userId: number, 
    origin: string, 
    destination: string, 
    maxPrice: number | null, 
    _date: string | null, 
    trackBestOnly: boolean
  ): Promise<void> {
    // Por ahora, crear como alerta legacy
    if (!maxPrice && !trackBestOnly) {
      maxPrice = 500; // Precio por defecto
    }

    const user = UserModelCompatAdapter.findByTelegramId(userId);
    if (!user) {
      await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
      return;
    }

    const alert = AlertModel.create(user.id, origin, destination, maxPrice || 999999);
    
    const successMessage = MessageFormatter.formatAlertCreatedMessage(alert);
    
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

    botLogger.info('Alerta diaria creada', { userId, alertId: alert.id, route: `${origin}-${destination}` });
  }

  /**
   * Crear alerta mensual
   */
  private async createMonthlyAlert(
    chatId: number, 
    userId: number, 
    origin: string, 
    destination: string, 
    maxPrice: number | null, 
    date: string | null, 
    trackBestOnly: boolean
  ): Promise<void> {
    const user = UserModelCompatAdapter.findByTelegramId(userId);
    if (!user) {
      await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
      return;
    }

    // Usar fecha proporcionada o mes actual
    const searchMonth = date || (() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    })();

    // Crear alerta mensual usando AlertManager
    const defaultPassengers: ArajetPassenger[] = [
      { code: 'ADT', count: 1 }
    ];
    
    const alert = this.alertManager.createAlert(
      user.id,
      chatId,
      origin,
      destination,
      maxPrice || 999999,
      defaultPassengers,
      searchMonth
    );

    const successMessage = MessageFormatter.formatMonthlyAlertCreatedMessage(alert, trackBestOnly);
    
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

    botLogger.info('Alerta mensual creada', { userId, alertId: alert.id, route: `${origin}-${destination}` });
  }

  /**
   * Formatear mensaje de uso para alerta unificada
   */
  private formatUnifiedAlertUsage(): string {
    return `📝 *Uso del comando /addalert:*

*Sintaxis básica:*
\`/addalert ORIGEN DESTINO [PRECIO] [FECHA]\`

*Ejemplos:*
• \`/addalert STI PUJ\` - Alerta básica (precio: $500)
• \`/addalert STI PUJ 210\` - Con precio máximo
• \`/addalert STI PUJ 210 2026-02\` - Alerta mensual
• \`/addalert STI PUJ - 2026-02\` - Solo mejores precios del mes

*Parámetros:*
• **ORIGEN/DESTINO**: Códigos de aeropuerto (ej: STI, PUJ, MIA)
• **PRECIO**: Precio máximo en USD (opcional, defecto: $500)
• **FECHA**: YYYY-MM (mensual) o YYYY-MM-DD (específico)
• **-**: Usar en lugar del precio para rastrear solo mejores ofertas

*Consejos:*
• Las alertas mensuales buscan en todo el mes
• Usa \`/misalertas\` para ver todas tus alertas`;
  }
}
