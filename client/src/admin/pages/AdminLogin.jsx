import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../pages/Auth.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      navigate('/admin');
    } catch {
      // toast handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ background: '#16151a', minHeight: '100vh' }}>
      <div className="auth-card" style={{ background: 'white', padding: 44, borderRadius: 14 }}>
        <h2>VELORA Admin</h2>
        <p className="auth-sub">Sign in to manage your store</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Admin Email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          <button type="submit" className="btn btn-dark btn-block" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
