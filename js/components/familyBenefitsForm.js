import { renderComponent, html } from '../services/templateLoader.js';
import { calculateBenefits } from '../services/benefitCalculator.js';

export function renderFamilyBenefitsForm() {
    const { familyData } = window.appState;
    const children = familyData?.children || [];
    
    const htmlContent = `
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Dane rodzinne</h5>
                <button type="button" class="btn btn-sm btn-primary add-child-btn">
                    <i class="bi bi-plus-lg"></i> Dodaj dziecko
                </button>
            </div>
            <div class="card-body">
                ${children.length === 0 ? `
                    <div class="text-center text-muted py-3">
                        Brak dodanych dzieci. Kliknij przycisk powyżej, aby dodać.
                    </div>
                ` : ''}
                
                <div id="children-list">
                    ${renderChildrenList(children)}
                </div>
                
                ${children.length > 0 ? `
                    <div class="mt-3">
                        <h6>Dostępne świadczenia:</h6>
                        <div id="available-benefits" class="list-group list-group-flush">
                            ${renderAvailableBenefits()}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    renderComponent('family-benefits', htmlContent);
}

function renderChildrenList(children) {
    if (children.length === 0) return '';
    
    return children.map((child, index) => `
        <div class="child-item card mb-3" data-index="${index}">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Dziecko #${index + 1}</h6>
                <button type="button" class="btn-close remove-child-btn" 
                        data-index="${index}" aria-label="Usuń"></button>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Imię (opcjonalnie)</label>
                        <input type="text" class="form-control child-name" 
                               value="${child.name || ''}" 
                               placeholder="Imię dziecka">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Wiek</label>
                        <div class="input-group">
                            <input type="number" class="form-control child-age" 
                                   value="${child.age || 0}" min="0" max="30">
                            <span class="input-group-text">lat</span>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-check form-switch pt-4">
                            <input class="form-check-input child-newborn" type="checkbox" 
                                   ${child.isNewborn ? 'checked' : ''} 
                                   id="newborn-${index}">
                            <label class="form-check-label" for="newborn-${index}">
                                Noworodek (<18m-cy)
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-check">
                            <input class="form-check-input child-student" type="checkbox" 
                                   ${child.isStudent ? 'checked' : ''} 
                                   id="student-${index}">
                            <label class="form-check-label" for="student-${index}">
                                Uczeń/Student
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-check">
                            <input class="form-check-input child-disabled" type="checkbox" 
                                   ${child.isDisabled ? 'checked' : ''} 
                                   id="disabled-${index}">
                            <label class="form-check-label" for="disabled-${index}">
                                Niepełnosprawność
                            </label>
                        </div>
                    </div>
                </div>
                
                ${renderChildBenefits(index, child)}
            </div>
        </div>
    `).join('');
}

function renderChildBenefits(childIndex, child) {
    // This would be populated based on actual benefit calculations
    let benefits = [];
    
    // Example benefits (would come from benefit calculator)
    if (child.age < 18) {
        benefits.push({
            name: 'Zasiłek rodzinny',
            amount: 500,
            frequency: 'miesięcznie',
            description: 'Podstawowy zasiłek na dziecko'
        });
    }
    
    if (child.isNewborn) {
        benefits.push({
            name: 'Becikowe',
            amount: 1000,
            frequency: 'jednorazowo',
            description: 'Jednorazowa zapomoga z tytułu urodzenia dziecka'
        });
    }
    
    if (benefits.length === 0) return '';
    
    return `
        <div class="mt-3 pt-2 border-top">
            <h6>Dostępne świadczenia:</h6>
            <div class="list-group list-group-flush">
                ${benefits.map(benefit => `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${benefit.name}</h6>
                            <small class="text-muted">${benefit.description}</small>
                        </div>
                        <span class="badge bg-primary rounded-pill">
                            ${benefit.amount} zł ${benefit.frequency}
                        </span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAvailableBenefits() {
    // This would be populated based on the selected countries and family situation
    const { selectedCountries } = window.appState;
    let benefits = [];
    
    // Example benefits (would come from benefit calculator)
    if (selectedCountries.has('PL')) {
        benefits.push({
            name: 'Program 500+',
            amount: 500,
            frequency: 'miesięcznie na dziecko',
            description: 'Świadczenie wychowawcze 500+',
            link: 'https://www.gov.pl/web/rodzina/500plus--rzadowy-program-pomocy-rodzinom'
        });
        
        benefits.push({
            name: 'Program 800+',
            amount: 800,
            frequency: 'miesięcznie na dziecko do 18 miesiąca',
            description: 'Dodatek wychowawczy 800+',
            link: 'https://www.gov.pl/web/rodzina/800-plus'
        });
    }
    
    if (selectedCountries.has('DE')) {
        benefits.push({
            name: 'Kindergeld',
            amount: '219-250',
            frequency: 'miesięcznie na dziecko',
            description: 'Niemiecki dodatek na dzieci',
            link: 'https://www.arbeitsagentur.de/familie-und-kinder/kindergeld'
        });
    }
    
    if (benefits.length === 0) {
        return `
            <div class="list-group-item">
                <div class="text-muted">Brak dostępnych świadczeń dla wybranych krajów.</div>
            </div>
        `;
    }
    
    return benefits.map(benefit => `
        <a href="${benefit.link}" target="_blank" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${benefit.name}</h6>
                <span class="text-primary">${benefit.amount} zł</span>
            </div>
            <p class="mb-1">${benefit.description}</p>
            <small class="text-muted">${benefit.frequency}</small>
        </a>
    `).join('');
}
