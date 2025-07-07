import { UserModelPrisma } from '@/models';
import { aerolineasAlertModelPrisma } from '@/models/AerolineasAlertModelPrisma';
import { botLogger } from '@/utils/logger';
import { ValidationUtils } from '../../utils/ValidationUtils';
import { AirlineUtils, AirlineType } from '../../utils/AirlineUtils';
import { AerolineasAlertService } from '@/services/AerolineasAlertService';
import { isValidAerolineasAirport } from '@/config/aerolineas-airports';

/**
 * Manejador de comandos específicos de Aerolíneas Argentinas
 */
export class AerolineasCommandHandler {
  private bot: any;
  private aerolineasService: AerolineasAlertService;

  constructor(bot: any) {
    this.bot = bot;
    this.aerolineasService = new AerolineasAlertService();
  }

  /**
   * Comando /millas-ar - Crear alerta para millas de Aerolíneas Argentinas
   */
  async handleAerolineasMilesAlert(chatId: number, userId: number, args: string[]): Promise<void> {
    if (args.length < 3) {
      const usageMessage = this.formatAerolineasMilesUsage();
      await this.bot.sendMessage(chatId, usageMessage, { parse_mode: 'Markdown' });
      return;
    }

    const [origin, destination, dateStr, maxMilesStr, adultsStr] = args;

    // Validar códigos de aeropuerto
    const originCode = origin.toUpperCase();
    const destinationCode = destination.toUpperCase();

    if (!this.isValidAerolineasAirport(originCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de origen inválido para Aerolíneas Argentinas: ${originCode}`);
      return;
    }

    if (!this.isValidAerolineasAirport(destinationCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de destino inválido para Aerolíneas Argentinas: ${destinationCode}`);
      return;
    }

    if (!ValidationUtils.areAirportsDifferent(originCode, destinationCode)) {
      await this.bot.sendMessage(chatId, '❌ El origen y destino no pueden ser iguales');
      return;
    }

    // Validar fecha
    const dateValidation = ValidationUtils.isValidDate(dateStr);
    if (!dateValidation.isValid) {
      await this.bot.sendMessage(chatId, `❌ ${dateValidation.error}`);
      return;
    }

    // Parsear parámetros opcionales
    let maxMiles: number | undefined;
    let adults = 1;

    if (maxMilesStr && maxMilesStr !== '-') {
      const milesNum = parseInt(maxMilesStr);
      if (isNaN(milesNum) || milesNum <= 0) {
        await this.bot.sendMessage(chatId, '❌ El número de millas debe ser un número válido mayor a 0');
        return;
      }
      maxMiles = milesNum;
    }

    if (adultsStr) {
      const adultsValidation = ValidationUtils.isValidAdultCount(adultsStr);
      if (!adultsValidation.isValid) {
        await this.bot.sendMessage(chatId, `❌ ${adultsValidation.error}`);
        return;
      }
      adults = adultsValidation.adults!;
    }

    try {
      const user = await UserModelPrisma.findOrCreate(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      // Crear la alerta usando el modelo Prisma
      const alertData = {
        userId: userId, // Se convertirá a string en el modelo
        telegramUserId: userId.toString(),
        origin: originCode,
        destination: destinationCode,
        departureDate: dateStr,
        adults: adults,
        children: 0,
        infants: 0,
        cabinClass: 'Economy' as const,
        flightType: 'ONE_WAY' as const,
        searchType: 'PROMO' as const,
        ...(maxMiles ? { maxMiles } : {}), // Solo incluir si existe
        isActive: true
      };

      const createdAlert = await aerolineasAlertModelPrisma.create(alertData);

      const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
      const successMessage = `${airlineEmoji} ✅ **Alerta de Millas Creada**

✈️ **Ruta**: ${originCode} → ${destinationCode}
📅 **Fecha**: ${dateStr}
👥 **Adultos**: ${adults}
${maxMiles ? `🏆 **Millas máximas**: ${maxMiles.toLocaleString()}` : '🏆 **Millas**: Sin límite'}
🆔 **ID de Alerta**: \`${createdAlert.id}\`

� Recibirás notificaciones cuando encontremos ofertas que cumplan tus criterios.

💡 **Próximos pasos**:
• Usa \`/mis-alertas-millas-ar\` para ver todas tus alertas
• Usa \`/millas-ar-search\` para buscar ofertas inmediatas`;

      await this.bot.sendMessage(chatId, successMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔍 Buscar Ahora', callback_data: 'search_miles_now' },
              { text: '📋 Ayuda', callback_data: 'help_miles_alert' },
            ],
          ],
        },
      });

      botLogger.info('Solicitud de alerta de millas Aerolíneas registrada', {
        userId,
        route: `${originCode}-${destinationCode}`,
        date: dateStr,
        maxMiles,
        adults,
        airline: 'AEROLINEAS_ARGENTINAS'
      });

    } catch (error) {
      botLogger.error('Error procesando alerta de millas Aerolíneas', error as Error, {
        userId,
        origin: originCode,
        destination: destinationCode,
        airline: 'AEROLINEAS_ARGENTINAS'
      });
      await this.bot.sendMessage(chatId, '❌ Error procesando la solicitud. Inténtalo de nuevo.');
    }
  }

  /**
   * Comando /millas-ar-search - Buscar ofertas de millas inmediatamente
   */
  async handleAerolineasMilesSearch(chatId: number, args: string[]): Promise<void> {
    if (args.length < 3) {
      const usageMessage = this.formatAerolineasSearchUsage();
      await this.bot.sendMessage(chatId, usageMessage, { parse_mode: 'Markdown' });
      return;
    }

    const [origin, destination, dateStr, maxMilesStr] = args;

    // Validar códigos de aeropuerto
    const originCode = origin.toUpperCase();
    const destinationCode = destination.toUpperCase();

    if (!this.isValidAerolineasAirport(originCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de origen inválido para Aerolíneas Argentinas: ${originCode}`);
      return;
    }

    if (!this.isValidAerolineasAirport(destinationCode)) {
      await this.bot.sendMessage(chatId, `❌ Código de aeropuerto de destino inválido para Aerolíneas Argentinas: ${destinationCode}`);
      return;
    }

    if (!ValidationUtils.areAirportsDifferent(originCode, destinationCode)) {
      await this.bot.sendMessage(chatId, '❌ El origen y destino no pueden ser iguales');
      return;
    }

    // Validar fecha
    const dateValidation = ValidationUtils.isValidDate(dateStr);
    if (!dateValidation.isValid) {
      await this.bot.sendMessage(chatId, `❌ ${dateValidation.error}`);
      return;
    }

    // Parsear millas máximas
    let maxMiles: number | undefined;
    if (maxMilesStr && maxMilesStr !== '-') {
      const milesNum = parseInt(maxMilesStr);
      if (isNaN(milesNum) || milesNum <= 0) {
        await this.bot.sendMessage(chatId, '❌ El número de millas debe ser un número válido mayor a 0');
        return;
      }
      maxMiles = milesNum;
    }

    try {
      const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
      await this.bot.sendMessage(chatId, `${airlineEmoji} 🔍 Buscando ofertas de millas...

📍 **Ruta**: ${originCode} → ${destinationCode}
📅 **Fecha**: ${dateStr}
${maxMiles ? `🏆 **Millas máximas**: ${maxMiles.toLocaleString()}` : '🔍 **Buscando mejores ofertas**'}

⏳ Esto puede tomar unos momentos...`);

      // Buscar ofertas usando el servicio real
      const offers = await this.aerolineasService.searchPromoOffersForDate(
        originCode,
        destinationCode,
        dateStr,
        { adults: 1, cabinClass: 'Economy' }
      );

      if (offers.length === 0) {
        await this.bot.sendMessage(chatId, `${airlineEmoji} 🔍 **Búsqueda completada**

❌ No se encontraron ofertas promocionales para:
• **Ruta**: ${originCode} → ${destinationCode}
• **Fecha**: ${dateStr}
${maxMiles ? `• **Millas máximas**: ${maxMiles.toLocaleString()}` : ''}

💡 **Sugerencias**:
• Prueba con fechas flexibles
• Verifica que los códigos de aeropuerto sean correctos
• Intenta con otras rutas similares

🔄 También puedes crear una alerta con \`/millas-ar\` para recibir notificaciones automáticas.`);
        return;
      }

      // Mostrar ofertas encontradas
      let message = `${airlineEmoji} 🎉 **¡Ofertas encontradas!**

📍 **Ruta**: ${originCode} → ${destinationCode}
📅 **Fecha**: ${dateStr}
🏆 **${offers.length} ofertas promocionales**

`;

      for (const offer of offers.slice(0, 5)) { // Máximo 5 ofertas
        const departureTime = offer.segments?.[0]?.departure ? 
          new Date(offer.segments[0].departure).toLocaleTimeString('es-AR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : 'Sin horario';
        
        message += `✈️ **${departureTime}**
💰 **${offer.miles?.toLocaleString() || 'N/A'} millas**
🎫 **${offer.cabinClass || 'Economy'}**
${offer.availableSeats > 0 ? '✅ Disponible' : '⚠️ Disponibilidad limitada'}

`;
      }

      if (offers.length > 5) {
        message += `\n📋 *Mostrando 5 de ${offers.length} ofertas encontradas*`;
      }

      message += `\n💡 **Próximos pasos**:
• Reserva rápidamente - las ofertas pueden agotarse
• Crea una alerta con \`/millas-ar\` para futuras búsquedas
• Verifica términos y condiciones en la web oficial`;

      await this.bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔄 Buscar otra fecha', callback_data: 'search_another_date' },
              { text: '🚨 Crear alerta', callback_data: 'create_miles_alert' }
            ]
          ]
        }
      });

    } catch (error) {
      botLogger.error('Error en búsqueda de millas Aerolíneas', error as Error, {
        origin: originCode,
        destination: destinationCode,
        date: dateStr,
        maxMiles,
        airline: 'AEROLINEAS_ARGENTINAS'
      });

      await this.bot.sendMessage(chatId, `${AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS)} ❌ **Error en la búsqueda**

Ocurrió un problema al buscar ofertas. Esto puede deberse a:
• Problemas temporales con la API de Aerolíneas
• Código de aeropuerto incorrecto
• Fecha inválida

🔄 **Intenta nuevamente** en unos minutos o crea una alerta para recibir notificaciones automáticas.`);
    }
  }

  /**
   * Comando /mis-alertas-millas-ar - Ver alertas de millas de Aerolíneas
   */
  async handleMyAerolineasAlerts(chatId: number, userId: number): Promise<void> {
    try {
      const user = await UserModelPrisma.findOrCreate(userId);
      if (!user) {
        await this.bot.sendMessage(chatId, '❌ Usuario no encontrado. Usa /start primero.');
        return;
      }

      const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
      
      // Obtener alertas del usuario usando el modelo Prisma
      const alerts = await aerolineasAlertModelPrisma.findByTelegramUserId(userId.toString());
      
      if (alerts.length === 0) {
        await this.bot.sendMessage(
          chatId,
          `${airlineEmoji} 🏆 **Alertas de Millas - Aerolíneas Argentinas**

📭 No tienes alertas de millas activas.

💡 **Crea tu primera alerta:**
• Usa \`/millas-ar ORIGEN DESTINO FECHA\`
• Ejemplo: \`/millas-ar EZE MIA 2025-08-15\`

✈️ **Rutas populares:**
• Buenos Aires ↔ Miami: \`EZE-MIA\`
• Buenos Aires ↔ Madrid: \`EZE-MAD\`
• Buenos Aires ↔ Santiago: \`EZE-SCL\``,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🏆 Crear Alerta', callback_data: 'help_miles_alert' },
                  { text: '📋 Ver Ayuda', callback_data: 'help_commands' },
                ],
              ],
            },
          }
        );
        return;
      }

      // Formatear las alertas
      let message = `${airlineEmoji} 🏆 **Mis Alertas de Millas - Aerolíneas Argentinas**

📊 **${alerts.length} alerta${alerts.length > 1 ? 's' : ''} activa${alerts.length > 1 ? 's' : ''}**

`;

      for (let i = 0; i < alerts.length && i < 10; i++) { // Máximo 10 alertas
        const alert = alerts[i];
        const status = alert.isActive ? '🟢 Activa' : '🔴 Pausada';
        const maxMilesText = alert.maxMiles ? `${alert.maxMiles.toLocaleString()} millas max` : 'Sin límite';
        
        message += `**${i + 1}.** ${alert.origin} → ${alert.destination}
📅 ${alert.departureDate || 'Fecha flexible'}
👥 ${alert.adults} adulto${alert.adults > 1 ? 's' : ''}
🏆 ${maxMilesText}
${status}
🆔 \`${alert.id}\`

`;
      }

      if (alerts.length > 10) {
        message += `\n📋 *Mostrando 10 de ${alerts.length} alertas*`;
      }

      message += `\n💡 **Comandos útiles:**
• \`/millas-ar\` - Crear nueva alerta
• \`/millas-ar-search\` - Buscar ofertas inmediatas

🔔 Recibirás notificaciones cuando encontremos ofertas que cumplan tus criterios.`;

      await this.bot.sendMessage(
        chatId,
        message,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🏆 Nueva Alerta', callback_data: 'create_miles_alert' },
                { text: '🔍 Buscar Ofertas', callback_data: 'search_miles_now' },
              ],
            ],
          },
        }
      );

    } catch (error) {
      botLogger.error('Error obteniendo alertas de millas', error as Error, { userId });
      await this.bot.sendMessage(chatId, `${AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS)} ❌ Error obteniendo tus alertas de millas. Inténtalo de nuevo.`);
    }
  }

  /**
   * Comando /test-aerolineas - Diagnosticar API de Aerolíneas
   */
  async handleTestAerolineas(chatId: number): Promise<void> {
    try {
      const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
      
      await this.bot.sendMessage(chatId, `${airlineEmoji} 🔧 **Diagnóstico de API - Aerolíneas Argentinas**

🚧 Función de diagnóstico en desarrollo.

💡 Próximamente podrás verificar:
• Estado de conexión con la API
• Tiempo de respuesta
• Disponibilidad de rutas
• Calidad del servicio

🔍 El equipo está trabajando en la integración completa.`, {
        parse_mode: 'Markdown'
      });

    } catch (error) {
      botLogger.error('Error ejecutando diagnóstico Aerolíneas', error as Error);
      await this.bot.sendMessage(chatId, '❌ Error ejecutando diagnóstico de API.');
    }
  }

  // === MÉTODOS PRIVADOS ===

  /**
   * Validar aeropuerto de Aerolíneas Argentinas
   */
  private isValidAerolineasAirport(code: string): boolean {
    return isValidAerolineasAirport(code);
  }

  /**
   * Formatear mensaje de uso para alertas de millas
   */
  private formatAerolineasMilesUsage(): string {
    const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
    return `${airlineEmoji} *Uso del comando /millas-ar:*

*Sintaxis:*
\`/millas-ar ORIGEN DESTINO FECHA [MAX_MILLAS] [ADULTOS]\`

*Ejemplos:*
• \`/millas-ar EZE MIA 2026-03-15\` - Alerta básica
• \`/millas-ar EZE MIA 2026-03-15 50000\` - Con límite de millas
• \`/millas-ar EZE MIA 2026-03-15 50000 2\` - Para 2 adultos

*Parámetros:*
• **ORIGEN/DESTINO**: Códigos de aeropuerto (ej: EZE, MIA, SCL)
• **FECHA**: Formato YYYY-MM-DD
• **MAX_MILLAS**: Máximo de millas aceptable (opcional)
• **ADULTOS**: Número de adultos (1-9, defecto: 1)

*Aeropuertos principales:*
• Argentina: EZE (Buenos Aires), COR (Córdoba), MDZ (Mendoza)
• Internacional: MIA, SCL, LIM, BOG, NYC`;
  }

  /**
   * Formatear mensaje de uso para búsqueda de millas
   */
  private formatAerolineasSearchUsage(): string {
    const airlineEmoji = AirlineUtils.getAirlineEmoji(AirlineType.AEROLINEAS_ARGENTINAS);
    return `${airlineEmoji} *Uso del comando /millas-ar-search:*

*Sintaxis:*
\`/millas-ar-search ORIGEN DESTINO FECHA [MAX_MILLAS]\`

*Ejemplos:*
• \`/millas-ar-search EZE MIA 2026-03-15\` - Búsqueda básica
• \`/millas-ar-search EZE MIA 2026-03-15 50000\` - Con límite de millas

*Parámetros:*
• **ORIGEN/DESTINO**: Códigos de aeropuerto
• **FECHA**: Formato YYYY-MM-DD
• **MAX_MILLAS**: Filtrar por millas máximas (opcional)

💡 Esta búsqueda es inmediata y no crea alertas automáticas.`;
  }
}
