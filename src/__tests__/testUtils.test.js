import testUtils from './testUtils.js';

describe('Test Utilities', () => {
  describe('createMockResponse', () => {
    it('should create a mock response object with chainable methods', () => {
      const res = testUtils.createMockResponse();
      
      // Test method chaining
      const result = res.status(200).json({ message: 'success' });
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'success' });
      expect(result).toBe(res);
    });
  });

  describe('createMockRequest', () => {
    it('should create a mock request with the provided data', () => {
      const body = { name: 'Test' };
      const params = { id: '123' };
      const query = { page: '1' };
      
      const req = testUtils.createMockRequest(body, params, query);
      
      expect(req.body).toBe(body);
      expect(req.params).toBe(params);
      expect(req.query).toBe(query);
      expect(req.headers).toEqual({});
    });
  });

  describe('expectStatus', () => {
    it('should verify the status and return an object for further assertions', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      
      const assertion = testUtils.expectStatus(res, 200);
      
      expect(res.status).toHaveBeenCalledWith(200);
      
      // Test chained withJson assertion
      assertion.withJson({ success: true });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });
});
