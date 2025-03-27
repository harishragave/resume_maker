import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', formData);
  };

  return (
    <div className="login-page-container">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        
      </div>

      <div className="login-content">
        <div className="login-box">
          <h1 className="login-title">Log in to your account</h1>
          <p className="login-subtitle">Login is optional - only needed to save your progress</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-button">
              Log in
            </button>
          </form>

          <div className="signup-prompt">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 