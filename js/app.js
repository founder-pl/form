// Main application entry point
import { initializeApp } from './services/appInitializer.js';
import { loadTemplates } from './services/templateLoader.js';
import { setupEventListeners } from './services/eventHandlers.js';
import { updateCountryRows } from './services/tableUpdater.js';
import { initCountryData } from './services/dataService.js';
import { loadHints, initializeTooltips, addTableHeaderHelp } from './services/hintService.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize application
        await initializeApp();
        
        // Load hints and initialize tooltips
        await loadHints();
        initializeTooltips();
        
        // Load templates
        await loadTemplates();
        
        // Initialize data
        initCountryData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initial render
        await updateCountryRows();
        
        // Add help to table headers
        addTableHeaderHelp('results');
        
        // Add click handler for country names to show info modal
        document.addEventListener('click', (e) => {
            const countryCell = e.target.closest('.country-name');
            if (countryCell) {
                const countryCode = countryCell.dataset.country;
                if (countryCode) {
                    showCountryInfoModal(countryCode);
                }
            }
        });
        
        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error initializing application:', error);
        document.getElementById('app').innerHTML = `
            <div class="alert alert-danger">
                <h4>Błąd podczas ładowania aplikacji</h4>
                <p>${error.message}</p>
                <p>Proszę odświeżyć stronę lub spróbować później.</p>
            </div>
        `;
    }
});

// Re-export for use in other modules
import { showCountryInfoModal } from './services/hintService.js';
export { showCountryInfoModal };
