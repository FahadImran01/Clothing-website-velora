import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const { isAuthenticated } = useAuth();
  const order = state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="container order-confirmation-page">
      <div className="order-confirmation-icon"><FiCheckCircle size={44} /></div>
      <h2>Thank You For Your Order</h2>
      <p className="order-confirmation-sub">
        Your order has been placed successfully. A confirmation has been sent to <strong>{order.shippingInfo.email}</strong>.
      </p>

      <div className="order-confirmation-card">
        <div className="order-confirmation-row">
          <span>Order ID</span>
          <strong>#{order._id.slice(-8).toUpperCase()}</strong>
        </div>
        <div className="order-confirmation-row">
          <span>Total</span>
          <strong>${order.total.toFixed(2)}</strong>
        </div>
        <div className="order-confirmation-row">
          <span>Payment Method</span>
          <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</strong>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="order-confirmation-actions">
          <Link to="/orders" className="btn btn-dark">View Order History</Link>
          <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <p className="order-confirmation-guest-note">
            Since you checked out as a guest, save your Order ID above — you can check your order's status
            anytime using it along with your email.
          </p>
          <div className="order-confirmation-actions">
            <Link to={`/track-order?orderId=${order._id}`} className="btn btn-dark">Track This Order</Link>
            <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderConfirmation;
