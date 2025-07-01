import React, { useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useData } from '../contexts/DataContext';
import CountrySelector from '../components/country/CountrySelector';
import TaxSummary from '../components/tax/TaxSummary';
import BusinessTypeSelector from '../components/business/BusinessTypeSelector';
import IncomeInput from '../components/inputs/IncomeInput';

const CountryComparison = () => {
  const {
    selectedCountries,
    businessType,
    annualIncome,
    isLoading,
    error,
    comparisonResult,
    businessTypes,
    availableCountries,
    setBusinessType,
    setAnnualIncome,
    toggleCountry,
    removeCountry,
    runComparison,
    clearComparison
  } = useData();

  const handleCompare = async (e) => {
    e?.preventDefault();
    try {
      await runComparison();
    } catch (err) {
      console.error('Comparison error:', err);
    }
  };

  const handleReset = () => {
    clearComparison();
  };

  return (
    <div className="fade-in">
      <Container className="py-4">
        <h1 className="mb-4">Compare Tax Rates</h1>
        
        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title mb-4">Comparison Settings</h5>
            
            <form onSubmit={handleCompare}>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label">Business Type</label>
                    <BusinessTypeSelector
                      value={businessType}
                      onChange={setBusinessType}
                      businessTypes={businessTypes}
                      disabled={isLoading}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <IncomeInput
                    value={annualIncome}
                    onChange={setAnnualIncome}
                    disabled={isLoading}
                  />
                </Col>
              </Row>

              <div className="mb-4">
                <label className="form-label">Select Countries (2-5)</label>
                {isLoading && availableCountries.length === 0 ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading countries...</span>
                    </Spinner>
                  </div>
                ) : (
                  <CountrySelector
                    selectedCountries={selectedCountries}
                    availableCountries={availableCountries}
                    onToggleCountry={toggleCountry}
                    onRemoveCountry={removeCountry}
                    maxCountries={5}
                    disabled={isLoading}
                  />
                )}
                <div className="form-text">
                  Select 2-5 countries to compare
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={handleReset}
                  disabled={isLoading || (selectedCountries.length === 0 && !comparisonResult)}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={selectedCountries.length < 2 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Comparing...
                    </>
                  ) : (
                    'Compare Countries'
                  )}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => {}} dismissible>
            {error}
          </Alert>
        )}

        {comparisonResult && (
          <TaxSummary
            countries={selectedCountries}
            businessType={businessType}
            annualIncome={annualIncome}
          />
        )}
      </Container>
    </div>
  );
};

export default CountryComparison;
