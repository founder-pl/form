// Basic ESM test with explicit imports
import { jest, test, expect } from '@jest/globals';

test('basic ESM test with explicit imports', () => {
  const mockFn = jest.fn();
  mockFn('test');
  expect(mockFn).toHaveBeenCalledWith('test');
});
