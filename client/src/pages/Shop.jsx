import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSliders, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import './Shop.css';

const COLORS = ['Black', 'White', 'Beige', 'Charcoal', 'Indigo', 'Navy', 'Grey', 'Cream', 'Camel', 'Sage', 'Terracotta', 'Off-White', 'Light Blue'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

const Shop = ({ gender, forceNewArrival, forceOnSale, title, subtitle }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        keyword: keyword || undefined,
        gender: gender || undefined,
        category: filters.category || undefined,
        size: filters.size || undefined,
        color: filters.color || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sort: filters.sort,
        page: filters.page,
        limit: 12,
        newArrival: forceNewArrival ? true : undefined,
        onSale: forceOnSale ? true : undefined,
      };
      const data = await productService.getProducts(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      toast.error('Could not load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [filters, gender, forceNewArrival, forceOnSale, keyword]);

  useEffect(() => { load(); }, [load]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const clearFilters = () => {
    setFilters({ category: '', size: '', color: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 });
    setSearchParams({});
  };

  return (
    <div className="container shop-page">
      <div className="section-heading" style={{ marginTop: 40 }}>
        <span className="eyebrow">{subtitle || 'Collection'}</span>
        <h2>{title || 'Shop All'}</h2>
        {keyword && <p style={{ marginTop: 10, color: 'var(--color-gray)' }}>Search results for "{keyword}"</p>}
      </div>

      <button className="btn btn-outline shop-mobile-filter-toggle" onClick={() => setMobileFiltersOpen(true)} style={{ marginBottom: 20 }}>
        <FiSliders style={{ marginRight: 8 }} /> Filters
      </button>

      <div className="shop-layout">
        <aside className={`shop-filters ${mobileFiltersOpen ? 'shop-filters-open' : ''}`}>
          <button className="shop-mobile-filter-toggle" onClick={() => setMobileFiltersOpen(false)} style={{ marginBottom: 20 }}>
            <FiX /> Close
          </button>

          <div className="filter-group">
            <h4>Category</h4>
            <label>
              <input type="radio" name="category" checked={!filters.category} onChange={() => updateFilter('category', '')} />
              All
            </label>
            {categories.map((c) => (
              <label key={c._id}>
                <input type="radio" name="category" checked={filters.category === c._id} onChange={() => updateFilter('category', c._id)} />
                {c.name}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Size</h4>
            <div className="filter-sizes">
              {SIZES.map((s) => (
                <button key={s} className={`filter-size-btn ${filters.size === s ? 'selected' : ''}`} onClick={() => updateFilter('size', filters.size === s ? '' : s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Color</h4>
            <div className="filter-swatches">
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`filter-swatch ${filters.color === c ? 'selected' : ''}`}
                  style={{ background: c.toLowerCase().replace(' ', '') }}
                  title={c}
                  onClick={() => updateFilter('color', filters.color === c ? '' : c)}
                />
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-range-inputs">
              <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} />
              <span>–</span>
              <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} />
            </div>
          </div>

          <button className="filter-clear" onClick={clearFilters}>Clear All Filters</button>
        </aside>

        <div>
          <div className="shop-toolbar">
            <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>{total} products</span>
            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}

          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} className={filters.page === i + 1 ? 'active' : ''} onClick={() => updateFilter('page', i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
