import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getCategory, getProducts } from '../api';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    Promise.all([getCategory(slug), getProducts({ category: slug })])
      .then(([cat, prods]) => {
        setCategory(cat);
        setProducts(prods);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/products" replace />;

  // If a category only ever has a single product (the common case for the
  // mattress lines), skip straight to the product template page.
  if (!loading && products.length === 1) {
    return <Navigate to={`/product/${products[0].slug}`} replace />;
  }

  return (
    <section className="section">
      <div className="container">
        <Link to="/products" className="breadcrumb">&larr; All Products</Link>
        {loading ? (
          <p className="state-message">Loading&hellip;</p>
        ) : (
          <>
            <div className="section-head">
              <span className="eyebrow">{category?.name}</span>
              <h1>{category?.name}</h1>
              <p>{category?.description}</p>
            </div>
            {products.length === 0 ? (
              <p className="state-message">
                No products have been added to this category yet -- check back soon.
              </p>
            ) : (
              <div className="grid grid--cards">
                {products.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
