import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getCategory, getProducts, imageUrl } from '../api';
import MattressCard from '../components/mattress/MattressCard';
import './CategoryPage.css';

const FIRMNESS_BANDS = {
  soft: (p) => p < 40,
  medium: (p) => p >= 40 && p < 70,
  firm: (p) => p >= 70,
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [firmnessFilter, setFirmnessFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setFirmnessFilter('all');
    Promise.all([getCategory(slug), getProducts({ category: slug })])
      .then(([cat, prods]) => {
        setCategory(cat);
        setProducts(prods);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Only show the firmness filter once products actually carry
  // firmness_percent -- no point showing chips that filter nothing.
  const hasFirmnessData = products.some((p) => typeof p.firmness_percent === 'number');

  const visibleProducts = useMemo(() => {
    if (!hasFirmnessData || firmnessFilter === 'all') return products;
    return products.filter((p) => FIRMNESS_BANDS[firmnessFilter]?.(p.firmness_percent));
  }, [products, firmnessFilter, hasFirmnessData]);

  if (notFound) return <Navigate to="/products" replace />;

  // If a category only ever has a single product (the common case for the
  // mattress lines), skip straight to the product template page.
  if (!loading && products.length === 1) {
    return <Navigate to={`/product/${products[0].slug}`} replace />;
  }

  return (
    <section className="category-page">
      <div className="container">
        <Link to="/products" className="breadcrumb">&larr; All Products</Link>

        {loading ? (
          <p className="state-message">Loading&hellip;</p>
        ) : (
          <>
            <div className="page-head" style={{ padding: '0 0 24px', border: 'none' }}>
              <span className="eyebrow">{category?.name}</span>
              <h1>{category?.name}</h1>
              <p>{category?.description}</p>
            </div>

            {hasFirmnessData && (
              <div className="category-page__filters">
                {['all', 'soft', 'medium', 'firm'].map((f) => (
                  <button
                    key={f}
                    className={`chip${firmnessFilter === f ? ' is-active' : ''}`}
                    onClick={() => setFirmnessFilter(f)}
                  >
                    {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <span className="category-page__count">
                  {visibleProducts.length} mattress{visibleProducts.length === 1 ? '' : 'es'}
                </span>
              </div>
            )}

            {products.length === 0 ? (
              <p className="state-message">
                No products have been added to this category yet -- check back soon.
              </p>
            ) : (
              <div className="card-grid">
                {visibleProducts.map((p) => (
                  <MattressCard
                    key={p.slug}
                    name={p.name}
                    image={p.images?.[0] ? imageUrl(p.images[0]) : undefined}
                    imageAlt={p.name}
                    tag={category?.name}
                    description={p.short_description}
                    price={p.price}
                    firmnessPercent={p.firmness_percent}
                    linkTo={`/product/${p.slug}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
