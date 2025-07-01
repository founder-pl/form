// Test utilities for ESM-compatible testing

// Using a simple object to avoid potential ESM issues
const testUtils = {
  createMockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },

  createMockRequest(body = {}, params = {}, query = {}) {
    return {
      body,
      params,
      query,
      headers: {},
    };
  },

  expectStatus(res, status) {
    expect(res.status).toHaveBeenCalledWith(status);
    return {
      withJson: (expected) => {
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(expected));
      }
    };
  }
};

export default testUtils;
