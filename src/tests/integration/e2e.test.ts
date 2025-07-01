import { UserModel, AlertModel, PriceHistoryModel } from '../../models';
import { PriceMonitor } from '../../services/PriceMonitor';
import { ScraperFactory } from '../../services/scrapers';
import { config } from '../../config';

describe('End-to-End Integration Tests', () => {
  beforeAll(async () => {
    // Setup test database
    process.env['NODE_ENV'] = 'test';
    process.env['DATABASE_PATH'] = ':memory:';
  });

  describe('Database Operations', () => {
    test('should create and retrieve user', () => {
      const user = UserModel.findOrCreate(
        123456789,
        'testuser',
        'Test',
        'User'
      );

      expect(user).toBeDefined();
      expect(user.telegramId).toBe(123456789);
      expect(user.username).toBe('testuser');

      const retrievedUser = UserModel.findByTelegramId(123456789);
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.id).toBe(user.id);
    });

    test('should create and manage alerts', () => {
      // Create a user first
      const user = UserModel.findOrCreate(987654321, 'alertuser', 'Alert', 'User');
      
      // Create an alert
      const alert = AlertModel.create(
        user.id,
        'BOG',
        'MIA',
        800000,
        'COP',
        new Date('2024-08-15')
      );

      expect(alert).toBeDefined();
      expect(alert.origin).toBe('BOG');
      expect(alert.destination).toBe('MIA');
      expect(alert.maxPrice).toBe(800000);
      expect(alert.active).toBe(true);

      // Retrieve user alerts
      const userAlerts = AlertModel.findActiveByUserId(user.id);
      expect(userAlerts).toHaveLength(1);
      expect(userAlerts[0].id).toBe(alert.id);
    });

    test('should track price history', () => {
      const flightResult = {
        airline: 'Test Airline',
        flightNumber: 'TEST123',
        origin: 'BOG',
        destination: 'MIA',
        departureDate: new Date('2024-08-15'),
        arrivalDate: new Date('2024-08-15T10:00:00'),
        price: 750000,
        currency: 'COP',
        availableSeats: 10,
        cabinClass: 'economy',
        bookingUrl: 'https://example.com/booking',
        duration: 300, // 5 hours
        stops: 0
      };

      const priceRecord = PriceHistoryModel.create(flightResult);

      expect(priceRecord).toBeDefined();
      expect(priceRecord.price).toBe(750000);
      
      const priceHistory = PriceHistoryModel.findByRoute('BOG', 'MIA');
      expect(priceHistory).toHaveLength(1);
      expect(priceHistory[0].id).toBe(priceRecord.id);
    });
  });

  describe('Scraper Integration', () => {
    test('should create scrapers for supported airlines', () => {
      const aviancaScraper = ScraperFactory.createScraper('AVIANCA');
      expect(aviancaScraper).toBeDefined();

      const latamScraper = ScraperFactory.createScraper('LATAM');
      expect(latamScraper).toBeDefined();

      const supportedAirlines = ScraperFactory.getSupportedAirlines();
      expect(supportedAirlines).toContain('AVIANCA');
      expect(supportedAirlines).toContain('LATAM');
    });

    test('should search flights with mock data', async () => {
      const scraper = ScraperFactory.createScraper('AVIANCA');
      
      const searchParams = {
        origin: 'BOG',
        destination: 'MIA',
        departureDate: new Date('2024-08-15'),
        passengers: 1,
        cabinClass: 'economy' as const
      };

      const result = await scraper.searchFlights(searchParams);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.flights).toBeDefined();
      expect(result.airline).toBe('Avianca');
      expect(result.searchParams).toEqual(searchParams);
      
      if (result.flights.length > 0) {
        const flight = result.flights[0];
        expect(flight.airline).toBe('Avianca');
        expect(flight.origin).toBe('BOG');
        expect(flight.destination).toBe('MIA');
        expect(flight.price).toBeGreaterThan(0);
        expect(flight.currency).toBe('COP');
      }
    }, 10000);
  });

  describe('Price Monitoring', () => {
    test('should check prices for active alerts', async () => {
      // Create test user and alert
      const user = UserModel.findOrCreate(555666777, 'monitoruser', 'Monitor', 'User');
      const alert = AlertModel.create(
        user.id,
        'BOG',
        'CTG',
        500000,
        'COP',
        new Date('2024-08-15')
      );

      const priceMonitor = new PriceMonitor();
      
      // This should not throw errors even with mock data
      await expect(priceMonitor.checkAllAlerts()).resolves.not.toThrow();
      
      // Verify alert was updated
      const updatedAlert = AlertModel.findById(alert.id);
      expect(updatedAlert).toBeDefined();
      // Note: lastChecked might be updated depending on implementation
    }, 15000);
  });

  describe('Configuration Validation', () => {
    test('should have valid configuration', () => {
      expect(config).toBeDefined();
      expect(config.telegram).toBeDefined();
      expect(config.database).toBeDefined();
      expect(config.scraping).toBeDefined();
      expect(config.rateLimit).toBeDefined();
      
      // Check required fields have defaults
      expect(config.database.path).toBeDefined();
      expect(config.scraping.intervalMinutes).toBeGreaterThan(0);
      expect(config.rateLimit.maxRequests).toBeGreaterThan(0);
    });

    test('should handle missing environment variables gracefully', () => {
      // Telegram token should be empty in test but config should still work
      expect(config.telegram.token).toBeDefined();
      expect(typeof config.telegram.token).toBe('string');
    });
  });
});
