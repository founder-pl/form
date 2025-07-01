// Simple CommonJS test
const { test, expect } = require('@jest/globals');

test('basic test', () => {
  const mockFn = jest.fn();
  mockFn('test');
  expect(mockFn).toHaveBeenCalledWith('test');
});
