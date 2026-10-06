import React from 'react';
import { motion } from 'framer-motion';
import './StaticPages.css';

const AboutUs = () => (
  <div className="static-page">
    <section className="static-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600)' }}>
      <div className="static-hero-overlay" />
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>Our Story</motion.h1>
    </section>

    <div className="container static-content">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <span className="eyebrow">Since 2018</span>
        <h2>Considered Clothing, Built To Last</h2>
        <p>
          VELORA began as a small studio with one belief: clothing should be made well, worn often, and kept for years —
          not seasons. We work with mills we trust, cut every piece with intention, and resist the urge to chase trends.
        </p>
        <p>
          Every VELORA piece is designed in-house and produced in small batches to reduce waste and keep quality high.
          From premium cottons to considered denim, our fabrics are chosen first for how they'll wear five years from now.
        </p>
      </motion.div>

      <div className="static-grid">
        {[
          { title: 'Considered Design', desc: 'Every silhouette is refined over multiple seasons before it ever reaches the shop floor.' },
          { title: 'Quality Materials', desc: 'We source premium natural fibers from mills we have worked with for years.' },
          { title: 'Made To Last', desc: 'Reinforced seams, natural dyes, and construction built for everyday wear.' },
        ].map((v, i) => (
          <motion.div key={v.title} className="static-value-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
            <h3>{v.title}</h3>
            <p>{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default AboutUs;
