import { renderComponent, html } from '../services/templateLoader.js';

export function renderPersonalDataForm() {
    const { familyData } = window.appState;
    const maritalStatus = familyData?.maritalStatus || 'single';
    const spouseLocation = familyData?.spouseLocation || 'none';
    const unemploymentStatus = familyData?.unemploymentStatus || 'none';

    const htmlContent = `
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Dane osobiste</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="maritalStatus" class="form-label">Status związku:</label>
                    <select id="maritalStatus" class="form-select">
                        <option value="single" ${maritalStatus === 'single' ? 'selected' : ''}>Kawaler/Panna</option>
                        <option value="married" ${maritalStatus === 'married' ? 'selected' : ''}>Żonaty/Zamężna</option>
                        <option value="divorced" ${maritalStatus === 'divorced' ? 'selected' : ''}>Rozwiedziony/a</option>
                        <option value="widowed" ${maritalStatus === 'widowed' ? 'selected' : ''}>Wdowiec/Wdowa</option>
                        <option value="partnership" ${maritalStatus === 'partnership' ? 'selected' : ''}>Związek partnerski</option>
                    </select>
                </div>

                ${maritalStatus === 'married' || maritalStatus === 'partnership' ? `
                    <div class="mb-3">
                        <label for="spouseLocation" class="form-label">Miejsce zamieszkania małżonka/partnera:</label>
                        <select id="spouseLocation" class="form-select">
                            <option value="same" ${spouseLocation === 'same' ? 'selected' : ''}>To samo mieszkanie</option>
                            <option value="pl" ${spouseLocation === 'pl' ? 'selected' : ''}>Inne miejsce w Polsce</option>
                            <option value="eu" ${spouseLocation === 'eu' ? 'selected' : ''}>Kraj UE/EOG</option>
                            <option value="other" ${spouseLocation === 'other' ? 'selected' : ''}>Inny kraj</option>
                            <option value="none" ${spouseLocation === 'none' ? 'selected' : ''}>Brak danych</option>
                        </select>
                    </div>
                ` : ''}

                <div class="mb-3">
                    <label for="unemploymentStatus" class="form-label">Status bezrobocia:</label>
                    <select id="unemploymentStatus" class="form-select">
                        <option value="none" ${unemploymentStatus === 'none' ? 'selected' : ''}>Brak</option>
                        <option value="registered" ${unemploymentStatus === 'registered' ? 'selected' : ''}>Zarejestrowany/a w urzędzie pracy</option>
                        <option value="benefits" ${unemploymentStatus === 'benefits' ? 'selected' : ''}>Pobieram zasiłek dla bezrobotnych</option>
                    </select>
                </div>

                <div class="alert alert-info mb-0">
                    <small>
                        <i class="bi bi-info-circle"></i> Te informacje pomogą nam precyzyjniej obliczyć Twoje zobowiązania podatkowe i możliwe ulgi.
                    </small>
                </div>
            </div>
        </div>
    `;

    renderComponent('personal-data', htmlContent);
}
