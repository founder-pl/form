// Direct test without any imports
test('direct test without imports', () => {
  const mockFn = jest.fn();
  mockFn('test');
  expect(mockFn).toHaveBeenCalledWith('test');
});
