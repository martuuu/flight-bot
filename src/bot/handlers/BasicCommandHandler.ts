import { UserModelCompatAdapter } from '@/services/AlertManagerCompatAdapter';
import { config } from '@/config';
import { botLogger } from '@/utils/logger';
import { MessageFormatter } from '../MessageFormatter';
import { AirlineUtils } from '../utils/AirlineUtils';

/**
 * Manejador de comandos básicos del bot (independientes de aerolínea)
 */
export class BasicCommandHandler {
  private bot: any;

  constructor(bot: any) {
    this.bot = bot;
  }

  /**
   * Comando /start
   */
  async handleStart(chatId: number, user: any, args: string[] = []): Promise<void> {
    if (user) {
      // Crear o encontrar usuario usando la nueva versión asíncrona
      await UserModelCompatAdapter.findOrCreateByTelegramId(
        user.id
        // Nota: por ahora omitimos username, first_name, last_name hasta que se corrija el adaptador
      );

      // Verificar si hay parámetros de autenticación desde webapp
      if (args.length > 0 && args[0].startsWith('auth_')) {
        await this.handleWebappAuth(chatId, user, args[0]);
        return;
      }

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
  async handleHelp(chatId: number): Promise<void> {
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
   * Mostrar lista completa de comandos
   */
  async handleCommandsList(chatId: number): Promise<void> {
    const activeAirlines = AirlineUtils.getActiveAirlines();
    const monthlyAirlines = AirlineUtils.getMonthlyAlertAirlines();
    const milesAirlines = AirlineUtils.getMilesAlertAirlines();

    let commandsMessage = `📖 *Lista Completa de Comandos*

🚀 *Comandos Básicos:*
• \`/start\` - Iniciar el bot y registrarse
• \`/help\` - Mostrar ayuda general

✈️ *Alertas de Vuelos:*
• \`/alertas\` - Crear alerta normal de precios
• \`/addalert\` - Crear alerta con sintaxis unificada
• \`/misalertas\` - Ver todas tus alertas activas
• \`/cancelar <ID>\` - Cancelar alerta específica
• \`/clearall\` - Eliminar todas las alertas

🔍 *Búsqueda:*
• \`/buscar\` - Buscar vuelos (en desarrollo)`;

    // Comandos específicos por aerolínea
    if (monthlyAirlines.length > 0) {
      commandsMessage += `\n\n📅 *Alertas Mensuales (${monthlyAirlines.map(a => a.displayName).join(', ')}):*
• \`/monthlyalert\` - Crear alerta mensual automática`;
    }

    if (milesAirlines.length > 0) {
      commandsMessage += `\n\n🏆 *Alertas de Millas (${milesAirlines.map(a => a.displayName).join(', ')}):*
• \`/millas-ar\` - Crear alerta de millas
• \`/millas-ar-search\` - Buscar millas inmediatamente
• \`/mis-alertas-millas-ar\` - Ver alertas de millas`;
    }

    commandsMessage += `\n\n👨‍💼 *Admin (solo administradores):*
• \`/stats\` - Ver estadísticas del bot

💡 *Consejos:*
• Usa los botones interactivos para navegación rápida
• Las alertas mensuales buscan en todo el mes especificado
• Puedes pausar/reactivar alertas desde \`/misalertas\`
• El bot verifica automáticamente cada 5 minutos

🛩️ *Aerolíneas Disponibles:*`;

    activeAirlines.forEach(airline => {
      const emoji = AirlineUtils.getAirlineEmoji(airline.code);
      const features = [];
      if (airline.supportsMonthlyAlerts) features.push('Alertas Mensuales');
      if (airline.supportsMilesAlerts) features.push('Alertas de Millas');
      
      commandsMessage += `\n• ${emoji} ${airline.displayName}${features.length > 0 ? ` (${features.join(', ')})` : ''}`;
    });

    await this.bot.sendMessage(chatId, commandsMessage, { parse_mode: 'Markdown' });
  }

  /**
   * Mostrar guía de usuario
   */
  async handleUserGuide(chatId: number): Promise<void> {
    const activeAirlines = AirlineUtils.getActiveAirlines();
    
    let guideMessage = `📚 *Guía de Usuario - Flight Bot*

🎯 *¿Qué hace este bot?*
Te ayuda a encontrar vuelos baratos monitoreando precios automáticamente en múltiples aerolíneas.

🚀 *Primeros pasos:*
1️⃣ Usa \`/start\` para registrarte
2️⃣ Crea tu primera alerta con \`/alertas\` o \`/addalert\`
3️⃣ ¡Recibe notificaciones cuando encontremos ofertas!

✈️ *Tipos de Alertas:*

🔸 *Alerta Normal* (\`/alertas\`)
• Para fechas específicas o rangos
• Formato: \`/alertas ORIGEN DESTINO PRECIO_MAX\`
• Ejemplo: \`/alertas EZE MIA 300\`

🔸 *Alerta Unificada* (\`/addalert\`)
• Sintaxis flexible y potente
• Ejemplo: \`/addalert STI PUJ 210 2026-02\`
• Ejemplo: \`/addalert BOG MIA - 2026-03\` (solo mejores precios)`;

    // Comandos específicos por aerolínea activa
    const monthlyAirlines = AirlineUtils.getMonthlyAlertAirlines();
    if (monthlyAirlines.length > 0) {
      guideMessage += `\n\n🔸 *Alerta Mensual* (\`/monthlyalert\`) - ${monthlyAirlines.map(a => a.displayName).join(', ')}
• Busca en todo un mes
• Formato: \`/monthlyalert ORIGEN DESTINO PRECIO_MAX MES\`
• Ejemplo: \`/monthlyalert STI PUJ 210 2026-02\``;
    }

    const milesAirlines = AirlineUtils.getMilesAlertAirlines();
    if (milesAirlines.length > 0) {
      guideMessage += `\n\n🔸 *Alertas de Millas* (\`/millas-ar\`) - ${milesAirlines.map(a => a.displayName).join(', ')}
• Para vuelos con millas/puntos
• Formato: \`/millas-ar ORIGEN DESTINO FECHA MAX_MILLAS\`
• Ejemplo: \`/millas-ar EZE MIA 2026-03-15 50000\``;
    }

    guideMessage += `\n\n🌎 *Aeropuertos Disponibles:*
EZE, SCL, BOG, MIA, PUJ, STI, SDQ, CUN, SJU, YYZ, ORD, etc.

⚡ *Funciones Avanzadas:*
• Chequeo inmediato desde \`/misalertas\`
• Pausar/reactivar alertas individualmente
• Recibir hasta ${config.alerts.maxAlertsPerUser} alertas activas

🛩️ *Aerolíneas Activas:*`;

    activeAirlines.forEach(airline => {
      const emoji = AirlineUtils.getAirlineEmoji(airline.code);
      guideMessage += `\n• ${emoji} ${airline.displayName}`;
    });

    guideMessage += `\n\n❓ *¿Dudas?* Usa \`/help\` en cualquier momento.`;

    await this.bot.sendMessage(chatId, guideMessage, { parse_mode: 'Markdown' });
  }

  /**
   * Comando /stats (solo admin)
   */
  async handleStats(chatId: number): Promise<void> {
    // Verificar si es admin
    if (config.telegram.adminChatId && chatId !== config.telegram.adminChatId) {
      await this.bot.sendMessage(chatId, '❌ Comando solo disponible para administradores.');
      return;
    }

    try {
      const userStats = UserModelCompatAdapter.getStats();
      // TODO: Obtener stats de alertas de múltiples sistemas
      // const alertStats = AlertModel.getStats();
      
      const statsMessage = MessageFormatter.formatStatsMessage(userStats, null);
      
      await this.bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });

    } catch (error) {
      botLogger.error('Error obteniendo estadísticas', error as Error);
      await this.bot.sendMessage(chatId, '❌ Error obteniendo estadísticas.');
    }
  }

  /**
   * Comando /search (mock por ahora)
   */
  async handleSearch(chatId: number, args: string[]): Promise<void> {
    if (args.length < 2) {
      await this.bot.sendMessage(
        chatId,
        '❌ Uso: /buscar ORIGEN DESTINO [FECHA] [AEROLINEA]\n\nEjemplo: /buscar BOG MIA 2024-03-15 arajet'
      );
      return;
    }

    const activeAirlines = AirlineUtils.getActiveAirlines();
    const airlinesList = activeAirlines.map(a => `• ${AirlineUtils.getAirlineEmoji(a.code)} ${a.displayName}`).join('\n');

    await this.bot.sendMessage(
      chatId,
      `🔍 Funcionalidad de búsqueda en desarrollo.

🛩️ *Aerolíneas disponibles:*
${airlinesList}

Por ahora, crea una alerta con \`/alertas\` y te notificaremos cuando encontremos buenos precios.`,
      { parse_mode: 'Markdown' }
    );
  }

  /**
   * Comando desconocido
   */
  async handleUnknownCommand(chatId: number): Promise<void> {
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
   * Manejar autenticación desde webapp
   */
  private async handleWebappAuth(chatId: number, user: any, authParam: string): Promise<void> {
    try {
      // Extraer datos de autenticación
      const authData = authParam.replace('auth_', '');
      const decodedData = JSON.parse(atob(authData));
      
      const { userId, userRole, userEmail, timestamp } = decodedData;
      
      // Verificar que el enlace no sea muy viejo (30 minutos)
      const maxAge = 30 * 60 * 1000; // 30 minutos
      if (Date.now() - timestamp > maxAge) {
        await this.bot.sendMessage(chatId, '❌ Enlace de autenticación expirado. Genera uno nuevo desde la webapp.');
        return;
      }

      const welcomeMessage = `🎉 ¡Bienvenido desde la webapp!

👤 **Usuario**: ${userId}
🏷️ **Rol**: ${userRole}
📧 **Email**: ${userEmail || 'No proporcionado'}

✅ Autenticación exitosa. Ahora puedes usar todos los comandos del bot.

🚀 **Comandos disponibles:**
• \`/addalert SDQ MIA 300\` - Crear alerta
• \`/misalertas\` - Ver tus alertas
• \`/help\` - Ver ayuda completa`;

      await this.bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✈️ Crear Alerta', callback_data: 'help_alert' },
              { text: '📋 Mis Alertas', callback_data: 'my_alerts' },
            ],
            [
              { text: '🌐 Volver a Webapp', url: 'https://tu-webapp.com/dashboard' },
            ],
          ],
        },
      });

      botLogger.info('Usuario autenticado desde webapp', { 
        telegramUserId: user.id, 
        webappUserId: userId, 
        userRole, 
        userEmail 
      });

    } catch (error) {
      botLogger.error('Error procesando autenticación webapp', error as Error, { authParam });
      await this.bot.sendMessage(chatId, '❌ Error procesando la autenticación. Contacta al soporte.');
    }
  }

  /**
   * Comando /link - Vincular cuenta con webapp
   */
  async handleLink(chatId: number, user: any, args: string[] = []): Promise<void> {
    if (!user) {
      await this.bot.sendMessage(chatId, '❌ Error obteniendo información del usuario.');
      return;
    }

    try {
      // Verificar si se proporcionó un código de vinculación
      if (args.length === 0) {
        const helpMessage = `🔗 **Vincular con Webapp**

Para vincular tu cuenta de Telegram con la webapp:

1️⃣ Ve a la webapp y genera un código de vinculación
2️⃣ Envía el comando: \`/link CODIGO\`

📱 **¿No tienes cuenta en la webapp?**
Crea una cuenta gratuita en: https://tu-webapp.com/signup

🌐 **¿Ya tienes cuenta?**
Inicia sesión y ve a "Configuración" → "Vincular Telegram"`;

        await this.bot.sendMessage(chatId, helpMessage, { 
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🌐 Ir a Webapp', url: process.env['NEXTAUTH_URL'] || 'https://tu-webapp.com' }
              ]
            ]
          }
        });
        return;
      }

      const linkingCode = args[0];

      // Validar formato del código (6 dígitos)
      if (!/^\d{6}$/.test(linkingCode)) {
        await this.bot.sendMessage(chatId, '❌ Código inválido. Debe ser un código de 6 dígitos.');
        return;
      }

      // Llamar al endpoint de la webapp para confirmar la vinculación
      const webappUrl = process.env['NEXTAUTH_URL'] || 'http://localhost:3000';
      
      try {
        const response = await fetch(`${webappUrl}/api/telegram/link-simple`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'confirm_from_bot',
            telegramId: user.id.toString(),
            telegramUsername: user.username,
            telegramFirstName: user.first_name,
            telegramLastName: user.last_name,
            linkingCode: linkingCode
          })
        });

        const result = await response.json() as { success?: boolean; error?: string };

        if (result.success) {
          const successMessage = `✅ **¡Vinculación exitosa!**

🎉 Tu cuenta de Telegram está ahora vinculada con la webapp.

**¿Qué puedes hacer ahora?**
• 📱 Crear alertas desde Telegram con \`/addalert\`
• 🌐 Gestionar alertas desde la webapp
• 🔔 Recibir notificaciones en ambas plataformas
• 📊 Ver estadísticas detalladas en la webapp

**Comandos útiles:**
• \`/misalertas\` - Ver tus alertas
• \`/addalert BOG MIA 300\` - Crear nueva alerta
• \`/help\` - Ver todos los comandos`;

          await this.bot.sendMessage(chatId, successMessage, { 
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🌐 Ir al Dashboard', url: `${webappUrl}/dashboard` },
                  { text: '✈️ Crear Alerta', callback_data: 'help_alert' }
                ]
              ]
            }
          });

          botLogger.info('Usuario vinculado exitosamente', { 
            telegramUserId: user.id, 
            username: user.username,
            linkingCode 
          });

        } else {
          let errorMessage = '❌ No se pudo completar la vinculación.';
          
          if (result.error === 'Código de vinculación inválido o expirado') {
            errorMessage += '\n\n🕐 El código ha expirado o es incorrecto. Genera uno nuevo desde la webapp.';
          } else if (result.error && result.error.includes('ya está vinculado')) {
            errorMessage += '\n\n🔗 Esta cuenta de Telegram ya está vinculada a otra cuenta.';
          }

          await this.bot.sendMessage(chatId, errorMessage);
        }

      } catch (fetchError) {
        botLogger.error('Error conectando con webapp', fetchError as Error);
        await this.bot.sendMessage(chatId, '❌ Error conectando con la webapp. Intenta más tarde.');
      }

    } catch (error) {
      botLogger.error('Error en comando /link', error as Error);
      await this.bot.sendMessage(chatId, '❌ Error procesando la vinculación. Contacta al soporte.');
    }
  }
}
