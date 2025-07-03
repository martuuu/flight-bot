import { AerolineasAlertService } from '../../services/AerolineasAlertService';
import { AerolineasAlertModel } from '../../models/AerolineasAlertModel';
import { 
  AerolineasSearchParams, 
  AerolineasAlert, 
  AerolineasCalendarResponse
} from '../../types/aerolineas-api';
import axios from 'axios';

// Mock axios to avoid making real API calls during tests
jest.mock('axios', () => ({
  get: jest.fn()
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock logger
jest.mock('../../utils/logger', () => ({
  scrapingLogger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('AerolineasAlertService', () => {
  let service: AerolineasAlertService;

  beforeEach(() => {
    service = new AerolineasAlertService();
    mockedAxios.get.mockClear();
  });

  describe('searchFlexibleCalendar', () => {
    it('should successfully search flexible calendar', async () => {
      const mockResponse: AerolineasCalendarResponse = {
        searchMetadata: {
          infoMessages: [],
          warnMessages: [],
          shoppingId: 'test-shopping-id',
          currency: 'MILES',
          flightType: 'ONE_WAY',
          routes: ['EZE-MIA'],
          discountsApplied: false,
          market: 'INTERNATIONAL',
          searchType: 'CALENDAR30'
        },
        calendarOffers: {
          '0': [{
            departure: '2025-08-01',
            leg: {
              segments: [{
                airline: 'AR',
                flightNumber: 'AR1234',
                departureAirport: 'EZE',
                arrivalAirport: 'MIA',
                departureTime: '2025-08-01T10:00:00',
                arrivalTime: '2025-08-01T16:00:00',
                duration: 'PT9H',
                aircraft: 'B777',
                cabinClass: 'Economy',
                bookingClass: 'Y',
                stops: 0
              }],
              dateDiff: 0
            },
            offerDetails: {
              cabinClass: 'Economy',
              miles: 50000,
              price: 120000,
              currency: 'MILES',
              availableSeats: 9,
              fareFamily: 'PROMO'
            },
            bestOffer: true,
            userSelection: false,
            soldOut: false
          }]
        }
      };

      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      const searchParams: AerolineasSearchParams = {
        origin: 'EZE',
        destination: 'MIA',
        departureDate: '2025-08-01',
        adults: 1,
        cabinClass: 'Economy',
        flightType: 'ONE_WAY',
        awardBooking: true,
        flexDates: true
      };

      const result = await service.searchFlexibleCalendar(searchParams);

      expect(result).toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/v1/flights/offers'),
        expect.objectContaining({
          headers: expect.any(Object),
          timeout: 30000
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const searchParams: AerolineasSearchParams = {
        origin: 'EZE',
        destination: 'MIA',
        departureDate: '2025-08-01',
        adults: 1,
        cabinClass: 'Economy',
        flightType: 'ONE_WAY',
        awardBooking: true,
        flexDates: true
      };

      await expect(service.searchFlexibleCalendar(searchParams)).rejects.toThrow('API Error');
    });
  });

  describe('searchPromoMiles', () => {
    it('should find promo miles deals', async () => {
      const mockCalendarResponse: AerolineasCalendarResponse = {
        searchMetadata: {
          infoMessages: [],
          warnMessages: [],
          shoppingId: 'test-shopping-id',
          currency: 'MILES',
          flightType: 'ONE_WAY',
          routes: ['EZE-MIA'],
          discountsApplied: false,
          market: 'INTERNATIONAL'
        },
        calendarOffers: {
          '0': [{
            departure: '2025-08-01',
            leg: {
              segments: [{
                airline: 'AR',
                flightNumber: 'AR1234',
                departureAirport: 'EZE',
                arrivalAirport: 'MIA',
                departureTime: '2025-08-01T10:00:00',
                arrivalTime: '2025-08-01T16:00:00',
                duration: 'PT9H',
                aircraft: 'B777',
                cabinClass: 'Economy',
                bookingClass: 'Y',
                stops: 0
              }],
              dateDiff: 0
            },
            offerDetails: {
              cabinClass: 'Economy',
              miles: 45000, // Promo miles (lower than usual)
              price: 120000,
              currency: 'MILES',
              availableSeats: 9,
              fareFamily: 'PROMO'
            },
            bestOffer: true,
            userSelection: false,
            soldOut: false
          }]
        }
      };

      const mockFlightResponse = {
        searchMetadata: {
          infoMessages: [],
          warnMessages: [],
          shoppingId: 'test-shopping-id',
          currency: 'MILES',
          flightType: 'ONE_WAY',
          routes: ['EZE-MIA'],
          discountsApplied: false,
          market: 'INTERNATIONAL'
        },
        facets: [],
        fareRules: [],
        fareFamilies: [],
        alternateOffers: {
          '0': [{
            id: 'offer-1',
            leg: {
              segments: [{
                airline: 'AR',
                flightNumber: 'AR1234',
                departureAirport: 'EZE',
                arrivalAirport: 'MIA',
                departureTime: '2025-08-01T10:00:00',
                arrivalTime: '2025-08-01T16:00:00',
                duration: 'PT9H',
                aircraft: 'B777',
                cabinClass: 'Economy',
                bookingClass: 'Y',
                stops: 0
              }],
              dateDiff: 0
            },
            offerDetails: {
              cabinClass: 'Economy',
              miles: 45000,
              price: 120000,
              currency: 'MILES',
              availableSeats: 9,
              fareFamily: 'PROMO'
            },
            price: 120000,
            miles: 45000,
            currency: 'MILES',
            fareFamily: 'PROMO',
            availableSeats: 9,
            restrictions: []
          }]
        },
        brandedOffers: {},
        sortingOptions: []
      };

      // Mock both API calls
      mockedAxios.get.mockResolvedValueOnce({ data: mockCalendarResponse });
      mockedAxios.get.mockResolvedValueOnce({ data: mockFlightResponse });

      const deals = await service.searchPromoMiles('EZE', 'MIA', '2025-08-01', {
        maxMiles: 50000,
        cabinClass: 'Economy',
        adults: 1
      });

      expect(deals).toHaveLength(1);
      expect(deals[0]).toMatchObject({
        origin: 'EZE',
        destination: 'MIA',
        departureDate: '2025-08-01',
        miles: 45000,
        isPromo: true,
        cabinClass: 'Economy'
      });
    });

    it('should filter out deals exceeding max miles', async () => {
      const mockCalendarResponse: AerolineasCalendarResponse = {
        searchMetadata: {
          infoMessages: [],
          warnMessages: [],
          shoppingId: 'test-shopping-id',
          currency: 'MILES',
          flightType: 'ONE_WAY',
          routes: ['EZE-MIA'],
          discountsApplied: false,
          market: 'INTERNATIONAL'
        },
        calendarOffers: {
          '0': [{
            departure: '2025-08-01',
            leg: {
              segments: [{
                airline: 'AR',
                flightNumber: 'AR1234',
                departureAirport: 'EZE',
                arrivalAirport: 'MIA',
                departureTime: '2025-08-01T10:00:00',
                arrivalTime: '2025-08-01T16:00:00',
                duration: 'PT9H',
                aircraft: 'B777',
                cabinClass: 'Economy',
                bookingClass: 'Y',
                stops: 0
              }],
              dateDiff: 0
            },
            offerDetails: {
              cabinClass: 'Economy',
              miles: 60000, // Exceeds max miles
              price: 120000,
              currency: 'MILES',
              availableSeats: 9,
              fareFamily: 'PROMO'
            },
            bestOffer: true,
            userSelection: false,
            soldOut: false
          }]
        }
      };

      mockedAxios.get.mockResolvedValue({ data: mockCalendarResponse });

      const deals = await service.searchPromoMiles('EZE', 'MIA', '2025-08-01', {
        maxMiles: 50000,
        cabinClass: 'Economy',
        adults: 1
      });

      expect(deals).toHaveLength(0);
    });
  });
});

describe('AerolineasAlertModel', () => {
  let model: AerolineasAlertModel;
  const testDbPath = ':memory:'; // Use in-memory database for tests

  beforeEach(() => {
    model = new AerolineasAlertModel(testDbPath);
    
    // Create a users table for foreign key constraints
    const createUsersTableSql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        telegram_id INTEGER UNIQUE,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `;
    
    (model as any).db.exec(createUsersTableSql);
    
    // Insert a test user
    const insertUserSql = `
      INSERT INTO users (id, telegram_id, username, first_name) 
      VALUES (123, 123, 'testuser', 'Test User')
    `;
    (model as any).db.exec(insertUserSql);
  });

  describe('create', () => {
    it('should create a new alert', () => {
      const alertData: Omit<AerolineasAlert, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: 123,
        origin: 'EZE',
        destination: 'MIA',
        departureDate: '2025-08-01',
        adults: 1,
        cabinClass: 'Economy',
        flightType: 'ONE_WAY',
        searchType: 'PROMO',
        maxMiles: 50000,
        isActive: true
      };

      const alert = model.create(alertData);

      expect(alert).toMatchObject(alertData);
      expect(alert.id).toBeDefined();
      expect(alert.createdAt).toBeInstanceOf(Date);
      expect(alert.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findByUserId', () => {
    it('should find alerts for a user', () => {
      const userId = 123;
      const alertData: Omit<AerolineasAlert, 'id' | 'createdAt' | 'updatedAt'> = {
        userId,
        origin: 'EZE',
        destination: 'MIA',
        departureDate: '2025-08-01',
        adults: 1,
        cabinClass: 'Economy',
        flightType: 'ONE_WAY',
        searchType: 'PROMO',
        maxMiles: 50000,
        isActive: true
      };

      model.create(alertData);
      
      // Create an inactive alert
      model.create({
        ...alertData,
        isActive: false
      });

      const userAlerts = model.findByUserId(userId);

      expect(userAlerts).toHaveLength(2);
      expect(userAlerts.some(alert => alert.isActive)).toBe(true);
      expect(userAlerts.some(alert => !alert.isActive)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update an existing alert', () => {
      const alertData: Omit<AerolineasAlert, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: 123,
        origin: 'EZE',
        destination: 'MIA',
        departureDate: '2025-08-01',
        adults: 1,
        cabinClass: 'Economy',
        flightType: 'ONE_WAY',
        searchType: 'PROMO',
        maxMiles: 50000,
        isActive: true
      };

      const alert = model.create(alertData);
      
      const updated = model.update(alert.id, {
        maxMiles: 40000,
        isActive: false
      });

      expect(updated).toBe(true);
      
      // Verify the update by fetching the alert again
      const updatedAlert = model.findById(alert.id);
      expect(updatedAlert?.maxMiles).toBe(40000);
      expect(updatedAlert?.isActive).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete an alert', () => {
      const alertData: Omit<AerolineasAlert, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: 123,
        origin: 'EZE',
        destination: 'MIA',
        departureDate: '2025-08-01',
        adults: 1,
        cabinClass: 'Economy',
        flightType: 'ONE_WAY',
        searchType: 'PROMO',
        maxMiles: 50000,
        isActive: true
      };

      const alert = model.create(alertData);
      
      const deleted = model.delete(alert.id);
      expect(deleted).toBe(true);

      const foundAlert = model.findById(alert.id);
      expect(foundAlert).toBeNull();
    });
  });
});
