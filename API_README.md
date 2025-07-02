# Tax Comparison Tool - API Documentation

This document provides comprehensive documentation for the Tax Comparison Tool REST API. The API allows you to perform tax calculations, retrieve country information, and access tax treaty data programmatically.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Calculate Tax](#calculate-tax)
  - [List Countries](#list-countries)
  - [Get Tax Treaty](#get-tax-treaty)
  - [Get Business Types](#get-business-types)
  - [Health Check](#health-check)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Authentication](#authentication)
- [Versioning](#versioning)
- [Examples](#examples)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/tax-comparison-tool.git
   cd tax-comparison-tool
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Server

```bash
# Start in development mode (with auto-reload)
npm run dev

# Start in production mode
NODE_ENV=production npm start
```

By default, the API server runs on `http://localhost:3006`.

## API Endpoints

### Base URL

All API endpoints are relative to the base URL: `http://localhost:3006/api`

### Calculate Tax

Calculate tax for a given income and country.

**Endpoint**: `POST /api/calculate`

**Request Body**:

```json
{
  "country": "PL",
  "income": 100000,
  "year": 2025,
  "businessType": "services",
  "isCitizen": false
}
```

**Parameters**:

- `country` (required): ISO 3166-1 alpha-2 country code (e.g., "PL", "DE", "US")
- `income` (required): Annual income as a number (must be positive)
- `year` (optional): Tax year (defaults to current year)
- `businessType` (optional): Type of business (defaults to "services")
- `isCitizen` (optional): Whether the person is a citizen of the country (defaults to false)

**Success Response (200 OK)**:

```json
{
  "country": "PL",
  "year": 2025,
  "income": 100000,
  "businessType": "services",
  "isCitizen": false,
  "taxAmount": 19000,
  "effectiveRate": 19.00,
  "currency": "PLN",
  "breakdown": {
    "incomeTax": 15000,
    "socialSecurity": 3500,
    "benefits": 500,
    "vat": 0
  }
}
```

**Error Responses**:

- `400 Bad Request`: Invalid input parameters
- `500 Internal Server Error`: Server error during calculation

## List Countries

Get a list of supported countries.

**Endpoint**: `GET /api/countries`

**Success Response (200 OK)**:

```json
[
  {
    "code": "PL",
    "name": "Poland",
    "currency": "PLN"
  },
  {
    "code": "DE",
    "name": "Germany",
    "currency": "EUR"
  },
  {
    "code": "US",
    "name": "United States",
    "currency": "USD"
  }
]
```

### Get Tax Treaty

Get tax treaty information between two countries.

**Endpoint**: `GET /api/tax-treaty/:country1/:country2`

**Parameters**:

- `country1`: First country code
- `country2`: Second country code

**Success Response (200 OK)**:

```json
{
  "countries": ["PL", "DE"],
  "treatyName": "Poland-Germany Double Taxation Treaty",
  "effectiveDate": "1991-05-22",
  "withholdingTaxRates": {
    "dividends": 10,
    "interest": 10,
    "royalties": 5
  },
  "permanentEstablishment": true,
  "exchangeOfInformation": true
}
```

**Error Response (404 Not Found)**:

```json
{
  "error": "No tax treaty found",
  "message": "No tax treaty found between PL and XX"
}
```

### Get Business Types

Get available business types for tax calculations.

**Endpoint**: `GET /api/business-types`

**Success Response (200 OK)**:

```json
[
  {
    "id": "services",
    "name": "IT Services",
    "description": "Professional services (consulting, IT, etc.)"
  },
  {
    "id": "ecommerce",
    "name": "E-commerce",
    "description": "Buying and selling goods online"
  },
  {
    "id": "consulting",
    "name": "Consulting",
    "description": "Expert advice and guidance"
  },
  {
    "id": "manufacturing",
    "name": "Manufacturing",
    "description": "Production of goods"
  }
]
```

### Health Check

Check if the API is running.

**Endpoint**: `GET /health`

**Success Response (200 OK)**:

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-03-31T12:00:00Z"
}
```

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {
    // Additional error details (if available)
  }
}
```

## Common Error Status Codes

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

The API is rate limited to 100 requests per minute per IP address. Exceeding this limit will result in a `429 Too Many Requests` response.

## Authentication

Most endpoints require authentication. Include your API key in the `Authorization` header:

```http
Authorization: Bearer your-api-key-here
```

## Versioning

The API is versioned. The current version is `v1`. Include the version in the URL:

```http
/api/v1/calculate
```

## Examples

### cURL Example

```bash
curl -X POST http://localhost:3006/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"country":"PL","income":100000}'
```

### JavaScript Example

```javascript
const response = await fetch('http://localhost:3006/api/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key-here'
  },
  body: JSON.stringify({
    country: 'PL',
    income: 100000,
    businessType: 'services'
  })
});

const data = await response.json();
console.log(data);
```

## Support

For support, please contact [support@example.com](mailto:support@example.com) or open an issue in our [GitHub repository](https://github.com/your-username/tax-comparison-tool/issues).
