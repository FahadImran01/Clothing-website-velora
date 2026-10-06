import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <h3 style={{ fontSize: '3rem' }}>404</h3>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-dark" style={{ marginTop: 24, alignSelf: 'center' }}>Back to Home</Link>
  </div>
);

export default NotFound;
