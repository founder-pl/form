import { runCliCommand, mockConsole } from '../testHelpers';

// Mock the API requests
jest.mock('node-fetch', () => jest.fn());

// Mock the process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

// Mock console.log and console.error
const { logs, errors } = mockConsole();

describe('Tax CLI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    logs.length = 0;
    errors.length = 0;
  });

  describe('calculate command', () => {
    it('should calculate tax with valid parameters', async () => {
      const fetch = require('node-fetch');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          country: 'US',
          year: 2023,
          income: 50000,
          taxAmount: 10000,
          effectiveRate: 20
        })
      });

      await runCliCommand('calculate -i 50000 -c US');

      expect(logs.some(log => log.includes('Tax Calculation Result:'))).toBe(true);
      expect(logs.some(log => log.includes('Income: 50000'))).toBe(true);
      expect(logs.some(log => log.includes('Tax Amount: 10000'))).toBe(true);
    });

    it('should handle API errors', async () => {
      const fetch = require('node-fetch');
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Invalid country code'
        })
      });

      await runCliCommand('calculate -i 50000 -c INVALID');

      expect(errors.some(err => err.includes('Error:'))).toBe(true);
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('health command', () => {
    it('should show API health status', async () => {
      const fetch = require('node-fetch');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'ok',
          timestamp: '2023-07-01T10:00:00.000Z'
        })
      });

      await runCliCommand('health');

      expect(logs.some(log => log.includes('API Status: ok'))).toBe(true);
    });
  });

  describe('help command', () => {
    it('should show help information', async () => {
      await runCliCommand('--help');

      expect(logs.some(log => log.includes('Usage:'))).toBe(true);
      expect(logs.some(log => log.includes('Commands:'))).toBe(true);
      expect(logs.some(log => log.includes('calculate'))).toBe(true);
      expect(logs.some(log => log.includes('health'))).toBe(true);
    });
  });

  describe('validation', () => {
    it('should require income parameter', async () => {
      await runCliCommand('calculate -c US');
      
      expect(errors.some(err => err.includes('required'))).toBe(true);
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should require country parameter', async () => {
      await runCliCommand('calculate -i 50000');
      
      expect(errors.some(err => err.includes('required'))).toBe(true);
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
