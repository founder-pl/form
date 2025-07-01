import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { DataProvider } from './contexts/DataContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import CountryComparison from './pages/CountryComparison';
import LifestyleCalculator from './components/calculator/LifestyleCalculator';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 py-4">
            <Container>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/compare" element={<CountryComparison />} />
                <Route path="/lifestyle" element={<LifestyleCalculator />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Container>
          </main>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
