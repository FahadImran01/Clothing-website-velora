import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiHeart, FiChevronDown } from 'react-icons/fi';
import productService from '../services/productService';
import reviewService from '../services/reviewService';
import userService from '../services/userService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import Loader from '../components/Loader';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    productService
      .getProductById(id)
      .then((data) => {
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || '');
        setSelectedColor(data.colors?.[0] || '');
        setActiveImage(0);
        setQuantity(1);
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));

    reviewService.getReviews({ product: id }).then(setReviews).catch(() => {});
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select a size and color');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (selectedSize && selectedColor) navigate('/cart');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save items to your wishlist');
      return;
    }
    try {
      await userService.toggleWishlist(product._id);
      toast.success('Wishlist updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to leave a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.createReview({ product: id, ...reviewForm });
      toast.success('Review submitted — it will appear after approval');
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) {
    return (
      <div className="container empty-state">
        <h3>Product not found</h3>
        <p>The item you're looking for may have been removed.</p>
      </div>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const outOfStock = product.stock === 0;

  return (
    <div className="container product-details">
      <div className="pd-grid">
        <div className="pd-gallery">
          <div className="pd-main-image">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={product.images[activeImage]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            {outOfStock && <div className="pd-outofstock-tag">OUT OF STOCK</div>}
          </div>
          {product.images.length > 1 && (
            <div className="pd-thumbnails">
              {product.images.map((img, i) => (
                <button key={i} className={i === activeImage ? 'active' : ''} onClick={() => setActiveImage(i)}>
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <span className="eyebrow">{product.brand}</span>
          <h1>{product.name}</h1>
          {product.rating > 0 && (
            <div className="pd-rating">
              <span>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span className="pd-rating-count">{product.numReviews} review{product.numReviews !== 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="pd-price">
            <span className={hasDiscount ? 'price-current' : ''}>${displayPrice.toFixed(2)}</span>
            {hasDiscount && <span className="price-original">${product.price.toFixed(2)}</span>}
          </div>

          <p className="pd-description">{product.description}</p>

          {product.colors?.length > 0 && (
            <div className="pd-option-group">
              <h4>Color: <span>{selectedColor}</span></h4>
              <div className="filter-swatches">
                {product.colors.map((c) => (
                  <div
                    key={c}
                    className={`filter-swatch ${selectedColor === c ? 'selected' : ''}`}
                    style={{ background: c.toLowerCase().replace(' ', '') }}
                    title={c}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="pd-option-group">
              <div className="pd-size-header">
                <h4>Size</h4>
                <button className="pd-size-guide-btn" onClick={() => setSizeGuideOpen(!sizeGuideOpen)}>
                  Size Guide <FiChevronDown style={{ transform: sizeGuideOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
                </button>
              </div>
              <div className="filter-sizes">
                {product.sizes.map((s) => (
                  <button key={s} className={`filter-size-btn ${selectedSize === s ? 'selected' : ''}`} onClick={() => setSelectedSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {sizeGuideOpen && (
                  <motion.div className="pd-size-guide" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <table>
                      <thead><tr><th>Size</th><th>Chest (in)</th><th>Length (in)</th></tr></thead>
                      <tbody>
                        <tr><td>XS</td><td>34–36</td><td>26</td></tr>
                        <tr><td>S</td><td>36–38</td><td>27</td></tr>
                        <tr><td>M</td><td>39–41</td><td>28</td></tr>
                        <tr><td>L</td><td>42–44</td><td>29</td></tr>
                        <tr><td>XL</td><td>45–47</td><td>30</td></tr>
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="pd-stock-note">
            {outOfStock ? <span className="status-pill status-out">Out of Stock</span> :
              product.stock <= 10 ? <span className="status-pill status-low">Only {product.stock} left in stock</span> :
              <span className="status-pill status-in">In Stock</span>}
          </div>

          <div className="pd-purchase-row">
            <div className="pd-quantity">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
            </div>
            <button className="btn btn-dark btn-block" disabled={outOfStock} onClick={handleAddToCart}>
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
          <div className="pd-purchase-row">
            <button className="btn btn-outline btn-block" disabled={outOfStock} onClick={handleBuyNow}>Buy Now</button>
            <button className="btn btn-outline pd-wishlist-btn" onClick={handleWishlist}><FiHeart /></button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="pd-reviews">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="pd-no-reviews">No reviews yet. Be the first to share your thoughts.</p>
        ) : (
          <div className="pd-review-list">
            {reviews.map((r) => (
              <div key={r._id} className="pd-review-item">
                <div className="pd-review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p>{r.comment}</p>
                <span>— {r.name}</span>
              </div>
            ))}
          </div>
        )}

        <form className="pd-review-form" onSubmit={handleReviewSubmit}>
          <h4>Write a Review</h4>
          <div className="pd-review-rating-input">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}>
                {n <= reviewForm.rating ? '★' : '☆'}
              </button>
            ))}
          </div>
          <textarea
            required
            placeholder="Share your experience with this product..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
          />
          <button type="submit" className="btn btn-dark" disabled={submittingReview}>
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProductDetails;
