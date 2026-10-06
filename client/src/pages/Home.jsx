import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] } }),
};

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [arrivals, popular] = await Promise.all([
          productService.getProducts({ newArrival: true, limit: 4 }),
          productService.getProducts({ sort: 'popular', limit: 4 }),
        ]);
        setNewArrivals(arrivals.products);
        setBestSellers(popular.products);
      } catch (err) {
        toast.error('Could not load products. Is the backend running?');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <motion.div
          className="hero-bg"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600)` }}
        />
        <div className="hero-overlay" />
        <div className="hero-content container">
          <motion.p className="eyebrow" style={{ color: '#f5f0e8' }} initial="hidden" animate="show" custom={0} variants={fadeUp}>
            Autumn / Winter Collection
          </motion.p>
          <motion.h1 initial="hidden" animate="show" custom={1} variants={fadeUp}>
            DEFINE YOUR<br />STYLE
          </motion.h1>
          <motion.p className="hero-desc" initial="hidden" animate="show" custom={2} variants={fadeUp}>
            Considered essentials, cut from premium fabric and built to outlast the season.
          </motion.p>
          <motion.div className="hero-actions" initial="hidden" animate="show" custom={3} variants={fadeUp}>
            <Link to="/men" className="btn btn-light">Shop Men</Link>
            <Link to="/women" className="btn btn-outline hero-btn-outline">Shop Women</Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section container">
        <div className="section-heading">
          <span className="eyebrow">Explore</span>
          <h2>Shop by Category</h2>
        </div>
        <div className="category-grid">
          {[
            { name: "Men's Clothing", to: '/men', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800' },
            { name: "Women's Clothing", to: '/women', img: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800' },
            { name: 'Accessories', to: '/shop', img: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800' },
          ].map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={cat.to} className="category-card">
                <img src={cat.img} alt={cat.name} />
                <div className="category-card-label">{cat.name}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section container">
        <div className="section-heading">
          <span className="eyebrow">Just In</span>
          <h2>New Arrivals</h2>
        </div>
        {loading ? <ProductGridSkeleton count={4} /> : (
          <div className="product-grid">
            {newArrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
        <div className="section-cta">
          <Link to="/new-arrivals" className="btn btn-outline">View All New Arrivals</Link>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section container">
        <div className="section-heading">
          <span className="eyebrow">Most Loved</span>
          <h2>Best Sellers</h2>
        </div>
        {loading ? <ProductGridSkeleton count={4} /> : (
          <div className="product-grid">
            {bestSellers.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2>UP TO 40% OFF</h2>
          <p>Selected styles. While stocks last.</p>
          <Link to="/sale" className="btn btn-light">Shop The Sale</Link>
        </motion.div>
      </section>

      {/* Editorial */}
      <section className="section editorial container">
        <div className="section-heading">
          <span className="eyebrow">The Edit</span>
          <h2>Featured Collection</h2>
        </div>
        <div className="editorial-grid">
          <motion.img
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1000" alt="Editorial look one"
          />
          <motion.img
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000" alt="Editorial look two"
          />
        </div>
      </section>

      {/* Reviews */}
      <section className="section container reviews-section">
        <div className="section-heading">
          <span className="eyebrow">Testimonials</span>
          <h2>What Customers Say</h2>
        </div>
        <div className="reviews-grid">
          {[
            { name: 'Amelia R.', text: 'The quality genuinely feels premium. The Oversized Blazer is now on constant rotation.' },
            { name: 'James K.', text: 'Fast shipping, beautiful packaging, and the fit is exactly as described. Will order again.' },
            { name: 'Priya S.', text: 'VELORA has quietly become my go-to for basics that actually last more than one season.' },
          ].map((r, i) => (
            <motion.div key={r.name} className="review-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <div className="review-stars">★★★★★</div>
              <p>"{r.text}"</p>
              <span>— {r.name}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
