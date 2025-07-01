// Country data storage
let countriesData = {};
let benefitConfig = {};

// Cache for loaded country data
const countryDataCache = new Map();

// Supported country codes
const SUPPORTED_COUNTRIES = ['DE', 'FR', 'ES', 'IT', 'NL', 'PT', 'BE', 'AT', 'SE', 'DK', 'FI', 'IE', 'LU', 'CH', 'NO', 'IS', 'US', 'CA', 'GB', 'AU', 'NZ', 'SG', 'AE', 'QA', 'HK', 'CN', 'KR', 'JP', 'IN', 'BR', 'MX', 'ZA', 'IL', 'RU', 'TR', 'ID', 'TH', 'VN'];

// Constants
const DAYS_IN_YEAR = 365;
const MIN_DAYS_IN_YEAR = 1;
const MAX_DAYS_IN_YEAR = 366; // Account for leap years

/**
 * Loads a specific country's data
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code (e.g., 'DE', 'FR')
 * @returns {Promise<Object>} Country data
 */
export async function loadCountryData(countryCode) {
    // Check cache first
    if (countryDataCache.has(countryCode)) {
        return countryDataCache.get(countryCode);
    }

    try {
        // Try to load the country data file
        const response = await fetch(`/src/data/countries/${countryCode.toLowerCase()}.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load data for country: ${countryCode}`);
        }
        
        const countryData = await response.json();
        
        // Cache the loaded data
        countryDataCache.set(countryCode, countryData);
        
        return countryData;
    } catch (error) {
        console.error(`Error loading data for country ${countryCode}:`, error);
        throw error;
    }
}

/**
 * Gets country data, loading it if necessary
 * @param {string} countryCode - ISO country code (case-insensitive)
 * @returns {Promise<Object>} Country data
 * @throws {Error} If country code is invalid or data cannot be loaded
 */
export async function getCountryData(countryCode) {
    if (!countryCode || typeof countryCode !== 'string') {
        throw new Error('Country code must be a non-empty string');
    }
    
    // Normalize country code to uppercase
    const normalizedCode = countryCode.toUpperCase();
    
    // Validate country code
    if (!SUPPORTED_COUNTRIES.includes(normalizedCode)) {
        throw new Error(`Unsupported country code: ${countryCode}. Supported codes: ${SUPPORTED_COUNTRIES.join(', ')}`);
    }
    
    // If already in cache, return it
    if (countryDataCache.has(normalizedCode)) {
        return countryDataCache.get(normalizedCode);
    }
    
    // Otherwise load it
    return loadCountryData(normalizedCode);
}

/**
 * Gets all supported country codes
 * @returns {string[]} Array of supported country codes
 */
export function getSupportedCountries() {
    return [...SUPPORTED_COUNTRIES];
}

/**
 * Gets available business types for a country
 * @param {string} countryCode - ISO country code
 * @returns {Promise<Array>} Array of business types
 */
export async function getBusinessTypes(countryCode) {
    try {
        const countryData = await getCountryData(countryCode);
        return countryData.businessTypes || [];
    } catch (error) {
        console.error(`Error getting business types for ${countryCode}:`, error);
        return [];
    }
}

/**
 * Validates if a business type is valid for a country
 * @param {string} countryCode - ISO country code
 * @param {string} businessTypeId - Business type ID to validate
 * @returns {Promise<boolean>} True if valid, false otherwise
 */
export async function isValidBusinessType(countryCode, businessTypeId) {
    try {
        const businessTypes = await getBusinessTypes(countryCode);
        return businessTypes.some(type => type.id === businessTypeId);
    } catch (error) {
        console.error(`Error validating business type for ${countryCode}:`, error);
        return false;
    }
}

/**
 * Calculates tax based on income and country
 * @param {string} countryCode - ISO country code
 * @param {number} income - Annual income
 * @param {string} businessTypeId - Business type ID
 * @returns {Promise<Object>} Tax calculation result
 */
export async function calculateTax(countryCode, income, businessTypeId) {
    try {
        const countryData = await getCountryData(countryCode);
        const businessType = countryData.businessTypes?.find(bt => bt.id === businessTypeId);
        
        if (!businessType) {
            throw new Error(`Invalid business type: ${businessTypeId} for country: ${countryCode}`);
        }
        
        // Basic tax calculation (simplified)
        let tax = 0;
        let remainingIncome = income;
        
        if (countryData.taxBrackets) {
            for (const bracket of countryData.taxBrackets) {
                if (remainingIncome <= 0) break;
                
                let taxableInBracket = remainingIncome;
                if (bracket.maxIncome !== undefined && bracket.maxIncome > 0) {
                    taxableInBracket = Math.min(remainingIncome, bracket.maxIncome - (bracket.minIncome || 0));
                }
                
                if (taxableInBracket > 0) {
                    tax += taxableInBracket * (bracket.rate / 100);
                    remainingIncome -= taxableInBracket;
                }
            }
        }
        
        // Apply corporate tax if applicable
        if (businessType.corporateTaxRate && businessType.corporateTaxRate > 0) {
            tax += income * businessType.corporateTaxRate;
        }
        
        // Apply social security if applicable
        let socialSecurity = 0;
        if (businessType.socialSecurityRate && businessType.socialSecurityRate > 0) {
            socialSecurity = income * businessType.socialSecurityRate;
        }
        
        return {
            country: countryData.name,
            businessType: businessType.name,
            income,
            tax,
            socialSecurity,
            totalDeductions: tax + socialSecurity,
            netIncome: income - (tax + socialSecurity)
        };
    } catch (error) {
        console.error(`Error calculating tax for ${countryCode}:`, error);
        throw error;
    }
}

/**
 * Validates days spent in a country
 * @param {number} days - Number of days
 * @param {number} year - Year for leap year calculation
 * @returns {Object} Validation result { isValid: boolean, message?: string }
 */
export function validateDaysInCountry(days, year) {
    if (typeof days !== 'number' || isNaN(days)) {
        return { isValid: false, message: 'Days must be a number' };
    }
    
    if (days < MIN_DAYS_IN_YEAR) {
        return { isValid: false, message: `Days cannot be less than ${MIN_DAYS_IN_YEAR}` };
    }
    
    const maxDays = isLeapYear(year) ? 366 : 365;
    if (days > maxDays) {
        return { isValid: false, message: `Days cannot exceed ${maxDays} in ${year}` };
    }
    
    return { isValid: true };
}

/**
 * Initializes country data in the application state
 */
export function initCountryData() {
    if (!window.appState) {
        window.appState = {};
    }
    
    // Initialize country data in app state if not exists
    if (!window.appState.countryData) {
        window.appState.countryData = {};
        
        // Initialize data for each country
        Object.keys(countriesData).forEach(countryCode => {
            const country = countriesData[countryCode];
            window.appState.countryData[countryCode] = {
                businessType: 'services',
                daysYear1: 0,
                daysYear2: 0,
                revenue: 100000,
                costs: 30000,
                vatEnabled: false,
                isCitizen: countryCode === 'PL', // Default to true for home country
                socialInsurance: {
                    paidIn: countryCode,
                    amount: 0
                },
                healthInsurance: {
                    paidIn: countryCode,
                    amount: 0
                },
                legalInsurance: {
                    paidIn: countryCode,
                    amount: 0
                },
                additionalCosts: {
                    startup: 0,
                    equipment: 0,
                    office: 0,
                    other: 0
                },
                funding: {
                    grants: 0,
                    investments: 0,
                    other: 0
                },
                unemployment: {
                    status: 'none',
                    benefits: 0
                },
                benefits: {
                    // Will be populated based on country and family situation
                }
            };
        });
    }
}

/**
 * Gets country data by country code
 * @param {string} countryCode - ISO country code
 * @returns {Object} Country data
 */


/**
 * Gets all countries data
 * @returns {Object} All countries data
 */
export function getAllCountries() {
    return { ...countriesData };
}

/**
 * Gets EU countries
 * @returns {Object} EU countries
 */
export function getEUCountries() {
    return Object.fromEntries(
        Object.entries(countriesData).filter(([_, country]) => country.eu)
    );
}

/**
 * Gets benefit configuration
 * @returns {Object} Benefit configuration
 */
export function getBenefitConfig() {
    return { ...benefitConfig };
}

/**
 * Calculates available benefits for a family in a specific country
 * @param {string} countryCode - ISO country code
 * @param {Object} familyData - Family data including children
 * @returns {Array} Array of available benefits
 */
export function calculateFamilyBenefits(countryCode, familyData) {
    const benefits = [];
    const countryBenefits = benefitConfig[countryCode] || [];
    
    countryBenefits.forEach(benefit => {
        // Check if benefit applies based on children's ages and conditions
        const applicable = familyData.children.some(child => {
            const childAge = parseFloat(child.age) || 0;
            const isNewborn = child.isNewborn || false;
            const isStudent = child.isStudent || false;
            const isDisabled = child.isDisabled || false;
            
            // Check age condition
            const ageCondition = benefit.maxAge ? childAge <= benefit.maxAge : true;
            
            // Check other conditions
            const conditions = benefit.conditions || {};
            const meetsConditions = 
                (conditions.newborn === undefined || conditions.newborn === isNewborn) &&
                (conditions.student === undefined || conditions.student === isStudent) &&
                (conditions.disabled === undefined || conditions.disabled === isDisabled);
            
            return ageCondition && meetsConditions;
        });
        
        if (applicable) {
            benefits.push({
                ...benefit,
                // Calculate total amount based on number of eligible children
                totalAmount: benefit.amount * Math.min(
                    familyData.children.length,
                    benefit.maxChildren || familyData.children.length
                )
            });
        }
    });
    
    return benefits;
}

/**
 * Calculates tax for a country based on income and other factors
 * @param {string} countryCode - ISO country code
 * @param {number} income - Annual income
 * @param {string} businessType - Type of business
 * @param {boolean} isCitizen - Whether the person is a citizen of the country
 * @returns {Object} Tax calculation result
 */

/**
 * Validates days spent in different countries
 * @param {Object} daysByCountry - Object with country codes as keys and days as values
 * @param {number} year - Year for validation (to handle leap years)
 * @returns {Object} Validation result
 */
export function validateDays(daysByCountry, year) {
    const daysInYear = isLeapYear(year) ? 366 : 365;
    const totalDays = Object.values(daysByCountry).reduce((sum, days) => sum + (parseInt(days) || 0), 0);
    
    return {
        isValid: totalDays <= daysInYear,
        totalDays,
        maxDays: daysInYear,
        remainingDays: Math.max(0, daysInYear - totalDays)
    };
}

/**
 * Checks if a year is a leap year
 * @param {number} year - Year to check
 * @returns {boolean} True if leap year
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Gets tax treaty information between two countries
 * @param {string} country1 - First country code
 * @param {string} country2 - Second country code
 * @returns {Object|null} Tax treaty information if exists
 */
export function getTaxTreaty(country1, country2) {
    // In a real app, this would check a database of tax treaties
    // For now, return a mock response
    if ((country1 === 'PL' && country2 === 'DE') || (country1 === 'DE' && country2 === 'PL')) {
        return {
            countries: ['PL', 'DE'],
            treatyName: 'Konwencja między Rzecząpospolitą Polską a Republiką Federalną Niemiec w sprawie unikania podwójnego opodatkowania',
            effectiveDate: '1994-01-01',
            withholdingTax: {
                dividends: 15,
                interest: 10,
                royalties: 5
            },
            tieBreakerRules: true
        };
    }
    return null;
}

/**
 * Calculates social security obligations
 * @param {string} countryCode - Country code
 * @param {number} income - Annual income
 * @param {string} businessType - Type of business
 * @returns {Object} Social security calculation
 */
export function calculateSocialSecurity(countryCode, income, businessType) {
    const country = countriesData[countryCode];
    if (!country) {
        throw new Error(`Country ${countryCode} not found`);
    }
    
    // In a real app, this would use the country's specific social security calculation
    // For now, use a simplified version
    const baseAmount = country.socialSecurity || 0;
    const isFreelance = businessType === 'freelance';
    
    // Example: Freelancers might pay different rates
    const rate = isFreelance ? 0.15 : 0.20; // 15% for freelancers, 20% for others
    const calculatedAmount = Math.min(income * rate, baseAmount * 12); // Cap at annual base amount
    
    return {
        monthly: calculatedAmount / 12,
        annual: calculatedAmount,
        rate: rate * 100,
        currency: country.currency || 'EUR',
        isCapped: calculatedAmount >= baseAmount * 12
    };
}
