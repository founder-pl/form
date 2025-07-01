// Country data storage
let countriesData = {};
let benefitConfig = {};

// Constants
const DAYS_IN_YEAR = 365;

/**
 * Loads country data from JSON file
 * @returns {Promise<void>}
 */
export async function loadCountryData() {
    try {
        const response = await fetch('../data/countries.json');
        if (!response.ok) {
            throw new Error('Failed to load country data');
        }
        countriesData = await response.json();
        
        // Load benefit configuration
        const benefitResponse = await fetch('../data/benefits.json');
        if (benefitResponse.ok) {
            benefitConfig = await benefitResponse.json();
        }
        
        return Promise.resolve();
    } catch (error) {
        console.error('Error loading country data:', error);
        return Promise.reject(error);
    }
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
export function getCountryData(countryCode) {
    return countriesData[countryCode] || null;
}

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
 * Gets available business types
 * @returns {string[]} Array of business types
 */
export function getBusinessTypes() {
    return [
        'production',
        'trade',
        'services',
        'freelance',
        'ecommerce'
    ];
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
export function calculateTax(countryCode, income, businessType, isCitizen = false) {
    const country = countriesData[countryCode];
    if (!country) {
        throw new Error(`Country ${countryCode} not found`);
    }
    
    // Get base tax rate based on business type
    const baseRate = country.taxIncome[businessType] || country.taxIncome.services;
    let taxAmount = 0;
    
    // Apply progressive tax brackets if they exist
    if (country.taxBrackets && country.taxBrackets.length > 0) {
        let remainingIncome = income;
        let previousThreshold = 0;
        
        // Sort brackets by threshold
        const sortedBrackets = [...country.taxBrackets].sort((a, b) => a.threshold - b.threshold);
        
        for (const bracket of sortedBrackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInBracket = Math.min(
                remainingIncome,
                bracket.threshold - previousThreshold
            );
            
            taxAmount += (taxableInBracket * bracket.rate) / 100;
            remainingIncome -= taxableInBracket;
            previousThreshold = bracket.threshold;
        }
    } else {
        // Flat tax rate
        taxAmount = (income * baseRate) / 100;
    }
    
    // Apply citizen discount if applicable (example: some countries have lower rates for citizens)
    const citizenDiscount = isCitizen && country.citizenDiscount ? country.citizenDiscount : 0;
    const adjustedTax = taxAmount * (1 - (citizenDiscount / 100));
    
    return {
        baseRate,
        taxAmount: adjustedTax,
        effectiveRate: Math.min((adjustedTax / income) * 100, 100) || 0,
        currency: country.currency || 'EUR',
        citizenDiscount
    };
}

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
