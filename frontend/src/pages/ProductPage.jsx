import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getProduct, getProducts, imageUrl } from '../api';
import WhatsAppButton from '../components/WhatsAppButton';
import MattressCard from '../components/mattress/MattressCard';
import FirmnessBar from '../components/mattress/FirmnessBar';
import MattressDiagram from '../components/mattress/MattressDiagram';
import { getPlaceholderSizePrice } from '../utils/placeholderPricing';
import './ProductPage.css';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(-1);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    setSelectedSizeIndex(-1);
    getProduct(slug)
      .then((p) => {
        setProduct(p);
        if (p.category?.slug) {
          getProducts({ category: p.category.slug })
            .then((prods) => setRelated(prods.filter((r) => r.slug !== p.slug).slice(0, 3)))
            .catch(() => setRelated([]));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/products" replace />;
  if (loading) return <p className="state-message">Loading&hellip;</p>;
  if (!product) return null;

  const images = product.images?.length ? product.images : [null];
  const sizes = product.sizes || [];
  const selectedSize = selectedSizeIndex >= 0 ? sizes[selectedSizeIndex] : null;

  // Placeholder-diagram type heuristic: no core_type field exists on the
  // backend yet, so fall back to guessing from the category name.
  const diagramType = product.category?.name?.toLowerCase().includes('spring') ? 'spring' : 'foam';

  const placeholderPrice = selectedSizeIndex >= 0
    ? getPlaceholderSizePrice(product.price, selectedSizeIndex)
    : null;

  const orderMessage = `Hi Mood Foam, I'd like to order the ${product.name}${
    selectedSize ? ` (size ${selectedSize})` : ''
  }.`;

  // Only render spec-table rows for fields that actually exist -- no
  // fabricated warranty/delivery/core facts. This table grows on its own
  // as the backend model picks up core_type / warranty_years / etc.
  const specRows = [
    product.category?.name && ['Category', product.category.name],
    product.core_type && ['Core', product.core_type],
    product.warranty_years && ['Warranty', `${product.warranty_years} years`],
  ].filter(Boolean);

  return (
    <section className="product">
      <div className="container">
        <Link to={`/products/${product.category?.slug}`} className="breadcrumb">
          &larr; {product.category?.name}
        </Link>

        <div className="product__grid">
          <div>
            <div className="gallery__main">
              {images[activeImage] ? (
                <img src={imageUrl(images[activeImage])} alt={product.name} />
              ) : (
                <div className="gallery__main-placeholder" aria-hidden="true">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M2 17v2M22 17v2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  <p>Photo coming soon</p>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={img || i}
                    className={i === activeImage ? 'is-active' : ''}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show photo ${i + 1}`}
                  >
                    <img src={imageUrl(img)} alt="" />
                  </button>
                ))}
              </div>
            )}

            <MattressDiagram type={diagramType} />
          </div>

          <div className="product__info">
            <span className="product__badge">
              {product.is_featured ? 'Popular \u00b7 ' : ''}{product.category?.name}
            </span>
            <h1>{product.name}</h1>

            {(placeholderPrice || product.price) && (
              <>
                <div className="product__price">
                  {placeholderPrice || product.price}
                  {selectedSize && <small> size {selectedSize}</small>}
                  {!selectedSize && sizes.length > 0 && <small> from</small>}
                </div>
                {placeholderPrice && (
                  <p className="product__price-note">
                    Estimated &mdash; exact price confirmed on WhatsApp before you order.
                  </p>
                )}
              </>
            )}

            <p className="product__desc">{product.description || product.short_description}</p>

            {typeof product.firmness_percent === 'number' && (
              <FirmnessBar percent={product.firmness_percent} labels={['Soft', 'Medium', 'Firm']} />
            )}

            {sizes.length > 0 && (
              <div className="size-select">
                <h3>Choose a size</h3>
                <div className="size-options">
                  {sizes.map((size, i) => (
                    <button
                      key={size}
                      className={i === selectedSizeIndex ? 'is-selected' : ''}
                      onClick={() => setSelectedSizeIndex((s) => (s === i ? -1 : i))}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="size-hint">Sizes shown in feet (length x width x height).</p>
              </div>
            )}

            {specRows.length > 0 && (
              <table className="spec-table">
                <tbody>
                  {specRows.map(([label, value]) => (
                    <tr key={label}><th>{label}</th><td>{value}</td></tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="product__actions">
              <WhatsAppButton message={orderMessage}>Order on WhatsApp</WhatsAppButton>
              <Link to="/contact" className="btn btn--outline">Ask a question first</Link>
            </div>
            <p className="product__note">
              Prices depend on size and finish -- message or call us for a quote.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container related block block--tight" style={{ borderBottom: 'none' }}>
          <div className="block-head">
            <div>
              <span className="eyebrow">You might also like</span>
              <h2>More from {product.category?.name}</h2>
            </div>
          </div>
          <div className="card-grid">
            {related.map((p) => (
              <MattressCard
                key={p.slug}
                name={p.name}
                image={p.images?.[0] ? imageUrl(p.images[0]) : undefined}
                imageAlt={p.name}
                tag={product.category?.name}
                description={p.short_description}
                price={p.price}
                firmnessPercent={p.firmness_percent}
                linkTo={`/product/${p.slug}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
