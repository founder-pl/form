import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Helper function to run CLI commands
 * @param {string} command - CLI command to run
 * @returns {Promise<{stdout: string, stderr: string}>} Command output
 */
export async function runCliCommand(command) {
  try {
    const { stdout, stderr } = await execAsync(`node src/cli/tax-cli.js ${command}`);
    return { stdout, stderr };
  } catch (error) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
      code: error.code
    };
  }
}

/**
 * Helper function to make HTTP requests to the API
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method
 * @param {string} options.path - API path
 * @param {Object} [options.body] - Request body
 * @returns {Promise<Object>} Response data
 */
export async function apiRequest({ method, path, body }) {
  const baseUrl = 'http://localhost:3005';
  const url = `${baseUrl}${path}`;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  const data = await response.json();
  return {
    status: response.status,
    data
  };
}

// Mock console.log and console.error for CLI tests
export function mockConsole() {
  const originalLog = console.log;
  const originalError = console.error;
  const logs = [];
  const errors = [];

  beforeAll(() => {
    console.log = (...args) => logs.push(args.map(String).join(' '));
    console.error = (...args) => errors.push(args.map(String).join(' '));
  });

  afterAll(() => {
    console.log = originalLog;
    console.error = originalError;
  });

  return { logs, errors };
}
