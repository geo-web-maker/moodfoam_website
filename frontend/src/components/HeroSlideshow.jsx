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
    <div
      className="hero__grid"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div>
        <span className="eyebrow eyebrow--on-ink">{slide.eyebrow}</span>
        <h1>{slide.headline}</h1>
        <p className="hero__lede">{slide.body}</p>
        <div className="hero__actions">
          <Link to="/products" className="btn btn--coral">Browse Products</Link>
          <WhatsAppButton
            className="btn btn--ghost-on-ink"
            message="Hi Mood Foam, I'd like to ask about your mattresses."
          >
            Chat on WhatsApp
          </WhatsAppButton>
        </div>
      </div>

      <div className="hero-slideshow">
        <div className="hero-slideshow__frame">
          {HERO_SLIDES.map((s, i) => (
            <img
              key={s.image}
              src={s.image}
              alt=""
              className={`hero-slideshow__img hero-slideshow__img--${s.fit} ${
                i === active ? 'is-active' : ''
              }`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
