import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getProduct, imageUrl } from '../api';
import WhatsAppButton from '../components/WhatsAppButton';
import './ProductPage.css';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    setSelectedSize('');
    getProduct(slug)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/products" replace />;
  if (loading) return <p className="state-message">Loading&hellip;</p>;
  if (!product) return null;

  const images = product.images?.length ? product.images : [null];
  const orderMessage = `Hi Mood Foam, I'd like to order the ${product.name}${
    selectedSize ? ` (size ${selectedSize})` : ''
  }.`;

  return (
    <section className="section product">
      <div className="container">
        <Link to={`/products/${product.category?.slug}`} className="breadcrumb">
          &larr; {product.category?.name}
        </Link>

        <div className="product__grid">
          <div className="product__gallery">
            <div className="product__gallery-main">
              {images[activeImage] ? (
                <img src={imageUrl(images[activeImage])} alt={product.name} />
              ) : (
                <div className="product__gallery-placeholder" aria-hidden="true">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M2 17v2M22 17v2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  <p>Photo coming soon</p>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="product__thumbs">
                {images.map((img, i) => (
                  <button
                    key={img || i}
                    className={`product__thumb ${i === activeImage ? 'is-active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show photo ${i + 1}`}
                  >
                    <img src={imageUrl(img)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product__info">
            {product.is_featured && <span className="badge">Popular</span>}
            <h1>{product.name}</h1>
            <p className="product__desc">{product.description || product.short_description}</p>

            {product.sizes?.length > 0 && (
              <div className="product__sizes">
                <h3>Choose a size</h3>
                <div className="product__size-grid">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`product__size ${selectedSize === size ? 'is-active' : ''}`}
                      onClick={() => setSelectedSize((s) => (s === size ? '' : size))}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="product__size-hint">Sizes shown in feet (length x width x height).</p>
              </div>
            )}

            {product.price && <p className="product__price">{product.price}</p>}

            <div className="product__actions">
              <WhatsAppButton message={orderMessage}>Order on WhatsApp</WhatsAppButton>
              <a href="tel:+256743053096" className="btn btn--outline">Call to Order</a>
            </div>
            <p className="product__note">
              Prices depend on size and finish -- message or call us for a quote.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
