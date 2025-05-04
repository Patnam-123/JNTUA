import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation: check if email and password are filled
    if (!form.email || !form.password) {
      setError('Please fill in both email and password.');
      return;
    }

    // Trim any whitespace from the email and password fields
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();

    setLoading(true);
    setError(''); // Reset any previous error

    try {
      const res = await axios.post('http://localhost:5000/login', {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      // Store token in localStorage and show success message
      localStorage.setItem('token', res.data.token);

      // Optionally redirect to a different page or update the UI
      alert('Logged in successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default Login;
