import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(location.state?.from?.pathname || '/account');
      }
    } catch {
      // toast handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-sub">Sign in to your VELORA account</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          <button type="submit" className="btn btn-dark btn-block" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
};

export default Login;
