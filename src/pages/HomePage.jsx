import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="fade-in">
      <section className="py-5 text-center bg-light">
        <Container>
          <h1 className="display-4 mb-4">Global Tax Comparison Tool</h1>
          <p className="lead">
            Compare tax rates, business regulations, and costs across {63} countries to make informed decisions about
            where to establish your business.
          </p>
          <div className="mt-4">
            <Button as={Link} to="/compare" variant="primary" size="lg" className="me-3">
              Start Comparing <i className="bi bi-arrow-right ms-2"></i>
            </Button>
            <Button variant="outline-secondary" size="lg">
              Learn More
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">Why Compare Tax Systems?</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                    <i className="bi bi-graph-up text-primary" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <Card.Title>Optimize Your Business</Card.Title>
                  <Card.Text>
                    Understand the tax implications of operating in different countries and choose the most
                    advantageous location for your business.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                    <i className="bi bi-globe text-success" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <Card.Title>Global Perspective</Card.Title>
                  <Card.Text>
                    Compare tax rates, business regulations, and costs across {63} countries with our comprehensive
                    database.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                    <i className="bi bi-lightbulb text-warning" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <Card.Title>Informed Decisions</Card.Title>
                  <Card.Text>
                    Make data-driven decisions with our easy-to-use comparison tools and detailed country profiles.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
