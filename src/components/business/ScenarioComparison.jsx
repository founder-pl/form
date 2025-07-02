import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ScenarioComparison = ({ scenarios, availableCountries }) => {
  if (scenarios.length < 2) {
    return (
      <Alert variant="info">
        You need at least 2 scenarios to compare. Create more scenarios to enable comparison.
      </Alert>
    );
  }

  // Calculate tax and financial metrics for each scenario
  const getScenarioMetrics = (scenario) => {
    const metrics = {
      id: scenario.id,
      name: scenario.name,
      businessCount: scenario.businesses?.length || 0,
      totalRevenue: 0,
      totalTax: 0,
      effectiveTaxRate: 0,
      countries: [],
      businesses: []
    };

    // Calculate metrics for each business in the scenario
    scenario.businesses?.forEach(business => {
      const country = availableCountries.find(c => c.code === business.country);
      const revenue = business.income?.amount || 0;
      const taxRate = calculateEffectiveTaxRate(business);
      const taxAmount = revenue * (taxRate / 100);
      
      metrics.totalRevenue += revenue;
      metrics.totalTax += taxAmount;
      
      if (!metrics.countries.some(c => c.code === business.country)) {
        metrics.countries.push({
          code: business.country,
          name: country?.name || business.country,
          flag: country?.flag || '🌐'
        });
      }
      
      metrics.businesses.push({
        name: business.name,
        country: business.country,
        type: business.type,
        legalForm: business.legalForm,
        revenue,
        taxRate,
        taxAmount
      });
    });
    
    // Calculate effective tax rate for the entire scenario
    metrics.effectiveTaxRate = metrics.totalRevenue > 0 
      ? (metrics.totalTax / metrics.totalRevenue) * 100 
      : 0;
    
    return metrics;
  };

  // Simplified tax calculation (to be replaced with actual tax calculation logic)
  const calculateEffectiveTaxRate = (business) => {
    // Base tax rates by country (simplified for demonstration)
    const baseRates = {
      'PL': 19,  // Poland: 19% CIT
      'DE': 30,  // Germany: ~30% corporate tax
      'FR': 28,  // France: 28% corporate tax
      'ES': 25,  // Spain: 25% corporate tax
      'IT': 24,  // Italy: 24% corporate tax
      'NL': 25.8, // Netherlands: 25.8% corporate tax
      'BE': 25,  // Belgium: 25% corporate tax
      'AT': 25,  // Austria: 25% corporate tax
      'SE': 20.6, // Sweden: 20.6% corporate tax
      'DK': 22,  // Denmark: 22% corporate tax
      'FI': 20,  // Finland: 20% corporate tax
      'IE': 12.5, // Ireland: 12.5% corporate tax
      'LU': 24.9, // Luxembourg: 24.9% corporate tax
      'CH': 18,  // Switzerland: ~18% effective rate
      'NO': 22,  // Norway: 22% corporate tax
      'US': 21,  // US: 21% federal corporate tax
      'GB': 19,  // UK: 19% corporate tax
    };
    
    let rate = baseRates[business.country] || 25; // Default to 25% if country not found
    
    // Apply adjustments based on business type and incentives
    if (business.type === 'freelance') {
      // Freelancers might have different tax treatment
      rate = rate * 0.8; // 20% reduction for freelancers (simplified)
    }
    
    // Apply incentive discounts
    if (business.incentives?.includes('poland_800_plus')) {
      // Poland's 800+ program provides significant tax benefits
      rate = Math.max(5, rate * 0.5); // At least 5% tax
    }
    
    if (business.incentives?.includes('startup_relief')) {
      // Startup relief reduces tax rate
      rate = rate * 0.7; // 30% reduction
    }
    
    return Math.min(rate, 35); // Cap at 35%
  };

  // Prepare data for charts
  const scenarioMetrics = scenarios.map(getScenarioMetrics);
  
  // Data for bar chart
  const barChartData = scenarioMetrics.map(metrics => ({
    name: metrics.name,
    'Total Revenue': metrics.totalRevenue,
    'Total Tax': metrics.totalTax,
    'Effective Tax Rate': metrics.effectiveTaxRate
  }));
  
  // Data for tax rate comparison
  const taxRateData = scenarioMetrics.map(metrics => ({
    name: metrics.name,
    'Tax Rate': metrics.effectiveTaxRate
  }));

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Compare Scenarios</h2>
      
      <Tabs defaultActiveKey="summary" className="mb-4">
        <Tab eventKey="summary" title="Summary">
          <Row className="mb-4">
            <Col md={12}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Financial Overview</Card.Title>
                  <div style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === 'Effective Tax Rate') {
                              return [`${value.toFixed(2)}%`, name];
                            }
                            return [new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'EUR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(value), name];
                          }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="Total Revenue" fill="#8884d8" name="Total Revenue" />
                        <Bar yAxisId="left" dataKey="Total Tax" fill="#82ca9d" name="Total Tax" />
                        <Bar yAxisId="right" dataKey="Effective Tax Rate" fill="#ffc658" name="Effective Tax Rate" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Detailed Comparison</Card.Title>
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Metric</th>
                          {scenarioMetrics.map(metrics => (
                            <th key={metrics.id}>
                              {metrics.name}
                              <div className="small text-muted">
                                {metrics.countries.map(c => (
                                  <span key={c.code} className="me-2">
                                    {c.flag} {c.name}
                                  </span>
                                ))}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Number of Businesses</td>
                          {scenarioMetrics.map(metrics => (
                            <td key={metrics.id}>
                              {metrics.businessCount}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>Total Revenue</td>
                          {scenarioMetrics.map(metrics => (
                            <td key={metrics.id}>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              }).format(metrics.totalRevenue)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>Total Tax</td>
                          {scenarioMetrics.map(metrics => (
                            <td key={metrics.id}>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              }).format(metrics.totalTax)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>Effective Tax Rate</td>
                          {scenarioMetrics.map(metrics => (
                            <td key={metrics.id}>
                              <Badge bg={metrics.effectiveTaxRate < 15 ? 'success' : 
                                         metrics.effectiveTaxRate < 25 ? 'warning' : 'danger'}>
                                {metrics.effectiveTaxRate.toFixed(2)}%
                              </Badge>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="tax-rates" title="Tax Rates">
          <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Tax Rate Comparison</Card.Title>
                  <div style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={taxRateData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          label={{ value: 'Tax Rate (%)', angle: -90, position: 'insideLeft' }}
                          domain={[0, 35]}
                        />
                        <Tooltip
                          formatter={(value) => [`${value.toFixed(2)}%`, 'Tax Rate']}
                        />
                        <Legend />
                        <Bar dataKey="Tax Rate" fill="#8884d8" name="Effective Tax Rate" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="businesses" title="Businesses">
          <Row>
            {scenarioMetrics.map(metrics => (
              <Col md={6} key={metrics.id} className="mb-4">
                <Card>
                  <Card.Header>
                    <h5>{metrics.name}</h5>
                    <div className="small">
                      {metrics.countries.map(c => (
                        <Badge key={c.code} bg="light" text="dark" className="me-2">
                          {c.flag} {c.name}
                        </Badge>
                      ))}
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Business</th>
                          <th>Type</th>
                          <th>Revenue</th>
                          <th>Tax Rate</th>
                          <th>Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.businesses.map((biz, idx) => (
                          <tr key={idx}>
                            <td>{biz.name}</td>
                            <td>{biz.type}</td>
                            <td>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              }).format(biz.revenue)}
                            </td>
                            <td>{biz.taxRate.toFixed(2)}%</td>
                            <td>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              }).format(biz.taxAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ScenarioComparison;
