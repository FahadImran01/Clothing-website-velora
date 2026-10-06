import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiAlertTriangle } from 'react-icons/fi';
import inventoryService from '../../services/inventoryService';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skuSearch, setSkuSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editing, setEditing] = useState(null); // { product, amount }

  const load = () => {
    setLoading(true);
    inventoryService.getInventory({ sku: skuSearch || undefined, status: statusFilter || undefined })
      .then(setItems)
      .catch(() => toast.error('Could not load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]); // eslint-disable-line

  const handleSearchSubmit = (e) => { e.preventDefault(); load(); };

  const lowStockCount = items.filter((i) => i.stock > 0 && i.stock <= 10).length;

  const updateStock = async (mode) => {
    if (!editing) return;
    try {
      const updated = await inventoryService.updateStock(editing.product._id, { mode, amount: editing.amount });
      toast.success('Inventory updated');
      setItems((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setEditing(null);
    } catch (err) {
      toast.error(err.message || 'Could not update stock');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header"><h2>Inventory Management</h2></div>

      {lowStockCount > 0 && (
        <div className="low-stock-banner"><FiAlertTriangle /> Low Stock Alert: {lowStockCount} product{lowStockCount !== 1 ? 's' : ''} running low.</div>
      )}

      <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
        <input placeholder="Search by SKU..." value={skuSearch} onChange={(e) => setSkuSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <button type="submit" className="btn btn-outline admin-btn-sm">Search</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Sizes</th><th>Colors</th><th>Stock</th><th>Status</th><th>Last Updated</th><th></th></tr></thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={9}><div className="admin-empty">No products found.</div></td></tr>
            ) : items.map((p) => {
              const status = p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock' : 'In Stock';
              const cls = p.stock === 0 ? 'status-out' : p.stock <= 10 ? 'status-low' : 'status-in';
              return (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category?.name || '—'}</td>
                  <td>{p.sizes.join(', ') || '—'}</td>
                  <td>{p.colors.join(', ') || '—'}</td>
                  <td>{p.stock}</td>
                  <td><span className={`status-pill ${cls}`}>{status}</span></td>
                  <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                  <td><button className="btn btn-outline admin-btn-sm" onClick={() => setEditing({ product: p, amount: '' })}>Update</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <h3>Update Stock — {editing.product.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: 16 }}>Current stock: {editing.product.stock}</p>
            <input
              type="number"
              placeholder="Amount"
              value={editing.amount}
              onChange={(e) => setEditing((prev) => ({ ...prev, amount: e.target.value }))}
              style={{ width: '100%', padding: 12, border: '1px solid #e0ded7', borderRadius: 6, marginBottom: 16 }}
            />
            <div className="admin-modal-actions" style={{ justifyContent: 'space-between' }}>
              <button className="btn btn-outline admin-btn-sm" onClick={() => updateStock('decrease')}>Decrease</button>
              <button className="btn btn-outline admin-btn-sm" onClick={() => updateStock('increase')}>Increase</button>
              <button className="btn btn-dark admin-btn-sm" onClick={() => updateStock('set')}>Set Exact</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
