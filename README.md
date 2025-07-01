# Multi-Country Tax Comparison Tool

A comprehensive web application for comparing tax and benefit scenarios across multiple countries, with a focus on European countries. This tool helps individuals and businesses understand their tax obligations and benefits in different jurisdictions.

## Features

- Compare tax scenarios across multiple countries simultaneously
- Support for different business types (production, trade, services, freelance, e-commerce)
- Family and children benefit calculations (500+, 800+, Kindergeld, etc.)
- Customizable income, costs, and days spent in each country
- Support for multiple tax years comparison
- Detailed breakdown of tax calculations and benefits
- Responsive design for desktop and mobile use

## Project Structure

```
form/
├── css/
│   └── styles.css           # Main stylesheet
├── data/
│   ├── benefits.json       # Family and children benefits data
│   └── countries.json       # Country-specific tax and legal data
├── js/
│   ├── components/         # UI components
│   │   ├── countrySelection.js
│   │   ├── familyBenefitsForm.js
│   │   └── personalDataForm.js
│   ├── services/            # Application services
│   │   ├── benefitCalculator.js
│   │   ├── dataService.js
│   │   ├── eventHandlers.js
│   │   ├── tableUpdater.js
│   │   ├── taxCalculator.js
│   │   └── templateLoader.js
│   └── app.js               # Main application entry point
├── index.html               # Main HTML file
└── README.md                # This file
```

## Getting Started

1. **Prerequisites**
   - Modern web browser (Chrome, Firefox, Safari, Edge)
   - Node.js (for development)

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/founder-pl/form.git
   cd form
   
   # Install dependencies (if any)
   npm install
   
   # Start development server (if configured)
   npm run dev
   ```

3. **Usage**
   - Open `index.html` in your web browser
   - Select countries to compare
   - Enter your financial and personal details
   - View and compare tax scenarios

## Data Model

The application uses the following main data structures:

### Country Data
```javascript
{
  "PL": {
    "name": "Poland",
    "flag": "🇵🇱",
    "eu": true,
    "vat": 23,
    "taxIncome": {
      "production": 19,
      "trade": 19,
      "services": 19,
      "freelance": 12,
      "ecommerce": 19
    },
    "socialSecurity": 1500,
    "notes": "Additional country-specific notes"
  }
}
```

### Family Data
```javascript
{
  "maritalStatus": "single",
  "spouseLocation": "PL",
  "unemploymentStatus": "none",
  "children": [
    {
      "name": "Anna",
      "age": 5,
      "isNewborn": false,
      "isStudent": false,
      "isDisabled": false
    }
  ]
}
```

## Extension Points

The application is designed to be extensible. Here are the main extension points:

1. **Adding New Countries**
   - Add country data to `data/countries.json`
   - Add benefit information to `data/benefits.json`

2. **Custom Tax Calculations**
   - Implement custom tax logic in `taxCalculator.js`
   - Use the `getCustomTaxCalculation` hook for country-specific rules

3. **Additional Benefits**
   - Add new benefit types in `benefitCalculator.js`
   - Update the UI components to display new benefit types

## Development

### Building
```bash
# Build for production
npm run build
```

### Testing
```bash
# Run tests
npm test
```

### Code Style
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ESLint for code linting
- Write JSDoc comments for all functions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Bootstrap 5 for responsive design
- Font Awesome for icons
- All contributors who helped improve this tool

## Roadmap

- [ ] Add more countries and regions
- [ ] Implement more detailed tax calculations
- [ ] Add support for historical tax rates
- [ ] Create user accounts for saving scenarios
- [ ] Add more visualization options (charts, graphs)
- [ ] Improve mobile experience
- [ ] Add more documentation and examples