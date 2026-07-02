import { useEffect, useState } from 'react';
import { getCategories } from '../api';
import CategoryCard from '../components/CategoryCard';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Full Range</span>
          <h1>Products</h1>
          <p>Every mattress, bed, sofa and finishing product we manufacture, grouped by type.</p>
        </div>
        {loading ? (
          <p className="state-message">Loading categories&hellip;</p>
        ) : (
          <div className="grid grid--cards">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
