import { updateCountryRows, updateCalculations } from './tableUpdater.js';
import { renderCountrySelection } from '../components/countrySelection.js';
import { renderFamilyBenefitsForm } from '../components/familyBenefitsForm.js';
import { calculateBenefits } from './benefitCalculator.js';

/**
 * Sets up all event listeners for the application
 */
export function setupEventListeners() {
    // Country selection
    document.addEventListener('change', (e) => {
        if (e.target.matches('.country-checkbox')) {
            handleCountrySelection(e);
        }
    });

    // Business type change
    document.addEventListener('change', (e) => {
        if (e.target.matches('.business-type')) {
            handleBusinessTypeChange(e);
        }
    });

    // Days input change
    document.addEventListener('input', debounce((e) => {
        if (e.target.matches('.days-input')) {
            handleDaysInputChange(e);
        }
    }, 300));

    // Financial input change
    document.addEventListener('input', debounce((e) => {
        if (e.target.matches('.financial-input')) {
            handleFinancialInputChange(e);
        }
    }, 300));

    // VAT checkbox change
    document.addEventListener('change', (e) => {
        if (e.target.matches('.vat-checkbox')) {
            handleVatCheckboxChange(e);
        }
    });

    // Citizen checkbox change
    document.addEventListener('change', (e) => {
        if (e.target.matches('.citizen-checkbox')) {
            handleCitizenCheckboxChange(e);
        }
    });

    // Personal data form changes
    document.addEventListener('change', (e) => {
        if (e.target.matches('#maritalStatus, #spouseLocation, #unemploymentStatus')) {
            handlePersonalDataChange(e);
        }
    });

    // Child form changes
    document.addEventListener('click', (e) => {
        if (e.target.matches('.add-child-btn')) {
            e.preventDefault();
            addChild();
        } else if (e.target.matches('.remove-child-btn')) {
            e.preventDefault();
            const index = parseInt(e.target.dataset.index);
            removeChild(index);
        }
    });

    // Year selection
    document.addEventListener('change', (e) => {
        if (e.target.matches('#yearSelect')) {
            handleYearChange(e);
        }
    });
}

/**
 * Handles country selection changes
 * @param {Event} event - Change event
 */
function handleCountrySelection(event) {
    const countryCode = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
        window.appState.selectedCountries.add(countryCode);
    } else {
        window.appState.selectedCountries.delete(countryCode);
    }
    
    updateCountryRows();
}

/**
 * Handles business type changes
 * @param {Event} event - Change event
 */
function handleBusinessTypeChange(event) {
    const row = event.target.closest('tr');
    const countryCode = row.dataset.country;
    const businessType = event.target.value;
    
    if (window.appState.countryData[countryCode]) {
        window.appState.countryData[countryCode].businessType = businessType;
        updateCalculations();
    }
}

/**
 * Handles days input changes
 * @param {Event} event - Input event
 */
function handleDaysInputChange(event) {
    const row = event.target.closest('tr');
    const countryCode = row.dataset.country;
    const year = event.target.dataset.year;
    const days = parseInt(event.target.value) || 0;
    
    if (window.appState.countryData[countryCode] && (year === '1' || year === '2')) {
        window.appState.countryData[countryCode][`daysYear${year}`] = days;
        updateCalculations();
    }
}

/**
 * Handles financial input changes
 * @param {Event} event - Input event
 */
function handleFinancialInputChange(event) {
    const row = event.target.closest('tr');
    const countryCode = row.dataset.country;
    const field = event.target.classList.contains('revenue-input') ? 'revenue' : 'costs';
    const value = parseFloat(event.target.value) || 0;
    
    if (window.appState.countryData[countryCode]) {
        window.appState.countryData[countryCode][field] = value;
        updateCalculations();
    }
}

/**
 * Handles VAT checkbox changes
 * @param {Event} event - Change event
 */
function handleVatCheckboxChange(event) {
    const row = event.target.closest('tr');
    const countryCode = row.dataset.country;
    const isChecked = event.target.checked;
    
    if (window.appState.countryData[countryCode]) {
        window.appState.countryData[countryCode].vatEnabled = isChecked;
        updateCalculations();
    }
}

/**
 * Handles citizen checkbox changes
 * @param {Event} event - Change event
 */
function handleCitizenCheckboxChange(event) {
    const row = event.target.closest('tr');
    const countryCode = row.dataset.country;
    const isChecked = event.target.checked;
    
    if (window.appState.countryData[countryCode]) {
        window.appState.countryData[countryCode].isCitizen = isChecked;
        updateCalculations();
    }
}

/**
 * Handles personal data form changes
 * @param {Event} event - Change event
 */
function handlePersonalDataChange(event) {
    const field = event.target.id;
    const value = event.target.value;
    
    if (window.appState.familyData) {
        window.appState.familyData[field] = value;
        
        // Recalculate benefits when personal data changes
        calculateBenefits();
        updateCalculations();
    }
}

/**
 * Handles year selection changes
 * @param {Event} event - Change event
 */
function handleYearChange(event) {
    const year = parseInt(event.target.value);
    if (!isNaN(year)) {
        window.appState.selectedYear = year;
        updateCountryRows();
    }
}

/**
 * Adds a new child to the family data
 */
function addChild() {
    if (!window.appState.familyData.children) {
        window.appState.familyData.children = [];
    }
    
    window.appState.familyData.children.push({
        name: '',
        age: 0,
        isNewborn: false,
        isDisabled: false,
        isStudent: false
    });
    
    // Re-render family benefits form
    renderFamilyBenefitsForm();
    calculateBenefits();
}

/**
 * Removes a child from the family data
 * @param {number} index - Index of the child to remove
 */
function removeChild(index) {
    if (window.appState.familyData.children && 
        index >= 0 && 
        index < window.appState.familyData.children.length) {
        
        window.appState.familyData.children.splice(index, 1);
        
        // Re-render family benefits form
        renderFamilyBenefitsForm();
        calculateBenefits();
    }
}

/**
 * Debounce function to limit the rate at which a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
