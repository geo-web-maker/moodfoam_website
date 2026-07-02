import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../api';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import WaveDivider from '../components/WaveDivider';
import HeroSlideshow from '../components/HeroSlideshow';
import WhatsAppButton from '../components/WhatsAppButton';
import './Home.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getProducts({ featured: true })])
      .then(([cats, prods]) => {
        setCategories(cats);
        setFeatured(prods);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
       <div className="container">
        <HeroSlideshow />
       </div>
      </section>
      <WaveDivider from="var(--ink)" to="var(--bg)" />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What We Make</span>
            <h2>One factory. Every sleep and seating need.</h2>
          </div>
          {loading ? (
            <p className="state-message">Loading products&hellip;</p>
          ) : (
            <div className="grid grid--cards">
              {categories.slice(0, 8).map((c) => (
                <CategoryCard key={c.slug} category={c} />
              ))}
            </div>
          )}
          <div className="home__more">
            <Link to="/products" className="btn btn--outline">See All Categories</Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Customer Favourites</span>
              <h2>Popular right now</h2>
            </div>
            <div className="grid grid--cards">
              {featured.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section--ink section--tight">
        <div className="container cta">
          <div>
            <span className="eyebrow eyebrow--on-ink">Ready to order?</span>
            <h2>Tell us the size and quantity -- we'll handle the rest.</h2>
          </div>
          <div className="cta__actions">
            <WhatsAppButton message="Hi Mood Foam, I'd like to place an order.">
              Order on WhatsApp
            </WhatsAppButton>
            <Link to="/contact" className="btn btn--ghost-on-ink">Other ways to reach us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
