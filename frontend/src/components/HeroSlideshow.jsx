import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import { HERO_SLIDES } from '../data/heroSlides.jsx';
import './HeroSlideshow.css';

const AUTOPLAY_MS = 6000;

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (paused || prefersReducedMotion) return undefined;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, prefersReducedMotion]);

  const slide = HERO_SLIDES[active];

  return (
    <section
      className="showcase-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {HERO_SLIDES.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt=""
          className={`showcase-hero__slide${i === active ? ' is-active' : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <div className="scroll-cue">Scroll from night to day</div>

      <div className="container showcase-hero__content">
        <div className="showcase-hero__row">
          <h1>{slide.headline}</h1>
          <div className="showcase-hero__meta">
            <p>{slide.body}</p>
            <div className="showcase-hero__actions">
              <Link to="/products" className="btn btn--gold">Browse Products</Link>
              <WhatsAppButton
                className="btn btn--outline-light"
                message="Hi Mood Foam, I'd like to ask about your mattresses."
              >
                Chat on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </div>

      <div className="showcase-hero__dots">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.image}
            className={`showcase-hero__dot${i === active ? ' is-active' : ''}`}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  );
}
