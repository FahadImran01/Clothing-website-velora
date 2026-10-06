import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import Loader from '../components/Loader';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import ConfirmDialog from '../components/ConfirmDialog';
import ReturnRequestForm from '../components/ReturnRequestForm';
import './OrderHistory.css';

const CANCELLABLE = ['Pending', 'Confirmed'];

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const location = useLocation();
  const newOrderId = location.state?.newOrderId;

  const load = () => {
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch(() => toast.error('Could not load your orders'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(cancelTarget._id);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? { ...o, status: updated.status } : o)));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.message || 'Could not cancel this order');
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container order-history-page">
      <div className="section-heading" style={{ marginTop: 40, marginBottom: 24 }}>
        <span className="eyebrow">Your Orders</span>
        <h2>Order History</h2>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Link to="/track-order" style={{ fontSize: '0.85rem', textDecoration: 'underline', color: 'var(--color-gray)' }}>
          Tracking an order without an account? Track it here
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>Your placed orders will appear here.</p>
          <Link to="/shop" className="btn btn-dark" style={{ marginTop: 24 }}>Start Shopping</Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className={`order-card ${order._id === newOrderId ? 'order-card-new' : ''}`} key={order._id}>
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <span className={`status-pill status-${order.status}`}>{order.status}</span>
              </div>
              <div className="order-items-preview">
                {order.items.map((item, i) => (
                  <img key={i} src={item.image} alt={item.name} title={item.name} />
                ))}
              </div>
              <OrderStatusTimeline status={order.status} />
              <div className="order-card-footer">
                <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</span>
                <strong>${order.total.toFixed(2)}</strong>
              </div>

              {(CANCELLABLE.includes(order.status) || order.status === 'Delivered') && (
                <div className="order-card-actions">
                  {CANCELLABLE.includes(order.status) && (
                    <button className="btn btn-outline" onClick={() => setCancelTarget(order)}>Cancel Order</button>
                  )}
                  {order.status === 'Delivered' && (
                    <ReturnRequestForm orderId={order._id} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {cancelTarget && (
        <ConfirmDialog
          title="Cancel This Order?"
          message="This will cancel your order and restock the items. This action cannot be undone."
          confirmLabel={cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
          onConfirm={handleCancel}
          onCancel={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
};

export default OrderHistory;
