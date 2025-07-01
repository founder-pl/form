import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="text-center py-5 my-5">
      <div className="py-5 my-5">
        <h1 className="display-1 text-muted">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button as={Link} to="/" variant="primary" size="lg">
          <i className="bi bi-house-door me-2"></i> Back to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFoundPage;
