import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/men', label: 'Men' },
  { to: '/women', label: 'Women' },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/sale', label: 'Sale' },
  { to: '/shop', label: 'Shop' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <>
      <div className="announcement-bar">
        <div className="container announcement-bar-inner">
          <span>Complimentary shipping on all orders over $100</span>
        </div>
      </div>

      <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner container">
          <div className="navbar-side navbar-side-left">
            <button className="navbar-icon-btn navbar-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <FiMenu size={20} />
            </button>
            <nav className="navbar-links">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')} end={l.to === '/'}>
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <Link to="/" className="navbar-logo" aria-label="VELORA home">VELORA</Link>

          <div className="navbar-side navbar-side-right">
            <button className="navbar-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <FiSearch size={18} />
            </button>
            <Link to="/wishlist" className="navbar-icon-btn" aria-label="Wishlist"><FiHeart size={18} /></Link>
            <Link to="/cart" className="navbar-icon-btn navbar-cart" aria-label="Cart">
              <FiShoppingBag size={18} />
              {itemCount > 0 && <span className="navbar-cart-badge">{itemCount}</span>}
            </Link>
            <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/account') : '/login'} className="navbar-icon-btn navbar-account" aria-label="Account">
              <FiUser size={18} />
              {isAuthenticated && <span className="navbar-account-name">{user?.name?.split(' ')[0]}</span>}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
          >
            <form className="container search-form" onSubmit={handleSearch}>
              <FiSearch size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <FiX size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            >
              <div className="mobile-menu-header">
                <span className="navbar-logo" style={{ fontSize: '1.4rem' }}>VELORA</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><FiX size={22} /></button>
              </div>
              <nav className="mobile-menu-nav">
                {links.map((l) => (
                  <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)} end={l.to === '/'}>
                    {l.label} <FiChevronRight size={16} />
                  </NavLink>
                ))}
              </nav>
              <div className="mobile-menu-footer">
                <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/account') : '/login'} onClick={() => setMenuOpen(false)}>
                  <FiUser size={16} /> {isAuthenticated ? (user?.role === 'admin' ? 'Admin Panel' : 'My Account') : 'Sign In'}
                </Link>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)}><FiHeart size={16} /> Wishlist</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
