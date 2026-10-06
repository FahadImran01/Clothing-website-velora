import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import './ProductCard.css';

const ProductCard = ({ product, index = 0 }) => {
  const { isAuthenticated } = useAuth();

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to save items to your wishlist');
      return;
    }
    try {
      await userService.toggleWishlist(product._id);
      toast.success('Wishlist updated');
    } catch (err) {
      toast.error(err.message || 'Could not update wishlist');
    }
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
    >
      <Link to={`/product/${product._id}`} className="product-card-media">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        <div className="product-card-badges">
          {product.isNewArrival && <span className="badge badge-new">New</span>}
          {hasDiscount && <span className="badge badge-sale">Sale</span>}
          {product.stock === 0 && <span className="badge badge-out">Out of Stock</span>}
        </div>
        <div className="product-card-actions">
          <button onClick={handleWishlist} aria-label="Add to wishlist"><FiHeart size={16} /></button>
          <span className="product-card-quickview"><FiEye size={14} /> Quick View</span>
        </div>
      </Link>
      <div className="product-card-info">
        <Link to={`/product/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="product-card-price">
          <span className={hasDiscount ? 'price-current' : ''}>${displayPrice.toFixed(2)}</span>
          {hasDiscount && <span className="price-original">${product.price.toFixed(2)}</span>}
        </div>
        {product.rating > 0 && (
          <div className="product-card-rating">
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
            <span>({product.numReviews})</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
