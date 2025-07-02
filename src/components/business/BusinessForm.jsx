import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Badge, Alert } from 'react-bootstrap';

const BusinessForm = ({
  business,
  availableCountries,
  businessProfiles,
  validation,
  onChange,
  onRemove,
  getLegalForms,
  getIncentives
}) => {
  const [localBusiness, setLocalBusiness] = useState(business);
  
  useEffect(() => {
    setLocalBusiness(business);
  }, [business]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = {
      ...localBusiness,
      [name]: type === 'checkbox' ? checked : value
    };
    
    // Reset dependent fields when business type or country changes
    if ((name === 'type' || name === 'country') && localBusiness[name] !== value) {
      updated.legalForm = '';
      updated.taxOptions = {};
      updated.incentives = [];
    }
    
    setLocalBusiness(updated);
    onChange(updated);
  };

  const handleIncomeChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...localBusiness,
      income: {
        ...localBusiness.income,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      }
    };
    setLocalBusiness(updated);
    onChange(updated);
  };

  const toggleIncentive = (incentiveId) => {
    const updatedIncentives = localBusiness.incentives?.includes(incentiveId)
      ? localBusiness.incentives.filter(id => id !== incentiveId)
      : [...(localBusiness.incentives || []), incentiveId];
    
    const updated = {
      ...localBusiness,
      incentives: updatedIncentives
    };
    
    setLocalBusiness(updated);
    onChange(updated);
  };

  const getBusinessTypeName = (typeId) => {
    const type = businessProfiles.businessTypes.find(t => t.id === typeId);
    return type ? type.name : typeId;
  };

  const getLegalFormName = (typeId, formId) => {
    const type = businessProfiles.businessTypes.find(t => t.id === typeId);
    if (!type) return formId;
    
    const form = type.legalForms.find(f => f.id === formId);
    return form ? form.name : formId;
  };

  const availableBusinessTypes = businessProfiles?.businessTypes || [];
  const legalForms = getLegalForms(localBusiness.type, localBusiness.country);
  const incentives = getIncentives(localBusiness.country);
  const selectedCountry = availableCountries.find(c => c.code === localBusiness.country);

  return (
    <div>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Business Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={localBusiness.name || ''}
              onChange={handleChange}
              isInvalid={!!validation[`business-${localBusiness.id}-name`]}
              placeholder="e.g., My Consulting Business"
            />
            <Form.Control.Feedback type="invalid">
              {validation[`business-${localBusiness.id}-name`]}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Business Type</Form.Label>
            <Form.Select
              name="type"
              value={localBusiness.type || ''}
              onChange={handleChange}
              isInvalid={!!validation[`business-${localBusiness.id}-type`]}
            >
              <option value="">Select business type</option>
              {availableBusinessTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Select
              name="country"
              value={localBusiness.country || ''}
              onChange={handleChange}
              isInvalid={!!validation[`business-${localBusiness.id}-country`]}
            >
              <option value="">Select country</option>
              {availableCountries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validation[`business-${localBusiness.id}-country`]}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Legal Form</Form.Label>
            <Form.Select
              name="legalForm"
              value={localBusiness.legalForm || ''}
              onChange={handleChange}
              disabled={!localBusiness.country || !localBusiness.type}
              isInvalid={!!validation[`business-${localBusiness.id}-legalForm`]}
            >
              <option value="">
                {!localBusiness.country ? 'Select country first' : 
                 !localBusiness.type ? 'Select business type first' : 
                 'Select legal form'}
              </option>
              {legalForms.map(form => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validation[`business-${localBusiness.id}-legalForm`]}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {localBusiness.legalForm && localBusiness.country && (
        <>
          <h5 className="mt-4">Financial Information</h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Annual Revenue</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    {selectedCountry?.currency || 'EUR'}
                  </span>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={localBusiness.income?.amount || ''}
                    onChange={handleIncomeChange}
                    placeholder="e.g., 100000"
                  />
                </div>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Business Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={localBusiness.startDate || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Employees</Form.Label>
                <Form.Control
                  type="number"
                  name="employeeCount"
                  value={localBusiness.employeeCount || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="Number of employees"
                />
              </Form.Group>
            </Col>
          </Row>

          {incentives.length > 0 && (
            <div className="mb-3">
              <h5>Available Tax Incentives</h5>
              <div className="d-flex flex-wrap gap-2">
                {incentives.map(incentive => (
                  <Form.Check
                    key={incentive.id}
                    type="switch"
                    id={`incentive-${localBusiness.id}-${incentive.id}`}
                    label={incentive.name}
                    checked={localBusiness.incentives?.includes(incentive.id) || false}
                    onChange={() => toggleIncentive(incentive.id)}
                    className="me-3"
                  />
                ))}
              </div>
              <Form.Text className="text-muted">
                Select all applicable tax incentives for this business
              </Form.Text>
            </div>
          )}
        </>
      )}

      <div className="d-flex justify-content-between mt-4">
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={onRemove}
        >
          Remove Business
        </Button>
        
        <div>
          {localBusiness.country && localBusiness.legalForm && (
            <Badge bg="info" className="me-2">
              {getBusinessTypeName(localBusiness.type)} • {getLegalFormName(localBusiness.type, localBusiness.legalForm)}
            </Badge>
          )}
          {localBusiness.country && (
            <Badge bg="light" text="dark">
              {selectedCountry?.flag} {selectedCountry?.name}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;
