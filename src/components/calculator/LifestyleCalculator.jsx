import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Button, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { useData } from '../../contexts/DataContext';
import TaxComparisonChart from '../visualization/TaxComparisonChart';

const LifestyleCalculator = () => {
  const { availableCountries, loading, error } = useData();
  const [scenario, setScenario] = useState({
    familyType: 'couple',
    adults: 2,
    children: 0,
    childrenAges: [],
    lifestyleLevel: 'moderate',
    housingOption: 'rent_2bed',
    transportationOption: 'public_transport',
    countries: ['PL', 'DE', 'ES'],
    income: { amount: 100000, currency: 'EUR' },
    businessType: 'freelance',
    monthsPerCountry: 6
  });

  const [familyProfiles, setFamilyProfiles] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('setup');

  // Load family profiles data
  useEffect(() => {
    const loadFamilyProfiles = async () => {
      try {
        const response = await fetch('/data/scenarios/familyProfile.json');
        const data = await response.json();
        setFamilyProfiles(data);
      } catch (err) {
        console.error('Error loading family profiles:', err);
      }
    };

    loadFamilyProfiles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setScenario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    setScenario(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleCountryToggle = (countryCode) => {
    setScenario(prev => {
      const newCountries = prev.countries.includes(countryCode)
        ? prev.countries.filter(c => c !== countryCode)
        : [...prev.countries, countryCode];
      return { ...prev, countries: newCountries };
    });
  };

  const calculateCosts = () => {
    if (!familyProfiles) return;

    // This is a simplified calculation - in a real app, you would use actual cost of living data
    const selectedFamily = familyProfiles.familyTypes.find(ft => ft.id === scenario.familyType);
    const selectedLifestyle = familyProfiles.lifestyleLevels.find(l => l.id === scenario.lifestyleLevel);
    const selectedHousing = familyProfiles.housingOptions.find(h => h.id === scenario.housingOption);
    const selectedTransport = familyProfiles.transportationOptions.find(t => t.id === scenario.transportationOption);

    const resultsByCountry = scenario.countries.map(countryCode => {
      const country = availableCountries.find(c => c.code === countryCode) || {};
      
      // Base costs (these would come from actual cost of living data)
      const baseCosts = {
        housing: 1000 * selectedHousing.factor,
        food: 600 * selectedLifestyle.multiplier,
        transportation: 200 * selectedTransport.factor,
        healthcare: 150 * selectedLifestyle.multiplier,
        education: 200 * scenario.children,
        other: 300 * selectedLifestyle.multiplier
      };

      // Adjust for family size
      const familyMultiplier = selectedFamily.factors || {
        housing: 1,
        groceries: 1,
        transportation: 1
      };

      // Calculate total monthly cost
      const monthlyCost = {
        housing: baseCosts.housing * familyMultiplier.housing,
        food: baseCosts.food * familyMultiplier.groceries,
        transportation: baseCosts.transportation * familyMultiplier.transportation,
        healthcare: baseCosts.healthcare,
        education: baseCosts.education,
        other: baseCosts.other,
        taxes: scenario.income.amount * 0.3 // Simplified tax calculation
      };

      const totalMonthly = Object.values(monthlyCost).reduce((sum, val) => sum + val, 0);
      const yearlyCost = totalMonthly * 12;
      const disposableIncome = (scenario.income.amount * 0.7) - yearlyCost; // After-tax income minus expenses

      return {
        country: countryCode,
        countryName: country.name || countryCode,
        flag: country.flag || '🌐',
        currency: country.currency || 'EUR',
        monthlyCost,
        totalMonthly,
        yearlyCost,
        disposableIncome,
        savingsRate: (disposableIncome / (scenario.income.amount * 0.7)) * 100
      };
    });

    setResults(resultsByCountry);
    setActiveTab('results');
  };

  if (loading || !familyProfiles) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error loading data: {error.message}</Alert>;
  }

  return (
    <div className="lifestyle-calculator">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
        id="lifestyle-tabs"
      >
        <Tab eventKey="setup" title="Setup Scenario">
          <Card className="mt-3">
            <Card.Body>
              <h4>Family Situation</h4>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Family Type</Form.Label>
                    <Form.Select 
                      name="familyType" 
                      value={scenario.familyType}
                      onChange={handleInputChange}
                    >
                      {familyProfiles.familyTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name} - {type.description}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Number of Adults</Form.Label>
                    <Form.Control
                      type="number"
                      name="adults"
                      min="1"
                      max="4"
                      value={scenario.adults}
                      onChange={handleNumberInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Number of Children</Form.Label>
                    <Form.Control
                      type="number"
                      name="children"
                      min="0"
                      max="10"
                      value={scenario.children}
                      onChange={(e) => {
                        const numChildren = parseInt(e.target.value) || 0;
                        setScenario(prev => ({
                          ...prev,
                          children: numChildren,
                          childrenAges: Array(numChildren).fill('elementary')
                        }));
                      }}
                    />
                  </Form.Group>

                  {scenario.children > 0 && (
                    <Form.Group className="mb-3">
                      <Form.Label>Children's Ages</Form.Label>
                      {Array.from({ length: scenario.children }).map((_, index) => (
                        <div key={index} className="mb-2">
                          <Form.Label>Child {index + 1}</Form.Label>
                          <Form.Select
                            value={scenario.childrenAges[index] || 'elementary'}
                            onChange={(e) => {
                              const newAges = [...scenario.childrenAges];
                              newAges[index] = e.target.value;
                              setScenario(prev => ({
                                ...prev,
                                childrenAges: newAges
                              }));
                            }}
                          >
                            {familyProfiles.childAgeGroups.map(ageGroup => (
                              <option key={ageGroup.id} value={ageGroup.id}>
                                {ageGroup.name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      ))}
                    </Form.Group>
                  )}
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lifestyle Level</Form.Label>
                    <Form.Select 
                      name="lifestyleLevel" 
                      value={scenario.lifestyleLevel}
                      onChange={handleInputChange}
                    >
                      {familyProfiles.lifestyleLevels.map(level => (
                        <option key={level.id} value={level.id}>
                          {level.name} - {level.description}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Housing</Form.Label>
                    <Form.Select 
                      name="housingOption" 
                      value={scenario.housingOption}
                      onChange={handleInputChange}
                    >
                      {familyProfiles.housingOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name} - {option.description}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Transportation</Form.Label>
                    <Form.Select 
                      name="transportationOption" 
                      value={scenario.transportationOption}
                      onChange={handleInputChange}
                    >
                      {familyProfiles.transportationOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name} - {option.description}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <h4>Income & Business</h4>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Annual Income ({scenario.income.currency})</Form.Label>
                    <Form.Control
                      type="number"
                      name="income.amount"
                      value={scenario.income.amount}
                      onChange={(e) => {
                        const amount = parseInt(e.target.value) || 0;
                        setScenario(prev => ({
                          ...prev,
                          income: { ...prev.income, amount }
                        }));
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Business Type</Form.Label>
                    <Form.Select 
                      name="businessType" 
                      value={scenario.businessType}
                      onChange={handleInputChange}
                    >
                      <option value="freelance">Freelancer / Self-Employed</option>
                      <option value="llc">LLC / Company</option>
                      <option value="employee">Employee</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Months per Country (for nomad scenarios)</Form.Label>
                    <Form.Control
                      type="number"
                      name="monthsPerCountry"
                      min="1"
                      max="12"
                      value={scenario.monthsPerCountry}
                      onChange={handleNumberInput}
                    />
                    <Form.Text className="text-muted">
                      For digital nomads or frequent travelers
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <h4>Select Countries to Compare</h4>
              <div className="country-selection mb-4">
                <div className="row">
                  {availableCountries.slice(0, 12).map(country => (
                    <div key={country.code} className="col-6 col-md-3 mb-2">
                      <Form.Check
                        type="checkbox"
                        id={`country-${country.code}`}
                        label={`${country.flag} ${country.name}`}
                        checked={scenario.countries.includes(country.code)}
                        onChange={() => handleCountryToggle(country.code)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={calculateCosts}
                  disabled={scenario.countries.length === 0}
                >
                  Calculate Costs
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="results" title="Results" disabled={!results}>
          {results && (
            <div className="mt-3">
              <Button 
                variant="outline-secondary" 
                className="mb-3"
                onClick={() => setActiveTab('setup')}
              >
                ← Back to Setup
              </Button>
              
              <h3>Cost of Living Comparison</h3>
              <p className="text-muted">
                Based on your family situation and lifestyle preferences
              </p>

              <div className="table-responsive mb-4">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th className="text-end">Monthly Cost</th>
                      <th className="text-end">Yearly Cost</th>
                      <th className="text-end">Disposable Income</th>
                      <th className="text-end">Savings Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={result.country} className={index === 0 ? 'table-primary' : ''}>
                        <td>
                          <strong>{result.flag} {result.countryName}</strong>
                        </td>
                        <td className="text-end">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: result.currency,
                            maximumFractionDigits: 0
                          }).format(result.totalMonthly)}
                        </td>
                        <td className="text-end">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: result.currency,
                            maximumFractionDigits: 0
                          }).format(result.yearlyCost)}
                        </td>
                        <td className="text-end">
                          <strong>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: result.currency,
                              maximumFractionDigits: 0
                            }).format(result.disposableIncome)}
                          </strong>
                        </td>
                        <td className="text-end">
                          <span className={`badge ${result.savingsRate > 0 ? 'bg-success' : 'bg-danger'}`}>
                            {result.savingsRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4>Cost Breakdown (First Country)</h4>
              {results.length > 0 && (
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-group mb-4">
                      {Object.entries(results[0].monthlyCost).map(([category, amount]) => (
                        <li key={category} className="list-group-item d-flex justify-content-between align-items-center">
                          {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                          <span>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: results[0].currency,
                              maximumFractionDigits: 0
                            }).format(amount)}
                            <span className="text-muted ms-2">
                              ({(amount / results[0].totalMonthly * 100).toFixed(1)}%)
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <TaxComparisonChart />
                  </div>
                </div>
              )}
            </div>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default LifestyleCalculator;
