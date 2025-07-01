import React from 'react';
import { Table, Card, Badge } from 'react-bootstrap';
import { useData } from '../../contexts/DataContext';

const TaxBreakdownTable = () => {
  const { comparisonResult, availableCountries } = useData();

  if (!comparisonResult || comparisonResult.length === 0) {
    return null;
  }

  // Get all unique tax types across all countries
  const allTaxTypes = new Set();
  comparisonResult.forEach(country => {
    if (country.taxBreakdown) {
      Object.keys(country.taxBreakdown).forEach(taxType => {
        allTaxTypes.add(taxType);
      });
    }
  });
  
  const taxTypes = Array.from(allTaxTypes).sort();

  // Format tax type for display
  const formatTaxType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get country name from code
  const getCountryName = (countryCode) => {
    const country = availableCountries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + '%';
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-4">Detailed Tax Breakdown</h5>
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Country</th>
                <th className="text-end">Annual Income</th>
                <th className="text-end">Total Tax</th>
                <th className="text-end">Effective Rate</th>
                {taxTypes.map(type => (
                  <th key={type} className="text-end">
                    {formatTaxType(type)}
                  </th>
                ))}
                <th className="text-end">Net Income</th>
              </tr>
            </thead>
            <tbody>
              {comparisonResult.map((country, index) => {
                const countryInfo = availableCountries.find(c => c.code === country.countryCode) || {};
                const currency = countryInfo.currency || 'USD';
                const effectiveRate = country.effectiveRate || (country.totalTax / country.annualIncome);
                const netIncome = country.netIncome || (country.annualIncome - country.totalTax);
                
                return (
                  <tr key={country.countryCode}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2">{countryInfo.flag || '🌐'}</span>
                        <div>
                          <div>{getCountryName(country.countryCode)}</div>
                          <small className="text-muted">{country.countryCode}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-end">
                      {formatCurrency(country.annualIncome, currency)}
                    </td>
                    <td className="text-end fw-bold">
                      {formatCurrency(country.totalTax, currency)}
                    </td>
                    <td className="text-end">
                      <Badge bg={index === 0 ? 'success' : 'light'} text={index === 0 ? 'white' : 'dark'}>
                        {formatPercentage(effectiveRate)}
                      </Badge>
                    </td>
                    {taxTypes.map(type => {
                      const value = country.taxBreakdown?.[type] || 0;
                      const amount = typeof value === 'number' 
                        ? country.totalTax * value 
                        : 0;
                      
                      return (
                        <td key={`${country.countryCode}-${type}`} className="text-end">
                          <div>{formatCurrency(amount, currency)}</div>
                          <small className="text-muted">
                            {formatPercentage(typeof value === 'number' ? value : 0)}
                          </small>
                        </td>
                      );
                    })}
                    <td className="text-end fw-bold text-success">
                      {formatCurrency(netIncome, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="table-light">
              <tr>
                <th colSpan={3 + taxTypes.length} className="text-end">Average</th>
                <th className="text-end">
                  {formatPercentage(
                    comparisonResult.reduce((sum, country) => {
                      const rate = country.effectiveRate || (country.totalTax / country.annualIncome);
                      return sum + rate;
                    }, 0) / comparisonResult.length
                  )}
                </th>
                <th className="text-end">
                  {formatCurrency(
                    comparisonResult.reduce((sum, country) => {
                      const net = country.netIncome || (country.annualIncome - country.totalTax);
                      return sum + net;
                    }, 0) / comparisonResult.length,
                    'USD' // Using USD as default for averages
                  )}
                </th>
              </tr>
            </tfoot>
          </Table>
        </div>
        <div className="mt-3 text-muted small">
          <i className="bi bi-info-circle me-1"></i>
          Tax breakdowns are approximate and for comparison purposes only. Actual tax obligations may vary.
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaxBreakdownTable;
