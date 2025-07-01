import { getCountryData } from './dataService.js';

/**
 * Calculates tax for a specific country based on provided data
 * @param {string} countryCode - ISO country code
 * @param {Object} data - Country-specific data
 * @returns {Object} Tax calculation results
 */
export function calculateTaxForCountry(countryCode, data) {
    const country = getCountryData(countryCode);
    if (!country) {
        return {
            taxableIncome: 0,
            tax: 0,
            taxRate: 0,
            netIncome: 0,
            effectiveRate: '0.00',
            benefits: 0
        };
    }

    // Calculate taxable income (revenue - costs)
    const revenue = parseFloat(data.revenue) || 0;
    const costs = parseFloat(data.costs) || 0;
    let taxableIncome = Math.max(0, revenue - costs);
    
    // Get tax rate based on business type
    const businessType = data.businessType || 'services';
    let taxRate = country.taxIncome?.[businessType] || country.taxIncome?.services || 0;
    
    // Apply progressive tax brackets if they exist
    let tax = 0;
    if (country.taxBrackets && country.taxBrackets.length > 0) {
        tax = calculateProgressiveTax(taxableIncome, country.taxBrackets);
    } else {
        // Flat tax rate
        tax = Math.round(taxableIncome * (taxRate / 100));
    }
    
    // Calculate VAT if enabled
    const vatAmount = data.vatEnabled ? Math.round(revenue * (country.vat / 100)) : 0;
    
    // Calculate social security (simplified)
    const socialSecurity = country.socialSecurity ? country.socialSecurity * 12 : 0;
    
    // Calculate benefits (family, children, etc.)
    const benefits = calculateCountryBenefits(countryCode, data);
    
    // Calculate total tax (income tax + social security - benefits)
    const totalTax = Math.max(0, tax + socialSecurity - (benefits || 0));
    
    // Calculate net income
    const netIncome = Math.max(0, taxableIncome - totalTax);
    
    // Calculate effective tax rate
    const effectiveRate = taxableIncome > 0 ? 
        ((totalTax / taxableIncome) * 100).toFixed(2) : '0.00';
    
    return {
        taxableIncome,
        tax: totalTax,
        taxRate: taxRate,
        netIncome,
        effectiveRate,
        benefits: benefits || 0,
        vat: vatAmount,
        socialSecurity
    };
}

/**
 * Calculates tax using progressive tax brackets
 * @param {number} income - Taxable income
 * @param {Array} brackets - Array of tax brackets
 * @returns {number} Calculated tax
 */
function calculateProgressiveTax(income, brackets) {
    let tax = 0;
    let remainingIncome = income;
    
    // Sort brackets by threshold to ensure correct calculation
    const sortedBrackets = [...brackets].sort((a, b) => a.threshold - b.threshold);
    
    for (let i = 0; i < sortedBrackets.length; i++) {
        const bracket = sortedBrackets[i];
        const nextBracket = sortedBrackets[i + 1];
        
        if (income <= bracket.threshold) {
            // Income is within this bracket
            tax += remainingIncome * (bracket.rate / 100);
            break;
        } else {
            // Calculate tax for this bracket's range
            const bracketRange = nextBracket ? 
                (nextBracket.threshold - bracket.threshold) : 
                remainingIncome;
                
            tax += bracketRange * (bracket.rate / 100);
            remainingIncome -= bracketRange;
            
            if (remainingIncome <= 0) break;
        }
    }
    
    return Math.round(tax);
}

/**
 * Calculates benefits for a specific country
 * @param {string} countryCode - ISO country code
 * @param {Object} data - Country-specific data
 * @returns {number} Total benefits amount
 */
function calculateCountryBenefits(countryCode, data) {
    // Get benefit configuration for the country
    const country = getCountryData(countryCode);
    if (!country || !country.benefits) return 0;
    
    let totalBenefits = 0;
    const { familyData } = window.appState;
    
    // Check for family benefits
    if (country.benefits.family) {
        // 500+ benefit in Poland
        if (countryCode === 'PL' && familyData?.children?.length > 0) {
            const eligibleChildren = familyData.children.filter(child => 
                child.age < 18 || (child.isStudent && child.age < 26)
            );
            
            // First child doesn't count for 500+ (it's means-tested)
            const additionalChildren = Math.max(0, eligibleChildren.length - 1);
            totalBenefits += additionalChildren * 500 * 12; // Monthly to yearly
            
            // 800+ for children under 18 months
            const youngChildren = familyData.children.filter(child => 
                child.age <= 1.5 // 18 months
            ).length;
            totalBenefits += youngChildren * 800 * 12;
        }
        
        // Kindergeld in Germany
        if (countryCode === 'DE' && familyData?.children?.length > 0) {
            familyData.children.forEach(child => {
                if (child.age < 18 || (child.isStudent && child.age < 25)) {
                    // First and second child: 219€, third: 225€, subsequent: 250€
                    const childIndex = familyData.children.indexOf(child);
                    let amount = 219; // Default for first two children
                    
                    if (childIndex >= 2) {
                        amount = childIndex === 2 ? 225 : 250;
                    }
                    
                    totalBenefits += amount * 12; // Monthly to yearly
                }
            });
        }
    }
    
    // Add other country-specific benefits here
    
    return Math.round(totalBenefits);
}

/**
 * Extension point for adding custom tax calculations
 * This function can be overridden by country-specific modules
 * @param {string} countryCode - ISO country code
 * @param {Object} data - Country-specific data
 * @returns {Object} Custom tax calculation results
 */
export function getCustomTaxCalculation(countryCode, data) {
    // This is a hook for country-specific tax calculations
    // Each country can have its own implementation
    // Example: return getPLTaxCalculation(data);
    return null;
}
