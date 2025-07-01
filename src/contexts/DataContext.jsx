import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDataService } from '../services/dataService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [businessType, setBusinessType] = useState('sole_trader');
  const [annualIncome, setAnnualIncome] = useState(100000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  
  const { getCountryData, getBusinessTypes, calculateTax } = useDataService();
  const [businessTypes, setBusinessTypes] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  // Load business types and available countries on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [types, countries] = await Promise.all([
          getBusinessTypes(),
          getSupportedCountries()
        ]);
        setBusinessTypes(types);
        setAvailableCountries(countries);
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [getBusinessTypes, getSupportedCountries]);

  // Get supported countries with their data
  const getSupportedCountries = async () => {
    const supported = await getCountryData();
    return Object.entries(supported).map(([code, data]) => ({
      code,
      name: data.name,
      flag: data.flag || '🌐',
      currency: data.currency || 'USD'
    }));
  };

  // Add or remove a country from the selection
  const toggleCountry = (countryCode) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryCode)) {
        return prev.filter(code => code !== countryCode);
      } else if (prev.length < 5) {
        return [...prev, countryCode];
      }
      return prev;
    });
  };

  // Remove a country from the selection
  const removeCountry = (countryCode) => {
    setSelectedCountries(prev => prev.filter(code => code !== countryCode));
  };

  // Run the tax comparison
  const runComparison = async () => {
    if (selectedCountries.length < 2) {
      setError('Please select at least 2 countries to compare');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        selectedCountries.map(async (countryCode) => {
          const taxData = await calculateTax(countryCode, {
            businessType,
            annualIncome
          });
          return {
            code: countryCode,
            ...taxData
          };
        })
      );

      // Sort by total tax rate (ascending)
      const sortedResults = results.sort((a, b) => a.totalRate - b.totalRate);
      setComparisonResult(sortedResults);
      return sortedResults;
    } catch (err) {
      setError('Failed to calculate taxes. Please try again.');
      console.error('Comparison error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the current comparison
  const clearComparison = () => {
    setComparisonResult(null);
    setSelectedCountries([]);
  };

  return (
    <DataContext.Provider
      value={{
        // State
        selectedCountries,
        businessType,
        annualIncome,
        isLoading,
        error,
        comparisonResult,
        businessTypes,
        availableCountries,
        
        // Actions
        setBusinessType,
        setAnnualIncome,
        toggleCountry,
        removeCountry,
        runComparison,
        clearComparison
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
