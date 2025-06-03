import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import App from './App.jsx';
import Login from './Login.jsx';

// A wrapper component to manage auth state and routing logic
function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // Runs once on mount

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    navigate('/app'); // Navigate after successful login
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    navigate('/'); // Navigate to login page after logout
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Navigate to="/app" replace />
          )
        }
      />
      <Route
        path="/app"
        element={
          isAuthenticated ? (
            <App onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      {/* Optional: Redirect any other unknown paths to login or app based on auth */}
      {/* <Route path="*" element={<Navigate to={isAuthenticated ? "/app" : "/"} replace />} /> */}
    </Routes>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter /> {/* Use the AppRouter which contains useNavigate */}
    </BrowserRouter>
  </React.StrictMode>
);