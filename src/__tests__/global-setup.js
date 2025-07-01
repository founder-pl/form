// Use dynamic imports to avoid top-level await issues
(async () => {
  try {
    // Dynamically import @jest/globals
    const { jest, test, expect, describe, beforeEach, afterEach, beforeAll, afterAll } = 
      await import('@jest/globals');
    
    // Assign to global scope
    globalThis.jest = jest;
    globalThis.test = test;
    globalThis.expect = expect;
    globalThis.describe = describe;
    globalThis.beforeEach = beforeEach;
    globalThis.afterEach = afterEach;
    globalThis.beforeAll = beforeAll;
    globalThis.afterAll = afterAll;
  } catch (error) {
    console.error('Error in global setup:', error);
    process.exit(1);
  }
})();
