import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './StaticPages.css';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll be in touch shortly.');
      setForm({ name: '', email: '', message: '' });
      setSending(false);
    }, 700);
  };

  return (
    <div className="container static-content" style={{ paddingTop: 60 }}>
      <div className="section-heading">
        <span className="eyebrow">Get In Touch</span>
        <h2>Contact Us</h2>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          <div className="contact-info-item"><FiMail size={20} /><div><h4>Email</h4><p>support@velora.com</p></div></div>
          <div className="contact-info-item"><FiPhone size={20} /><div><h4>Phone</h4><p>+1 (555) 012-3456</p></div></div>
          <div className="contact-info-item"><FiMapPin size={20} /><div><h4>Studio</h4><p>142 Wooster Street, New York, NY</p></div></div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input placeholder="Your Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input type="email" placeholder="Your Email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <textarea placeholder="Your Message" required rows={6} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
          <button type="submit" className="btn btn-dark" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
