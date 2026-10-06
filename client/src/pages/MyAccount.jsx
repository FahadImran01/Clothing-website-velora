import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './MyAccount.css';

const MyAccount = () => {
  const { user, updateMe, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMe(form);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container account-page">
      <div className="section-heading" style={{ marginTop: 40, marginBottom: 40 }}>
        <span className="eyebrow">Welcome, {user?.name}</span>
        <h2>My Account</h2>
      </div>

      <div className="account-layout">
        <aside className="account-nav">
          <span className="account-nav-item active"><FiUser /> Profile</span>
          <Link to="/orders" className="account-nav-item"><FiPackage /> Order History</Link>
          <Link to="/wishlist" className="account-nav-item"><FiHeart /> Wishlist</Link>
          <span className="account-nav-item"><FiMapPin /> Addresses</span>
          <button className="account-nav-item account-logout" onClick={handleLogout}><FiLogOut /> Logout</button>
        </aside>

        <div className="account-content">
          <h3>Profile Information</h3>
          <form className="account-form" onSubmit={handleSave}>
            <label>
              Full Name
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </label>
            <label>
              Email
              <input value={user?.email} disabled />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Add a phone number" />
            </label>
            <button type="submit" className="btn btn-dark" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
