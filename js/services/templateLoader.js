import { loadCountryData } from './dataService.js';
import { renderCountrySelection } from '../components/countrySelection.js';
import { renderPersonalDataForm } from '../components/personalDataForm.js';
import { renderFamilyBenefitsForm } from '../components/familyBenefitsForm.js';

/**
 * Loads and renders all application templates
 * @returns {Promise<void>}
 */
export async function loadTemplates() {
    try {
        // Load country data first
        await loadCountryData();
        
        // Render each section
        renderCountrySelection();
        renderPersonalDataForm();
        renderFamilyBenefitsForm();
        
        return Promise.resolve();
    } catch (error) {
        console.error('Error loading templates:', error);
        return Promise.reject(error);
    }
}

/**
 * Renders a component into a target element
 * @param {string} targetId - ID of the target element
 * @param {string} html - HTML content to render
 */
export function renderComponent(targetId, html) {
    const target = document.getElementById(targetId);
    if (target) {
        target.innerHTML = html;
    } else {
        console.warn(`Target element #${targetId} not found`);
    }
}

/**
 * Creates a template string with proper escaping
 * @param {TemplateStringsArray} strings - Template string parts
 * @param {...any} values - Values to interpolate
 * @returns {string} Safe HTML string
 */
export function html(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = i < values.length ? values[i] : '';
        return result + string + (typeof value === 'string' ? value : String(value));
    }, '');
}
