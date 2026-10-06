import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import categoryService from '../../services/categoryService';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    categoryService.getCategories().then(setCategories).catch(() => toast.error('Could not load categories')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setForm({ name: '', description: '' }); setEditingId(null); setModalOpen(true); };
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '' }); setEditingId(c._id); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, form);
        toast.success('Category updated');
      } else {
        await categoryService.createCategory(form);
        toast.success('Category created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await categoryService.deleteCategory(deleteTarget._id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not delete category');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Categories</h2>
        <button className="btn btn-dark admin-btn-sm" onClick={openCreate}><FiPlus style={{ marginRight: 6 }} /> Add Category</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={4}><div className="admin-empty">No categories yet.</div></td></tr>
            ) : categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.description || '—'}</td>
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
            <h3>{editingId ? 'Edit Category' : 'Add Category'}</h3>
            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <label>Name
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </label>
              <label>Description
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </label>
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
          title="Delete Category"
          message="Are you sure you want to delete this category?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminCategories;
