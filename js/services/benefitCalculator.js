import { getCountryData } from './dataService.js';

/**
 * Calculates benefits based on family situation and country-specific rules
 * @returns {Object} Benefits calculation results
 */
export function calculateBenefits() {
    const { selectedCountries, countryData, familyData } = window.appState;
    if (!familyData) return {};

    const benefitsByCountry = {};
    
    // Calculate benefits for each selected country
    selectedCountries.forEach(countryCode => {
        const data = countryData[countryCode];
        if (!data) return;
        
        benefitsByCountry[countryCode] = calculateCountryBenefits(countryCode, data);
    });
    
    // Store benefits in app state
    window.appState.benefits = benefitsByCountry;
    
    return benefitsByCountry;
}

/**
 * Calculates benefits for a specific country
 * @param {string} countryCode - ISO country code
 * @param {Object} data - Country-specific data
 * @returns {Object} Benefits details
 */
function calculateCountryBenefits(countryCode, data) {
    const country = getCountryData(countryCode);
    const { familyData } = window.appState;
    const benefits = {
        family: {},
        children: {},
        other: {},
        total: 0
    };
    
    if (!country || !familyData) return benefits;
    
    // Family benefits
    if (familyData.maritalStatus === 'married' && familyData.spouseLocation === countryCode) {
        // Example: Marriage tax credit or similar benefits
        benefits.family.marriageBenefit = {
            name: 'Ulga małżeńska',
            amount: 0, // Will be calculated based on country rules
            description: 'Dodatkowa ulga dla małżeństw'
        };
    }
    
    // Children benefits
    if (familyData.children && familyData.children.length > 0) {
        benefits.children = calculateChildrenBenefits(countryCode, familyData.children);
    }
    
    // Country-specific benefits
    if (countryCode === 'PL') {
        // 500+ program (Family 500+)
        if (familyData.children && familyData.children.length > 0) {
            // First child doesn't count for 500+ (it's means-tested)
            const additionalChildren = Math.max(0, familyData.children.length - 1);
            const benefit500 = additionalChildren * 500 * 12; // Monthly to yearly
            
            if (benefit500 > 0) {
                benefits.other['500+'] = {
                    name: 'Program 500+',
                    amount: benefit500,
                    description: `Dodatek wychowawczy dla ${additionalChildren} dzieci`
                };
            }
            
            // 800+ for children under 18 months
            const youngChildren = familyData.children.filter(child => 
                child.age <= 1.5 // 18 months
            ).length;
            
            if (youngChildren > 0) {
                const benefit800 = youngChildren * 800 * 12; // Monthly to yearly
                benefits.other['800+'] = {
                    name: 'Program 800+',
                    amount: benefit800,
                    description: `Dodatek wychowawczy dla ${youngChildren} dzieci do 18 miesiąca życia`
                };
            }
        }
        
        // Becikowe (one-time benefit for newborn)
        const newborns = familyData.children.filter(child => 
            child.isNewborn
        ).length;
        
        if (newborns > 0) {
            // Becikowe is a one-time payment, but we'll calculate it as a yearly equivalent
            // for comparison purposes
            const becikowe = newborns * 1000; // Example amount
            benefits.other.becikowe = {
                name: 'Becikowe',
                amount: becikowe,
                description: 'Jednorazowa zapomoga z tytułu urodzenia dziecka',
                oneTime: true
            };
        }
    } 
    // Germany
    else if (countryCode === 'DE') {
        // Kindergeld (child benefit)
        if (familyData.children && familyData.children.length > 0) {
            let kindergeldTotal = 0;
            const kindergeldRates = [];
            
            familyData.children.forEach((child, index) => {
                if (child.age < 18 || (child.isStudent && child.age < 25)) {
                    // First and second child: 219€, third: 225€, subsequent: 250€
                    let amount = 219; // Default for first two children
                    
                    if (index >= 2) {
                        amount = index === 2 ? 225 : 250;
                    }
                    
                    const yearlyAmount = amount * 12; // Monthly to yearly
                    kindergeldTotal += yearlyAmount;
                    kindergeldRates.push({
                        child: child.name || `Dziecko ${index + 1}`,
                        monthly: amount,
                        yearly: yearlyAmount
                    });
                }
            });
            
            if (kindergeldTotal > 0) {
                benefits.other.kindergeld = {
                    name: 'Kindergeld',
                    amount: kindergeldTotal,
                    description: 'Dodatek na dzieci w Niemczech',
                    details: kindergeldRates
                };
            }
        }
    }
    
    // Calculate total benefits
    benefits.total = calculateTotalBenefits(benefits);
    
    return benefits;
}

/**
 * Calculates benefits for children
 * @param {string} countryCode - ISO country code
 * @param {Array} children - Array of children
 * @returns {Object} Children benefits details
 */
function calculateChildrenBenefits(countryCode, children) {
    const benefits = {
        total: 0,
        perChild: {}
    };
    
    children.forEach((child, index) => {
        const childBenefits = {
            age: child.age,
            isNewborn: child.isNewborn,
            isStudent: child.isStudent,
            isDisabled: child.isDisabled,
            benefits: {}
        };
        
        // Age-based benefits
        if (child.age < 18 || (child.isStudent && child.age < 26)) {
            // Example: Basic child benefit
            childBenefits.benefits.childBenefit = {
                name: 'Zasiłek rodzinny',
                amount: 0, // Will be set by country-specific rules
                description: 'Podstawowy zasiłek na dziecko'
            };
            
            // Additional benefits for disabled children
            if (child.isDisabled) {
                childBenefits.benefits.disabledChildBenefit = {
                    name: 'Dodatek dla dziecka niepełnosprawnego',
                    amount: 0, // Will be set by country-specific rules
                    description: 'Dodatkowe wsparcie dla dzieci niepełnosprawnych'
                };
            }
        }
        
        // Store child benefits
        benefits.perChild[`child${index + 1}`] = childBenefits;
    });
    
    return benefits;
}

/**
 * Calculates total benefits from all categories
 * @param {Object} benefits - Benefits by category
 * @returns {number} Total benefits amount
 */
function calculateTotalBenefits(benefits) {
    let total = 0;
    
    // Sum family benefits
    if (benefits.family) {
        Object.values(benefits.family).forEach(benefit => {
            total += benefit.amount || 0;
        });
    }
    
    // Sum children benefits
    if (benefits.children && benefits.children.total) {
        total += benefits.children.total;
    }
    
    // Sum other benefits
    if (benefits.other) {
        Object.values(benefits.other).forEach(benefit => {
            total += benefit.amount || 0;
        });
    }
    
    return Math.round(total);
}

/**
 * Gets benefit information for a specific country
 * @param {string} countryCode - ISO country code
 * @returns {Object} Benefit information
 */
export function getBenefitInfo(countryCode) {
    // This would typically come from a configuration file
    const benefitInfo = {
        PL: {
            name: 'Polska',
            benefits: [
                {
                    id: '500+',
                    name: 'Program 500+',
                    description: 'Świadczenie wychowawcze 500+',
                    amount: 500,
                    frequency: 'monthly',
                    eligibility: 'Dzieci od urodzenia do ukończenia 18 roku życia',
                    notes: 'Dla pierwszego dziecka jest kryterium dochodowe',
                    link: 'https://www.gov.pl/web/rodzina/500plus--rzadowy-program-pomocy-rodzinom'
                },
                {
                    id: '800+',
                    name: 'Program 800+',
                    description: 'Dodatek wychowawczy 800+',
                    amount: 800,
                    frequency: 'monthly',
                    eligibility: 'Dzieci do ukończenia 18 miesiąca życia',
                    notes: 'Bez kryterium dochodowego',
                    link: 'https://www.gov.pl/web/rodzina/800-plus'
                },
                {
                    id: 'becikowe',
                    name: 'Becikowe',
                    description: 'Jednorazowa zapomoga z tytułu urodzenia dziecka',
                    amount: 1000,
                    frequency: 'once',
                    eligibility: 'Rodzice nowo narodzonego dziecka',
                    notes: 'Wysokość zależy od gminy',
                    link: 'https://www.gov.pl/web/rodzina/becikowe'
                }
            ]
        },
        DE: {
            name: 'Niemcy',
            benefits: [
                {
                    id: 'kindergeld',
                    name: 'Kindergeld',
                    description: 'Dodatek na dzieci',
                    amount: '219-250',
                    frequency: 'monthly',
                    eligibility: 'Dzieci do 18 lat (lub do 25 lat jeśli się uczą)',
                    notes: 'Kwota zależy od liczby dzieci',
                    link: 'https://www.arbeitsagentur.de/familie-und-kinder/kinderbetreuung-kinderbetreuungsmoeglichkeiten'
                },
                {
                    id: 'elterngeld',
                    name: 'Elterngeld',
                    description: 'Zasiłek rodzicielski',
                    amount: '65-1800',
                    frequency: 'monthly',
                    eligibility: 'Rodzice opiekujący się dzieckiem',
                    notes: 'Wysokość zależy od wcześniejszych dochodów',
                    link: 'https://familienportal.de/familienportal/lebenslagen/geburt/elterngeld'
                }
            ]
        }
    };
    
    return benefitInfo[countryCode] || {
        name: 'Inny kraj',
        benefits: []
    };
}
