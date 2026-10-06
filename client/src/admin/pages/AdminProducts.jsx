import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import ConfirmModal from '../components/ConfirmModal';
import ImageUploader from '../components/ImageUploader';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const emptyForm = {
  name: '', description: '', category: '', price: '', discountPrice: '', sku: '', stock: '',
  gender: 'unisex', images: [], colors: '', sizes: '', isFeatured: false, isNewArrival: false, isOnSale: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        productService.getProducts({ limit: 100, keyword: search || undefined }),
        categoryService.getCategories(),
      ]);
      setProducts(prodData.products);
      setCategories(catData);
    } catch (err) {
      toast.error('Could not load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const handleSearchSubmit = (e) => { e.preventDefault(); load(); };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description, category: p.category?._id || p.category,
      price: p.price, discountPrice: p.discountPrice || '', sku: p.sku, stock: p.stock,
      gender: p.gender, images: [...p.images], colors: p.colors.join(', '), sizes: p.sizes.join(', '),
      isFeatured: p.isFeatured, isNewArrival: p.isNewArrival, isOnSale: p.isOnSale,
    });
    setEditingId(p._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
        colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editingId) {
        await productService.updateProduct(editingId, payload);
        toast.success('Product updated');
      } else {
        await productService.createProduct(payload);
        toast.success('Product added');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productService.deleteProduct(deleteTarget._id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not delete product');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Products</h2>
        <button className="btn btn-dark admin-btn-sm" onClick={openCreate}><FiPlus style={{ marginRight: 6 }} /> Add Product</button>
      </div>

      <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
        <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit" className="btn btn-outline admin-btn-sm">Search</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th></th><th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={8}><div className="admin-empty">No products found.</div></td></tr>
            ) : products.map((p) => (
              <tr key={p._id}>
                <td><img src={p.images?.[0]} alt={p.name} /></td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.category?.name || '—'}</td>
                <td>${(p.discountPrice || p.price).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  <span className={`status-pill ${p.stock === 0 ? 'status-out' : p.stock <= 10 ? 'status-low' : 'status-in'}`}>
                    {p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button onClick={() => openEdit(p)}><FiEdit2 size={16} /></button>
                    <button className="danger" onClick={() => setDeleteTarget(p)}><FiTrash2 size={16} /></button>
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
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <label>Product Name
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </label>
              <label>Description
                <textarea rows={3} required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </label>
              <div className="admin-modal-form-grid">
                <label>Category
                  <select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    <option value="">Select</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </label>
                <label>Gender
                  <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </label>
                <label>Price ($)
                  <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                </label>
                <label>Discount Price ($)
                  <input type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))} />
                </label>
                <label>SKU
                  <input required value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
                </label>
                <label>Stock
                  <input type="number" required value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
                </label>
              </div>

              <label>Product Images
                <ImageUploader images={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
              </label>

              <div className="admin-modal-form-grid">
                <label>Colors (comma-separated)
                  <input value={form.colors} onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))} placeholder="Black, White" />
                </label>
                <label>Sizes (comma-separated)
                  <input value={form.sizes} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))} placeholder="S, M, L" />
                </label>
              </div>
              <div className="admin-checkbox-list">
                <button type="button" className={form.isFeatured ? 'selected' : ''} onClick={() => setForm((f) => ({ ...f, isFeatured: !f.isFeatured }))}>Featured</button>
                <button type="button" className={form.isNewArrival ? 'selected' : ''} onClick={() => setForm((f) => ({ ...f, isNewArrival: !f.isNewArrival }))}>New Arrival</button>
                <button type="button" className={form.isOnSale ? 'selected' : ''} onClick={() => setForm((f) => ({ ...f, isOnSale: !f.isOnSale }))}>On Sale</button>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-outline admin-btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-dark admin-btn-sm" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Product"
          message="Are you sure you want to delete this product?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminProducts;
