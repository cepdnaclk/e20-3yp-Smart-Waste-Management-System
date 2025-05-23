// src/Login.jsx
import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Pass credentials up to parent component for authentication
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src="./Logo.png" alt="GreenPulse Logo" />
      </div>

      <div className="login-card">
        <h2>Welcome Back!</h2>
        <p>Login to your account to continue</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? '🙈' : '👁️'}
            </span>
          </div>

          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;