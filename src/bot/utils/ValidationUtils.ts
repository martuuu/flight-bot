import { airports } from '@/config';

/**
 * Utilidades de validación para comandos del bot
 */
export class ValidationUtils {
  /**
   * Validar código de aeropuerto
   */
  static isValidAirport(code: string): boolean {
    return Object.prototype.hasOwnProperty.call(airports, code.toUpperCase());
  }

  /**
   * Validar que dos códigos de aeropuerto sean diferentes
   */
  static areAirportsDifferent(origin: string, destination: string): boolean {
    return origin.toUpperCase() !== destination.toUpperCase();
  }

  /**
   * Validar precio
   */
  static isValidPrice(priceStr: string): { isValid: boolean; price?: number; error?: string } {
    const price = parseFloat(priceStr);
    
    if (isNaN(price)) {
      return { isValid: false, error: 'El precio debe ser un número válido' };
    }
    
    if (price <= 0) {
      return { isValid: false, error: 'El precio debe ser mayor a 0' };
    }
    
    return { isValid: true, price };
  }

  /**
   * Validar fecha en formato YYYY-MM-DD o YYYY-MM
   */
  static isValidDate(dateStr: string): { isValid: boolean; date?: Date; isMonthly?: boolean; error?: string } {
    // Formato YYYY-MM (mensual) o YYYY-MM-DD (diario)
    const monthlyPattern = /^\d{4}-\d{2}$/;
    const dailyPattern = /^\d{4}-\d{2}-\d{2}$/;
    
    const isMonthly = monthlyPattern.test(dateStr);
    const isDaily = dailyPattern.test(dateStr);
    
    if (!isMonthly && !isDaily) {
      return { 
        isValid: false, 
        error: 'Formato de fecha inválido. Use YYYY-MM para búsqueda mensual o YYYY-MM-DD para fecha específica' 
      };
    }

    // Validar que sea una fecha real
    const date = new Date(dateStr + (isMonthly ? '-01' : ''));
    
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Fecha inválida' };
    }

    // Validar que no sea una fecha pasada
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (date < now) {
      return { isValid: false, error: 'No puedes buscar fechas pasadas' };
    }

    return { isValid: true, date, isMonthly };
  }

  /**
   * Validar y formatear mes/año para alertas mensuales
   */
  static validateAndFormatMonth(monthYear: string): {
    isValid: boolean;
    formattedMonth?: string;
    error?: string;
  } {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    let targetMonth: number;
    let targetYear: number;

    // Procesar diferentes formatos
    if (monthYear.includes('/')) {
      // Formato MM/YYYY o M/YYYY
      const parts = monthYear.split('/');
      if (parts.length !== 2) {
        return { isValid: false, error: 'Formato inválido. Use MM/YYYY' };
      }
      
      targetMonth = parseInt(parts[0]);
      targetYear = parseInt(parts[1]);
    } else if (monthYear.includes('-')) {
      // Formato YYYY-MM
      const parts = monthYear.split('-');
      if (parts.length !== 2) {
        return { isValid: false, error: 'Formato inválido. Use YYYY-MM' };
      }
      
      targetYear = parseInt(parts[0]);
      targetMonth = parseInt(parts[1]);
    } else if (/^\d+$/.test(monthYear)) {
      // Solo número de mes, usar año actual
      targetMonth = parseInt(monthYear);
      targetYear = currentYear;
      
      // Si el mes ya pasó este año, usar año siguiente
      if (targetMonth < currentMonth) {
        targetYear++;
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
        return { isValid: false, error: 'Nombre de mes no reconocido' };
      }
      
      targetYear = currentYear;
      // Si el mes ya pasó este año, usar año siguiente
      if (targetMonth < currentMonth) {
        targetYear++;
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
   * Verificar si una cadena es formato de fecha válido
   */
  static isDateFormat(dateStr: string): boolean {
    const monthlyPattern = /^\d{4}-\d{2}$/;
    const dailyPattern = /^\d{4}-\d{2}-\d{2}$/;
    
    if (!monthlyPattern.test(dateStr) && !dailyPattern.test(dateStr)) {
      return false;
    }

    const date = new Date(dateStr + (monthlyPattern.test(dateStr) ? '-01' : ''));
    return !isNaN(date.getTime());
  }

  /**
   * Verificar si es fecha mensual (YYYY-MM)
   */
  static isMonthlyDate(dateStr: string): boolean {
    return /^\d{4}-\d{2}$/.test(dateStr);
  }

  /**
   * Validar número de adultos
   */
  static isValidAdultCount(adultsStr: string): { isValid: boolean; adults?: number; error?: string } {
    const adults = parseInt(adultsStr);
    
    if (isNaN(adults)) {
      return { isValid: false, error: 'El número de adultos debe ser un número válido' };
    }
    
    if (adults < 1 || adults > 9) {
      return { isValid: false, error: 'El número de adultos debe estar entre 1 y 9' };
    }
    
    return { isValid: true, adults };
  }
}
