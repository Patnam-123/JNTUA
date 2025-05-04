import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'  // default role
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevent default form reload
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      alert("Registered Successfully");
      console.log(res.data);
    } catch (err) {
      alert(err.response.data.message || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h2>Register</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} /><br /><br />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} /><br /><br />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} /><br /><br />

      {/* 🔽 Role Selection */}
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select><br /><br />

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
