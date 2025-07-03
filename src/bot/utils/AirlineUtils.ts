/**
 * Utilidades para manejo de aerolíneas
 */

export enum AirlineType {
  ARAJET = 'ARAJET',
  AEROLINEAS_ARGENTINAS = 'AEROLINEAS_ARGENTINAS',
  AVIANCA = 'AVIANCA',
  LATAM = 'LATAM',
  VIVA = 'VIVA',
  WINGO = 'WINGO'
}

export interface AirlineInfo {
  code: AirlineType;
  name: string;
  displayName: string;
  supportsMonthlyAlerts: boolean;
  supportsMilesAlerts: boolean;
  isActive: boolean;
}

export class AirlineUtils {
  private static readonly AIRLINES: Record<AirlineType, AirlineInfo> = {
    [AirlineType.ARAJET]: {
      code: AirlineType.ARAJET,
      name: 'arajet',
      displayName: 'Arajet',
      supportsMonthlyAlerts: true,
      supportsMilesAlerts: false,
      isActive: true
    },
    [AirlineType.AEROLINEAS_ARGENTINAS]: {
      code: AirlineType.AEROLINEAS_ARGENTINAS,
      name: 'aerolineas-argentinas',
      displayName: 'Aerolíneas Argentinas',
      supportsMonthlyAlerts: false,
      supportsMilesAlerts: true,
      isActive: true
    },
    [AirlineType.AVIANCA]: {
      code: AirlineType.AVIANCA,
      name: 'avianca',
      displayName: 'Avianca',
      supportsMonthlyAlerts: false,
      supportsMilesAlerts: false,
      isActive: false // Para implementar más adelante
    },
    [AirlineType.LATAM]: {
      code: AirlineType.LATAM,
      name: 'latam',
      displayName: 'LATAM',
      supportsMonthlyAlerts: false,
      supportsMilesAlerts: false,
      isActive: false // Para implementar más adelante
    },
    [AirlineType.VIVA]: {
      code: AirlineType.VIVA,
      name: 'viva',
      displayName: 'Viva Air',
      supportsMonthlyAlerts: false,
      supportsMilesAlerts: false,
      isActive: false // Para implementar más adelante
    },
    [AirlineType.WINGO]: {
      code: AirlineType.WINGO,
      name: 'wingo',
      displayName: 'Wingo',
      supportsMonthlyAlerts: false,
      supportsMilesAlerts: false,
      isActive: false // Para implementar más adelante
    }
  };

  /**
   * Obtener información de una aerolínea
   */
  static getAirlineInfo(airlineType: AirlineType): AirlineInfo {
    return this.AIRLINES[airlineType];
  }

  /**
   * Obtener todas las aerolíneas activas
   */
  static getActiveAirlines(): AirlineInfo[] {
    return Object.values(this.AIRLINES).filter(airline => airline.isActive);
  }

  /**
   * Obtener aerolíneas que soportan alertas mensuales
   */
  static getMonthlyAlertAirlines(): AirlineInfo[] {
    return Object.values(this.AIRLINES).filter(
      airline => airline.isActive && airline.supportsMonthlyAlerts
    );
  }

  /**
   * Obtener aerolíneas que soportan alertas de millas
   */
  static getMilesAlertAirlines(): AirlineInfo[] {
    return Object.values(this.AIRLINES).filter(
      airline => airline.isActive && airline.supportsMilesAlerts
    );
  }

  /**
   * Detectar aerolínea por comando
   */
  static detectAirlineFromCommand(command: string): AirlineType | null {
    const normalizedCommand = command.toLowerCase();
    
    // Comandos específicos de Arajet
    if (normalizedCommand.includes('monthlyalert') || 
        normalizedCommand.includes('arajet')) {
      return AirlineType.ARAJET;
    }
    
    // Comandos específicos de Aerolíneas Argentinas
    if (normalizedCommand.includes('millas-ar') || 
        normalizedCommand.includes('aerolineas')) {
      return AirlineType.AEROLINEAS_ARGENTINAS;
    }
    
    // Por defecto, para comandos generales, usar Arajet (por ahora)
    return AirlineType.ARAJET;
  }

  /**
   * Obtener emoji de aerolínea
   */
  static getAirlineEmoji(airlineType: AirlineType): string {
    switch (airlineType) {
      case AirlineType.ARAJET:
        return '🟦';
      case AirlineType.AEROLINEAS_ARGENTINAS:
        return '🇦🇷';
      case AirlineType.AVIANCA:
        return '🔴';
      case AirlineType.LATAM:
        return '🟣';
      case AirlineType.VIVA:
        return '🟠';
      case AirlineType.WINGO:
        return '🟡';
      default:
        return '✈️';
    }
  }

  /**
   * Generar lista de aerolíneas para selección
   */
  static generateAirlineSelectionKeyboard(): any[][] {
    const activeAirlines = this.getActiveAirlines();
    const keyboard: any[][] = [];
    
    // Agrupar de a 2 por fila
    for (let i = 0; i < activeAirlines.length; i += 2) {
      const row = [];
      
      const airline1 = activeAirlines[i];
      if (airline1) {
        row.push({
          text: `${this.getAirlineEmoji(airline1.code)} ${airline1.displayName}`,
          callback_data: `select_airline_${airline1.name}`
        });
      }
      
      const airline2 = activeAirlines[i + 1];
      if (airline2) {
        row.push({
          text: `${this.getAirlineEmoji(airline2.code)} ${airline2.displayName}`,
          callback_data: `select_airline_${airline2.name}`
        });
      }
      
      keyboard.push(row);
    }
    
    return keyboard;
  }

  /**
   * Validar si una aerolínea soporta una funcionalidad específica
   */
  static supportsFeature(airlineType: AirlineType, feature: 'monthly' | 'miles'): boolean {
    const airline = this.getAirlineInfo(airlineType);
    
    switch (feature) {
      case 'monthly':
        return airline.supportsMonthlyAlerts;
      case 'miles':
        return airline.supportsMilesAlerts;
      default:
        return false;
    }
  }
}
