import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEye } from 'react-icons/fi';
import orderService from '../../services/orderService';
import Loader from '../../components/Loader';
import '../AdminShared.css';

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [viewOrder, setViewOrder] = useState(null);

  const load = () => {
    setLoading(true);
    orderService.getAllOrders(statusFilter ? { status: statusFilter } : {}).then(setOrders).catch(() => toast.error('Could not load orders')).finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]); // eslint-disable-line

  const handleStatusChange = async (order, status) => {
    try {
      await orderService.updateOrderStatus(order._id, status);
      toast.success('Order status updated');
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status } : o)));
    } catch (err) {
      toast.error(err.message || 'Could not update order status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="admin-page-header"><h2>Orders</h2></div>

      <div className="admin-toolbar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Products</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={8}><div className="admin-empty">No orders found.</div></td></tr>
            ) : orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-8).toUpperCase()}</td>
                <td>{o.user?.name || 'Guest'}</td>
                <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                <td>${o.total.toFixed(2)}</td>
                <td>{o.paymentMethod === 'cod' ? 'COD' : 'Card'}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <select value={o.status} onChange={(e) => handleStatusChange(o, e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #e0ded7', fontSize: '0.8rem' }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button onClick={() => setViewOrder(o)}><FiEye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewOrder && (
        <div className="admin-modal-backdrop" onClick={() => setViewOrder(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Order #{viewOrder._id.slice(-8).toUpperCase()}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: 16 }}>
              {viewOrder.shippingInfo.fullName} · {viewOrder.shippingInfo.email} · {viewOrder.shippingInfo.phone}<br />
              {viewOrder.shippingInfo.address}, {viewOrder.shippingInfo.city}, {viewOrder.shippingInfo.country} {viewOrder.shippingInfo.postalCode}
            </p>
            {viewOrder.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'center', fontSize: '0.85rem' }}>
                <img src={item.image} alt={item.name} style={{ width: 40, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                <span style={{ flex: 1 }}>{item.name} ({item.size}/{item.color}) × {item.quantity}</span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #eee', marginTop: 14, paddingTop: 14, fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
              <span>Total</span><span>${viewOrder.total.toFixed(2)}</span>
            </div>
            <div className="admin-modal-actions">
              <button className="btn btn-outline admin-btn-sm" onClick={() => setViewOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
