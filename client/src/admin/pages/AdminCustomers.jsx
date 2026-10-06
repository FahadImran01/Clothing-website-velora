import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEye, FiSlash, FiCheckCircle } from 'react-icons/fi';
import userService from '../../services/userService';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewCustomer, setViewCustomer] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);

  const load = () => {
    setLoading(true);
    userService.getUsers({ keyword: search || undefined }).then(setCustomers).catch(() => toast.error('Could not load customers')).finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line

  const handleSearchSubmit = (e) => { e.preventDefault(); load(); };

  const openDetails = async (c) => {
    try {
      const data = await userService.getUserById(c._id);
      setViewCustomer(data);
    } catch (err) {
      toast.error('Could not load customer details');
    }
  };

  const handleToggle = async () => {
    try {
      const res = await userService.toggleUserStatus(toggleTarget._id);
      toast.success(res.message);
      setCustomers((prev) => prev.map((c) => (c._id === toggleTarget._id ? { ...c, isActive: res.isActive } : c)));
      setToggleTarget(null);
    } catch (err) {
      toast.error(err.message || 'Could not update account status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header"><h2>Customers</h2></div>

      <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
        <input placeholder="Search customers by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit" className="btn btn-outline admin-btn-sm">Search</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={6}><div className="admin-empty">No customers found.</div></td></tr>
            ) : customers.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone || '—'}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td><span className={`status-pill ${c.isActive ? 'status-in' : 'status-out'}`}>{c.isActive ? 'Active' : 'Disabled'}</span></td>
                <td>
                  <div className="admin-table-actions">
                    <button onClick={() => openDetails(c)}><FiEye size={16} /></button>
                    <button className="danger" onClick={() => setToggleTarget(c)}>
                      {c.isActive ? <FiSlash size={16} /> : <FiCheckCircle size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewCustomer && (
        <div className="admin-modal-backdrop" onClick={() => setViewCustomer(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{viewCustomer.user.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: 20 }}>
              {viewCustomer.user.email} · {viewCustomer.user.phone || 'No phone on file'}
            </p>
            <h4 style={{ fontSize: '0.9rem', marginBottom: 12 }}>Order History ({viewCustomer.orders.length})</h4>
            {viewCustomer.orders.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>No orders yet.</p>
            ) : viewCustomer.orders.map((o) => (
              <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px 0', borderBottom: '1px solid #f1efe9' }}>
                <span>#{o._id.slice(-8).toUpperCase()} — {o.status}</span>
                <strong>${o.total.toFixed(2)}</strong>
              </div>
            ))}
            <div className="admin-modal-actions">
              <button className="btn btn-outline admin-btn-sm" onClick={() => setViewCustomer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toggleTarget && (
        <ConfirmModal
          title={toggleTarget.isActive ? 'Disable Account' : 'Enable Account'}
          message={`Are you sure you want to ${toggleTarget.isActive ? 'disable' : 'enable'} this customer's account?`}
          confirmLabel={toggleTarget.isActive ? 'Disable' : 'Enable'}
          onConfirm={handleToggle}
          onCancel={() => setToggleTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminCustomers;
