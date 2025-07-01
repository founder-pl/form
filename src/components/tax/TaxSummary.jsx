import React from 'react';
import { Card, Row, Col, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import TaxComparisonChart from '../visualization/TaxComparisonChart';
import { useDataService } from '../../services/dataService';

const TaxSummary = ({ countries = [], businessType, annualIncome = 0 }) => {
  const { getCountryData } = useDataService();
  
  // In a real app, this would calculate actual tax based on country rules
  const calculateTax = (countryCode, income) => {
    // This is a simplified calculation
    // In a real app, this would use the country's tax brackets and rules
    const baseRate = 0.2; // Default base rate
    const countryFactor = countryCode.length * 0.01; // Just for demo
    return Math.round(income * (baseRate + countryFactor));
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  if (countries.length === 0) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center py-5">
          <i className="bi bi-graph-up text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3">No countries selected for comparison</h5>
          <p className="text-muted">Select 2 or more countries to see a comparison</p>
        </Card.Body>
      </Card>
    );
  }

  const comparisonData = countries.map(countryCode => {
    const country = getCountryData(countryCode);
    const taxAmount = calculateTax(countryCode, annualIncome);
    const taxRate = taxAmount / annualIncome;
    const netIncome = annualIncome - taxAmount;
    
    return {
      code: countryCode,
      name: country?.name || countryCode,
      flag: country?.flag || '🌐',
      taxAmount,
      taxRate,
      netIncome,
      currency: country?.currency || 'USD'
    };
  }).sort((a, b) => a.taxRate - b.taxRate);

  return (
    <div className="mt-4">
      <h4 className="mb-4">Tax Comparison Results</h4>
      
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <div className="text-center">
                <div className="text-muted small">ANNUAL INCOME</div>
                <div className="h4 mb-0">{formatCurrency(annualIncome)}</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="text-muted small">BUSINESS TYPE</div>
                <div className="h4 mb-0 text-capitalize">{businessType?.replace('_', ' ')}</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="text-muted small">COUNTRIES</div>
                <div className="h4 mb-0">{countries.length}</div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs defaultActiveKey="table" className="mb-3">
        <Tab eventKey="table" title="Table View">
          <Card className="mb-4">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Country</th>
                      <th className="text-end">Tax Rate</th>
                      <th className="text-end">Tax Amount</th>
                      <th className="text-end">Net Income</th>
                      <th className="text-center">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((country, index) => (
                      <tr key={country.code}>
                        <td>
                          <span className="me-2">{country.flag}</span>
                          {country.name}
                          {index === 0 && (
                            <Badge bg="success" className="ms-2">Best Value</Badge>
                          )}
                        </td>
                        <td className="text-end">{formatPercentage(country.taxRate)}</td>
                        <td className="text-end">{formatCurrency(country.taxAmount, country.currency)}</td>
                        <td className="text-end fw-bold">
                          {formatCurrency(country.netIncome, country.currency)}
                        </td>
                        <td className="text-center">
                          <span className={`badge ${index === 0 ? 'bg-primary' : 'bg-light text-dark'}`}>
                            {index + 1}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="chart" title="Chart View">
          <TaxComparisonChart />
        </Tab>
      </Tabs>

      <div className="mt-4 text-muted small">
        <p className="mb-1">
          <i className="bi bi-info-circle me-1"></i> 
          This is a simplified comparison. Actual tax obligations may vary based on specific circumstances.
        </p>
        <p className="mb-0">
          <i className="bi bi-clock-history me-1"></i>
          Data is current as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
        </p>
      </div>
    </div>
  );
};

export default TaxSummary;
