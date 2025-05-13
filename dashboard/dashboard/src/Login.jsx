import React, { useState } from 'react';
import './Login.css';


const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src="../public/Logo.png" alt="GreenPulse Logo" />
      </div>

      <div className="login-card">
        <h2>Welcome Back !</h2>
        <p>Login to your account to continue</p>

        <form>
          <label>Email</label>
          <input type="email"  required />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={passwordVisible ? 'text' : 'password'}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
            </span>
          </div>

          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
