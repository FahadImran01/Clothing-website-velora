import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import couponService from '../services/couponService';
import './Checkout.css';

const Checkout = () => {
  const { items, subtotal, shippingCost, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h3>Your cart is empty</h3>
        <p>Add items to your cart before checking out.</p>
        <Link to="/shop" className="btn btn-dark" style={{ marginTop: 24 }}>Shop Now</Link>
      </div>
    );
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const coupon = await couponService.validateCoupon(couponCode.trim());
      if (subtotal < coupon.minOrderAmount) {
        toast.error(`Minimum order of $${coupon.minOrderAmount} required for this coupon`);
        setDiscount(0);
      } else {
        const amount = (subtotal * coupon.discountPercentage) / 100;
        setDiscount(amount);
        toast.success(`Coupon applied: ${coupon.discountPercentage}% off`);
      }
    } catch (err) {
      toast.error(err.message || 'Invalid coupon code');
      setDiscount(0);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const finalTotal = subtotal - discount + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    try {
      const order = await orderService.createOrder({
        items,
        shippingInfo: form,
        paymentMethod,
        couponCode: discount > 0 ? couponCode.trim() : undefined,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      toast.error(err.message || 'Could not place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container checkout-page">
      <div className="section-heading" style={{ marginTop: 40, marginBottom: 40 }}>
        <span className="eyebrow">Final Step</span>
        <h2>Checkout</h2>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="checkout-form">
          <h3>Customer Information</h3>
          <div className="form-grid">
            <input name="fullName" placeholder="Full Name" required value={form.fullName} onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
            <input name="phone" placeholder="Phone" required value={form.phone} onChange={handleChange} />
            <input name="address" placeholder="Address" required value={form.address} onChange={handleChange} className="form-full" />
            <input name="city" placeholder="City" required value={form.city} onChange={handleChange} />
            <input name="country" placeholder="Country" required value={form.country} onChange={handleChange} />
            <input name="postalCode" placeholder="Postal Code" required value={form.postalCode} onChange={handleChange} />
          </div>

          <h3 style={{ marginTop: 36 }}>Payment Method</h3>
          <div className="payment-options">
            <label className={paymentMethod === 'cod' ? 'selected' : ''}>
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              Cash on Delivery
            </label>
            <label className={paymentMethod === 'card' ? 'selected' : ''}>
              <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              Card Payment
            </label>
          </div>
          {paymentMethod === 'card' && (
            <div className="form-grid" style={{ marginTop: 16 }}>
              <input placeholder="Card Number (placeholder)" className="form-full" disabled />
              <input placeholder="MM/YY" disabled />
              <input placeholder="CVC" disabled />
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-summary-items">
            {items.map((item) => (
              <div className="checkout-summary-item" key={`${item.product}-${item.size}-${item.color}`}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span>{item.size} / {item.color} × {item.quantity}</span>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="coupon-row">
            <input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
            <button type="button" className="btn btn-outline" onClick={applyCoupon} disabled={applyingCoupon}>
              {applyingCoupon ? '...' : 'Apply'}
            </button>
          </div>

          <div className="cart-summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {discount > 0 && <div className="cart-summary-row"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
          <div className="cart-summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span></div>
          <div className="cart-summary-row cart-summary-total"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>

          <button type="submit" className="btn btn-dark btn-block" disabled={placingOrder}>
            {placingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
