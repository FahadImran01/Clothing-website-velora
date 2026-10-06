import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import userService from '../services/userService';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getWishlist()
      .then(setProducts)
      .catch(() => toast.error('Could not load your wishlist'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ paddingBottom: 90 }}>
      <div className="section-heading" style={{ marginTop: 40, marginBottom: 40 }}>
        <span className="eyebrow">Saved For Later</span>
        <h2>My Wishlist</h2>
      </div>

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>Your wishlist is empty</h3>
          <p>Save items you love for easy access later.</p>
          <Link to="/shop" className="btn btn-dark" style={{ marginTop: 24 }}>Browse Products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
