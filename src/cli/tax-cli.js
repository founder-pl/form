#!/usr/bin/env node
import { Command } from 'commander';
import fetch from 'node-fetch';
import chalk from 'chalk';
import Table from 'cli-table3';
import figlet from 'figlet';

const program = new Command();

// Add some colors
const { green, red, yellow, blue, cyan } = chalk;

// ASCII Art for the CLI
console.log(
  cyan(
    figlet.textSync('Tax CLI', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    })
  )
);

program
  .name('tax-cli')
  .description('CLI for Tax Comparison Tool')
  .version('1.0.0', '-v, --version', 'Show version')
  .option('-s, --server <url>', 'API server URL', 'http://localhost:3005');

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, server } = options;
  const url = `${server}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return { data };
  } catch (error) {
    console.error(red(`Error: ${error.message}`));
    process.exit(1);
  }
}

// Format currency
function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Calculate tax command
program
  .command('calculate')
  .description('Calculate tax for a given income and country')
  .requiredOption('-i, --income <number>', 'Annual income', parseFloat)
  .requiredOption('-c, --country <code>', 'Country code (e.g., US, PL, DE)')
  .option('-y, --year <number>', 'Tax year', new Date().getFullYear())
  .option('-t, --type <type>', 'Business type', 'services')
  .option('--citizen', 'Is citizen of the country', false)
  .action(async (options) => {
    try {
      const { data } = await apiRequest('/api/calculate', {
        method: 'POST',
        server: options.parent.server,
        body: {
          country: options.country,
          income: options.income,
          year: options.year,
          businessType: options.type,
          isCitizen: options.citizen,
        },
      });

      // Create a table for the results
      const table = new Table({
        head: [green('Category'), green('Amount')],
        colWidths: [30, 30],
      });

      table.push(
        ['Country', data.country],
        ['Year', data.year],
        ['Business Type', data.businessType],
        ['Is Citizen', data.isCitizen ? 'Yes' : 'No'],
        ['Income', formatCurrency(data.income, data.currency)],
        ['Tax Amount', formatCurrency(data.taxAmount, data.currency)],
        ['Effective Rate', `${data.effectiveRate}%`],
        ['Net Income', formatCurrency(data.income - data.taxAmount, data.currency)]
      );

      console.log('\n' + yellow('Tax Calculation Results:'));
      console.log(table.toString());

      // Show breakdown if available
      if (data.breakdown) {
        const breakdownTable = new Table({
          head: [green('Breakdown'), green('Amount')],
          colWidths: [30, 30],
        });

        Object.entries(data.breakdown).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());
            
            const formattedValue = typeof value === 'number' 
              ? formatCurrency(value, data.currency)
              : value;
              
            breakdownTable.push([formattedKey, formattedValue]);
          }
        });

        console.log('\n' + yellow('Tax Breakdown:'));
        console.log(breakdownTable.toString());
      }
    } catch (error) {
      console.error(red('Error calculating tax:'), error.message);
      process.exit(1);
    }
  });

// List countries command
program
  .command('countries')
  .description('List all supported countries')
  .action(async (options) => {
    try {
      const { data: countries } = await apiRequest('/api/countries', {
        server: options.parent.server,
      });

      const table = new Table({
        head: [green('Code'), green('Name'), green('Currency')],
        colWidths: [10, 30, 15],
      });

      countries.forEach(country => {
        table.push([country.code, country.name, country.currency]);
      });

      console.log('\n' + yellow('Supported Countries:'));
      console.log(table.toString());
    } catch (error) {
      console.error(red('Error fetching countries:'), error.message);
      process.exit(1);
    }
  });

// Get tax treaty command
program
  .command('treaty <country1> <country2>')
  .description('Get tax treaty information between two countries')
  .action(async (country1, country2, options) => {
    try {
      const { data: treaty } = await apiRequest(
        `/api/tax-treaty/${country1.toUpperCase()}/${country2.toUpperCase()}`,
        { server: options.parent.server }
      );

      const table = new Table({
        head: [green('Field'), green('Value')],
        colWidths: [30, 50],
      });

      Object.entries(treaty).forEach(([key, value]) => {
        if (typeof value === 'object') {
          table.push([key, JSON.stringify(value, null, 2)]);
        } else {
          table.push([key, String(value)]);
        }
      });

      console.log(`\n${yellow(`Tax Treaty between ${country1.toUpperCase()} and ${country2.toUpperCase()}:`)}`);
      console.log(table.toString());
    } catch (error) {
      console.error(red('Error fetching tax treaty:'), error.message);
      process.exit(1);
    }
  });

// Health check command
program
  .command('health')
  .description('Check API server health')
  .action(async (options) => {
    try {
      const { data } = await apiRequest('/health', { server: options.parent.server });
      
      const table = new Table({
        head: [green('Status'), green('Value')],
        colWidths: [20, 60],
      });

      table.push(
        ['Status', data.status],
        ['Version', data.version],
        ['Environment', data.environment],
        ['Timestamp', data.timestamp]
      );

      console.log('\n' + yellow('API Health Status:'));
      console.log(table.toString());
    } catch (error) {
      console.error(red('API is not healthy:'), error.message);
      process.exit(1);
    }
  });

// Show help if no command is provided
if (process.argv.length <= 2) {
  program.help();
}

// Parse command line arguments
program.parse(process.argv);
