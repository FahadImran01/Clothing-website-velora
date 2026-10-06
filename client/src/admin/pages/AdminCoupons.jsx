import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import couponService from '../../services/couponService';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const emptyForm = { code: '', discountPercentage: '', minOrderAmount: '', expiryDate: '', isActive: true };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    couponService.getCoupons().then(setCoupons).catch(() => toast.error('Could not load coupons')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (c) => {
    setForm({ code: c.code, discountPercentage: c.discountPercentage, minOrderAmount: c.minOrderAmount, expiryDate: c.expiryDate.slice(0, 10), isActive: c.isActive });
    setEditingId(c._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: form.code,
        discountPercentage: Number(form.discountPercentage),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        expiryDate: form.expiryDate,
        isActive: form.isActive,
      };
      if (editingId) {
        await couponService.updateCoupon(editingId, payload);
        toast.success('Coupon updated');
      } else {
        await couponService.createCoupon(payload);
        toast.success('Coupon created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await couponService.deleteCoupon(deleteTarget._id);
      toast.success('Coupon deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not delete coupon');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Coupons</h2>
        <button className="btn btn-dark admin-btn-sm" onClick={openCreate}><FiPlus style={{ marginRight: 6 }} /> Add Coupon</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Code</th><th>Discount</th><th>Min. Order</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr><td colSpan={6}><div className="admin-empty">No coupons yet.</div></td></tr>
            ) : coupons.map((c) => (
              <tr key={c._id}>
                <td><strong>{c.code}</strong></td>
                <td>{c.discountPercentage}%</td>
                <td>${c.minOrderAmount}</td>
                <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                <td><span className={`status-pill ${c.isActive ? 'status-in' : 'status-out'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div className="admin-table-actions">
                    <button onClick={() => openEdit(c)}><FiEdit2 size={16} /></button>
                    <button className="danger" onClick={() => setDeleteTarget(c)}><FiTrash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Coupon' : 'Add Coupon'}</h3>
            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <label>Coupon Code
                <input required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} />
              </label>
              <div className="admin-modal-form-grid">
                <label>Discount %
                  <input type="number" min="1" max="100" required value={form.discountPercentage} onChange={(e) => setForm((f) => ({ ...f, discountPercentage: e.target.value }))} />
                </label>
                <label>Minimum Order ($)
                  <input type="number" min="0" value={form.minOrderAmount} onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))} />
                </label>
              </div>
              <label>Expiry Date
                <input type="date" required value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))} />
              </label>
              <div className="admin-checkbox-list">
                <button type="button" className={form.isActive ? 'selected' : ''} onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-dark admin-btn-sm" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Coupon"
          message="Are you sure you want to delete this coupon?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminCoupons;
