#!/usr/bin/env node

/**
 * Script to generate LLM prompts for collecting country tax and benefit data
 * 
 * This script generates prompts that can be used to collect consistent and comprehensive
 * tax and benefit information for different countries. The prompts are designed to be
 * used with an LLM to gather structured data that can be directly imported into the
 * application's data files.
 */

const fs = require('fs');
const path = require('path');
const countries = require('../data/countries.json');

// Output directory for generated prompts
const OUTPUT_DIR = path.join(__dirname, '../prompts');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Template for country data collection
const COUNTRY_PROMPT_TEMPLATE = `You are an expert in international tax law and social benefits systems. Please provide detailed information about the tax system and benefits in {COUNTRY_NAME} ({COUNTRY_CODE}) in the following JSON format. Be as precise and comprehensive as possible, including all relevant tax rates, brackets, and benefit programs. If any information is not applicable, please set it to null.

{
  "countryCode": "{COUNTRY_CODE}",
  "name": "{COUNTRY_NAME}",
  "flag": "{FLAG}",
  "euMember": boolean,
  "currency": "{CURRENCY_CODE}",
  "taxYear": {
    "starts": "YYYY-MM-DD",
    "ends": "YYYY-MM-DD"
  },
  "taxResidencyRules": {
    "daysThreshold": number,
    "permanentEstablishment": boolean,
    "tieBreakerRules": string
  },
  "taxRates": {
    "corporate": {
      "standardRate": number,
      "reducedRates": [
        {
          "rate": number,
          "description": "string"
        }
      ]
    },
    "individual": {
      "progressive": boolean,
      "brackets": [
        {
          "threshold": number,
          "rate": number,
          "description": "string"
        }
      ]
    },
    "capitalGains": {
      "shortTermRate": number,
      "longTermRate": number,
      "longTermThreshold": number,
      "exemptions": ["string"]
    },
    "dividends": {
      "domesticRate": number,
      "foreignRate": number,
      "participationExemption": boolean
    },
    "interest": {
      "rate": number,
      "taxExemptAmount": number
    },
    "royalties": {
      "domesticRate": number,
      "foreignRate": number,
      "treatyRates": [
        {
          "countryCode": "string",
          "rate": number
        }
      ]
    }
  },
  "vat": {
    "standardRate": number,
    "reducedRates": [
      {
        "rate": number,
        "description": "string"
      }
    ],
    "registrationThreshold": number,
    "intraCommunityRules": string
  },
  "socialSecurity": {
    "employeeRate": number,
    "employerRate": number,
    "selfEmployedRate": number,
    "ceiling": number,
    "healthcareIncluded": boolean,
    "pensionIncluded": boolean,
    "unemploymentIncluded": boolean,
    "notes": "string"
  },
  "healthInsurance": {
    "mandatory": boolean,
    "publicRate": number,
    "privateOptions": boolean,
    "notes": "string"
  },
  "pensionSystem": {
    "contributionRate": number,
    "employerContribution": number,
    "employeeContribution": number,
    "retirementAge": {
      "men": number,
      "women": number
    },
    "notes": "string"
  },
  "unemploymentBenefits": {
    "eligibilityMonths": number,
    "benefitRate": number,
    "maxBenefitDuration": number,
    "notes": "string"
  },
  "familyBenefits": {
    "childBenefit": {
      "monthlyAmount": number,
      "ageLimit": number,
      "studentAgeLimit": number,
      "notes": "string"
    },
    "parentalLeave": {
      "durationWeeks": number,
      "paidPercentage": number,
      "maxBenefit": number,
      "notes": "string"
    },
    "otherBenefits": [
      {
        "name": "string",
        "description": "string",
        "amount": number,
        "eligibility": "string"
      }
    ]
  },
  "taxIncentives": [
    {
      "name": "string",
      "description": "string",
      "requirements": "string",
      "benefits": "string"
    }
  ],
  "doubleTaxationTreaties": ["string"],
  "taxFiling": {
    "deadline": "string",
    "extensionsAvailable": boolean,
    "paymentDeadline": "string",
    "filingMethod": ["online", "paper"],
    "notes": "string"
  },
  "specialRegimes": [
    {
      "name": "string",
      "description": "string",
      "eligibility": "string",
      "benefits": "string"
    }
  ],
  "digitalNomadVisa": {
    "available": boolean,
    "minimumIncome": number,
    "durationMonths": number,
    "taxExemptions": "string",
    "notes": "string"
  },
  "notes": "string",
  "sources": [
    {
      "name": "string",
      "url": "string",
      "date": "YYYY-MM-DD"
    }
  ],
  "lastUpdated": "YYYY-MM-DD"
}

Please provide all monetary amounts in the local currency ({CURRENCY_CODE}). If any values are estimates or averages, please indicate this in the notes section.`;

// Template for benefit data collection
const BENEFIT_PROMPT_TEMPLATE = `You are an expert in social welfare and family benefit systems. Please provide detailed information about family and social benefits in {COUNTRY_NAME} ({COUNTRY_CODE}) in the following JSON format. Be as precise and comprehensive as possible, including all relevant benefit programs, eligibility criteria, and payment amounts.

{
  "countryCode": "{COUNTRY_CODE}",
  "familyBenefits": {
    "childBenefit": {
      "name": "string (local language name)",
      "description": "string",
      "monthlyAmount": number,
      "paymentFrequency": "monthly|quarterly|yearly",
      "ageLimit": number,
      "studentAgeLimit": number,
      "incomeTested": boolean,
      "incomeThreshold": number,
      "notes": "string"
    },
    "birthGrant": {
      "name": "string (local language name)",
      "description": "string",
      "amount": number,
      "oneTime": boolean,
      "eligibility": "string",
      "notes": "string"
    },
    "parentalLeave": {
      "name": "string (local language name)",
      "durationWeeks": number,
      "paidPercentage": number,
      "maxBenefit": number,
      "eligibility": "string",
      "notes": "string"
    },
    "childcareSupport": {
      "name": "string (local language name)",
      "description": "string",
      "amount": number,
      "ageLimit": number,
      "incomeTested": boolean,
      "notes": "string"
    },
    "largeFamilyBenefits": [
      {
        "name": "string (local language name)",
        "description": "string",
        "minChildren": number,
        "amountPerChild": number,
        "maxAmount": number,
        "notes": "string"
      }
    ],
    "disabledChildBenefits": {
      "name": "string (local language name)",
      "description": "string",
      "monthlyAmount": number,
      "eligibility": "string",
      "notes": "string"
    },
    "otherBenefits": [
      {
        "name": "string (local language name)",
        "description": "string",
        "amount": number,
        "paymentFrequency": "string",
        "eligibility": "string",
        "notes": "string"
      }
    ]
  },
  "socialWelfare": {
    "unemploymentBenefits": {
      "name": "string (local language name)",
      "eligibilityMonths": number,
      "benefitRate": number,
      "maxBenefitDuration": number,
      "minWorkMonthsRequired": number,
      "notes": "string"
    },
    "sicknessBenefits": {
      "name": "string (local language name)",
      "waitingDays": number,
      "benefitRate": number,
      "maxDurationDays": number,
      "notes": "string"
    },
    "disabilityBenefits": {
      "name": "string (local language name)",
      "eligibility": "string",
      "amount": number,
      "paymentFrequency": "string",
      "notes": "string"
    },
    "housingBenefits": {
      "name": "string (local language name)",
      "eligibility": "string",
      "amount": number,
      "paymentFrequency": "string",
      "notes": "string"
    }
  },
  "educationBenefits": {
    "studentGrants": {
      "name": "string (local language name)",
      "amount": number,
      "eligibility": "string",
      "paymentFrequency": "string",
      "notes": "string"
    },
    "schoolMeals": {
      "name": "string (local language name)",
      "description": "string",
      "eligibility": "string",
      "notes": "string"
    },
    "transportSubsidies": {
      "name": "string (local language name)",
      "description": "string",
      "eligibility": "string",
      "amount": number,
      "notes": "string"
    }
  },
  "healthcareBenefits": {
    "freeHealthcare": boolean,
    "coverageDetails": "string",
    "prescriptionCosts": "string",
    "dentalCoverage": "string",
    "notes": "string"
  },
  "taxCredits": [
    {
      "name": "string (local language name)",
      "description": "string",
      "amount": number,
      "eligibility": "string",
      "refundable": boolean,
      "notes": "string"
    }
  ],
  "specialPrograms": [
    {
      "name": "string (local language name)",
      "description": "string",
      "targetGroup": "string",
      "benefits": "string",
      "applicationProcess": "string",
      "notes": "string"
    }
  ],
  "notes": "string",
  "sources": [
    {
      "name": "string",
      "url": "string",
      "date": "YYYY-MM-DD"
    }
  ],
  "lastUpdated": "YYYY-MM-DD"
}

Please provide all monetary amounts in the local currency ({CURRENCY}). If any values are estimates or averages, please indicate this in the notes section.`;

// Country information with flags and currencies
const countryInfo = {
    // European Union countries
    'AT': { name: 'Austria', flag: '🇦🇹', currency: 'EUR' },
    'BE': { name: 'Belgium', flag: '🇧🇪', currency: 'EUR' },
    'BG': { name: 'Bulgaria', flag: '🇧🇬', currency: 'BGN' },
    'HR': { name: 'Croatia', flag: '🇭🇷', currency: 'EUR' },
    'CY': { name: 'Cyprus', flag: '🇨🇾', currency: 'EUR' },
    'CZ': { name: 'Czech Republic', flag: '🇨🇿', currency: 'CZK' },
    'DK': { name: 'Denmark', flag: '🇩🇰', currency: 'DKK' },
    'EE': { name: 'Estonia', flag: '🇪🇪', currency: 'EUR' },
    'FI': { name: 'Finland', flag: '🇫🇮', currency: 'EUR' },
    'FR': { name: 'France', flag: '🇫🇷', currency: 'EUR' },
    'DE': { name: 'Germany', flag: '🇩🇪', currency: 'EUR' },
    'GR': { name: 'Greece', flag: '🇬🇷', currency: 'EUR' },
    'HU': { name: 'Hungary', flag: '🇭🇺', currency: 'HUF' },
    'IE': { name: 'Ireland', flag: '🇮🇪', currency: 'EUR' },
    'IT': { name: 'Italy', flag: '🇮🇹', currency: 'EUR' },
    'LV': { name: 'Latvia', flag: '🇱🇻', currency: 'EUR' },
    'LT': { name: 'Lithuania', flag: '🇱🇹', currency: 'EUR' },
    'LU': { name: 'Luxembourg', flag: '🇱🇺', currency: 'EUR' },
    'MT': { name: 'Malta', flag: '🇲🇹', currency: 'EUR' },
    'NL': { name: 'Netherlands', flag: '🇳🇱', currency: 'EUR' },
    'PL': { name: 'Poland', flag: '🇵🇱', currency: 'PLN' },
    'PT': { name: 'Portugal', flag: '🇵🇹', currency: 'EUR' },
    'RO': { name: 'Romania', flag: '🇷🇴', currency: 'RON' },
    'SK': { name: 'Slovakia', flag: '🇸🇰', currency: 'EUR' },
    'SI': { name: 'Slovenia', flag: '🇸🇮', currency: 'EUR' },
    'ES': { name: 'Spain', flag: '🇪🇸', currency: 'EUR' },
    'SE': { name: 'Sweden', flag: '🇸🇪', currency: 'SEK' },
    
    // Non-EU European countries
    'AL': { name: 'Albania', flag: '🇦🇱', currency: 'ALL' },
    'BA': { name: 'Bosnia and Herzegovina', flag: '🇧🇦', currency: 'BAM' },
    'IS': { name: 'Iceland', flag: '🇮🇸', currency: 'ISK' },
    'LI': { name: 'Liechtenstein', flag: '🇱🇮', currency: 'CHF' },
    'MK': { name: 'North Macedonia', flag: '🇲🇰', currency: 'MKD' },
    'NO': { name: 'Norway', flag: '🇳🇴', currency: 'NOK' },
    'CH': { name: 'Switzerland', flag: '🇨🇭', currency: 'CHF' },
    'GB': { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
    'RS': { name: 'Serbia', flag: '🇷🇸', currency: 'RSD' },
    'ME': { name: 'Montenegro', flag: '🇲🇪', currency: 'EUR' },
    
    // Other selected countries
    'AE': { name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED' },
    'AU': { name: 'Australia', flag: '🇦🇺', currency: 'AUD' },
    'BR': { name: 'Brazil', flag: '🇧🇷', currency: 'BRL' },
    'CA': { name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
    'CL': { name: 'Chile', flag: '🇨🇱', currency: 'CLP' },
    'CN': { name: 'China', flag: '🇨🇳', currency: 'CNY' },
    'HK': { name: 'Hong Kong', flag: '🇭🇰', currency: 'HKD' },
    'IN': { name: 'India', flag: '🇮🇳', currency: 'INR' },
    'ID': { name: 'Indonesia', flag: '🇮🇩', currency: 'IDR' },
    'IL': { name: 'Israel', flag: '🇮🇱', currency: 'ILS' },
    'JP': { name: 'Japan', flag: '🇯🇵', currency: 'JPY' },
    'MY': { name: 'Malaysia', flag: '🇲🇾', currency: 'MYR' },
    'MX': { name: 'Mexico', flag: '🇲🇽', currency: 'MXN' },
    'NZ': { name: 'New Zealand', flag: '🇳🇿', currency: 'NZD' },
    'NG': { name: 'Nigeria', flag: '🇳🇬', currency: 'NGN' },
    'QA': { name: 'Qatar', flag: '🇶🇦', currency: 'QAR' },
    'RU': { name: 'Russia', flag: '🇷🇺', currency: 'RUB' },
    'SA': { name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR' },
    'SG': { name: 'Singapore', flag: '🇸🇬', currency: 'SGD' },
    'ZA': { name: 'South Africa', flag: '🇿🇦', currency: 'ZAR' },
    'KR': { name: 'South Korea', flag: '🇰🇷', currency: 'KRW' },
    'TW': { name: 'Taiwan', flag: '🇹🇼', currency: 'TWD' },
    'TH': { name: 'Thailand', flag: '🇹🇭', currency: 'THB' },
    'TR': { name: 'Turkey', flag: '🇹🇷', currency: 'TRY' },
    'UA': { name: 'Ukraine', flag: '🇺🇦', currency: 'UAH' },
    'US': { name: 'United States', flag: '🇺🇸', currency: 'USD' },
    'VN': { name: 'Vietnam', flag: '🇻🇳', currency: 'VND' }
};

/**
 * Generate prompts for a specific country
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code
 */
function generateCountryPrompts(countryCode) {
    const info = countryInfo[countryCode];
    if (!info) {
        console.error(`No information available for country code: ${countryCode}`);
        return;
    }

    const { name, flag, currency } = info;
    const today = new Date().toISOString().split('T')[0];
    
    // Generate tax prompt
    const taxPrompt = COUNTRY_PROMPT_TEMPLATE
        .replace(/{COUNTRY_NAME}/g, name)
        .replace(/{COUNTRY_CODE}/g, countryCode)
        .replace(/{FLAG}/g, flag)
        .replace(/{CURRENCY_CODE}/g, currency);
    
    // Generate benefits prompt
    const benefitsPrompt = BENEFIT_PROMPT_TEMPLATE
        .replace(/{COUNTRY_NAME}/g, name)
        .replace(/{COUNTRY_CODE}/g, countryCode)
        .replace(/{CURRENCY}/g, currency);
    
    // Create directory for country if it doesn't exist
    const countryDir = path.join(OUTPUT_DIR, countryCode);
    if (!fs.existsSync(countryDir)) {
        fs.mkdirSync(countryDir, { recursive: true });
    }
    
    // Write prompts to files
    fs.writeFileSync(
        path.join(countryDir, `${countryCode}_tax_prompt.txt`),
        taxPrompt,
        'utf8'
    );
    
    fs.writeFileSync(
        path.join(countryDir, `${countryCode}_benefits_prompt.txt`),
        benefitsPrompt,
        'utf8'
    );
    
    console.log(`Generated prompts for ${name} (${countryCode})`);
}

/**
 * Generate prompts for all countries
 */
function generateAllPrompts() {
    console.log('Generating prompts for all countries...');
    
    // Get all country codes
    const countryCodes = Object.keys(countryInfo);
    
    // Generate prompts for each country
    countryCodes.forEach(countryCode => {
        generateCountryPrompts(countryCode);
    });
    
    console.log(`\nGenerated prompts for ${countryCodes.length} countries in ${OUTPUT_DIR}`);
    console.log('\nNext steps:');
    console.log('1. Review the generated prompt files');
    console.log('2. Use the prompts with an LLM to collect country data');
    console.log('3. Process the LLM responses into the application data format');
}

// Run the script
generateAllPrompts();
