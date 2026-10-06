import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import '../AdminShared.css';

const AdminSettings = () => {
  const { user, updateMe } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', password: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name };
      if (form.password) payload.password = form.password;
      await updateMe(payload);
      toast.success('Settings updated');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.message || 'Could not update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header"><h2>Settings</h2></div>
      <div className="admin-card" style={{ maxWidth: 460 }}>
        <h3>Admin Profile</h3>
        <form className="admin-modal-form" onSubmit={handleSubmit}>
          <label>Name
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </label>
          <label>Email
            <input value={user?.email} disabled />
          </label>
          <label>New Password (leave blank to keep current)
            <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </label>
          <button type="submit" className="btn btn-dark admin-btn-sm" style={{ alignSelf: 'flex-start' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
