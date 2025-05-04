import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Add CSS for styling

const API_URL = 'http://localhost:3000';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    } catch  {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="login-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="login-input"
      />
      <button onClick={handleLogin} className="login-btn">
        Login
      </button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Login;
