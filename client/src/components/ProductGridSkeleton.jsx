import React from 'react';

const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="product-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '30%' }} />
      </div>
    ))}
  </div>
);

export default ProductGridSkeleton;
