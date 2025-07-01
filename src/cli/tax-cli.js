#!/usr/bin/env node
import { Command } from 'commander';
import fetch from 'node-fetch';

const program = new Command();

program
  .name('tax-cli')
  .description('CLI for Tax Comparison Tool')
  .version('1.0.0');

// Calculate tax command
program
  .command('calculate')
  .description('Calculate tax for a given income and country')
  .requiredOption('-i, --income <number>', 'Annual income', parseFloat)
  .requiredOption('-c, --country <string>', 'Country code')
  .option('-y, --year <number>', 'Tax year', new Date().getFullYear())
  .option('-s, --server <url>', 'API server URL', 'http://localhost:3000')
  .action(async (options) => {
    try {
      const response = await fetch(`${options.server}/api/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: options.country,
          income: options.income,
          year: options.year
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error:', result.message || 'Failed to calculate tax');
        process.exit(1);
      }

      console.log('\nTax Calculation Result:');
      console.log('---------------------');
      console.log(`Country: ${result.country}`);
      console.log(`Year: ${result.year}`);
      console.log(`Income: ${result.income}`);
      console.log(`Tax Amount: ${result.taxAmount}`);
      console.log(`Effective Rate: ${result.effectiveRate}%`);
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Health check command
program
  .command('health')
  .description('Check API server health')
  .option('-s, --server <url>', 'API server URL', 'http://localhost:3000')
  .action(async (options) => {
    try {
      const response = await fetch(`${options.server}/health`);
      const result = await response.json();
      
      if (!response.ok) {
        console.error('API is not healthy');
        process.exit(1);
      }
      
      console.log('API Status:', result.status);
      console.log('Timestamp:', result.timestamp);
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);
