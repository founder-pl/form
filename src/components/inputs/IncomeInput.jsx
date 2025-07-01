import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const IncomeInput = ({ value, onChange, label = 'Annual Income', currency = 'USD' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleChange = (e) => {
    // Remove all non-digit characters and parse as number
    const rawValue = e.target.value.replace(/\D/g, '');
    onChange(parseInt(rawValue, 10) || 0);
  };

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <InputGroup.Text>{currency}</InputGroup.Text>
        <Form.Control
          type="text"
          value={formatCurrency(value)}
          onChange={handleChange}
          aria-label="Annual income"
          inputMode="numeric"
        />
      </InputGroup>
      <div className="d-flex justify-content-between mt-2">
        {[25000, 50000, 100000, 150000].map((amount) => (
          <Button
            key={amount}
            variant="outline-secondary"
            size="sm"
            onClick={() => onChange(amount)}
            className="flex-grow-1 me-1"
          >
            {formatCurrency(amount)}
          </Button>
        ))}
      </div>
    </Form.Group>
  );
};

export default IncomeInput;
