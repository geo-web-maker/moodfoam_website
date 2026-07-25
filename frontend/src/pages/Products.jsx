import { useEffect, useState } from 'react';
import { getCategories } from '../api';
import MattressCard from '../components/mattress/MattressCard';
import './Products.css';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">Full range</span>
          <h1>Every mattress we manufacture</h1>
          <p>Every mattress, bed, sofa and finishing product we manufacture, grouped by type.</p>
        </div>
      </section>

      <section className="block products-intro">
        <div className="container">
          {loading ? (
            <p className="state-message">Loading categories&hellip;</p>
          ) : categories.length === 0 ? (
            <p className="state-message">Categories will appear here once they&rsquo;re added from the admin dashboard.</p>
          ) : (
            <div className="card-grid">
              {categories.map((c) => (
                <MattressCard
                  key={c.slug}
                  name={c.name}
                  description={`${c.product_count} option${c.product_count === 1 ? '' : 's'}`}
                  linkTo={`/products/${c.slug}`}
                  linkLabel="Browse this category &rarr;"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
