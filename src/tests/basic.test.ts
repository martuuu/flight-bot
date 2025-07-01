import { isValidIATACode, isValidPrice } from '../../utils/validation';
import { formatPrice, formatDate } from '../../utils/helpers';

describe('Basic Unit Tests', () => {
  describe('Validation Functions', () => {
    test('should validate IATA codes correctly', () => {
      expect(isValidIATACode('BOG')).toBe(true);
      expect(isValidIATACode('MIA')).toBe(true);
      expect(isValidIATACode('NYC')).toBe(true);
      
      expect(isValidIATACode('BO')).toBe(false);
      expect(isValidIATACode('BOGOTA')).toBe(false);
      expect(isValidIATACode('123')).toBe(false);
      expect(isValidIATACode('')).toBe(false);
    });

    test('should validate prices correctly', () => {
      expect(isValidPrice(100000)).toBe(true);
      expect(isValidPrice(50000)).toBe(true);
      expect(isValidPrice(2000000)).toBe(true);
      
      expect(isValidPrice(0)).toBe(false);
      expect(isValidPrice(-100)).toBe(false);
      expect(isValidPrice(100000000)).toBe(false);
    });
  });

  describe('Format Functions', () => {
    test('should format prices correctly', () => {
      const formatted = formatPrice(100000);
      expect(formatted).toContain('100');
      expect(formatted).toContain('$');
    });

    test('should format dates correctly', () => {
      const date = new Date('2024-12-25T10:30:00');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
    });
  });
});
