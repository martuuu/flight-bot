import { isValidIATACode, isValidPrice } from '../../utils/validation';
import { formatPrice, formatDate } from '../../utils/helpers';

describe('Validation Utils', () => {
  describe('isValidIATACode', () => {
    test('should validate correct airport codes', () => {
      expect(isValidIATACode('BOG')).toBe(true);
      expect(isValidIATACode('MIA')).toBe(true);
      expect(isValidIATACode('NYC')).toBe(true);
    });

    test('should reject invalid airport codes', () => {
      expect(isValidIATACode('BO')).toBe(false);
      expect(isValidIATACode('BOGOTA')).toBe(false);
      expect(isValidIATACode('123')).toBe(false);
      expect(isValidIATACode('')).toBe(false);
      expect(isValidIATACode('bog')).toBe(false); // lowercase
    });
  });

  describe('isValidPrice', () => {
    test('should validate correct prices', () => {
      expect(isValidPrice(100000)).toBe(true);
      expect(isValidPrice(50000)).toBe(true);
      expect(isValidPrice(2000000)).toBe(true);
    });

    test('should reject invalid prices', () => {
      expect(isValidPrice(0)).toBe(false);
      expect(isValidPrice(-100)).toBe(false);
      expect(isValidPrice(100000000)).toBe(false);
      expect(isValidPrice(NaN)).toBe(false);
    });
  });
});

describe('Helper Utils', () => {
  describe('formatPrice', () => {
    test('should format prices correctly', () => {
      expect(formatPrice(100000)).toContain('100.000');
      expect(formatPrice(1500000)).toContain('1.500.000');
    });
  });

  describe('formatDate', () => {
    test('should format dates correctly', () => {
      const date = new Date('2024-12-25T10:30:00');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('diciembre');
      expect(formatted).toContain('25');
    });
  });
});
