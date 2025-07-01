# Tax Comparison Tool - API and CLI

This project provides both a REST API and a command-line interface (CLI) for tax calculations.

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Link the CLI tool (optional, for global access):
   ```bash
   npm link
   ```

## REST API

The REST API provides endpoints for tax calculations.

### Starting the API Server

```bash
# Start in development mode (with auto-reload)
npm run start:dev

# Or start in production mode
npm start:api
```

The server will start on `http://localhost:3006` by default.

### API Endpoints

#### Calculate Tax
- **URL**: `POST /api/calculate`
- **Request Body**:
  ```json
  {
    "country": "US",
    "income": 50000,
    "year": 2023
  }
  ```
- **Response**:
  ```json
  {
    "country": "US",
    "year": 2023,
    "income": 50000,
    "taxAmount": 12500,
    "effectiveRate": 25
  }
  ```

#### Health Check
- **URL**: `GET /health`
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2023-07-01T09:30:00.000Z"
  }
  ```

## Command Line Interface (CLI)

The CLI provides an easy way to interact with the tax calculation functionality.

### Using the CLI

#### Calculate Tax
```bash
# Using npx
npx . calculate -i 50000 -c US

# Or if linked globally
tax-cli calculate -i 50000 -c US -y 2023

# With custom server
tax-cli calculate -i 50000 -c US -s http://api.example.com
```

#### Check API Health
```bash
tax-cli health
```

### CLI Options

#### Calculate Command
- `-i, --income <number>`: Annual income (required)
- `-c, --country <string>`: Country code (required)
- `-y, --year <number>`: Tax year (default: current year)
- `-s, --server <url>`: API server URL (default: http://localhost:3006)

## Development

### Running Tests
```bash
npm test
```

### Watching Tests
```bash
npm run test:watch
```

### Generating Test Coverage
```bash
npm run test:coverage
```

## License

This project is licensed under the terms of the MIT license.
