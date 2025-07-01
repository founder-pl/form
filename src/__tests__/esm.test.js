// Simple test to verify ESM support

describe('ESM Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should support ES modules', () => {
    // This is an ES module, so if we get here, ESM is working
    expect(true).toBe(true);
  });
});
