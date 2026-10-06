import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-col footer-brand">
          <h3>VELORA</h3>
          <p>Considered clothing for a considered life. Designed in-house, made to last.</p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Facebook"><FiFacebook size={18} /></a>
            <a href="#" aria-label="Twitter"><FiTwitter size={18} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>About</h4>
          <Link to="/about">Our Story</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/shop">Shop All</Link>
        </div>

        <div className="footer-col">
          <h4>Customer Service</h4>
          <Link to="/account">My Account</Link>
          <Link to="/orders">Order History</Link>
          <Link to="/track-order">Track Order</Link>
          <Link to="/contact">Shipping</Link>
          <Link to="/contact">Returns</Link>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/contact">Privacy Policy</Link>
          <Link to="/contact">Terms of Service</Link>
        </div>

        <div className="footer-col footer-newsletter">
          <h4>Newsletter</h4>
          <p>Be the first to know about new arrivals and private sales.</p>
          <form onSubmit={handleSubscribe}>
            <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="btn btn-dark">Join</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} VELORA. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
