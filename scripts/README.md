# Data Collection and Processing Scripts

This directory contains scripts to facilitate the collection and processing of country tax and benefit data for the Multi-Country Tax Comparison Tool.

## Scripts

### 1. `generate-country-prompts.js`

Generates structured prompts for collecting tax and benefit information for multiple countries using an LLM.

**Usage:**
```bash
node scripts/generate-country-prompts.js
```

**Output:**
- Creates a `prompts` directory with subdirectories for each country
- Each country directory contains two prompt files:
  - `{COUNTRY_CODE}_tax_prompt.txt` - For collecting tax-related information
  - `{COUNTRY_CODE}_benefits_prompt.txt` - For collecting benefit-related information

### 2. `process-country-responses.js`

Processes JSON responses from the LLM and converts them into the application's data format.

**Usage:**
1. After collecting responses from the LLM, save them in the respective country directories under `prompts/`
2. Name the response files with `_response.json` suffix (e.g., `US_tax_response.json`)
3. Run the script:

```bash
node scripts/process-country-responses.js
```

**Output:**
- Creates two files in the `data` directory:
  - `countries_processed.json` - Processed country tax data
  - `benefits_processed.json` - Processed benefit data

## Workflow

1. **Generate Prompts**
   ```bash
   node scripts/generate-country-prompts.js
   ```

2. **Collect Data**
   - Use the generated prompts with an LLM to collect country data
   - Save the LLM responses in the appropriate country directories
   - Name the files with `_response.json` suffix

3. **Process Responses**
   ```bash
   node scripts/process-country-responses.js
   ```

4. **Review and Import**
   - Review the generated `countries_processed.json` and `benefits_processed.json`
   - Manually merge the data with the main `countries.json` and `benefits.json` files

## Data Format

### Country Data (`countries.json`)

```json
{
  "US": {
    "name": "United States",
    "flag": "🇺🇸",
    "eu": false,
    "currency": "USD",
    "taxYear": {
      "starts": "01-01",
      "ends": "12-31"
    },
    "taxResidencyRules": {
      "daysThreshold": 183,
      "permanentEstablishment": true,
      "tieBreakerRules": "Tie-breaker rules from US tax treaties"
    },
    "taxRates": {
      "corporate": {
        "standardRate": 21,
        "reducedRates": []
      },
      "individual": {
        "progressive": true,
        "brackets": [
          {
            "threshold": 0,
            "rate": 10,
            "description": "Up to $9,950"
          }
        ]
      }
    },
    "vat": 0,
    "socialSecurity": {
      "employeeRate": 6.2,
      "employerRate": 6.2,
      "selfEmployedRate": 12.4,
      "ceiling": 142800,
      "healthcareIncluded": false,
      "notes": "Social Security tax in the US"
    },
    "notes": "Additional country-specific notes"
  }
}
```

### Benefit Data (`benefits.json`)

```json
{
  "US": {
    "familyBenefits": {
      "childBenefit": {
        "name": "Child Tax Credit",
        "description": "Tax credit for qualifying children",
        "amount": 2000,
        "ageLimit": 17,
        "incomeTested": true,
        "incomeThreshold": 200000,
        "notes": "Amount and phaseouts may vary by year"
      }
    },
    "socialWelfare": {
      "unemploymentBenefits": {
        "name": "Unemployment Insurance",
        "eligibilityMonths": 6,
        "benefitRate": 50,
        "maxBenefitDuration": 26,
        "notes": "Varies by state"
      }
    },
    "notes": "Additional benefit-related notes"
  }
}
```

## Adding New Countries

1. Add the country to the `countryInfo` object in `generate-country-prompts.js`
2. Run the prompt generation script
3. Collect data using the generated prompts
4. Process the responses
5. Merge the processed data with the main data files

## Best Practices

1. Always back up existing data files before processing new responses
2. Review the processed data for accuracy before merging
3. Keep the original LLM responses for reference
4. Document any manual adjustments made to the processed data

## Dependencies

- Node.js 14+ (for running the scripts)
- Access to an LLM service (for data collection)

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
