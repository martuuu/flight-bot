/**
 * Utilidades de validación
 */

/**
 * Validar código de aeropuerto IATA
 */
export function isValidIATACode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}

/**
 * Validar precio
 */
export function isValidPrice(price: number): boolean {
  return !isNaN(price) && price > 0 && price < 100000000; // Max 100M COP
}

/**
 * Validar fecha de vuelo
 */
export function isValidFlightDate(date: Date): boolean {
  const now = new Date();
  const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 año
  
  return date >= now && date <= maxDate;
}

/**
 * Validar ID de Telegram
 */
export function isValidTelegramId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

/**
 * Validar número de pasajeros
 */
export function isValidPassengerCount(count: number): boolean {
  return Number.isInteger(count) && count >= 1 && count <= 9;
}

/**
 * Validar clase de cabina
 */
export function isValidCabinClass(cabinClass: string): boolean {
  const validClasses = ['economy', 'premium', 'business', 'first'];
  return validClasses.includes(cabinClass.toLowerCase());
}

/**
 * Validar formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
