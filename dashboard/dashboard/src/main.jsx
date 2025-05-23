// src/main.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';
import Login from './Login.jsx';

function RootComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Authentication handler
  const handleLogin = (email, password) => {
    // You can replace this with real authentication logic
    if (email === 'pasindumalshan237@gmail.com' && password === '1234') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid email or password');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Conditional rendering based on authentication state
  return isLoggedIn ? (
    <App onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}

// Render the application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>
);