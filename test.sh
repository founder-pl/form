#!/bin/bash

# Test API endpoints using curl

# Base URL
BASE_URL="http://localhost:3006"

# Test 1: Valid tax calculation for Germany
echo "\nTest 1: Valid tax calculation for Germany"
curl -X POST ${BASE_URL}/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "country": "DE",
    "income": 50000,
    "year": 2023,
    "businessType": "services",
    "isCitizen": false
  }'

# Test 2: Valid tax calculation for Poland
echo "\nTest 2: Valid tax calculation for Poland"
curl -X POST ${BASE_URL}/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "country": "PL",
    "income": 60000,
    "year": 2023,
    "businessType": "production",
    "isCitizen": true
  }'

# Test 3: Invalid country code
echo "\nTest 3: Invalid country code"
curl -X POST ${BASE_URL}/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "country": "XX",
    "income": 50000,
    "year": 2023,
    "businessType": "services",
    "isCitizen": false
  }'

# Test 4: Invalid income (negative)
echo "\nTest 4: Invalid income (negative)"
curl -X POST ${BASE_URL}/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "country": "DE",
    "income": -1000,
    "year": 2023,
    "businessType": "services",
    "isCitizen": false
  }'

# Test 5: Invalid year (too old)
echo "\nTest 5: Invalid year (too old)"
curl -X POST ${BASE_URL}/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "country": "DE",
    "income": 50000,
    "year": 1999,
    "businessType": "services",
    "isCitizen": false
  }'

# Test 6: Get business types for Germany
echo "\nTest 6: Get business types for Germany"
curl -X GET ${BASE_URL}/api/business-types/DE

# Test 7: Get tax treaty between Poland and Germany
echo "\nTest 7: Get tax treaty between Poland and Germany"
curl -X GET ${BASE_URL}/api/tax-treaty/PL/DE
