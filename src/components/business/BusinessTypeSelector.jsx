import React from 'react';
import { Form } from 'react-bootstrap';

const BusinessTypeSelector = ({ value, onChange, businessTypes = [] }) => {
  // Default business types if none provided
  const defaultBusinessTypes = [
    { id: 'sole_trader', name: 'Sole Trader' },
    { id: 'llc', name: 'Limited Liability Company (LLC)' },
    { id: 'corporation', name: 'Corporation' },
    { id: 'partnership', name: 'Partnership' },
    { id: 'branch', name: 'Branch Office' },
  ];

  const typesToUse = businessTypes.length > 0 ? businessTypes : defaultBusinessTypes;

  return (
    <Form.Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Select business type"
    >
      {typesToUse.map((type) => (
        <option key={type.id} value={type.id}>
          {type.name}
        </option>
      ))}
    </Form.Select>
  );
};

export default BusinessTypeSelector;
