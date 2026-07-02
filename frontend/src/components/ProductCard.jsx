import { Link } from 'react-router-dom';
import { imageUrl } from '../api';
import './cards.css';

export default function ProductCard({ product }) {
  const cover = product.images?.[0];
  return (
    <Link to={`/product/${product.slug}`} className="pcard">
      <div className="pcard__media">
        {cover ? (
          <img src={imageUrl(cover)} alt={product.name} loading="lazy" />
        ) : (
          <div className="pcard__placeholder" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M2 17v2M22 17v2" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
        )}
        {product.is_featured && <span className="pcard__badge">Popular</span>}
      </div>
      <div className="pcard__body">
        <h3 className="pcard__title">{product.name}</h3>
        <p className="pcard__desc">{product.short_description}</p>
        <span className="pcard__link">View details &rarr;</span>
      </div>
    </Link>
  );
}
