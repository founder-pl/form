import React from 'react';
import { Form, Badge, Button, Row, Col } from 'react-bootstrap';
import { useDataService } from '../../services/dataService';

const CountrySelector = ({ selectedCountries = [], onSelect, onRemove }) => {
  const { getSupportedCountries } = useDataService();
  const countries = getSupportedCountries();
  
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    if (countryCode) {
      onSelect(countryCode);
      e.target.value = ''; // Reset the select
    }
  };

  return (
    <div>
      <Form.Select 
        onChange={handleCountryChange}
        value=""
        aria-label="Select a country to compare"
      >
        <option value="">Select a country...</option>
        {countries.map((country) => (
          <option 
            key={country.code} 
            value={country.code}
            disabled={selectedCountries.includes(country.code)}
          >
            {country.name}
          </option>
        ))}
      </Form.Select>

      {selectedCountries.length > 0 && (
        <div className="mt-3">
          <p className="mb-2">Selected Countries:</p>
          <div className="d-flex flex-wrap gap-2">
            {selectedCountries.map((countryCode) => {
              const country = countries.find(c => c.code === countryCode);
              return (
                <Badge 
                  key={countryCode} 
                  bg="primary" 
                  className="d-flex align-items-center p-2"
                >
                  <span className="me-2">{country?.flag || '🌐'}</span>
                  {country?.name || countryCode}
                  <Button 
                    variant="link" 
                    className="text-white p-0 ms-2"
                    onClick={() => onRemove(countryCode)}
                    aria-label={`Remove ${country?.name || countryCode}`}
                  >
                    <i className="bi bi-x-lg"></i>
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
