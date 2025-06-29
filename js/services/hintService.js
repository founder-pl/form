/**
 * Service for managing and displaying hints and tooltips for countries and columns
 */

import { getCountryData } from './dataService.js';

// Default hints that will be used if no custom hints are provided
const DEFAULT_HINTS = {
    // Country-specific hints
    countries: {
        PL: {
            name: 'Poland',
            description: 'Poland has a progressive tax system with various social security contributions and family benefits.',
            taxTips: [
                'Flat tax rate of 19% for most businesses',
                'Lump-sum tax available for certain professions',
                'VAT rate of 23% (standard), 8%, 5%, or 0% for specific goods/services'
            ],
            benefits: [
                '500+ program for families with children',
                '800+ for children under 18 months',
                'Becikowe - one-time birth grant'
            ]
        },
        DE: {
            name: 'Germany',
            description: 'Germany has a progressive tax system with high social security contributions but extensive social benefits.',
            taxTips: [
                'Progressive income tax up to 45%',
                'Solidarity surcharge of 5.5% on income tax',
                'VAT rate of 19% (standard) or 7% (reduced)'
            ],
            benefits: [
                'Kindergeld - child benefit',
                'Elterngeld - parental leave benefit',
                'Wohngeld - housing benefit'
            ]
        },
        // Add more default country hints as needed
    },
    
    // Column-specific hints
    columns: {
        'business-type': 'Type of business activity. Different tax rates may apply to different business types.',
        'days-year1': 'Number of days spent in the country in the first year. Used for tax residency determination.',
        'days-year2': 'Number of days spent in the country in the second year. Used for tax residency determination.',
        'revenue': 'Annual revenue in local currency. Used to calculate taxable income.',
        'costs': 'Annual business costs in local currency. Deductible from revenue to calculate taxable income.',
        'vat': 'Value Added Tax. Check if you need to register for VAT in this country.',
        'social-security': 'Social security contributions. May be paid in the country of residence or employment.',
        'benefits': 'Government benefits you may be eligible for based on your situation.',
        'tax': 'Calculated tax amount based on your income and deductions.',
        'net-income': 'Your after-tax income after all deductions and benefits.'
    }
};

// Cache for loaded hints
let hintsCache = null;

/**
 * Load hints from a JSON file
 * @param {string} url - URL to the hints JSON file
 * @returns {Promise<Object>} Loaded hints
 */
export async function loadHints(url = '/data/hints.json') {
    if (hintsCache) {
        return hintsCache;
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load hints: ${response.statusText}`);
        }
        
        const customHints = await response.json();
        
        // Merge with default hints (custom hints take precedence)
        hintsCache = {
            countries: { ...DEFAULT_HINTS.countries, ...customHints.countries },
            columns: { ...DEFAULT_HINTS.columns, ...customHints.columns }
        };
        
        return hintsCache;
    } catch (error) {
        console.warn('Using default hints due to error:', error.message);
        hintsCache = DEFAULT_HINTS;
        return hintsCache;
    }
}

/**
 * Get hints for a specific country
 * @param {string} countryCode - ISO country code
 * @returns {Object} Country hints or null if not found
 */
export function getCountryHints(countryCode) {
    if (!hintsCache) {
        hintsCache = DEFAULT_HINTS;
    }
    
    const countryData = getCountryData(countryCode);
    if (!countryData) return null;
    
    const defaultHints = {
        name: countryData.name,
        description: `Tax and benefit information for ${countryData.name}.`,
        taxTips: [],
        benefits: []
    };
    
    return {
        ...defaultHints,
        ...(hintsCache.countries[countryCode] || {})
    };
}

/**
 * Get hint for a specific column
 * @param {string} columnId - Column identifier
 * @returns {string} Column hint or empty string if not found
 */
export function getColumnHint(columnId) {
    if (!hintsCache) {
        hintsCache = DEFAULT_HINTS;
    }
    
    return hintsCache.columns[columnId] || '';
}

/**
 * Initialize tooltips for elements with data-hint attributes
 */
export function initializeTooltips() {
    // Use Bootstrap's tooltip if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                trigger: 'hover',
                placement: 'top',
                html: true
            });
        });
    } else {
        // Fallback to simple title attributes
        document.querySelectorAll('[data-hint]').forEach(element => {
            const hint = element.getAttribute('data-hint');
            if (hint && !element.title) {
                element.title = hint;
            }
        });
    }
}

/**
 * Create a help icon with a tooltip
 * @param {string} hint - The hint text to display
 * @param {string} [placement='top'] - Tooltip placement (top, right, bottom, left)
 * @returns {HTMLElement} Help icon element
 */
export function createHelpIcon(hint, placement = 'top') {
    const icon = document.createElement('i');
    icon.className = 'bi bi-info-circle ms-1';
    icon.setAttribute('data-bs-toggle', 'tooltip');
    icon.setAttribute('data-bs-placement', placement);
    icon.setAttribute('title', hint);
    icon.setAttribute('aria-label', 'More information');
    icon.style.cursor = 'help';
    
    // Add accessibility attributes
    icon.setAttribute('role', 'button');
    icon.setAttribute('tabindex', '0');
    
    return icon;
}

/**
 * Add help icons to table headers
 * @param {string} tableId - ID of the table to add help icons to
 */
export function addTableHeaderHelp(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const headers = table.querySelectorAll('th[data-column]');
    headers.forEach(header => {
        const columnId = header.getAttribute('data-column');
        if (columnId) {
            const hint = getColumnHint(columnId);
            if (hint) {
                const helpIcon = createHelpIcon(hint);
                header.appendChild(helpIcon);
            }
        }
    });
    
    // Initialize tooltips for the new elements
    initializeTooltips();
}

/**
 * Show a modal with detailed country information
 * @param {string} countryCode - ISO country code
 */
export function showCountryInfoModal(countryCode) {
    const hints = getCountryHints(countryCode);
    if (!hints) return;
    
    // Create modal HTML
    const modalHtml = `
        <div class="modal fade" id="countryInfoModal" tabindex="-1" aria-labelledby="countryInfoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="countryInfoModalLabel">${hints.name} - Tax Information</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${hints.description}</p>
                        
                        ${hints.taxTips && hints.taxTips.length ? `
                            <h6>Tax Tips:</h6>
                            <ul>
                                ${hints.taxTips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        ` : ''}
                        
                        ${hints.benefits && hints.benefits.length ? `
                            <h6>Available Benefits:</h6>
                            <ul>
                                ${hints.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the document if it doesn't exist
    let modal = document.getElementById('countryInfoModal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modal = document.getElementById('countryInfoModal');
    } else {
        modal.outerHTML = modalHtml;
        modal = document.getElementById('countryInfoModal');
    }
    
    // Show the modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}
