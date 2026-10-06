import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'velora_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const cartKey = (item) => `${item.product}-${item.size}-${item.color}`;

  const addToCart = (product, size, color, quantity = 1) => {
    if (product.stock === 0) {
      toast.error('This item is out of stock');
      return;
    }
    setItems((prev) => {
      const key = `${product._id}-${size}-${color}`;
      const existing = prev.find((i) => cartKey(i) === key);
      if (existing) {
        return prev.map((i) => (cartKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.images[0],
          price: product.discountPrice || product.price,
          size,
          color,
          quantity,
          maxStock: product.stock,
        },
      ];
    });
    toast.success('Added to cart');
  };

  const removeFromCart = (item) => {
    setItems((prev) => prev.filter((i) => cartKey(i) !== cartKey(item)));
  };

  const updateQuantity = (item, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (cartKey(i) === cartKey(item) ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingCost = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const total = subtotal + shippingCost;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingCost,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
