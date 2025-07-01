import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Create a root container for our React app
const container = document.getElementById('root');
const root = createRoot(container);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
