import request from 'supertest';
import { apiRequest } from '../testHelpers';
import app from '../../api/server';

// Mock the tax calculation service
jest.mock('../../services/taxCalculator', () => ({
  calculateTaxForCountry: jest.fn()
}));

describe('Tax API', () => {
  beforeAll(() => {
    // Start the server before tests
    server = app.listen(3001);
  });

  afterAll((done) => {
    // Close the server after tests
    server.close(done);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/calculate', () => {
    it('should calculate tax for a given income and country', async () => {
      const mockTaxResult = {
        country: 'US',
        year: 2023,
        income: 50000,
        taxAmount: 10000,
        effectiveRate: 20
      };

      // Mock the tax calculation
      const { calculateTaxForCountry } = require('../../services/taxCalculator');
      calculateTaxForCountry.mockResolvedValue(mockTaxResult);

      const response = await request(server)
        .post('/api/calculate')
        .send({
          country: 'US',
          income: 50000,
          year: 2023
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTaxResult);
      expect(calculateTaxForCountry).toHaveBeenCalledWith('US', 50000, 2023);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(server)
        .post('/api/calculate')
        .send({
          // Missing required fields
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /health', () => {
    it('should return API status', async () => {
      const response = await request(server).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/countries', () => {
    it('should return list of supported countries', async () => {
      const mockCountries = [
        { code: 'US', name: 'United States' },
        { code: 'PL', name: 'Poland' }
      ];

      // Mock the countries service
      jest.mock('../../services/countries', () => ({
        getSupportedCountries: () => mockCountries
      }));

      const response = await request(server).get('/api/countries');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
