import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Tabs, Tab, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import BusinessProfileEditor from './BusinessProfileEditor';
import ScenarioComparison from './ScenarioComparison';
import businessProfiles from '../../data/scenarios/businessProfile.json';

const BusinessScenarioManager = () => {
  const { availableCountries } = useContext(DataContext);
  const [scenarios, setScenarios] = useState([]);
  const [activeTab, setActiveTab] = useState('scenarios');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Load saved scenarios from localStorage on component mount
  useEffect(() => {
    const savedScenarios = JSON.parse(localStorage.getItem('businessScenarios') || '[]');
    setScenarios(savedScenarios);
  }, []);

  // Save scenarios to localStorage whenever they change
  useEffect(() => {
    if (scenarios.length > 0) {
      localStorage.setItem('businessScenarios', JSON.stringify(scenarios));
    }
  }, [scenarios]);

  const createNewScenario = () => {
    const newScenario = {
      id: Date.now().toString(),
      name: `Business Scenario ${scenarios.length + 1}`,
      description: '',
      businesses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setScenarios([...scenarios, newScenario]);
    setSelectedScenario(newScenario);
    setIsEditing(true);
    setActiveTab('editor');
  };

  const updateScenario = (updatedScenario) => {
    setScenarios(scenarios.map(s => 
      s.id === updatedScenario.id ? { ...updatedScenario, updatedAt: new Date().toISOString() } : s
    ));
    setSelectedScenario(updatedScenario);
  };

  const deleteScenario = (id) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      const updatedScenarios = scenarios.filter(s => s.id !== id);
      setScenarios(updatedScenarios);
      if (selectedScenario && selectedScenario.id === id) {
        setSelectedScenario(null);
        setIsEditing(false);
      }
    }
  };

  const duplicateScenario = (scenario) => {
    const newScenario = {
      ...scenario,
      id: Date.now().toString(),
      name: `${scenario.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setScenarios([...scenarios, newScenario]);
  };

  const renderScenarioCard = (scenario) => {
    const businessCount = scenario.businesses?.length || 0;
    const countries = [...new Set(scenario.businesses?.map(b => b.country))];
    
    return (
      <Card key={scenario.id} className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Card.Title>{scenario.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {businessCount} {businessCount === 1 ? 'business' : 'businesses'} in {countries.length} countries
              </Card.Subtitle>
              {scenario.description && <p className="mb-2">{scenario.description}</p>}
              <div className="mb-2">
                {countries.map(countryCode => {
                  const country = availableCountries.find(c => c.code === countryCode);
                  return country ? (
                    <Badge key={countryCode} bg="light" text="dark" className="me-2 mb-1">
                      {country.flag} {country.name}
                    </Badge>
                  ) : null;
                })}
              </div>
              <small className="text-muted">
                Last updated: {new Date(scenario.updatedAt).toLocaleDateString()}
              </small>
            </div>
            <div className="btn-group">
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-1"
                onClick={() => {
                  setSelectedScenario(scenario);
                  setIsEditing(true);
                  setActiveTab('editor');
                }}
              >
                Edit
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                className="me-1"
                onClick={() => duplicateScenario(scenario)}
              >
                Duplicate
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => deleteScenario(scenario.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container className="py-4">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
        id="business-scenario-tabs"
      >
        <Tab eventKey="scenarios" title="My Scenarios">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Business Scenarios</h2>
            <Button variant="primary" onClick={createNewScenario}>
              <i className="bi bi-plus-lg me-2"></i>New Scenario
            </Button>
          </div>
          
          {scenarios.length === 0 ? (
            <Alert variant="info">
              You don't have any business scenarios yet. Create your first scenario to get started.
            </Alert>
          ) : (
            <div className="scenario-list">
              {scenarios.map(renderScenarioCard)}
            </div>
          )}
        </Tab>
        
        <Tab 
          eventKey="editor" 
          title={isEditing ? 'Edit Scenario' : 'New Scenario'}
          disabled={!selectedScenario && scenarios.length === 0}
        >
          {selectedScenario ? (
            <BusinessProfileEditor
              scenario={selectedScenario}
              onSave={updateScenario}
              onCancel={() => {
                setIsEditing(false);
                setActiveTab('scenarios');
              }}
              businessProfiles={businessProfiles}
              availableCountries={availableCountries}
            />
          ) : (
            <div className="text-center py-5">
              <h3>No scenario selected</h3>
              <p>Please select a scenario to edit or create a new one.</p>
              <Button variant="primary" onClick={createNewScenario}>
                Create New Scenario
              </Button>
            </div>
          )}
        </Tab>
        
        <Tab 
          eventKey="compare" 
          title="Compare Scenarios"
          disabled={scenarios.length < 2}
        >
          {scenarios.length >= 2 ? (
            <ScenarioComparison 
              scenarios={scenarios}
              availableCountries={availableCountries}
            />
          ) : (
            <Alert variant="info">
              You need at least 2 scenarios to compare. Create more scenarios to enable comparison.
            </Alert>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default BusinessScenarioManager;
