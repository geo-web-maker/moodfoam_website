import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, imageUrl } from '../api';
import MattressCard from '../components/mattress/MattressCard';
import NightDayPanel from '../components/mattress/NightDayPanel';
import CtaBand from '../components/mattress/CtaBand';
import HeroSlideshow from '../components/HeroSlideshow';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: true })
      .then(setFeatured)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSlideshow />

      <NightDayPanel />

      <section className="block" id="walk">
        <div className="container">
          <div className="block-head">
            <div>
              <span className="eyebrow">Walk the range</span>
              <h2>Five mattresses, one showroom</h2>
            </div>
            <p>Drag across to browse the way you would in person -- mattress by mattress, firmness by firmness.</p>
          </div>
        </div>

        {loading ? (
          <p className="state-message">Loading products&hellip;</p>
        ) : featured.length === 0 ? (
          <p className="state-message">
            Featured mattresses will appear here once products are marked featured from the admin
            dashboard.
          </p>
        ) : (
          <div className="rooms">
            {featured.map((p) => (
              <MattressCard
                key={p.slug}
                name={p.name}
                image={p.images?.[0] ? imageUrl(p.images[0]) : undefined}
                imageAlt={p.name}
                tag={p.category_name}
                description={p.short_description}
                price={p.price}
                firmnessPercent={p.firmness_percent}
                linkTo={`/product/${p.slug}`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="materials" id="materials">
        <div className="container materials__grid">
          <div>
            <span className="eyebrow eyebrow--gold">Under the cover</span>
            <h2>What&rsquo;s actually <em>inside</em> the mattress</h2>
            <p>No filler language -- here&rsquo;s exactly what&rsquo;s between you and a bad night&rsquo;s sleep, layer by layer.</p>
            <div className="materials__list">
              <div className="row"><span>Cover fabric</span><span>Quilted knit</span></div>
              <div className="row"><span>Comfort layer</span><span>High-density foam</span></div>
              <div className="row"><span>Support core</span><span>Foam block / pocket spring</span></div>
              <div className="row"><span>Edge reinforcement</span><span>Firm foam border</span></div>
              <div className="row"><span>Base</span><span>Woven backing fabric</span></div>
            </div>
          </div>
          <div className="materials__frame">
            <img src="/hero-2.jpg" alt="Cover quilting detail" />
          </div>
        </div>
      </section>

      <section className="block" id="hospitality">
        <div className="container">
          <div className="hospitality__card">
            <div className="hospitality__ph">
              <img src="/hero-4.jpg" alt="Guesthouse Standard mattresses fitted in a bedroom" />
            </div>
            <div className="hospitality__body">
              <span className="eyebrow">For hotels &amp; guest houses</span>
              <h2>Need mattresses for more than one room?</h2>
              <p>We supply hotel and guest house owners directly -- one contact, one delivery schedule, the same firmness and quality on every mattress in the order.</p>
              <ul>
                <li>Site visit and sizing before quoting</li>
                <li>Consistent firmness across every unit</li>
                <li>Staggered delivery for phased refits</li>
              </ul>
              <Link to="/contact" className="btn btn--outline">Talk to us about a bulk mattress order</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="block block--tight home-visit">
        <div className="container">
          <CtaBand
            heading="The showroom is open -- come lie down on every mattress in the range."
            ctaLabel="Get directions to Mityana"
            linkTo="/showroom"
          />
        </div>
      </section>
    </>
  );
}
