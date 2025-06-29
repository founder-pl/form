import { renderComponent, html } from '../services/templateLoader.js';
import { getEUCountries, getAllCountries } from '../services/dataService.js';

export function renderCountrySelection() {
    const euCountries = getEUCountries();
    const allCountries = getAllCountries();
    const nonEUCountries = Object.entries(allCountries)
        .filter(([code]) => !euCountries[code])
        .reduce((acc, [code, data]) => ({
            ...acc,
            [code]: data
        }), {});

    const htmlContent = `
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Wybór krajów</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <h6>Kraje UE</h6>
                    <div class="row">
                        ${renderCountryCheckboxes(euCountries, 'eu-')}
                    </div>
                </div>
                
                <div class="mb-3">
                    <h6>Pozostałe kraje</h6>
                    <div class="row">
                        ${renderCountryCheckboxes(nonEUCountries, 'non-eu-')}
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="yearSelect" class="form-label">Rok podatkowy:</label>
                    <select id="yearSelect" class="form-select">
                        ${generateYearOptions()}
                    </select>
                </div>
            </div>
        </div>
    `;

    renderComponent('country-selection', htmlContent);
}

function renderCountryCheckboxes(countries, prefix) {
    return Object.entries(countries).map(([code, country]) => `
        <div class="col-md-6 col-lg-4 mb-2">
            <div class="form-check">
                <input class="form-check-input country-checkbox" 
                       type="checkbox" 
                       value="${code}" 
                       id="${prefix}${code}"
                       ${window.appState.selectedCountries?.has(code) ? 'checked' : ''}>
                <label class="form-check-label" for="${prefix}${code}">
                    ${country.flag} ${country.name}
                </label>
            </div>
        </div>
    `).join('');
}

function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    let options = '';
    
    for (let year = currentYear - 2; year <= currentYear + 2; year++) {
        options += `<option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>`;
    }
    
    return options;
}
