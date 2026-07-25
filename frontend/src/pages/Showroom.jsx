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
    <>
      <section className="page-head page-head--ink">
        <div className="container">
          <span className="eyebrow eyebrow--gold">Mood Foam Showroom</span>
          <h1>Come lie down on all of them.</h1>
          <p>Photos are one thing -- the only way to really choose a mattress is to feel it. Our showroom in Mityana is open six days a week, no appointment needed.</p>
        </div>
      </section>

      <section className="block showroom-gallery">
        <div className="container">
          <span className="mono-tag" style={{ color: 'var(--text-on-ink-muted)' }}>The floor, in photos</span>

          {loading ? (
            <p className="state-message" style={{ color: 'var(--text-on-ink-muted)' }}>Loading gallery&hellip;</p>
          ) : photos.length === 0 ? (
            <p className="state-message" style={{ color: 'var(--text-on-ink-muted)' }}>
              Showroom photos will appear here once products have images uploaded from the admin
              dashboard.
            </p>
          ) : (
            <div className="mosaic">
              {photos.map((photo, i) => (
                <Link
                  key={`${photo.slug}-${i}`}
                  to={`/product/${photo.slug}`}
                  style={{ display: 'block' }}
                >
                  <figure className={i % 3 === 0 ? 'tall' : undefined}>
                    <img src={photo.src} alt={photo.name} loading="lazy" />
                    <figcaption>{photo.name}</figcaption>
                  </figure>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="container">
          <div className="block-head">
            <div>
              <span className="eyebrow">Plan a visit</span>
              <h2>Nalugazi LC, Naama Central, Mityana</h2>
            </div>
            <p>About an hour and a half from Kampala by road. Bulk and hospitality buyers are welcome to book a site-fit walkthrough.</p>
          </div>

          <div className="visit-info">
            <div className="visit-info__card">
              <div className="row"><span>Address</span><span>Nalugazi LC, Naama Central,<br />Mityana District, Uganda</span></div>
              <div className="row"><span>Open</span><span>Mon&ndash;Sat, 8:30am&ndash;6:00pm</span></div>
              <div className="row"><span>Call / WhatsApp</span><span>0743 053096</span></div>
              <div className="row"><span>Alt. phone</span><span>0764 573341</span></div>
              <div className="row"><span>Email</span><span>busujjuindustries@gmail.com</span></div>
              <div className="row"><span>Bulk visits</span><span>Book ahead via WhatsApp</span></div>
              <WhatsAppButton
                className="btn btn--gold btn--block"
                message="Hi Mood Foam, I'd like to visit the showroom."
              >
                Plan your visit on WhatsApp
              </WhatsAppButton>
            </div>
            <div className="visit-map">
              <iframe
                title="Mood Foam Mattresses location"
                src="https://www.google.com/maps?q=Busujju+Industries+Ltd-Mood+Foam+Mattresses,0.4156404,31.986321&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
