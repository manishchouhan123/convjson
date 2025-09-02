// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' for React 18+
import 'materialize-css/dist/css/materialize.min.css'; // Import Materialize CSS
import './index.css'; // Custom styles (if necessary)
import App from './App';

// Create the root element and render the app
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<App />);