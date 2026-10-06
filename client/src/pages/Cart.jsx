import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal, shippingCost, total } = useCart();
  const navigate = useNavigate();

  // Guest checkout is supported, so no login is required here
  const handleCheckout = () => navigate('/checkout');

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-dark" style={{ marginTop: 24 }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <div className="section-heading" style={{ marginTop: 40, marginBottom: 40 }}>
        <span className="eyebrow">Your Bag</span>
        <h2>Shopping Cart</h2>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={`${item.product}-${item.size}-${item.color}`}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>Size: {item.size} &nbsp;·&nbsp; Color: {item.color}</p>
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(item, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item, item.quantity + 1)} disabled={item.quantity >= item.maxStock}>+</button>
                </div>
              </div>
              <div className="cart-item-right">
                <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                <button className="cart-item-remove" onClick={() => removeFromCart(item)}><FiTrash2 size={17} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="cart-summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span></div>
          <div className="cart-summary-row cart-summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button className="btn btn-dark btn-block" onClick={handleCheckout}>Proceed to Checkout</button>
          <Link to="/shop" className="cart-continue">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
