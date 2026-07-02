import { Link } from 'react-router-dom';
import './cards.css';

export default function CategoryCard({ category, cover }) {
  return (
    <Link to={`/products/${category.slug}`} className="ccard">
      <div className="ccard__media">
        {cover ? (
          <img src={cover} alt={category.name} loading="lazy" />
        ) : (
          <div className="ccard__placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="ccard__body">
        <h3>{category.name}</h3>
        <span className="ccard__count">{category.product_count} option{category.product_count === 1 ? '' : 's'}</span>
      </div>
    </Link>
  );
}
