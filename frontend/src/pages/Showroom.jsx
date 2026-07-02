import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, imageUrl } from '../api';
import WhatsAppButton from '../components/WhatsAppButton';
import './Showroom.css';

export default function Showroom() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((products) => {
        const all = products.flatMap((p) =>
          (p.images || []).map((img) => ({ src: imageUrl(img), name: p.name, slug: p.slug }))
        );
        setPhotos(all);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section showroom">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow">Mood Foam Showroom</span>
          <h1>Experience unrivaled comfort</h1>
          <p>
            Browse real photos from our range. Every image here updates automatically as new
            products go up -- no page rebuilds needed.
          </p>
          <WhatsAppButton message="Hi Mood Foam, I'd like to visit the showroom.">
            Plan a Visit
          </WhatsAppButton>
        </div>

        {loading ? (
          <p className="state-message">Loading gallery&hellip;</p>
        ) : photos.length === 0 ? (
          <p className="state-message">
            Showroom photos will appear here once products have images uploaded from the admin
            dashboard.
          </p>
        ) : (
          <div className="showroom__grid">
            {photos.map((photo, i) => (
              <Link key={i} to={`/product/${photo.slug}`} className="showroom__item">
                <img src={photo.src} alt={photo.name} loading="lazy" />
                <span>{photo.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
