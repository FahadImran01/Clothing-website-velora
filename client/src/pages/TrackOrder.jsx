import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';
import orderService from '../services/orderService';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import ConfirmDialog from '../components/ConfirmDialog';
import ReturnRequestForm from '../components/ReturnRequestForm';
import './TrackOrder.css';

const CANCELLABLE = ['Pending', 'Confirmed'];

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      const data = await orderService.trackOrder(orderId.trim(), email.trim());
      setOrder(data);
    } catch (err) {
      setNotFound(true);
      toast.error(err.message || 'Could not find that order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order._id, email.trim());
      setOrder((prev) => ({ ...prev, status: updated.status }));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.message || 'Could not cancel this order');
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  return (
    <div className="container track-order-page">
      <div className="section-heading" style={{ marginTop: 40, marginBottom: 40 }}>
        <span className="eyebrow">Where's My Order</span>
        <h2>Track Your Order</h2>
        <p style={{ marginTop: 12, color: 'var(--color-gray)', maxWidth: 480, marginInline: 'auto' }}>
          Enter your Order ID and the email address you used at checkout to see the latest status.
        </p>
      </div>

      <form className="track-order-form" onSubmit={handleSubmit}>
        <input
          placeholder="Order ID (e.g. 66f1a2b3c4d5e6f7a8b9c0d1)"
          required
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email used at checkout"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-dark" disabled={loading}>
          <FiSearch style={{ marginRight: 8 }} /> {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {notFound && (
        <div className="track-order-notfound">
          <h3>We couldn't find that order</h3>
          <p>Double-check your Order ID and the email address you used at checkout, then try again.</p>
        </div>
      )}

      {order && (
        <div className="track-order-result">
          <div className="track-order-result-header">
            <div>
              <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
              <span className="order-date">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {order.shippingCity ? ` · Shipping to ${order.shippingCity}, ${order.shippingCountry}` : ''}
              </span>
            </div>
            <span className={`status-pill status-${order.status}`}>{order.status}</span>
          </div>

          <OrderStatusTimeline status={order.status} />

          <div className="track-order-items">
            {order.items.map((item, i) => (
              <div className="track-order-item" key={i}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span>{item.size} / {item.color} × {item.quantity}</span>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="track-order-totals">
            <div className="cart-summary-row"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            {order.discount > 0 && <div className="cart-summary-row"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
            <div className="cart-summary-row"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span></div>
            <div className="cart-summary-row cart-summary-total"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
          </div>

          <div className="track-order-actions">
            {CANCELLABLE.includes(order.status) && (
              <button className="btn btn-outline" onClick={() => setConfirmCancel(true)}>Cancel Order</button>
            )}
            {order.status === 'Delivered' && (
              <ReturnRequestForm orderId={order._id} email={email.trim()} />
            )}
          </div>
        </div>
      )}

      {confirmCancel && (
        <ConfirmDialog
          title="Cancel This Order?"
          message="This will cancel your order and restock the items. This action cannot be undone."
          confirmLabel={cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
          onConfirm={handleCancel}
          onCancel={() => setConfirmCancel(false)}
        />
      )}
    </div>
  );
};

export default TrackOrder;
