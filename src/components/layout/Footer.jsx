import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Tax Comparison Tool</h5>
            <p className="mb-0">Compare tax rates and business regulations across countries.</p>
          </Col>
          <Col md={6} className="text-md-end mt-3 mt-md-0">
            <p className="mb-1">© {currentYear} Tax Comparison Tool</p>
            <p className="small text-muted mb-0">Data is provided for informational purposes only.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
