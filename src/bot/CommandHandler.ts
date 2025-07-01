import { UserModel, AlertModel } from '@/models';
import { airports, config } from '@/config';
import { botLogger } from '@/utils/logger';
import { MessageFormatter } from './MessageFormatter';
import { AlertManager } from '@/services/AlertManager';
import { ArajetPassenger } from '@/types/arajet-api';

/**
 * Manejador de comandos del bot
 */
export class CommandHandler {
  private bot: any;
  private alertManager: AlertManager;

  constructor(bot: any) {
    this.bot = bot;
    this.alertManager = new AlertManager('./data/alerts.db');
  }

  /**
   * Procesar y ejecutar comando
   */
  async handleCommand(msg: any): Promise<void> {
    if (!msg.text) return;

    const chatId = msg.chat.id;
    const command = msg.text.split(' ')[0].toLowerCase();
    const args = msg.text.split(' ').slice  (1);

    // Actualizar actividad del usuario
    if (msg.from) {
      UserModel.findOrCreate(
        msg.from.id,
        msg.from.username,
        msg.from.first_name,
        msg.from.last_name
      );
    }

    try {
      switch (command) {
        case '/start':
          await this.handleStart(chatId, msg.from);
          break;
        case '/help':
          await this.handleHelp(chatId);
          break;
        case '/alert':
        case '/alertas':
          await this.handleCreateAlert(chatId, msg.from?.id, args);
          break;
        case '/myalerts':
        case '/misalertas':
          await this.handleMyAlerts(chatId, msg.from?.id);
          break;
        case '/stop':
        case '/cancelar':
          await this.handleStopAlert(chatId, msg.from?.id, args);
          break;
        case '/clearall':
          await this.handleClearAll(chatId, msg.from?.id);
          break;
        case '/search':
        case '/buscar':
          await this.handleSearch(chatId, args);
          break;
        case '/stats':
          await this.handleStats(chatId);
          break;
        case '/monthlyalert':
          await this.handleMonthlyAlert(chatId, msg.from?.id, args);
          break;
        default:
          await this.handleUnknownCommand(chatId);
      }
    } catch (error) {
      botLogger.error('Error ejecutando comando', error as Error, { command, chatId });
      await this.bot.sendMessage(chatId, MessageFormatter.formatErrorMessage());
    }
  }

  /**
   * Manejar botones (callback queries)
   */
  async handleCallbackQuery(callbackQuery: any): Promise<void> {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const userId = callbackQuery.from.id;

    try {
      // Intentar responder al callback query de manera silenciosa
      try {
        await this.bot.answerCallbackQuery(callbackQuery.id);
      } catch (callbackError: any) {
        // Si el callback es muy antiguo o inválido, solo loguearlo en debug
        if (callbackError.message?.includes('query is too old') || 
            callbackError.message?.includes('query ID is invalid') ||
            callbackError.message?.includes('Bad Request')) {
          botLogger.debug('Callback query antiguo/inválido ignorado', { 
            queryId: callbackQuery.id, 
            data: data,
            userId: userId,
            error: callbackError.message
          });
          // Continuar procesando el comando aunque el callback haya expirado
        } else {
          // Para otros errores, loguear como warning pero continuar
          botLogger.warn('Error en callback query', {
            queryId: callbackQuery.id,
            data: data,
            userId: userId,
            error: callbackError.message || callbackError
          });
        }
      }

      // Manejar callbacks de alertas específicas
      if (data.startsWith('pause_alert_')) {
        const alertIdStr = data.replace('pause_alert_', '');
        const alertIdNum = parseInt(alertIdStr);
        // Intentar como número primero, si falla usar como string
        const alertId = isNaN(alertIdNum) ? alertIdStr : alertIdNum;
        await this.handlePauseAlert(chatId, userId, alertId);
        return;
      }

      if (data.startsWith('check_alert_')) {
        const alertId = data.replace('check_alert_', '');
        await this.handleCheckAlertNow(chatId, userId, alertId);
        return;
      }

      // Callbacks generales
      switch (data) {
        case 'help_alert':
          const alertHelp = MessageFormatter.formatAlertUsageMessage();
          await this.bot.sendMessage(chatId, alertHelp, { parse_mode: 'Markdown' });
          break;
        
        case 'my_alerts':
          await this.handleMyAlerts(chatId, userId);
          break;
        
        case 'help_search':
          const searchHelp = `📍 *Comando /buscar*

*Uso:* \`/buscar ORIGEN DESTINO DD/MM/YYYY [adultos] [niños] [bebes]\`

*Ejemplos:*
• \`/buscar EZE JFK 15/01/2025\`
• \`/buscar BOG MIA 20/02/2025 2 1 0\`

Te mostraré todos los vuelos disponibles en esa fecha.`;
          await this.bot.sendMessage(chatId, searchHelp, { parse_mode: 'Markdown' });
          break;
        
        case 'help_monthly':
          const monthlyHelp = MessageFormatter.formatMonthlyAlertUsageMessage();
          await this.bot.sendMessage(chatId, monthlyHelp, { parse_mode: 'Markdown' });
          break;

        case 'help_commands':
          await this.handleCommandsList(chatId);
          break;

        case 'help_guide':
          await this.handleUserGuide(chatId);
          break;

        case 'clear_all_alerts':
          await this.handleClearAll(chatId, userId);
          break;
        
        default:
          await this.bot.sendMessage(chatId, '❌ Acción no reconocida.');
      }
    } catch (error) {
      botLogger.error('Error procesando callback query', error as Error, { data, userId });
      await this.bot.sendMessage(chatId, MessageFormatter.formatErrorMessage());
    }
  }

  /**
   * Comando /start
   */
  private async handleStart(chatId: number, user: any): Promise<void> {
    if (user) {
      UserModel.findOrCreate(
        user.id,
        user.username,
        user.first_name,
        user.last_name
      );

      const welcomeMessage = MessageFormatter.formatWelcomeMessage(user.first_name || user.username);
      
      await this.bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✈️ Crear Alerta', callback_data: 'help_alert' },
              { text: '📋 Mis Alertas', callback_data: 'my_alerts' },
            ],
            [
              { text: '🔍 Buscar Vuelos', callback_data: 'help_search' },
              { text: '❓ Ayuda', callback_data: 'help_commands' },
            ],
          ],
        },
      });

      botLogger.info('Usuario registrado/actualizado', { userId: user.id, username: user.username });
    }
  }

  /**
   * Comando /help
   */
  private async handleHelp(chatId: number): Promise<void> {
    const helpMessage = MessageFormatter.formatHelpMessage();
    
    await this.bot.sendMessage(chatId, helpMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📝 Comandos', callback_data: 'help_commands' },
            { text: '📖 Guía', callback_data: 'help_guide' },
          ],
        ],
      },
    });
  }

  /**
   * Comando /alert - Crear nueva alerta
   */
  private async handleCreateAlert(chatId: number, userId: number, args: string[]): Promise<void> {
    if (args.length < 3) {
      const usageMessage = MessageFormatter.formatAlertUsageMessage();
      await this.bot.sendMessage(chatId, usageMessage, { parse_mode: 'Markdown' });
      return;
    }

    const [origin, destination, maxPriceStr] = args;
    const maxPrice = parseFloat(maxPriceStr);

    // Validaciones
    if (isNaN(maxPrice) || maxPrice <= 0) {
      await this.bot.sendMessage(chatId, '❌ El precio debe ser un número válido mayor a 0');
      return;
    }

    // Validar códigos de aeropuerto
    const originCode = origin.toUpperCase();
    const destinationCode = destination.toUpperCase();

    if (!this.isValidAirport(originCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de origen inválido: ${originCode}`);
      return;
    }

    if (!this.isValidAirport(destinationCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de destino inválido: ${destinationCode}`);
      return;
    }

    if (originCode === destinationCode) {
      await this.bot.sendMessage(chatId, '❌ El origen y destino no pueden ser iguales');
      return;
    }

    try {
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      // Verificar límite de alertas
      const alertCount = AlertModel.countActiveByUserId(user.id);
      if (alertCount >= config.alerts.maxAlertsPerUser) {
        await this.bot.sendMessage(
          chatId,
          `❌ Has alcanzado el límite máximo de ${config.alerts.maxAlertsPerUser} alertas activas`
        );
        return;
      }

      // Verificar alerta duplicada
      const duplicate = AlertModel.findDuplicate(user.id, originCode, destinationCode);
      if (duplicate) {
        await this.bot.sendMessage(
          chatId,
          `⚠️ Ya tienes una alerta activa para la ruta ${originCode} → ${destinationCode}`
        );
        return;
      }

      // Crear alerta
      const alert = AlertModel.create(user.id, originCode, destinationCode, maxPrice);

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

      botLogger.info('Alerta creada', { userId, alertId: alert.id, route: `${originCode}-${destinationCode}` });

    } catch (error) {
      botLogger.error('Error creando alerta', error as Error, { userId, origin: originCode, destination: destinationCode });
      await this.bot.sendMessage(chatId, '❌ Error creando la alerta. Inténtalo de nuevo.');
    }
  }

  /**
   * Comando /myalerts
   */
  private async handleMyAlerts(chatId: number, userId: number): Promise<void> {
    try {
      const user = UserModel.findByTelegramId(userId);
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
        // Alertas del sistema viejo
        ...legacyAlerts.map(alert => ({
          id: alert.id,
          originalId: alert.id.toString(),
          origin: alert.origin,
          destination: alert.destination,
          maxPrice: alert.maxPrice,
          type: 'legacy' as const,
          searchMonth: null as string | null
        })),
        // Alertas del sistema nuevo (mensuales)
        ...newAlerts.map(alert => ({
          id: parseInt(alert.id), // Convertir string a number para compatibilidad
          originalId: alert.id, // Mantener el ID original para callbacks
          origin: alert.fromAirport,
          destination: alert.toAirport,
          maxPrice: alert.maxPrice,
          type: 'monthly' as const,
          searchMonth: alert.searchMonth
        }))
      ];

      if (displayAlerts.length === 0) {
        await this.bot.sendMessage(
          chatId,
          '📭 No tienes alertas activas.\n\n• Usa `/alertas` para alertas normales\n• Usa `/monthlyalert` para alertas mensuales automáticas',
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '📅 Alerta Mensual', callback_data: 'help_monthly' }],
                [{ text: '✈️ Alerta Normal', callback_data: 'help_alert' }],
              ],
            },
          }
        );
        return;
      }

      // Formatear mensaje de alertas (necesitamos adaptar el formato)
      let alertsMessage = '📋 *Tus Alertas Activas:*\n\n';
      
      displayAlerts.forEach((alert, index) => {
        const typeLabel = alert.type === 'monthly' ? '📅 Mensual' : '✈️ Normal';
        const monthInfo = alert.searchMonth ? ` (${alert.searchMonth})` : '';
        
        alertsMessage += `${index + 1}. ${typeLabel}\n`;
        alertsMessage += `   📍 ${alert.origin} → ${alert.destination}${monthInfo}\n`;
        alertsMessage += `   💰 Máx: $${alert.maxPrice} USD\n`;
        alertsMessage += `   🆔 ID: ${alert.id}\n\n`;
      });

      alertsMessage += `💡 Usa \`/cancelar <ID>\` para desactivar una alerta específica.`;
      
      // Crear botones para cada alerta
      const keyboard = displayAlerts.map(alert => {
        const buttons = [
          {
            text: `⏸️ Pausar ${alert.origin}→${alert.destination}`,
            callback_data: `pause_alert_${alert.id}`,
          }
        ];

        // Solo las alertas mensuales pueden ser chequeadas ahora
        if (alert.type === 'monthly') {
          buttons.push({
            text: `🔍 Chequear Ahora`,
            callback_data: `check_alert_${alert.originalId}`,
          });
        }

        return buttons;
      });

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
   * Comando /stop
   */
  private async handleStopAlert(chatId: number, userId: number, args: string[]): Promise<void> {
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
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado.');
        return;
      }

      let alertFound = false;
      let alertInfo = '';

      // Intentar primero con alertas legacy (ID numérico)
      if (!isNaN(alertIdNum)) {
        const alert = AlertModel.findById(alertIdNum);
        if (alert && alert.userId === user.id) {
          const success = AlertModel.deactivate(alertIdNum);
          if (success) {
            alertFound = true;
            alertInfo = `${alert.origin} → ${alert.destination}`;
          }
        }
      }

      // Si no se encontró, intentar con alertas mensuales (ID string/UUID)
      if (!alertFound) {
        const newAlerts = this.alertManager.getUserAlerts(user.id);
        const monthlyAlert = newAlerts.find(a => a.id === alertIdStr || parseInt(a.id) === alertIdNum);
        
        if (monthlyAlert) {
          const success = this.alertManager.deactivateAlert(monthlyAlert.id, user.id);
          if (success) {
            alertFound = true;
            alertInfo = `${monthlyAlert.fromAirport} → ${monthlyAlert.toAirport} (${monthlyAlert.searchMonth})`;
          }
        }
      }

      if (alertFound) {
        await this.bot.sendMessage(
          chatId,
          `✅ Alerta desactivada: ${alertInfo}`
        );
        botLogger.info('Alerta desactivada', { userId, alertId: alertIdStr });
        
        // Actualizar la lista de alertas
        await this.handleMyAlerts(chatId, userId);
      } else {
        await this.bot.sendMessage(chatId, '❌ Alerta no encontrada o no te pertenece.');
      }

    } catch (error) {
      botLogger.error('Error desactivando alerta', error as Error, { userId, alertId: alertIdStr });
      await this.bot.sendMessage(chatId, '❌ Error desactivando la alerta.');
    }
  }

  /**
   * Comando /clearall
   */
  private async handleClearAll(chatId: number, userId: number): Promise<void> {
    try {
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado.');
        return;
      }

      // Desactivar alertas del sistema legacy
      const legacyDeactivatedCount = AlertModel.deactivateAllByUserId(user.id);
      
      // Desactivar alertas del nuevo sistema (mensuales)
      const newAlerts = this.alertManager.getUserAlerts(user.id);
      let monthlyDeactivatedCount = 0;
      
      for (const alert of newAlerts) {
        if (alert.isActive) {
          const success = this.alertManager.deactivateAlert(alert.id, user.id);
          if (success) {
            monthlyDeactivatedCount++;
          }
        }
      }
      
      const totalDeactivated = legacyDeactivatedCount + monthlyDeactivatedCount;
      
      if (totalDeactivated > 0) {
        let message = `✅ ${totalDeactivated} alerta(s) desactivada(s) exitosamente.`;
        
        if (legacyDeactivatedCount > 0 && monthlyDeactivatedCount > 0) {
          message += `\n   • ${legacyDeactivatedCount} alerta(s) normal(es)`;
          message += `\n   • ${monthlyDeactivatedCount} alerta(s) mensual(es)`;
        }
        
        await this.bot.sendMessage(chatId, message);
        botLogger.info('Todas las alertas desactivadas', { 
          userId, 
          legacyCount: legacyDeactivatedCount,
          monthlyCount: monthlyDeactivatedCount,
          total: totalDeactivated 
        });
        
        // Actualizar la lista de alertas para mostrar que ya no hay ninguna
        await this.handleMyAlerts(chatId, userId);
      } else {
        await this.bot.sendMessage(chatId, '📭 No tienes alertas activas para desactivar.');
      }

    } catch (error) {
      botLogger.error('Error desactivando todas las alertas', error as Error, { userId });
      await this.bot.sendMessage(chatId, '❌ Error desactivando las alertas.');
    }
  }

  /**
   * Comando /search (mock por ahora)
   */
  private async handleSearch(chatId: number, args: string[]): Promise<void> {
    if (args.length < 2) {
      await this.bot.sendMessage(
        chatId,
        '❌ Uso: /search ORIGEN DESTINO [FECHA]\n\nEjemplo: /search BOG MIA 2024-03-15'
      );
      return;
    }

    await this.bot.sendMessage(
      chatId,
      '🔍 Funcionalidad de búsqueda en desarrollo.\n\nPor ahora, crea una alerta con /alert y te notificaremos cuando encontremos buenos precios.'
    );
  }

  /**
   * Comando /stats (solo admin)
   */
  private async handleStats(chatId: number): Promise<void> {
    // Verificar si es admin
    if (config.telegram.adminChatId && chatId !== config.telegram.adminChatId) {
      await this.bot.sendMessage(chatId, '❌ Comando solo disponible para administradores.');
      return;
    }

    try {
      const userStats = UserModel.getStats();
      const alertStats = AlertModel.getStats();
      
      const statsMessage = MessageFormatter.formatStatsMessage(userStats, alertStats);
      
      await this.bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });

    } catch (error) {
      botLogger.error('Error obteniendo estadísticas', error as Error);
      await this.bot.sendMessage(chatId, '❌ Error obteniendo estadísticas.');
    }
  }

  /**
   * Comando desconocido
   */
  private async handleUnknownCommand(chatId: number): Promise<void> {
    await this.bot.sendMessage(
      chatId,
      '❓ Comando no reconocido.\n\nUsa /help para ver los comandos disponibles.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '❓ Ver Ayuda', callback_data: 'help_commands' }],
          ],
        },
      }
    );
  }

  /**
   * Validar código de aeropuerto
   */
  private isValidAirport(code: string): boolean {
    return Object.prototype.hasOwnProperty.call(airports, code);
  }



  /**
   * Comando /monthlyalert - Crear alerta mensual automática
   */
  private async handleMonthlyAlert(chatId: number, userId: number, args: string[]): Promise<void> {
    if (args.length < 3) {
      const usageMessage = MessageFormatter.formatMonthlyAlertUsageMessage();
      await this.bot.sendMessage(chatId, usageMessage, { parse_mode: 'Markdown' });
      return;
    }

    const [origin, destination, maxPriceStr, monthYear] = args;
    const maxPrice = parseFloat(maxPriceStr);

    // Validaciones
    if (isNaN(maxPrice) || maxPrice <= 0) {
      await this.bot.sendMessage(chatId, '❌ El precio debe ser un número válido mayor a 0');
      return;
    }

    // Validar y procesar mes/año
    let searchMonth: string;
    if (monthYear) {
      const monthValidation = this.validateAndFormatMonth(monthYear);
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

    if (!this.isValidAirport(originCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de origen inválido: ${originCode}`);
      return;
    }

    if (!this.isValidAirport(destinationCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de destino inválido: ${destinationCode}`);
      return;
    }

    if (originCode === destinationCode) {
      await this.bot.sendMessage(chatId, '❌ El origen y destino no pueden ser iguales');
      return;
    }

    try {
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      // Verificar límite de alertas
      const alertCount = AlertModel.countActiveByUserId(user.id);
      if (alertCount >= config.alerts.maxAlertsPerUser) {
        await this.bot.sendMessage(
          chatId,
          `❌ Has alcanzado el límite máximo de ${config.alerts.maxAlertsPerUser} alertas activas`
        );
        return;
      }

      // Verificar alerta duplicada
      const duplicate = AlertModel.findDuplicate(user.id, originCode, destinationCode);
      if (duplicate) {
        await this.bot.sendMessage(
          chatId,
          `⚠️ Ya tienes una alerta activa para la ruta ${originCode} → ${destinationCode}`
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
        maxPrice,
        defaultPassengers,
        searchMonth
      );

      const successMessage = MessageFormatter.formatMonthlyAlertCreatedMessage(alert);
      
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

      botLogger.info('Alerta mensual creada', { userId, alertId: alert.id, route: `${originCode}-${destinationCode}` });

    } catch (error) {
      botLogger.error('Error creando alerta mensual', error as Error, { userId, origin: originCode, destination: destinationCode });
      await this.bot.sendMessage(chatId, '❌ Error creando la alerta mensual. Inténtalo de nuevo.');
    }
  }

  /**
   * Validar y formatear mes/año para alertas mensuales
   */
  private validateAndFormatMonth(monthYear: string): {
    isValid: boolean;
    formattedMonth?: string;
    error?: string;
  } {
    // Formatos aceptados: "02/2026", "2/2026", "2026-02", "feb", "febrero", etc.
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    
    let targetMonth: number;
    let targetYear: number;

    // Procesar diferentes formatos
    if (monthYear.includes('/')) {
      // Formato MM/YYYY o M/YYYY
      const parts = monthYear.split('/');
      if (parts.length !== 2) {
        return { isValid: false, error: 'Formato inválido. Usa MM/YYYY (ej: 02/2026)' };
      }
      
      targetMonth = parseInt(parts[0]);
      targetYear = parseInt(parts[1]);
    } else if (monthYear.includes('-')) {
      // Formato YYYY-MM
      const parts = monthYear.split('-');
      if (parts.length !== 2) {
        return { isValid: false, error: 'Formato inválido. Usa YYYY-MM (ej: 2026-02)' };
      }
      
      targetYear = parseInt(parts[0]);
      targetMonth = parseInt(parts[1]);
    } else if (/^\d+$/.test(monthYear)) {
      // Solo número de mes, usar año actual
      targetMonth = parseInt(monthYear);
      targetYear = currentYear;
      
      // Si el mes ya pasó este año, usar año siguiente
      if (targetMonth < currentMonth) {
        targetYear = currentYear + 1;
      }
    } else {
      // Nombres de meses en español
      const monthNames = {
        'enero': 1, 'ene': 1,
        'febrero': 2, 'feb': 2,
        'marzo': 3, 'mar': 3,
        'abril': 4, 'abr': 4,
        'mayo': 5, 'may': 5,
        'junio': 6, 'jun': 6,
        'julio': 7, 'jul': 7,
        'agosto': 8, 'ago': 8,
        'septiembre': 9, 'sep': 9,
        'octubre': 10, 'oct': 10,
        'noviembre': 11, 'nov': 11,
        'diciembre': 12, 'dic': 12
      };
      
      const monthName = monthYear.toLowerCase();
      targetMonth = monthNames[monthName as keyof typeof monthNames];
      
      if (!targetMonth) {
        return { 
          isValid: false, 
          error: 'Mes inválido. Usa números (1-12), nombres (enero, feb) o formato MM/YYYY' 
        };
      }
      
      targetYear = currentYear;
      // Si el mes ya pasó este año, usar año siguiente
      if (targetMonth < currentMonth) {
        targetYear = currentYear + 1;
      }
    }

    // Validaciones
    if (isNaN(targetMonth) || isNaN(targetYear)) {
      return { isValid: false, error: 'Mes o año inválido' };
    }

    if (targetMonth < 1 || targetMonth > 12) {
      return { isValid: false, error: 'El mes debe estar entre 1 y 12' };
    }

    // Validar que esté dentro del rango permitido (hasta 12 meses adelante)
    const targetDate = new Date(targetYear, targetMonth - 1, 1);
    const maxDate = new Date(currentYear + 1, currentMonth - 1, 1);
    const minDate = new Date(currentYear, currentMonth - 1, 1);

    if (targetDate < minDate) {
      return { 
        isValid: false, 
        error: 'No puedes crear alertas para meses pasados' 
      };
    }

    if (targetDate > maxDate) {
      return { 
        isValid: false, 
        error: 'No puedes crear alertas para más de 12 meses adelante' 
      };
    }

    const formattedMonth = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;
    return { 
      isValid: true, 
      formattedMonth 
    };
  }

  /**
   * Pausar/reactivar una alerta específica
   */
  private async handlePauseAlert(chatId: number, userId: number, alertId: number | string): Promise<void> {
    try {
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado.');
        return;
      }

      let alertFound = false;

      // Si es un número, buscar en alertas legacy
      if (typeof alertId === 'number') {
        let legacyAlert = AlertModel.findById(alertId);
        if (legacyAlert && legacyAlert.userId === user.id) {
          const success = AlertModel.deactivate(alertId);
          if (success) {
            await this.bot.sendMessage(
              chatId,
              `⏸️ Alerta pausada: ${legacyAlert.origin} → ${legacyAlert.destination}`
            );
            alertFound = true;
          }
        }
      }

      // Si no se encontró o es string, buscar en alertas mensuales
      if (!alertFound) {
        const newAlerts = this.alertManager.getUserAlerts(user.id);
        const newAlert = newAlerts.find(alert => 
          alert.id === alertId.toString() || parseInt(alert.id) === alertId
        );
        
        if (newAlert) {
          const success = this.alertManager.deactivateAlert(newAlert.id, user.id);
          if (success) {
            await this.bot.sendMessage(
              chatId,
              `⏸️ Alerta mensual pausada: ${newAlert.fromAirport} → ${newAlert.toAirport} (${newAlert.searchMonth})`
            );
            alertFound = true;
          }
        }
      }

      if (alertFound) {
        // Actualizar la lista de alertas
        await this.handleMyAlerts(chatId, userId);
      } else {
        await this.bot.sendMessage(chatId, '❌ Alerta no encontrada o no te pertenece.');
      }

    } catch (error) {
      botLogger.error('Error pausando alerta', error as Error, { userId, alertId });
      await this.bot.sendMessage(chatId, '❌ Error pausando la alerta.');
    }
  }

  /**
   * Chequear una alerta ahora mismo
   */
  private async handleCheckAlertNow(chatId: number, userId: number, alertId: string): Promise<void> {
    try {
      const user = UserModel.findByTelegramId(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado.');
        return;
      }

      await this.bot.sendMessage(chatId, '🔍 Buscando ofertas ahora...');

      // Solo las alertas mensuales (nuevo sistema) soportan chequeo inmediato
      const newAlerts = this.alertManager.getUserAlerts(user.id);
      const alert = newAlerts.find(a => a.id === alertId);
      
      if (!alert) {
        await this.bot.sendMessage(chatId, '❌ Solo las alertas mensuales soportan búsqueda inmediata.');
        return;
      }

      // Importar el servicio de Arajet
      const { ArajetAlertService } = await import('@/services/ArajetAlertService');
      const arajetService = new ArajetAlertService();

      // Buscar ofertas
      const deals = await arajetService.findDealsForAlert(alert);
      
      if (deals.length > 0) {
        const message = arajetService.formatAlertMessage(alert, deals);
        await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      } else {
        await this.bot.sendMessage(
          chatId,
          `🔍 No se encontraron ofertas para ${alert.fromAirport} → ${alert.toAirport} en ${alert.searchMonth} por debajo de $${alert.maxPrice} USD.`,
          { parse_mode: 'Markdown' }
        );
      }

      botLogger.info('Chequeo manual de alerta completado', { userId, alertId, dealsFound: deals.length });

    } catch (error) {
      botLogger.error('Error chequeando alerta manualmente', error as Error, { userId, alertId });
      await this.bot.sendMessage(chatId, '❌ Error buscando ofertas. Inténtalo de nuevo más tarde.');
    }
  }

  /**
   * Mostrar lista completa de comandos
   */
  private async handleCommandsList(chatId: number): Promise<void> {
    const commandsMessage = `📖 *Lista Completa de Comandos*

🚀 *Comandos Básicos:*
• \`/start\` - Iniciar el bot y registrarse
• \`/help\` - Mostrar ayuda general

✈️ *Alertas de Vuelos:*
• \`/alertas\` - Crear alerta normal de precios
• \`/monthlyalert\` - Crear alerta mensual automática
• \`/misalertas\` - Ver todas tus alertas activas
• \`/cancelar <ID>\` - Cancelar alerta específica
• \`/clearall\` - Eliminar todas las alertas

🔍 *Búsqueda:*
• \`/buscar\` - Buscar vuelos (en desarrollo)

👨‍💼 *Admin (solo administradores):*
• \`/stats\` - Ver estadísticas del bot

💡 *Consejos:*
• Usa los botones interactivos para navegación rápida
• Las alertas mensuales buscan en todo el mes especificado
• Puedes pausar/reactivar alertas desde \`/misalertas\`
• El bot verifica automáticamente cada 5 minutos`;

    await this.bot.sendMessage(chatId, commandsMessage, { parse_mode: 'Markdown' });
  }

  /**
   * Mostrar guía de usuario
   */
  private async handleUserGuide(chatId: number): Promise<void> {
    const guideMessage = `📚 *Guía de Usuario - Flight Bot*

🎯 *¿Qué hace este bot?*
Te ayuda a encontrar vuelos baratos de Arajet monitoreando precios automáticamente.

🚀 *Primeros pasos:*
1️⃣ Usa \`/start\` para registrarte
2️⃣ Crea tu primera alerta con \`/alertas\` o \`/monthlyalert\`
3️⃣ ¡Recibe notificaciones cuando encontremos ofertas!

✈️ *Tipos de Alertas:*

🔸 *Alerta Normal* (\`/alertas\`)
• Para fechas específicas
• Formato: \`/alertas ORIGEN DESTINO PRECIO_MAX\`
• Ejemplo: \`/alertas EZE MIA 300\`

🔸 *Alerta Mensual* (\`/monthlyalert\`)
• Busca en todo un mes
• Formato: \`/monthlyalert ORIGEN DESTINO PRECIO_MAX MES\`
• Ejemplo: \`/monthlyalert STI PUJ 210 2026-02\`

🌎 *Aeropuertos Disponibles:*
EZE, SCL, BOG, MIA, PUJ, STI, SDQ, CUN, SJU, YYZ, ORD, etc.
Usa \`/buscar\` para ver la lista completa.

⚡ *Funciones Avanzadas:*
• Chequeo inmediato desde \`/misalertas\`
• Pausar/reactivar alertas individualmente
• Recibir hasta ${config.alerts.maxAlertsPerUser} alertas activas

❓ *¿Dudas?* Usa \`/help\` en cualquier momento.`;

    await this.bot.sendMessage(chatId, guideMessage, { parse_mode: 'Markdown' });
  }
}
