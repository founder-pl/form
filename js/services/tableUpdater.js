import { getCountryData, getEUCountries } from './dataService.js';
import { calculateTaxForCountry } from './taxCalculator.js';
import { renderComponent, html } from './templateLoader.js';

/**
 * Updates the country rows in the results table
 */
export function updateCountryRows() {
    const tbody = document.querySelector('#results tbody');
    if (!tbody) return;
    
    const { selectedCountries, countryData, selectedYear } = window.appState;
    let tableHtml = '<tbody>';
    
    // Add header row
    tableHtml += `
        <tr>
            <th>Kraj</th>
            <th>Rodzaj działalności</th>
            <th>Dni w ${selectedYear}</th>
            <th>Dni w ${selectedYear + 1}</th>
            <th>Status</th>
            <th>Przychód (roczny)</th>
            <th>Koszty (roczne)</th>
            <th>Podstawa opodatkowania</th>
            <th>Stawka podatku</th>
            <th>VAT</th>
            <th>ZUS/NFZ</th>
            <th>Świadczenia</th>
            <th>Podatek</th>
            <th>Dochód netto</th>
            <th>Efektywna stawka</th>
            <th>Uwagi</th>
        </tr>
    `;
    
    // Add country rows
    selectedCountries.forEach(countryCode => {
        const country = getCountryData(countryCode);
        if (!country) return;
        
        const data = countryData[countryCode] || {};
        const isEU = country.eu || false;
        const isResident = data.isCitizen || countryCode === 'PL'; // Default to true for PL
        
        // Calculate tax
        const taxResult = calculateTaxForCountry(countryCode, data);
        
        tableHtml += `
            <tr data-country="${countryCode}" class="country-row">
                <td>
                    <span class="country-name text-primary cursor-pointer" data-country="${countryCode}">
                        ${country.flag} ${country.name}
                        ${isEU ? '<span class="badge bg-primary ms-1">EU</span>' : ''}
                        <i class="bi bi-info-circle ms-1" style="font-size: 0.8rem; opacity: 0.7;"></i>
                    </span>
                </td>
                <td>
                    <select class="form-select form-select-sm business-type" data-country="${countryCode}">
                        <option value="production" ${data.businessType === 'production' ? 'selected' : ''}>Produkcja</option>
                        <option value="trade" ${data.businessType === 'trade' ? 'selected' : ''}>Handel</option>
                        <option value="services" ${data.businessType === 'services' ? 'selected' : ''}>Usługi</option>
                        <option value="freelance" ${data.businessType === 'freelance' ? 'selected' : ''}>Wolny zawód</option>
                        <option value="ecommerce" ${data.businessType === 'ecommerce' ? 'selected' : ''}>E-commerce</option>
                    </select>
                </td>
                <td><input type="number" class="form-control form-control-sm days-input" 
                    value="${data.daysYear1 || 0}" min="0" max="366" data-year="1"></td>
                <td><input type="number" class="form-control form-control-sm days-input" 
                    value="${data.daysYear2 || 0}" min="0" max="366" data-year="2"></td>
                <td>${isResident ? 'Rezydent' : 'Nierezydent'}</td>
                <td><input type="number" class="form-control form-control-sm financial-input revenue-input" 
                    value="${data.revenue || 0}" min="0"></td>
                <td><input type="number" class="form-control form-control-sm financial-input costs-input" 
                    value="${data.costs || 0}" min="0"></td>
                <td class="taxable-income">${formatNumber(taxResult.taxableIncome)}</td>
                <td>${taxResult.taxRate}%</td>
                <td>
                    <div class="form-check form-switch">
                        <input class="form-check-input vat-checkbox" type="checkbox" 
                            ${data.vatEnabled ? 'checked' : ''}>
                        <span class="ms-2">${country.vat}%</span>
                    </div>
                </td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" 
                            data-bs-toggle="dropdown" aria-expanded="false">
                            ${getInsuranceLabel(data.socialInsurance?.paidIn)}
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" data-type="social" data-value="${countryCode}">W kraju</a></li>
                            <li><a class="dropdown-item" href="#" data-type="social" value="PL">W Polsce</a></li>
                            <li><a class="dropdown-item" href="#" data-type="social" value="other">Inny kraj</a></li>
                            <li><a class="dropdown-item" href="#" data-type="social" value="none">Brak</a></li>
                        </ul>
                    </div>
                </td>
                <td class="benefits">${formatNumber(taxResult.benefits || 0)}</td>
                <td class="total-tax">${formatNumber(taxResult.tax || 0)}</td>
                <td class="net-income">${formatNumber(taxResult.netIncome || 0)}</td>
                <td class="effective-rate">${taxResult.effectiveRate || '0.00'}%</td>
                <td class="notes">${country.notes || ''}</td>
            </tr>
        `;
    });
    
    tableHtml += '</tbody>';
    
    // Add summary row
    const summary = calculateSummary();
    tableHtml += `
        <tfoot class="table-group-divider">
            <tr class="table-active">
                <th colspan="5">Podsumowanie</th>
                <th>${formatNumber(summary.totalRevenue)}</th>
                <th>${formatNumber(summary.totalCosts)}</th>
                <th>${formatNumber(summary.totalTaxableIncome)}</th>
                <th colspan="2"></th>
                <th>${formatNumber(summary.totalBenefits)}</th>
                <th>${formatNumber(summary.totalTax)}</th>
                <th>${formatNumber(summary.totalNetIncome)}</th>
                <th>${summary.avgEffectiveRate}%</th>
                <th></th>
            </tr>
        </tfoot>
    `;
    
    // Update the table
    tbody.outerHTML = tableHtml;
    
    // Add validation for days
    validateDaysInputs();
}

/**
 * Updates all calculations in the table
 */
export function updateCalculations() {
    const { selectedCountries, countryData } = window.appState;
    let totalRevenue = 0;
    let totalCosts = 0;
    let totalTax = 0;
    let totalBenefits = 0;
    let totalNetIncome = 0;
    
    // Update each country row
    selectedCountries.forEach(countryCode => {
        const row = document.querySelector(`tr[data-country="${countryCode}"]`);
        if (!row) return;
        
        const data = countryData[countryCode];
        const taxResult = calculateTaxForCountry(countryCode, data);
        
        // Update row cells
        row.querySelector('.taxable-income').textContent = formatNumber(taxResult.taxableIncome);
        row.querySelector('.total-tax').textContent = formatNumber(taxResult.tax);
        row.querySelector('.net-income').textContent = formatNumber(taxResult.netIncome);
        row.querySelector('.effective-rate').textContent = `${taxResult.effectiveRate}%`;
        row.querySelector('.benefits').textContent = formatNumber(taxResult.benefits || 0);
        
        // Update totals
        totalRevenue += data.revenue || 0;
        totalCosts += data.costs || 0;
        totalTax += taxResult.tax || 0;
        totalBenefits += taxResult.benefits || 0;
        totalNetIncome += taxResult.netIncome || 0;
    });
    
    // Update summary row
    updateSummaryRow(totalRevenue, totalCosts, totalTax, totalNetIncome, totalBenefits);
}

/**
 * Updates the summary row with totals
 * @param {number} totalRevenue - Total revenue
 * @param {number} totalCosts - Total costs
 * @param {number} totalTax - Total tax
 * @param {number} totalNetIncome - Total net income
 * @param {number} totalBenefits - Total benefits
 */
function updateSummaryRow(totalRevenue, totalCosts, totalTax, totalNetIncome, totalBenefits) {
    const tfoot = document.querySelector('#results tfoot');
    if (!tfoot) return;
    
    const totalTaxableIncome = totalRevenue - totalCosts;
    const avgEffectiveRate = totalTaxableIncome > 0 ? 
        ((totalTax / totalTaxableIncome) * 100).toFixed(2) : '0.00';
    
    tfoot.innerHTML = `
        <tr class="table-active">
            <th colspan="5">Podsumowanie</th>
            <th>${formatNumber(totalRevenue)}</th>
            <th>${formatNumber(totalCosts)}</th>
            <th>${formatNumber(totalTaxableIncome)}</th>
            <th colspan="2"></th>
            <th>${formatNumber(totalBenefits)}</th>
            <th>${formatNumber(totalTax)}</th>
            <th>${formatNumber(totalNetIncome)}</th>
            <th>${avgEffectiveRate}%</th>
            <th></th>
        </tr>
    `;
}

/**
 * Calculates summary values for all countries
 * @returns {Object} Summary values
 */
function calculateSummary() {
    const { selectedCountries, countryData } = window.appState;
    let totalRevenue = 0;
    let totalCosts = 0;
    let totalTax = 0;
    let totalBenefits = 0;
    let totalNetIncome = 0;
    
    selectedCountries.forEach(countryCode => {
        const data = countryData[countryCode];
        const taxResult = calculateTaxForCountry(countryCode, data);
        
        totalRevenue += data.revenue || 0;
        totalCosts += data.costs || 0;
        totalTax += taxResult.tax || 0;
        totalBenefits += taxResult.benefits || 0;
        totalNetIncome += taxResult.netIncome || 0;
    });
    
    const totalTaxableIncome = totalRevenue - totalCosts;
    const avgEffectiveRate = totalTaxableIncome > 0 ? 
        ((totalTax / totalTaxableIncome) * 100).toFixed(2) : '0.00';
    
    return {
        totalRevenue,
        totalCosts,
        totalTaxableIncome,
        totalTax,
        totalBenefits,
        totalNetIncome,
        avgEffectiveRate
    };
}

/**
 * Validates days inputs to ensure they don't exceed days in year
 */
function validateDaysInputs() {
    const inputs = document.querySelectorAll('.days-input');
    const currentYear = new Date().getFullYear();
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            const year = parseInt(this.dataset.year) || 1;
            const yearToCheck = currentYear + (year - 1);
            const maxDays = isLeapYear(yearToCheck) ? 366 : 365;
            
            if (this.value > maxDays) {
                this.value = maxDays;
                // Trigger change event to update calculations
                this.dispatchEvent(new Event('input'));
            }
        });
    });
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
 * Formats a number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Gets the display label for insurance type
 * @param {string} type - Insurance type
 * @returns {string} Display label
 */
function getInsuranceLabel(type) {
    switch (type) {
        case 'PL': return 'W Polsce';
        case 'other': return 'Inny kraj';
        case 'none': return 'Brak';
        default: return 'W kraju';
    }
}
