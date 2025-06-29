/**
 * Initializes the application by setting up the main app container
 * and loading required configurations.
 * @returns {Promise<void>}
 */
export async function initializeApp() {
    try {
        // Set up the main app container
        const appContainer = document.getElementById('app');
        const mainTemplate = document.getElementById('main-template');
        
        if (!appContainer || !mainTemplate) {
            throw new Error('Required DOM elements not found');
        }
        
        // Clone the template and append to app container
        const templateContent = mainTemplate.content.cloneNode(true);
        appContainer.appendChild(templateContent);
        
        // Initialize any global state or configurations here
        window.appState = {
            selectedYear: new Date().getFullYear(),
            selectedCountries: new Set(['PL']), // Default to Poland
            familyData: {
                maritalStatus: 'single',
                spouseLocation: 'none',
                children: [],
                unemploymentStatus: 'none'
            },
            benefitConfig: {
                // Will be populated from config
            }
        };
        
        return Promise.resolve();
    } catch (error) {
        console.error('Error initializing application:', error);
        return Promise.reject(error);
    }
}

/**
 * Loads application configuration
 * @returns {Promise<Object>} Configuration object
 */
export async function loadConfig() {
    try {
        const response = await fetch('data/config.json');
        if (!response.ok) {
            throw new Error('Failed to load configuration');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading configuration:', error);
        return {}; // Return empty config if loading fails
    }
}
