# Tax Comparison Tool - API & CLI Documentation

This document provides detailed information about the Tax Comparison Tool's REST API and Command Line Interface (CLI).

## Table of Contents
- [API Endpoints](#api-endpoints)
  - [Calculate Tax](#calculate-tax)
  - [List Countries](#list-countries)
  - [Get Tax Treaty](#get-tax-treaty)
  - [List Business Types](#list-business-types)
  - [Health Check](#health-check)
- [CLI Commands](#cli-commands)
  - [Calculate Tax](#calculate-tax-1)
  - [List Countries](#list-countries-1)
  - [Get Tax Treaty](#get-tax-treaty-1)
  - [Health Check](#health-check-1)
- [Examples](#examples)
- [Development](#development)

## API Endpoints

### Calculate Tax
Calculate tax for a given income and country.

**Endpoint**: `POST /api/calculate`

**Request Body**:
```json
{
  "country": "US",
  "income": 50000,
  "year": 2023,
  "businessType": "services",
  "isCitizen": false
}
```

**Response**:
```json
{
  "country": "US",
  "year": 2023,
  "income": 50000,
  "businessType": "services",
  "isCitizen": false,
  "taxAmount": 10000,
  "effectiveRate": 20,
  "currency": "USD",
  "breakdown": {
    "incomeTax": 8000,
    "socialSecurity": 2000,
    "benefits": 0,
    "vat": 0
  }
}
```

### List Countries
Get a list of supported countries.

**Endpoint**: `GET /api/countries`

**Response**:
```json
[
  {
    "code": "US",
    "name": "United States",
    "currency": "USD"
  },
  {
    "code": "PL",
    "name": "Poland",
    "currency": "PLN"
  }
]
```

### Get Tax Treaty
Get tax treaty information between two countries.

**Endpoint**: `GET /api/tax-treaty/:country1/:country2`

**Response**:
```json
{
  "countries": ["PL", "DE"],
  "treatyName": "Germany-Poland Tax Treaty",
  "effectiveDate": "1994-01-01",
  "withholdingTax": {
    "dividends": 15,
    "interest": 10,
    "royalties": 5
  },
  "tieBreakerRules": true
}
```

### List Business Types
Get a list of supported business types.

**Endpoint**: `GET /api/business-types`

**Response**:
```json
[
  "services",
  "trade",
  "production",
  "freelance"
]
```

### Health Check
Check API health status.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2023-07-01T12:00:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

## CLI Commands

The Tax CLI provides a command-line interface to interact with the Tax Comparison Tool.

### Calculate Tax
Calculate tax for a given income and country.

**Command**:
```bash
npm run cli calculate -i 50000 -c US -y 2023 --type services --citizen
```

**Options**:
- `-i, --income <number>`: Annual income (required)
- `-c, --country <code>`: Country code (required)
- `-y, --year <number>`: Tax year (default: current year)
- `-t, --type <type>`: Business type (default: "services")
- `--citizen`: If the person is a citizen of the country
- `-s, --server <url>`: API server URL (default: "http://localhost:3000")

### List Countries
List all supported countries.

**Command**:
```bash
npm run cli countries
```

### Get Tax Treaty
Get tax treaty information between two countries.

**Command**:
```bash
npm run cli treaty PL DE
```

### Health Check
Check API health status.

**Command**:
```bash
npm run cli health
```

## Examples

1. Calculate tax for a US citizen earning $75,000:
   ```bash
   npm run cli calculate -i 75000 -c US --citizen
   ```

2. Calculate tax for a non-citizen in Poland earning 200,000 PLN:
   ```bash
   npm run cli calculate -i 200000 -c PL
   ```

3. Get tax treaty information between Germany and Poland:
   ```bash
   npm run cli treaty DE PL
   ```

## Development

### Running Tests

Run all tests:
```bash
npm test
```

Run API tests:
```bash
npm run test:api
```

Run CLI tests:
```bash
npm run test:cli
```

### Starting the Development Server

```bash
npm run start:dev
```

### Building for Production

```bash
npm run build
```
### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
